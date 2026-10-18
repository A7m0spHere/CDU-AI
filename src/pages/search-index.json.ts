import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { tools, toolCategories } from '../data/tools';

interface SearchItem {
  type: '指南' | '工具' | '作品' | '页面';
  title: string;
  description: string;
  href: string;
  keywords: string;
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
      title: '零基础学习指南',
      description: '3 个阶段、8 个模块的零基础 AI 学习路线。',
      href: '/guide/',
      keywords: '学习 指南 教程 入门 零基础 路线',
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
  ];

  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};