/**
 * 首页滚动反馈（渐进增强）。
 *
 * 规则：
 * - 默认不隐藏任何内容：只有 JS 可用、且未开启「减少动效」时，才会给首屏之外的元素加 pending；
 * - 使用 IntersectionObserver 一次性 reveal，不监听 scroll；
 * - 只改 opacity / transform，不触发布局，避免 CLS。
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('.home-v2 [data-reveal]'));

  // 首屏内可见的元素不做隐藏，避免闪烁或阻塞内容；只给首屏之外的元素加 pending。
  const pending = targets.filter((target) => target.getBoundingClientRect().top > window.innerHeight * 0.92);
  for (const target of pending) target.dataset.reveal = 'pending';

  if (pending.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    for (const target of pending) observer.observe(target);
  }
}

export {};
