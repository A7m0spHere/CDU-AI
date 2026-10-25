import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { parseToolsFromSource } from '../scripts/check-content.mjs';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import config from '../astro.config.mjs';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const source = await readFile(new URL('../src/data/tools.ts', import.meta.url), 'utf8');
const tools = parseToolsFromSource(source);
const markdown = await createMarkdownProcessor(config.markdown);
const codeSample = (await markdown.render('```js\nconst value = 1; // note\n```')).code;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
let browser;
let server;
let origin;

before(async () => {
  await readFile(path.join(dist, 'index.html'));
  server = createServer(async (req, res) => {
    try {
      let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (pathname.endsWith('/')) pathname += 'index.html';
      const file = path.resolve(dist, '.' + pathname);
      const relative = path.relative(dist, file);
      if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('invalid path');
      res.setHeader('Content-Type', types[path.extname(file)] ?? 'application/octet-stream');
      res.end(await readFile(file));
    } catch {
      res.statusCode = 404;
      res.end('not found');
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
});

after(async () => {
  await browser?.close();
  if (server) await new Promise(resolve => server.close(resolve));
});

async function setup(t, options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ...options });
  t.after(() => context.close());
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  t.after(() => assert.deepEqual(errors, [], '浏览器不应有未处理异常'));
  await page.goto(origin);
  await ready(page);
  return page;
}

async function ready(page) {
  await page.waitForFunction(() => document.querySelector('[data-theme-select="light"]'));
  if (await page.locator('[data-tool-catalog]').count()) {
    await page.waitForSelector('[data-tool-catalog][data-catalog-ready="true"]');
  }
}

async function menu(page) {
  // 键盘触发避免桌面 hover 的延迟开关影响测试动作。
  if (!await page.locator('[data-theme-panel]').isVisible()) {
    await page.locator('[data-theme-trigger]').focus();
    await page.keyboard.press('Enter');
  }
}

async function select(page, id) {
  await menu(page);
  await page.locator(`[data-theme-select="${id}"]`).click();
}

async function create(page) {
  await menu(page);
  await page.locator('[data-theme-create]').click();
}

async function openImport(page, params) {
  await menu(page);
  await page.locator('[data-theme-import-open]').click();
  await page.locator('[data-theme-import-json]').fill(JSON.stringify({ format: 'cdu-ai-theme', version: 1, params }));
}

async function state(page) {
  return page.evaluate(() => ({
    id: localStorage.getItem('cdu-ai-theme'),
    bg: getComputedStyle(document.documentElement).getPropertyValue('--bg').trim(),
    themes: JSON.parse(localStorage.getItem('cdu-ai-custom-themes') ?? '[]'),
  }));
}

async function rejectThemeWrites(page) {
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    window.restoreThemeWrites = () => { Storage.prototype.setItem = original; };
    Storage.prototype.setItem = function(key, value) {
      if (key === 'cdu-ai-custom-themes') throw new DOMException('full', 'QuotaExceededError');
      return original.call(this, key, value);
    };
  });
}

test('预设切换/刷新与 main 工具目录、社区折叠和搜索兼容', async t => {
  const page = await setup(t);
  await select(page, 'preset-forest');
  await page.goto(origin + '/tools/');
  await ready(page);
  assert.equal((await state(page)).id, 'preset-forest');
  assert.equal((await state(page)).bg, '#0e1712');
  assert.equal(await page.locator('[data-tool-id]').count(), tools.length);
  const collapsed = page.locator('[data-collapse]');
  assert.equal(await collapsed.evaluate(el => el.open), false);
  const sample = await page.locator('[data-collapsed="true"]').first().getAttribute('data-tool-id');
  const term = tools.find(tool => tool.id === sample).name;
  await page.locator('[data-filter-search]').fill(term);
  await page.waitForFunction(id => document.querySelector('[data-collapse]').open && !document.querySelector(`[data-tool-id="${id}"]`).hidden, sample);
  assert.equal(await collapsed.evaluate(el => el.open), true);
  assert.equal(await page.locator(`[data-tool-id="${sample}"]`).isVisible(), true);
  await page.locator('[data-clear-filters]').click();
  assert.equal(await page.locator('[data-filter-count]').textContent(), String(tools.length));
  assert.equal(await collapsed.evaluate(el => el.open), false);
  await select(page, 'light');
  await page.reload(); await ready(page);
  assert.equal((await state(page)).bg, '#ffffff');
});

