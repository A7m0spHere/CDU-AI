/**
 * 内置主题保留 Shiki 原配色；自定义 / 预设主题通过变量控制代码文字和注释。
 * 用语法 scope 识别注释，避免把某个高亮主题的具体十六进制值当作契约。
 * @type {import('shiki').ShikiTransformer}
 */
export const themeCodeTokens = {
  name: 'cdu-theme-code-tokens',
  preprocess(_code, options) {
    options.includeExplanation = true;
  },
  span(node, _line, _col, _lineNode, token) {
    if (!token.color) return;
    const comment = token.explanation?.some(part => part.scopes.some(scope =>
      /(^|\.)comment(\.|$)/.test(scope.scopeName),
    ));
    const variable = comment ? '--theme-code-token-muted' : '--theme-code-token-fg';
    const style = String(node.properties.style ?? '');
    node.properties.style = style.replace(/(^|;)\s*color:[^;]+/i,
      `$1color:var(${variable}, ${token.color})`);
  },
};
