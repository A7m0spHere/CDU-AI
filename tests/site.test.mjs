import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import {
  loadContentContext,
  parseToolCategoryIds,
  parseToolsFromSource,
  validateCollection,
  validateTools,
} from '../scripts/check-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

async function listMarkdown(dir) {
  // 以 _ 开头的文件不进入内容集合；_HOME.md 作为首页正文另行测试。
  return (await readdir(dir)).filter((file) => file.endsWith('.md') && !file.startsWith('_')).sort();
}

// 页面清单、数量与引用都从实际内容集合推导，新增/删除条目不需要改测试。
const contentRoot = path.join(root, 'src/content');
const sources = {
  guide: path.join(contentRoot, 'guide'),
  works: path.join(contentRoot, 'works'),
  glossary: path.join(contentRoot, 'glossary'),
};
const glossarySource = sources.glossary;
const guideFiles = await listMarkdown(sources.guide);
const workFiles = await listMarkdown(sources.works);
const glossaryFiles = await listMarkdown(sources.glossary);
const guideSlugs = guideFiles.map((file) => file.replace(/\.md$/, ''));
const workSlugs = workFiles.map((file) => file.replace(/\.md$/, ''));
const glossarySlugs = glossaryFiles.map((file) => file.replace(/\.md$/, ''));

// 工具目录当前仍是 TypeScript 数据。解析与字段校验复用内容检查器的同一份实现，
// 避免「页面渲染用一套规则、检查脚本用另一套」而静默失效（见 #8 迁移计划）。
const toolsSource = await readFile(path.join(root, 'src/data/tools.ts'), 'utf8');
const parsedTools = parseToolsFromSource(toolsSource);
const toolCategoryIds = parseToolCategoryIds(toolsSource);
// 维护者确认且已按官网核对的 Zotero 本体介绍；其余零成本表述仍需拦截。
const verifiedFreeSoftwareStatement = '免费开源的文献管理工具，收集论文、整理 PDF 与笔记，并在写作时插入引用和生成参考文献。';
function withoutVerifiedFreeStatement(text) {
  return text.replaceAll(verifiedFreeSoftwareStatement, '').replaceAll(verifiedFreeSoftwareStatement.toLowerCase(), '');
}
// 工具目录允许为空（只由维护者按需添加），但文件结构必须可解析
assert.ok(toolsSource.includes('export const tools'), '无法定位 src/data/tools.ts 中的 tools 数组');

const expectedRoutes = [
  'index.html',
  '404.html',
  'about/index.html',
  'community/index.html',
  'events/index.html',
  'guide/index.html',
  'glossary/index.html',
  'tools/index.html',
  'works/index.html',
  ...guideSlugs.map((slug) => 'guide/' + slug + '/index.html'),
  ...workSlugs.map((slug) => 'works/' + slug + '/index.html'),
  ...glossarySlugs.map((slug) => 'glossary/' + slug + '/index.html'),
];

async function read(relPath) {
  return readFile(path.join(dist, relPath), 'utf8');
}

function catalogViews(html) {
  const json = html.match(/<script\b[^>]*data-catalog-config[^>]*>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(json, '工具页缺少栏目视图配置');
  return JSON.parse(json).views;
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

function frontmatterFields(text, file) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(match, file + ' 缺少 frontmatter');
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const item = line.match(/^([a-zA-Z][\w-]*):\s*(.*)$/);
    if (!item) continue;
    fields[item[1]] = item[2].replace(/^\"|\"$/g, '');
  }
  return fields;
}

test('生产构建包含 M0 全部页面', async () => {
  for (const route of expectedRoutes) {
    const html = await read(route);
    assert.ok(html.length > 1200, route + ' 内容过短');
  }
});

test('所有页面具备基本文档结构与唯一 h1', async () => {
  const files = (await walk(dist)).filter((file) => file.endsWith('.html'));
  assert.equal(files.length, expectedRoutes.length, '页面数量与预期不符');
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    const display = path.relative(dist, file);
    assert.match(html, /<html lang="zh-CN">/, display + ' 缺少中文 lang');
    assert.match(html, /<meta charset="UTF-8"/i, display + ' 缺少 charset');
    assert.match(html, /<meta name="viewport"/, display + ' 缺少 viewport');
    assert.match(html, /<title>[^<]+<\/title>/, display + ' 缺少 title');
    assert.match(html, /<meta name="description" content="[^"]+"/, display + ' 缺少 description');
    assert.match(html, /class="skip-link"/, display + ' 缺少跳转链接');
    assert.match(html, /<main id="main-content"/, display + ' 缺少 main landmark');
    assert.match(html, /<nav class="desktop-nav" aria-label="主导航"/, display + ' 缺少主导航');
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, display + ' 应只有一个 h1');
  }
});

test('指南内容清单驱动导航与搜索覆盖', async () => {
  const entries = [];
  for (const file of guideFiles) {
    const raw = await readFile(path.join(sources.guide, file), 'utf8');
    const fields = frontmatterFields(raw, file);
    entries.push({
      slug: file.replace(/\.md$/, ''),
      title: fields.title,
      stage: fields.stage,
      order: Number(fields.order),
      updated: fields.updated,
    });
  }

  assert.equal(new Set(entries.map((entry) => entry.slug)).size, entries.length, '指南 slug 重复');
  const orders = entries.map((entry) => entry.order);
  assert.equal(new Set(orders).size, orders.length, '指南 order 必须唯一（新增条目前请检查 order）');
  for (const entry of entries) {
    assert.ok(entry.title, entry.slug + ' 缺少标题');
    assert.ok(Number.isInteger(entry.order) && entry.order > 0, entry.slug + ' 的 order 必须是正整数');
    assert.ok(['start', 'make', 'share'].includes(entry.stage), entry.slug + ' 的 stage 不合法');
    assert.match(entry.updated, /^\d{4}-\d{2}-\d{2}$/, entry.slug + ' 的 updated 不合法');
  }

  const search = JSON.parse(await read('search-index.json'));
  const guideIndex = await read('guide/index.html');
  for (const entry of entries) {
    const href = '/guide/' + entry.slug + '/';
    assert.ok(search.some((item) => item.type === '指南' && item.href === href), '搜索索引缺少指南：' + entry.slug);
    assert.ok(guideIndex.includes('href="' + href + '"'), '指南首页缺少入口：' + entry.slug);
    assert.match(await read('guide/' + entry.slug + '/index.html'), /notion-page/, entry.slug + ' 缺少 Notion 文档结构');
  }
  assert.equal(search.filter((item) => item.type === '指南').length, guideFiles.length, '搜索索引中的指南数量与内容目录不一致');
});

