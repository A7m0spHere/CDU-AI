/** 原生剪贴板不可用时保留旧浏览器回退，并明确报告复制失败。 */
export async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const focused = document.activeElement;
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    try {
      area.select();
      if (!document.execCommand('copy')) throw new Error('Clipboard copy failed');
    } finally {
      area.remove();
      if (focused instanceof HTMLElement) focused.focus({ preventScroll: true });
    }
  }
}
