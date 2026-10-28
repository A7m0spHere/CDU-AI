import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseToolsFromSource, parseToolCategoryIds } from '../scripts/check-content.mjs';
import { createCatalogView, validateCatalogSections, getToolSectionLabels } from '../src/lib/tool-catalog.mjs';
import { toolCategoryAliases, toolSections } from '../src/data/tool-sections.mjs';

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

test('API 平台按配置优先展示主流模型，顺序不受原始数据排列影响', () => {
  for (const data of [tools, [...tools].reverse()]) {
    for (const category of ['api', 'all']) {
      const view = createCatalogView(category, data, categories);
      const domestic = group(view, 'api-domestic-vendors').toolIds;
      const overseas = group(view, 'api-overseas-vendors').toolIds;
      assert.deepEqual(domestic.slice(0, 5), ['deepseek-api', 'qwen-api', 'kimi-api', 'zhipu-api', 'minimax-api']);
      assert.deepEqual(overseas.slice(0, 3), ['openai-api', 'claude-api', 'google-ai-studio']);
      assert.ok(domestic.includes('xiaomi-mimo'));
      assert.ok(!domestic.includes('aliyun-bailian'));
      assert.deepEqual(group(view, 'api-domestic-aggregators').toolIds, ['aliyun-bailian', 'siliconflow']);
    }
  }
  const api = flatten(createCatalogView('api', tools, categories));
  assert.equal(api.length, 25);
  assert.equal(new Set(api).size, 25);
});

test('Agent 恢复国内、海外、开源三组，工具归属调整继续保留', () => {
  const view = createCatalogView('agent', tools, categories);
  assert.equal(view.categories.length, 1);
  assert.equal(toolCategoryAliases.workflow, 'all');
  assert.equal(toolCategoryAliases.office, 'all');
  assert.ok(!categories.some((category) => category.id === 'workflow'));
  assert.ok(!categories.some((category) => category.id === 'office'));
  assert.ok(tools.every((tool) => tool.category !== 'workflow' && !tool.alsoIn.includes('workflow') && !tool.alsoIn.includes(tool.category)));
  assert.deepEqual(view.categories[0].groups.map((item) => item.key), ['agent-domestic', 'agent-overseas', 'agent-open-source']);
  assert.ok(group(view, 'agent-domestic').toolIds.includes('qwen-code'));
  assert.ok(group(view, 'agent-overseas').toolIds.includes('codex'));
  assert.ok(group(view, 'agent-open-source').toolIds.includes('cherry-studio'));
  assert.ok(group(view, 'agent-open-source').toolIds.includes('openclaw'));
  const api = createCatalogView('api', tools, categories);
  assert.ok(group(api, 'api-applications').toolIds.includes('dify'));
  assert.ok(group(api, 'api-applications').toolIds.includes('coze'));
  assert.ok(group(api, 'api-applications').toolIds.includes('n8n'));
  for (const id of ['dify', 'coze', 'n8n', 'comfyui', 'runninghub', 'mineru', 'aliyun-bailian']) assert.ok(!flatten(view).includes(id));
  assert.ok(group(view, 'agent-open-source').toolIds.includes('pi'));
  assert.ok(group(view, 'agent-open-source').toolIds.includes('browser-use'));
  assert.ok(group(view, 'agent-open-source').toolIds.includes('ragflow'));
  assert.equal(flatten(view).length, 32);
  assert.equal(new Set(flatten(view)).size, 32);
});

test('指定工具只保留各自主用途，OCR、设计与客户端不再跨栏目重复', () => {
  assert.ok(tools.every((tool) => tool.alsoIn.length === 0), '当前每个工具只保留一个主栏目');
  for (const [id, expected] of [['ragflow', 'agent'], ['civitai', 'community'], ['aliyun-bailian', 'api'], ['comfyui', 'aigc'], ['runninghub', 'aigc'], ['mineru', 'ocr'], ['canva', 'aigc'], ['cherry-studio', 'agent'], ['tavily', 'api'], ['dify', 'api'], ['coze', 'api'], ['n8n', 'api'], ['gamma', 'aigc'], ['wps-ai', 'aigc'], ['notion-ai', 'research'], ['obsidian', 'research'], ['tingwu', 'audio'], ['google-colab', 'compute']]) {
    const appearances = categories.filter((category) => flatten(createCatalogView(category.id, tools, categories)).includes(id)).map((category) => category.id);
    assert.deepEqual(appearances, [expected]);
    assert.equal(tools.find((tool) => tool.id === id).category, expected);
  }
});

test('设计、演示、文档与 OCR 使用各自主要展示位置', () => {
  const all = createCatalogView('all', tools, categories);
  const aigc = createCatalogView('aigc', tools, categories);
  assert.equal(createCatalogView('office', tools, categories).categories.length, 0);
  assert.ok(!group(all, 'aigc-image').toolIds.includes('canva'));
  assert.ok(group(aigc, 'aigc-design').toolIds.includes('canva'));
  assert.ok(group(all, 'aigc-design').toolIds.includes('canva'));
  assert.equal(tools.find((tool) => tool.id === 'canva').aigcSection, 'design');
  assert.ok(group(aigc, 'aigc-presentation').toolIds.includes('gamma'));
  assert.ok(group(aigc, 'aigc-document').toolIds.includes('wps-ai'));
  assert.ok(group(createCatalogView('ocr', tools, categories), 'ocr-parsing').toolIds.includes('mineru'));
  assert.ok(group(aigc, 'aigc-video').toolIds.includes('jimeng'));
  assert.ok(!flatten(aigc).includes('civitai'));
  assert.equal(flatten(aigc).length, 11);
  assert.ok(!flatten(aigc).includes('fal'));
});

test('每个栏目都完整覆盖主分类和关联条目，官方项目不进入社区折叠区', () => {
  for (const category of categories) {
    const ids = flatten(createCatalogView(category.id, tools, categories));
    assert.deepEqual([...ids].sort(), tools.filter((tool) => tool.category === category.id || tool.alsoIn.includes(category.id)).map((tool) => tool.id).sort());
    assert.equal(new Set(ids).size, ids.length);
  }
  const open = group(createCatalogView('agent', tools, categories), 'agent-open-source');
  assert.deepEqual([...open.collapsedIds].sort(), ['aider', 'browser-use', 'cline', 'crewai', 'goose', 'langgraph', 'mini-swe-agent', 'oh-my-pi', 'open-interpreter', 'openhands']);
  for (const id of ['deepseek-harness', 'qwen-code', 'hermes-agent', 'cherry-studio', 'ragflow']) assert.ok(!open.collapsedIds.includes(id));
  for (const id of open.toolIds) assert.ok(tools.find((tool) => tool.id === id).capabilities.includes('open-source'), id + ' 的开源标签必须描述工具自身');
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
  const section = toolSections.api[0];
  section.toolIds.push(section.toolIds[0]);
  try {
    assert.ok(validateCatalogSections(tools, categories).some((error) => error.includes('重复引用')));
  } finally {
    section.toolIds.pop();
  }
});
