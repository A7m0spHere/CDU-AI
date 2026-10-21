import type { GlossaryCategory } from './types';

/**
 * 术语分类：两层结构，与术语页左侧「分支树」一一对应。
 *
 * - primary（AI 主分支）：理解与使用 AI 的主干，占大部分词条；
 * - extension（延伸分支）：接触 AI 之后绕不开的前端 / 后端 / 产品 / 测试 / Git 等，
 *   只做「见到不懵」的术语介绍，不写成教程。
 *
 * 词条正文在 src/content/glossary/ 下，一篇 Markdown 一个术语，category 填下面某个 id。
 */
export const glossaryCategoryIds = [
  'basics',
  'prompt',
  'tools',
  'agents',
  'safety',
  'cost',
  'vibecoding',
  'frontend',
  'backend',
  'product',
  'testing',
  'git',
] as const;

export type GlossaryCategoryId = (typeof glossaryCategoryIds)[number];

export const glossaryCategories: GlossaryCategory[] = [
  /* --- AI 主分支 ------------------------------------------------------- */
  {
    id: 'basics',
    name: '基础',
    kind: 'primary',
    description: '模型是什么、能做什么，以及为什么会出错。',
  },
  {
    id: 'prompt',
    name: '提示词',
    kind: 'primary',
    description: '怎么问更准，模型一次到底能看到什么。',
  },
  {
    id: 'tools',
    name: '工具',
    kind: 'primary',
    description: '各类 AI 产品是什么，网页版和接口差在哪。',
  },
  {
    id: 'agents',
    name: 'Agent',
    kind: 'primary',
    description: '从一问一答到多步自动执行，中间需要哪些部件。',
  },
  {
    id: 'safety',
    name: '安全',
    kind: 'primary',
    description: '能传什么、生成内容能不能直接用、边界在哪。',
  },
  {
    id: 'cost',
    name: '成本',
    kind: 'primary',
    description: '为什么按量收费，为什么会限速、被截断。',
  },

  /* --- 延伸分支（只做术语介绍） ---------------------------------------- */
  {
    id: 'vibecoding',
    name: 'Vibe Coding',
    kind: 'extension',
    description: '用 AI 把想法直接写成能跑的页面或小工具。',
  },
  {
    id: 'frontend',
    name: '前端',
    kind: 'extension',
    description: '你看到的页面、按钮和交互是怎么来的。',
  },
  {
    id: 'backend',
    name: '后端',
    kind: 'extension',
    description: '页面背后的数据、接口和服务器在做什么。',
  },
  {
    id: 'product',
    name: '产品',
    kind: 'extension',
    description: '需求、原型、验收：和 AI 一起做东西时绕不开。',
  },
  {
    id: 'testing',
    name: '测试',
    kind: 'extension',
    description: '怎么判断做出来的东西到底有没有坏。',
  },
  {
    id: 'git',
    name: 'Git',
    kind: 'extension',
    description: '版本管理：改坏了还能回去，多人改同一份文件。',
  },
];

export const glossaryPrimaryCategories = glossaryCategories.filter((category) => category.kind === 'primary');
export const glossaryExtensionCategories = glossaryCategories.filter((category) => category.kind === 'extension');

export const glossaryCategoryName = (id: string): string =>
  glossaryCategories.find((category) => category.id === id)?.name ?? '';
