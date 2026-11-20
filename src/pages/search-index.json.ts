import type { APIRoute } from 'astro';
import { getHeadings as getGuideHomeHeadings } from '../content/guide/_HOME.md';
import guideHomeBody from '../content/guide/_HOME.md?raw';
import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { tools, toolCategories, toolCapabilities } from '../data/tools';
import { getToolSectionLabels } from '../lib/tool-catalog.mjs';
import { glossaryCategoryName } from '../data/glossary';
import { guideHome } from '../data/guide-nav';
import { challengeConfig, ruleSections } from '../data/challenge';

interface SearchItem {
  type: '指南' | '章节' | '工具' | '作品' | '术语' | '页面';
  title: string;
  description: string;
  href: string;
  keywords: string;
}

const normalizeMarkdown = (markdown: string): string =>
  markdown
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\`\`\`[^\n]*\n?/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/<[^>]+>/g, ' ')
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
  const glossary = await getCollection('glossary');
  const categoryName = (id: string) => toolCategories.find((category) => category.id === id)?.name ?? '';

  const items: SearchItem[] = [
    {
      type: '页面',
      title: '首页 · CDU AI',
      description: '面向所有专业的 AI 学习与交流社区，由成都大学计算机协会 AI 方向发起。',
      href: '/',
      keywords: '首页 导航 开始 社区 学习',
    },
    {
      type: '页面',
      ...guideHome,
      keywords: '欢迎 站点介绍 学习指南 入门 AI',
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
      description: '社区功能暂不开放。',
      href: '/community/',
      keywords: '社区 论坛 讨论 暂不开放',
    },
    {
      type: '页面',
      title: `活动 · ${challengeConfig.title}`,
      description: '新手组与进阶组分别评奖。查看腾讯文档报名入口、赛程、作品要求与奖项设置。',
      href: '/events/',
      keywords: '活动 第八届网络创新大赛 AI创作挑战赛 计协 新手组 进阶组 反抄袭 线上评审 Demo Day 新人奖 创意奖 报名 腾讯文档',
    },
    {
      type: '页面',
      title: `完整赛事细则 · ${challengeConfig.shortTitle}`,
      description: '组队规则、提交材料、反抄袭、两组评分表与奖项设置。',
      href: '/events/rules/',
      keywords: '赛事细则 规则 新手组 进阶组 反作弊 反抄袭 评分表 线上评审 Demo Day 新人奖 创意奖 综测',
    },
    {
      type: '章节',
      title: '比赛作品要求与反作弊审核',
      description: '作品须有可验证的核心功能，并说明项目起点与赛期增量。禁止搬运他人作品。',
      href: '/events/rules/#audit-and-anticheat',
      keywords: '作品要求 头图 合规 合法性 创意亮点 反作弊 反抄袭 模板 源码 旧项目 提交记录',
    },
    {
      type: '章节',
      title: '腾讯文档报名入口',
      description: '线上报名时间、腾讯文档报名表、报名二维码和选手群通知方式。',
      href: '/events/#register',
      keywords: '报名 腾讯文档 选手群 二维码',
    },
    {
      type: '章节',
      title: '作品提交',
      description: '作品提交时间与材料清单，提交入口以选手群通知为准。',
      href: '/events/#submit',
      keywords: '作品提交 投稿',
    },
    {
      type: '章节',
      title: '赛程时间线与 Demo Day',
      description: '11 月 24 日开赛，12 月 4 日 18:00 作品提交截止，12 月 5 日线上评审，12 月 6 日线下展示与颁奖。',
      href: '/events/#schedule',
      keywords: '赛程 11月24日 12月4日 12月5日 12月6日 开赛会 线上评审 Demo Day 答辩 颁奖',
    },
    ...ruleSections.map((section) => ({
      type: '章节' as const,
      title: section.title,
      description: `完整赛事细则：${section.lead ?? section.bullets[0] ?? ''}`.slice(0, 180),
      href: `/events/rules/#${section.id}`,
      keywords: [challengeConfig.title, section.title, section.lead ?? '', ...section.bullets].join(' '),
    })),
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
      // 别名、技术类型与能力标签都进关键词：搜「扩散模型」「开源」「千问」都能命中。
      keywords: [
        ...(tool.aliases ?? []),
        categoryName(tool.category),
        ...(tool.alsoIn ?? []).map(categoryName),
        ...getToolSectionLabels(tool),
        tool.tech,
        tool.kind,
        ...toolCapabilities.filter((cap) => tool.capabilities.includes(cap.id)).map((cap) => cap.label),
        ...tool.tags,
        ...(tool.difficulty ? [tool.difficulty] : []),
        ...(tool.pricing ? [tool.pricing] : []),
      ].join(' '),
    })),
    ...glossary.map((term) => ({
      type: '术语' as const,
      title: term.data.term,
      description: `${term.data.definition} ${term.data.example}`,
      href: `/glossary/${term.id}/`,
      keywords: [term.data.en, ...term.data.aliases, glossaryCategoryName(term.data.category)].join(' '),
    })),
  ];

  // 首页与集合文章使用同一份章节规则；锚点来自 Astro 实际渲染结果。
  function appendBodySections(body: string, title: string, href: string, headings: { depth: number; slug: string }[]) {
    const h2 = headings.filter((heading) => heading.depth === 2);
    for (const [index, section] of splitSections(body).entries()) {
      const anchor = h2[index]?.slug;
      if (!anchor || section.text.length < 20) continue;
      items.push({
        type: '章节',
        title: section.title,
        description: title + '：' + section.text.slice(0, 180),
        href: href + '#' + anchor,
        keywords: [title, section.title, section.text].join(' '),
      });
    }
  }

  async function appendSections<C extends 'guide' | 'works'>(entries: CollectionEntry<C>[], basePath: string) {
    for (const entry of entries) {
      const { headings } = await render(entry);
      appendBodySections(entry.body ?? '', entry.data.title, basePath + '/' + entry.id.replace(/\.md$/, '') + '/', headings);
    }
  }

  appendBodySections(guideHomeBody, guideHome.title, guideHome.href, getGuideHomeHeadings());
  await appendSections(guides, '/guide');
  await appendSections(works, '/works');

  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