test('站内搜索索引覆盖章节、术语和页面锚点', async () => {
  const data = JSON.parse(await read('search-index.json'));
  assert.ok(Array.isArray(data), '搜索索引应为数组');
  const minimumEntries = parsedTools.length + guideSlugs.length + workSlugs.length + glossarySlugs.length;
  assert.ok(data.length >= minimumEntries, '搜索索引条目过少：' + data.length + ' < ' + minimumEntries);
  const types = new Set(data.map((item) => item.type));
  const requiredTypes = ['页面'];
  if (parsedTools.length > 0) requiredTypes.push('工具');
  if (guideSlugs.length > 0) requiredTypes.push('指南');
  if (workSlugs.length > 0) requiredTypes.push('作品');
  if (glossarySlugs.length > 0) requiredTypes.push('术语');
  if (guideSlugs.length + workSlugs.length > 0) requiredTypes.push('章节');
  for (const type of requiredTypes) {
    assert.ok(types.has(type), '搜索索引缺少类型：' + type);
  }
  for (const item of data) {
    assert.ok(item.title && item.description && item.href, '搜索索引条目字段不完整');
    assert.ok(item.href.startsWith('/'), '搜索索引链接应站内相对路径');
  }

  const countByType = data.reduce((counts, item) => {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
    return counts;
  }, {});
  assert.equal(countByType['指南'] ?? 0, guideSlugs.length, '搜索索引中的指南数量与内容目录不一致');
  assert.equal(countByType['作品'] ?? 0, workSlugs.length, '搜索索引中的作品数量与内容目录不一致');
  assert.equal(countByType['工具'] ?? 0, parsedTools.length, '搜索索引中的工具数量与工具目录不一致');
  assert.equal(countByType['术语'] ?? 0, glossarySlugs.length, '搜索索引中的术语数量与内容目录不一致');

  const sectionItems = data.filter((item) => item.type === '章节');
  const homeSections = sectionItems.filter((item) => item.href.startsWith('/guide/#'));
  const homeBody = await readFile(path.join(root, 'src/content/guide/_HOME.md'), 'utf8');
  const homeHeadings = [...homeBody.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].trim());
  assert.deepEqual(homeSections.map((item) => item.title), homeHeadings, '指南首页的每个章节都应可搜索');
  assert.ok(homeSections.some((item) => item.keywords.includes('Transformer')), '指南首页正文应进入搜索');
  // 每篇指南 / 作品至少贡献一条章节级记录，防止内容漏索引。
  for (const slug of guideSlugs) {
    assert.ok(
      sectionItems.some((item) => item.href.startsWith('/guide/' + slug + '/#')),
      '指南缺少章节级搜索记录：' + slug,
    );
  }
  for (const slug of workSlugs) {
    assert.ok(
      sectionItems.some((item) => item.href.startsWith('/works/' + slug + '/#')),
      '作品缺少章节级搜索记录：' + slug,
    );
  }
  // 每个工具都必须进入搜索索引。
  for (const tool of parsedTools) {
    assert.ok(
      data.some((item) => item.type === '工具' && item.title === tool.name),
      '搜索索引缺少工具：' + tool.name,
    );
  }

  // 搜索索引的每个锚点都必须真实存在于构建产物中。
  for (const item of data) {
    if (!item.href.includes('#')) continue;
    const [pathname, rawHash] = item.href.split('#');
    const target = pathname === '/'
      ? 'index.html'
      : pathname.endsWith('/')
        ? pathname.slice(1) + 'index.html'
        : pathname.slice(1) + '.html';
    const html = await read(target);
    const hash = decodeURIComponent(rawHash);
    assert.ok(html.includes(`id="${hash}"`), '搜索锚点不存在：' + item.href);
  }
});
test('学习指南详情采用 Notion 文档结构', async () => {
  if (guideSlugs.length === 0) {
    const guideIndex = await read('guide/index.html');
    assert.match(guideIndex, /guide-doc-shell/, '指南首页应保留文档框架');
    assert.match(guideIndex, /data-guide-home-content/, '指南首页应保留正文容器');
    assert.doesNotMatch(guideIndex, /data-content-empty|data-page-header|wiki-navmap|wiki-outline|wiki-next/, '指南首页不再显示自动生成的介绍与占位内容');
    return;
  }
  const guide = await read('guide/' + guideSlugs[0] + '/index.html');
  assert.match(guide, /notion-page/);
  assert.match(guide, /notion-page-head/);
  assert.doesNotMatch(guide, /notion-page-properties/);
  assert.match(guide, /notion-prose/);
  assert.match(guide, /本页内容/);
  assert.doesNotMatch(guide, /wiki-heading--article/);
});

