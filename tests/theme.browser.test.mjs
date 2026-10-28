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
  assert.equal(await page.locator('[data-filter-count]').textContent(), '32');
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
  await page.waitForFunction(() => document.querySelector('[data-filter-count]').textContent === '32');
  assert.equal(await collapsed.evaluate(element => element.open), false);
  assert.equal(await page.locator('[data-collapse-count]').textContent(), '10');
  await page.locator('[data-collapse] > summary').press('Enter');
  await page.waitForFunction(() => document.querySelector('[data-filter-folded-note]').hidden);
  assert.equal(await collapsed.evaluate(element => element.open), true);

  await page.locator('[data-filter-value="llm-chat"]').press('Enter');
  await page.locator('[data-filter-cap="open-source"]').press('Enter');
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
  await page.locator('[data-filter-cap="open-source"]').press('Enter');
  await atStart();
  assert.equal(await page.locator('[data-filter-cap="open-source"]').getAttribute('aria-pressed'), 'true');
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

test('手机工具目录在短屏和普通动效下持续可读', async t => {
  const page = await setup(t, { isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
  for (const viewport of [{ width: 375, height: 667 }, { width: 390, height: 664 }, { width: 360, height: 640 }, { width: 320, height: 568 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto(origin + '/tools/');
    await ready(page);
    await page.evaluate(() => window.scrollTo({ top: 1400, behavior: 'instant' }));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(await page.locator('[data-tool-catalog]').evaluate(el => getComputedStyle(el).opacity), '1', `${viewport.width}×${viewport.height} 目录不能因显现动画保持透明`);
    assert.equal(await page.locator('[data-tool-id]:visible').count(), 9);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  }
});

test('手机全目录逐页覆盖全部工具且不重复，翻页支持键盘并返回结果区', async t => {
  const page = await setup(t, { viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true });
  await page.goto(origin + '/tools/');
  await ready(page);
  const seen = [];
  const pages = Math.ceil(tools.length / 9);
  assert.equal(await page.locator('[data-catalog-previous]').isDisabled(), true);
  for (let current = 1; current <= pages; current += 1) {
    assert.equal(await page.locator('[data-catalog-page-label]').textContent(), `第 ${current} 页，共 ${pages} 页`);
    assert.equal(await page.locator('[data-catalog-first]').isVisible(), current === pages);
    const ids = await page.locator('[data-tool-id]:visible').evaluateAll(elements => elements.map(el => el.dataset.toolId));
    assert.equal(ids.length, Math.min(9, tools.length - seen.length));
    seen.push(...ids);
    assert.equal(await page.locator('[data-filter-count]').textContent(), String(tools.length));
    assert.equal(await page.locator('[data-collapse]:visible').count(), 0, '全目录分页内不再嵌套社区折叠');
    assert.equal(await page.locator('[data-filter-group]:visible').evaluateAll(elements => elements.every(el => el.querySelector('[data-tool-id]:not([hidden])'))), true, '当前页不显示空分组标题');
    if (current < pages) {
      await page.locator('[data-catalog-next]').press('Enter');
      assert.equal(await page.locator('[data-catalog-results]').evaluate(el => el === document.activeElement), true);
      // 不只核对瞬时位置：卡片进场动画结束后，浏览器也不能把视口挪回下方。
      await page.waitForFunction(() => document.querySelectorAll('[data-filter-card].filter-appear').length === 0);
      // 等浏览器完成焦点与滚动布局，再核对最终位置，避免读取到中间帧。
      await page.waitForFunction(() => {
        const top = document.querySelector('[data-catalog-results]').getBoundingClientRect().top;
        return top >= 0 && top < 160;
      });
      const top = await page.locator('[data-catalog-results]').evaluate(el => el.getBoundingClientRect().top);
      assert.ok(top >= 0 && top < 160, `第 ${current + 1} 页应停在固定顶栏下的结果区（实际 ${top}）`);
    }
  }
  assert.equal(new Set(seen).size, tools.length);
  assert.deepEqual([...seen].sort(), tools.map(tool => tool.id).sort());
  assert.equal(await page.locator('[data-tool-id]').count(), tools.length);
  assert.equal(await page.locator('[data-catalog-next]').isDisabled(), true);
  await page.locator('[data-catalog-first]').press('Enter');
  assert.equal(new URL(page.url()).searchParams.has('page'), false);
  assert.equal(await page.locator('[data-tool-id]:visible').count(), 9);
  assert.equal(await page.locator('[data-catalog-first]').isVisible(), false);
  assert.equal(await page.locator('[data-catalog-results]').evaluate(el => el === document.activeElement), true);
  await page.goBack();
  await page.waitForFunction(last => document.querySelector('[data-catalog-page-label]').textContent.startsWith(`第 ${last} 页`), pages);
  await page.locator('[data-catalog-previous]').click();
  assert.equal(new URL(page.url()).searchParams.get('page'), String(pages - 1));
});

test('手机分页恢复 URL 和历史，搜索覆盖其他页且筛选后返回首页', async t => {
  const page = await setup(t, { viewport: { width: 390, height: 664 }, isMobile: true, hasTouch: true });
  await page.goto(origin + '/tools/?page=3');
  await ready(page);
  const thirdPage = await page.locator('[data-tool-id]:visible').evaluateAll(elements => elements.map(el => el.dataset.toolId));
  await page.locator('[data-catalog-next]').click();
  await page.reload(); await ready(page);
  assert.match(await page.locator('[data-catalog-page-label]').textContent(), /^第 4 页/);
  await page.goBack();
  await page.waitForFunction(() => document.querySelector('[data-catalog-page-label]').textContent.startsWith('第 3 页'));
  assert.deepEqual(await page.locator('[data-tool-id]:visible').evaluateAll(elements => elements.map(el => el.dataset.toolId)), thirdPage);
  await page.goForward();
  await page.waitForFunction(() => document.querySelector('[data-catalog-page-label]').textContent.startsWith('第 4 页'));

  const last = tools.at(-1);
  await page.locator('[data-filter-search]').fill(last.name);
  await page.waitForFunction(() => !new URLSearchParams(location.search).has('page'));
  assert.equal(await page.locator(`[data-tool-id="${last.id}"]`).isVisible(), true, '搜索必须能找到未在当前页展示的工具');
  assert.match(await page.locator('[data-catalog-page-label]').textContent(), /^第 1 页/);
  await page.goBack();
  await page.waitForFunction(() => document.querySelector('[data-filter-count]').textContent === String(document.querySelectorAll('[data-tool-id]').length));
  assert.equal(await page.locator('[data-filter-search]').inputValue(), '');
  assert.deepEqual(await page.locator('[data-tool-id]:visible').evaluateAll(elements => elements.map(el => el.dataset.toolId)), thirdPage);
  await page.goForward();
  await page.waitForFunction(term => document.querySelector('[data-filter-search]').value === term, last.name.toLocaleLowerCase('zh-CN'));
  assert.equal(await page.locator(`[data-tool-id="${last.id}"]`).isVisible(), true);

  await page.locator('[data-filter-search]').fill('没有这个工具-分页验收');
  await page.waitForFunction(() => document.querySelector('[data-filter-count]').textContent === '0');
  assert.equal(await page.locator('[data-empty-state]').isVisible(), true);
  assert.equal(await page.locator('[data-catalog-pagination]').isVisible(), false);
  assert.equal(await page.locator('[data-catalog-range]').isVisible(), false);
  await page.locator('[data-clear-filters]').click();
  assert.equal(await page.locator('[data-tool-id]:visible').count(), 9);
  await page.locator('[data-filter-cap="open-source"]').press('Enter');
  assert.equal(await page.locator('[data-filter-count]').textContent(), String(tools.filter(tool => tool.capabilities.includes('open-source')).length));
  assert.equal(await page.locator('[data-tool-id]:visible').evaluateAll(elements => elements.every(el => el.dataset.capabilities.split(' ').includes('open-source'))), true);
  await page.locator('[data-catalog-next]').click();
  await page.reload(); await ready(page);
  assert.equal(await page.locator('[data-filter-cap="open-source"]').getAttribute('aria-pressed'), 'true');
  assert.match(await page.locator('[data-catalog-page-label]').textContent(), /^第 2 页/);
  await page.locator('[data-filter-search]').fill('Agent');
  await page.waitForFunction(() => new URLSearchParams(location.search).get('q') === 'agent');
  const filteredCount = await page.locator('[data-filter-count]').textContent();
  assert.ok(Number(filteredCount) > 9);
  const lastFilteredPage = new URL(page.url());
  lastFilteredPage.searchParams.set('page', '999');
  await page.goto(lastFilteredPage.href); await ready(page);
  await page.locator('[data-catalog-first]').click();
  assert.equal(new URL(page.url()).searchParams.has('page'), false);
  assert.equal(new URL(page.url()).searchParams.get('q'), 'agent');
  assert.equal(new URL(page.url()).searchParams.get('caps'), 'open-source');
  assert.equal(await page.locator('[data-filter-count]').textContent(), filteredCount);
  assert.equal(await page.locator('[data-filter-search]').inputValue(), 'agent');
  assert.equal(await page.locator('[data-filter-cap="open-source"]').getAttribute('aria-pressed'), 'true');
});

test('手机分页与单分类折叠、桌面切换及非法页码兼容', async t => {
  const page = await setup(t, { viewport: { width: 390, height: 844 } });
  await page.goto(origin + '/tools/?page=4'); await ready(page);
  await page.locator('[data-filter-value="agent"]').press('Enter');
  assert.equal(await page.locator('[data-catalog-pagination]').isVisible(), false);
  assert.equal(await page.locator('[data-filter-count]').textContent(), '32');
  assert.equal(await page.locator('[data-collapse]').evaluate(el => el.open), false);
  assert.equal(await page.locator('[data-filter-folded-count]').textContent(), '10');
  assert.equal(new URL(page.url()).searchParams.has('page'), false);
  await page.locator('[data-filter-value="all"]').press('Enter');
  assert.equal(await page.locator('[data-tool-id]:visible').count(), 9);
  assert.equal(await page.locator('[data-filter-folded-note]').isVisible(), false);
  const defaultFolded = await page.locator('[data-catalog-config]').evaluate(el => JSON.parse(el.textContent).views.all.categories.flatMap(category => category.groups).reduce((sum, group) => sum + group.collapsedIds.length, 0));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForFunction(() => document.querySelector('[data-catalog-pagination]').hidden);
  assert.equal(await page.locator('[data-collapsed="true"]').count(), defaultFolded);
  assert.equal(await page.locator('[data-filter-folded-count]').textContent(), String(defaultFolded));
  assert.equal(await page.locator('[data-filter-count]').textContent(), String(tools.length));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForFunction(() => !document.querySelector('[data-catalog-pagination]').hidden);
  assert.equal(await page.locator('[data-tool-id]:visible').count(), 9);
  assert.equal(await page.locator('[data-tool-id]').count(), tools.length);
  for (const value of ['0', '-3', 'abc', '2.5', '9007199254740993']) {
    await page.goto(origin + '/tools/?page=' + value); await ready(page);
    assert.equal(new URL(page.url()).searchParams.has('page'), false);
    assert.equal(await page.locator('[data-tool-id]:visible').count(), 9);
  }
  await page.goto(origin + '/tools/?page=999'); await ready(page);
  assert.equal(new URL(page.url()).searchParams.get('page'), String(Math.ceil(tools.length / 9)));
  await page.goto(origin + '/tools/?category=tts&page=88'); await ready(page);
  assert.equal(await page.locator('[data-filter-count]').textContent(), '5');
  assert.equal(await page.locator('[data-filter-value="audio"]').getAttribute('aria-pressed'), 'true');
  assert.equal(new URL(page.url()).searchParams.has('page'), false);
});

test('手机分页在浅色、深色和自定义主题中可用，无 JS 和打印不截断目录', async t => {
  const page = await setup(t, { viewport: { width: 375, height: 667 }, reducedMotion: 'reduce' });
  await page.goto(origin + '/tools/'); await ready(page);
  for (const id of ['light', 'dark', 'preset-forest']) {
    await select(page, id);
    assert.equal(await page.locator('[data-tool-id]:visible').count(), 9);
    assert.equal(await page.locator('[data-catalog-next]').isEnabled(), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  }
  await create(page);
  await page.locator('[data-theme-field="name"]').fill('工具分页验收');
  await page.locator('[data-theme-save]').click();
  const saved = await state(page);
  await page.locator('[data-catalog-next]').click();
  await page.reload(); await ready(page);
  assert.equal((await state(page)).id, saved.id);
  assert.equal(await page.locator('[data-tool-id]:visible').count(), 9);
  await page.evaluate(() => window.addEventListener('beforeprint', () => {
    window.printedToolCount = document.querySelectorAll('[data-tool-id]:not([hidden])').length;
  }));
  await page.pdf();
  assert.equal(await page.evaluate(() => window.printedToolCount), tools.length);
  assert.equal(await page.locator('[data-tool-id]:visible').count(), 9);
  assert.equal(new URL(page.url()).searchParams.get('page'), '2');

  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 667 } });
  t.after(() => context.close());
  const staticPage = await context.newPage();
  await staticPage.goto(origin + '/tools/');
  assert.equal(await staticPage.locator('[data-tool-catalog]').evaluate(el => getComputedStyle(el).opacity), '1');
  assert.equal(await staticPage.locator('[data-tool-id]').count(), tools.length);
  assert.equal(await staticPage.locator('[data-catalog-pagination]').isVisible(), false);
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
      heading: color('.guide-home-prose h1'),
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
  assert.equal(await staticPage.locator('.explore-dot-field__fallback').isVisible(), true, '无 JS 时抽象点阵仍有静态回退');
  // 无 JS 页面不等待样式 load 回调，直接插入同一条测试环境规则。
  await staticPage.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = '@view-transition { navigation: none; }';
    document.head.append(style);
  });
  await staticMenu.getByRole('link', { name: /^弄懂一个新词/ }).click();
  await staticPage.waitForURL(origin + '/glossary/');
});

