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
  browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}),
    ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {}),
  });
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
  if (await page.locator('[data-glossary-catalog]').count()) {
    await page.waitForSelector('[data-glossary-catalog][data-glossary-ready="true"]');
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
  await page.locator('[data-theme-editor]').waitFor({ state: 'visible' });
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

test('指南入门路径在桌面和手机目录中衔接首次实践', async t => {
  const page = await setup(t, { reducedMotion: 'reduce' });
  await page.goto(origin + '/guide/chat-ai-to-agent/');
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 844 });
    const nav = width === 390 ? page.locator('.guide-mobile-nav') : page.locator('.guide-sidebar');
    if (width === 390) await nav.locator('summary').first().click();
    const group = nav.locator('[data-group="getting-started"]');
    const links = group.locator('a');
    assert.deepEqual(await links.evaluateAll(els => els.map(el => el.getAttribute('href'))), [
      '/guide/chat-ai-to-agent/', '/guide/first-agent/', '/guide/task-description/', '/guide/permissions-and-review/',
    ]);
    assert.equal(await group.locator('a[href="/guide/first-agent/"]').isVisible(), true);
    assert.equal(await page.locator('.guide-pager [rel="next"]').getAttribute('href'), '/guide/first-agent/');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  }
  await page.goto(origin + '/guide/first-agent/');
  assert.equal(await page.locator('[data-first-agent]').isVisible(), true);
  assert.equal(await page.locator('.guide-pager [rel="prev"]').getAttribute('href'), '/guide/chat-ai-to-agent/');
});

test('首次 Agent 工具选择联动三章并保持正文位置，键盘可切换', async t => {
  const page = await setup(t, { reducedMotion: 'reduce' });
  await page.goto(origin + '/guide/first-agent/');
  await page.locator('[data-agent-ready="true"]').waitFor();
  assert.equal(await page.locator('input[value="workbuddy"]').isChecked(), true);
  const workbuddyMedia = ['M01', 'M03-W', 'M04-W'];
  const zcodeMedia = ['M02', 'M03-Z', 'M04-Z'];
  for (const id of workbuddyMedia) await page.locator(`[data-agent-media="${id}"]`).waitFor({ state: 'visible' });
  for (const id of zcodeMedia) await page.locator(`[data-agent-media="${id}"]`).waitFor({ state: 'hidden' });
  const before = await page.locator('[data-first-agent] h2').last().evaluate(el => el.getBoundingClientRect().top + scrollY);
  await page.locator('input[value="workbuddy"]').focus();
  const scrollBefore = await page.evaluate(() => scrollY);
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('input[value="zcode"]').isChecked(), true);
  for (const id of zcodeMedia) await page.locator(`[data-agent-media="${id}"]`).waitFor({ state: 'visible' });
  for (const id of workbuddyMedia) await page.locator(`[data-agent-media="${id}"]`).waitFor({ state: 'hidden' });
  assert.equal(await page.locator('a[href="https://zcode.z.ai/cn/docs/configuration"]').isVisible(), true);
  assert.equal(await page.getByRole('heading', { name: 'WorkBuddy：适用于小白', exact: true }).isVisible(), true);
  assert.equal(await page.getByRole('heading', { name: 'ZCode：目前国产最好的Agent', exact: true }).isVisible(), true);
  const after = await page.locator('[data-first-agent] h2').last().evaluate(el => el.getBoundingClientRect().top + scrollY);
  assert.ok(Math.abs(after - before) < 1, '两种指导切换应保留后续正文位置');
  assert.ok(Math.abs(await page.evaluate(() => scrollY) - scrollBefore) < 2, '切换不应改变页面滚动位置');
  await page.keyboard.press('ArrowLeft');
  assert.equal(await page.locator('input[value="workbuddy"]').isChecked(), true);
  assert.equal(await page.locator('[data-first-agent] iframe').count(), 0);
});

test('首次 Agent 四条提示词实际复制为完整纯文本，包含真实 URL 和统一文件名', async t => {
  const page = await setup(t);
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(origin + '/guide/first-agent/');
  for (const id of ['task', 'visual', 'content', 'mobile']) {
    const card = page.locator(`[data-copy-card="${id}"]`);
    const expected = await card.locator('[data-agent-prompt]').textContent();
    await card.locator('button').click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    assert.equal(copied.replace(/\r\n/g, '\n'), expected.trim());
    assert.equal(await card.locator('[data-copy-label]').innerText(), '已复制');
    assert.equal(await card.locator('[data-copy-status]').innerText(), '已复制');
    if (id === 'task') {
      assert.match(copied, /3\. 请生成一个名为 CDU\.html 的文件/);
      assert.match(copied, /https:\/\/www\.cdu\.edu\.cn\//);
      assert.doesNotMatch(copied, /`|\[成都大学官方网站\]\(/);
      assert.match(copied, /完成后，请告诉我如何打开这个网页。$/);
    }
  }
});

test('首次 Agent 复制回退准确处理成功和失败，失败后保留手动选择', async t => {
  const page = await setup(t);
  await page.goto(origin + '/guide/first-agent/');
  const card = page.locator('[data-copy-card="task"]');
  const button = card.locator('button');
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('unavailable'); } } });
    document.execCommand = () => {
      window.fallbackCopied = document.querySelector('textarea').value;
      return true;
    };
  });
  await button.press('Enter');
  assert.equal(await page.evaluate(() => window.fallbackCopied), (await card.locator('[data-agent-prompt]').textContent()).trim());
  assert.equal(await card.locator('[data-copy-label]').innerText(), '已复制');
  assert.equal(await button.evaluate(el => el === document.activeElement), true);
  await page.evaluate(() => { document.execCommand = () => false; });
  await button.press('Enter');
  assert.match(await card.locator('[data-copy-status]').innerText(), /复制失败.*手动复制/);
  assert.equal(await button.getAttribute('data-copied'), 'false');
  const selected = await card.locator('[data-agent-prompt]').evaluate(el => {
    getSelection().selectAllChildren(el);
    return getSelection().toString();
  });
  assert.equal(selected, (await card.locator('[data-agent-prompt]').textContent()).trim());
});

test('首次 Agent 截图和占位适配浅深色和窄屏，无 JS 时仍可阅读并加载截图', async t => {
  const page = await setup(t, { reducedMotion: 'reduce' });
  await page.goto(origin + '/guide/first-agent/');
  assert.equal(await page.locator('[data-agent-media]').count(), 10);
  for (const theme of ['light', 'dark']) {
    await select(page, theme);
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (const tool of ['workbuddy', 'zcode']) {
        await page.locator(`input[value="${tool}"]`).check();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${theme} ${width} ${tool}`);
      }
    }
  }
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  t.after(() => context.close());
  const plain = await context.newPage();
  await plain.goto(origin + '/guide/first-agent/');
  assert.equal(await plain.locator('[data-agent-media]:visible').count(), 10);
  for (const image of await plain.locator('[data-agent-media] img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(img => img.decode());
  }
  assert.equal(await plain.locator('[data-agent-picker]').isVisible(), false);
  assert.equal(await plain.locator('[data-copy-target]:visible').count(), 0);
  assert.equal(await plain.locator('[data-agent-prompt]').count(), 4);
  assert.equal(await plain.locator('[data-agent-tool="workbuddy"]').first().isVisible(), true);
  assert.equal(await plain.locator('[data-agent-tool="zcode"]').first().isVisible(), true);
  assert.equal(await plain.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
});

test('首次 Agent 截图按原比例适配且无占位虚线框冲突，修改前后对比等高且支持灯箱与错误回退', async t => {
  const page = await setup(t, { reducedMotion: 'reduce' });
  await page.goto(origin + '/guide/first-agent/');
  await page.locator('[data-agent-ready="true"]').waitFor();

  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const tool of ['workbuddy', 'zcode']) {
      await page.locator(`input[value="${tool}"]`).check();
      const readyFigures = page.locator('[data-agent-media][data-media-state="ready"]');
      const count = await readyFigures.count();
      for (let i = 0; i < count; i++) {
        const figure = readyFigures.nth(i);
        if (!await figure.isVisible()) continue;
        const id = await figure.getAttribute('data-agent-media');
        const img = figure.locator('img[data-media-content]');
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(el => el.decode());
        const metrics = await figure.evaluate(el => {
          const stage = el.querySelector('.first-agent-media__stage');
          const zoom = el.querySelector('[data-image-zoom]');
          const pic = el.querySelector('img[data-media-content]');
          const sr = stage.getBoundingClientRect();
          const ir = pic.getBoundingClientRect();
          const zr = zoom.getBoundingClientRect();
          return {
            naturalRatio: pic.naturalWidth / pic.naturalHeight,
            renderedRatio: ir.width / ir.height,
            widthDiff: Math.abs(sr.width - ir.width),
            heightDiff: Math.abs(sr.height - ir.height),
            zoomHeightDiff: Math.abs(zr.height - ir.height),
            borderStyle: getComputedStyle(stage).borderTopStyle,
          };
        });
        assert.ok(Math.abs(metrics.renderedRatio - metrics.naturalRatio) < 0.02, `${viewport.width}px ${tool} ${id} 图片比例失真`);
        assert.ok(metrics.widthDiff <= 4 && metrics.heightDiff <= 4, `${viewport.width}px ${tool} ${id} 舞台与图片尺寸偏差过大 (${metrics.widthDiff}, ${metrics.heightDiff})`);
        assert.ok(metrics.zoomHeightDiff <= 1, `${viewport.width}px ${tool} ${id} 灯箱触发器存在多余边距`);
        assert.equal(metrics.borderStyle, 'solid', `${viewport.width}px ${tool} ${id} 已插图不应显示虚线占位框`);
      }

      const after = page.locator('[data-agent-media="M07-A"]');
      assert.equal(await after.getAttribute('data-media-state'), 'ready');
      assert.equal(await after.locator('img[data-media-content]').getAttribute('src'), '/guide/first-agent/m07-after.webp');
      assert.match(await after.locator('img[data-media-content]').getAttribute('alt'), /调整视觉风格/);
    }

    if (viewport.width === 1440) {
      const comparisonDiff = await page.evaluate(() => {
        const b = document.querySelector('[data-agent-media="M07-B"] .first-agent-media__stage').getBoundingClientRect();
        const a = document.querySelector('[data-agent-media="M07-A"] .first-agent-media__stage').getBoundingClientRect();
        return Math.abs(b.height - a.height);
      });
      assert.ok(comparisonDiff <= 2, `桌面端对比区 M07-A 与 M07-B 高度差应 <= 2px（实际 ${comparisonDiff}px）`);
    }
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator('input[value="workbuddy"]').check();
  const m01 = page.locator('[data-agent-media="M01"]');
  const zoomBtn = m01.locator('[data-image-zoom]');
  await zoomBtn.scrollIntoViewIfNeeded();
  await zoomBtn.click();
  await page.waitForFunction(() => document.querySelector('[data-image-lightbox]')?.open === true);
  await page.locator('[data-lightbox-close]').click();
  await page.waitForFunction(() => !document.querySelector('[data-image-lightbox]')?.open);

  await m01.locator('img[data-media-content]').evaluate(img => img.dispatchEvent(new Event('error')));
  assert.equal(await m01.getAttribute('data-media-state'), 'pending');
  assert.equal(await zoomBtn.isVisible(), false, '图片加载失败后应隐藏灯箱按钮');
  assert.equal(await m01.locator('[data-media-placeholder]').isVisible(), true, '图片加载失败后应恢复待补充占位');
  assert.equal(await m01.locator('.first-agent-media__stage').evaluate(el => getComputedStyle(el).borderTopStyle), 'dashed');
});

test('全站搜索保护中文输入法，章节结果可用键盘打开并落到指南首页锚点', async t => {
  const page = await setup(t, { reducedMotion: 'reduce' });
  // 此例验证搜索和键盘导航；关闭无关的原生跨文档动效。
  // Chrome 对普通链接也会报告无脚本堆栈的 ViewTransition opt-in 中止异常。
  await page.addStyleTag({ content: '@view-transition { navigation: none; }' });
  const trigger = page.locator('[data-search-open]').first();
  await trigger.click();
  const input = page.locator('[data-search-input]');
  await input.fill('Transformer');
  await page.locator('.search-result').first().waitFor();
  const href = await page.locator('.search-result').first().getAttribute('href');
  assert.ok(href.startsWith('/guide/#'));
  await input.dispatchEvent('keydown', { key: 'Enter', isComposing: true });
  assert.equal(new URL(page.url()).pathname, '/');
  assert.equal(await page.locator('[data-search-dialog]').evaluate(el => el.open), true);
  await input.dispatchEvent('compositionstart');
  await input.dispatchEvent('keydown', { key: 'Enter' });
  assert.equal(new URL(page.url()).pathname, '/');
  await input.dispatchEvent('compositionend');
  await input.press('ArrowDown');
  assert.equal(await page.locator('.search-result').first().evaluate(el => el === document.activeElement), true);
  await page.keyboard.press('ArrowUp');
  assert.equal(await input.evaluate(el => el === document.activeElement), true);
  await input.press('Escape');
  await page.waitForFunction(() => !document.querySelector('[data-search-dialog]').open);
  assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
  await trigger.click();
  await input.press('Enter');
  await page.waitForURL(url => url.pathname === '/guide/' && Boolean(url.hash));
  await page.waitForLoadState('load');
  await ready(page);
  assert.equal(await page.evaluate(() => Boolean(document.getElementById(decodeURIComponent(location.hash.slice(1))))), true);
});

test('搜索展示匹配总数与截断提示，手机空结果仍可清楚阅读', async t => {
  const page = await setup(t, { viewport: { width: 390, height: 844 } });
  await page.route('**/search-index.json', route => route.fulfill({ json: Array.from({ length: 12 }, (_,i) => ({ type: '工具', title: `测试工具 ${i}`, description: '测试结果', keywords: '测试', href: '/tools/' })) }));
  await page.locator('[data-search-open]').click();
  await page.locator('[data-search-input]').fill('测试');
  await page.waitForFunction(() => document.querySelectorAll('.search-result').length === 10);
  assert.match(await page.locator('[data-search-status]').textContent(), /找到 12 条相关结果，显示前 10 条/);
  assert.equal(await page.locator('[data-search-dialog]').evaluate(el => el.scrollWidth <= el.clientWidth), true);
  await page.locator('[data-search-input]').fill('无匹配词');
  assert.equal(await page.locator('.search-result').count(), 0);
  assert.match(await page.locator('[data-search-status]').textContent(), /没有找到/);
});

test('搜索加载失败可重新打开或点击重试，成功后复用索引', async t => {
  const page = await setup(t);
  let attempts = 0;
  await page.route('**/search-index.json', route => {
    attempts += 1;
    return attempts < 3 ? route.fulfill({ status: 503, body: 'unavailable' }) : route.fulfill({ json: [{ type: '页面', title: '恢复成功', description: '恢复成功', keywords: '恢复', href: '/guide/' }] });
  });
  await page.locator('[data-search-open]').click();
  await page.locator('[data-search-retry]').waitFor({ state: 'visible' });
  await page.locator('[data-search-input]').press('Escape');
  await page.waitForFunction(() => !document.querySelector('[data-search-dialog]').open);
  await page.locator('[data-search-open]').click();
  await page.waitForFunction(() => document.querySelector('[data-search-retry]').hidden === false);
  assert.equal(attempts, 2);
  await page.locator('[data-search-retry]').click();
  await page.locator('.search-result').waitFor();
  assert.equal(attempts, 3);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('[data-search-dialog]').open);
  await page.locator('[data-search-open]').click();
  assert.equal(attempts, 3);
  assert.equal(await page.locator('[data-search-retry]').isVisible(), false);
});

test('普通阅读及预设切换不加载主题编辑器，首次编辑按需加载且只初始化一次', async t => {
  const page = await setup(t);
  const editorResources = () => page.evaluate(() => performance.getEntriesByType('resource').filter(entry => /\/theme-editor\.[^/]+\.(js|css)$/.test(new URL(entry.name).pathname)).map(entry => entry.name));
  assert.deepEqual(await editorResources(), []);
  assert.equal(await page.locator('[data-theme-editor]').count(), 0);
  await select(page, 'dark');
  assert.deepEqual(await editorResources(), []);
  await create(page);
  assert.equal((await editorResources()).length, 2, '编辑器脚本与样式均应延迟到首次打开');
  await page.locator('[data-theme-cancel]').click();
  await create(page);
  assert.equal(await page.locator('[data-theme-editor]').count(), 1);
  assert.equal(await page.locator('[data-theme-colorpop]').count(), 1);
  assert.equal((await editorResources()).length, 2);
});