test('术语表结构与详情链接存在', async () => {
  const glossary = await read('glossary/index.html');
  assert.match(glossary, /AI 术语表/);
  // 列表页不再展示来源说明条（维护者要求移除），也不设置站外术语跳转。
  assert.doesNotMatch(glossary, /glossary-source/);
  assert.doesNotMatch(glossary, /href="https:\/\/vibe-hub\.org/);
  const termCount = (glossary.match(/class="glossary-term"/g) || []).length;
  assert.equal(termCount, glossaryFiles.length, '术语表卡片数量与内容目录不一致');
  for (const slug of glossarySlugs) {
    assert.ok(glossary.includes('href="/glossary/' + slug + '/"'), '术语卡片缺少详情链接：' + slug);
  }
});

test('每个术语都有可读的详情页与结构化数据', async () => {
  const search = JSON.parse(await read('search-index.json'));
  // 分类 id 由 src/data/glossary.ts 决定，测试从同一份数据读取，避免改分类就失败。
  const { glossaryCategoryIds } = await loadContentContext(root);
  for (const file of glossaryFiles) {
    const slug = file.replace(/\.md$/, '');
    const raw = await readFile(path.join(glossarySource, file), 'utf8');
    const fields = frontmatterFields(raw, file);
    assert.ok(fields.term, slug + ' 缺少 term');
    assert.ok(fields.en, slug + ' 缺少 en');
    assert.ok(glossaryCategoryIds.includes(fields.category), slug + ' 分类不合法');
    assert.match(fields.updated, /^\d{4}-\d{2}-\d{2}$/, slug + ' 的 updated 不合法');

    const html = await read('glossary/' + slug + '/index.html');
    assert.match(html, /<h1[ >]/, slug + ' 缺少 h1');
    assert.match(html, /data-term-module/, slug + ' 缺少术语模块容器');
    assert.match(html, /data-copy-markdown/, slug + ' 缺少「复制 Markdown」按钮');
    assert.match(html, /term-definition/, slug + ' 缺少定义块');
    assert.match(html, /term-example/, slug + ' 缺少校园场景');
    assert.match(html, /先知道/, slug + ' 缺少「先知道」分类');
    assert.match(html, /application\/ld\+json/, slug + ' 缺少结构化数据');
    assert.match(html, /href="\/glossary\/"/, slug + ' 缺少返回术语表的入口');
    // 术语模块的可选区块：写了 frontmatter 就必须渲染出来
    if (/^youMaySay:/m.test(raw)) assert.match(html, /你可能会说/, slug + ' 缺少「你可能会说」');
    if (/^scenario:/m.test(raw)) {
      assert.match(html, /role="tablist"/, slug + ' 缺少步骤 tablist');
      assert.match(html, /data-scenario-tab/, slug + ' 缺少场景拆解步骤');
      assert.match(html, /data-scenario-panel/, slug + ' 缺少场景提示画面');
    }
    if (/^quiz:/m.test(raw)) assert.match(html, /data-quiz-option/, slug + ' 缺少选择题选项');
    if (/^agentPrompt:/m.test(raw)) assert.match(html, /data-copy-prompt/, slug + ' 缺少提示词复制按钮');
    if (fields.sources || /^sources:/m.test(raw)) assert.match(html, /延伸阅读/, slug + ' 缺少延伸阅读出处');

    assert.ok(
      search.some((item) => item.type === '术语' && item.href === '/glossary/' + slug + '/'),
      '搜索索引缺少术语详情：' + slug,
    );
  }
});

test('术语数据自身保持完整（分类、排序、相关词）', async () => {
  const seen = new Map();
  for (const file of glossaryFiles) {
    const raw = await readFile(path.join(glossarySource, file), 'utf8');
    const fields = frontmatterFields(raw, file);
    const key = fields.category + '#' + fields.order;
    assert.ok(!seen.has(key), '同一分类内 order 重复：' + file);
    seen.set(key, file);
    const related = JSON.parse(fields.related || '[]');
    for (const slug of related) {
      assert.ok(glossarySlugs.includes(slug), file + ' 的相关词不存在：' + slug);
    }
  }
});

test('术语来源展示真实链接，并保留未人工核校提示', async () => {
  const prioritySlugs = [
    'token', 'temperature', 'rag', 'mcp', 'prompt-injection', 'response-speed',
    'stateless-request', 'conversation-history', 'context-window', 'sandbox',
    'permission-mode', 'structured-output',
  ];
  for (const file of glossaryFiles) {
    const slug = file.replace(/\.md$/, '');
    const raw = await readFile(path.join(glossarySource, file), 'utf8');
    const fields = frontmatterFields(raw, file);
    const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1];
    const urls = Array.from(frontmatter.matchAll(/^\s+url:\s*"([^"]+)"\s*$/gm), (match) => match[1]);
    const html = await read('glossary/' + slug + '/index.html');

    if (prioritySlugs.includes(slug)) assert.ok(urls.length > 0, slug + ' 缺少事实来源');
    if (urls.length > 0) {
      assert.match(html, /aria-label="延伸阅读"/, slug + ' 缺少延伸阅读（来源）区');
      for (const url of urls) {
        assert.ok(html.includes('href="' + url.replace(/&/g, '&amp;') + '"'), slug + ' 未显示来源链接：' + url);
      }
    } else {
      assert.doesNotMatch(html, /aria-label="延伸阅读"/, slug + ' 不应显示空来源区');
    }
    if (!fields.reviewed) assert.match(html, /尚未审核/, slug + ' 丢失核校状态说明');
  }
});

test('指南与作品详情包含更新时间和 GitHub 编辑入口', async () => {
  const contentRoutes = expectedRoutes.filter((route) =>
    (route.startsWith('guide/') && route !== 'guide/index.html') ||
    (route.startsWith('works/') && route !== 'works/index.html'),
  );
  for (const route of contentRoutes) {
    const html = await read(route);
    assert.match(html, /最后更新：\d{4}-\d{2}-\d{2}/, route + ' 缺少更新时间');
    assert.match(html, /在 GitHub 编辑本页/, route + ' 缺少编辑入口');
    assert.match(html, /github\.com\/A7m0spHere\/CDU-AI\/edit\/main\//, route + ' 编辑链接错误');
  }

  for (const file of guideFiles) {
    const raw = await readFile(path.join(sources.guide, file), 'utf8');
    if (!/^sources:/m.test(raw)) continue;
    const slug = file.replace(/\.md$/, '');
    const html = await read('guide/' + slug + '/index.html');
    assert.match(html, /参考来源/, slug + ' 有 sources 但页面缺少参考来源区');
  }

  const glossary = await read('glossary/index.html');
  assert.match(glossary, /在 GitHub 编辑术语表/);
  if (glossarySlugs.length > 0) {
    assert.match(glossary, /最后更新：\d{4}-\d{2}-\d{2}/);
  } else {
    assert.match(glossary, /内容准备中/);
  }
});

test('M0 的示例、社区与活动状态都有明确标注', async () => {
  const works = await read('works/index.html');
  assert.match(works, /策划示例/);
  assert.match(works, /不是真实学生(作品|投稿)/);

  if (workSlugs.length > 0) {
    const workDetail = await read('works/' + workSlugs[0] + '/index.html');
    assert.match(workDetail, /策划示例 · 非真实投稿/);
    assert.match(workDetail, /这是一条策划示例/);
  }

  const community = await read('community/index.html');
  assert.match(community, /社区暂不开放/, '社区页应提示暂不开放');
  assert.doesNotMatch(community, /参与路径|讨论起点|社区公约|版块/, '社区页不应再包含指引或版块内容');

  const events = await read('events/index.html');
  assert.match(events, /本页没有活动日历/);
  assert.match(events, /形式筹备中/);
});

test('全站透明说明与内容边界存在', async () => {
  for (const route of ['index.html', 'about/index.html', 'works/index.html', 'community/index.html']) {
    const html = await read(route);
    assert.match(html, /不是成都大学官方平台/, route + ' 缺少非官方声明');
  }

  const home = await read('index.html');
  assert.match(home, /收录不等于推荐/);
  assert.match(home, /不虚构/);
});

test('外链带新窗口与安全的 rel 属性，页面无占位废话', async () => {
  const files = (await walk(dist)).filter((file) => file.endsWith('.html'));
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    const display = path.relative(dist, file);
    assert.doesNotMatch(html, /Lorem ipsum/i, display + ' 出现 Lorem ipsum');
    assert.doesNotMatch(withoutVerifiedFreeStatement(html), /免费|\bfree(?:mium|\s+(?:tier|credits?|usage|access|plan))\b/i, display + ' 不应包含未经核实的零成本使用表述');
    const externalLinks = html.match(/<a\b[^>]*href="https?:\/\/[^"]+"[^>]*>/g) || [];
    for (const link of externalLinks) {
      if (link.includes('target="_blank"')) {
        assert.match(link, /rel="noopener noreferrer"/, display + ' 的外链缺少安全 rel');
      }
    }
  }
});

