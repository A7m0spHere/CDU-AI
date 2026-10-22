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
const DURATION = 260;
const ITEM_DURATION = 200;
const ITEM_STAGGER = 18;
const ITEM_MAX_DELAY = 220;

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
      const heightAnim = list.animate(
        [
          { height: '0px', opacity: 0 },
          { height: `${target}px`, opacity: 1 },
        ],
        { duration: DURATION, easing: EASE },
      );

      // 子项序列出现：延迟逐条递增，避免整块同时闪现
      list.querySelectorAll<HTMLElement>('li').forEach((item, index) => {
        item.animate(
          [
            { opacity: 0, transform: 'translateY(-4px)' },
            { opacity: 1, transform: 'none' },
          ],
          {
            duration: ITEM_DURATION,
            delay: Math.min(index * ITEM_STAGGER, ITEM_MAX_DELAY),
            easing: EASE,
            fill: 'backwards',
          },
        );
      });

      heightAnim.onfinish = () => {
        list.style.overflow = '';
        list.style.height = '';
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
