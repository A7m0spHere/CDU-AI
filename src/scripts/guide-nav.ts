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

/** 展开：power3.out 风格，起步快、收尾柔 */
const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
/** 收起：ease-in，收尾干脆，避免「慢慢拖到 0 再突然消失」的顿感 */
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
const DURATION_OPEN = 240;
const DURATION_CLOSE = 200;

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

    // 列表自带上下内边距（约 10px）与 1px 下边框：只动画 height 的话，
    // 高度到 0 时仍留一条「空隙」，下一帧 open=false 才消失 —— 看起来就是收尾一下顿。
    // 所以把 padding / border 一起动画到 0。
    const metrics = () => {
      const style = getComputedStyle(list);
      return {
        paddingTop: style.paddingTop,
        paddingBottom: style.paddingBottom,
        borderBottom: style.borderBottomWidth,
      };
    };

    const expand = () => {
      details.open = true;
      const target = list.scrollHeight;
      list.style.overflow = 'hidden';
      // 子项序列出现改用 CSS 动画（.is-entering + 每项 --i 延迟），
      // 批量交给样式引擎执行，避免逐项 WAAPI 与高度动画抢主线程造成卡顿。
      details.classList.add('is-entering');
      // 展开只动 height：padding/border 保持原值，少一类属性参与逐帧重算
      const heightAnim = list.animate(
        [
          { height: '0px', opacity: 0 },
          { height: `${target}px`, opacity: 1 },
        ],
        { duration: DURATION_OPEN, easing: EASE_OUT },
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
      const { paddingTop, paddingBottom, borderBottom } = metrics();
      list.style.overflow = 'hidden';
      const heightAnim = list.animate(
        [
          { height: `${current}px`, paddingTop, paddingBottom, borderBottomWidth: borderBottom, opacity: 1 },
          { height: '0px', paddingTop: '0px', paddingBottom: '0px', borderBottomWidth: '0px', opacity: 0 },
        ],
        { duration: DURATION_CLOSE, easing: EASE_IN },
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