test('工具栏目使用自己的分区，关联条目不重复且搜索限定当前栏目', async t => {
  const page = await setup(t);
  await page.goto(origin + '/tools/?category=workflow');
  await ready(page);
  assert.deepEqual(await page.locator('[data-catalog-category]:visible').evaluateAll(elements => elements.map(element => element.dataset.catalogCategory)), ['workflow']);
  assert.equal(await page.locator('[data-filter-count]').textContent(), '13');
  assert.equal(await page.locator('[data-collapse]:visible').count(), 0);
  assert.equal(await page.locator('[data-tool-id="dify"]').evaluate(element => element.closest('[data-tool-group]').dataset.toolGroup), 'workflow-visual');
  assert.equal(await page.locator('[data-tool-id="comfyui"]').evaluate(element => element.closest('[data-tool-group]').dataset.toolGroup), 'workflow-creative');
  assert.equal(await page.locator('[data-tool-id="langgraph"]').isVisible(), true);
  assert.equal(await page.locator('[data-tool-id]').count(), tools.length);

  await page.locator('[data-filter-value="aigc"]').press('Enter');
  assert.equal(await page.locator('[data-filter-count]').textContent(), '10');
  assert.equal(await page.locator('[data-tool-id="canva"] [data-tool-category-label]').textContent(), 'AIGC');
  await page.locator('[data-filter-search]').fill('Perplexity');
  await page.waitForFunction(() => document.querySelector('[data-filter-count]').textContent === '0');
  assert.equal(await page.locator('[data-empty-state]').isVisible(), true);
  assert.match(await page.locator('[data-filter-scope]').textContent(), /AIGC/);
  await page.locator('[data-filter-value="all"]').press('Enter');
  assert.equal(await page.locator('[data-filter-count]').textContent(), '1');
  assert.equal(await page.locator('[data-tool-id="perplexity"]').isVisible(), true);
  assert.equal(await page.locator('[data-filter-search]').inputValue(), 'Perplexity');
  await page.locator('[data-clear-filters]').click();
  assert.equal(await page.locator('[data-filter-count]').textContent(), String(tools.length));

  await page.goto(origin + '/tools/?category=tts');
  await ready(page);
  assert.equal(await page.locator('[data-filter-value="audio"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('[data-filter-count]').textContent(), '5');
  assert.equal(await page.locator('[data-tool-group="audio-stt"] [data-tool-id="tingwu"]').count(), 1);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), true);
});

test('社区折叠数量跟随搜索及手动展开，开源筛选不借用模型或源码可用状态', async t => {
  const page = await setup(t);
  await page.goto(origin + '/tools/?category=agent');
  await ready(page);
  const collapsed = page.locator('[data-collapse]');
  assert.equal(await collapsed.evaluate(element => element.open), false);
  assert.equal(await page.locator('[data-collapse-count]').textContent(), '10');
  assert.equal(await page.locator('[data-filter-folded-count]').textContent(), '10');
  await page.locator('[data-filter-search]').fill('Cline');
  await page.waitForFunction(() => document.querySelector('[data-filter-count]').textContent === '1');
  assert.equal(await page.locator('[data-collapse-count]').textContent(), '1');
  assert.equal(await collapsed.evaluate(element => element.open), true);
  assert.equal(await page.locator('[data-filter-folded-note]').isVisible(), false);
  await page.locator('[data-filter-search]').fill('');
  await page.waitForFunction(() => document.querySelector('[data-filter-count]').textContent === '32');
  assert.equal(await collapsed.evaluate(element => element.open), false);
  assert.equal(await page.locator('[data-collapse-count]').textContent(), '10');
  await page.locator('[data-collapse] > summary').press('Enter');
  await page.waitForFunction(() => document.querySelector('[data-filter-folded-note]').hidden);
  assert.equal(await collapsed.evaluate(element => element.open), true);

  await page.locator('[data-filter-value="llm-chat"]').press('Enter');
  await page.locator('[data-filter-cap="open-source"]').press('Enter');
  assert.equal(await page.locator('[data-filter-count]').textContent(), '2');
  assert.equal(await page.locator('[data-tool-id="qwen-chat"]').isVisible(), false);
  assert.equal(await page.locator('[data-tool-id="cherry-studio"]').isVisible(), true);
  assert.equal(await page.locator('[data-tool-id="rikkahub"]').isVisible(), true);
});

