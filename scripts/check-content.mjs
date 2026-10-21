#!/usr/bin/env node
/**
 * 内容一致性检查：补充 Zod schema（构建时类型校验）之外的跨字段 / 跨文件规则。
 *
 * 检查内容：
 * - 必填字段、枚举值、日期格式、未知字段（与 schema 字段清单对照，避免旧字段被静默丢弃）；
 * - 内容状态字段组合（reviewedBy / basis / testedOn / contributors，见 docs/CONTENT-REVIEW.md）；
 * - 跨文件唯一性（指南 order 全局唯一、术语同分类 order 唯一、作品 order 唯一）；
 * - 引用完整性（指南/作品的 tools 必须在工具目录中、术语 related 必须存在）；
 * - 来源 URL 格式、分类与文件命名。
 *
 * 设计目标：新增合法条目不会因为旧样本计数而报错；错误条目能给出可读的文件名与原因。
 * 该模块同时作为库导入，供 tests/site.test.mjs 在 fixture 目录上重复验证。
 */
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const isoDateRe = /^\d{4}-\d{2}-\d{2}$/;
const slugFileRe = /^[a-z0-9][a-z0-9-]*\.md$/;

/** 指南 / 作品 / 术语共用的内容状态字段，定义见 docs/CONTENT-REVIEW.md。 */
const REVIEW_FIELDS = [
  'reviewed',
  'reviewedBy',
  'needsUpdate',
  'reviewNote',
  'basis',
  'aiUsage',
  'testedOn',
  'testedEnvironment',
  'contributors',
];

/**
 * 已知字段清单「必须与 src/content.config.ts 的 schema 保持一致」。
 *
 * 为什么还要单独列一遍：Zod 默认会剥掉 schema 里没声明的字段而不报错，
 * 所以从 schema 删除的字段（例如已废弃的 duration）写回来时构建照样通过，
 * 数据却被静默丢弃。这里显式列出允许的字段，写错字段名或用旧字段会在
 * npm run check:content 直接失败。
 */
const CONTENT_TYPES = {
  guide: {
    required: ['title', 'summary', 'stage', 'order', 'outcome', 'forWho', 'updated'],
    known: [
      'title',
      'summary',
      'stage',
      'order',
      'level',
      'outcome',
      'forWho',
      'updated',
      'sources',
      'tools',
      'tags',
      ...REVIEW_FIELDS,
    ],
    stages: ['start', 'make', 'share'],
  },
  works: {
    required: ['title', 'summary', 'category', 'format', 'prompt', 'effort', 'order', 'updated'],
    known: [
      'title',
      'summary',
      'category',
      'format',
      'tools',
      'tags',
      'prompt',
      'effort',
      'level',
      'order',
      'updated',
      'status',
      ...REVIEW_FIELDS,
    ],
    categories: ['校园生活', '学习效率', '创意表达', '跨专业实验'],
    statuses: ['example', 'community'],
  },
  glossary: {
    required: ['term', 'en', 'category', 'definition', 'example', 'order', 'updated'],
    known: [
      'term',
      'en',
      'category',
      'aliases',
      'definition',
      'example',
      'order',
      'related',
      'updated',
      'sources',
      ...REVIEW_FIELDS,
    ],
  },
};

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error('缺少 frontmatter（文件应以 --- 包裹的 YAML 开头）');
  // 用 JSON_SCHEMA 解析：日期保持字符串，避免 YAML 把 2026-10-20 解析成 Date 对象。
  const data = yaml.load(match[1], { schema: yaml.JSON_SCHEMA });
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('frontmatter 必须是一个对象');
  }
  return data;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function checkDateString(data, key, file, errors, { required = false } = {}) {
  const value = data[key];
  if (value === undefined) {
    if (required) errors.push({ file, message: `缺少必填字段 ${key}` });
    return;
  }
  if (!isNonEmptyString(value) || !isoDateRe.test(value)) {
    errors.push({ file, message: `${key} 必须是 YYYY-MM-DD 格式的字符串（当前：${String(value)}）` });
  }
}

