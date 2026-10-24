#!/usr/bin/env node
/**
 * 内容一致性检查：补充 Zod schema（构建时类型校验）之外的跨字段 / 跨文件规则。
 *
 * 检查内容：
 * - 必填字段、枚举值、日期格式、未知字段（与 schema 字段清单对照，避免旧字段被静默丢弃）；
 * - 内容状态字段组合（reviewedBy / basis / testedOn / contributors，见 docs/CONTENT-REVIEW.md）；
 * - 跨文件唯一性（指南 order 全局唯一、术语同分类 order 唯一、作品 order 唯一）；
 * - 引用完整性（指南/作品的 tools 必须在工具目录中、术语 related 必须存在）；
 * - 指南目录覆盖率（文章必须登记在 src/data/guide-nav.ts，否则侧边栏看不到）；
 * - 外链协议白名单（只允许 http(s)，拦 javascript: / data: / file: 等，见 #22）；
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
import { isSafeExternalUrl } from '../src/lib/url-guard.mjs';

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
      'youMaySay',
      'scenario',
      'quiz',
      'agentPrompt',
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
    // 协议白名单（#22）：javascript: / data: / file: 等「语法合法但危险」的地址必须拦下
    if (!isSafeExternalUrl(source.url)) {
      errors.push({
        file,
        message: `sources[${index}].url 只允许 http(s) 外链（拒绝 javascript: / data: / file: 等危险协议）：${source.url}`,
      });
    }
  }
}

/** 内容状态字段的组合校验（与 docs/CONTENT-REVIEW.md 第 3 节一致）。 */
export function checkReviewFields(data, file, errors) {
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

/**
 * 从 src/data/tools.ts 解析工具条目（纯函数，便于测试）。
 *
 * 为什么不用一条正则匹配 id/name：工具条目字段多，维护者可能调整字段顺序，
 * 旧写法「id 与 name 必须相邻」会在不知不觉中解析失败，让检查与测试静默通过。
 * 这里先按顶层对象切块，再逐行读取字段，字段顺序无关；缺字段由 validateTools 报错。
 */
export function parseToolsFromSource(source) {
  const start = source.indexOf('export const tools');
  if (start === -1) return [];
  const block = source.slice(start);
  const end = block.indexOf('\n];');
  const body = end === -1 ? block : block.slice(0, end);
  const chunks = body.split(/^\s{2}\{\s*$/m).slice(1);

  return chunks
    .map((chunk) => {
      const obj = chunk.split(/^\s{2}\},?\s*$/m)[0] ?? '';
      const lines = obj
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      const readString = (key) => {
        const line = lines.find((item) => item.startsWith(key + ': '));
        if (!line) return undefined;
        const match = line.match(/^[\w-]+: '(.*)',$/);
        return match ? match[1] : undefined;
      };
      const readArray = (key) => {
        const line = lines.find((item) => item.startsWith(key + ': ['));
        if (!line) return [];
        const inner = line.slice(line.indexOf('[') + 1, line.lastIndexOf(']'));
        return inner
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
          .map((item) => item.replace(/^'|'$/g, ''));
      };
      const logoLine = lines.find((item) => item.startsWith('src: '));
      const logoMatch = logoLine ? logoLine.match(/^src: '(.*)',$/) : null;
      return {
        id: readString('id'),
        name: readString('name'),
        category: readString('category'),
        catalogGroup: readString('catalogGroup'),
        aigcSection: readString('aigcSection'),
        alsoIn: readArray('alsoIn'),
        capabilities: readArray('capabilities'),
        aliases: readArray('aliases'),
        url: readString('url'),
        githubUrl: readString('githubUrl'),
        kind: readString('kind'),
        tier: readString('tier'),
        basis: readString('basis'),
        verifiedOn: readString('verifiedOn'),
        logo: logoMatch ? logoMatch[1] : undefined,
      };
    })
    .filter((tool) => tool.id || tool.name);
}

/** 解析工具分类 id（只取 toolCategories 数组，避免把能力标签与工具 id 混进来）。 */
export function parseToolCategoryIds(source) {
  const start = source.indexOf('export const toolCategories');
  if (start === -1) return [];
  const end = source.indexOf('export const toolCapabilities');
  const block = source.slice(start, end === -1 ? undefined : end);
  return [...block.matchAll(/id: '([^']+)'/g)].map((match) => match[1]);
}

/** 工具条目的字段级校验：枚举、唯一性、引用完整性、图标文件是否存在。 */
export function validateTools({ source, root, toolNames = [] } = {}) {
  const errors = [];
  const file = 'src/data/tools.ts';
  const push = (message) => errors.push({ file, message });

  if (!source.includes('export const tools')) {
    push('无法定位 tools 数组，请确认文件结构未被破坏');
    return { errors, tools: [] };
  }

  const categories = parseToolCategoryIds(source);
  if (categories.length === 0) push('无法解析工具分类（toolCategories），页面筛选会失效');

  const tools = parseToolsFromSource(source);
  const kinds = ['在线产品', '开源项目', '工作流工具', '开发工具', '资源社区', '开发平台'];
  const tiers = ['主流产品', '社区热门', '小众探索'];
  const bases = ['official', 'docs', 'community'];
  const caps = ['open-source', 'local', 'beginner', 'zh'];

  const seenIds = new Set();
  const seenNames = new Set();

  for (const tool of tools) {
    const label = tool.id || '(缺少 id 的条目)';
    if (!tool.id) push('存在缺少 id 的工具条目');
    if (!tool.name) push(label + ' 缺少 name');
    if (!tool.category) push(label + ' 缺少 category');
    else if (!categories.includes(tool.category)) push(label + ' 的 category 不在 toolCategories 中：' + tool.category);

    for (const also of tool.alsoIn) {
      if (!categories.includes(also)) push(label + ' 的 alsoIn 引用了不存在的分类：' + also);
      if (also === tool.category) push(label + ' 的 alsoIn 不应重复主分类');
    }
    for (const cap of tool.capabilities) {
      if (!caps.includes(cap)) push(label + ' 的 capabilities 含未知取值：' + cap);
    }
    if (tool.kind && !kinds.includes(tool.kind)) push(label + ' 的 kind 不合法：' + tool.kind);
    if (tool.catalogGroup && !['domestic', 'overseas', 'open-source', 'community'].includes(tool.catalogGroup)) {
      push(label + ' 的 catalogGroup 不合法：' + tool.catalogGroup);
    }
    const isAigc = tool.category === 'aigc' || tool.alsoIn.includes('aigc');
    if (isAigc && !['image', 'video', 'workflow', 'resources'].includes(tool.aigcSection)) {
      push(label + ' 缺少合法的 AIGC 页内分区（aigcSection）');
    }
    if (!isAigc && tool.aigcSection) push(label + ' 填写 aigcSection 时必须属于 AIGC 分类');
    if (tool.tier && !tiers.includes(tool.tier)) push(label + ' 的 tier 不合法：' + tool.tier);
    if (tool.basis && !bases.includes(tool.basis)) push(label + ' 的 basis 不合法：' + tool.basis);
    if (tool.verifiedOn && !isoDateRe.test(tool.verifiedOn)) push(label + ' 的 verifiedOn 必须是 YYYY-MM-DD');

    if (tool.url && !isSafeExternalUrl(tool.url)) {
      push(label + ' 的 url 只允许 http(s) 外链：' + tool.url);
    }
    if (tool.githubUrl && !isSafeExternalUrl(tool.githubUrl)) {
      push(label + ' 的 githubUrl 只允许 http(s) 外链：' + tool.githubUrl);
    }
    if (tool.logo) {
      if (!tool.logo.startsWith('/tool-logos/')) {
        push(label + ' 的 logo 必须放在 /tool-logos/ 下：' + tool.logo);
      } else if (root && !existsSync(path.join(root, 'public', tool.logo))) {
        push(label + ' 的 logo 文件不存在：public' + tool.logo);
      }
    }

    if (tool.id) {
      if (seenIds.has(tool.id)) push('工具 id 重复：' + tool.id);
      seenIds.add(tool.id);
    }
    if (tool.name) {
      if (seenNames.has(tool.name)) push('工具名称重复：' + tool.name);
      seenNames.add(tool.name);
    }
  }

  // 指南 / 作品的 tools 字段引用必须能在工具目录里找到
  const knownNames = new Set(tools.map((tool) => tool.name));
  for (const name of toolNames) {
    if (!knownNames.has(name)) push('引用了工具目录中不存在的工具：' + name);
  }

  return { errors, tools };
}

/** 从 src/data/guide-nav.ts 解析已登记的目录条目 slug（含规划中条目）。 */
export function loadGuideNavSlugsFromSource(source) {
  const start = source.indexOf('export const guideNavGroups');
  if (start === -1) return [];
  const block = source.slice(start, source.indexOf('export const guideNavGroupIds'));
  return [...block.matchAll(/slug: '([^']+)'/g)].map((match) => match[1]);
}

/**
 * 目录覆盖率（纯函数，便于测试）：
 * 文章写了却没登记 → 侧边栏看不到它，所以报错；登记了但没文章 → 正常（规划中）。
 */
export function checkGuideNavCoverage({ slugs, registeredSlugs }) {
  return slugs
    .filter((slug) => !registeredSlugs.includes(slug))
    .map((slug) => ({
      file: `guide/${slug}.md`,
      message: '未在 src/data/guide-nav.ts 中登记，侧边栏与目录总览不会显示这篇文章',
    }));
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
  const toolNames = parseToolsFromSource(toolsSource)
    .map((tool) => tool.name)
    .filter(Boolean);
  const glossaryCategoryIds = loadGlossaryCategoryIdsFromSource(glossarySource);
  // 工具目录允许为空（只由维护者按需添加），此时无法解析出名字是正常的；
  // 但文件本身必须仍有 tools 数组，避免误删结构后检查静默通过。
  if (!toolsSource.includes('export const tools')) throw new Error('无法定位 src/data/tools.ts 中的 tools 数组');
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

      // 场景拆解：2–4 步
      if (data.scenario !== undefined) {
        if (typeof data.scenario !== 'object' || data.scenario === null || Array.isArray(data.scenario)) {
          errors.push({ file: label(file), message: 'scenario 必须是对象（title / steps / example）' });
        } else {
          if (!isNonEmptyString(data.scenario.title)) {
            errors.push({ file: label(file), message: 'scenario.title 不能为空' });
          }
          const steps = data.scenario.steps;
          if (!Array.isArray(steps) || steps.length < 2 || steps.length > 4) {
            errors.push({ file: label(file), message: 'scenario.steps 需要 2–4 步' });
          } else {
            steps.forEach((step, index) => {
              const no = `scenario.steps[${index}]`;
              if (!step || typeof step !== 'object' || Array.isArray(step)) {
                errors.push({ file: label(file), message: `${no} 必须是对象（label / body）` });
                return;
              }
              if (!isNonEmptyString(step.label)) errors.push({ file: label(file), message: `${no}.label 不能为空` });
              if (!isNonEmptyString(step.body)) errors.push({ file: label(file), message: `${no}.body 不能为空` });
            });
          }
        }
      }

      // 选择题：每题必须有且只有一个正确答案
      if (data.quiz !== undefined) {
        if (!Array.isArray(data.quiz) || data.quiz.length > 3) {
          errors.push({ file: label(file), message: 'quiz 必须是数组，最多 3 题' });
        } else {
          data.quiz.forEach((item, index) => {
            const no = `quiz[${index}]`;
            if (!item || !isNonEmptyString(item.question)) {
              errors.push({ file: label(file), message: `${no}.question 不能为空` });
              return;
            }
            const options = item.options;
            if (!Array.isArray(options) || options.length < 2 || options.length > 4) {
              errors.push({ file: label(file), message: `${no}.options 需要 2–4 个选项` });
              return;
            }
            if (options.some((option) => !option || !isNonEmptyString(option.text))) {
              errors.push({ file: label(file), message: `${no}.options 里每个选项都要有 text` });
            }
            const correctCount = options.filter((option) => option && option.correct === true).length;
            if (correctCount !== 1) {
              errors.push({ file: label(file), message: `${no} 必须恰好有一个 correct: true 的选项（当前 ${correctCount} 个）` });
            }
          });
        }
      }

      if (data.agentPrompt !== undefined && !isNonEmptyString(data.agentPrompt)) {
        errors.push({ file: label(file), message: 'agentPrompt 不能为空' });
      }
    }
  }

  // 跨文件唯一性 / 引用完整性
  const seen = new Map();
  for (const { file, data } of rows) {
    if (!checkPositiveInteger(data.order)) continue;
    let key;
    if (collection === 'guide') key = 'guide';
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

/**
 * 工具目录的外链校验（#22）。
 * 工具仍是 TypeScript 数据文件，不经 schema，所以单独扫一遍 url 字段。
 */
export async function validateToolUrls(root) {
  const file = 'src/data/tools.ts';
  const source = await readFile(path.join(root, 'src', 'data', 'tools.ts'), 'utf8');
  const block = source.slice(source.indexOf('export const tools'));
  const errors = [];
  for (const match of block.matchAll(/^\s*url: '([^']*)'/gm)) {
    const url = match[1];
    if (!isSafeExternalUrl(url)) {
      errors.push({ file, message: `工具 url 只允许 http(s) 外链（拒绝 javascript: / data: / file: 等危险协议）：${url}` });
    }
  }
  return errors;
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
  results.push(...(await validateToolUrls(root)));

  // 指南目录覆盖率：文章必须在 src/data/guide-nav.ts 登记，否则侧边栏看不到
  const navSource = await readFile(path.join(root, 'src', 'data', 'guide-nav.ts'), 'utf8');
  const registeredSlugs = loadGuideNavSlugsFromSource(navSource);
  if (registeredSlugs.length === 0) throw new Error('无法解析 src/data/guide-nav.ts 中的目录条目');
  const guideDir = path.join(root, 'src', 'content', 'guide');
  const guideFiles = existsSync(guideDir)
    ? (await readdir(guideDir)).filter((file) => file.endsWith('.md') && !file.startsWith('_'))
    : [];
  results.push(
    ...checkGuideNavCoverage({
      slugs: guideFiles.map((file) => file.replace(/\.md$/, '')),
      registeredSlugs,
    }),
  );

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
