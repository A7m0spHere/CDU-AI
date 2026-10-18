import type { GlossaryCategory } from './types';

/**
 * 术语分类。词条正文在 src/content/glossary/ 下，一篇 Markdown 一个术语。
 * 新增术语时：放一个 .md 文件，category 填下面某个 id。
 */
export const glossaryCategoryIds = ['basics', 'context', 'agents', 'config', 'runtime'] as const;

export type GlossaryCategoryId = (typeof glossaryCategoryIds)[number];

export const glossaryCategories: GlossaryCategory[] = [
  {
    id: 'basics',
    name: 'AI 基础',
    description: '模型能做什么、为什么出错，以及常见的能力边界。',
  },
  {
    id: 'context',
    name: '提示词与上下文',
    description: '一次请求里，模型实际能看到、保留和参考什么。',
  },
  {
    id: 'agents',
    name: 'Agent 与工具',
    description: '从一次回答到多步执行，需要哪些部件。',
  },
  {
    id: 'config',
    name: '连接与配置',
    description: '把工具接到模型服务上时，地址、密钥和配置文件分别管什么。',
  },
  {
    id: 'runtime',
    name: '安全、权限与成本',
    description: '权限、沙箱、费用和速率：用起来之后要守的边界。',
  },
];

export const glossaryCategoryName = (id: string): string =>
  glossaryCategories.find((category) => category.id === id)?.name ?? '';