function checkStringArray(data, key, file, errors) {
  const value = data[key];
  if (value === undefined) return;
  if (!Array.isArray(value) || value.some((item) => !isNonEmptyString(item))) {
    errors.push({ file, message: `${key} 必须是字符串数组` });
  }
}

function checkSources(data, file, errors) {
  const sources = data.sources;
  if (sources === undefined) return;
  if (!Array.isArray(sources)) {
    errors.push({ file, message: 'sources 必须是数组' });
    return;
  }
  for (const [index, source] of sources.entries()) {
    if (!source || typeof source !== 'object') {
      errors.push({ file, message: `sources[${index}] 必须是包含 title 与 url 的对象` });
      continue;
    }
    if (!isNonEmptyString(source.title)) {
      errors.push({ file, message: `sources[${index}].title 不能为空` });
    }
    if (!isNonEmptyString(source.url)) {
      errors.push({ file, message: `sources[${index}].url 不能为空` });
      continue;
    }
    try {
      const url = new URL(source.url);
      if (!/^https?:$/.test(url.protocol)) throw new Error('仅支持 http / https');
    } catch {
      errors.push({ file, message: `sources[${index}].url 不是可打开的 http(s) 链接：${source.url}` });
    }
  }
}

/** 内容状态字段的组合校验（与 docs/CONTENT-REVIEW.md 第 3 节一致）。 */
function checkReviewFields(data, file, errors) {
  if (data.reviewedBy !== undefined) {
    if (!isNonEmptyString(data.reviewedBy)) {
      errors.push({ file, message: 'reviewedBy 必须是非空字符串（可用笔名）' });
    }
    if (!data.reviewed) {
      errors.push({ file, message: '填写 reviewedBy 时必须同时填写 reviewed（人工审校日期）' });
    }
  }

  checkDateString(data, 'reviewed', file, errors);
  checkDateString(data, 'testedOn', file, errors);

  if (data.needsUpdate !== undefined && typeof data.needsUpdate !== 'boolean') {
    errors.push({ file, message: 'needsUpdate 必须是布尔值 true / false' });
  }
  if (data.reviewNote !== undefined) {
    if (!isNonEmptyString(data.reviewNote)) errors.push({ file, message: 'reviewNote 不能为空' });
    else if (data.reviewNote.length > 200) errors.push({ file, message: 'reviewNote 不能超过 200 字' });
  }

  if (data.basis !== undefined && !['first-hand', 'desk-research', 'teaching-example'].includes(data.basis)) {
    errors.push({ file, message: `basis 只能是 first-hand / desk-research / teaching-example（当前：${data.basis}）` });
  }
  if (data.aiUsage !== undefined && !['none', 'assisted', 'drafted'].includes(data.aiUsage)) {
    errors.push({ file, message: `aiUsage 只能是 none / assisted / drafted（当前：${data.aiUsage}）` });
  }

  if (data.basis === 'first-hand') {
    if (!data.testedOn) errors.push({ file, message: 'basis 为 first-hand（真实使用经验）时必须填写 testedOn（亲测日期）' });
    if (!isNonEmptyString(data.testedEnvironment)) {
      errors.push({ file, message: 'basis 为 first-hand（真实使用经验）时必须填写 testedEnvironment（亲测环境）' });
    }
  } else if (data.testedOn !== undefined || data.testedEnvironment !== undefined) {
    errors.push({ file, message: '只有 basis 为 first-hand 的内容才允许填写 testedOn / testedEnvironment' });
  }

  if (data.contributors !== undefined) {
    checkStringArray(data, 'contributors', file, errors);
    if (Array.isArray(data.contributors)) {
      if (data.contributors.length > 5) errors.push({ file, message: 'contributors 最多 5 个代称' });
      if (new Set(data.contributors).size !== data.contributors.length) {
        errors.push({ file, message: 'contributors 中有重复的贡献者' });
      }
    }
  }
}

