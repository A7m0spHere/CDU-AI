/**
 * 页头控件（搜索框、主题键、GitHub 键）与主按钮的「光效汇聚」。
 *
 * 与首页引导图节点共用同一套配方（styles/hover-glow.css 的 .hover-glow--inset）：
 * 指针或键盘焦点落到哪个带 [data-glow-host] 的控件上，就点亮它内部那层光，
 * 亮心跟着指针在控件里左右移动（--glow-cx）；亮起期间给 <html> 打 data-ui-light，
 * 让全站跟随指针的光晕让位（见 styles/cursor-glow.css），避免同一处两层亮斑。
 *
 * 这里挂在 document 上做事件委托：页头在每一页都有，控件数量少，
 * 不需要为每一枚单独注册监听，也不会随主题面板重建而丢绑定。
 */

import { initInsetGlow } from './hover-glow';

const HOST = '[data-glow-host]';

export function initUiGlow(): void {
  const hosts = Array.from(document.querySelectorAll<HTMLElement>(HOST));
  if (hosts.length === 0) return;

  const root = document.documentElement;
  const show = initInsetGlow({
    items: hosts,
    onActive: (active) => {
      root.dataset.uiLight = active ? 'true' : 'false';
    },
  });

  const hostFrom = (target: EventTarget | null): HTMLElement | null => {
    if (!(target instanceof Element)) return null;
    const host = target.closest<HTMLElement>(HOST);
    return host && hosts.includes(host) ? host : null;
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = window.matchMedia('(hover: none), (pointer: coarse)');
  // CSS 在这种环境下本来就把 .hover-glow 藏了，这里同步跳过，省掉无意义的逐帧写入
  const enabled = () => !reduced.matches && !coarse.matches;

  let frame = 0;
  let pending: { host: HTMLElement | null; x: number } | null = null;

  const flush = () => {
    frame = 0;
    if (pending === null) return;
    const { host, x } = pending;
    pending = null;
    if (host === null || !enabled()) {
      show(null);
      return;
    }
    show(host, x);
  };

  const schedule = (host: HTMLElement | null, x: number) => {
    pending = { host, x };
    if (frame === 0) frame = window.requestAnimationFrame(flush);
  };

  document.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse') return;
      schedule(hostFrom(event.target), event.clientX);
    },
    { passive: true },
  );

  // 指针直接离开窗口时不会再有 pointermove，单独收一次尾
  document.addEventListener('pointerleave', () => schedule(null, 0));

  // 键盘 Tab 到控件上也要亮：没有指针位置，就让亮心落在控件中央
  document.addEventListener('focusin', (event) => {
    const host = hostFrom(event.target);
    if (host === null) return;
    const rect = host.getBoundingClientRect();
    schedule(host, rect.left + rect.width / 2);
  });

  document.addEventListener('focusout', (event) => {
    const host = hostFrom(event.target);
    if (host === null) return;
    const next = event.relatedTarget as Node | null;
    if (next === null || !host.contains(next)) schedule(null, 0);
  });
}

initUiGlow();
