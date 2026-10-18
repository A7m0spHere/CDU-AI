/**
 * Notion 风格文档区：让按需展开的菜单支持鼠标、键盘和触屏。
 * 使用原生 <details> 作为无 JS 兜底，JS 只负责关闭与焦点回收。
 */
const menus = Array.from(document.querySelectorAll<HTMLDetailsElement>('[data-docs-menu]'));

function closeMenu(menu: HTMLDetailsElement, restoreFocus = false): void {
  if (!menu.open) return;
  menu.open = false;
  if (restoreFocus) {
    menu.querySelector<HTMLElement>('summary')?.focus();
  }
}

menus.forEach((menu) => {
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.open = false;
    });
  });
});

if (menus.length > 0) {
  document.addEventListener('click', (event) => {
    const target = event.target as Node;
    for (const menu of menus) {
      if (menu.open && !menu.contains(target)) closeMenu(menu);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    for (const menu of menus) {
      if (menu.open) {
        event.preventDefault();
        closeMenu(menu, true);
      }
    }
  });
}
