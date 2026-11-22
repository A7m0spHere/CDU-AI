import { isSafeExternalUrl } from '../lib/url-guard.mjs';

/** 组委会模板：由本站托管静态文件，在线体验与作品源码分开管理。 */
export interface StarterTemplate {
  slug: string;
  title: string;
  summary: string;
  cover: string;
  coverAlt: string;
  format: string;
  level: string;
  onboarding: string;
  ceiling: string;
  version: string;
  tags: string[];
  updated: string;
  demoPath: string;
  downloadPath: string;
  fitFor: string;
  discoveryLead: string;
  discoveryQuestions: string[];
  features: string[];
  sourceNote: string;
}

/**
 * 参赛作品：只收录公开链接与介绍，不托管作品内容。
 * 新增条目前确认：作者授权展示、链接可在无痕窗口访问、介绍里没有学号/手机号等个人信息。
 */
export interface ChallengeWork {
  slug: string;
  title: string;
  summary: string;
  author: string;
  group: '新手组' | '进阶组';
  templateSlug?: string;
  siteUrl: string;
  cover?: string;
  coverAlt?: string;
  screenshots?: string[];
  members?: string[];
  sections?: Array<{ title: string; body: string }>;
  tags: string[];
  updated: string;
  consent: boolean;
}

const templateSourceNote = '模板包可在本页下载，内含 README、启动提示词、AI 使用记录和过程记录模板；在线版只是模板本体。';

export const allTemplatesDownloadPath = '/downloads/templates/starter-templates-kit.zip';