/** 内容状态由 frontmatter 推导：needsUpdate 优先，其次 reviewed，缺省为 draft。 */
function expectedContentStatus(fields) {
  if ((fields.needsUpdate || '').toLowerCase() === 'true') return 'needs-update';
  if (fields.reviewed && fields.reviewedBy) return 'reviewed';
  return 'draft';
}

function assertContentStatus(html, fields, label) {
  const status = expectedContentStatus(fields);
  assert.match(
    html,
    new RegExp('data-content-status="' + status + '"'),
    label + ' 页面内容状态与 frontmatter 不一致（期望 ' + status + '）',
  );
  assert.match(html, /内容依据：/, label + ' 缺少「内容依据」说明');
  assert.match(html, /AI 参与：/, label + ' 缺少「AI 参与」说明');

  if (status === 'reviewed') {
    assert.match(html, /已审核无误/, label + ' 应显示「已审核无误」');
    assert.ok(html.includes(fields.reviewed), label + ' 未显示审校日期 ' + fields.reviewed);
  } else if (status === 'needs-update') {
    assert.match(html, /待更新/, label + ' 应显示「待更新」');
    assert.doesNotMatch(html, /已审核无误/, label + ' 待更新内容不得显示「已审核无误」');
  } else {
    assert.match(html, /尚未审核/, label + ' 未审校内容必须显示「尚未审核」');
    assert.doesNotMatch(html, /已审核无误/, label + ' 未审校内容不得显示「已审核无误」');
  }
}

test('指南与术语详情页如实展示内容状态，不伪造人工审校', async () => {
  for (const file of guideFiles) {
    const slug = file.replace(/\.md$/, '');
    const raw = await readFile(path.join(sources.guide, file), 'utf8');
    assertContentStatus(await read('guide/' + slug + '/index.html'), frontmatterFields(raw, file), 'guide/' + file);
  }

  for (const slug of glossarySlugs) {
    const raw = await readFile(path.join(glossarySource, slug + '.md'), 'utf8');
    assertContentStatus(await read('glossary/' + slug + '/index.html'), frontmatterFields(raw, slug + '.md'), 'glossary/' + slug);
  }

  for (const file of workFiles) {
    const slug = file.replace(/\.md$/, '');
    const raw = await readFile(path.join(sources.works, file), 'utf8');
    assertContentStatus(await read('works/' + slug + '/index.html'), frontmatterFields(raw, file), 'works/' + file);
  }
});

test('审校字段组合合法：reviewedBy / basis / testedOn 保持一致', async () => {
  const pairs = [
    ...guideFiles.map((file) => ({ file, dir: sources.guide, collection: 'guide' })),
    ...glossaryFiles.map((file) => ({ file, dir: sources.glossary, collection: 'glossary' })),
  ];

  for (const { file, dir, collection } of pairs) {
    const raw = await readFile(path.join(dir, file), 'utf8');
    const fields = frontmatterFields(raw, file);
    const label = collection + '/' + file;

    if (fields.reviewedBy) {
      assert.ok(fields.reviewed, label + ' 填写 reviewedBy 时必须同时填写 reviewed');
    }
    if (fields.reviewed) {
      assert.ok(fields.reviewedBy, label + ' 填写 reviewed 时必须同时填写 reviewedBy');
      assert.match(fields.reviewed, /^\d{4}-\d{2}-\d{2}$/, label + ' reviewed 日期格式不合法');
    }
    if (fields.testedOn) {
      assert.match(fields.testedOn, /^\d{4}-\d{2}-\d{2}$/, label + ' testedOn 日期格式不合法');
    }
    if (fields.basis === 'first-hand') {
      assert.ok(fields.testedOn, label + ' basis 为 first-hand 时必须填写 testedOn');
      assert.ok(fields.testedEnvironment, label + ' basis 为 first-hand 时必须填写 testedEnvironment');
    } else {
      assert.ok(
        !fields.testedOn && !fields.testedEnvironment,
        label + ' 只有 basis 为 first-hand 时才允许填写 testedOn / testedEnvironment',
      );
    }
  }
});

test('页面文案中的数量来自数据，不写死', async () => {
  const home = await read('index.html');
  const toolsPage = await read('tools/index.html');
  const worksPage = await read('works/index.html');
  const communityPage = await read('community/index.html');

  if (parsedTools.length > 0) {
    assert.ok(toolsPage.includes(parsedTools.length + ' 个工具'), '工具页数量与工具目录不一致');
    assert.ok(home.includes(parsedTools.length + ' 个常用工具'), '首页工具数量与工具目录不一致');
  } else {
    assert.ok(toolsPage.includes('工具目录暂时为空'), '空工具目录缺少占位说明');
    assert.ok(home.includes('工具目录由维护者按需补充'), '首页缺少工具目录占位说明');
  }
  if (workFiles.length > 0) {
    assert.ok(worksPage.includes(workFiles.length + ' 个策划示例'), '作品页数量与内容目录不一致');
  } else {
    assert.ok(worksPage.includes('data-content-empty'), '空作品页缺少「内容准备中」占位');
  }

  // 社区功能已关闭：首页与社区页只保留「暂不开放」提示，不再展示版块数量或参与指引。
  assert.ok(communityPage.includes('暂不开放'), '社区页应提示暂不开放');
  assert.ok(home.includes('暂不开放'), '首页应说明社区暂不开放');
  assert.ok(!home.includes('个版块'), '首页不应再展示社区版块数量');
});

