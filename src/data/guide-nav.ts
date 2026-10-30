/**
 * 学习指南的**目录信息架构**（侧边栏分组）。
 *
 * 为什么单独放在这里：
 * - 本文件决定侧边栏分组与「上一章 / 下一章」的阅读顺序，frontmatter 的 `order` 保留为集合排序字段；
 * - 调整栏目、加分组、换顺序只改这个文件，不需要动页面组件；
 * - 只有 `slug`、没有文件的章节也生成可访问的占位页，目录标注「待补充」；
 * - 文章文件一旦创建（`src/content/guide/<slug>.md`），同一个 URL 自动显示正文，标题取文章自己的 title。
 *
 * 新增一篇文章：写 `src/content/guide/<slug>.md`，然后在下面某个分组里加一条 `{ slug: '<slug>', label: '<占位标题>' }`。
 * 只登记 slug、不建文件 = 占位页；只建文件、不登记 = `npm run check:content` 报错（避免文章写了却不出现在目录里）。
 */

export type GuideNavGroupId =
  | 'start-here'
  | 'getting-started'
  | 'tasks'
  | 'agent-advanced'
  | 'cases'
  | 'resources';

export interface GuideNavItem {
  /** 侧边栏显示名；文章存在时以文章 frontmatter 的 title 为准 */
  label: string;
  /** 文章 slug（对应 src/content/guide/<slug>.md）；与 href 二选一 */
  slug?: string;
  /** 站内固定路由（非文章条目，如工具页、术语表） */
  href?: string;
  /** 可选备注，仅在规划条目上展示 */
  hint?: string;
}

export interface GuideNavGroup {
  id: GuideNavGroupId;
  index: string;
  label: string;
  /** 一句话说明该栏目的定位，供内容维护时参考 */
  description: string;
  items: GuideNavItem[];
}

export const guideNavGroups: GuideNavGroup[] = [
  {
    id: 'start-here',
    index: '01',
    label: '先从这里开始',
    description: '第一次打开这份指南时先看的三件事。',
    items: [
      { label: '指南首页', href: '/guide/' },
      { label: '这份指南适合谁', slug: 'who-is-this-for', hint: '写给谁、不写给谁' },
      { label: 'AI 使用常见问题', slug: 'ai-faq', hint: '隐私、出错、作业边界' },
    ],
  },
  {
    id: 'getting-started',
    index: '02',
    label: '开始学习',
    description: '从聊天框走到 Agent：先建立判断，再交任务。',
    items: [
      { label: '从 Chat AI 到 Agent', slug: 'chat-ai-to-agent' },
      { label: 'Agent 能做什么', slug: 'agent-capabilities' },
      { label: '选择第一个 Agent', slug: 'choose-first-agent' },
      { label: '任务描述', slug: 'task-description' },
      { label: '权限与结果检查', slug: 'permissions-and-review' },
    ],
  },
  {
    id: 'tasks',
    index: '03',
    label: 'AI 能帮你做什么',
    description: '按真实校园任务划分：查资料、学课程、写文档、做素材、整文件、做小工具。',
    items: [
      { label: '资料检索', slug: 'research-and-sources' },
      { label: '课程学习', slug: 'coursework-study' },
      { label: '文档与表格', slug: 'docs-and-sheets' },
      { label: '多模态创作', slug: 'multimodal-creation' },
      { label: '文件整理', slug: 'file-organizing' },
      { label: '制作小工具', slug: 'build-small-tools' },
    ],
  },
  {
    id: 'agent-advanced',
    index: '04',
    label: '进一步使用 Agent',
    description: '想自己搭流程时再往下读，不要求新手先掌握。',
    items: [
      { label: '执行原理', slug: 'agent-how-it-works' },
      { label: '工作流', slug: 'workflow' },
      { label: 'Skill', slug: 'skill' },
      { label: 'MCP', slug: 'mcp' },
      { label: '自动化', slug: 'automation' },
    ],
  },
  {
    id: 'cases',
    index: '05',
    label: '跟着案例实践',
    description: '完整走一遍：需求、做法、提示词、局限与复盘。',
    items: [
      { label: 'CDU 图书馆荐书 Skill', slug: 'case-library-book-skill' },
      { label: '学习资料整理', slug: 'case-study-materials' },
      { label: '小项目实践', slug: 'case-mini-project' },
      { label: '失败与复盘', slug: 'case-retrospective' },
    ],
  },
  {
    id: 'resources',
    index: '06',
    label: '资源与交流',
    description: '读完想继续找工具、查术语、看案例，或参与共建。',
    items: [
      { label: 'AI 工具', href: '/tools/' },
      { label: '术语表', href: '/glossary/' },
      { label: '作品案例', href: '/works/' },
      { label: '内容共建', href: '/about/#contribute' },
    ],
  },
];

export const guideNavGroupIds = guideNavGroups.map((group) => group.id);

/** 所有登记过 slug 的条目（含规划中），供内容检查与测试使用。 */
export const guideNavSlugs = guideNavGroups.flatMap((group) =>
  group.items.map((item) => item.slug).filter((slug): slug is string => Boolean(slug)),
);

export interface GuideChapter {
  id: string;
  title: string;
  href: string;
}

/** 首页与登记章节共用一条阅读路径；资源区的独立页面不参与章节翻页。 */
export function getGuideChapters(modules: { id: string; data: { title: string } }[]): GuideChapter[] {
  const titles = new Map(modules.map((entry) => [entry.id.replace(/\.md$/, ''), entry.data.title]));
  return [
    { id: '', title: '指南首页', href: '/guide/' },
    ...guideNavGroups.flatMap((group) => group.items.flatMap((item) => item.slug ? [{
      id: item.slug,
      title: titles.get(item.slug) ?? item.label,
      href: `/guide/${item.slug}/`,
    }] : [])),
  ];
}

/** 文章 slug 是否已在目录中登记。 */
export function isGuideNavSlug(slug: string): boolean {
  return guideNavSlugs.includes(slug);
}
