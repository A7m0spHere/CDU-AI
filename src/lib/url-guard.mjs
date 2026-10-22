/**
 * 外链协议白名单（#22）。
 *
 * 为什么需要：`z.string().url()` 只校验「是不是合法 URL」，
 * `javascript:alert(1)`、`data:text/html,...`、`file:///etc/passwd` 都能通过语法校验；
 * 内容将来允许通过 PR 共建，所以「能写进 href 的东西」必须单独把关。
 *
 * 规则：
 * - 外链只允许 http: / https:（不混用 mailto: 等其它协议，需要时再单独评审）；
 * - 站内链接只允许以 / 、./ 、../ 或 # 开头；
 * - 协议相对地址（//example.com）一律拒绝，作者应写完整 URL；
 * - 大小写、前后空白、制表符换行等混淆交给 URL 解析器归一化后再判断。
 */

export const SAFE_EXTERNAL_PROTOCOLS = ['http:', 'https:'];

/** 是否为可安全跳转的 http(s) 绝对地址。 */
export function isSafeExternalUrl(value) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed === '') return false;
  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return false;
  }
  if (!SAFE_EXTERNAL_PROTOCOLS.includes(url.protocol)) return false;
  return url.hostname !== '';
}

/** 是否为站内相对链接或锚点。 */
export function isInternalLink(value) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.startsWith('#')) return true;
  if (/^\.{1,2}\//.test(trimmed)) return true;
  // 以单个 / 开头才算站内；// 与 /\ 会被浏览器当成协议相对地址（外链），一律拒绝
  if (trimmed.startsWith('/')) return !/^[/\\]{2}/.test(trimmed);
  return false;
}

/** 正文链接 / 图片地址是否安全：站内相对地址或 http(s) 外链。 */
export function isSafeLinkTarget(value) {
  if (typeof value !== 'string') return false;
  if (isInternalLink(value)) return true;
  return isSafeExternalUrl(value);
}

/** 是否为需要新窗口打开的外部 http(s) 链接。 */
export function isExternalHttpUrl(value) {
  return isSafeExternalUrl(value);
}