test('内容检查器能识别新增合法条目与错误条目（fixture，不污染主站内容）', async () => {
  const context = await loadContentContext(root);

  for (const collection of ['guide', 'works', 'glossary']) {
    const result = await validateCollection({
      collection,
      dir: path.join(root, 'tests/fixtures/content/valid', collection),
      context,
    });
    assert.deepEqual(result.errors, [], collection + ' 的合法 fixture 不应报错：' + JSON.stringify(result.errors));
  }

  const invalidErrors = [];
  for (const collection of ['guide', 'works', 'glossary']) {
    const result = await validateCollection({
      collection,
      dir: path.join(root, 'tests/fixtures/content/invalid', collection),
      context,
    });
    invalidErrors.push(...result.errors);
  }
  const report = invalidErrors.map((error) => error.file + '  ' + error.message).join('\n');
  assert.ok(invalidErrors.some(error => error.file === 'guide/10-reviewed-without-author.md' && error.message.includes('reviewedBy')),
    '只填审核日期、不填负责人必须被拒绝');
  assert.ok(invalidErrors.some(error => error.file === 'guide/09-cross-stage-order.md' && error.message.includes('重复')),
    '不同 stage 的指南也不能使用相同 order，否则上一篇 / 下一篇会出现顺序冲突');
  for (const expected of ['重复', '不存在的工具', 'first-hand', 'YYYY-MM-DD', 'reviewedBy', 'related', 'category', '未知字段', '危险协议']) {
    assert.ok(report.includes(expected), '错误 fixture 未被识别：' + expected + '\n' + report);
  }

  // 主站正式内容也必须通过同一个检查器。
  for (const collection of ['guide', 'works', 'glossary']) {
    const result = await validateCollection({ collection, dir: sources[collection], context });
    assert.deepEqual(result.errors, [], collection + ' 内容一致性检查发现问题：' + JSON.stringify(result.errors));
  }
});

test('品牌图标与 PWA 资源完整，并由页面与 manifest 引用', async () => {
  const home = await read('index.html');
  for (const asset of ['/favicon-32.png', '/favicon-16.png', '/apple-touch-icon.png', '/brand/logo-160.png']) {
    assert.ok(home.includes(asset), '首页缺少图标引用：' + asset);
    assert.ok(existsSync(path.join(dist, asset.slice(1))), '缺少构建资源：' + asset);
  }
  // 首页右侧看板娘学习引导图
  assert.ok(home.includes('/brand/mascot.webp'), '首页缺少看板娘图片引用');
  assert.ok(existsSync(path.join(dist, 'brand/mascot.webp')), '缺少构建资源：/brand/mascot.webp');
  const networkLinks = [
    ['学习指南', '/guide/'],
    ['AI 术语', '/glossary/'],
    ['工具资源', '/tools/'],
    ['作品广场', '/works/'],
    ['活动信息', '/events/'],
    ['参与共建', '/about/#contribute'],
  ];
  assert.ok(home.includes('data-hero-network'), '首页缺少看板娘学习引导图容器');
  for (const [label, href] of networkLinks) {
    assert.ok(home.includes('>' + label + '<') || home.includes(label), '引导图缺少节点：' + label);
    assert.ok(home.includes('href="' + href + '"'), '引导图缺少跳转：' + href);
  }

  const manifest = JSON.parse(await read('site.webmanifest'));
  const sources = manifest.icons.map((icon) => icon.src);
  for (const source of ['/icon-192.png', '/icon-512.png']) {
    assert.ok(sources.includes(source), 'manifest 缺少图标：' + source);
    assert.ok(existsSync(path.join(dist, source.slice(1))), '缺少构建资源：' + source);
  }
});

test('内容集合为空时保留框架、写作模板与占位状态', async () => {
  for (const collection of ['guide', 'works', 'glossary']) {
    const files = await readdir(sources[collection]);
    assert.ok(files.includes('_TEMPLATE.md'), collection + ' 缺少 _TEMPLATE.md 写作模板');
  }

  // 下划线模板不能被 Astro 当作内容生成页面
  for (const collection of ['guide', 'works', 'glossary']) {
    const dirs = await readdir(path.join(dist, collection));
    assert.ok(
      !dirs.some((name) => name.startsWith('_')),
      collection + ' 的下划线模板不应生成页面：' + dirs.filter((name) => name.startsWith('_')).join(', '),
    );
  }

  const expectations = [
    ['glossary/index.html', glossarySlugs.length === 0],
    ['works/index.html', workSlugs.length === 0],
  ];
  for (const [route, shouldBeEmpty] of expectations) {
    if (!shouldBeEmpty) continue;
    const html = await read(route);
    assert.match(html, /data-content-empty/, route + ' 空集合时缺少占位区块');
    assert.match(html, /准备中/, route + ' 空集合时缺少「准备中」说明');
  }

  const home = await read('index.html');
  if (workSlugs.length === 0) {
    assert.doesNotMatch(home, /0 个示例/, '首页不应出现「0 个示例」这类文案');
  }
});

test('资源列表页使用共享页头与 v2 空状态', async () => {
  const pages = [
    ['glossary/index.html', '02', '术语表'],
    ['tools/index.html', '03', '工具资源'],
    ['works/index.html', '04', '作品广场'],
  ];
  for (const [route, index, label] of pages) {
    const html = await read(route);
    assert.match(html, /data-page-header/, route + ' 缺少共享页头');
    assert.ok(html.includes('> ' + index) || html.includes('>' + index + '<'), route + ' 页头缺少编号 ' + index);
    assert.ok(html.includes(label), route + ' 页头缺少标签 ' + label);
  }

  // 空状态断言按实际内容集合推导：有内容时不应再要求 v2 空状态（避免新增内容导致旧断言失败）。
  const emptyRoutes = [];
  if (glossarySlugs.length === 0) emptyRoutes.push('glossary/index.html');
  if (workSlugs.length === 0) emptyRoutes.push('works/index.html');
  for (const route of emptyRoutes) {
    const html = await read(route);
    assert.match(html, /empty-state--v2/, route + ' 空状态未使用 v2 样式');
  }

  // 筛选卡片具备进入动画的样式钩子（真实交互由浏览器验证）；目录为空时不渲染卡片
  const toolsPage = await read('tools/index.html');
  if (parsedTools.length > 0) {
    assert.match(toolsPage, /data-filter-card/, '工具页缺少筛选卡片');
  } else {
    assert.doesNotMatch(toolsPage, /data-filter-card/, '空工具目录不应渲染筛选卡片');
  }
});