test('取消、Escape 和保存均终止待执行预览', async t => {
  const page = await setup(t);
  await select(page, 'preset-forest');
  for (const action of ['cancel', 'escape', 'save']) {
    await create(page);
    // 同一事件轮次关闭，确定性覆盖 60ms 窗口，避免测试因机器速度偶然通过。
    await page.evaluate(action => {
      const input = document.querySelector('[data-theme-hex="bg"]');
      input.value = '#123456';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      if (action === 'escape') document.querySelector('[data-theme-editor]').requestClose();
      else document.querySelector(`[data-theme-${action}]`).click();
    }, action);
    await page.waitForTimeout(150);
    assert.equal(await page.locator('[data-theme-editor]').evaluate(el => el.open), false);
    const saved = await state(page);
    assert.equal(saved.bg, action === 'save' ? '#123456' : '#0e1712');
    if (action !== 'save') assert.equal(saved.id, 'preset-forest');
    else assert.equal(saved.themes[0].params.bg, '#123456');
  }
});

test('保存失败不修改原主题，取消及后续保存均不泄漏被取消的修改', async t => {
  const page = await setup(t);
  await create(page);
  await page.locator('[data-theme-field="name"]').fill('original');
  await page.locator('[data-theme-save]').click();
  const original = await state(page);
  await menu(page); await page.locator(`[data-theme-edit="${original.id}"]`).click();
  await page.locator('[data-theme-field="name"]').fill('should-cancel');
  await page.locator('[data-theme-hex="bg"]').fill('#abcdef');
  await rejectThemeWrites(page);
  await page.locator('[data-theme-save]').click();
  assert.equal(await page.locator('[data-theme-editor-error]').isVisible(), true);
  assert.equal(await page.locator('[data-theme-editor]').evaluate(el => el.open), true);
  await page.locator('[data-theme-cancel]').click();
  await page.waitForTimeout(100);
  assert.deepEqual(await state(page), original);
  assert.equal(await page.locator(`[data-theme-select="${original.id}"]`).getAttribute('title'), 'original');
  await page.evaluate(() => window.restoreThemeWrites());
  await create(page); await page.locator('[data-theme-field="name"]').fill('second');
  await page.locator('[data-theme-save]').click();
  const saved = (await state(page)).themes;
  assert.equal(saved.length, 2);
  assert.deepEqual(saved.find(theme => theme.id === original.id), original.themes[0]);
});

test('导入失败显示错误并保留旧主题，允许重试，刷新可恢复成功导入的主题', async t => {
  const page = await setup(t);
  await select(page, 'preset-dusk');
  const original = await state(page);
  await openImport(page, { name: 'import-retry', bg: '#663399' });
  await rejectThemeWrites(page);
  await page.locator('[data-theme-import-confirm]').click();
  assert.equal(await page.locator('[data-theme-import]').evaluate(el => el.open), true);
  assert.equal(await page.locator('[data-theme-import-error]').isVisible(), true);
  assert.deepEqual(await state(page), original);
  await page.evaluate(() => window.restoreThemeWrites());
  await page.locator('[data-theme-import-confirm]').click();
  assert.equal(await page.locator('[data-theme-import]').evaluate(el => el.open), false);
  const imported = await state(page);
  assert.equal(imported.themes.length, 1);
  assert.equal(imported.bg, '#663399');
  await page.reload(); await ready(page);
  assert.deepEqual(await state(page), imported);
});

test('图片主题触发真实存储超限时保留原主题且错误可见', async t => {
  const page = await setup(t);
  await select(page, 'preset-ocean');
  const original = await state(page);
  // 重复数据用于确定性填满真实 localStorage；无需加载远程图片或模拟 setItem。
  const url = 'data:image/png;base64,' + 'A'.repeat(2_800_000);
  await openImport(page, { name: 'large-image', bgImage: { enabled: true, url } });
  await page.locator('[data-theme-import-confirm]').click();
  assert.equal(await page.locator('[data-theme-import-error]').isVisible(), true);
  assert.equal(await page.locator('[data-theme-import]').evaluate(el => el.open), true);
  assert.deepEqual(await state(page), original);
  await page.locator('[data-theme-import-cancel]').click();
  await page.reload(); await ready(page);
  assert.deepEqual(await state(page), original);
});

