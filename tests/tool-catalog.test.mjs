import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseToolsFromSource, parseToolCategoryIds } from '../scripts/check-content.mjs';
import { createCatalogView, validateCatalogSections, getToolSectionLabels } from '../src/lib/tool-catalog.mjs';
import { toolCategoryAliases } from '../src/data/tool-sections.mjs';

const source = await readFile(new URL('../src/data/tools.ts', import.meta.url), 'utf8');
const tools = parseToolsFromSource(source);
const categories = parseToolCategoryIds(source).map((id) => ({ id }));
const flatten = (view) => view.categories.flatMap((category) => category.groups.flatMap((group) => group.toolIds));
const group = (view, key) => view.categories.flatMap((category) => category.groups).find((item) => item.key === key);

test('全目录按主分类展示，每个条目只出现一次，所有分区配置完整', () => {
  assert.deepEqual(validateCatalogSections(tools, categories), []);
  const view = createCatalogView('all', tools, categories);
  const ids = flatten(view);
  assert.equal(ids.length, tools.length);
  assert.equal(new Set(ids).size, tools.length);
  for (const category of view.categories) {
    assert.deepEqual(category.groups.flatMap((item) => item.toolIds).sort(), tools.filter((tool) => tool.category === category.id).map((tool) => tool.id).sort());
  }
});

test('工作流关联条目按当前栏目归组，不继承 Agent 或 AIGC 的折叠策略', () => {
  const view = createCatalogView('workflow', tools, categories);
  assert.equal(view.categories.length, 1);
  assert.ok(group(view, 'workflow-visual').toolIds.includes('dify'));
  assert.ok(group(view, 'workflow-visual').toolIds.includes('coze'));
  assert.ok(group(view, 'workflow-creative').toolIds.includes('comfyui'));
  assert.ok(group(view, 'workflow-frameworks').toolIds.includes('pi'));
  assert.ok(group(view, 'workflow-browser').toolIds.includes('browser-use'));
  assert.ok(view.categories[0].groups.every((item) => item.collapsedIds.length === 0));
  assert.equal(new Set(flatten(view)).size, 13);
});

test('同一工具在全目录和关联栏目使用各自的主要展示位置', () => {
  const all = createCatalogView('all', tools, categories);
  const aigc = createCatalogView('aigc', tools, categories);
  assert.ok(group(all, 'office-tools').toolIds.includes('canva'));
  assert.ok(!group(all, 'aigc-image').toolIds.includes('canva'));
  assert.ok(group(aigc, 'aigc-image').toolIds.includes('canva'));
  assert.ok(group(aigc, 'aigc-video').toolIds.includes('jimeng'));
  assert.ok(group(aigc, 'aigc-resources').toolIds.includes('civitai'));
  assert.equal(flatten(aigc).length, 10);
  assert.ok(!flatten(aigc).includes('fal'));
});

test('每个栏目都完整覆盖主分类和关联条目，官方项目不进入社区折叠区', () => {
  for (const category of categories) {
    const ids = flatten(createCatalogView(category.id, tools, categories));
    assert.deepEqual([...ids].sort(), tools.filter((tool) => tool.category === category.id || tool.alsoIn.includes(category.id)).map((tool) => tool.id).sort());
    assert.equal(new Set(ids).size, ids.length);
  }
  const community = group(createCatalogView('agent', tools, categories), 'agent-community');
  assert.equal(community.collapsedIds.length, 10);
  for (const id of ['deepseek-harness', 'qwen-code', 'hermes-agent']) assert.ok(!community.toolIds.includes(id));
});

test('语音入口合并并兼容旧链接，开源能力只描述当前工具', () => {
  assert.equal(flatten(createCatalogView('audio', tools, categories)).length, 5);
  for (const old of ['tts', 'stt', 'music']) assert.equal(toolCategoryAliases[old], 'audio');
  for (const id of ['qwen-chat', 'n8n', 'dify']) assert.ok(!tools.find((tool) => tool.id === id).capabilities.includes('open-source'));
  for (const id of ['cherry-studio', 'rikkahub', 'comfyui']) assert.ok(tools.find((tool) => tool.id === id).capabilities.includes('open-source'));
  assert.ok(getToolSectionLabels(tools.find((tool) => tool.id === 'comfyui')).includes('创作工作流'));
});

test('缺少归属和失效分区引用会被拦截，空目录仍可使用', () => {
  const missing = tools.map((tool) => tool.id === 'jimeng' ? { ...tool, aigcSection: undefined } : tool);
  assert.ok(validateCatalogSections(missing, categories).some((error) => error.includes('jimeng')));
  assert.ok(validateCatalogSections(tools.filter((tool) => tool.id !== 'llama-cpp'), categories).some((error) => error.includes('llama-cpp')));
  assert.deepEqual(validateCatalogSections([], categories), []);
});
