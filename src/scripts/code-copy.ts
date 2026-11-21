import { copyText } from '../lib/clipboard';

/**
 * 为正文里的静态代码块（`.prose pre`）补上右上角一键复制按钮。
 *
 * 将 `<pre>` 包进 `.code-block` 并把按钮放在 `<pre>` 外部同级，
 * 避免按钮文字混入 `pre.textContent`，也不影响代码配色令牌与高亮结构。
 */
export function initCodeCopy(): void {
  const blocks = Array.from(document.querySelectorAll<HTMLPreElement>('.prose pre')).filter(
    (pre) => !pre.closest('[data-code-block], [data-copy-card]'),
  );
  if (blocks.length === 0) return;

  blocks.forEach((pre) => {
    const codeText = (pre.querySelector('code')?.textContent ?? pre.textContent ?? '').trimEnd();
    if (!codeText) return;

    const parent = pre.parentElement;
    if (!parent) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    wrapper.dataset.codeBlock = 'true';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy-btn';
    button.textContent = '复制';
    button.setAttribute('aria-label', '复制代码块内容');

    parent.insertBefore(wrapper, pre);
    wrapper.append(pre, button);

    let timer = 0;
    button.addEventListener('click', async () => {
      if (button.dataset.copying === 'true') return;
      window.clearTimeout(timer);
      button.dataset.copying = 'true';
      try {
        await copyText(codeText);
        button.dataset.copied = 'true';
        button.textContent = '已复制';
      } catch {
        button.dataset.copied = 'error';
        button.textContent = '复制失败';
      } finally {
        delete button.dataset.copying;
        timer = window.setTimeout(() => {
          delete button.dataset.copied;
          button.textContent = '复制';
        }, 1800);
      }
    });
  });
}
