/**
 * 站点级配置：品牌、导航、阶段与透明说明。
 * 修改这里会影响全站页头、页脚和元信息。
 */

export const site = {
  name: 'CDU AI',
  englishName: 'AI 学习与交流社区',
  tagline: '从好奇开始，把 AI 用进真实生活',
  description:
    '面向成都大学全校学生的 AI 学习与交流社区。不要求先会编程，从真实问题、顺手工具和一个小作品开始。',
  organizer: '成都大学计算机协会 AI 方向',
  stage: 'M0 · 基础框架',
  stageNote: '本站当前为 M0 基础版，部分栏目仍在搭建中。',
} as const;

export const repository = {
  url: 'https://github.com/A7m0spHere/CDU-AI',
  branch: 'main',
} as const;

export interface NavItem {
  label: string;
  href: string;
  description: string;
}

export const navItems: NavItem[] = [
  { label: '学习指南', href: '/guide/', description: '先判断，再动手的学习路线' },
  { label: '术语表', href: '/glossary/', description: 'AI 术语速查' },
  { label: '工具资源', href: '/tools/', description: '按真实场景整理的工具索引' },
  { label: '作品广场', href: '/works/', description: '看示例，想自己的第一个作品' },
  { label: '活动', href: '/events/', description: '第八届网络创新大赛 · AI 创作挑战赛' },
];

export interface GuideStageMeta {
  id: 'start' | 'make' | 'share';
  index: string;
  label: string;
  title: string;
  description: string;
  icon: 'compass' | 'wrench' | 'spark';
  tone: 'sage' | 'warm' | 'sky';
}

export const guideStages: GuideStageMeta[] = [
  {
    id: 'start',
    index: '01',
    label: '先建立判断',
    title: '认识 AI 的能力和边界',
    description: '了解 AI 擅长什么、会在哪里出错，以及隐私和学术诚信的底线。',
    icon: 'compass',
    tone: 'sage',
  },
  {
    id: 'make',
    index: '02',
    label: '动手做出东西',
    title: '用现成工具完成一个小任务',
    description: '从真实需求出发做出一个可用成果，并检查结果是否可信。',
    icon: 'wrench',
    tone: 'warm',
  },
  {
    id: 'share',
    index: '03',
    label: '整理与分享',
    title: '记录过程，形成可分享的经验',
    description: '整理问题、做法、提示词与局限，并复盘下一步。',
    icon: 'spark',
    tone: 'sky',
  },
];

export const footerGroups = [
  {
    title: '探索',
    links: [
      { label: '学习指南', href: '/guide/' },
      { label: '术语表', href: '/glossary/' },
      { label: '工具资源', href: '/tools/' },
      { label: '作品广场', href: '/works/' },
    ],
  },
  {
    title: '参与',
    links: [
      { label: '社区（暂不开放）', href: '/community/' },
      { label: '活动', href: '/events/' },
      { label: '共建方式', href: '/about/#contribute' },
      { label: '纠错与贡献', href: `${repository.url}/blob/main/CONTRIBUTING.md` },
      { label: '贡献者', href: `${repository.url}/blob/main/CONTRIBUTORS.md` },
    ],
  },
  {
    title: '说明',
    links: [
      { label: '关于本站', href: '/about/' },
      { label: '内容规范', href: '/about/#standards' },
      { label: '透明说明', href: '/about/#transparency' },
    ],
  },
];

export const transparencyItems = [
  {
    title: '不是官方平台',
    text: '本站由成都大学计算机协会 AI 方向发起和共建，不是成都大学官方平台，页面表述不代表学校立场。',
  },
  {
    title: '不虚构作品与活动',
    text: 'M0 中的作品均明确标注为「策划示例」，不是真实学生投稿；活动页已上线第八届网络创新大赛 · AI 创作挑战赛，腾讯文档报名入口已开放（报名截止 11 月 24 日 10:00），教室与具体时间点以选手群通知为准。',
  },
  {
    title: '工具收录不等于推荐',
    text: '工具目录用于学习索引，不是广告或商业推荐。能力、价格与可用性会变化，请以官方页面为准。',
  },
  {
    title: '最小化信息收集',
    text: '本站本身不设账号、评论、广告或第三方追踪脚本；活动报名通过外部腾讯文档收集表收集，仅用于赛事联络与资格核对，并与公开展示资料严格隔离。',
  },
];