test('主题编辑器首次加载期间按 Escape 取消，不会在加载完成后意外弹出', async t => {
  const page = await setup(t);
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  let requested = false;
  await page.route('**/theme-editor.*.js', async route => { requested = true; await gate; await route.continue(); });
  t.after(() => release());
  await menu(page);
  await page.locator('[data-theme-create]').click();
  await page.waitForFunction(() => document.querySelector('[data-theme-panel]').getAttribute('aria-busy') === 'true');
  await page.keyboard.press('Escape');
  release();
  await page.waitForFunction(() => document.querySelector('[data-theme-colorpop]'));
  assert.equal(requested, true);
  assert.equal(await page.locator('[data-theme-editor]').evaluate(el => el.open), false);
  await create(page);
  assert.equal(await page.locator('[data-theme-editor]').evaluate(el => el.open), true);
});

test('编辑器样式加载失败显示错误，重试后只创建一套对话框', async t => {
  const page = await setup(t);
  let attempts = 0;
  await page.route('**/theme-editor.*.css', route => {
    attempts += 1;
    return attempts === 1 ? route.fulfill({ status: 503, body: 'unavailable' }) : route.continue();
  });
  await menu(page);
  await page.locator('[data-theme-create]').click();
  await page.locator('[data-theme-menu-error]').waitFor({ state: 'visible' });
  assert.equal(await page.locator('[data-theme-editor]').count(), 0);
  await create(page);
  assert.equal(attempts, 2);
  assert.equal(await page.locator('[data-theme-editor]').count(), 1);
});

