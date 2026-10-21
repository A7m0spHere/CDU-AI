import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContentContext, validateCollection } from '../scripts/check-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

async function listMarkdown(dir) {
  // 以 _ 开头的文件是写作模板（如 _TEMPLATE.md），不参与构建，也不进入测试清单。
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

// 工具目录当前仍是 TypeScript 数据，测试从源文件解析；迁移为 Markdown（#8）后同步调整这里。
const toolsSource = await readFile(path.join(root, 'src/data/tools.ts'), 'utf8');
const toolsBlock = toolsSource.slice(toolsSource.indexOf('export const tools'));
const parsedTools = [...toolsBlock.matchAll(/id: '([^']+)',\s*\n\s*name: '([^']+)'/g)].map((match) => ({
  id: match[1],
  name: match[2],
}));
assert.ok(parsedTools.length > 0, '无法从 src/data/tools.ts 解析工具列表，请更新测试的解析逻辑');

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
  const requiredTypes = ['页面', '工具'];
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
    assert.match(guideIndex, /data-content-empty/, '空指南页缺少「内容准备中」占位');
    assert.match(guideIndex, /内容准备中/);
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
    assert.match(html, /term-definition/, slug + ' 缺少定义块');
    assert.match(html, /term-example/, slug + ' 缺少校园场景');
    assert.match(html, /先知道/, slug + ' 缺少「先知道」分类');
    assert.match(html, /application\/ld\+json/, slug + ' 缺少结构化数据');
    assert.match(html, /href="\/glossary\/"/, slug + ' 缺少返回术语表的入口');
    // 术语模块的可选区块：写了 frontmatter 就必须渲染出来
    if (/^youMaySay:/m.test(raw)) assert.match(html, /你可能会说/, slug + ' 缺少「你可能会说」');
    if (/^scenario:/m.test(raw)) assert.match(html, /term-steps/, slug + ' 缺少场景拆解步骤');
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
    if (!fields.reviewed) assert.match(html, /尚未人工核校/, slug + ' 丢失核校状态说明');
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
  if (fields.reviewed) return 'reviewed';
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
    assert.match(html, /已人工核校/, label + ' 应显示「已人工核校」');
    assert.ok(html.includes(fields.reviewed), label + ' 未显示审校日期 ' + fields.reviewed);
  } else if (status === 'needs-update') {
    assert.match(html, /待更新/, label + ' 应显示「待更新」');
    assert.doesNotMatch(html, /已人工核校/, label + ' 待更新内容不得显示「已人工核校」');
  } else {
    assert.match(html, /尚未人工核校/, label + ' 未审校内容必须显示「尚未人工核校」');
    assert.doesNotMatch(html, /已人工核校/, label + ' 未审校内容不得显示「已人工核校」');
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

  assert.ok(toolsPage.includes(parsedTools.length + ' 个工具'), '工具页数量与工具目录不一致');
  assert.ok(home.includes(parsedTools.length + ' 个常用工具'), '首页工具数量与工具目录不一致');
  if (workFiles.length > 0) {
    assert.ok(worksPage.includes(workFiles.length + ' 个策划示例'), '作品页数量与内容目录不一致');
    assert.ok(home.includes(workFiles.length + ' 个示例'), '首页作品数量与内容目录不一致');
  } else {
    assert.ok(worksPage.includes('data-content-empty'), '空作品页缺少「内容准备中」占位');
    assert.ok(home.includes('作品示例正在准备中'), '首页缺少作品占位说明');
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
  for (const expected of ['重复', '不存在的工具', 'first-hand', 'YYYY-MM-DD', 'reviewedBy', 'related', 'category', '未知字段']) {
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
    ['guide/index.html', guideSlugs.length === 0],
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
  if (guideSlugs.length === 0) assert.match(home, /指南内容正在准备中/);
  if (workSlugs.length === 0) {
    assert.match(home, /作品示例正在准备中/);
    assert.doesNotMatch(home, /0 个示例/, '首页不应出现「0 个示例」这类文案');
  }
});

test('阶段二：内容页使用共享页头与 v2 空状态', async () => {
  const pages = [
    ['guide/index.html', '01', '学习指南'],
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
  if (guideSlugs.length === 0) emptyRoutes.push('guide/index.html');
  if (glossarySlugs.length === 0) emptyRoutes.push('glossary/index.html');
  if (workSlugs.length === 0) emptyRoutes.push('works/index.html');
  for (const route of emptyRoutes) {
    const html = await read(route);
    assert.match(html, /empty-state--v2/, route + ' 空状态未使用 v2 样式');
  }

  // 筛选卡片具备进入动画的样式钩子（真实交互由浏览器验证）
  const toolsPage = await read('tools/index.html');
  assert.match(toolsPage, /data-filter-card/, '工具页缺少筛选卡片');
});
