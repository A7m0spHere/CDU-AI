import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { transpileModule, ModuleKind } from 'typescript';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import config from '../astro.config.mjs';

// 沿用项目 Node >=22.0，不依赖较新版本的原生 TypeScript stripping。
const source = await readFile(new URL('../src/lib/theme-core.ts', import.meta.url), 'utf8');
const compiled = transpileModule(source, { compilerOptions: { module: ModuleKind.ES2022 } });
const { autoInk, autoMuted, autoCode, contrastRatio, normalizeFont, normalizeParams, resolveThemeVars } =
  await import(`data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`);

test('自动文字和代码配色在中等亮度背景上仍有足够对比', () => {
  const colors = ['#aabbcc', '#34d399', '#a78bfa', '#ffdd88'];
  for (let v = 0; v <= 255; v += 5) colors.push('#' + v.toString(16).padStart(2, '0').repeat(3));
  for (const bg of colors) {
    const code = autoCode(bg);
    for (const ink of [autoInk(bg), autoMuted(bg), code.fg, code.muted]) {
      assert.ok(contrastRatio(bg, ink) >= 4.5, `${bg} / ${ink} 对比不足`);
    }
  }
});

test('主按钮默认及 hover 配色保持同一文字颜色且可读', () => {
  for (const accent of ['#34d399', '#a78bfa', '#0369a1', '#c2410c', '#db2777', '#2563eb', '#777777']) {
    const vars = resolveThemeVars(normalizeParams({ accent }));
    for (const background of [vars['--brand'], vars['--brand-strong']]) {
      assert.ok(contrastRatio(background, vars['--on-brand']) >= 4.5, `${background} 按钮文字对比不足`);
    }
  }
});

test('导入字段类型错误时安全回退，不调用对象的字符串或数值转换', () => {
  const malformed = JSON.parse('{"bg":{"toString":null},"accent":[],"radius":{"valueOf":null,"toString":null},"bgImage":{"url":{"toString":null},"overlay":{}},"code":{"fg":{}},"pageGradient":{"angle":{},"stops":[{},null,"#123456"]}}');
  const params = normalizeParams(malformed);
  assert.equal(params.bg, '#f5f6fa');
  assert.equal(params.radius, 5);
  assert.equal(params.bgImage.url, '');
  assert.equal(params.bgImage.overlay, 46);
  assert.equal(params.pageGradient.angle, 160);
  assert.match(params.code.fg, /^#[0-9a-f]{6}$/);
  assert.deepEqual(normalizeParams([]), normalizeParams(null));
});

test('真实 Markdown 高亮产物连接代码文字与注释变量，并保留内置配色回退', async () => {
  const markdown = await createMarkdownProcessor(config.markdown);
  const { code } = await markdown.render('```js\nconst value = 1; // note\n```');
  assert.match(code, /color:var\(--theme-code-token-fg, #[0-9a-fA-F]+\)/);
  assert.match(code, /color:var\(--theme-code-token-muted, #[0-9a-fA-F]+\)/);
});

test('字体字段拒绝对象转换，畸形 JSON 不影响其余主题参数', () => {
  for (const font of [null, [], 'pixel', { name: { toString: null } }, { preset: 'custom', name: [], src: { toString: null } }]) {
    const params = normalizeParams({ bg: '#123456', font });
    assert.equal(params.bg, '#123456');
    assert.equal(params.font.name, '');
    assert.equal(params.font.src, '');
  }
  assert.deepEqual(normalizeFont({ preset: 'custom', name: 'My Font', src: 'javascript:alert(1)' }), {
    preset: 'custom', name: 'My Font', src: '',
  });
});
