export type ScenarioArt =
  | 'research' | 'reading' | 'science' | 'learning' | 'language'
  | 'slides' | 'design' | 'image' | 'video' | 'copy'
  | 'code' | 'data' | 'browser' | 'software' | 'automation';

interface Scenario {
  title: string;
  description: string;
  art: ScenarioArt;
}

interface ScenarioStack {
  id: string;
  label: string;
  angle: string;
  cards: Scenario[];
}

// 首页只展示应用的可能性；概念示意不代表站内提供了相应工具或服务。
export const homeScenarioStacks: ScenarioStack[] = [
  {
    id: 'discover',
    label: '探索与理解',
    angle: '-3deg',
    cards: [
      { title: '查资料', description: '从一个问题出发，找到值得追下去的线索。', art: 'research' },
      { title: '读论文', description: '拆开陌生概念，带着问题重新读懂原文。', art: 'reading' },
      { title: '辅助科研', description: '梳理研究问题，比较方法，构思实验方案。', art: 'science' },
      { title: '学知识', description: '把陌生概念拆开，用例子一点点理解。', art: 'learning' },
      { title: '练外语', description: '从一段对话开始，试着换一种语言表达。', art: 'language' },
    ],
  },
  {
    id: 'express',
    label: '表达与创作',
    angle: '2deg',
    cards: [
      { title: '做 PPT', description: '把零散的想法，整理成一场清楚的表达。', art: 'slides' },
      { title: '做设计', description: '试试不同的配色和构图，让灵感有个样子。', art: 'design' },
      { title: '做图片', description: '生成插画、修改图片，把想象变成画面。', art: 'image' },
      { title: '做视频', description: '串起脚本、分镜与字幕，让一个故事动起来。', art: 'video' },
      { title: '写文案', description: '从社团推文到活动介绍，为表达找个好开头。', art: 'copy' },
    ],
  },
  {
    id: 'build',
    label: '动手与实现',
    angle: '-2deg',
    cards: [
      { title: '写代码', description: '从几行代码开始，让一个小想法跑起来。', art: 'code' },
      { title: '理数据', description: '整理一张表，试着看见数字背后的规律。', art: 'data' },
      { title: '操作浏览器', description: '让 AI 协助查找网页、填写表格、整理信息。', art: 'browser' },
      { title: '操作专业软件', description: '以 MATLAB 为例，协助完成计算、绘图与仿真。', art: 'software' },
      { title: '做自动化', description: '把网页、文件与软件之间的重复步骤串起来。', art: 'automation' },
    ],
  },
];