test('探索点阵实际绘制并跟随主题，减少动效保持静态，指针和离屏状态正确', async t => {
  const page = await setup(t, { reducedMotion: 'reduce' });
  const host = page.locator('[data-explore-dots][data-dot-ready="true"]');
  await host.waitFor();
  assert.equal(await page.locator('#explore-title').textContent(), '开始探索AI');
  const canvas = host.locator('canvas');
  const pixels = () => canvas.evaluate(el => {
    const data = el.getContext('2d').getImageData(0, 0, el.width, el.height).data;
    let red = 0, green = 0, blue = 0, count = 0, hash = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 12) continue;
      red += data[i]; green += data[i + 1]; blue += data[i + 2]; count++;
      hash = (hash + (data[i] + data[i + 1] * 3 + data[i + 2] * 7) * ((i / 4) % 251 + 1)) % 1000000007;
    }
    return { red, green, blue, count, hash };
  });
  await select(page, 'light');
  const light = await pixels();
  assert.ok(light.count > 500, 'Canvas 必须实际绘制点阵');
  assert.ok(light.blue > light.green, '默认主题的点阵应以品牌蓝为主');
  await select(page, 'dark');
  const dark = await pixels();
  assert.notEqual(dark.hash, light.hash);
  await select(page, 'preset-forest');
  const forest = await pixels();
  assert.ok(forest.green > forest.blue, '相同深色基底下切换主题强调色也必须重绘');

  await page.locator('[data-explore-stage]').scrollIntoViewIfNeeded();
  const box = await host.boundingBox();
  const before = await pixels();
  await page.mouse.move(box.x + box.width * .7, box.y + box.height * .3);
  await page.waitForTimeout(150);
  assert.equal((await pixels()).hash, before.hash, '减少动效下指针不能移动点阵');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  // 等浏览器派发偏好 change 并完成静态重置，再模拟下一次用户移动。
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await page.mouse.move(box.x + box.width * .8, box.y + box.height * .25);
  await page.waitForTimeout(450);
  assert.notEqual((await pixels()).hash, before.hash, '普通模式下指针应改变观察角度');
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForFunction(() => document.querySelector('[data-explore-dots]').dataset.dotState === 'paused');
});
