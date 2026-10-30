import type { GlossaryCategory } from './types';

/**
 * 术语分类：两层结构，与术语页左侧「分支树」一一对应。
 *
 * - primary（AI 基础与使用）：理解与使用 AI 的主干，占大部分词条；
 * - extension（延伸分支）：接触 AI 之后绕不开的界面与前端 / 后端与部署 / 需求与产品 / 调试与测试 / Git 与 GitHub 等，
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
    name: '模型基础',
    kind: 'primary',
    description: '模型的能力、训练与开放方式，以及上下文和输出限制。',
  },
  {
    id: 'prompt',
    name: '提示词与输出',
    kind: 'primary',
    description: '怎么描述任务、提供示例并约定输出格式。',
  },
  {
    id: 'tools',
    name: '工具与接入',
    kind: 'primary',
    description: '对话、搜索、编程工具，以及 API 和本地运行等接入方式。',
  },
  {
    id: 'agents',
    name: 'Agent 与自动化',
    kind: 'primary',
    description: '智能体如何规划、调用工具并完成自动化任务。',
  },
  {
    id: 'safety',
    name: '安全与隐私',
    kind: 'primary',
    description: '能传什么、生成内容能不能直接用、边界在哪。',
  },
  {
    id: 'cost',
    name: '用量与计费',
    kind: 'primary',
    description: '订阅、试用、按量计费和接口用量限制。',
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
    name: '界面与前端',
    kind: 'extension',
    description: '你看到的页面、按钮和交互是怎么来的。',
  },
  {
    id: 'backend',
    name: '后端与部署',
    kind: 'extension',
    description: '服务器、数据库与应用部署的基础概念。',
  },
  {
    id: 'product',
    name: '需求与产品',
    kind: 'extension',
    description: '需求、原型、验收：和 AI 一起做东西时绕不开。',
  },
  {
    id: 'testing',
    name: '调试与测试',
    kind: 'extension',
    description: '认识 Bug、定位问题，并用测试用例检查结果。',
  },
  {
    id: 'git',
    name: 'Git 与 GitHub',
    kind: 'extension',
    description: '版本管理与 GitHub 协作中的仓库、分支、PR 和 Issue。',
  },
];

export const glossaryPrimaryCategories = glossaryCategories.filter((category) => category.kind === 'primary');
export const glossaryExtensionCategories = glossaryCategories.filter((category) => category.kind === 'extension');

export const glossaryCategoryName = (id: string): string =>
  glossaryCategories.find((category) => category.id === id)?.name ?? '';
