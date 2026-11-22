#!/usr/bin/env node
/** 仓库文档检查：本地链接、图片、标题锚点、YAML 语法与审校字段示例。 */
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import GithubSlugger from 'github-slugger';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import yaml from 'js-yaml';
import { checkReviewFields } from './check-content.mjs';

const processor = unified().use(remarkParse);

function visit(node, callback) {
  callback(node);
  for (const child of node.children ?? []) visit(child, callback);
}

function headingText(node) {
  if (node.type === 'text' || node.type === 'inlineCode') return node.value;
  if (node.type === 'image') return node.alt ?? '';
  if (node.type === 'html') return node.value.replace(/<[^>]*>/g, '');
  return (node.children ?? []).map(headingText).join('');
}

async function markdownFiles(dir, recursive = true) {
  if (!existsSync(dir)) return [];
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory() && recursive) files.push(...await markdownFiles(file));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(file);
  }
  return files.sort();
}

export async function checkDocumentation(root) {
  root = path.resolve(root);
  const guideHome = path.join(root, 'src/content/guide/_HOME.md');
  const publicDir = path.join(root, 'public');
  const files = [
    ...await markdownFiles(root, false),
    ...await markdownFiles(path.join(root, 'docs')),
    ...await markdownFiles(path.join(root, '.github')),
    ...(await markdownFiles(path.join(root, 'src/content')))
      .filter(file => path.basename(file).startsWith('_')),
  ];
  const documents = new Map();
  const errors = [];
  let localLinks = 0;
  const label = file => path.relative(root, file).split(path.sep).join('/');

  async function document(file) {
    if (documents.has(file)) return documents.get(file);
    const source = await readFile(file, 'utf8');
    // 模板 frontmatter 不是 Markdown 标题；保留行数以便错误定位。
    const markdown = source.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/,
      match => '\n'.repeat((match.match(/\n/g) ?? []).length));
    const tree = processor.parse(markdown);
    const slugger = new GithubSlugger();
    const anchors = new Set();
    visit(tree, node => {
      if (node.type === 'heading') anchors.add(slugger.slug(headingText(node)));
      if (node.type === 'html') {
        for (const match of node.value.matchAll(/\b(?:id|name)=["']([^"']+)["']/g)) anchors.add(match[1]);
      }
    });
    const result = { tree, anchors };
    documents.set(file, result);
    return result;
  }

  for (const file of files) {
    const { tree } = await document(file);
    const links = [];
    const linkReferences = new Set();
    const imageReferences = new Set();
    const report = (node, message) => errors.push({ file: label(file), line: node.position?.start.line ?? 1, message });
    visit(tree, node => {
      if (node.type === 'linkReference') linkReferences.add(node.identifier);
      if (node.type === 'imageReference') imageReferences.add(node.identifier);
      if (['link', 'image', 'definition'].includes(node.type)) {
        links.push({ node, url: node.url, isHref: node.type === 'link' });
      }
      if (node.type === 'html') {
        for (const [, attribute, , url] of node.value.matchAll(/\b(href|src)\s*=\s*(["'])([^"']+)\2/g)) {
          links.push({ node, url, isHref: attribute === 'href' });
        }
      }
      if (node.type !== 'code' || !['yaml', 'yml'].includes(node.lang)) return;
      try {
        const snippet = node.value.replace(/^---\r?\n/, '').replace(/\r?\n---\s*$/, '');
        const data = yaml.load(snippet, { schema: yaml.JSON_SCHEMA });
        if ((node.meta ?? '').split(/\s+/).includes('review-fields')) {
          if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('审校字段示例必须是 YAML 对象');
          const fieldErrors = [];
          checkReviewFields(data, label(file), fieldErrors);
          for (const error of fieldErrors) report(node, error.message);
        }
      } catch (error) {
        report(node, 'YAML 示例无效：' + error.message);
      }
    });

    for (const { node, url, isHref } of links) {
      // 外部地址不发网络请求。
      if (!url || /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url) || url.startsWith('//')) continue;
      const isGuideHomeSitePath = file === guideHome && url.startsWith('/');
      // 构建链接检查只覆盖 href，欢迎页的根路径图片等资源仍须检查 public 中的文件。
      if (isGuideHomeSitePath) {
        const isLinkDefinition = node.type === 'definition'
          && linkReferences.has(node.identifier) && !imageReferences.has(node.identifier);
        if (isHref || isLinkDefinition) continue;
      }
      localLinks++;
      try {
        const hashAt = url.indexOf('#');
        const pathname = (hashAt < 0 ? url : url.slice(0, hashAt)).split('?')[0];
        const hash = hashAt < 0 ? '' : decodeURIComponent(url.slice(hashAt + 1));
        const decoded = decodeURIComponent(pathname);
        const target = !decoded ? file : decoded.startsWith('/')
          ? path.resolve(isGuideHomeSitePath ? publicDir : root, '.' + decoded)
          : path.resolve(path.dirname(file), decoded);
        if (!existsSync(target)) report(node, '本地目标不存在：' + url);
        else if (hash && target.endsWith('.md') && !(await document(target)).anchors.has(hash)) {
          report(node, 'Markdown 标题或锚点不存在：' + url);
        }
      } catch (error) {
        report(node, '无法检查链接 ' + url + '：' + error.message);
      }
    }
  }
  return { errors, files: files.length, localLinks };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const result = await checkDocumentation(root);
  if (result.errors.length) {
    for (const error of result.errors) console.error(`${error.file}:${error.line}  ${error.message}`);
    process.exitCode = 1;
  } else {
    console.log(`文档检查通过：${result.files} 份文档，${result.localLinks} 处本地引用；YAML 与审校示例有效。`);
  }
}
