import type { APIRoute } from 'astro';
import { getHeadings as getGuideHomeHeadings } from '../content/guide/_HOME.md';
import guideHomeBody from '../content/guide/_HOME.md?raw';
import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { tools, toolCategories, toolCapabilities } from '../data/tools';
import { getToolSectionLabels } from '../lib/tool-catalog.mjs';
import { glossaryCategoryName } from '../data/glossary';
import { guideHome } from '../data/guide-nav';
import { challengeConfig } from '../data/challenge';

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
      description:
        '不设统一命题、不要求编程基础，新手组 / 进阶组双轨参赛，10 天做出可运行、可演示的数字作品；含腾讯文档报名入口、赛程、作品要求与两套评分标准。',
      href: '/events/',
      keywords:
        '活动 挑战赛 AI创作挑战赛 第八届网络创新大赛 报名 腾讯文档 新手组 进阶组 作品提交 赛程 评分 奖项',
    },
    {
      type: '章节',
      title: '赛事报名入口与报名流程',
      description: '腾讯文档收集表报名（11/21 10:00–11/23 20:00）、报名审核、选手群与开赛会。',
      href: '/events/#register',
      keywords: '报名 腾讯文档 收集表 报名确认 选手群 开赛会',
    },
    {
      type: '章节',
      title: '组别与参赛形式',
      description: '新手组仅限个人、模板改造；进阶组个人或 ≤2 人团队、自由选题；两组分开评奖。',
      href: '/events/#tracks',
      keywords: '新手组 进阶组 组队 团队 模板 自由选题',
    },
    {
      type: '章节',
      title: '10 天赛程与关键节点',
      description: '11/21 报名启动、11/23 20:00 报名截止、11/24 下午开赛、11/28 中期检查、12/4 18:00 提交截止、12/4–12/5 线上材料初评、12/6 现场 Demo/答辩 + 线下颁奖。',
      href: '/events/#schedule',
      keywords: '赛程 时间 开赛会 中期检查 提交截止 线上评审 线下讲解 颁奖',
    },
    {
      type: '章节',
      title: '作品要求与提交材料',
      description: '至少 1 项可运行功能；在线链接 / 代码仓库 / 本地包三选一；2 分钟录屏、1 页说明与团队分工表。',
      href: '/events/#works',
      keywords: '作品要求 提交 材料 在线链接 代码仓库 本地包 录屏 说明文档',
    },
    {
      type: '章节',
      title: '两套 100 分评分标准与奖项设置',
      description: '新手组完成度 40 分、进阶组完成度 30 分；两套评分表分开评奖，含最佳新人奖与最佳创意奖。',
      href: '/events/#scoring',
      keywords: '评分 评分标准 奖项 新手组 进阶组 最佳新人奖 最佳创意奖',
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

