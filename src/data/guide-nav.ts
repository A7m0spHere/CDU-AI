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
  /** 已发布但可以跳读的文章 */
  optional?: boolean;
}

export interface GuideNavGroup {
  id: GuideNavGroupId;
  index: string;
  label: string;
  /** 一句话说明该栏目的定位，供内容维护时参考 */
  description: string;
  items: GuideNavItem[];
}

export const guideHome = {
  title: '欢迎来到 CDU AI',
  href: '/guide/',
  description: '成都大学计算机协会 AI 方向发起的学习网站，分享面向同学的 AI 知识和实践经验。',
} as const;

export const guideNavGroups: GuideNavGroup[] = [
  {
    id: 'start-here',
    index: '01',
    label: '先从这里开始',
    description: '了解 CDU AI，找到自己感兴趣的起点。',
    items: [
      { label: guideHome.title, href: guideHome.href },
      { label: '这份指南适合谁', slug: 'who-is-this-for', hint: '写给谁、不写给谁' },
      { label: 'AI 使用常见问题', slug: 'ai-faq', hint: '回答核验、学习与 Agent 权限', optional: true },
    ],
  },
  {
    id: 'getting-started',
    index: '02',
    label: '认识并开始使用 Agent',
    description: '先了解 Agent，再选择工具并完成第一次实践。',
    items: [
      { label: '从 Chat AI 到 Agent', slug: 'chat-ai-to-agent' },
      { label: '第一次使用 Agent', slug: 'first-agent' },
      { label: '提示词撰写思路', slug: 'task-description' },
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
    label: '进一步了解 Agent',
    description: '在入门认知和实践的基础上，深入运行机制与扩展能力。',
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
    description: '完成多步骤的综合任务，经历协作、测试、迭代与复盘。',
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
  optional?: boolean;
  /** 只有实际存在 Markdown 正文时才参与连续翻页 */
  published: boolean;
}

/** 首页与登记章节共用一条阅读路径；资源区的独立页面不参与章节翻页。 */
export function getGuideChapters(modules: { id: string; data: { title: string } }[]): GuideChapter[] {
  const titles = new Map(modules.map((entry) => [entry.id.replace(/\.md$/, ''), entry.data.title]));
  return [
    { id: '', title: guideHome.title, href: guideHome.href, published: true },
    ...guideNavGroups.flatMap((group) => group.items.flatMap((item) => item.slug ? [{
      id: item.slug,
      title: titles.get(item.slug) ?? item.label,
      href: `/guide/${item.slug}/`,
      optional: item.optional,
      published: titles.has(item.slug),
    }] : [])),
  ];
}

/** 文章 slug 是否已在目录中登记。 */
export function isGuideNavSlug(slug: string): boolean {
  return guideNavSlugs.includes(slug);
}
