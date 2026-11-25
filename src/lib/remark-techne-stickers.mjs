/**
 * 正文短码 → 内联表情图。
 *
 * 只处理显式短码：`:微笑:` / `:smile:`，由 `src/data/techne-stickers.mjs` 登记；
 * 未登记的短码原样保留为文字，不报错（避免写着 `:hover:` 之类的内容被误伤）。
 *
 * 标点（`。` `？`）不在这里处理：标点要覆盖整站（含手写 Astro 页面），
 * 且只在小计姬主题下出现，因此由运行时脚本 `src/scripts/techne-punct.ts`
 * 统一包成「文字 + 表情」双节点，再由 sticker.css 按主题切换。
 *
 * 只处理 mdast 的 `text` 节点，因此代码块、行内代码里的冒号绝对安全。
 */
import {
  TECHNE_STICKERS,
  TECHNE_STICKER_DIR,
  resolveSticker,
} from '../data/techne-stickers.mjs';

/* 英文短码或中文别名（中文最多 6 字，够表达「别优化我」这类梗） */
const PATTERN = /:([a-z][a-z0-9-]{0,23}|[\u4e00-\u9fa5]{1,6}):/g;

export default function remarkTechneStickers() {
  return (tree) => {
    replace(tree);
  };
}

function replace(node) {
  if (!node || !Array.isArray(node.children)) return;
  const next = [];
  for (const child of node.children) {
    if (child.type === 'text' && child.value.includes(':')) {
      next.push(...splitText(child.value));
      continue;
    }
    replace(child);
    next.push(child);
  }
  node.children = next;
}

function splitText(value) {
  const out = [];
  let last = 0;
  PATTERN.lastIndex = 0;

  let match = PATTERN.exec(value);
  while (match) {
    const key = resolveSticker(match[1]);
    if (key) {
      if (match.index > last) out.push({ type: 'text', value: value.slice(last, match.index) });
      out.push(stickerNode(key));
      last = match.index + match[0].length;
    }
    match = PATTERN.exec(value);
  }

  if (out.length === 0) return [{ type: 'text', value }];
  if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
  return out;
}

/**
 * 生成图片节点。表情默认由 CSS 隐藏，只有「小计姬」主题显示；
 * alt 写清画面，读屏用户靠它理解这句话的语气。
 */
function stickerNode(key) {
  const sticker = TECHNE_STICKERS[key];
  return {
    type: 'image',
    url: `${TECHNE_STICKER_DIR}${sticker.file}`,
    alt: sticker.alt,
    title: null,
    data: {
      hProperties: {
        className: ['sticker'],
        'data-sticker': key,
        // 灯箱会收集 .notion-prose img，表情不能被包成「点击放大」按钮
        'data-no-zoom': '',
        // 带上真实像素宽高：未解码前也能按比例占位，避免正文抖动
        width: sticker.w,
        height: sticker.h,
        decoding: 'async',
      },
    },
  };
}