test('预设切换/刷新与 main 工具目录、开源工具折叠和搜索兼容', async t => {
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

test('旧工作流及办公链接保留搜索，重分类后的 Agent 与 AIGC 不重复', async t => {
  const page = await setup(t);
  await page.goto(origin + '/tools/?category=workflow&q=Dify');
  await ready(page);
  assert.equal(await page.locator('[data-filter-value="all"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('[data-filter-count]').textContent(), '1');
  assert.equal(await page.locator('[data-tool-id="dify"]').evaluate(element => element.closest('[data-tool-group]').dataset.toolGroup), 'api-applications');
  await page.goto(origin + '/tools/?category=office&q=Gamma');
  await ready(page);
  assert.equal(await page.locator('[data-filter-value="all"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('[data-filter-value="office"]').count(), 0);
  assert.equal(await page.locator('[data-filter-count]').textContent(), '1');
  assert.equal(await page.locator('[data-tool-id="gamma"]').evaluate(element => element.closest('[data-tool-group]').dataset.toolGroup), 'aigc-presentation');
  await page.goto(origin + '/tools/?category=agent');
  await ready(page);
  assert.deepEqual(await page.locator('[data-catalog-category]:visible').evaluateAll(elements => elements.map(element => element.dataset.catalogCategory)), ['agent']);
  assert.equal(await page.locator('[data-filter-count]').textContent(), String(tools.filter(tool => tool.category === 'agent').length));
  assert.equal(await page.locator('[data-filter-value="workflow"]').count(), 0);
  assert.equal(await page.locator('[data-filter-value="agent"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('[data-tool-id="dify"]').isVisible(), false);
  assert.equal(await page.locator('[data-tool-id="comfyui"]').isVisible(), false);
  assert.equal(await page.locator('[data-tool-id="cherry-studio"]').evaluate(element => element.closest('[data-tool-group]').dataset.toolGroup), 'agent-open-source');
  assert.equal(await page.locator('[data-tool-id="ragflow"]').evaluate(element => element.closest('[data-tool-group]').dataset.toolGroup), 'agent-open-source');
  assert.equal(await page.locator('[data-tool-id="cherry-studio"]').isVisible(), true);
  assert.equal(await page.locator('[data-tool-id="ragflow"]').isVisible(), true);
  assert.equal(await page.locator('[data-tool-id="langgraph"]').isVisible(), false);
  assert.equal(await page.locator('[data-tool-id]').count(), tools.length);

  await page.locator('[data-filter-search]').fill('Personal Agent');
  await page.waitForFunction(() => document.querySelector('[data-filter-count]').textContent === '6');
  assert.deepEqual(await page.locator('[data-tool-group]:visible').evaluateAll(elements => elements.map(el => el.dataset.toolGroup)), ['agent-personal']);
  assert.equal(await page.locator('[data-tool-id="meta-muse"]').isVisible(), true);
  assert.equal(await page.locator('[data-tool-id="openclaw"]').isVisible(), true);
  await page.locator('[data-filter-search]').fill('');
  await page.waitForFunction(expected => document.querySelector('[data-filter-count]').textContent === expected, String(tools.filter(tool => tool.category === 'agent').length));

  await page.locator('[data-filter-value="aigc"]').press('Enter');
  assert.equal(await page.locator('[data-filter-count]').textContent(), '11');
  assert.equal(await page.locator('[data-tool-id="civitai"]').isVisible(), false);
  assert.equal(await page.locator('[data-tool-id="canva"] [data-tool-category-label]').textContent(), 'AIGC');
  assert.equal(await page.locator('[data-tool-id="canva"]').evaluate(element => element.closest('[data-tool-group]').dataset.toolGroup), 'aigc-design');
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

test('开源 Agent 折叠数量跟随搜索及手动展开，开源筛选不借用模型或源码可用状态', async t => {
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
  await page.waitForFunction(expected => document.querySelector('[data-filter-count]').textContent === expected, String(tools.filter(tool => tool.category === 'agent').length));
  assert.equal(await collapsed.evaluate(element => element.open), false);
  assert.equal(await page.locator('[data-collapse-count]').textContent(), '10');
  await page.locator('[data-collapse] > summary').press('Enter');
  await page.waitForFunction(() => document.querySelector('[data-filter-folded-note]').hidden);
  assert.equal(await collapsed.evaluate(element => element.open), true);

  await page.locator('[data-filter-value="llm-chat"]').press('Enter');
  assert.equal((await page.locator('[data-tool-id="qwen-chat"]').getAttribute('data-capabilities') ?? '').includes('open-source'), false);
  assert.equal((await page.locator('[data-tool-id="rikkahub"]').getAttribute('data-capabilities') ?? '').includes('open-source'), true);
  await page.locator('[data-filter-search]').fill('RikkaHub');
  await page.waitForFunction(() => document.querySelector('[data-filter-count]').textContent === '1');
  assert.equal(await page.locator('[data-filter-count]').textContent(), '1');
  assert.equal(await page.locator('[data-tool-id="qwen-chat"]').isVisible(), false);
  assert.equal(await page.locator('[data-tool-id="cherry-studio"]').isVisible(), false);
  assert.equal(await page.locator('[data-tool-id="rikkahub"]').isVisible(), true);
});

test('桌面深度滚动后筛选回到列表开头，搜索保留输入焦点', async t => {
  const page = await setup(t, { reducedMotion: 'no-preference' });
  await page.goto(origin + '/tools/'); await ready(page);
  const scrollDown = async () => {
    await page.evaluate(() => window.scrollTo({ top: 4000, behavior: 'instant' }));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.ok(await page.locator('[data-catalog-results]').evaluate(el => el.getBoundingClientRect().top < -250), '先确保列表开头已在视口上方');
  };
  const atStart = async () => {
    await page.waitForFunction(() => {
      const results = document.querySelector('[data-catalog-results]');
      const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + parseFloat(getComputedStyle(results).scrollMarginTop);
      return Math.abs(results.getBoundingClientRect().top - offset) < 2;
    });
    const top = await page.locator('[data-catalog-results]').evaluate(el => el.getBoundingClientRect().top);
    const headerBottom = await page.locator('[data-site-header]').evaluate(el => el.getBoundingClientRect().bottom);
    assert.ok(top >= headerBottom && top < headerBottom + 100, '筛选后应回到固定导航下方的列表开头');
  };

  await scrollDown();
  await page.locator('[data-filter-value="agent"]').click();
  await atStart();
  assert.equal(await page.locator('[data-filter-value="agent"]').evaluate(el => el === document.activeElement), true);
  await scrollDown();
  await page.locator('[data-filter-value="llm-chat"]').press('Enter');
  await atStart();
  assert.equal(await page.locator('[data-filter-value="llm-chat"]').getAttribute('aria-pressed'), 'true');
  await page.locator('[data-clear-filters]').click();
  await atStart();
  assert.equal(await page.locator('[data-filter-count]').textContent(), String(tools.length));

  await scrollDown();
  const search = page.locator('[data-filter-search]');
  await search.fill('Agent');
  await page.waitForFunction(() => new URLSearchParams(location.search).get('q') === 'agent');
  await atStart();
  assert.equal(await search.evaluate(el => el === document.activeElement), true);
  await search.fill('不存在的工具-滚动回归');
  await page.waitForFunction(() => document.querySelector('[data-filter-count]').textContent === '0');
  await atStart();
  assert.equal(await search.evaluate(el => el === document.activeElement), true);
  assert.equal(await page.locator('[data-empty-state]').isVisible(), true);

  await page.locator('[data-clear-filters]').click();
  await atStart();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await scrollDown();
  await page.locator('[data-filter-value="agent"]').click();
  assert.ok(await page.locator('[data-catalog-results]').evaluate(el => el.getBoundingClientRect().top >= 0), '减少动效时直接定位，不等待滚动动画');
});

test('术语表深度滚动后筛选回到结果开头，保留焦点并尊重减少动效', async t => {
  const page = await setup(t, { reducedMotion: 'no-preference' });
  await page.goto(origin + '/glossary/'); await ready(page);
  const results = page.locator('.glossary-main .results-bar');
  const scrollDown = async () => {
    await page.evaluate(() => window.scrollTo({ top: 2000, behavior: 'instant' }));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.ok(await results.evaluate(el => el.getBoundingClientRect().top < -250));
  };
  const atStart = async () => {
    // 平滑滚动由合成器驱动，CI 负载高时可能超过 3 秒，因此放宽等待并回报实际位置。
    const metrics = () => page.evaluate(() => {
      const results = document.querySelector('.glossary-main .results-bar');
      return {
        top: results.getBoundingClientRect().top,
        offset: parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + parseFloat(getComputedStyle(results).scrollMarginTop),
        scrollY: window.scrollY,
      };
    });
    try {
      await page.waitForFunction(() => {
        const results = document.querySelector('.glossary-main .results-bar');
        const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + parseFloat(getComputedStyle(results).scrollMarginTop);
        return Math.abs(results.getBoundingClientRect().top - offset) < 2;
      }, null, { timeout: 10000 });
    } catch (error) {
      const state = await metrics();
      throw new Error('筛选后没有定位到结果开头：top=' + state.top + '，offset=' + state.offset + '，scrollY=' + state.scrollY + '（' + error.message + '）');
    }
    const top = (await metrics()).top;
    const headerBottom = await page.locator('[data-site-header]').evaluate(el => el.getBoundingClientRect().bottom);
    assert.ok(top >= headerBottom && top < headerBottom + 100, '定位到固定导航下方的术语结果开头');
  };

  await scrollDown();
  await page.locator('[data-filter-value="vibe-branch"]').click();
  await atStart();
  assert.equal(await page.locator('[data-filter-value="vibe-branch"]').evaluate(el => el === document.activeElement), true);
  await scrollDown();
  await page.locator('[data-filter-value="ai-main"]').press('Enter');
  await atStart();
  await page.locator('[data-filter-value="basics"]').click();
  await page.locator('[data-clear-filters]').click();
  await atStart();
  const search = page.locator('[data-filter-search]');
  assert.equal(await search.evaluate(el => el === document.activeElement), true);

  await scrollDown();
  await search.fill('模型');
  await page.waitForFunction(() => new URLSearchParams(location.search).get('q') === '模型');
  await atStart();
  assert.equal(await search.evaluate(el => el === document.activeElement), true);
  await search.fill('不存在的术语-滚动回归');
  await page.locator('[data-empty-state]').waitFor({ state: 'visible' });
  await atStart();
  await page.locator('[data-clear-filters]').click();
  await atStart();

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await scrollDown();
  await page.locator('[data-filter-value="vibe-branch"]').click();
  assert.ok(await results.evaluate(el => el.getBoundingClientRect().top >= 0), '减少动效时直接定位');
});

test('术语表历史恢复和手机输入不触发筛选回顶', async t => {
  const page = await setup(t, { reducedMotion: 'no-preference' });
  await page.goto(origin + '/glossary/'); await ready(page);
  await page.evaluate(() => window.scrollTo({ top: 1400, behavior: 'instant' }));
  const before = await page.evaluate(() => scrollY);
  await page.evaluate(() => {
    history.replaceState(null, '', '?category=ai-main');
    dispatchEvent(new PopStateEvent('popstate'));
  });
  await page.waitForTimeout(400);
  assert.ok(Math.abs(await page.evaluate(() => scrollY) - before) < 2, '历史恢复保留阅读位置');

  await page.setViewportSize({ width: 390, height: 680 });
  await page.goto(origin + '/glossary/'); await ready(page);
  const search = page.locator('[data-filter-search]');
  await search.fill('模型');
  await page.waitForFunction(() => new URLSearchParams(location.search).get('q') === '模型');
  await page.waitForTimeout(400);
  assert.equal(await search.evaluate(el => el === document.activeElement), true);
  const box = await search.boundingBox();
  assert.ok(box.y >= 0 && box.y + box.height <= 680, '手机输入时搜索框留在视口内');
});

test('手机工具目录在短屏和普通动效下持续可读，按 App 网格展示且无横向溢出', async t => {
  const page = await setup(t, { isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
  for (const viewport of [{ width: 375, height: 667 }, { width: 390, height: 664 }, { width: 360, height: 640 }, { width: 320, height: 568 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto(origin + '/tools/');
    await ready(page);
    const firstTileBox = await page.locator('[data-tool-id="deepseek"]').boundingBox();
    assert.ok(firstTileBox && firstTileBox.y + firstTileBox.height <= viewport.height, `${viewport.width}×${viewport.height} 首屏应直接露出第一排工具图标`);
    await page.evaluate(() => window.scrollTo({ top: 1400, behavior: 'instant' }));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(await page.locator('[data-tool-catalog]').evaluate(el => getComputedStyle(el).opacity), '1', `${viewport.width}×${viewport.height} 目录不能因显现动画保持透明`);
    assert.equal(await page.locator('[data-tool-catalog]').evaluate(el => el.dataset.mobileAppGrid), 'true');
    const cols = await page.locator('.tool-grid').first().evaluate(el => getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/).length);
    assert.equal(cols, viewport.width <= 359 ? 3 : 4, `${viewport.width}px 网格列数应适配屏幕宽度`);
    assert.equal(await page.locator('[data-tool-id="deepseek"] .tool-card__summary').isVisible(), false);
    assert.equal(await page.locator('[data-tool-id="deepseek"] [data-tool-tile]').isVisible(), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  }
});

test('手机端点击 App 图标打开底部详情抽屉，支持键盘关闭与桌面断点切换', async t => {
  const page = await setup(t, { viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true });
  await page.goto(origin + '/tools/');
  await ready(page);

  const deepseekTile = page.locator('[data-tool-id="deepseek"] [data-tool-tile]');
  await deepseekTile.click();
  const sheet = page.locator('[data-tool-sheet]');
  await page.waitForFunction(() => document.querySelector('[data-tool-sheet]').open);
  assert.equal(await sheet.locator('[data-sheet-title]').textContent(), 'DeepSeek');
  assert.match(await sheet.locator('[data-sheet-summary]').textContent(), /国产大模型/);
  assert.equal(await sheet.locator('[data-sheet-best-wrap]').isVisible(), true);
  assert.equal(await sheet.locator('[data-sheet-caution-wrap]').isVisible(), true);
  assert.equal(await sheet.locator('[data-sheet-url]').getAttribute('href'), 'https://chat.deepseek.com/');
  assert.equal(await sheet.locator('[data-sheet-repo]').isVisible(), false);

  await sheet.locator('[data-sheet-close]').click();
  await page.waitForFunction(() => !document.querySelector('[data-tool-sheet]').open);
  assert.equal(await deepseekTile.evaluate(el => el === document.activeElement), true, '关闭抽屉后焦点回到原图标');

  const mineruTile = page.locator('[data-tool-id="mineru"] [data-tool-tile]');
  await mineruTile.click();
  await page.waitForFunction(() => document.querySelector('[data-tool-sheet]').open);
  assert.equal(await sheet.locator('[data-sheet-title]').textContent(), 'MinerU');
  assert.equal(await sheet.locator('[data-sheet-url]').getAttribute('href'), 'https://mineru.net/');
  assert.equal(await sheet.locator('[data-sheet-repo]').getAttribute('href'), 'https://github.com/opendatalab/MinerU');

  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('[data-tool-sheet]').open);
  assert.equal(await mineruTile.evaluate(el => el === document.activeElement), true);

  await deepseekTile.click();
  await page.waitForFunction(() => document.querySelector('[data-tool-sheet]').open);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForFunction(() => !document.querySelector('[data-tool-catalog]').dataset.mobileAppGrid);
  assert.equal(await sheet.evaluate(el => el.open), false, '切回桌面端自动收起手机详情抽屉');
  assert.equal(await page.locator('[data-tool-id="deepseek"] .tool-card__summary').isVisible(), true);
  assert.equal(await page.locator('[data-tool-id="deepseek"] [data-tool-tile]').isVisible(), false);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForFunction(() => document.querySelector('[data-tool-catalog]').dataset.mobileAppGrid === 'true');
  assert.equal(await page.locator('[data-tool-id="deepseek"] [data-tool-tile]').isVisible(), true);
});

test('手机端工具页无独立能力筛选，精简页头与开源折叠搜索兼容', async t => {
  const page = await setup(t, { viewport: { width: 390, height: 844 } });
  await page.goto(origin + '/tools/');
  await ready(page);

  assert.equal(await page.locator('[data-cap-panel], [data-filter-cap]').count(), 0);
  assert.equal(await page.locator('[data-filter-count]').textContent(), String(tools.length));
  assert.equal(await page.locator('.page-header__chips').isVisible(), true);
  assert.equal(await page.locator('.notice--warm').isVisible(), false);
  assert.equal(await page.locator('[data-tool-catalog] .results-bar p').evaluate(el => el.getBoundingClientRect().height <= 1), true, '手机端隐藏重复的匹配计数行');
  assert.equal(await page.locator('[data-catalog-category="llm-chat"] .catalog-category__heading').isVisible(), false, '全部工具下也隐藏冗余分类大标题');
  assert.equal(await page.locator('[data-catalog-category="agent"] .catalog-category__heading').isVisible(), false);

  await page.locator('[data-filter-value="agent"]').click();
  assert.equal(await page.locator('[data-catalog-category="agent"] .catalog-category__heading').isVisible(), false, '单分类筛选时不重复显示分类大标题');
  assert.equal(await page.locator('[data-tool-catalog] .results-bar p').evaluate(el => el.getBoundingClientRect().height <= 1), true, '单分类筛选时同样隐藏匹配计数行');
  assert.equal(await page.locator('[data-clear-filters]').isVisible(), true);
  assert.equal(await page.locator('[data-collapse]').evaluate(el => el.open), false);
  await page.locator('[data-filter-search]').fill('Cline');
  await page.waitForFunction(() => document.querySelector('[data-filter-count]').textContent === '1');
  assert.equal(await page.locator('[data-collapse]').evaluate(el => el.open), true);
  await page.locator('[data-tool-id="cline"] [data-tool-tile]').click();
  await page.waitForFunction(() => document.querySelector('[data-tool-sheet]').open);
  assert.equal(await page.locator('[data-sheet-title]').textContent(), 'Cline');
});

test('手机 App 网格在浅色、深色和自定义主题中可用，无 JS 和打印恢复完整卡片', async t => {
  const page = await setup(t, { viewport: { width: 375, height: 667 }, reducedMotion: 'reduce' });
  await page.goto(origin + '/tools/');
  await ready(page);
  for (const id of ['light', 'dark', 'preset-forest']) {
    await select(page, id);
    assert.equal(await page.locator('[data-tool-catalog]').evaluate(el => el.dataset.mobileAppGrid), 'true');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  }
  await create(page);
  await page.locator('[data-theme-field="name"]').fill('手机网格验收');
  await page.locator('[data-theme-save]').click();
  const saved = await state(page);
  await page.reload();
  await ready(page);
  assert.equal((await state(page)).id, saved.id);
  await page.locator('[data-tool-id="deepseek"] [data-tool-tile]').click();
  await page.waitForFunction(() => document.querySelector('[data-tool-sheet]').open);
  assert.equal(await page.locator('[data-sheet-title]').textContent(), 'DeepSeek');
  await page.locator('[data-sheet-close]').click();

  await page.evaluate(() => window.addEventListener('beforeprint', () => {
    window.printedToolCount = document.querySelectorAll('[data-tool-id]:not([hidden])').length;
    window.printedAppMode = document.querySelector('[data-tool-catalog]').dataset.mobileAppGrid ?? null;
  }));
  await page.pdf();
  assert.equal(await page.evaluate(() => window.printedToolCount), tools.length);
  assert.equal(await page.evaluate(() => window.printedAppMode), null);
  assert.equal(await page.locator('[data-tool-catalog]').evaluate(el => el.dataset.mobileAppGrid), 'true');

  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 667 } });
  t.after(() => context.close());
  const staticPage = await context.newPage();
  await staticPage.goto(origin + '/tools/');
  assert.equal(await staticPage.locator('[data-tool-catalog]').evaluate(el => getComputedStyle(el).opacity), '1');
  assert.equal(await staticPage.locator('[data-tool-id]').count(), tools.length);
  assert.equal(await staticPage.locator('[data-tool-id="deepseek"] .tool-card__summary').isVisible(), true);
  assert.equal(await staticPage.locator(`[data-tool-id="${tools.at(-1).id}"]`).isVisible(), true);
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

test('非法字段及字体 JSON 安全回退，图片地址可逐字输入', async t => {
  const page = await setup(t);
  await openImport(page, {
    bg: { toString: null }, radius: { valueOf: null },
    font: { preset: 'custom', name: { toString: null }, src: { toString: null } },
  });
  await page.locator('[data-theme-import-confirm]').click();
  assert.equal((await state(page)).bg, '#f5f6fa');
  assert.deepEqual((await state(page)).themes[0].params.font, { preset: 'custom', name: '', src: '' });
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
  await page.locator('[data-theme-image-file]').setInputFiles({
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

test('取消或切换字体风格后，旧字体读取结果不会覆盖当前草稿', async t => {
  const page = await setup(t);
  const font = await readFile(new URL('../public/fonts/fusion-pixel/fusion-pixel-12px-monospaced-latin.otf.woff2', import.meta.url));
  await page.evaluate(() => {
    const Reader = window.FileReader;
    window.FileReader = class extends Reader {
      readAsDataURL(file) {
        window.finishFontRead = () => new Promise(resolve => {
          this.addEventListener('loadend', () => resolve(), { once: true });
          super.readAsDataURL(file);
        });
      }
    };
  });
  for (const action of ['cancel', 'preset']) {
    await create(page);
    await page.locator('[data-theme-font-preset="custom"]').click();
    await page.locator('[data-theme-font-file]').setInputFiles({ name: 'cancelled-font.woff2', mimeType: 'font/woff2', buffer: font });
    if (action === 'cancel') {
      await page.locator('[data-theme-cancel]').click();
      await create(page);
    } else {
      await page.locator('[data-theme-font-preset="pixel"]').click();
    }
    await page.evaluate(() => window.finishFontRead());
    const expected = action === 'cancel' ? 'default' : 'pixel';
    assert.equal(await page.locator('[data-theme-font-preset][aria-pressed="true"]').getAttribute('data-theme-font-preset'), expected);
    await page.locator('[data-theme-save]').click();
    const saved = (await state(page)).themes.at(-1).params.font;
    assert.equal(saved.preset, expected);
    assert.equal(saved.src, '');
  }
});

test('拖入字体只触发字体导入，保存和刷新后实际加载字体', async t => {
  const page = await setup(t);
  const font = await readFile(new URL('../public/fonts/fusion-pixel/fusion-pixel-12px-monospaced-latin.otf.woff2', import.meta.url));
  await create(page);
  await page.locator('[data-theme-font-preset="custom"]').click();
  await page.evaluate(base64 => {
    const bytes = Uint8Array.from(atob(base64), character => character.charCodeAt(0));
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(new File([bytes], 'uploaded-font.woff2', { type: 'font/woff2' }));
    const drop = document.querySelector('[data-theme-font-drop]');
    for (const type of ['dragover', 'drop']) {
      drop.dispatchEvent(new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer }));
    }
  }, font.toString('base64'));
  await page.waitForFunction(() => document.querySelector('[data-theme-font-name]').value === 'uploaded-font');
  assert.equal(await page.locator('[data-theme-image-error]').isVisible(), false);
  assert.equal(await page.locator('[data-theme-font-error]').isVisible(), false);
  await page.locator('[data-theme-save]').click();
  const saved = await state(page);
  assert.equal(saved.themes[0].params.font.name, 'uploaded-font');
  assert.match(saved.themes[0].params.font.src, /^data:font\/woff2;base64,/);
  await page.reload(); await ready(page);
  assert.deepEqual(await state(page), saved);
  assert.ok(await page.evaluate(async () => (await document.fonts.load('16px "uploaded-font"')).length > 0));
  assert.match(await page.locator('body').evaluate(element => getComputedStyle(element).fontFamily), /uploaded-font/);
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

test('指南首页正文和底色跟随浅色、深色及自定义主题，刷新和手机宽度保持可读', async t => {
  const page = await setup(t);
  await page.goto(origin + '/guide/'); await ready(page);
  const palette = async () => page.evaluate(() => {
    const color = selector => getComputedStyle(document.querySelector(selector)).color;
    const resolve = token => {
      const probe = document.createElement('span');
      probe.style.color = `var(${token})`;
      document.body.append(probe);
      const value = getComputedStyle(probe).color;
      probe.remove();
      return value;
    };
    return {
      body: color('.guide-home-prose'),
      heading: color('.guide-home-paper h1'),
      strong: color('.guide-home-prose strong'),
      paper: getComputedStyle(document.querySelector('.guide-home-paper')).backgroundColor,
      expectedBody: resolve('--ink-soft'),
      expectedHeading: resolve('--ink'),
      expectedPaper: resolve('--surface'),
    };
  });
  const check = async () => {
    const colors = await palette();
    assert.equal(colors.body, colors.expectedBody);
    assert.equal(colors.heading, colors.expectedHeading);
    assert.equal(colors.strong, colors.expectedHeading);
    assert.equal(colors.paper, colors.expectedPaper);
    return colors;
  };
  await select(page, 'light');
  const light = await check();
  await select(page, 'dark');
  const dark = await check();
  assert.notEqual(dark.paper, light.paper, '深色主题必须改变指南纸面底色');
  assert.notEqual(dark.body, light.body, '正文不能固定黑字');
  await openImport(page, { name: 'guide-reading', base: 'dark', bg: '#203040', ink: '#f4e8d0', accent: '#34d399' });
  await page.locator('[data-theme-import-confirm]').click();
  await page.reload(); await ready(page);
  const custom = await check();
  assert.notEqual(custom.paper, dark.paper);
  assert.equal(custom.heading, 'rgb(244, 232, 208)');
  await page.setViewportSize({ width: 390, height: 844 });
  await check();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), '手机宽度下不应横向溢出');
  assert.equal(await page.locator('[data-content-status]').count(), 0, '首页不新增审核信息栏');
});

test('桌面正文目录按标题顺序链接原有锚点，无 JS 时可用键盘跳转并随页滚动', async t => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, javaScriptEnabled: false, reducedMotion: 'reduce' });
  t.after(() => context.close());
  const page = await context.newPage();
  for (const [route, bodySelector] of [
    ['/guide/ai-faq/', '.guide-reading-prose'],
    ['/glossary/workflow/', '.term-body'],
  ]) {
    await page.goto(origin + route);
    const toc = page.getByRole('navigation', { name: '本页目录' });
    const links = toc.getByRole('link');
    const body = page.locator(bodySelector);
    const headings = await body.locator('h2[id], h3[id]').evaluateAll(nodes => nodes.map(node => node.id));
    assert.ok(headings.length > 2);
    assert.deepEqual(await links.evaluateAll(nodes => nodes.map(node => decodeURIComponent(node.hash.slice(1)))), headings);
    const position = await toc.boundingBox();
    const bodyPosition = await body.boundingBox();
    assert.ok(position && bodyPosition && position.x >= bodyPosition.x + bodyPosition.width, '目录位于正文右侧');

    const link = links.nth(2);
    await link.focus();
    await page.keyboard.press('Enter');
    await page.waitForURL(url => decodeURIComponent(url.hash.slice(1)) === headings[2]);
    const target = await page.locator(':target').boundingBox();
    const header = await page.getByRole('banner').boundingBox();
    const sticky = await toc.boundingBox();
    assert.ok(target && header && target.y >= header.y + header.height && target.y < 400, '标题跳转后可见');
    const stickyTop = await toc.evaluate(node => Number.parseFloat(getComputedStyle(node).top));
    assert.ok(sticky && Math.abs(sticky.y - stickyTop) <= 1, '滚动时目录固定在顶栏下方');
  }
});

test('正文目录只在符合指针和宽度条件的桌面端显示', async t => {
  const page = await setup(t);
  await page.goto(origin + '/guide/ai-faq/');
  const toc = page.locator('.wiki-toc');
  for (const [width, visible] of [[1101, true], [1100, false], [390, false]]) {
    await page.setViewportSize({ width, height: 844 });
    assert.equal(await toc.isVisible(), visible);
    if (!visible) {
      const headingLink = toc.locator('a').first();
      await headingLink.focus();
      assert.equal(await headingLink.evaluate(link => link === document.activeElement), false);
    }
  }

  const touch = await setup(t, { hasTouch: true });
  await touch.goto(origin + '/glossary/workflow/');
  assert.equal(await touch.evaluate(() => matchMedia('(pointer: coarse)').matches), true);
  assert.equal(await touch.locator('.wiki-toc').isVisible(), false);

  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const route of ['/guide/', '/guide/research-and-sources/', '/glossary/', '/works/']) {
    await page.goto(origin + route);
    assert.equal(await toc.count(), 0, route + ' 不应渲染空目录');
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

test('首页五张场景循环独立换卡，键盘与拖动可用，短拖动和取消不误切换', async t => {
  const page = await setup(t);
  const groups = page.locator('[data-scenario-stack][data-ready="true"]');
  const titles = () => page.locator('[data-scenario-card]:not([inert]) h3').allTextContents();
  assert.deepEqual(await titles(), ['查资料', '做 PPT', '写代码']);
  assert.equal(await page.locator('.home-scenarios a').count(), 0, '应用展台不应提供跳转');

  const first = groups.first();
  const button = first.getByRole('button', { name: '换一张：探索与理解' });
  await button.focus(); await page.keyboard.press('Enter');
  assert.deepEqual(await titles(), ['读论文', '做 PPT', '写代码']);
  assert.equal(await first.getByRole('heading', { level: 3 }).count(), 1, '后卡不能进入可访问树');
  await page.keyboard.press('Space');
  assert.deepEqual(await titles(), ['辅助科研', '做 PPT', '写代码']);

  const drag = async (distance, cancel = false) => {
    const card = first.locator('[data-scenario-card][data-depth="0"]');
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(550);
    const box = await card.boundingBox();
    const x = box.x + box.width * .4, y = box.y + 80;
    await page.mouse.move(x, y); await page.mouse.down();
    await page.mouse.move(x + distance, y + 5, { steps: 8 });
    if (cancel) await page.keyboard.press('Escape');
    await page.mouse.up();
  };
  await drag(20);
  assert.deepEqual(await titles(), ['辅助科研', '做 PPT', '写代码']);
  await drag(120, true);
  assert.deepEqual(await titles(), ['辅助科研', '做 PPT', '写代码']);
  await drag(120);
  assert.deepEqual(await titles(), ['学知识', '做 PPT', '写代码']);
  await button.click(); await button.click();

  const expected = [
    ['查资料', '读论文', '辅助科研', '学知识', '练外语'],
    ['做 PPT', '做设计', '做图片', '做视频', '写文案'],
    ['写代码', '理数据', '操作浏览器', '操作专业软件', '做自动化'],
  ];
  for (const [index, sequence] of expected.entries()) {
    const group = groups.nth(index);
    for (const title of sequence) {
      assert.equal(await group.getByRole('heading', { level: 3 }).textContent(), title);
      const hiddenCopies = await group.locator('[data-scenario-card]:not([data-depth="0"]) .scenario-card__copy').evaluateAll(els => els.map(el => getComputedStyle(el).visibility));
      assert.deepEqual(hiddenCopies, ['hidden', 'hidden', 'hidden', 'hidden'], '第三至第五张的文字也必须隐藏');
      const croppedArt = await group.locator('[data-scenario-card][data-depth="0"] .workspace-paper').evaluateAll(els => els.filter(el => el.scrollHeight > el.clientHeight + 2).length);
      assert.equal(croppedArt, 0, `${title} 的示意图内容不能被裁掉`);
      await group.getByRole('button').click();
    }
    assert.equal(await group.getByRole('heading', { level: 3 }).textContent(), sequence[0], '第五张后应回到首张');
    assert.equal(await group.locator('[data-scenario-position]').textContent(), '01 / 05');
  }
  assert.deepEqual(await titles(), ['查资料', '做 PPT', '写代码'], '各组循环不应改变其他组');
  assert.equal(page.url(), origin + '/', '换卡不能改变页面地址');
});

test('首页场景适配主题、减少动效、手机横向浏览与无 JS 展示', async t => {
  const page = await setup(t, { reducedMotion: 'reduce' });
  const firstCard = page.locator('[data-scenario-card][data-depth="0"]').first();
  const surface = () => firstCard.evaluate(el => getComputedStyle(el).backgroundColor);
  await select(page, 'light');
  const light = await surface();
  await select(page, 'dark');
  assert.notEqual(await surface(), light, '叠卡纸面应跟随主题');
  await select(page, 'preset-forest');
  assert.equal(await surface(), 'rgb(14, 23, 18)');
  assert.ok(await firstCard.evaluate(el => parseFloat(getComputedStyle(el).transitionDuration) < .001), '减少动效时不保留可见过渡');
  assert.equal(await firstCard.evaluate(el => getComputedStyle(el).transform), 'none');

  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), '展台不能撑宽整页');
    await page.locator('.home-scenarios__grid').evaluate(el => { el.scrollLeft = el.scrollWidth; });
    const last = page.locator('[data-scenario-stack]').last();
    await last.getByRole('button').click();
    assert.equal(await last.getByRole('heading', { level: 3 }).textContent(), width === 390 ? '理数据' : '操作浏览器');
  }

  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  t.after(() => context.close());
  const staticPage = await context.newPage();
  await staticPage.goto(origin);
  assert.deepEqual(await staticPage.locator('[data-scenario-card]:not([inert]) h3').allTextContents(), ['查资料', '做 PPT', '写代码']);
  assert.equal(await staticPage.locator('.home-scenarios button:visible').count(), 0, '无 JS 时不留下失效换卡按钮');
});

test('首页探索菜单按进入方向揭开横幅，快速切换与键盘导航正常，重复内容不影响可访问名称', async t => {
  const page = await setup(t);
  const menu = page.getByRole('navigation', { name: '从这里开始' });
  const links = menu.getByRole('link');
  assert.equal(await links.count(), 3);
  assert.deepEqual(await links.evaluateAll(els => els.map(el => el.getAttribute('href'))), ['/guide/', '/tools/', '/glossary/']);
  await menu.scrollIntoViewIfNeeded(); await page.waitForTimeout(600);
  const first = links.first();
  assert.ok(await first.evaluate(el => el.querySelector('.home-flow__cycle').getBoundingClientRect().width >= el.clientWidth), '循环内容至少铺满整行，避免流动末尾出现空白');
  const box = await first.boundingBox();
  const x = box.x + box.width / 2;
  await page.mouse.move(x, box.y - 8);
  await page.mouse.move(x, box.y + 12);
  const start = await first.locator('[data-flow-reveal]').evaluate(el => el.getAnimations()[0]?.effect.getKeyframes()[0].transform);
  assert.match(start, /-101%/, '从上方进入时应从上方揭开横幅');
  await page.waitForFunction(() => document.querySelector('[data-flow-link]').dataset.flowRunning === 'true');
  assert.equal(await first.locator('.home-flow__track').evaluate(el => getComputedStyle(el).animationPlayState), 'running');
  await page.mouse.move(x, box.y + box.height + 8);
  const end = await first.locator('[data-flow-reveal]').evaluate(el => el.getAnimations()[0]?.effect.getKeyframes().at(-1).transform);
  assert.match(end, /translateY\(101%\)/, '从下方离开时应从下方退场');
  await page.mouse.move(x, box.y + box.height / 2);
  assert.ok(await first.locator('[data-flow-reveal]').evaluate(el => el.getAnimations().length <= 1), '快速重入不能累积动画');
  await page.mouse.move(0, 0); await page.waitForTimeout(550);
  assert.equal(await first.getAttribute('data-flow-running'), 'false');

  await first.focus();
  assert.equal(await first.getAttribute('data-flow-active'), 'true');
  const accessibleLinks = await menu.getByRole('link', { name: /^先认识 AI/ }).count();
  assert.equal(accessibleLinks, 1, '横幅重复文字不能产生重复链接或名称');
  await page.keyboard.press('Tab');
  assert.equal(await first.getAttribute('data-flow-active'), 'false');
  assert.equal(await links.nth(1).getAttribute('data-flow-active'), 'true');
  // 静态测试服务器上，Chrome 原生跨文档转场会报告 opt-in disabled，
  // 原有「开始学习」入口也可复现。本用例保留真实链接跳转，局部关闭与菜单无关的跨页转场。
  await page.addStyleTag({ content: '@view-transition { navigation: none; }' });
  await page.keyboard.press('Enter');
  await page.waitForURL(origin + '/tools/');
});

test('首页探索菜单适配主题与减少动效，触摸和无 JS 均可直接进入目标页', async t => {
  const page = await setup(t, { reducedMotion: 'reduce' });
  await select(page, 'dark');
  const menu = page.getByRole('navigation', { name: '从这里开始' });
  const first = menu.getByRole('link').first();
  await first.focus();
  assert.equal(await first.getAttribute('data-flow-active'), 'false');
  assert.equal(await first.locator('[data-flow-reveal]').isVisible(), false);
  assert.equal(await first.locator('.home-flow__track').evaluate(el => getComputedStyle(el).animationName), 'none');
  assert.equal(await first.locator('strong').evaluate(el => getComputedStyle(el).color), 'rgb(250, 250, 250)');

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await first.focus();
  await page.waitForFunction(() => document.querySelector('[data-flow-link]').dataset.flowActive === 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await first.locator('[data-flow-reveal]').isVisible(), false, '实时开启减少动效应停止横幅');
  assert.equal(await first.locator('[data-flow-reveal]').evaluate(el => el.getAnimations().length), 0);

  const touchPage = await setup(t, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const touchMenu = touchPage.getByRole('navigation', { name: '从这里开始' });
  assert.equal(await touchMenu.locator('.home-flow__reveal:visible').count(), 0);
  assert.ok(await touchPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  const touchLibrary = touchPage.locator('[data-library]');
  const touchViewer = touchPage.locator('[data-library-viewer]');
  await touchViewer.scrollIntoViewIfNeeded();
  const cdp = await touchPage.context().newCDPSession(touchPage);
  const swipe = async (dx, dy) => {
    const box = await touchViewer.boundingBox();
    const x = box.x + box.width * .35;
    const y = box.y + box.height / 2;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let step = 1; step <= 8; step++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * step / 8, y: y + dy * step / 8 }] });
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await touchPage.waitForSelector('[data-library][data-library-animating="false"]');
  };
  const initialYaw = Number(await touchLibrary.getAttribute('data-library-yaw'));
  await swipe(96, 0);
  assert.ok(Number(await touchLibrary.getAttribute('data-library-yaw')) < initialYaw - 30, '向右触摸拖动时门厅应向屏幕右侧旋转');
  const initialPitch = await touchLibrary.getAttribute('data-library-pitch');
  const initialScroll = await touchPage.evaluate(() => scrollY);
  await swipe(0, -112);
  await touchPage.waitForFunction(previous => scrollY > previous, initialScroll);
  assert.equal(await touchLibrary.getAttribute('data-library-pitch'), initialPitch, '纵向页面滚动应保留模型俯角');
  assert.equal(await touchLibrary.getAttribute('data-library-dragging'), 'false', '浏览器接管滚动后应结束手势');
  await cdp.detach();
  // CDP 模拟滚动可能消耗下一次轻点，重新打开首页后独立验证触摸导航。
  await touchPage.goto(origin);
  await touchPage.addStyleTag({ content: '@view-transition { navigation: none; }' });
  await touchMenu.getByRole('link', { name: /^找个工具试试/ }).tap();
  await touchPage.waitForURL(origin + '/tools/');

  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  t.after(() => context.close());
  const staticPage = await context.newPage();
  await staticPage.goto(origin);
  const staticMenu = staticPage.getByRole('navigation', { name: '从这里开始' });
  assert.equal(await staticMenu.getByRole('link').count(), 3);
  assert.equal(await staticMenu.locator('.home-flow__reveal:visible').count(), 0);
  assert.equal(await staticPage.locator('[data-library-line-art]').isVisible(), true, '无 JS 时图书馆线稿仍完整显示');
  // 无 JS 页面不等待样式 load 回调，直接插入同一条测试环境规则。
  await staticPage.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = '@view-transition { navigation: none; }';
    document.head.append(style);
  });
  await staticMenu.getByRole('link', { name: /^弄懂一个新词/ }).click();
  await staticPage.waitForURL(origin + '/glossary/');
});

test('首页图书馆按屏幕方向旋转，入口开门联动并在离开后自动复位', async t => {
  const page = await setup(t, { reducedMotion: 'reduce' });
  const art = page.locator('[data-library-line-art]');
  await art.waitFor();
  assert.equal(await page.locator('#explore-title').textContent(), '开始探索AI');
  assert.ok(await art.locator('path').count() > 100, '线稿应包含建筑轮廓、楼层和幕墙分格');
  assert.ok(await art.locator('[data-library-door] path').count() >= 6, '入口应包含门框、双开门与把手');
  assert.equal(await art.locator('canvas').count(), 0);
  assert.equal(await art.evaluate(el => getComputedStyle(el).fill), 'none');
  assert.equal(await art.locator('path').evaluateAll(paths => paths.every(path => getComputedStyle(path).fill === 'none')), true);

  // 主题过渡可能跨帧注册或结束，在同一帧检查颜色和动画状态。
  const settledColor = async previous => {
    const color = await page.waitForFunction(prev => {
      const el = document.querySelector('[data-library-line-art]');
      const host = getComputedStyle(el).color;
      const stroke = getComputedStyle(el.querySelector('path')).stroke;
      return host !== prev && host === stroke && el.getAnimations().length === 0 ? host : false;
    }, previous, { timeout: 1000 });
    return color.jsonValue();
  };

  await select(page, 'light');
  const light = await settledColor();
  await select(page, 'dark');
  const dark = await settledColor(light);
  await select(page, 'preset-forest');
  const forest = await settledColor(dark);
  assert.notEqual(forest, light, '切换主题强调色后 SVG 线条应更新颜色');

  const library = page.locator('[data-library]');
  const viewer = page.locator('[data-library-viewer]');
  const settledView = () => page.waitForSelector('[data-library][data-library-animating="false"]');
  const assertReset = async () => {
    await settledView();
    const yaw = Number(await library.getAttribute('data-library-yaw'));
    assert.ok(Math.abs(((yaw % 360) + 360) % 360 - 45) < .001);
    assert.equal(Number(await library.getAttribute('data-library-pitch')), 9);
    assert.equal(await library.getAttribute('data-library-selected'), '');
    assert.equal(await page.locator('[data-library-entry][data-library-selected="true"]').count(), 0);
    assert.equal(await art.locator('[data-library-door]').evaluateAll(doors => doors.every(door => door.getAttribute('stroke-width') === '1.4')), true);
  };
  assert.equal(await library.locator('button').count(), 0, '图形下方不再显示复位按钮');
  assert.equal(await page.getByText('拖动旋转', { exact: true }).count(), 0);
  await viewer.focus();
  const initialOutline = await art.locator('[data-library-group="front-outline"] path').first().getAttribute('d');
  await page.keyboard.press('ArrowRight');
  await settledView();
  assert.equal(Number(await library.getAttribute('data-library-yaw')), 35);
  assert.notEqual(await art.locator('[data-library-group="front-outline"] path').first().getAttribute('d'), initialOutline, '旋转应重新投影建筑坐标');
  await page.keyboard.press('ArrowUp');
  await settledView();
  assert.equal(Number(await library.getAttribute('data-library-pitch')), 6, '上方向键应与向上拖动保持相同方向');
  await page.keyboard.press('ArrowDown');
  await settledView();
  assert.equal(Number(await library.getAttribute('data-library-pitch')), 9, '下方向键应与向下拖动保持相同方向');
  await page.keyboard.press('Home');
  await settledView();

  const box = await viewer.boundingBox();
  const centerX = box.x + box.width / 2;
  await page.mouse.move(centerX, box.y + box.height * .8);
  await page.mouse.down();
  await page.mouse.move(centerX, box.y + box.height * .2, { steps: 8 });
  await page.mouse.up();
  await settledView();
  assert.equal(Number(await library.getAttribute('data-library-pitch')), 5, '向上拖动应降低俯角并保持下限');
  await page.mouse.down();
  await page.mouse.move(centerX, box.y + box.height * .8, { steps: 8 });
  await page.mouse.up();
  await settledView();
  assert.ok(Number(await library.getAttribute('data-library-pitch')) > 9, '向下拖动应提高俯角');
  await page.keyboard.press('Home');
  await settledView();

  await page.mouse.move(box.x + box.width * .85, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * .1, box.y + box.height / 2 - 30, { steps: 8 });
  await page.mouse.up();
  await settledView();
  assert.ok(Number(await library.getAttribute('data-library-yaw')) > 180, '向左拖动应能环绕查看后立面');
  assert.equal(await library.getAttribute('data-library-dragging'), 'false');
  assert.equal(await art.locator('[data-library-group="front-outline"]').getAttribute('visibility'), 'hidden');
  assert.equal(await art.locator('[data-library-group="back-outline"]').getAttribute('visibility'), 'visible');
  await page.mouse.move(box.x - 10, box.y + box.height / 2);
  await assertReset();

  await page.mouse.move(box.x + box.width * .5, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x - 30, box.y + box.height / 2, { steps: 8 });
  assert.equal(await library.getAttribute('data-library-dragging'), 'true', '捕获指针期间仍能拖出图形');
  await page.mouse.up();
  await assertReset();
  assert.equal(await library.getAttribute('data-library-dragging'), 'false');

  for (const [index, key] of ['guide', 'tools', 'glossary'].entries()) {
    await page.locator(`[data-library-entry="${key}"]`).focus();
    await settledView();
    assert.equal(await library.getAttribute('data-library-selected'), key);
    const yaw = Number(await library.getAttribute('data-library-yaw'));
    assert.ok(Math.abs(((yaw % 360) + 360) % 360 - [24, 0, 336][index]) < .001);
    assert.equal(await art.locator(`[data-library-door="${key}"]`).getAttribute('stroke-width'), '2.5', '对应门应打开并加粗');
    assert.equal(await page.locator('[data-library-entry][data-library-selected="true"]').count(), 1);
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.locator('[data-library-entry="guide"]').hover();
  await page.locator('[data-library-entry="tools"]').hover();
  await page.locator('[data-library-entry="glossary"]').hover();
  await viewer.focus();
  await page.keyboard.press('ArrowRight');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await settledView();
  assert.equal(await library.getAttribute('data-library-selected'), 'glossary', '快速切换与减少动效变更后应保留最后选择');
  assert.equal(await art.locator('[data-library-door="guide"]').getAttribute('stroke-width'), '1.4');
  assert.equal(await art.locator('[data-library-door="glossary"]').getAttribute('stroke-width'), '2.5', '键盘接管视角后仍应完成选中门的开门');
  await page.mouse.move(0, 0);
  await assertReset();
  await page.locator('[data-library-entry="guide"]').focus();
  await settledView();
  await page.locator('[data-theme-trigger]').focus();
  await assertReset();

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.locator('[data-library-entry="guide"]').hover();
  await page.mouse.move(0, 0);
  await assertReset();

  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await art.isVisible(), true);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
});

test('手机术语表采用分支切换与单行横滑胶囊，首屏露出术语且不触发竖向滚动', async t => {
  const page = await setup(t, { isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
  for (const viewport of [{ width: 390, height: 844 }, { width: 320, height: 568 }]) {
    await page.setViewportSize(viewport);
    await page.goto(origin + '/glossary/');
    await ready(page);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${viewport.width}×${viewport.height} 不应出现横向溢出`);
    const firstTermBox = await page.locator('.glossary-term:visible').first().boundingBox();
    assert.ok(firstTermBox, `${viewport.width}×${viewport.height} 应存在可见术语卡片`);
    if (viewport.height >= 700) {
      assert.ok(firstTermBox.y + firstTermBox.height <= viewport.height, `${viewport.width}×${viewport.height} 首屏应完整露出第一条术语`);
    } else {
      assert.ok(firstTermBox.y <= viewport.height - 96, `${viewport.width}×${viewport.height} 首屏应明显露出第一条术语内容`);
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + '/glossary/');
  await ready(page);
  const nav = page.locator('[data-glossary-nav]');
  assert.equal(await nav.getAttribute('data-active-branch'), 'main');
  assert.equal(await page.locator('.branch-group--main .branch-rows').isVisible(), true);
  assert.equal(await page.locator('.branch-group--vibe .branch-rows').isVisible(), false);

  await page.locator('[data-filter-value="vibe-branch"]').click();
  assert.equal(await nav.getAttribute('data-active-branch'), 'vibe');
  assert.equal(await page.locator('.branch-group--vibe .branch-rows').isVisible(), true);
  assert.equal(await page.locator('.branch-group--main .branch-rows').isVisible(), false);

  const beforeScroll = await page.evaluate(() => scrollY);
  await page.locator('[data-filter-value="git"]').click();
  await page.waitForFunction(() => new URLSearchParams(location.search).get('category') === 'git');
  await page.waitForTimeout(200);
  const afterScroll = await page.evaluate(() => scrollY);
  assert.ok(Math.abs(afterScroll - beforeScroll) < 2, '手机点击子分类胶囊不应触发竖向滚动');

  await page.goto(origin + '/glossary/?category=vibecoding');
  await ready(page);
  assert.equal(await nav.getAttribute('data-active-branch'), 'vibe');
  assert.equal(await page.locator('[data-filter-value="vibe-branch"]').getAttribute('aria-pressed'), 'true');

  // 桌面端折叠分支后再缩回手机宽度，活动分支胶囊条仍应可见。
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(origin + '/glossary/');
  await ready(page);
  await page.locator('[data-branch="main"] [data-branch-toggle]').click();
  assert.equal(await page.locator('.branch-group--main .branch-rows').isVisible(), false);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.locator('.branch-group--main .branch-rows').isVisible(), true);
});

test('指南详情页手机全宽铺排，保持原流程图并支持点击放大灯箱浏览', async t => {
  const page = await setup(t, { isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + '/guide/chat-ai-to-agent/');
  await ready(page);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), '指南详情页手机宽度不应横向溢出');

  const widths = await page.evaluate(() => ({
    paper: document.querySelector('.guide-paper')?.getBoundingClientRect().width ?? 0,
    prose: document.querySelector('.notion-prose')?.getBoundingClientRect().width ?? 0,
  }));
  assert.ok(widths.paper >= 388, `手机阅读卡应接近全宽铺排（实际 ${widths.paper}）`);
  assert.ok(widths.prose >= 350, `手机正文可用宽度应释放（实际 ${widths.prose}）`);

  const zoomTrigger = page.locator('[data-image-zoom]').first();
  await zoomTrigger.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const img = document.querySelector('[data-image-zoom] img');
    return img && img.complete && img.naturalWidth === 1700 && img.naturalHeight === 960;
  });

  await zoomTrigger.click();
  const lightbox = page.locator('[data-image-lightbox]');
  await page.waitForFunction(() => {
    const dlg = document.querySelector('[data-image-lightbox]');
    const img = document.querySelector('[data-lightbox-img]');
    return dlg?.open && img?.complete && img.getBoundingClientRect().width > 600;
  });
  assert.equal(await lightbox.getAttribute('data-zoom-scale'), '200', '移动端宽幅流程图打开灯箱应默认放大至 200%');

  const initialZoomWidth = await page.locator('[data-lightbox-img]').evaluate(el => el.getBoundingClientRect().width);
  assert.ok(initialZoomWidth > 600, `放大后图片宽度应显著大于视口宽度以支持拖动阅读（实际 ${initialZoomWidth}）`);

  await page.locator('[data-lightbox-in]').click();
  assert.equal(await lightbox.getAttribute('data-zoom-scale'), '250');
  await page.waitForFunction((prev) => document.querySelector('[data-lightbox-img]').getBoundingClientRect().width > prev, initialZoomWidth);
  const enlargedWidth = await page.locator('[data-lightbox-img]').evaluate(el => el.getBoundingClientRect().width);
  assert.ok(enlargedWidth > initialZoomWidth);

  await page.locator('[data-lightbox-reset]').click();
  assert.equal(await lightbox.getAttribute('data-zoom-scale'), '100');

  await page.locator('[data-lightbox-close]').click();
  await page.waitForFunction(() => !document.querySelector('[data-image-lightbox]')?.open);
  assert.equal(await zoomTrigger.evaluate(el => el === document.activeElement), true, '关闭图片灯箱后焦点应回到原触发按钮');
});

test('手机灯箱仅用双击缩放，连续横滑和捏合结束不会误触发', async t => {
  const page = await setup(t, {
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  await page.goto(origin + '/guide/chat-ai-to-agent/');
  await page.locator('[data-image-zoom]').tap();
  const image = page.locator('[data-lightbox-img]');
  await image.evaluate(el => el.decode());

  const zooms = await image.evaluate(img => {
    const touch = (clientX, identifier = 1) => new Touch({ target: img, identifier, clientX, clientY: 300 });
    const send = (type, touches, changedTouches = touches) => {
      img.dispatchEvent(new TouchEvent(type, { touches, changedTouches, bubbles: true, cancelable: true }));
    };
    const zoom = () => img.closest('dialog').dataset.zoomScale;
    const tap = () => {
      send('touchstart', [touch(120)]);
      send('touchend', [], [touch(120)]);
    };
    const swipe = () => {
      send('touchstart', [touch(120)]);
      send('touchmove', [touch(60)]);
      send('touchend', [], [touch(60)]);
    };

    swipe();
    swipe();
    const afterSwipes = zoom();
    tap();
    tap();
    const afterDoubleTap = zoom();

    send('touchstart', [touch(100)]);
    send('touchstart', [touch(100), touch(140, 2)]);
    send('touchmove', [touch(80), touch(160, 2)]);
    send('touchend', [touch(80)], [touch(160, 2)]);
    send('touchend', [], [touch(80)]);
    const afterPinch = zoom();
    tap();
    const afterSingleTap = zoom();
    send('touchstart', [touch(120)]);
    send('touchcancel', [], [touch(120)]);
    tap();
    const afterCancelledTap = zoom();
    return { afterSwipes, afterDoubleTap, afterPinch, afterSingleTap, afterCancelledTap };
  });

  assert.deepEqual(zooms, {
    afterSwipes: '200',
    afterDoubleTap: '100',
    afterPinch: '200',
    afterSingleTap: '200',
    afterCancelledTap: '200',
  });
});

test('桌面灯箱放大后仍可单击图片、拖动画布并双击复位', async t => {
  const page = await setup(t, { viewport: { width: 1024, height: 768 }, reducedMotion: 'reduce' });
  await page.goto(origin + '/guide/chat-ai-to-agent/');
  await page.locator('[data-image-zoom]').click();
  const lightbox = page.locator('[data-image-lightbox]');
  await page.locator('[data-lightbox-img]').evaluate(img => img.decode());
  await page.locator('[data-lightbox-in]').click();
  await page.locator('[data-lightbox-in]').click();
  assert.equal(await lightbox.getAttribute('data-zoom-scale'), '200');

  const stage = page.locator('[data-lightbox-stage]');
  const bounds = await stage.boundingBox();
  const x = Math.round(bounds.x + bounds.width / 2);
  const y = Math.round(bounds.y + bounds.height / 2);
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 1, y);
  await page.mouse.up();
  assert.equal(await lightbox.evaluate(el => el.open), true, '带少量移动的单击应保留图片预览');

  const startScroll = await stage.evaluate(el => el.scrollLeft);
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 60, y, { steps: 6 });
  await page.mouse.up();
  assert.ok(await stage.evaluate(el => el.scrollLeft) > startScroll, '拖动应移动放大的画布');

  await page.mouse.dblclick(x, y);
  assert.equal(await lightbox.evaluate(el => el.open), true);
  assert.equal(await lightbox.getAttribute('data-zoom-scale'), '100');
});

test('桌面主题编辑器拖到底部后仍可点击保存', async t => {
  const page = await setup(t, { viewport: { width: 1024, height: 768 }, reducedMotion: 'reduce' });
  await create(page);
  await page.locator('[data-theme-field="name"]').fill('拖动测试主题');
  const editor = page.locator('[data-theme-editor]');
  const grip = await page.locator('[data-theme-editor-grip]').boundingBox();
  const before = await editor.boundingBox();

  await page.mouse.move(grip.x + 55, grip.y + 24);
  await page.mouse.down();
  await page.mouse.move(grip.x + 55, 767, { steps: 8 });
  await page.mouse.up();

  const after = await editor.boundingBox();
  assert.ok(after.y > before.y, '鼠标可以向下移动对话框');
  assert.ok(after.y + after.height <= 768, '整个对话框应留在视口内');
  await page.locator('[data-theme-save]').click();
  await editor.waitFor({ state: 'hidden' });
});

test('从赛事抽屉到报名入口后，键盘焦点继续停在报名区', async t => {
  const page = await setup(t, { reducedMotion: 'reduce' });
  await page.goto(origin + '/events/');
  const drawer = page.locator('#challenge-info-drawer');
  const trigger = page.locator('.page-hero [data-dialog-open="challenge-info-drawer"]');
  const registration = page.locator('#register');

  for (const expectedHash of ['', '#register']) {
    assert.equal(new URL(page.url()).hash, expectedHash);
    await trigger.focus();
    await page.keyboard.press('Enter');
    await drawer.getByRole('link', { name: '前往报名入口' }).focus();
    await page.keyboard.press('Enter');
    await drawer.waitFor({ state: 'hidden' });
    await page.waitForURL(origin + '/events/#register');
    await page.waitForFunction(() => document.activeElement?.id === 'register');
    await page.keyboard.press('Tab');
    assert.equal(await registration.getByRole('link', { name: '查看腾讯文档报名表' })
      .evaluate(link => document.activeElement === link), true);
  }
});

test('手机左拉赛事速览在松手后打开并可切换到作品要求', async t => {
  const page = await setup(t, {
    viewport: { width: 320, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  await page.goto(origin + '/events/');
  const trigger = page.getByRole('button', { name: '赛事速览', exact: true });
  const overview = page.locator('#challenge-overview-dialog');
  const drawer = page.locator('#challenge-info-drawer');
  const bounds = await trigger.boundingBox();
  const x = bounds.x + bounds.width - 12;
  const y = bounds.y + bounds.height / 2;
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  for (const distance of [7, 15, 24]) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - distance, y }] });
  }
  assert.equal(await overview.evaluate(dialog => dialog.open), false, '松手前应保持关闭');
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await cdp.detach();
  await overview.waitFor({ state: 'visible', timeout: 5000 });

  // CDP 模拟触控拖动可能消耗同页下一次轻点，重新加载后独立验证点击打开与抽屉切换。
  await page.goto(origin + '/events/');
  await trigger.tap();
  await overview.waitFor({ state: 'visible', timeout: 5000 });
  await overview.evaluate(el => Promise.all(el.getAnimations().map(a => a.finished.catch(() => {}))));
  await overview.getByRole('button', { name: '赛道与作品要求' }).tap();
  await drawer.waitFor({ state: 'visible', timeout: 5000 });
  await drawer.evaluate(el => Promise.all(el.getAnimations().map(a => a.finished.catch(() => {}))));
  await drawer.getByRole('button', { name: '关闭赛事要求抽屉' }).tap();
  await drawer.waitFor({ state: 'hidden', timeout: 5000 });
  await trigger.tap();
  await overview.waitFor({ state: 'visible', timeout: 5000 });
});

test('手机高发浮层与底部抽屉交互可用且不发生窄屏溢出', async t => {
  const page = await setup(t, { isMobile: true, hasTouch: true, reducedMotion: 'reduce' });

  // 1) Theme editor & colorpop at 320x568 + touch badge visibility
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto(origin);
  await ready(page);
  await create(page);

  const editorMetrics = await page.evaluate(() => {
    const editor = document.querySelector('.theme-editor');
    const foot = document.querySelector('.theme-editor__foot');
    return {
      editorOverflow: editor.scrollWidth - editor.clientWidth,
      footOverflow: foot.scrollWidth - foot.clientWidth,
      rect: editor.getBoundingClientRect(),
    };
  });
  assert.ok(editorMetrics.editorOverflow <= 1, `320px 主题编辑器不应横向溢出（overflow=${editorMetrics.editorOverflow}）`);
  assert.ok(editorMetrics.footOverflow <= 1, `320px 主题编辑器底栏按钮不应横向溢出（overflow=${editorMetrics.footOverflow}）`);

  await page.locator('[data-theme-color-btn]').first().click();
  await page.waitForFunction(() => {
    const pop = document.querySelector('.theme-colorpop');
    return pop && !pop.hidden;
  });
  const popBounds = await page.evaluate(() => {
    const editor = document.querySelector('.theme-editor').getBoundingClientRect();
    const pop = document.querySelector('.theme-colorpop').getBoundingClientRect();
    return { editorLeft: editor.left, editorRight: editor.right, popLeft: pop.left, popRight: pop.right };
  });
  assert.ok(popBounds.popLeft >= popBounds.editorLeft - 1 && popBounds.popRight <= popBounds.editorRight + 1, '取色弹窗应被夹紧在编辑器框内');

  await page.evaluate(() => {
    const grip = document.querySelector('[data-theme-editor-grip]');
    grip.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', button: 0, clientX: 80, clientY: 80, bubbles: true }));
    grip.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'touch', clientX: 120, clientY: 130, bubbles: true }));
    grip.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'touch', clientX: 120, clientY: 130, bubbles: true }));
  });
  assert.equal(await page.locator('.theme-editor').evaluate(el => el.style.transform), '', '手机触屏不应拖动编辑器位置');

  await page.locator('[data-theme-field="name"]').fill('触控测试主题');
  await page.locator('[data-theme-save]').click();
  await page.waitForFunction(() => !document.querySelector('[data-theme-editor]').open);

  await menu(page);
  const badgeMetrics = await page.evaluate(() => {
    const edit = document.querySelector('.theme-swatch__badge--edit');
    const del = document.querySelector('.theme-swatch__badge--del');
    return {
      editOpacity: getComputedStyle(edit).opacity,
      delOpacity: getComputedStyle(del).opacity,
      editBox: edit.getBoundingClientRect(),
      delBox: del.getBoundingClientRect(),
    };
  });
  assert.equal(badgeMetrics.editOpacity, '1', '触控设备自定义主题编辑角标应常显');
  assert.equal(badgeMetrics.delOpacity, '1', '触控设备自定义主题删除角标应常显');
  assert.ok(badgeMetrics.editBox.width >= 24 && badgeMetrics.editBox.height >= 24);
  assert.ok(badgeMetrics.delBox.width >= 24 && badgeMetrics.delBox.height >= 24);
  assert.ok(badgeMetrics.editBox.right <= badgeMetrics.delBox.left + 1, '编辑与删除角标不应互相重叠');
  await page.keyboard.press('Escape');

  // 2) Search dialog top-anchoring & >= 40px close target at 390x844
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-search-open]').click();
  await page.waitForFunction(() => document.querySelector('.search-dialog')?.open);
  const searchMetrics = await page.evaluate(() => ({
    dialogTop: document.querySelector('.search-dialog').getBoundingClientRect().top,
    closeBox: document.querySelector('.search-dialog__close').getBoundingClientRect(),
  }));
  assert.ok(searchMetrics.dialogTop <= 60, `手机搜索弹窗应靠上固定以留出键盘空间（top=${searchMetrics.dialogTop}）`);
  assert.ok(searchMetrics.closeBox.width >= 40 && searchMetrics.closeBox.height >= 40, '搜索关闭按钮触控尺寸应 >= 40px');
  await page.locator('.search-dialog__close').click();
  await page.waitForFunction(() => !document.querySelector('.search-dialog')?.open);

  // 3) Mobile menu scroll containment on short viewport (390x400)
  await page.setViewportSize({ width: 390, height: 400 });
  await page.locator('[data-mobile-menu] > summary').click();
  await page.waitForFunction(() => document.querySelector('[data-mobile-menu]')?.open);
  const menuPanelMetrics = await page.evaluate(() => {
    const panel = document.querySelector('.mobile-menu__panel');
    return {
      overflowY: getComputedStyle(panel).overflowY,
      bottom: panel.getBoundingClientRect().bottom,
    };
  });
  assert.equal(menuPanelMetrics.overflowY, 'auto');
  assert.ok(menuPanelMetrics.bottom <= 400, `短屏下移动菜单应限高并在视口内滚动（bottom=${menuPanelMetrics.bottom}）`);
  await page.locator('[data-mobile-menu] > summary').click();

  // 4) Tools bottom sheet 44px CTA buttons & swipe-down-to-close gesture
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + '/tools/');
  await ready(page);
  const triggerTile = page.locator('[data-tool-id="deepseek"] [data-tool-tile]');
  await triggerTile.click();
  await page.waitForFunction(() => document.querySelector('[data-tool-sheet]')?.open);

  const sheetMetrics = await page.evaluate(() => ({
    primaryBox: document.querySelector('.tool-sheet__primary').getBoundingClientRect(),
    closeBox: document.querySelector('.tool-sheet__close').getBoundingClientRect(),
  }));
  assert.ok(sheetMetrics.primaryBox.height >= 44, `工具抽屉主按钮高度应 >= 44px（实际 ${sheetMetrics.primaryBox.height}）`);
  assert.ok(sheetMetrics.closeBox.width >= 42 && sheetMetrics.closeBox.height >= 42, '工具抽屉关闭按钮应 >= 42px');

  const swipeToolSheet = eventType => page.evaluate(type => {
    const handle = document.querySelector('.tool-sheet__handle');
    const mkTouch = (y) => new Touch({ identifier: 1, target: handle, clientX: 195, clientY: y, pageX: 195, pageY: y });
    const t0 = mkTouch(200);
    handle.dispatchEvent(new TouchEvent('touchstart', { touches: [t0], targetTouches: [t0], changedTouches: [t0], bubbles: true, cancelable: true }));
    const t1 = mkTouch(220);
    handle.dispatchEvent(new TouchEvent('touchmove', { touches: [t1], targetTouches: [t1], changedTouches: [t1], bubbles: true, cancelable: true }));
    const t2 = mkTouch(320);
    handle.dispatchEvent(new TouchEvent('touchmove', { touches: [t2], targetTouches: [t2], changedTouches: [t2], bubbles: true, cancelable: true }));
    handle.dispatchEvent(new TouchEvent(type, { changedTouches: [t2], bubbles: true, cancelable: true }));
  }, eventType);

  await swipeToolSheet('touchcancel');
  const sheet = page.locator('[data-tool-sheet]');
  assert.equal(await sheet.evaluate(el => el.open), true, '手势取消后抽屉应保持打开');
  assert.equal(await sheet.evaluate(el => el.classList.contains('is-dragging') || Boolean(el.style.transform)), false, '手势取消后抽屉应回到原位');
  await swipeToolSheet('touchend');
  await page.waitForFunction(() => !document.querySelector('[data-tool-sheet]').open);
  assert.equal(await triggerTile.evaluate(el => el === document.activeElement), true, '下滑关闭工具抽屉后焦点应回到原工具图标');
});

test('手机端表格横向滚动提示、术语详情热区与指南单列翻页回归', async t => {
  const page = await setup(t, {
    viewport: { width: 360, height: 800 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });

  // 1) 4 列表格在 360px 窄屏使用容器内横向滚动，不撑破整页视口，桌面端不出现多余滑动提示
  await page.goto(origin + '/glossary/multimodal/');
  await ready(page);
  const mobileGlossaryMetrics = await page.evaluate(() => {
    const docOverflow = document.documentElement.scrollWidth <= innerWidth + 1;
    const scrollBox = document.querySelector('[data-table-scroll]');
    const inner = scrollBox?.querySelector('.table-scroll__inner');
    const hint = scrollBox?.querySelector('.table-scroll__hint');
    const copyBox = document.querySelector('.term-copy')?.getBoundingClientRect();
    const rootDisplay = getComputedStyle(document.querySelector('.breadcrumb__root')).display;
    return {
      docOverflow,
      overflowing: scrollBox?.getAttribute('data-overflowing'),
      scrolledEnd: scrollBox?.getAttribute('data-scrolled-end'),
      hintVisible: hint ? getComputedStyle(hint).display !== 'none' : false,
      innerScrollable: inner ? inner.scrollWidth > inner.clientWidth : false,
      copyHeight: copyBox?.height ?? 0,
      rootDisplay,
    };
  });
  assert.equal(mobileGlossaryMetrics.docOverflow, true, '含多列表格的术语详情页在 360px 下不应整页横向溢出');
  assert.equal(mobileGlossaryMetrics.overflowing, 'true', '窄屏多列表格应识别为可横向滚动');
  assert.equal(mobileGlossaryMetrics.scrolledEnd, 'false');
  assert.equal(mobileGlossaryMetrics.hintVisible, true, '可滚动表格应显示滑动提示');
  assert.equal(mobileGlossaryMetrics.innerScrollable, true);
  assert.ok(mobileGlossaryMetrics.copyHeight >= 44, `复制 Markdown 按钮手机端高度应 >= 44px（实际 ${mobileGlossaryMetrics.copyHeight}）`);
  assert.equal(mobileGlossaryMetrics.rootDisplay, 'none', '窄屏术语详情页应精简「首页 /」面包屑');

  await page.evaluate(() => {
    const inner = document.querySelector('[data-table-scroll] .table-scroll__inner');
    inner.scrollLeft = inner.scrollWidth;
    inner.dispatchEvent(new Event('scroll'));
  });
  await page.waitForFunction(() => document.querySelector('[data-table-scroll]')?.getAttribute('data-scrolled-end') === 'true');

  // 切回桌面 1280px 宽度，700px 正文栏能完整容纳该表格，提示自动收起
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForFunction(() => document.querySelector('[data-table-scroll]')?.getAttribute('data-overflowing') === 'false');

  // 2) 赛事细则页 3 张评分/奖项表在 360px 窄屏可横向滚动且不撑破视口
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(origin + '/events/rules/');
  await ready(page);
  const rulesMetrics = await page.evaluate(() => ({
    docOverflow: document.documentElement.scrollWidth <= innerWidth + 1,
    scrollBoxes: Array.from(document.querySelectorAll('[data-table-scroll]')).map(el => el.getAttribute('data-overflowing')),
  }));
  assert.equal(rulesMetrics.docOverflow, true, '赛事细则页在 360px 下不应整页横向溢出');
  assert.deepEqual(rulesMetrics.scrollBoxes, ['true', 'true', 'true'], '赛事细则 3 张表格在 360px 下应启用横向滚动');

  // 3) 指南详情页超窄屏上下章单列堆叠，文末回到目录按钮可滚回并展开顶部目录
  await page.goto(origin + '/guide/chat-ai-to-agent/');
  await ready(page);
  const pagerBoxes = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.guide-pager__link')).map(el => el.getBoundingClientRect()),
  );
  assert.equal(pagerBoxes.length, 2);
  assert.ok(pagerBoxes[0].width > 300, `超窄屏翻页按钮应单列撑满（实际宽度 ${pagerBoxes[0].width}）`);
  assert.ok(pagerBoxes[1].top >= pagerBoxes[0].bottom - 1, '超窄屏上下章应纵向堆叠而非左右挤压');

  const backToNav = page.locator('[data-open-guide-nav]');
  await backToNav.scrollIntoViewIfNeeded();
  const backBox = await backToNav.boundingBox();
  assert.ok(backBox && backBox.height >= 44, '回到目录按钮触控高度应 >= 44px');
  await backToNav.click();
  await page.waitForFunction(() => document.querySelector('[data-guide-mobile-nav]')?.open === true);
});

test('首页手机端隐藏看板娘插画与内容重建提示条，桌面端正常展示', async t => {
  const page = await setup(t, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  await page.goto(origin);
  await ready(page);
  assert.equal(await page.locator('.home-status').isVisible(), false, '手机端应隐藏内容重建状态条');
  assert.equal(await page.locator('.hero-network__figure').isVisible(), false, '手机端应隐藏看板娘插画');
  assert.equal(await page.locator('.hero-network__nodes').isVisible(), true, '手机端导航入口卡片仍应保留显示');

  await page.setViewportSize({ width: 1280, height: 800 });
  assert.equal(await page.locator('.home-status').isVisible(), true, '桌面端应正常显示内容重建状态条');
  assert.equal(await page.locator('.hero-network__figure').isVisible(), true, '桌面端应正常显示看板娘插画');
});

test('手机端底部拇指栏、首页显性搜索、本页小节抽屉与代码块一键复制', async t => {
  const page = await setup(t, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
  await page.goto(origin);
  await ready(page);

  const dock = page.locator('[data-mobile-dock]');
  assert.equal(await dock.isVisible(), true, '手机端应显示底部拇指快捷栏');
  assert.equal(await page.locator('.header-github').isVisible(), false, '手机端顶栏应隐藏 GitHub 图标以保持宽松');
  assert.equal(await page.locator('.home-mobile-search').isVisible(), true, '手机端首页首屏应显示显性搜索入口');

  const dockItems = await dock.locator('.mobile-dock__item').evaluateAll(els =>
    els.map(el => ({ text: el.textContent?.trim(), height: el.getBoundingClientRect().height })),
  );
  assert.equal(dockItems.length, 5);
  for (const item of dockItems) {
    assert.ok(item.height >= 44, `底部栏入口「${item.text}」高度应 >= 44px（实际 ${item.height}）`);
  }

  // 向下滚动超过阈值时底部栏自动隐退，向上回拉时重新浮现
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForFunction(() => document.querySelector('[data-mobile-dock]')?.getAttribute('data-dock-hidden') === 'true');
  await page.evaluate(() => window.scrollTo(0, 420));
  await page.waitForFunction(() => document.querySelector('[data-mobile-dock]')?.getAttribute('data-dock-hidden') === 'false');

  // 点击首页显性搜索打开全站搜索时，底部栏自动退避隐藏
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('.home-mobile-search').click();
  await page.waitForFunction(() => document.querySelector('.search-dialog')?.open === true);
  assert.equal(await dock.getAttribute('data-dock-hidden'), 'true', '搜索弹窗打开时底部栏应自动退避');
  await page.locator('.search-dialog__close').click();
  await page.waitForFunction(() => !document.querySelector('.search-dialog')?.open);

  // 切换到桌面端，底部栏、首页手机搜索隐藏，顶栏 GitHub 恢复显示
  await page.setViewportSize({ width: 1280, height: 800 });
  assert.equal(await dock.isVisible(), false);
  assert.equal(await page.locator('.home-mobile-search').isVisible(), false);
  assert.equal(await page.locator('.header-github').isVisible(), true);

  // 指南长文页：本页小节底部抽屉与代码块一键复制
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + '/guide/ai-faq/');
  await ready(page);

  const tocFab = page.locator('[data-toc-open]');
  assert.equal(await tocFab.isVisible(), true, '手机端长文页应显示「本页小节」悬浮按钮');
  const [fabBox, dockBox] = await Promise.all([tocFab.boundingBox(), dock.boundingBox()]);
  assert.ok(fabBox && dockBox && fabBox.y + fabBox.height <= dockBox.y + 1, '悬浮按钮与底部栏不应重叠');

  await tocFab.click();
  const tocSheet = page.locator('[data-toc-sheet]');
  await page.waitForFunction(() => document.querySelector('[data-toc-sheet]')?.open === true);
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).overflow), 'hidden', '打开本页小节抽屉时应锁定背景页滚动');
  const firstTocLink = tocSheet.locator('[data-toc-link]').nth(1);
  const targetId = decodeURIComponent((await firstTocLink.getAttribute('href')).slice(1));
  await firstTocLink.click();
  await page.waitForFunction(() => !document.querySelector('[data-toc-sheet]')?.open);
  assert.equal(decodeURIComponent(new URL(page.url()).hash.slice(1)), targetId);
  assert.equal(await tocFab.evaluate(el => el === document.activeElement), true, '跳转并关闭小节抽屉后焦点应回到触发按钮');

  const copyBtn = page.locator('[data-code-block] .code-copy-btn').first();
  assert.equal(await copyBtn.isVisible(), true);
  await copyBtn.click();
  await page.waitForFunction(() => document.querySelector('[data-code-block] .code-copy-btn')?.textContent === '已复制');
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  assert.ok(copied.length > 0, '点击代码块复制按钮应写入真实代码内容');

  // 活动页：手机端也展示 ASCII 星球背景且不发生横向溢出
  await page.goto(origin + '/events/');
  await ready(page);
  const planetMetrics = await page.evaluate(() => {
    const canvas = document.querySelector('[data-challenge-ascii-planet]');
    const rect = canvas?.getBoundingClientRect();
    return {
      docOverflow: document.documentElement.scrollWidth <= innerWidth + 1,
      visible: canvas ? getComputedStyle(canvas).display !== 'none' : false,
      width: rect?.width ?? 0,
      height: rect?.height ?? 0,
    };
  });
  assert.equal(planetMetrics.docOverflow, true, '活动页手机端启用 ASCII 星球后不应横向溢出');
  assert.equal(planetMetrics.visible, true, '活动页手机端应展示 ASCII 星球');
  assert.ok(planetMetrics.width > 200 && planetMetrics.height > 150, '手机端 ASCII 星球画布应具备可见尺寸');
});
test('首页 Hero 像素卡片悬停后整片点亮，指针附近更亮更大，离开后熄灭', async t => {
  const page = await setup(t);
  const card = page.locator('[data-hero-pixels]');
  const canvas = card.locator('.home-hero__pixels');
  await canvas.waitFor();

  // 读画布：total 为整体点亮像素数，near 为指定点周围半径内的点亮数
  const probe = (point) => canvas.evaluate((el, where) => {
    const ctx = el.getContext('2d');
    const { data } = ctx.getImageData(0, 0, el.width, el.height);
    const rect = el.getBoundingClientRect();
    const scale = el.width / rect.width;
    let total = 0;
    let blue = 0;
    let near = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 24) continue;
      total += 1;
      if (data[i + 2] > data[i] + 24) blue += 1;
    }
    if (where) {
      const radius = Math.round(56 * scale);
      const cx = Math.round((where.x - rect.left) * scale);
      const cy = Math.round((where.y - rect.top) * scale);
      for (let y = Math.max(0, cy - radius); y < Math.min(el.height, cy + radius); y += 1) {
        for (let x = Math.max(0, cx - radius); x < Math.min(el.width, cx + radius); x += 1) {
          if (data[(y * el.width + x) * 4 + 3] >= 24) near += 1;
        }
      }
    }
    return { total, blue, near };
  }, point);

  const box = await card.boundingBox();
  const left = { x: box.x + box.width * .22, y: box.y + box.height * .7 };
  const right = { x: box.x + box.width * .78, y: box.y + box.height * .3 };

  assert.equal((await probe()).total, 0, '未悬停时卡片应保持干净');

  await page.mouse.move(left.x, left.y, { steps: 4 });
  await page.waitForTimeout(900);
  const nearLeft = await probe(left);
  assert.ok(nearLeft.total > 800, '进入卡片后整片点阵应依次亮起，而不只是指针附近');
  assert.ok(nearLeft.blue / nearLeft.total > .9, '光效必须是蓝色');

  const awayFromLeft = await probe(right);
  assert.ok(nearLeft.near > awayFromLeft.near * 1.25, '指针附近的点必须比远处更大更密');

  await page.mouse.move(right.x, right.y, { steps: 6 });
  await page.waitForTimeout(700);
  const nearRight = await probe(right);
  const nearLeftAfter = await probe(left);
  assert.ok(nearRight.near > nearLeftAfter.near * 1.25, '增强区域应跟随指针到新位置');

  await page.mouse.move(box.x - 40, box.y + box.height / 2);
  await page.waitForTimeout(900);
  assert.equal((await probe()).total, 0, '指针离开卡片后整片点阵应完全熄灭');

  const reduced = await setup(t, { reducedMotion: 'reduce' });
  const reducedCard = reduced.locator('[data-hero-pixels]');
  const reducedBox = await reducedCard.boundingBox();
  await reduced.mouse.move(reducedBox.x + reducedBox.width / 2, reducedBox.y + reducedBox.height / 2, { steps: 4 });
  await reduced.waitForTimeout(500);
  assert.equal(await reduced.locator('.home-hero__pixels').evaluate(el => {
    const { data } = el.getContext('2d').getImageData(0, 0, el.width, el.height);
    let lit = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] > 0) lit += 1;
    return lit;
  }), 0, '减少动效下不绘制光效');
});

test('全站指针光晕跟随指针、离开后淡出，减少动效下不出现', async t => {
  const page = await setup(t);
  const glow = page.locator('[data-cursor-glow]');
  await glow.waitFor({ state: 'attached' });

  const state = () => glow.evaluate(el => {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      active: el.dataset.active,
      opacity: Number(style.opacity),
      blend: style.mixBlendMode,
      centerX: rect.x + rect.width / 2,
      centerY: rect.y + rect.height / 2,
    };
  });

  const idle = await state();
  assert.equal(idle.opacity, 0, '没有指针移动时不显示光晕');

  await page.mouse.move(320, 260, { steps: 4 });
  await page.waitForTimeout(500);
  const near = await state();
  assert.equal(near.active, 'true', '指针移动后光晕应出现');
  assert.ok(near.opacity > .9, '光晕应淡入到可见');
  assert.ok(Math.abs(near.centerX - 320) < 3 && Math.abs(near.centerY - 260) < 3, '光晕应落在指针处');

  await page.mouse.move(900, 620, { steps: 8 });
  await page.waitForTimeout(600);
  const moved = await state();
  assert.ok(Math.abs(moved.centerX - 900) < 3 && Math.abs(moved.centerY - 620) < 3, '光晕应跟随指针移动');

  // 指针离开文档（relatedTarget 为空）后淡出
  await page.evaluate(() => window.dispatchEvent(new PointerEvent('pointerout', { bubbles: true })));
  await page.waitForTimeout(400);
  assert.equal((await state()).opacity, 0, '指针离开窗口后光晕应淡出');

  const glossary = await setup(t);
  await glossary.goto(`${origin}/glossary/`);
  await ready(glossary);
  await glossary.mouse.move(700, 400, { steps: 4 });
  await glossary.waitForTimeout(400);
  assert.equal(await glossary.locator('[data-cursor-glow]').evaluate(el => el.dataset.active), 'true', '光晕在全站每个页面都可用');
  assert.equal(await glossary.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, '光晕不能造成横向溢出');

  const reduced = await setup(t, { reducedMotion: 'reduce' });
  await reduced.mouse.move(400, 300, { steps: 4 });
  await reduced.waitForTimeout(400);
  assert.equal(await reduced.locator('[data-cursor-glow]').evaluate(el => Number(getComputedStyle(el).opacity)), 0, '减少动效下不显示光晕');
});

test('指针落到顶部导航上时光效收敛到那一枚按钮，并撤走全站光晕', async t => {
  const page = await setup(t);
  const glow = page.locator('[data-nav-glow]');
  const links = page.locator('.desktop-nav .nav-link');
  await glow.waitFor({ state: 'attached' });

  const state = () => page.evaluate(() => {
    const el = document.querySelector('[data-nav-glow]');
    const cursor = document.querySelector('[data-cursor-glow]');
    const rect = el.getBoundingClientRect();
    return {
      active: el.dataset.active,
      opacity: Number(getComputedStyle(el).opacity),
      x: rect.left,
      width: rect.width,
      height: rect.height,
      navFlag: document.documentElement.dataset.navLight,
      cursorOpacity: Number(getComputedStyle(cursor).opacity),
    };
  });

  assert.equal((await state()).opacity, 0, '指针不在导航上时不点亮');

  const first = await links.nth(0).boundingBox();
  await page.mouse.move(first.x + first.width / 2, first.y + first.height / 2, { steps: 3 });
  await page.waitForTimeout(500);
  const firstNow = await links.nth(0).boundingBox();
  const onFirst = await state();
  assert.equal(onFirst.active, 'true', '指针落到按钮上后应点亮');
  assert.ok(onFirst.opacity > .9, '按钮上的光应淡入到可见');
  assert.ok(Math.abs(onFirst.x - firstNow.x) < 2, '光的左边缘应贴住被指到的按钮');
  assert.ok(Math.abs(onFirst.width - firstNow.width) < 2, '光的宽度应等于那枚按钮');
  assert.ok(Math.abs(onFirst.height - firstNow.height) < 2, '光的高度应等于那枚按钮');
  assert.equal(onFirst.navFlag, 'true', '导航内光效生效时通知全站');
  assert.ok(onFirst.cursorOpacity < .05, '全站光晕应撤走，避免同一处两层亮斑');

  const third = await links.nth(2).boundingBox();
  await page.mouse.move(third.x + third.width / 2, third.y + third.height / 2, { steps: 4 });
  await page.waitForTimeout(500);
  const thirdNow = await links.nth(2).boundingBox();
  const onThird = await state();
  assert.ok(onThird.opacity > .9, '换一枚按钮后光仍然亮着');
  assert.ok(Math.abs(onThird.x - thirdNow.x) < 2, '光应随指针挪到新的按钮上');

  await page.mouse.move(thirdNow.x + thirdNow.width / 2, thirdNow.y + 240, { steps: 4 });
  await page.waitForTimeout(500);
  const away = await state();
  assert.equal(away.opacity, 0, '指针离开导航后按钮上的光应熄灭');
  assert.equal(away.navFlag, 'false', '离开导航后把光效交还给全站光晕');

  const reduced = await setup(t, { reducedMotion: 'reduce' });
  const reducedLink = await reduced.locator('.desktop-nav .nav-link').nth(1).boundingBox();
  await reduced.mouse.move(reducedLink.x + reducedLink.width / 2, reducedLink.y + reducedLink.height / 2, { steps: 3 });
  await reduced.waitForTimeout(300);
  assert.equal(await reduced.locator('[data-nav-glow]').evaluate(el => Number(getComputedStyle(el).opacity)), 0, '减少动效下不点亮按钮光');
});
test('首页引导图节点用与导航同一套光效：指针进到卡片里点亮，离开后熄灭', async t => {
  const page = await setup(t);
  const node = page.locator('.hero-node--tools');
  const glow = page.locator('.hero-node--tools [data-glow]');
  await glow.waitFor({ state: 'attached' });

  const state = () => page.evaluate(() => {
    const el = document.querySelector('.hero-node--tools [data-glow]');
    const nav = document.querySelector('[data-nav-glow]');
    const cursor = document.querySelector('[data-cursor-glow]');
    const rect = el.getBoundingClientRect();
    return {
      active: el.dataset.active,
      opacity: Number(getComputedStyle(el).opacity),
      width: rect.width,
      height: rect.height,
      // 只看色标里的 RGB：两处渐变形状不同（卡片更扁），共用的是那一个浅蓝
      tint: (getComputedStyle(el).backgroundImage.match(/rgba?\(([^)]+)\)/) || [])[1].split(',').slice(0, 3).map(Number).join(','),
      navTint: nav ? (getComputedStyle(nav).backgroundImage.match(/rgba?\(([^)]+)\)/) || [])[1].split(',').slice(0, 3).map(Number).join(',') : '',
      cursorTint: getComputedStyle(document.documentElement).getPropertyValue('--cursor-glow-blue').trim().replace(/\s+/g, ''),
      heroFlag: document.documentElement.dataset.heroLight,
      cursorOpacity: Number(getComputedStyle(cursor).opacity),
    };
  });

  assert.equal((await state()).opacity, 0, '指针不在卡片上时不点亮');

  const box = await node.boundingBox();
  await page.mouse.move(box.x + box.width * 0.3, box.y + box.height / 2, { steps: 4 });
  await page.waitForTimeout(500);
  const on = await state();
  const nodeNow = await node.boundingBox();
  assert.equal(on.active, 'true', '指针进到卡片里后应点亮');
  assert.ok(on.opacity > .9, '卡片里的光应淡入到可见');
  // 卡片有 1px 边框，inset:0 的光比外框小两圈，给 3px 容差
  assert.ok(Math.abs(on.width - nodeNow.width) <= 3 && Math.abs(on.height - nodeNow.height) <= 3, '光应正好铺满这张卡片');
  assert.equal(on.tint, on.navTint, '卡片与导航共用同一个浅蓝');
  const sum = (rgb) => String(rgb).split(',').map(Number).reduce((a, b) => a + b, 0);
  assert.ok(sum(on.tint) > sum(on.cursorTint), '光效的蓝要比全站光晕浅一档');
  assert.equal(on.heroFlag, 'true', '卡片内光效生效时通知全站');
  assert.ok(on.cursorOpacity < .05, '全站光晕应撤走，避免同一处两层亮斑');

  // 卡片外的看板娘插画上不该留着光（往卡片左边挪，别落进下面那张「作品广场」）
  await page.mouse.move(nodeNow.x - 160, nodeNow.y + nodeNow.height / 2, { steps: 4 });
  await page.waitForTimeout(500);
  const away = await state();
  assert.equal(away.opacity, 0, '指针离开卡片后光应熄灭');
  assert.equal(away.heroFlag, 'false', '离开卡片后把光效交还给全站光晕');

  const reduced = await setup(t, { reducedMotion: 'reduce' });
  const reducedBox = await reduced.locator('.hero-node--tools').boundingBox();
  await reduced.mouse.move(reducedBox.x + reducedBox.width / 2, reducedBox.y + reducedBox.height / 2, { steps: 4 });
  await reduced.waitForTimeout(300);
  assert.equal(await reduced.locator('.hero-node--tools [data-glow]').evaluate(el => Number(getComputedStyle(el).opacity)), 0, '减少动效下不点亮卡片光');
});


test('页头控件与主按钮也用同一套光效：悬停时点亮，并撤走全站光晕', async t => {
  const page = await setup(t);
  await ready(page);

  const hostState = (selector) => page.evaluate((sel) => {
    const host = document.querySelector(sel);
    const all = document.querySelectorAll('[data-glow-host]');
    const glow = host.querySelector('[data-glow]');
    const cursor = document.querySelector('[data-cursor-glow]');
    const rect = glow.getBoundingClientRect();
    const hostRect = host.getBoundingClientRect();
    return {
      hosts: all.length,
      opacity: Number(getComputedStyle(glow).opacity),
      active: glow.dataset.active,
      width: rect.width,
      height: rect.height,
      hostWidth: hostRect.width,
      uiFlag: document.documentElement.dataset.uiLight,
      cursorOpacity: Number(getComputedStyle(cursor).opacity),
    };
  }, selector);

  assert.equal((await hostState('.home-hero__actions .btn--primary')).hosts >= 4, true, '主按钮与页头三个控件都接上了光效');

  const cta = page.locator('.home-hero__actions .btn--primary');
  const ctaBox = await cta.boundingBox();
  await page.mouse.move(ctaBox.x + ctaBox.width / 2, ctaBox.y + ctaBox.height / 2, { steps: 4 });
  await page.waitForTimeout(500);
  const onCta = await hostState('.home-hero__actions .btn--primary');
  assert.equal(onCta.active, 'true', '指针落到主按钮上应点亮');
  assert.ok(onCta.opacity > .9, '主按钮上的光应淡入到可见');
  // 光铺在按钮自己的内框里，比外框小 0–3px（1px 边框 / 圆角取样）
  assert.ok(Math.abs(onCta.width - onCta.hostWidth) <= 3, '光应铺满按钮宽度');
  assert.equal(onCta.uiFlag, 'true', '控件内的光效生效时通知全站');
  assert.ok(onCta.cursorOpacity < .05, '全站光晕应撤走，避免同一处两层亮斑');

  await page.mouse.move(ctaBox.x + ctaBox.width / 2 - 320, ctaBox.y - 120, { steps: 4 });
  await page.waitForTimeout(500);
  const away = await hostState('.home-hero__actions .btn--primary');
  assert.equal(away.opacity, 0, '指针离开按钮后光应熄灭');
  assert.equal(away.uiFlag, 'false', '离开后把光效交还给全站光晕');

  for (const selector of ['.search-trigger', '.theme-picker__trigger', '.header-github']) {
    const box = await page.locator(selector).boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 4 });
    await page.waitForTimeout(420);
    const state = await hostState(selector);
    assert.equal(state.active, 'true', `指针落到 ${selector} 上应点亮`);
    assert.ok(state.opacity > .9, `${selector} 上的光应淡入到可见`);
    assert.ok(Math.abs(state.width - state.hostWidth) <= 3, `${selector} 的光应铺满控件宽度`);
    assert.equal(state.uiFlag, 'true', `${selector} 亮起时通知全站`);
    assert.ok(state.cursorOpacity < .05, `${selector} 亮起时全站光晕应撤走`);
  }

  await page.mouse.move(640, 980, { steps: 4 });
  await page.waitForTimeout(450);
  assert.equal((await hostState('.search-trigger')).opacity, 0, '指针离开页头后最后点亮的控件应熄灭');

  const reduced = await setup(t, { reducedMotion: 'reduce' });
  await ready(reduced);
  const reducedCta = await reduced.locator('.home-hero__actions .btn--primary').boundingBox();
  await reduced.mouse.move(reducedCta.x + reducedCta.width / 2, reducedCta.y + reducedCta.height / 2, { steps: 3 });
  await reduced.waitForTimeout(300);
  assert.equal(await reduced.locator('.home-hero__actions .btn--primary [data-glow]').evaluate(el => Number(getComputedStyle(el).opacity)), 0, '减少动效下不点亮按钮光');
});


test('站内同类按钮自动接上同一束光：正文按钮、筛选片、复制键', async t => {
  const page = await setup(t);

  const coverage = (selector) => page.evaluate((sel) => {
    const items = Array.from(document.querySelectorAll(sel));
    return {
      total: items.length,
      covered: items.filter(el => el.hasAttribute('data-glow-host') && el.querySelectorAll(':scope > .hover-glow').length === 1).length,
    };
  }, selector);

  // 关于页：正文里的整排按钮
  await page.goto(origin + '/about/'); await ready(page);
  const aboutButtons = await coverage('.btn');
  assert.ok(aboutButtons.total >= 4, '关于页应有整排正文按钮');
  assert.equal(aboutButtons.covered, aboutButtons.total, '正文按钮都应自动接上光效');

  const soft = page.locator('.page-hero__actions .btn--soft').first();
  const softBox = await soft.boundingBox();
  await page.mouse.move(softBox.x + softBox.width * .4, softBox.y + softBox.height / 2, { steps: 4 });
  await page.waitForTimeout(450);
  const softOn = await page.evaluate(() => {
    const host = document.querySelector('.page-hero__actions .btn--soft');
    const glow = host.querySelector('[data-glow]');
    return {
      active: glow.getAttribute('data-active'),
      opacity: Number(getComputedStyle(glow).opacity),
      width: glow.getBoundingClientRect().width,
      hostWidth: host.getBoundingClientRect().width,
      inFrontOf: getComputedStyle(host).isolation,
    };
  });
  assert.equal(softOn.active, 'true', '指针落到次级按钮上应点亮');
  assert.ok(softOn.opacity > .9, '次级按钮上的光应淡入到可见');
  assert.ok(Math.abs(softOn.width - softOn.hostWidth) <= 3, '光应铺满整枚按钮');
  assert.equal(softOn.inFrontOf, 'isolate', '宿主应建立层叠上下文，让光压在底色之上、文字之下');

  // 工具页：侧栏筛选片 + 「清除筛选」
  await page.goto(origin + '/tools/'); await ready(page);
  const chips = await coverage('.filter-chip');
  assert.ok(chips.total >= 8, '工具页应有整列筛选片');
  assert.equal(chips.covered, chips.total, '筛选片都应自动接上光效');
  assert.equal((await coverage('.clear-filters')).covered, (await coverage('.clear-filters')).total, '清除筛选按钮也应接上');

  const chip = page.locator('.filter-chips--vertical .filter-chip').nth(2);
  const chipBox = await chip.boundingBox();
  await page.mouse.move(chipBox.x + chipBox.width * .6, chipBox.y + chipBox.height / 2, { steps: 4 });
  await page.waitForTimeout(450);
  assert.equal(await chip.locator('[data-glow]').getAttribute('data-active'), 'true', '指针落到筛选片上应点亮');
  assert.equal(await page.evaluate(() => document.documentElement.dataset.uiLight), 'true', '筛选片亮起时通知全站');
  // 只有被指到的那一枚亮，其余保持熄灭
  assert.equal(await page.locator('.filter-chips--vertical .filter-chip [data-glow][data-active="true"]').count(), 1, '同时只应有一枚按钮发光');

  // 术语详情页：正文里的复制键
  await page.goto(origin + '/glossary/hallucination/'); await ready(page);
  assert.equal((await coverage('.term-copy')).covered, 1, '术语页复制键应自动接上光效');
  const copy = page.locator('.term-copy');
  const copyBox = await copy.boundingBox();
  await page.mouse.move(copyBox.x + copyBox.width * .4, copyBox.y + copyBox.height / 2, { steps: 4 });
  await page.waitForTimeout(450);
  assert.equal(await copy.locator('[data-glow]').getAttribute('data-active'), 'true', '指针落到复制键上应点亮');
});


test('侧栏搜索框与列表卡片接上同一束光', async t => {
  const page = await setup(t);

  const coverage = (selector) => page.evaluate((sel) => {
    const items = Array.from(document.querySelectorAll(sel));
    return {
      total: items.length,
      covered: items.filter(el => el.hasAttribute('data-glow-host') && el.querySelectorAll(':scope > .hover-glow').length === 1).length,
    };
  }, selector);

  // 工具页：侧栏搜索框——输入框自己有底色，光层必须压在它上面才看得见
  await page.goto(origin + '/tools/'); await ready(page);
  assert.equal((await coverage('.search-field')).covered, 1, '侧栏搜索框应接上光效');
  const search = page.locator('.catalog-sidebar .search-field').first();
  const searchBox = await search.boundingBox();
  await page.mouse.move(searchBox.x + searchBox.width * .62, searchBox.y + searchBox.height / 2, { steps: 4 });
  await page.waitForTimeout(450);
  const searchOn = await search.evaluate((host) => {
    const glow = host.querySelector('[data-glow]');
    return {
      active: glow.getAttribute('data-active'),
      opacity: Number(getComputedStyle(glow).opacity),
      zIndex: getComputedStyle(glow).zIndex,
      width: glow.getBoundingClientRect().width,
      hostWidth: host.getBoundingClientRect().width,
      cx: glow.style.getPropertyValue('--glow-cx'),
    };
  });
  assert.equal(searchOn.active, 'true', '指针落到搜索框上应点亮');
  assert.ok(searchOn.opacity > .9, '搜索框上的光应淡入到可见');
  assert.equal(searchOn.zIndex, '1', '光层要抬到输入框之上，否则被输入框底色挡住');
  assert.ok(Math.abs(searchOn.width - searchOn.hostWidth) <= 3, '光应铺满整条输入框');
  assert.ok(parseFloat(searchOn.cx) > 50, '亮心应跟着指针偏到右半边');
  assert.equal(await page.evaluate(() => document.documentElement.dataset.uiLight), 'true', '搜索框亮起时通知全站光晕让位');

  // 工具页：列表里的工具卡
  const cards = await coverage('.tool-card');
  assert.ok(cards.total >= 6, '工具页应有一整片工具卡');
  assert.equal(cards.covered, cards.total, '工具卡都应自动接上光效');
  const card = page.locator('.tool-card').first();
  const cardIdleBorder = await card.evaluate(host => getComputedStyle(host).borderTopColor);
  const cardBox = await card.boundingBox();
  await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2, { steps: 4 });
  await page.waitForTimeout(450);
  assert.equal(await card.locator('[data-glow]').getAttribute('data-active'), 'true', '指针落到工具卡上应点亮');
  // 卡片用的是点阵光（不是整面渐变），并且由宿主自己那一圈描边接力点亮
  const cardLit = await card.evaluate((host) => {
    const glow = host.querySelector('[data-glow]');
    const cs = getComputedStyle(glow);
    return {
      image: cs.backgroundImage,
      filter: cs.filter,
      border: getComputedStyle(host).borderTopColor,
      cy: glow.style.getPropertyValue('--glow-cy'),
    };
  });
  assert.ok(cardLit.image.includes('radial-gradient'), '卡片上是一团柔光，不是点阵');
  assert.ok(/132px/.test(cardLit.image), '光斑是固定 px 半径的圆，只亮指针那一片');
  assert.ok(cardLit.filter.includes('blur'), '光斑边缘要糊掉才读成光晕');
  assert.notEqual(cardLit.border, cardIdleBorder, '指着的那张卡，外圈描边要点亮');
  assert.ok(parseFloat(cardLit.cy) > 0, '点阵的亮心要跟着指针上下移动');
  assert.equal(await page.locator('.tool-card [data-glow][data-active="true"]').count(), 1, '同时只应有一张卡片发光');

  // 术语页：术语卡与侧栏分支行
  await page.goto(origin + '/glossary/'); await ready(page);
  const terms = await coverage('.glossary-term');
  assert.ok(terms.total >= 1, '术语页应至少有一张术语卡');
  assert.equal(terms.covered, terms.total, '术语卡都应自动接上光效');
  const rows = await coverage('.branch-row__label');
  assert.ok(rows.total >= 6, '术语侧栏应有分类分支行');
  assert.equal(rows.covered, rows.total, '侧栏分支行也应接上光效');

  const term = page.locator('.glossary-term').first();
  const termBox = await term.boundingBox();
  await page.mouse.move(termBox.x + termBox.width / 2, termBox.y + termBox.height / 2, { steps: 4 });
  await page.waitForTimeout(450);
  assert.equal(await term.locator('[data-glow]').getAttribute('data-active'), 'true', '指针落到术语卡上应点亮');

  const row = page.locator('.branch-row__label').first();
  const rowBox = await row.boundingBox();
  await page.mouse.move(rowBox.x + rowBox.width * .5, rowBox.y + rowBox.height / 2, { steps: 4 });
  await page.waitForTimeout(450);
  assert.equal(await row.locator('[data-glow]').getAttribute('data-active'), 'true', '指针落到侧栏分支行上应点亮');
  assert.equal(await page.locator('[data-glow][data-active="true"]').count(), 1, '同时只应有一处发光');
});

test('鼠标光效开关：关掉后四条光效链路一起停，刷新后仍记住', async t => {
  const page = await setup(t);
  assert.equal(await page.evaluate(() => document.documentElement.dataset.glow), 'on', '默认应该开着');

  await menu(page);
  const toggle = page.locator('[data-glow-toggle]');
  assert.match(await toggle.innerText(), /鼠标光效/, '开关就叫「鼠标光效」');
  assert.equal(await toggle.getAttribute('aria-checked'), 'true', '默认是开着的');

  await toggle.click();
  assert.equal(await page.evaluate(() => document.documentElement.dataset.glow), 'off', '关掉后 html 上要有标记');
  assert.equal(await toggle.getAttribute('aria-checked'), 'false', '开关要跟着状态走');
  assert.equal(await page.evaluate(() => localStorage.getItem('cdu-ai-glow')), 'off', '偏好要存下来');

  // 首页：Hero 点阵光与全站指针光晕都退场
  const canvas = page.locator('[data-hero-pixels] .home-hero__pixels').first();
  assert.equal(await canvas.evaluate(el => getComputedStyle(el).display), 'none', 'Hero 点阵画布也要收起');
  await page.mouse.move(320, 360, { steps: 6 });
  await page.waitForTimeout(200);
  assert.equal(await page.locator('.cursor-glow').evaluate(el => getComputedStyle(el).opacity), '0', '指针光晕不应亮起');

  // 导航：光不汇聚
  const link = page.locator('.desktop-nav .nav-link').first();
  const linkBox = await link.boundingBox();
  await page.mouse.move(linkBox.x + linkBox.width / 2, linkBox.y + linkBox.height / 2, { steps: 6 });
  await page.waitForTimeout(400);
  assert.equal(await page.locator('.nav-glow').evaluate(el => getComputedStyle(el).opacity), '0', '导航这一束光不应出现');

  // 卡片：亮层不亮
  await page.goto(origin + '/tools/');
  await ready(page);
  const card = page.locator('.tool-card').first();
  const cardBox = await card.boundingBox();
  await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2, { steps: 6 });
  await page.waitForTimeout(400);
  assert.equal(await card.evaluate(host => getComputedStyle(host.querySelector('[data-glow]')).opacity), '0', '卡片上的光不应亮起');

  // 刷新后仍然是关着的
  await page.reload();
  await ready(page);
  assert.equal(await page.evaluate(() => document.documentElement.dataset.glow), 'off', '刷新后保持关闭');
  await menu(page);
  await page.locator('[data-glow-toggle]').click();
  assert.equal(await page.evaluate(() => document.documentElement.dataset.glow), 'on', '再点一次要能打开');
  await page.keyboard.press('Escape');
  // 面板要先收起再悬停卡片：不同环境下主题面板的高度不同，
  // 没收起时卡片中心可能正落在面板下面，指针事件会打到面板上
  await page.locator('[data-theme-panel]').waitFor({ state: 'hidden' });
  await page.mouse.move(4, 4, { steps: 2 });
  await card.scrollIntoViewIfNeeded();
  const again = await card.boundingBox();
  await page.mouse.move(again.x + 24, again.y + 24, { steps: 6 });
  await page.waitForTimeout(650);
  assert.ok(
    parseFloat(await card.evaluate(host => getComputedStyle(host.querySelector('[data-glow]')).opacity)) > 0.9,
    '打开后卡片应恢复发光',
  );
});


test('学习指南侧栏的分组标题与条目也接上同一束光', async t => {
  const page = await setup(t);
  await page.goto(origin + '/guide/');
  await ready(page);

  const summaries = page.locator('.guide-nav__summary');
  const summaryCount = await summaries.count();
  assert.ok(summaryCount >= 4, '侧栏分组标题应成排出现');
  const coveredSummaries = await summaries.evaluateAll(els => els.filter(el => el.hasAttribute('data-glow-host') && el.querySelectorAll(':scope > .hover-glow').length === 1).length);
  assert.equal(coveredSummaries, summaryCount, '每个分组标题都要有光层');

  const first = summaries.nth(1);
  const box = await first.boundingBox();
  await page.mouse.move(box.x + box.width * 0.4, box.y + box.height / 2, { steps: 6 });
  await page.waitForTimeout(420);
  assert.equal(await first.locator('[data-glow]').getAttribute('data-active'), 'true', '指针落到分组标题上应点亮');
  const glowBox = await first.locator('[data-glow]').boundingBox();
  assert.ok(Math.abs(glowBox.width - box.width) <= 3, '光宽要贴合这一行');
  assert.equal(await page.locator('.guide-nav [data-glow][data-active="true"]').count(), 1, '同时只应有一处发光');
  assert.equal(await page.evaluate(() => document.documentElement.dataset.uiLight), 'true', '全站光晕要让位');

  const item = page.locator('.guide-nav ul a:not([data-planned])').first();
  const itemBox = await item.boundingBox();
  await page.mouse.move(itemBox.x + itemBox.width * 0.62, itemBox.y + itemBox.height / 2, { steps: 6 });
  await page.waitForTimeout(420);
  assert.equal(await item.locator('[data-glow]').getAttribute('data-active'), 'true', '指针落到条目上也应点亮');
  assert.ok(
    parseFloat(await item.evaluate(el => el.querySelector('[data-glow]').style.getPropertyValue('--glow-cx'))) > 50,
    '光心要跟着指针偏到右半边',
  );
  assert.equal(await page.locator('.guide-nav [data-glow][data-active="true"]').count(), 1, '换一条目时上一处要熄灭');

  // 参考资源链接同样接光
  const footLink = page.locator('.guide-sidebar__foot a').first();
  assert.equal(await footLink.evaluate(el => el.querySelectorAll(':scope > .hover-glow').length), 1, '侧栏底部链接也要有光层');

  // 只有占位页的「待补充」章节不接管光效：光读起来像「这里有内容」，
  // 留给已经写完的章节。它们现在是可点的链接（data-planned="true"），但保持无光。
  const planned = page.locator('.guide-nav ul a[data-planned="true"]');
  assert.ok(await planned.count() > 0, '目录里应仍有待补充章节');
  assert.equal(
    await planned.evaluateAll(els => els.filter(el => el.hasAttribute('data-glow-host')).length),
    0,
    '待补充章节是占位页，不应接光',
  );
});


const trailState = (page) => page.evaluate(() => {
  const canvas = document.querySelector('[data-cursor-trail]');
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let lit = 0;
  for (let i = 3; i < data.length; i += 28) if (data[i] > 4) lit += 1;
  return { active: canvas.dataset.active ?? null, display: getComputedStyle(canvas).display, opacity: getComputedStyle(canvas).opacity, lit };
});

/** 在空白区域划一道弧线，返回划过之后的尾迹状态 */
async function streak(page) {
  await page.mouse.move(360, 620, { steps: 4 });
  await page.mouse.move(520, 560, { steps: 6 });
  await page.mouse.move(700, 620, { steps: 6 });
  await page.mouse.move(860, 540, { steps: 8 });
  // 尾迹在下一帧才落笔，等一拍再读画布
  await page.waitForTimeout(90);
}

test('光效拖尾：指针划过留下流星尾迹，停下后自己淡完', async t => {
  const page = await setup(t);
  await page.goto(origin + '/guide/');
  await ready(page);

  assert.equal(await page.evaluate(() => document.documentElement.dataset.trail), 'on', '拖尾默认开着');
  const canvas = page.locator('[data-cursor-trail]');
  assert.equal(await canvas.count(), 1, '页面上要有一张拖尾画布');

  await streak(page);
  const drawn = await trailState(page);
  assert.ok(drawn.lit > 0, '划过的轨迹要画在画布上');
  assert.equal(drawn.active, 'true', '有尾迹时画布要标成 active');
  assert.equal(drawn.display, 'block', '尾迹画布要显示');

  // 停下后尾迹淡完，画布清空、帧循环停下（尾迹存活 780ms，留一点余量）
  await page.waitForTimeout(1100);
  const faded = await trailState(page);
  assert.equal(faded.lit, 0, '指针停下后尾迹要淡完');
  assert.equal(faded.active, 'false', '淡完后画布收回 active');

  // 尾迹会跟着指针走：换一处再划，仍在指针经过的位置出现
  await page.mouse.move(1100, 300, { steps: 10 });
  assert.ok((await trailState(page)).lit > 0, '换一处划过同样有尾迹');
});

test('光效拖尾是单独开关：和鼠标光效互不牵连，刷新后仍记住', async t => {
  const page = await setup(t);
  await page.goto(origin + '/guide/');
  await ready(page);

  await menu(page);
  const glowToggle = page.locator('[data-glow-toggle]');
  const trailToggle = page.locator('[data-trail-toggle]');
  assert.equal(await trailToggle.count(), 1, '面板里要有「光效拖尾」开关');
  assert.match(await trailToggle.innerText(), /光效拖尾/, '开关就叫「光效拖尾」');
  assert.equal(await trailToggle.getAttribute('aria-checked'), 'true', '默认是开着的');
  const glowBox = await glowToggle.boundingBox();
  const trailBox = await trailToggle.boundingBox();
  assert.ok(Math.abs(trailBox.x - glowBox.x) <= 1, '两个开关左对齐、排在一起');
  assert.ok(trailBox.y > glowBox.y && trailBox.y - glowBox.y < 70, '拖尾开关紧跟在鼠标光效下面');

  await trailToggle.click();
  assert.equal(await page.evaluate(() => document.documentElement.dataset.trail), 'off', '关掉后 html 上要有标记');
  assert.equal(await trailToggle.getAttribute('aria-checked'), 'false', '开关要跟着状态走');
  assert.equal(await page.evaluate(() => localStorage.getItem('cdu-ai-trail')), 'off', '偏好要存下来');
  assert.equal(await page.locator('[data-cursor-trail]').evaluate(el => getComputedStyle(el).display), 'none', '关掉后画布退场');
  await page.keyboard.press('Escape');
  await streak(page);
  assert.equal((await trailState(page)).lit, 0, '关掉后不应再画尾迹');

  // 只有拖尾关掉：光晕与卡片光效照旧
  await page.keyboard.press('Escape');
  await page.goto(origin + '/tools/');
  await ready(page);
  const card = page.locator('.tool-card').first();
  const cardBox = await card.boundingBox();
  await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2, { steps: 6 });
  await page.waitForTimeout(420);
  assert.equal(await card.locator('[data-glow]').getAttribute('data-active'), 'true', '关掉拖尾不影响卡片光');

  // 反过来：鼠标光效关掉，拖尾仍按自己的开关工作
  await menu(page);
  await page.locator('[data-glow-toggle]').click();
  await page.locator('[data-trail-toggle]').click();
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(() => document.documentElement.dataset.glow), 'off');
  assert.equal(await page.evaluate(() => document.documentElement.dataset.trail), 'on');
  await streak(page);
  assert.ok((await trailState(page)).lit > 0, '关掉鼠标光效后拖尾仍然要画');

  // 刷新后两个偏好各自保持
  await page.reload();
  await ready(page);
  assert.equal(await page.evaluate(() => document.documentElement.dataset.glow), 'off', '鼠标光效保持关闭');
  assert.equal(await page.evaluate(() => document.documentElement.dataset.trail), 'on', '拖尾保持打开');
  await menu(page);
  await page.locator('[data-trail-toggle]').click();
  assert.equal(await page.evaluate(() => document.documentElement.dataset.trail), 'off', '再点一次要能关掉拖尾');
});

test('减少动效与触屏下不出现光效拖尾', async t => {
  const page = await setup(t, { reducedMotion: 'reduce' });
  await page.goto(origin + '/guide/');
  await ready(page);
  assert.equal(await page.locator('[data-cursor-trail]').evaluate(el => getComputedStyle(el).display), 'none', '减少动效下画布不显示');
  await streak(page);
  assert.equal((await trailState(page)).lit, 0, '减少动效下不画尾迹');
});

test('上游新增的浮层控件也接上同一束光：抽屉关闭键、建议修改、分支开关', async t => {
  const page = await setup(t);
  await page.goto(origin + '/guide/first-agent/');
  await ready(page);

  const suggest = page.locator('.guide-heading__suggest').first();
  assert.equal(
    await suggest.evaluate(el => el.hasAttribute('data-glow-host') && el.querySelectorAll(':scope > .hover-glow').length === 1),
    true,
    '页头「建议修改」要接光',
  );
  const suggestBox = await suggest.boundingBox();
  await page.mouse.move(suggestBox.x + suggestBox.width / 2, suggestBox.y + suggestBox.height / 2, { steps: 5 });
  await page.waitForTimeout(420);
  assert.equal(await suggest.locator('[data-glow]').getAttribute('data-active'), 'true', '悬停「建议修改」要亮');

  // 图片灯箱的缩放 / 关闭键与「点击放大」只在内文真实存在图片时才会生成，
  // 当前内容还没有配图，所以这里不硬造元素；选择器已进 AUTO_HOSTS，
  // 有图之后由 ui-glow 的 MutationObserver 自动接线（见「自动接线」那条测试）。

  // 术语页侧栏的分支展开 / 收起键
  await page.goto(origin + '/glossary/');
  await ready(page);
  const branchToggle = page.locator('.branch-row__toggle').first();
  assert.equal(await branchToggle.count(), 1, '术语侧栏要有分支开关');
  assert.equal(
    await branchToggle.evaluate(el => el.hasAttribute('data-glow-host') && el.querySelectorAll(':scope > .hover-glow').length === 1),
    true,
    '分支开关要接光',
  );

  // 手机工具详情抽屉的关闭键
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + '/tools/');
  await ready(page);
  const sheetClose = page.locator('.tool-sheet__close');
  assert.equal(
    await sheetClose.evaluate(el => el.hasAttribute('data-glow-host') && el.querySelectorAll(':scope > .hover-glow').length === 1),
    true,
    '工具详情抽屉的关闭键要接光',
  );
});