test('外链协议白名单：危险 URL 被拒绝，正常链接保留（#22）', async () => {
  const { isSafeExternalUrl, isSafeLinkTarget } = await import('../src/lib/url-guard.mjs');

  const dangerous = [
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    '  javascript:alert(1)  ',
    'java\tscript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'file:///etc/passwd',
    'vbscript:msgbox(1)',
    '//evil.example.com/path',
    '/\\evil.example.com',
    '',
  ];
  for (const value of dangerous) {
    assert.equal(isSafeExternalUrl(value), false, '危险外链未被拒绝：' + JSON.stringify(value));
  }

  const safe = ['https://openai.com/index/why-language-models-hallucinate/', 'http://example.com/a?b=1#c'];
  for (const value of safe) {
    assert.equal(isSafeExternalUrl(value), true, '正常外链被误杀：' + value);
  }

  for (const value of ['/glossary/', '#contribute', './x', '../y']) {
    assert.equal(isSafeLinkTarget(value), true, '站内链接被误杀：' + value);
  }
});

test('正文 Markdown 的危险链接在渲染阶段被剥离（#22）', async () => {
  const plugin = (await import('../src/lib/rehype-safe-links.mjs')).default;
  const tree = {
    type: 'root',
    children: [
      { type: 'element', tagName: 'a', properties: { href: 'javascript:alert(1)' }, children: [{ type: 'text', value: '坏链接' }] },
      { type: 'element', tagName: 'a', properties: { href: 'https://example.com/doc' }, children: [{ type: 'text', value: '外链' }] },
      { type: 'element', tagName: 'a', properties: { href: '/glossary/' }, children: [{ type: 'text', value: '站内' }] },
      { type: 'element', tagName: 'img', properties: { src: 'data:text/html,<script>alert(1)</script>' }, children: [] },
    ],
  };
  plugin()(tree);

  const [blocked, external, internal, image] = tree.children;
  assert.equal(blocked.properties.href, undefined, '危险链接的 href 应被移除');
  assert.equal(blocked.properties['data-link-blocked'], 'true', '危险链接应留痕便于排查');
  assert.equal(external.properties.target, '_blank', '外链应在新窗口打开');
  assert.equal(external.properties.rel, 'noopener noreferrer', '外链应带安全 rel');
  assert.equal(internal.properties.target, undefined, '站内链接不应加 target');
  assert.equal(image.properties.src, undefined, '危险图片地址应被移除');
});

