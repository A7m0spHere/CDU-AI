import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { checkDocumentation } from '../scripts/check-docs.mjs';

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
