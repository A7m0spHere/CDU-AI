import type { Tool, ToolCategory } from './types';

/** 工具分类：按真实使用场景划分，不按品牌或热度。 */
export const toolCategories: ToolCategory[] = [
  {
    id: 'dialog',
    name: '对话与问答',
    description: '用自然语言把问题问清楚：先建立判断，再谈效率。',
  },
  {
    id: 'search',
    name: '搜索与资料',
    description: '带着问题找来源、读长文，把零散资料收拢成能核对的笔记。',
  },
  {
    id: 'write',
    name: '写作与协作',
    description: '把笔记、文档和分工放到同一个地方，减少来回传文件。',
  },
  {
    id: 'visual',
    name: '图像与视频',
    description: '做封面、插图、演示和短视频，发布前确认素材版权。',
  },
  {
    id: 'build',
    name: '编程与建站',
    description: '借助 AI 写代码或直接做出网页，适合愿意动手试错的同学。',
  },
];

/** 工具目录：收录不等于推荐，链接为核对过的官方入口，价格与额度以官网为准。 */
/**
 * 工具目录：**只由维护者按需添加**。
 *
 * 为什么保留空数组而不是删掉页面：工具页、搜索索引、首页与看板娘节点都从这里取数，
 * 保留结构可以让后续新增一条工具立刻生效，不需要改页面。
 * 收录标准与写法见 docs/CONTENT-GUIDE.md「工具条目」一节；收录不等于推荐。
 */
export const tools: Tool[] = [];