test('构建产物中不存在危险协议的 href / src（#22）', async () => {
  for (const route of expectedRoutes) {
    if (!route.endsWith('.html')) continue;
    const html = await read(route);
    assert.doesNotMatch(html, /href="\s*(javascript|data|file|vbscript):/i, route + ' 输出了危险协议的 href');
    assert.doesNotMatch(html, /src="\s*(javascript|vbscript):/i, route + ' 输出了危险协议的 src');
  }
});


test('学习指南目录：六个分组、规划条目不是死链、站内链接可达（信息架构）', async () => {
  const html = await read('guide/index.html');
  const navSource = await readFile(path.join(root, 'src/data/guide-nav.ts'), 'utf8');
  const { loadGuideNavSlugsFromSource, checkGuideNavCoverage } = await import('../scripts/check-content.mjs');

  // 只检查桌面侧边栏（移动端抽屉是同一个组件的第二份渲染）
  const sidebarStart = html.indexOf('class="guide-sidebar"');
  assert.ok(sidebarStart > -1, '指南页缺少侧边栏');
  const sidebarHtml = html.slice(sidebarStart, html.indexOf('</aside>', sidebarStart));

  // 六个分组按规划顺序出现
  const groupLabels = ['先从这里开始', '开始学习', 'AI 能帮你做什么', '进一步使用 Agent', '跟着案例实践', '资源与交流'];
  let cursor = -1;
  for (const label of groupLabels) {
    const at = sidebarHtml.indexOf(label);
    assert.ok(at > cursor, '侧边栏缺少分组或顺序不对：' + label);
    cursor = at;
  }
  assert.equal((sidebarHtml.match(/class="guide-nav__group"/g) || []).length, 6, '侧边栏分组数量应为 6');

  // 规划中的条目只占位、不生成链接：数量 = 登记 slug 数 - 已发布文章数
  const registeredSlugs = loadGuideNavSlugsFromSource(navSource);
  assert.ok(registeredSlugs.length >= 20, '目录登记条目过少：' + registeredSlugs.length);
  const plannedCount = (sidebarHtml.match(/data-planned="true"/g) || []).length;
  assert.equal(plannedCount, registeredSlugs.length - guideFiles.length, '规划中条目数量与登记表不一致');
  for (const slug of registeredSlugs) {
    if (guideFiles.includes(slug + '.md')) continue;
    assert.ok(!html.includes('href="/guide/' + slug + '/"'), '规划中的文章不应生成路由：' + slug);
  }

  // 当前页高亮：指南首页
  assert.ok(sidebarHtml.includes('href="/guide/" aria-current="page"'), '目录首页缺少当前页高亮');

  // 站内链接都能在构建产物中找到对应页面（无死链）
  const hrefs = new Set([...html.matchAll(/href="(\/[^"]*)"/g)].map((match) => match[1]));
  for (const href of hrefs) {
    const clean = href.split('#')[0];
    if (clean === '/' || clean === '') continue;
    const target = clean.endsWith('/') ? clean.slice(1) + 'index.html' : clean.slice(1);
    assert.ok(existsSync(path.join(dist, target)), '指南页出现死链：' + href);
  }

  // 移动端目录入口存在（原生 details/summary，键盘可操作）
  assert.match(html, /class="guide-mobile-nav"/, '缺少移动端目录');
  assert.match(html, /guide-mobile-nav[\s\S]{0,200}?<summary/, '移动端目录缺少可点击的 summary');

  // 目录覆盖率规则：未登记的文章要被报出来
  assert.deepEqual(checkGuideNavCoverage({ slugs: ['who-is-this-for'], registeredSlugs }), [], '已登记文章不应报错');
  assert.equal(
    checkGuideNavCoverage({ slugs: ['not-registered'], registeredSlugs }).length,
    1,
    '未登记的文章必须被内容检查器拦下',
  );
});


test('工具目录数据自洽：字段合法、分类存在、Logo 文件齐全', async () => {
  const { errors } = validateTools({ source: toolsSource, root });
  assert.deepEqual(errors, [], '工具数据校验未通过：' + JSON.stringify(errors));

  assert.ok(toolCategoryIds.length >= 10, '工具分类应至少保留 10 个场景，实际：' + toolCategoryIds.length);
  assert.equal(new Set(parsedTools.map((tool) => tool.id)).size, parsedTools.length, '工具 id 必须唯一');
  assert.equal(new Set(parsedTools.map((tool) => tool.name)).size, parsedTools.length, '工具名称必须唯一');

  for (const tool of parsedTools) {
    assert.ok(toolCategoryIds.includes(tool.category), tool.id + ' 的分类不在 toolCategories 中');
    assert.ok(tool.url && tool.url.startsWith('https://'), tool.id + ' 缺少 https 官方链接');
    assert.ok(tool.verifiedOn, tool.id + ' 缺少最近核验日期');
  }

  // 每个分类都要有工具，避免出现空分类导航
  for (const id of toolCategoryIds) {
    assert.ok(
      parsedTools.some((tool) => tool.category === id || tool.alsoIn.includes(id)),
      '分类下没有任何工具：' + id,
    );
  }
});

test('AIGC 保留创作工具，Civitai 只归社区，暂不收录独立模型', async () => {
  assert.ok(toolCategoryIds.includes('aigc'), '缺少 AIGC 一级分类');
  assert.ok(!toolCategoryIds.includes('image') && !toolCategoryIds.includes('video'), '图片、视频应成为 AIGC 页内分区');
  assert.ok(parsedTools.every((tool) => tool.kind !== '模型'), '当前目录不收录独立模型');
  const html = await read('tools/index.html');
  const groups = ['image', 'video', 'workflow', 'design', 'presentation', 'document'].map((id) => (
    html.match(new RegExp('<section\\b[^>]*data-tool-group="aigc-' + id + '"[\\s\\S]*?<\\/section>'))?.[0] ?? ''
  ));
  assert.ok(groups.every(Boolean), 'AIGC 应展示图片、视频、工作流、设计、演示、文档六个分区');
  assert.ok(groups[0].includes('data-tool-id="midjourney"'), '图片产品应归入图片创作');
  assert.ok(groups[1].includes('data-tool-id="kling"'), '视频产品应归入视频创作');
  assert.ok(groups[2].includes('data-tool-id="comfyui"'), 'ComfyUI 是工作流工具，应保留');
  assert.ok(groups[3].includes('data-tool-id="canva"'), 'Canva 应单列在设计与排版');
  assert.ok(groups[4].includes('data-tool-id="gamma"'), 'Gamma 应归入演示文稿');
  assert.ok(groups[5].includes('data-tool-id="wps-ai"'), 'WPS AI 应归入文档与表格');
  assert.doesNotMatch(html, /data-filter-value="office"/, '办公分类已移除');
  const selectedAigc = catalogViews(html).aigc.categories[0].groups;
  assert.ok(selectedAigc.every((group) => !group.toolIds.includes('civitai')), 'Civitai 不再出现在 AIGC');
  assert.equal(parsedTools.find((tool) => tool.id === 'civitai').category, 'community');
  assert.deepEqual(parsedTools.find((tool) => tool.id === 'civitai').alsoIn, []);
  assert.ok(!groups.join('').includes('data-tool-id="fal"'), 'API 平台应保留在独立 API 分类');
  const wan = parsedTools.find((tool) => tool.id === 'wan');
  assert.equal(wan?.kind, '在线产品', '万相仅保留网页创作产品入口');
  assert.equal(wan?.githubUrl, undefined, '万相不再提供独立模型仓库入口');
  for (const [id, category] of [['fal', 'api'], ['aliyun-bailian', 'api'], ['autodl', 'compute'], ['google-colab', 'compute'], ['hugging-face', 'community'], ['modelscope', 'community']]) {
    assert.equal(parsedTools.find((tool) => tool.id === id)?.category, category, '应保留原有资源入口：' + id);
  }
});

test('工具页展示官方 Logo、能力筛选与建议收录入口', async () => {
  if (parsedTools.length === 0) return;
  const html = await read('tools/index.html');

  // 官方 Logo：卡片里是 <img>，并且保留首字母兜底（图片加载失败时露出）
  const logoFiles = parsedTools.filter((tool) => tool.logo).map((tool) => tool.logo);
  assert.ok(logoFiles.length >= parsedTools.length - 5, '绝大多数工具应有官方 Logo');
  for (const file of logoFiles) {
    assert.ok(existsSync(path.join(root, 'public', file)), 'Logo 文件缺失：' + file);
    assert.ok(html.includes(file), '工具页没有引用 Logo：' + file);
  }
  assert.match(html, /class="tool-mark__fallback"/, '缺少首字母兜底');
  // 有图标时首字母必须默认隐藏：否则透明图标的空白处会露出字母，观感很差
  assert.match(html, /class="tool-mark__fallback"[^>]*data-fallback hidden/, '有 Logo 时首字母兜底必须默认隐藏');
  assert.match(html, /data-mono="true"/, '单色标志需要 data-mono 钩子做深色反色');

  // 能力筛选与场景筛选
  assert.match(html, /data-filter-cap="open-source"/, '缺少「开源」能力筛选');
  assert.match(html, /data-filter-cap="local"/, '缺少「本地部署」能力筛选');
  assert.match(html, /data-filter-cap="beginner"/, '缺少「入门友好」能力筛选');
  assert.match(html, /data-capabilities=/, '卡片缺少能力标签数据属性');

  // 建议收录入口指向现有的 GitHub Issue 模板
  assert.match(html, /issues\/new\?template=tool-suggestion\.yml/, '缺少工具建议 Issue 入口');
  assert.match(html, /收录不等于推荐/, '缺少「收录不等于推荐」说明');
});

test('Agent 与 Harness 按国内、海外、开源归组，工具不重复渲染', async () => {
  if (parsedTools.length === 0) return;
  const html = await read('tools/index.html');
  assert.match(html, /data-collapse/, '缺少更多开源 Agent 折叠区');
  assert.match(html, /更多开源 Agent 与 Harness/, '折叠区缺少标题');
  assert.match(html, /默认收起，搜索或能力筛选时自动展开/, '折叠区缺少展开说明');

  const groups = Object.fromEntries(['domestic', 'overseas', 'open-source'].map((id) => [
    id,
    html.match(new RegExp('<section\\b[^>]*data-tool-group="agent-' + id + '"[\\s\\S]*?<\\/section>'))?.[0] ?? '',
  ]));
  for (const [id, group] of Object.entries(groups)) assert.ok(group, '缺少 Agent 分组：' + id);
  assert.doesNotMatch(html, /data-filter-value="workflow"/, '合并后不应保留第二个筛选入口');
  assert.doesNotMatch(html, /data-catalog-category="workflow"/);
  const agentTools = parsedTools.filter((tool) => tool.category === 'agent' || tool.alsoIn.includes('agent'));
  const selectedAgent = catalogViews(html).agent.categories[0].groups;
  for (const tool of agentTools) {
    assert.equal(selectedAgent.filter((group) => group.toolIds.includes(tool.id)).length, 1, 'Agent 条目必须且只能进入一个用途分组：' + tool.id);
    assert.ok(selectedAgent.find((group) => group.key === 'agent-' + tool.catalogGroup)?.toolIds.includes(tool.id), 'Agent 条目必须按登记的归属分组：' + tool.id);
  }
  const renderedIds = [...html.matchAll(/data-tool-id="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(renderedIds.length, parsedTools.length, '工具分组后不应遗漏或额外复制卡片');
  assert.equal(new Set(renderedIds).size, parsedTools.length, '同一个工具不能因次要分类而重复渲染');

  const cardTag = (id) => html.match(new RegExp('<article\\b[^>]*data-tool-id="' + id + '"[^>]*>'))?.[0] ?? '';
  for (const id of ['opencode', 'pi', 'openclaw']) {
    assert.ok(cardTag(id), '缺少直接显示的社区工具：' + id);
    assert.doesNotMatch(cardTag(id), /data-collapsed="true"/, id + ' 应直接显示');
  }
  // 厂商自家 Agent 即使开源或标为社区热门，也必须直接展示。
  for (const id of ['deepseek-harness', 'qwen-code', 'hermes-agent', 'zcode', 'workbuddy', 'qoder', 'kimi-code', 'minimax-code']) {
    assert.ok(parsedTools.some((tool) => tool.id === id), '缺少厂商 Agent：' + id);
    assert.ok(cardTag(id), '工具页缺少厂商 Agent 卡片：' + id);
    assert.doesNotMatch(cardTag(id), /data-collapsed="true"/, id + ' 应直接显示');
  }
  assert.ok(groups.domestic.includes('data-tool-id="deepseek-harness"'), 'DeepSeek Harness 应归入国内工具');
  assert.ok(groups.overseas.includes('data-tool-id="hermes-agent"'), 'Hermes Agent 应归入海外工具');
  assert.ok(groups['open-source'].includes('data-tool-id="ragflow"'), 'RAGFlow 应归入开源工具');
  assert.ok(groups['open-source'].includes('data-tool-id="cherry-studio"'), 'Cherry Studio 应归入开源工具');
  for (const id of ['cline', 'openhands', 'oh-my-pi', 'goose', 'aider', 'open-interpreter', 'mini-swe-agent', 'langgraph', 'browser-use', 'crewai']) {
    assert.ok(parsedTools.some((tool) => tool.id === id), '折叠清单里的工具不存在：' + id);
    assert.ok(selectedAgent.find((group) => group.key === 'agent-open-source').collapsedIds.includes(id), id + ' 在开源工具分组中应默认收起');
  }

  // 搜索或能力筛选生效时自动展开折叠区，场景分类本身不触发展开。
  const filterSource = await readFile(path.join(root, 'src/scripts/filter.ts'), 'utf8');
  assert.match(filterSource, /details\.open = filtering/, '筛选生效时应自动展开折叠区');
});

test('图标加载失败时移除图片并显示首字母，不能访问已脱离的父节点', async () => {
  if (!parsedTools.some(tool => tool.logo)) return;
  const html = await read('tools/index.html');
  const handler = html.match(/<img\b[^>]*class="tool-mark__img"[^>]*onerror="([^"]+)"/)?.[1];
  assert.ok(handler, '工具图标缺少加载失败处理');
  const fallback = { hidden: true };
  const image = {
    parentElement: {
      querySelector(selector) {
        assert.equal(selector, '[data-fallback]');
        return fallback;
      },
    },
    removed: false,
    remove() {
      this.parentElement = null;
      this.removed = true;
    },
  };
  // 执行构建产物中的真实处理函数；remove 后 parentElement 与浏览器一样变为 null。
  assert.doesNotThrow(() => runInNewContext('(function () { ' + handler + ' }).call(image)', { image }));
  assert.equal(image.removed, true, '失败图片应被移除');
  assert.equal(fallback.hidden, false, '首字母兜底应恢复显示');
});

test('GitHub 产品官网不会被误当成代码仓库', async () => {
  if (!parsedTools.some((tool) => tool.id === 'github-copilot')) return;
  const html = await read('tools/index.html');
  const cards = html.match(/<article\b[^>]*class="tool-card card"[\s\S]*?<\/article>/g) ?? [];
  const copilot = cards.find((card) => card.includes('data-tool-id="github-copilot"'));
  assert.ok(copilot, '缺少 GitHub Copilot 卡片');
  const footer = copilot.match(/<div class="tool-card__foot">[\s\S]*?<\/div>/)?.[0] ?? '';
  assert.match(footer, /href="https:\/\/github\.com\/features\/copilot"/, '官网入口应指向 Copilot 产品页');
  assert.match(footer, /打开官网/, 'GitHub 域名上的产品页仍应显示「打开官网」');
  assert.doesNotMatch(footer, /class="tool-card__repo"[^>]*href="https:\/\/github\.com\/features\/copilot"/, '产品页不能作为代码仓库入口');
});

test('工具数据进入搜索索引：别名、技术类型与能力标签都可搜', async () => {
  if (parsedTools.length === 0) return;
  const data = JSON.parse(await read('search-index.json'));
  assert.doesNotMatch(withoutVerifiedFreeStatement(JSON.stringify(data)), /免费|\bfree(?:mium|\s+(?:tier|credits?|usage|access|plan))\b/i, '搜索索引不应保留未经核实的零成本使用表述');
  const toolItems = data.filter((item) => item.type === '工具');
  assert.equal(toolItems.length, parsedTools.length, '搜索索引中的工具数量与目录不一致');

  for (const tool of parsedTools) {
    const item = toolItems.find((entry) => entry.title === tool.name);
    assert.ok(item, '搜索索引缺少工具：' + tool.name);
    for (const alias of tool.aliases) {
      assert.ok(item.keywords.includes(alias), '搜索索引缺少别名：' + tool.name + ' / ' + alias);
    }
  }

  // 产品与工作流的技术类型仍应进入索引。
  assert.ok(
    toolItems.some((item) => item.keywords.includes('图像工作流')),
    '搜索索引应包含技术类型关键词',
  );
});
