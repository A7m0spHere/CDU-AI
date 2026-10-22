import { isSafeLinkTarget, isExternalHttpUrl } from './url-guard.mjs';

/**
 * 渲染 Markdown 正文时的外链兜底（#22）。
 *
 * 内容检查器只覆盖 frontmatter 里的 sources；正文里的 `[文字](javascript:...)`
 * 不经过 schema，所以在渲染阶段再过一遍：
 * - 危险协议（javascript: / data: / file: / vbscript: …）直接去掉 href / src，链接退化为纯文本；
 * - 外部 http(s) 链接统一加 target="_blank" 与 rel="noopener noreferrer"。
 *
 * 不引入 unist-util-visit：这里只需要一次深度遍历，自己写更省依赖。
 */
export default function rehypeSafeLinks() {
  return (tree) => {
    visit(tree, (node) => {
      if (!node || node.type !== 'element') return;
      const props = node.properties ?? (node.properties = {});

      if (node.tagName === 'a') {
        const href = props.href;
        if (typeof href !== 'string' || href === '') return;
        if (!isSafeLinkTarget(href)) {
          delete props.href;
          props['data-link-blocked'] = 'true';
          return;
        }
        if (isExternalHttpUrl(href)) {
          props.target = '_blank';
          props.rel = 'noopener noreferrer';
        }
      }

      if (node.tagName === 'img') {
        const src = props.src;
        if (typeof src !== 'string' || src === '') return;
        if (!isSafeLinkTarget(src)) {
          delete props.src;
          props['data-image-blocked'] = 'true';
        }
      }
    });
  };
}

function visit(node, callback) {
  callback(node);
  const children = node && node.children;
  if (!Array.isArray(children)) return;
  for (const child of children) visit(child, callback);
}