export const starterTemplates: StarterTemplate[] = [
  {
    slug: 'flashcards',
    title: '单词闪卡 · 听写',
    summary: '多卡组、翻卡评分、错题本、进度统计、CSV 导入导出和浏览器语音朗读；数据只保存在本机浏览器。',
    cover: '/images/templates/flashcards.png',
    coverAlt: '单词闪卡听写模板截图',
    format: '单文件网页',
    level: '零基础',
    onboarding: '5–10 分钟',
    ceiling: '中',
    version: 'v1.0',
    tags: ['单词学习', 'CSV 导入导出', '语音朗读'],
    updated: '2026-11-21',
    demoPath: '/templates/flashcards/index.html',
    downloadPath: '/downloads/templates/flashcards-kit.zip',
    fitFor: '想练「数据管理 + 学习流程 + 统计」的同学',
    discoveryLead: '先别急着加卡片。想想你平时背单词时，哪一步最卡、最想少做一次。',
    discoveryQuestions: [
      '你背单词时最卡在哪一步？是记不住、不会用，还是坚持不下去？',
      '你希望卡片或进度页多给你什么反馈？比如提醒、错题复习、发音或统计。',
    ],
    features: [
      '三组示例卡组，共 32 张卡片；支持多卡组新建、重命名、删除',
      '点击 / 空格翻卡，认识 / 不认识评分；错题本自动收集',
      '今日学习、已掌握、错题待复习、近 7 天柱状图和卡组进度',
      'CSV 导入 / 导出（带 BOM），中英文表头都能识别',
      '浏览器 speechSynthesis 语音朗读、键盘快捷键、浅色 / 深色主题',
    ],
    sourceNote: templateSourceNote,
  },
  {
    slug: 'pomodoro',
    title: '番茄钟 · 学习打卡',
    summary: '专注 / 短休 / 长休计时，今日任务、连续打卡和近 7 天统计；数据只保存在本机浏览器。',
    cover: '/images/templates/pomodoro.png',
    coverAlt: '番茄钟学习打卡模板截图',
    format: '单文件网页',
    level: '零基础',
    onboarding: '5 分钟',
    ceiling: '中',
    version: 'v1.0',
    tags: ['学习效率', '计时统计', '本地存储'],
    updated: '2026-11-21',
    demoPath: '/templates/pomodoro/index.html',
    downloadPath: '/downloads/templates/pomodoro-kit.zip',
    fitFor: '想练「状态管理 + 本地数据 + 统计图表」的同学',
    discoveryLead: '先别急着加统计。想想你学习时最容易被什么打断，或者最想知道什么。',
    discoveryQuestions: [
      '你学习时最容易被什么打断？是任务没拆清、休息过头，还是看不到进度？',
      '你希望计时页在开始、进行中或结束时多提醒你什么？',
    ],
    features: [
      '专注 / 短休 / 长休三种计时，默认 25 / 5 / 15 分钟',
      '今日任务：科目、预计番茄数、完成勾选、当前任务',
      '今日概览：专注分钟、完成番茄、连续天数、完成任务',
      '近 7 天专注柱状图 + 科目分布',
      'localStorage 持久化、浅色 / 深色主题、键盘快捷键',
    ],
    sourceNote: templateSourceNote,
  },
  {
    slug: 'mbti',
    title: 'MBTI 人格小测试',
    summary: '28 道二选一，按 E/I、S/N、T/F、J/P 四个维度生成结果；娱乐向简化测试，不做心理诊断。',
    cover: '/images/templates/mbti.png',
    coverAlt: 'MBTI 人格测试模板截图',
    format: '单文件网页',
    level: '零基础',
    onboarding: '5–10 分钟',
    ceiling: '中',
    version: 'v1.0',
    tags: ['互动测试', '结果分享', '本地存储'],
    updated: '2026-11-21',
    demoPath: '/templates/mbti/index.html',
    downloadPath: '/downloads/templates/mbti-kit.zip',
    fitFor: '想练「问卷流程 + 结果计算 + 分享文案」的同学',
    discoveryLead: '先别急着加题目。想想你做测试时最想先看到什么、最不信哪一步。',
    discoveryQuestions: [
      '你做这个测试时，最想先看到结果、解释，还是和朋友对比？',
      '你觉得现在哪一步最不清楚：题目、计分、结果，还是分享？',
    ],
    features: [
      '28 道二选一情境题，E/I、S/N、T/F、J/P 各 7 题',
      '单题作答、自动进入下一题，可返回修改',
      '答题进度自动保存，刷新或重新打开后可继续上次',
      '结果页：四字母类型、四维百分比条、优势 / 注意 / 适合场景',
      '历史记录最多 20 条，可一键复制结果文案',
    ],
    sourceNote: templateSourceNote,
  },
  {
    slug: 'tetris',
    title: '经典俄罗斯方块',
    summary: '10×20 棋盘、7-BAG 随机、暂存与幽灵落点；消行计分、等级加速，键盘和触屏都能玩。',
    cover: '/images/templates/tetris.png',
    coverAlt: '经典俄罗斯方块模板截图',
    format: '单文件网页',
    level: '零基础',
    onboarding: '10–15 分钟',
    ceiling: '高',
    version: 'v1.0',
    tags: ['小游戏', 'Canvas', '触屏适配'],
    updated: '2026-11-21',
    demoPath: '/templates/tetris/index.html',
    downloadPath: '/downloads/templates/tetris-kit.zip',
    fitFor: '想练「Canvas 游戏循环 + 键盘 / 触屏输入」的同学',
    discoveryLead: '先别急着加方块。想想你玩到哪一局最挫败，或者最想改变哪条规则。',
    discoveryQuestions: [
      '你玩的时候最挫败的是哪一刻？是速度、随机性，还是操作不顺手？',
      '你希望游戏在开始、进行中或结束时多给你什么反馈？',
    ],
    features: [
      '10×20 棋盘、7 种方块、7-BAG 随机',
      '暂存、下一个预览 3 个、幽灵落点提示',
      '消行计分、连击加分、每 10 行升级',
      '暂停 / 继续、结束结算、重新开始',
      '最高分 + 最近 10 局记录，键盘与触屏操作',
    ],
    sourceNote: templateSourceNote,
  },
  {
    slug: 'tank-battle',
    title: '坦克大战 · 经典街机',
    summary: '13×13 网格战场与三张关卡，四类敌军、五种道具和基地防守；键盘与触屏操作。',
    cover: '/images/templates/tank-battle.png',
    coverAlt: '坦克大战模板截图',
    format: '单文件网页',
    level: '零基础',
    onboarding: '15–20 分钟',
    ceiling: '高',
    version: 'v1.0',
    tags: ['小游戏', 'Canvas', '关卡与道具'],
    updated: '2026-11-21',
    demoPath: '/templates/tank-battle/index.html',
    downloadPath: '/downloads/templates/tank-battle-kit.zip',
    fitFor: '想练「游戏 AI + 关卡 / 道具系统 + 碰撞检测」的同学',
    discoveryLead: '先别急着加敌人。想想你在哪一关、哪种敌人面前最想放弃。',
    discoveryQuestions: [
      '你在哪一关或哪种敌人面前最挫败？是难度、视野，还是操作？',
      '你希望游戏在受击、过关或失败时多提醒你什么？',
    ],
    features: [
      '13×13 网格战场，三张关卡地图',
      '玩家坦克四向移动、开火、出生护盾、火力 1–3 级',
      '四类敌军与简单 AI，会向基地和玩家推进',
      '五种道具：火力、护盾、全屏爆破、基地修复、额外生命',
      '基地防守、生命、得分、关卡与通关结算',
    ],
    sourceNote: templateSourceNote,
  },
  {
    slug: '2048',
    title: '数字合并场 · 经典 2048',
    summary: '4×4 棋盘合并数字，撤销、最高分、对局记录和 2048 进度；键盘、滑动和触屏都能玩。',
    cover: '/images/templates/2048.png',
    coverAlt: '经典 2048 模板截图',
    format: '单文件网页',
    level: '零基础',
    onboarding: '10 分钟',
    ceiling: '中高',
    version: 'v1.0',
    tags: ['小游戏', '数字合并', '触屏适配'],
    updated: '2026-11-21',
    demoPath: '/templates/2048/index.html',
    downloadPath: '/downloads/templates/2048-kit.zip',
    fitFor: '想练「网格状态 + 合并算法 + 本地记录」的同学',
    discoveryLead: '先别急着加模式。想想你玩到哪一步最容易放弃，或者最想重来哪一步。',
    discoveryQuestions: [
      '你玩到哪一步最容易放弃？是格子太满、没有提示，还是分数不够直观？',
      '你希望游戏在合并、接近胜利或失败时多给你什么反馈？',
    ],
    features: [
      '4×4 棋盘，每次有效移动随机生成 2 或 4',
      '上下左右合并，同一方块一次移动最多合并一次',
      '计分、步数、用时、最大方块和 2048 进度条',
      '每局最多 3 次撤销；最高分和最近 10 局记录',
      '浅色 / 深色主题、音效、动画开关，键盘 + 滑动 + 触屏',
    ],
    sourceNote: templateSourceNote,
  },
  {
    slug: 'pixel-art',
    title: '像素画板 · 涂鸦工作台',
    summary: '16 / 24 / 32 像素画布、铅笔 / 橡皮 / 填充 / 取色与左右镜像；撤销、自动保存和透明 PNG 导出，鼠标和手指都能画。',
    cover: '/images/templates/pixel-art.png',
    coverAlt: '像素画板涂鸦工作台模板截图',
    format: '单文件网页',
    level: '零基础',
    onboarding: '10–15 分钟',
    ceiling: '中高',
    version: 'v1.0',
    tags: ['像素绘画', 'Canvas', '本地存储'],
    updated: '2026-11-22',
    demoPath: '/templates/pixel-art/index.html',
    downloadPath: '/downloads/templates/pixel-art-kit.zip',
    fitFor: '想练「画布交互 + 像素数据 + 图片导出」的同学',
    discoveryLead: '先别急着加画笔。想想你画画时最想少做哪一步、画完之后最想拿它做什么。',
    discoveryQuestions: [
      '你画像素画时最卡在哪一步？是选色太慢、画错了难改，还是画完不知道怎么用？',
      '你希望画板在涂色、导出或回看时多给你什么反馈？',
    ],
    features: [
      '16×16 画布，可切换 24×24 / 32×32，原内容保留在左上角',
      '铅笔、橡皮、油漆桶、取色器四种工具，拖拽连续绘制',
      '16 色预设调色板 + 自定义颜色；左右镜像和网格开关',
      '最多 60 步撤销 / 重做，清空画布也能撤销',
      '自动保存到 localStorage，透明背景导出 PNG，鼠标和触屏都能画',
    ],
    sourceNote: templateSourceNote,
  },
  {
    slug: 'campus-info',
    title: '校园信息站 · 办事导航',
    summary: '6 个分类、18 条示例信息的校园信息导航：分类筛选、关键词搜索、收藏与最近浏览，支持 JSON 导入导出；默认数据为虚构示例。',
    cover: '/images/templates/campus-info.png',
    coverAlt: '校园信息站办事导航模板截图',
    format: '单文件网页',
    level: '零基础',
    onboarding: '10–15 分钟',
    ceiling: '中高',
    version: 'v1.0',
    tags: ['信息导航', '筛选搜索', 'JSON 数据'],
    updated: '2026-11-22',
    demoPath: '/templates/campus-info/index.html',
    downloadPath: '/downloads/templates/campus-info-kit.zip',
    fitFor: '想练「信息整理 + 筛选搜索 + JSON 数据」的同学',
    discoveryLead: '先别急着加栏目。想想新生或同学最常问你的三件事是什么、现在他们去哪里查。',
    discoveryQuestions: [
      '你最常被问到的校园信息是什么？现在查这些信息最麻烦的是哪一步？',
      '你希望信息站帮同学快速判断什么，比如地点、开放时间或是否需要预约？',
    ],
    features: [
      '6 个分类、18 条虚构示例信息：餐饮、学习空间、办事流程、生活服务、运动健康、社团活动',
      '分类筛选、关键词搜索，推荐 / 名称 / 最近更新三种排序',
      '卡片收藏与最近浏览，只保存在本机浏览器',
      '详情弹窗展示位置、开放时间、联系方式和具体说明',
      '数据管理：编辑 JSON、导入文件、复制 / 下载 JSON、一键恢复示例',
      '深色 / 浅色主题、手机单列布局，无第三方库、无网络请求、无需登录',
    ],
    sourceNote: templateSourceNote,
  },
];

/** 作品提交截止后，经审核与授权再逐条加入。保持为空时页面显示空状态。 */
export const challengeWorks: ChallengeWork[] = [];

export function safeWorkUrl(value: string): string | undefined {
  const trimmed = value.trim();
  return isSafeExternalUrl(trimmed) ? trimmed : undefined;
}
