import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

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
  'guide/01-ai-capability-map/index.html',
  'guide/02-first-conversation/index.html',
  'guide/03-safety-boundaries/index.html',
  'guide/04-find-a-real-task/index.html',
  'guide/05-make-first-output/index.html',
  'guide/06-verify-output/index.html',
  'guide/07-package-your-work/index.html',
  'guide/08-build-your-rhythm/index.html',
  'works/01-canteen-picker/index.html',
  'works/02-exam-coach/index.html',
  'works/03-club-poster/index.html',
  'works/04-explain-your-major/index.html',
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
  const guideSource = path.join(root, 'src/content/guide');
  const files = (await readdir(guideSource)).filter((file) => file.endsWith('.md')).sort();
  assert.equal(files.length, 8, '指南模块数量与预期不符');

  const entries = [];
  for (const file of files) {
    const raw = await readFile(path.join(guideSource, file), 'utf8');
    const fields = frontmatterFields(raw, file);
    const slug = file.replace(/\.md$/, '');
    entries.push({
      slug,
      title: fields.title,
      stage: fields.stage,
      order: Number(fields.order),
      updated: fields.updated,
    });
  }

  const orders = entries.map((entry) => entry.order).sort((a, b) => a - b);
  assert.equal(new Set(entries.map((entry) => entry.slug)).size, entries.length, '指南 slug 重复');
  assert.deepEqual(orders, Array.from({ length: entries.length }, (_, index) => index + 1), '指南 order 必须从 1 连续且不重复');
  for (const entry of entries) {
    assert.ok(entry.title, entry.slug + ' 缺少标题');
    assert.ok(['start', 'make', 'share'].includes(entry.stage), entry.slug + ' 的 stage 不合法');
    assert.match(entry.updated, /^\d{4}-\d{2}-\d{2}$/, entry.slug + ' 的 updated 不合法');
  }
  assert.deepEqual(
    entries.reduce((counts, entry) => {
      counts[entry.stage] = (counts[entry.stage] ?? 0) + 1;
      return counts;
    }, {}),
    { start: 3, make: 3, share: 2 },
    '阶段内指南数量与预期不符',
  );

  const search = JSON.parse(await read('search-index.json'));
  const guideIndex = await read('guide/index.html');
  for (const entry of entries) {
    const href = '/guide/' + entry.slug + '/';
    assert.ok(search.some((item) => item.type === '指南' && item.href === href), '搜索索引缺少指南：' + entry.slug);
    assert.ok(guideIndex.includes('href="' + href + '"'), '指南首页缺少入口：' + entry.slug);
    assert.match(await read('guide/' + entry.slug + '/index.html'), /notion-page/, entry.slug + ' 缺少 Notion 文档结构');
  }
});

test('站内搜索索引覆盖章节、术语和页面锚点', async () => {
  const data = JSON.parse(await read('search-index.json'));
  assert.ok(Array.isArray(data), '搜索索引应为数组');
  assert.ok(data.length >= 80, '搜索索引条目过少');
  const types = new Set(data.map((item) => item.type));
  for (const type of ['页面', '指南', '章节', '工具', '作品', '术语']) {
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
  assert.equal(countByType['指南'], 8, '搜索索引中的指南数量不符');
  assert.equal(countByType['作品'], 4, '搜索索引中的作品数量不符');
  assert.equal(countByType['工具'], 15, '搜索索引中的工具数量不符');
  assert.equal(countByType['术语'], 38, '搜索索引中的术语数量不符');
  assert.ok(countByType['章节'] >= 40, '搜索索引中的章节数量过少');

  const sectionItems = data.filter((item) => item.type === '章节');
  assert.ok(sectionItems.length >= 40, '章节级搜索记录过少');
  assert.ok(sectionItems.some((item) => item.href.includes('/guide/') && item.href.includes('#')), '缺少指南章节锚点');
  assert.ok(sectionItems.some((item) => item.href.includes('/works/') && item.href.includes('#')), '缺少作品章节锚点');

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
  const guide = await read('guide/02-first-conversation/index.html');
  assert.match(guide, /notion-page/);
  assert.match(guide, /notion-page-head/);
  assert.doesNotMatch(guide, /notion-page-properties/);
  assert.match(guide, /notion-prose/);
  assert.match(guide, /本页内容/);
  assert.doesNotMatch(guide, /wiki-heading--article/);
});

test('术语表内容与来源标注存在', async () => {
  const glossary = await read('glossary/index.html');
  assert.match(glossary, /AI 术语表/);
  assert.match(glossary, /VibeHub/);
  assert.match(glossary, /id="ai-hallucination"/);
  assert.match(glossary, /内容参考 VibeHub（vibe-hub\.org）的 AI 术语/);
  assert.doesNotMatch(glossary, /href="https:\/\/vibe-hub\.org/);
  const termCount = (glossary.match(/class="glossary-term"/g) || []).length;
  assert.equal(termCount, 38, '术语表条目数量不符');
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

  const sourcedGuide = await read('guide/02-first-conversation/index.html');
  assert.match(sourcedGuide, /参考来源/);
  assert.match(sourcedGuide, /platform\.claude\.com/);

  const glossary = await read('glossary/index.html');
  assert.match(glossary, /最后更新：\d{4}-\d{2}-\d{2}/);
  assert.match(glossary, /在 GitHub 编辑术语表/);
});

test('M0 的示例、社区与活动状态都有明确标注', async () => {
  const works = await read('works/index.html');
  assert.match(works, /策划示例/);
  assert.match(works, /不是真实学生作品/);

  const workDetail = await read('works/01-canteen-picker/index.html');
  assert.match(workDetail, /策划示例 · 非真实投稿/);
  assert.match(workDetail, /这是一条策划示例/);

  const community = await read('community/index.html');
  assert.match(community, /交流区尚未开放/);
  assert.match(community, /非真实帖子/);

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