function checkCommonFields(data, file, errors) {
  checkDateString(data, 'updated', file, errors, { required: true });
  checkReviewFields(data, file, errors);
  checkSources(data, file, errors);
  checkStringArray(data, 'tools', file, errors);
  checkStringArray(data, 'tags', file, errors);
  checkStringArray(data, 'aliases', file, errors);
  checkStringArray(data, 'related', file, errors);
}

function checkPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

function loadToolNamesFromSource(source) {
  const start = source.indexOf('export const tools');
  if (start === -1) return [];
  const block = source.slice(start);
  return [...block.matchAll(/id: '([^']+)',\s*\n\s*name: '([^']+)'/g)].map((match) => match[2]);
}

function loadGlossaryCategoryIdsFromSource(source) {
  const start = source.indexOf('export const glossaryCategories');
  if (start === -1) return [];
  const block = source.slice(start);
  return [...block.matchAll(/id: '([^']+)'/g)].map((match) => match[1]);
}

/** 读取跨集合引用所需的上下文（工具名、术语分类）。 */
export async function loadContentContext(root) {
  const toolsSource = await readFile(path.join(root, 'src', 'data', 'tools.ts'), 'utf8');
  const glossarySource = await readFile(path.join(root, 'src', 'data', 'glossary.ts'), 'utf8');
  const toolNames = loadToolNamesFromSource(toolsSource);
  const glossaryCategoryIds = loadGlossaryCategoryIdsFromSource(glossarySource);
  if (toolNames.length === 0) throw new Error('无法解析 src/data/tools.ts 中的工具列表');
  if (glossaryCategoryIds.length === 0) throw new Error('无法解析 src/data/glossary.ts 中的术语分类');
  return { toolNames, glossaryCategoryIds };
}

/**
 * 校验一个内容目录。
 * @returns {Promise<{ errors: {file: string, message: string}[], count: number }>}
 */
