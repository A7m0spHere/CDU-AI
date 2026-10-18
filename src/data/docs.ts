import { repository } from './site';

export interface DocsPage {
  id: string;
  href: string;
  title: string;
  emoji: string;
  group: string;
  description: string;
  updated: string;
  /** 页面模板文件，用于“在 GitHub 编辑本页”。 */
  sourcePath: string;
}

export interface DocsGroup {
  title: string;
  pages: DocsPage[];
}

export const docsPages: DocsPage[] = [
  {
    id: 'overview',
    href: '/docs/',
    title: '文档概览',
    emoji: '📘',
    group: '工作台',
    description: '团队的计划、任务、技术资料和内容规范都从这里开始。',
    updated: '2026-10-18',
    sourcePath: 'src/pages/docs/index.astro',
  },
  {
    id: 'reading',
    href: '/docs/reading/',
    title: '新成员阅读计划',
    emoji: '🗺️',
    group: '计划与任务',
    description: '用 30 分钟认识项目定位、学习资料和协作边界。',
    updated: '2026-10-18',
    sourcePath: 'src/pages/docs/reading.astro',
  },
  {
    id: 'tasks',
    href: '/docs/tasks/',
    title: '任务看板',
    emoji: '✅',
    group: '计划与任务',
    description: '查看当前完成情况与下一步方向，认领任务前先到 GitHub 讨论。',
    updated: '2026-10-18',
    sourcePath: 'src/pages/docs/tasks.astro',
  },
  {
    id: 'workflow',
    href: '/docs/workflow/',
    title: '新建与发布',
    emoji: '✍️',
    group: '内容与流程',
    description: '没有后台编辑器时，怎样通过 GitHub 新建、检查和发布内容。',
    updated: '2026-10-18',
    sourcePath: 'src/pages/docs/workflow.astro',
  },
  {
    id: 'technical',
    href: '/docs/technical/',
    title: '技术文档',
    emoji: '🛠️',
    group: '技术资料',
    description: '架构、内容规范、设计系统与常用开发命令的入口。',
    updated: '2026-10-18',
    sourcePath: 'src/pages/docs/technical.astro',
  },
];

export const docsGroups: DocsGroup[] = ['工作台', '计划与任务', '内容与流程', '技术资料'].map(
  (title) => ({
    title,
    pages: docsPages.filter((page) => page.group === title),
  }),
);

export const githubNewFile = (path: string) => `${repository.url}/new/${repository.branch}/${path}`;
export const githubEditFile = (path: string) => `${repository.url}/edit/${repository.branch}/${path}`;
export const githubHistoryFile = (path: string) =>
  `${repository.url}/commits/${repository.branch}/${path}`;

export const newContentActions = [
  {
    label: '学习指南',
    hint: 'src/content/guide/*.md',
    emoji: '📖',
    href: githubNewFile('src/content/guide'),
    description: '新增一篇可独立阅读的模块；导航顺序与 frontmatter 一起提交。',
  },
  {
    label: '作品示例',
    hint: 'src/content/works/*.md',
    emoji: '🧪',
    href: githubNewFile('src/content/works'),
    description: '先以策划示例提交，保留 status: "example"，不冒充真实投稿。',
  },
  {
    label: '术语条目',
    hint: 'src/data/glossary.ts',
    emoji: '💡',
    href: githubEditFile('src/data/glossary.ts'),
    description: '在现有术语数据中增加一条，必须保留可核对来源。',
  },
  {
    label: '技术文档',
    hint: 'docs/*.md',
    emoji: '🛠️',
    href: githubNewFile('docs'),
    description: '记录架构、内容规范或设计决策，和实施一起更新。',
  },
];