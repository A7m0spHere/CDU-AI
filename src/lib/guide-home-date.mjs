import { execFileSync } from 'node:child_process';

/** @returns {string} */
export function getGuideHomeUpdated() {
  // 缺少完整历史时使用最后一次已核对的 `_HOME.md` 提交日期。
  const fallback = '2026-10-26';
  const options = { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] };
  try {
    if (execFileSync('git', ['rev-parse', '--is-shallow-repository'], options).trim() !== 'false') return fallback;
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', 'src/content/guide/_HOME.md'], options).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : fallback;
  } catch {
    return fallback;
  }
}
