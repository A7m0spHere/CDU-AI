/**
 * 全站标点 → 小计姬表情（**仅「小计姬」主题可见**）。
 *
 * 为什么放在运行时，而不是 Markdown 插件里：
 * 1. 要覆盖整站——手写 Astro 页面、首页模块、卡片摘要都算，插件只能管 Markdown；
 * 2. 要跟着主题开关——构建期换掉的标点，用户切到别的主题也收不回来。
 *
 * 做法：把每个 `。` `？` 包成双节点
 *   <span class="punct" data-punct="。">
 *     <span class="punct__char">。</span>
 *     <img class="punct__sticker" …>
 *   </span>
 * 默认显示文字标点；`html[data-bg-scene='techne']` 时文字让位、表情登场。
 * 于是切主题只是一次 CSS 生效，既不用重扫 DOM，也不会闪一下再变。
 *
 * 边界：代码块、行内代码、表单控件、主题菜单与搜索弹层、装饰层都跳过——
 * 那里出现头像会干扰阅读或操作。新增内容（搜索结果是运行时渲染的）由
 * MutationObserver 补扫，跳过自己插入的 `.punct`，不会递归。
 */
import {
  TECHNE_PUNCT_STICKERS,
  TECHNE_STICKERS,
  TECHNE_STICKER_DIR,
} from '../data/techne-stickers.mjs';

const PUNCT_CHARS = new Set<string>(Object.keys(TECHNE_PUNCT_STICKERS));

/* 这些标签内部是代码、表单值或非 HTML 文本，一律不碰。
   必须按「祖先」判断而不是直接父元素：代码块经语法高亮后，
   文本节点往往落在 <pre><code><span>…</span> 的深层 span 里。 */
const SKIP_TAGS = [
  'pre',
  'code',
  'kbd',
  'samp',
  'script',
  'style',
  'noscript',
  'template',
  'textarea',
  'select',
  'option',
  'svg',
  'math',
].join(',');

/* 交互浮层与装饰层：菜单、搜索、底栏、胶片带、彩蛋遮罩里塞头像会干扰操作。
   `.punct` 也在其中——用来跳过自己插入的节点，避免 MutationObserver 自激。 */
const SKIP_SELECTOR = [
  SKIP_TAGS,
  '.punct',
  '.sticker',
  '[data-no-punct]',
  '[data-theme-picker]',
  '[data-search-dialog]',
  '[data-mobile-menu]',
  '[data-mobile-dock]',
  '.skip-link',
  '.techne-marquee',
  '[aria-hidden="true"]',
].join(',');

type PunctChar = keyof typeof TECHNE_PUNCT_STICKERS;

function makePunct(char: string): HTMLElement | null {
  const key = TECHNE_PUNCT_STICKERS[char as PunctChar];
  const sticker = TECHNE_STICKERS[key as keyof typeof TECHNE_STICKERS];
  if (!sticker) return null;

  const wrap = document.createElement('span');
  wrap.className = 'punct';
  wrap.dataset.punct = char;

  const text = document.createElement('span');
  text.className = 'punct__char';
  text.textContent = char;

  const img = document.createElement('img');
  img.className = 'punct__sticker';
  img.src = `${TECHNE_STICKER_DIR}${sticker.file}`;
  // alt = 原标点：小计姬主题下读屏念「句号」「问号」，断句信息不丢
  img.alt = char;
  img.width = sticker.w;
  img.height = sticker.h;
  img.decoding = 'async';
  img.dataset.sticker = key;
  // 灯箱会收集 .notion-prose img，表情不能被包成「点击放大」按钮
  img.dataset.noZoom = '';

  wrap.append(text, img);
  return wrap;
}

/** 把一个文本节点里的标点拆出来；没有可替换内容返回 false */
function wrapPunct(node: Text): boolean {
  const value = node.nodeValue ?? '';
  if (!value) return false;

  const fragment = document.createDocumentFragment();
  let last = 0;
  let changed = false;

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];
    if (!PUNCT_CHARS.has(char)) continue;
    const wrap = makePunct(char);
    if (!wrap) continue;
    if (i > last) fragment.append(value.slice(last, i));
    fragment.append(wrap);
    last = i + 1;
    changed = true;
  }

  if (!changed) return false;
  if (last < value.length) fragment.append(value.slice(last));
  node.replaceWith(fragment);
  return true;
}

function scan(root: Element | DocumentFragment): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const value = (node as Text).nodeValue;
      if (!value) return NodeFilter.FILTER_REJECT;

      const parent = (node as Text).parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      // SKIP_SELECTOR 同时包含标签名与浮层选择器，一次祖先查找即可覆盖
      if (parent.closest(SKIP_SELECTOR)) return NodeFilter.FILTER_REJECT;

      for (let i = 0; i < value.length; i += 1) {
        if (PUNCT_CHARS.has(value[i])) return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_REJECT;
    },
  });

  /* 先收集再改：边遍历边替换会让 TreeWalker 错过后续兄弟节点 */
  const targets: Text[] = [];
  while (walker.nextNode()) targets.push(walker.currentNode as Text);
  for (const node of targets) wrapPunct(node);
}

function start(): void {
  scan(document.body);

  const observer = new MutationObserver((records) => {
    const roots = new Set<Element>();
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        const element = node as Element;
        // 自己插入的标点容器会触发回调，closest('.punct') 命中后直接跳过
        if (element.closest(SKIP_SELECTOR)) continue;
        roots.add(element);
      }
    }
    for (const element of roots) scan(element);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.body) {
  start();
} else {
  document.addEventListener('DOMContentLoaded', start, { once: true });
}