test('删除写入失败保留主题，恢复写入后可正常删除', async t => {
  const page = await setup(t);
  await create(page); await page.locator('[data-theme-save]').click();
  const original = await state(page);
  await menu(page); await rejectThemeWrites(page);
  const del = page.locator(`[data-theme-delete="${original.id}"]`);
  await del.click(); await del.click();
  assert.equal(await page.locator('[data-theme-menu-error]').isVisible(), true);
  assert.deepEqual(await state(page), original);
  await page.evaluate(() => window.restoreThemeWrites());
  await del.click();
  assert.equal((await state(page)).themes.length, 0);
  assert.equal((await state(page)).id, 'light');
});

test('非法字段 JSON 安全回退，图片地址可逐字输入', async t => {
  const page = await setup(t);
  await openImport(page, { bg: { toString: null }, radius: { valueOf: null } });
  await page.locator('[data-theme-import-confirm]').click();
  assert.equal((await state(page)).bg, '#f5f6fa');
  await create(page);
  await page.locator('[data-theme-image-enabled]').check();
  await page.locator('[data-theme-image-url]').pressSequentially('https://example.com/image.png');
  assert.equal(await page.locator('[data-theme-image-url]').inputValue(), 'https://example.com/image.png');
  await page.locator('[data-theme-cancel]').click();
});

test('取消后的异步图片读取不会修改下一次打开的草稿', async t => {
  const page = await setup(t);
  await create(page);
  await page.evaluate(() => {
    const Reader = window.FileReader;
    window.FileReader = class extends Reader {
      readAsDataURL(file) { setTimeout(() => super.readAsDataURL(file), 180); }
    };
  });
  await page.locator('[data-theme-form] input[type="file"]').setInputFiles({
    name: 'pixel.png', mimeType: 'image/png',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==', 'base64'),
  });
  await page.locator('[data-theme-cancel]').click();
  await create(page);
  await page.waitForTimeout(300);
  assert.equal(await page.locator('[data-theme-image-enabled]').isChecked(), false);
  await page.locator('[data-theme-save]').click();
  assert.equal((await state(page)).themes[0].params.bgImage.url, '');
});

test('手机端菜单及浅色按钮始终在屏幕内，旋转后重新定位', async t => {
  const page = await setup(t, { isMobile: true, hasTouch: true });
  for (const width of [320, 375, 390, 430, 560]) {
    await page.setViewportSize({ width, height: 844 });
    await menu(page); await page.waitForTimeout(250);
    for (const selector of ['[data-theme-panel]', '[data-theme-select="light"]']) {
      const rect = await page.locator(selector).boundingBox();
      assert.ok(rect.x >= 0 && rect.x + rect.width <= width + 1, `${width}px ${selector}: ${JSON.stringify(rect)}`);
    }
    await page.locator('[data-theme-select="light"]').tap();
    await page.locator('[data-theme-trigger]').tap();
  }
});

test('指南样式中代码底色、文字和注释色实际生效，切回内置主题恢复高亮', async t => {
  const page = await setup(t);
  await openImport(page, { code: { bg: '#123456', fg: '#ffffff', muted: '#ccddaa' } });
  await page.locator('[data-theme-import-confirm]').click();
  await page.goto(origin + '/guide/'); await ready(page);
  // 使用实际 Markdown 渲染产物验证指南 CSS，不向正式内容集合写入测试文章。
  await page.locator('main').evaluate((el, html) => {
    el.insertAdjacentHTML('beforeend', `<article class="notion-page"><div class="notion-prose">${html}</div></article>`);
  }, codeSample);
  const color = locator => locator.evaluate(el => getComputedStyle(el).color);
  const prose = page.locator('.notion-prose');
  const token = prose.locator('span[style*="--theme-code-token-fg"]').first();
  const comment = prose.locator('span[style*="--theme-code-token-muted"]').first();
  assert.equal(await prose.locator('pre').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(18, 52, 86)');
  assert.equal(await color(token), 'rgb(255, 255, 255)');
  assert.equal(await color(comment), 'rgb(204, 221, 170)');
  await select(page, 'light');
  assert.notEqual(await color(token), 'rgb(255, 255, 255)');
  assert.notEqual(await color(comment), 'rgb(204, 221, 170)');
});
