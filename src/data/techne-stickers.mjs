/**
 * 小计姬正文表情（短码 → 内联小图）。
 *
 * 正文里写 `:微笑:` 或 `:smile:`，构建时由 `src/lib/remark-techne-stickers.mjs`
 * 替换成 `<img class="sticker">`，行为等同 emoji：跟着行高缩放、不打断排版。
 * 所有表情（含标点替换）都只在「小计姬」主题下显示，样式层门控见 sticker.css。
 *
 * 两条约定：
 * 1. **文件必须是 96 px 级别的内联小图**（`public/images/techne/inline/`），
 *    不要直接引 512 px 原图——句尾一个表情只有十几像素，原图是十几倍浪费。
 * 2. **alt 要写清画面**，读屏用户靠它理解这句话的语气，不写「表情包」这种空话。
 * 3. **w / h 填真实像素**，会写进 `<img width height>`，图片解码前按比例占位，正文不抖。
 *
 * 新增表情：放进 `public/images/techne/inline/` → 在这里登记 → 补中文别名（可选）。
 * 写法与使用原则见 docs/CONTENT-GUIDE.md「正文表情」一节。
 */
export const TECHNE_STICKERS = {
  smile: { file: 'smile.webp', alt: '小计姬闭眼微笑', w: 96, h: 96 },
  face: { file: 'face.webp', alt: '小计姬开心地笑，旁边有心形', w: 96, h: 96 },
  bubble: { file: 'bubble.webp', alt: '小计姬顶着空白对话气泡思考', w: 96, h: 96 },
  question: { file: 'question.webp', alt: '小计姬顶着的对话气泡里有一个问号', w: 96, h: 96 },
  badge: { file: 'badge.webp', alt: '小计姬举起小旗', w: 96, h: 96 },
  fixed: { file: 'fixed.webp', alt: '小计姬举牌「别优化我 我想进步」', w: 96, h: 96 },
  peace: { file: 'peace.webp', alt: '小计姬比耶', w: 96, h: 96 },
  cash: { file: 'cash.webp', alt: '小计姬站在钞票图案中间', w: 192, h: 96 },
};

/** 中文短码别名：正文里写全角标点，敲中文比敲英文顺手 */
export const TECHNE_STICKER_ALIASES = {
  微笑: 'smile',
  开心: 'face',
  思考: 'bubble',
  问号: 'question',
  疑问: 'question',
  举手: 'badge',
  别优化我: 'fixed',
  进步: 'fixed',
  比耶: 'peace',
  省钱: 'cash',
};

/** 短码或中文别名 → 规范键名；未登记返回 null */
export function resolveSticker(name) {
  if (Object.hasOwn(TECHNE_STICKERS, name)) return name;
  const alias = TECHNE_STICKER_ALIASES[name];
  return alias && Object.hasOwn(TECHNE_STICKERS, alias) ? alias : null;
}

/** 图片目录前缀，插件与文档共用一份，避免两边写死后对不上 */
export const TECHNE_STICKER_DIR = '/images/techne/inline/';

/**
 * 标点表情映射：`src/scripts/techne-punct.ts` 为全站正文保留内联标点，
 * 小计姬主题通过 CSS 背景图显示对应表情。
 * 想关闭某个标点，把它从下面的对象里删掉即可。
 */
export const TECHNE_PUNCT_STICKERS = {
  '。': 'smile',
  '？': 'question',
};
