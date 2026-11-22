import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { checkReviewFields, validateCollection } from '../scripts/check-content.mjs';
import { checkDocumentation } from '../scripts/check-docs.mjs';
import { CONTENT_TYPES } from '../src/lib/content-rules.mjs';

async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'cdu-docs-'));
  assert.equal(path.dirname(root), path.resolve(tmpdir()));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'docs'));
  return root;
}

test('文档检查支持中文重名标题、引用式链接与 HTML 图片，忽略代码中的假链接', async t => {
  const root = await fixture(t);
  await writeFile(path.join(root, 'docs/topic.md'), '# 重复标题\n\n## 重复标题\n\n<a id="custom"></a>');
  await writeFile(path.join(root, 'docs/image.png'), 'fixture');
  await writeFile(path.join(root, 'README.md'), [
    '# 文档', '[标题](docs/topic.md#重复标题-1)', '[引用][topic]',
    '[topic]: docs/topic.md#custom', '<img src="docs/image.png" alt="示例">',
    '`[内联代码](missing-inline.md)`', '```md', '[代码示例](missing-code.md)', '```',
    '[外部](https://example.com/unavailable)',
  ].join('\n\n'));
  const result = await checkDocumentation(root);
  assert.deepEqual(result.errors, []);
  assert.equal(result.localLinks, 3);

  await writeFile(path.join(root, 'README.md'), '[坏链接](missing.md)\n[坏锚点](docs/topic.md#missing)\n<img src="missing.png">');
  const broken = await checkDocumentation(root);
  assert.equal(broken.errors.length, 3);
  assert.ok(broken.errors.some(error => error.message.includes('锚点不存在')));
});

test('审校字段示例复用内容校验：资料整理不能填写亲测字段，撤销审校不能留下审校人', async t => {
  const root = await fixture(t);
  const file = path.join(root, 'README.md');
  for (const fields of ['basis: desk-research\ntestedOn: "2026-10-21"', 'reviewedBy: 示例审校人', 'reviewed: "2026-10-21"']) {
    await writeFile(file, '```yaml review-fields\n' + fields + '\n```');
    assert.equal((await checkDocumentation(root)).errors.length, 1);
  }
  await writeFile(file, '```yaml review-fields\nbasis: first-hand\ntestedOn: "2026-10-21"\ntestedEnvironment: 示例环境\n```');
  assert.deepEqual((await checkDocumentation(root)).errors, []);
  await writeFile(file, '```yaml\nitems: [\n```');
  assert.match((await checkDocumentation(root)).errors[0].message, /YAML 示例无效/);
});

test('审校人、亲测环境和贡献者代称的长度按去掉首尾空白后计算', () => {
  const fields = {
    reviewed: '2026-10-21',
    reviewedBy: ' ' + '审'.repeat(40) + ' ',
    reviewNote: ' ' + '注'.repeat(200) + ' ',
    basis: 'first-hand',
    testedOn: '2026-10-21',
    testedEnvironment: ' ' + '测'.repeat(120) + ' ',
    contributors: [' ' + '贡'.repeat(40) + ' '],
  };
  const errors = [];
  checkReviewFields(fields, 'sample.md', errors);
  assert.deepEqual(errors, []);

  for (const [key, value, expected] of [
    ['reviewedBy', '审'.repeat(41), /reviewedBy.*40/],
    ['reviewNote', '   ', /reviewNote/],
    ['reviewNote', '注'.repeat(201), /reviewNote.*200/],
    ['testedEnvironment', '测'.repeat(121), /testedEnvironment.*120/],
    ['contributors', ['贡'.repeat(41)], /contributors.*40/],
    ['contributors', ['A7m', ' A7m '], /contributors.*重复/],
  ]) {
    const fieldErrors = [];
    checkReviewFields({ ...fields, [key]: value }, 'sample.md', fieldErrors);
    assert.equal(fieldErrors.length, 1, key);
    assert.match(fieldErrors[0].message, expected);
  }
});