export async function validateCollection({ collection, dir, context }) {
  const errors = [];
  const label = (file) => collection + '/' + file;

  if (!CONTENT_TYPES[collection]) {
    return { errors: [{ file: collection, message: '未知内容集合：' + collection }], count: 0 };
  }
  if (!existsSync(dir)) {
    return { errors: [{ file: collection, message: '内容目录不存在：' + dir }], count: 0 };
  }

  // 以 _ 开头的文件是写作模板（如 _TEMPLATE.md），不参与构建，也不参与检查。
  const files = (await readdir(dir))
    .filter((file) => file.endsWith('.md') && !file.startsWith('_'))
    .sort();
  const rows = [];

  for (const file of files) {
    if (!slugFileRe.test(file)) {
      errors.push({ file: label(file), message: '文件名只能使用小写字母、数字和连字符（例如 01-first-guide.md）' });
    }

    const raw = await readFile(path.join(dir, file), 'utf8');
    let data;
    try {
      data = parseFrontmatter(raw);
    } catch (error) {
      errors.push({ file: label(file), message: error.message });
      continue;
    }
    rows.push({ file, data });

    for (const key of CONTENT_TYPES[collection].required) {
      if (!(key in data)) errors.push({ file: label(file), message: '缺少必填字段 ' + key });
    }

    // 未知字段：避免「schema 已删除的字段」被 Zod 静默丢弃（例如旧的 duration）。
    const knownFields = CONTENT_TYPES[collection].known;
    for (const key of Object.keys(data)) {
      if (!knownFields.includes(key)) {
        errors.push({
          file: label(file),
          message: `未知字段 ${key}：schema 中没有这个字段（字段名写错，或使用了已废弃字段；允许的字段见 src/content.config.ts）`,
        });
      }
    }

    checkCommonFields(data, label(file), errors);

    if (collection === 'guide') {
      if (data.stage !== undefined && !CONTENT_TYPES.guide.stages.includes(data.stage)) {
        errors.push({ file: label(file), message: `stage 只能是 start / make / share（当前：${data.stage}）` });
      }
      if (!checkPositiveInteger(data.order)) {
        errors.push({ file: label(file), message: 'order 必须是大于 0 的整数' });
      }
      if (Array.isArray(data.tools)) {
        for (const tool of data.tools) {
          if (!context.toolNames.includes(tool)) {
            errors.push({ file: label(file), message: `tools 引用了工具目录中不存在的工具：${tool}` });
          }
        }
      }
    }

    if (collection === 'works') {
      if (data.category !== undefined && !CONTENT_TYPES.works.categories.includes(data.category)) {
        errors.push({ file: label(file), message: `category 不合法（当前：${data.category}）` });
      }
      if (data.status !== undefined && !CONTENT_TYPES.works.statuses.includes(data.status)) {
        errors.push({ file: label(file), message: `status 只能是 example / community（当前：${data.status}）` });
      }
      if (!checkPositiveInteger(data.order)) {
        errors.push({ file: label(file), message: 'order 必须是大于 0 的整数' });
      }
      if (Array.isArray(data.tools)) {
        for (const tool of data.tools) {
          if (!context.toolNames.includes(tool)) {
            errors.push({ file: label(file), message: `tools 引用了工具目录中不存在的工具：${tool}` });
          }
        }
      }
    }

    if (collection === 'glossary') {
      if (data.category !== undefined && !context.glossaryCategoryIds.includes(data.category)) {
        errors.push({ file: label(file), message: `category 不在术语分类中（当前：${data.category}）` });
      }
      if (!checkPositiveInteger(data.order)) {
        errors.push({ file: label(file), message: 'order 必须是大于 0 的整数' });
      }
    }
  }

  // 跨文件唯一性 / 引用完整性
  const seen = new Map();
  for (const { file, data } of rows) {
    if (!checkPositiveInteger(data.order)) continue;
    let key;
    if (collection === 'guide') key = 'stage:' + data.stage;
    else if (collection === 'glossary') key = 'category:' + data.category;
    else key = 'works';
    const composed = key + '#' + data.order;
    if (seen.has(composed)) {
      errors.push({
        file: label(file),
        message: `order ${data.order} 与 ${seen.get(composed)} 重复（${key}）`,
      });
    } else {
      seen.set(composed, label(file));
    }
  }

  if (collection === 'glossary') {
    const ids = new Set(files.map((file) => file.replace(/\.md$/, '')));
    for (const { file, data } of rows) {
      if (!Array.isArray(data.related)) continue;
      for (const related of data.related) {
        if (!ids.has(related)) {
          errors.push({ file: label(file), message: `related 引用了不存在的术语：${related}` });
        } else if (related === file.replace(/\.md$/, '')) {
          errors.push({ file: label(file), message: 'related 不能引用自己' });
        }
      }
    }
  }

  return { errors, count: files.length };
}

/** 校验 src/content 下的全部内容集合。 */
export async function validateContentRoot(root) {
  const context = await loadContentContext(root);
  const results = [];
  let total = 0;
  for (const collection of Object.keys(CONTENT_TYPES)) {
    const result = await validateCollection({
      collection,
      dir: path.join(root, 'src', 'content', collection),
      context,
    });
    results.push(...result.errors);
    total += result.count;
  }
  return { errors: results, count: total };
}

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const { errors, count } = await validateContentRoot(root);
  if (errors.length > 0) {
    console.error(`内容一致性检查失败：${errors.length} 个问题（共检查 ${count} 个文件）`);
    for (const error of errors) console.error(`- ${error.file}  ${error.message}`);
    process.exit(1);
  }
  console.log(`内容一致性检查通过：${count} 个内容文件（guide / works / glossary）未发现问题。`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => {
    console.error('内容一致性检查崩溃：', error);
    process.exit(1);
  });
}
