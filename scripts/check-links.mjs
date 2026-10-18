#!/usr/bin/env node
/**
 * 构建产物内部链接检查。
 * 不依赖第三方包：扫描 dist 下所有 HTML 的 href，确认站内目标存在，
 * 并检查同页 #锚点 是否有对应 id。
 */
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

if (!existsSync(dist)) {
  console.error('未找到 dist/，请先运行 npm run build。');
  process.exit(1);
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

function toUrlPath(file) {
  const rel = path.relative(dist, file).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel;
}

function candidatePaths(urlPath) {
  const clean = urlPath.split('?')[0].split('#')[0];
  const decoded = decodeURIComponent(clean);
  if (decoded === '/') return [path.join(dist, 'index.html')];
  if (decoded.endsWith('/')) return [path.join(dist, decoded.slice(1), 'index.html')];
  return [
    path.join(dist, decoded.slice(1)),
    path.join(dist, decoded.slice(1) + '.html'),
    path.join(dist, decoded.slice(1), 'index.html'),
  ];
}

const idsCache = new Map();
async function getIds(file) {
  if (idsCache.has(file)) return idsCache.get(file);
  const html = await readFile(file, 'utf8');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  idsCache.set(file, ids);
  return ids;
}

const htmlFiles = (await walk(dist)).filter((file) => file.endsWith('.html'));
const missing = [];
const checked = new Set();

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const currentUrl = toUrlPath(file);
  const baseDir = path.posix.dirname(currentUrl);
  const hrefs = [...html.matchAll(/\bhref="([^"]+)"/g)].map((match) => match[1]);

  for (const raw of hrefs) {
    if (!raw || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('javascript:')) continue;
    if (raw.startsWith('#')) {
      if (raw.length > 1) {
        const ids = await getIds(file);
        if (!ids.has(decodeURIComponent(raw.slice(1)))) {
          missing.push({ page: currentUrl, href: raw, reason: '同页锚点不存在' });
        }
      }
      continue;
    }
    if (/^https?:\/\//i.test(raw) || raw.startsWith('//')) continue;

    const resolved = raw.startsWith('/')
      ? raw
      : path.posix.normalize(path.posix.join(baseDir, raw));
    const key = currentUrl + ' -> ' + resolved;
    if (checked.has(key)) continue;
    checked.add(key);

    const hash = resolved.includes('#') ? resolved.slice(resolved.indexOf('#')) : '';
    const urlPath = resolved.split('#')[0].split('?')[0];
    const target = candidatePaths(urlPath).find((candidate) => existsSync(candidate));
    if (!target) {
      missing.push({ page: currentUrl, href: raw, reason: '目标文件不存在' });
      continue;
    }
    if (hash && (target.endsWith('.html') || target.endsWith('index.html'))) {
      const ids = await getIds(target);
      if (!ids.has(decodeURIComponent(hash.slice(1)))) {
        missing.push({ page: currentUrl, href: raw, reason: '目标页面锚点不存在' });
      }
    }
  }
}

const unique = [...new Map(missing.map((item) => [item.page + item.href, item])).values()];
if (unique.length > 0) {
  console.error('发现 ' + unique.length + ' 个失效的内部链接：');
  for (const item of unique.slice(0, 50)) {
    console.error('- ' + item.page + '  ' + item.href + '  (' + item.reason + ')');
  }
  process.exit(1);
}

console.log('内部链接检查通过：扫描 ' + htmlFiles.length + ' 个 HTML 页面，未发现失效站内链接。');
