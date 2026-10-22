/**
 * 学习指南侧边栏分组的展开 / 收起动效。
 *
 * 参考 CardNav 的思路（缓动曲线 + 子项序列出现），但只取两件事：
 * 1. 高度从 0 平滑展开，缓动用 cubic-bezier(0.22, 1, 0.36, 1)（≈ power3.out）；
 * 2. 列表项逐条轻微上浮淡入（stagger 18ms），幅度比参考实现克制。
 *
 * 不引入 GSAP：只用到 WAAPI 的 animate()，浏览器原生即可。
 * 无障碍与降级：
 * - 尊重 prefers-reduced-motion：直接返回，保留 <details> 原生行为；
 * - 键盘 Enter / Space 触发的是同一个 click 事件，逻辑不变；
 * - 脚本不执行时 <details> 仍然可以正常展开收起。
 */

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const DURATION = 240;

export function initGuideNavMotion(): void {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof Element.prototype.animate !== 'function') return;

  const groups = document.querySelectorAll<HTMLDetailsElement>('details.guide-nav__group');

  groups.forEach((details) => {
    const summary = details.querySelector<HTMLElement>('summary');
    const list = details.querySelector<HTMLUListElement>('ul');
    if (!summary || !list) return;

    let busy = false;

    const expand = () => {
      details.open = true;
      const target = list.scrollHeight;
      list.style.overflow = 'hidden';
      // 子项序列出现改用 CSS 动画（.is-entering + 每项 --i 延迟），
      // 批量交给样式引擎执行，避免逐项 WAAPI 与高度动画抢主线程造成卡顿。
      details.classList.add('is-entering');
      const heightAnim = list.animate(
        [
          { height: '0px', opacity: 0 },
          { height: `${target}px`, opacity: 1 },
        ],
        { duration: DURATION, easing: EASE },
      );
      heightAnim.onfinish = () => {
        list.style.overflow = '';
        list.style.height = '';
        details.classList.remove('is-entering');
        busy = false;
      };
    };

    const collapse = () => {
      const current = list.scrollHeight;
      list.style.overflow = 'hidden';
      const heightAnim = list.animate(
        [
          { height: `${current}px`, opacity: 1 },
          { height: '0px', opacity: 0 },
        ],
        { duration: DURATION - 60, easing: EASE },
      );
      heightAnim.onfinish = () => {
        details.open = false;
        list.style.overflow = '';
        list.style.height = '';
        details.classList.remove('is-entering');
        busy = false;
      };
    };

    summary.addEventListener('click', (event) => {
      // 自己接管展开 / 收起，才能播收起动画；忙碌时忽略连点
      event.preventDefault();
      if (busy) return;
      busy = true;
      if (details.open) collapse();
      else expand();
    });
  });
}
