import type { ChallengeWork } from './showcase';

/**
 * 仅本地开发用于检查作品详情页和卡片布局。
 * 生产构建不会把这些条目写入 HTML；真实参赛作品由管理员审核后写入 showcase.ts。
 */
export const previewWorks: ChallengeWork[] = [
  {
    slug: 'preview-pomodoro-ranking',
    title: '布局预览：番茄钟加自习室排行',
    summary: '把番茄钟模板改成自习室队友排行，用来检查参赛作品详情页、作者署名与外链布局。',
    author: '小番茄自习室',
    group: '新手组',
    templateSlug: 'pomodoro',
    siteUrl: 'https://wiki.cduai.top/events/',
    cover: '/images/templates/pomodoro.png',
    coverAlt: '番茄钟模板截图',
    members: ['小番茄', '阿钟'],
    sections: [
      {
        title: '它回应的问题',
        body: '自习室里大家各自计时，缺少一个能看到队友今天专注了多久的轻量页面。',
      },
      {
        title: '怎么做的',
        body: '在番茄钟模板上增加队伍房间、队内排行和今日目标；数据仍只保存在本机，排行用示例数据演示。',
      },
      {
        title: 'AI 使用与已知限制',
        body: '用 AI 辅助拆解任务和生成校验清单；目前排行是本地示例，没有接后端，换设备后不会同步。',
      },
    ],
    tags: ['布局预览', '基于模板', '自习室'],
    updated: '2026-11-21',
    consent: true,
  },
  {
    slug: 'preview-tetris-daily',
    title: '布局预览：俄罗斯方块每日挑战',
    summary: '给俄罗斯方块加每日固定种子与挑战记录，用来检查进阶组作品详情页和外部站点提示。',
    author: '方块练习场',
    group: '进阶组',
    templateSlug: 'tetris',
    siteUrl: 'https://wiki.cduai.top/works/',
    cover: '/images/templates/tetris.png',
    coverAlt: '俄罗斯方块模板截图',
    members: ['方块练习场'],
    sections: [
      {
        title: '它回应的问题',
        body: '随机开局每天都不一样，想和朋友比同一天的分数时缺少统一题目。',
      },
      {
        title: '怎么做的',
        body: '用日期生成固定随机种子，记录当天最高分和最近挑战；保留原模板的暂存、幽灵落点和触屏操作。',
      },
      {
        title: 'AI 使用与已知限制',
        body: '用 AI 辅助生成种子算法和测试用例；目前只保存本地记录，没有跨设备排行榜。',
      },
    ],
    tags: ['布局预览', '每日挑战', '小游戏'],
    updated: '2026-11-21',
    consent: true,
  },
];
