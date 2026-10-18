import type { APIRoute } from 'astro';
import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { tools, toolCategories } from '../data/tools';
import { glossaryTerms } from '../data/glossary';

interface SearchItem {
  type: '指南' | '章节' | '工具' | '作品' | '术语' | '页面';
  title: string;
  description: string;
  href: string;
  keywords: string;
}

const normalizeMarkdown = (markdown: string): string =>
  markdown
    .replace(/\`\`\`[^\n]*\n?/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function splitSections(body: string): { title: string; text: string }[] {
  const result: { title: string; text: string }[] = [];
  let currentTitle = '';
  let currentLines: string[] = [];

  const flush = () => {
    if (!currentTitle) return;
    result.push({ title: currentTitle, text: normalizeMarkdown(currentLines.join('\n')) });
  };

  for (const line of body.split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      flush();
      currentTitle = heading[1].trim();
      currentLines = [];
    } else if (currentTitle) {
      currentLines.push(line);
    }
  }
  flush();
  return result;
}

export const GET: APIRoute = async () => {
  const guides = (await getCollection('guide')).sort((a, b) => a.data.order - b.data.order);
  const works = (await getCollection('works')).sort((a, b) => a.data.order - b.data.order);
  const categoryName = (id: string) => toolCategories.find((category) => category.id === id)?.name ?? '';

  const items: SearchItem[] = [
    {
      type: '页面',
      title: '首页 · 成大 AI 共学',
      description: '面向所有专业的 AI 学习与交流社区，由成都大学计算机协会 AI 方向发起。',
      href: '/',
      keywords: '首页 首页 导航 开始 社区 学习',
    },
    {
      type: '页面',
      title: 'AI 学习指南',
      description: '先看清 AI 能做什么，再动手完成一件小事的学习路线。',
      href: '/guide/',
      keywords: '学习 指南 教程 入门 路线 AI',
    },
    {
      type: '页面',
      title: 'AI 工具资源',
      description: '按场景分类的 AI 工具索引。',
      href: '/tools/',
      keywords: '工具 资源 目录 AI 软件 选型',
    },
    {
      type: '页面',
      title: 'AI 术语表',
      description: '常见 AI 术语与校园场景示例。',
      href: '/glossary/',
      keywords: '术语 词表 名词 概念 速查',
    },
    {
      type: '页面',
      title: '作品广场',
      description: '策划示例，不是真实学生投稿。',
      href: '/works/',
      keywords: '作品 作品广场 示例 灵感 提示词',
    },
    {
      type: '页面',
      title: '社区',
      description: '版块、讨论起点与公约；交流区暂未开放。',
      href: '/community/',
      keywords: '社区 论坛 讨论 提问 公约',
    },
    {
      type: '页面',
      title: '活动',
      description: '活动形式与流程设计；暂无排期。',
      href: '/events/',
      keywords: '活动 工作坊 共创 开放麦 组队',
    },
    {
      type: '页面',
      title: '关于与共建',
      description: '项目定位、内容标准、共建方式与透明说明。',
      href: '/about/',
      keywords: '关于 共建 参与 项目 规范 透明 路线图',
    },
    ...guides.map((guide) => ({
      type: '指南' as const,
      title: guide.data.title,
      description: guide.data.summary,
      href: `/guide/${guide.id.replace(/\.md$/, '')}/`,
      keywords: [guide.data.stage, guide.data.level, ...guide.data.tags, ...guide.data.tools].join(' '),
    })),
    ...works.map((work) => ({
      type: '作品' as const,
      title: work.data.title,
      description: work.data.summary,
      href: `/works/${work.id.replace(/\.md$/, '')}/`,
      keywords: [work.data.category, work.data.format, ...work.data.tags, ...work.data.tools].join(' '),
    })),
    ...tools.map((tool) => ({
      type: '工具' as const,
      title: tool.name,
      description: `${tool.summary} ${tool.bestFor}`,
      href: `/tools/?q=${encodeURIComponent(tool.name)}`,
      keywords: [categoryName(tool.category), ...tool.tags, tool.difficulty, tool.pricing].join(' '),
    })),
    ...glossaryTerms.map((term) => ({
      type: '术语' as const,
      title: term.term,
      description: `${term.definition} ${term.example}`,
      href: `/glossary/#${term.id}`,
      keywords: [term.en, ...term.aliases, categoryNameForGlossary(term.category)].join(' '),
    })),
  ];

  // 章节级记录：指南和作品的长文按二级标题切分，结果直接跳到锚点。
  async function appendSections<C extends 'guide' | 'works'>(entries: CollectionEntry<C>[], basePath: string) {
    for (const entry of entries) {
      const { headings } = await render(entry);
      const h2 = headings.filter((heading) => heading.depth === 2);
      const sections = splitSections(entry.body ?? '');
      for (const [index, section] of sections.entries()) {
        const anchor = h2[index]?.slug;
        if (!anchor || section.text.length < 20) continue;
        items.push({
          type: '章节',
          title: section.title,
          description: `${entry.data.title}：${section.text.slice(0, 180)}`,
          href: `${basePath}/${entry.id.replace(/\.md$/, '')}/#${anchor}`,
          keywords: [entry.data.title, section.title, section.text].join(' '),
        });
      }
    }
  }

  await appendSections(guides, '/guide');
  await appendSections(works, '/works');

  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

function categoryNameForGlossary(id: string): string {
  const labels: Record<string, string> = {
    basics: 'AI 基础',
    context: '提示词与上下文',
    agents: 'Agent 与工具',
    safety: '成本与安全',
  };
  return labels[id] ?? '';
}