test('三类集合省略默认字段时 Zod 与 CLI 内容检查判定一致', async t => {
  const root = await fixture(t);
  const context = { toolNames: [], glossaryCategoryIds: ['llm'] };
  const samples = {
    guide: {
      frontmatter: [
        'title: "示例指南"',
        'summary: "摘要"',
        'stage: "start"',
        'order: 1',
        'outcome: "结果"',
        'forWho: "新生"',
        'updated: "2026-11-22"',
      ],
      data: {
        title: '示例指南',
        summary: '摘要',
        stage: 'start',
        order: 1,
        outcome: '结果',
        forWho: '新生',
        updated: '2026-11-22',
      },
      requiredKey: 'outcome',
    },
    works: {
      frontmatter: [
        'title: "示例作品"',
        'summary: "摘要"',
        'category: "校园生活"',
        'format: "网页"',
        'prompt: "做一个网页"',
        'effort: "30 分钟"',
        'order: 1',
        'updated: "2026-11-22"',
      ],
      data: {
        title: '示例作品',
        summary: '摘要',
        category: '校园生活',
        format: '网页',
        prompt: '做一个网页',
        effort: '30 分钟',
        order: 1,
        updated: '2026-11-22',
      },
      requiredKey: 'effort',
    },
    glossary: {
      frontmatter: [
        'term: "示例术语"',
        'en: "Sample Term"',
        'category: "llm"',
        'definition: "定义"',
        'example: "例子"',
        'order: 1',
        'updated: "2026-11-22"',
      ],
      data: {
        term: '示例术语',
        en: 'Sample Term',
        category: 'llm',
        definition: '定义',
        example: '例子',
        order: 1,
        updated: '2026-11-22',
      },
      requiredKey: 'definition',
    },
  };

  for (const [collection, sample] of Object.entries(samples)) {
    const dir = path.join(root, collection);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'sample.md'), `---\n${sample.frontmatter.join('\n')}\n---\n\n正文内容。\n`);
    assert.equal(CONTENT_TYPES[collection].schema.safeParse(sample.data).success, true, `${collection} Zod 应允许省略默认字段`);
    const validRes = await validateCollection({ collection, dir, context });
    assert.deepEqual(validRes.errors, [], `${collection} CLI 检查应允许省略默认字段`);

    const missingData = { ...sample.data };
    delete missingData[sample.requiredKey];
    assert.equal(CONTENT_TYPES[collection].schema.safeParse(missingData).success, false, `${collection} Zod 应拦截缺失必填字段`);
    const missingFrontmatter = sample.frontmatter.filter((line) => !line.startsWith(`${sample.requiredKey}:`));
    await writeFile(path.join(dir, 'sample.md'), `---\n${missingFrontmatter.join('\n')}\n---\n\n正文内容。\n`);
    const invalidRes = await validateCollection({ collection, dir, context });
    assert.ok(invalidRes.errors.some((e) => e.message.includes(`缺少必填字段 ${sample.requiredKey}`)), `${collection} CLI 检查应拦截缺失必填字段`);
  }
});

test('指南首页的站内路由交给构建检查，不误判成仓库文件路径', async t => {
  const root = await fixture(t);
  const guideDir = path.join(root, 'src/content/guide');
  await mkdir(guideDir, { recursive: true });
  await writeFile(path.join(guideDir, '_HOME.md'), [
    '[上下文窗口](/glossary/context-window/)',
    '[术语列表][glossary]',
    '<a href="/glossary/token/">Token</a>',
    '[glossary]: /glossary/',
  ].join('\n\n'));
  await writeFile(path.join(root, 'README.md'), '[不存在的仓库目标](/not-found.md)');
  const result = await checkDocumentation(root);
  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].file, 'README.md');
  assert.match(result.errors[0].message, /本地目标不存在/);
});

test('指南首页检查根路径图片，包括同时用于链接和图片的引用', async t => {
  const root = await fixture(t);
  const guideDir = path.join(root, 'src/content/guide');
  const publicDir = path.join(root, 'public');
  await mkdir(guideDir, { recursive: true });
  await mkdir(publicDir);
  await writeFile(path.join(publicDir, 'valid.webp'), 'fixture');
  await writeFile(path.join(guideDir, '_HOME.md'), [
    '![已有图片](/valid.webp)',
    '![缺失的 Markdown 图片](/missing-markdown.webp)',
    "<img src='/missing-html.webp' alt='缺失的 HTML 图片'>",
    '[打开原图][shared]',
    '![缺失的引用式图片][shared]',
    '[shared]: /missing-reference.webp',
  ].join('\n\n'));

  const result = await checkDocumentation(root);
  assert.deepEqual(result.errors.map(({ message }) => message), [
    '本地目标不存在：/missing-markdown.webp',
    '本地目标不存在：/missing-html.webp',
    '本地目标不存在：/missing-reference.webp',
  ]);
});
