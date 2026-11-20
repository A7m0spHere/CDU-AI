import { isSafeExternalUrl } from '../lib/url-guard.mjs';

export type EntryStatus = 'upcoming' | 'open' | 'closed';

export interface ExternalEntry {
  id: string;
  code: string;
  stageLabel: string;
  title: string;
  dateLabel: string;
  status: EntryStatus;
  /** 外部表单链接。留空时页面显示待开放状态，不输出无效链接。 */
  url: string;
  buttonLabel: string;
  pendingLabel: string;
  closedLabel?: string;
  collects: string;
  purpose: string;
  highlight?: string;
}

export interface TimelinePhase {
  day: string;
  dateLabel: string;
  time: string;
  stage: string;
  summary: string;
  deliverable: string;
}

export interface ScoringDimension {
  name: string;
  weight: number;
  criteria: string;
}

export interface ScoringGroup {
  id: 'starter' | 'open';
  label: string;
  shortLabel: string;
  tag: string;
  summary: string;
  dimensions: ScoringDimension[];
  tiebreak: string;
}

export interface AwardRow {
  group: '新手组' | '进阶组';
  title: string;
  quantity: string;
  reward: string;
}

export interface TrackInfo {
  id: 'starter' | 'open';
  label: string;
  shortLabel: string;
  audience: string;
  form: string;
  startingPoint: string;
  minimum: string;
  scoring: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * 校验外部链接是否合法且安全（只放行 http/https）。
 * 留空或非法链接返回 undefined，避免页面渲染死链或危险协议。
 */
export function resolveExternalUrl(url?: string): string | undefined {
  const trimmed = url?.trim();
  if (!trimmed) return undefined;
  return isSafeExternalUrl(trimmed) ? trimmed : undefined;
}

/**
 * 赛事数据来源：
 * - 《正式比赛规则_双轨版_v1.0》（2026-11-20 赛前公示版）
 * - 《报名公告与报名须知_AI创作挑战赛_v1》
 * - 2026-11-20 会议纪要（赛期与报名窗口）
 *
 * ============================================================================
 * 赛事统一配置区（报名链接、日期、文案变更时优先改这里）
 * ============================================================================
 */
export const challengeConfig = {
  title: '成都大学第八届网络创新大赛 · AI 创作挑战赛',
  shortTitle: '第八届网络创新大赛 · AI 创作挑战赛',
  eyebrow: '活动 · 赛事报名',
  statusBadge: '报名开放中 · 11 月 21 日 10:00 — 11 月 24 日 10:00',
  subtitle:
    '用 AI 把一个想法真正做出来。不设统一命题，不要求编程基础，专业、年级不限；10 天内完成一个可运行、可演示、经过基本验证的数字作品。',
  organizerNote:
    '主办：共青团成都大学委员会、成都大学电子信息与电气工程学院 · 承办：成都大学计算机协会',
  maintainerNote: '本页为赛事信息展示页，赛事最终解释权归组委会所有。',
  updatedOn: '2026-11-20',

  dates: {
    registration: '11 月 21 日 10:00 — 11 月 24 日（周二）10:00',
    kickoff: '11 月 24 日（周二）下午',
    competition: '11 月 24 日 — 12 月 4 日（共 10 天）',
    midterm: '11 月 28 日（周六）20:00 前',
    submission: '12 月 4 日（周五）18:00',
    demoDay: '12 月 6 日（周日）下午 14:00–17:30',
    venue: '第十教学楼（具体教室以选手群通知为准）',
  },

  /** 首页顶部横幅提示 */
  homeBanner: {
    badge: '报名开放中',
    title: '成都大学第八届网络创新大赛 · AI 创作挑战赛',
    summary: '11/21–11/24 10:00 报名 · 11/24–12/4 赛期 · 新手组 / 进阶组分开评奖 · 腾讯文档报名',
    ctaLabel: '查看报名入口',
    href: '/events/',
  },

  /**
   * 报名入口配置（腾讯文档收集表）
   * 使用方法：将 url 替换为真实腾讯文档收集表地址（https://docs.qq.com/...），
   * 并把 status 改为 'open'，页面会自动显示可点击的报名按钮。
   */
  registration: {
    platform: '腾讯文档收集表',
    form: {
      id: 'registration-form',
      code: '报名入口',
      stageLabel: '在线报名',
      title: '填写腾讯文档报名表',
      dateLabel: '开放时间：11 月 21 日 10:00 — 11 月 24 日（周二）10:00',
      status: 'open' as EntryStatus,
      url: 'https://docs.qq.com/form/page/DYXhGYXJYQ2V0bnZD',
      buttonLabel: '前往腾讯文档填写报名表',
      pendingLabel: '报名入口将于 11 月 21 日 10:00 开放',
      closedLabel: '报名已截止',
      collects:
        '基本信息（姓名、学号、学院、专业、年级、手机号、QQ号）、参赛信息（组别、个人/团队、项目名称、一句话简介、选题方向）、团队信息（队友信息与每人至少 2 项可验证交付物）、基础情况（开发经验、计划使用的 AI 工具）与参赛承诺。',
      purpose: '报名信息仅用于资格核验、赛事联络、选手群邀请与组队对接。',
      highlight: '填写约需 2–3 分钟；手机号、QQ号仅用于赛事联络与拉群，不对外公开。',
    } satisfies ExternalEntry,
    privacyNotice:
      '报名通过腾讯文档收集表收集，仅用于赛事通知、资格核对与组队对接；个人联系方式与后续公开展示的作品资料分表隔离，未经本人同意不对外公开。',
    /** 腾讯文档报名二维码：已放到 public/images/events/tencent-docs-registration-qr.png */
    qrImage: '/images/events/tencent-docs-registration-qr.png',
    qrAlt: '成都大学第八届网络创新大赛 · AI 创作挑战赛腾讯文档报名二维码',
  },

  contact: {
    confirmation:
      '提交后 24 小时内，组委会通过短信 / QQ 发送确认信息与选手群入口。',
    channel: '后续通知以选手群为准。',
  },
};

export const quickFacts = [
  { label: '报名时间', value: challengeConfig.dates.registration },
  { label: '赛期', value: challengeConfig.dates.competition },
  { label: '参赛对象', value: '成都大学全体在读学生（本科、研究生），专业、年级、基础不限' },
  { label: '组别', value: '新手组 / 进阶组，同场参赛、分开评奖' },
  { label: '参赛形式', value: '新手组仅限个人；进阶组个人或 ≤2 人团队' },
  { label: '报名方式', value: '腾讯文档收集表（已开放，11 月 24 日 10:00 截止）' },
];

export const coreHighlights = [
  {
    icon: 'sprout' as const,
    title: '零基础可参加',
    description:
      '新手组提供 7–10 个可运行模板，从模板改造开始；不按代码量、算法难度或技术栈复杂度评价作品。',
  },
  {
    icon: 'layers' as const,
    title: '双组别分开评奖',
    description:
      '零基础与有经验的同学分处新手组、进阶组，各自竞争、分开评奖，新手组第一名与进阶组第一名同样上台领奖。',
  },
  {
    icon: 'target' as const,
    title: '作品优先，拒绝纯 PPT',
    description:
      '至少交付 1 项可现场运行或经评委验证的真实功能。允许原型不完整、界面朴素，但只有 PPT、静态效果图或无法验证的视频不能参与主赛评奖。',
  },
];

export const tracks: TrackInfo[] = [
  {
    id: 'starter',
    label: '新手组',
    shortLabel: 'Starter',
    audience: '零基础、首次用 AI 做作品的同学',
    form: '仅限个人参赛',
    startingPoint: '从组委会提供的 7–10 个模板项目中选一个进行改造',
    minimum: '模板跑通 + 至少 1 项有意义的改造（功能、交互或数据；仅换配色/文字不算）',
    scoring: '评分：可运行与完成度 40 · 改造深度 20 · 学习与过程记录 20 · AI 使用 10 · 展示 10',
  },
  {
    id: 'open',
    label: '进阶组',
    shortLabel: 'Open',
    audience: '有开发经验或 Agent 使用经验的同学',
    form: '个人，或团队（不超过 2 人；3 人及以上须书面申请并经审核）',
    startingPoint: '自由选题，可从零开始，也可从已有项目继续',
    minimum: '至少 1 项可现场运行的核心功能',
    scoring: '评分：完成度与可用性 30 · 需求与创意 20 · 测试与验证 15 · AI 与技术 15 · 学习与迭代 15 · 展示 5',
  },
];

export const teamRuleSummary = [
  '新手组仅限个人参赛，不建议组队；进阶组鼓励个人，团队人数上限 2 人。',
  '3 人及以上团队须在报名时提交书面申请，经组委会审核通过后方可参赛。',
  '团队报名须提交每人至少 2 项可验证的具体交付物，例如「登录页 + 部署上线」「测试用例 + 演示视频」。',
  '每人只能加入一个参赛作品，不得重复报名；团队须指定 1 名联系人负责与组委会沟通。',
  '报名时自行选择组别，组委会在报名截止后 3 天内完成审核；新手组可申请升入进阶组，进阶组不得降入新手组。',
];

export const registrationSteps = [
  {
    code: '01',
    title: '在线填写报名表',
    timing: '11 月 21 日 10:00 — 11 月 24 日（周二）10:00',
    text: '通过本页开放的腾讯文档收集表填写；可暂定项目名称，团队报名须同时提交队友信息与分工。',
  },
  {
    code: '02',
    title: '等待报名确认',
    timing: '提交后 24 小时内',
    text: '组委会通过短信 / QQ 发送确认信息与选手群入口；信息不完整或分工不明确的须按时补正。',
  },
  {
    code: '03',
    title: '加入选手群并参加开赛会',
    timing: '11 月 24 日（周二）下午',
    text: '开赛会线下进行，包含规则讲解、评分说明、Agent 实操演示、选题指导、现场组队/结对与答疑。',
  },
];

export const registrationFieldsPreview = [
  { name: '基本信息', required: true, note: '姓名、学号、学院、专业、年级、手机号、QQ号' },
  { name: '参赛信息', required: true, note: '组别、个人/团队、项目名称（可暂定）、一句话简介、选题方向' },
  { name: '团队信息', required: false, note: '队友姓名/学号/学院/联系方式；每人至少 2 项可验证交付物' },
  { name: '基础情况', required: true, note: '是否有开发经验、计划使用的 AI 工具' },
  { name: '参赛承诺', required: true, note: '原创与增量披露、数据合规、作品展示授权' },
];

export const workScope = [
  '校园生活、学习效率工具',
  'AI 智能体与个人助手',
  '互动网页、轻量级应用',
  '小游戏、交互体验、可视化作品',
  'AI 辅助的科研或专业学习工具',
  '其他具有明确功能的创新软件',
];

export const minimumDeliverables = [
  {
    title: '可观察的实际功能',
    badge: '必达',
    text: '至少 1 项与作品目标相关的功能可现场运行，或经评委验证。',
  },
  {
    title: '清晰的运行方式',
    badge: '三选一',
    text: '提供在线链接、可执行程序、可复现步骤或本地演示环境之一。',
  },
  {
    title: '真实的功能边界',
    badge: '如实说明',
    text: '说明已实现/未实现功能、是否使用模拟数据、依赖哪些外部服务。',
  },
  {
    title: '必要的过程说明',
    badge: '可核查',
    text: '说明项目起点、赛期新增工作、成员分工与 AI 使用方式。',
  },
];

export const submissionOptions = [
  {
    code: 'A',
    title: '在线链接（推荐）',
    summary: '使用 WorkBuddy / ZCode / Qoder Sites 等一键发布功能生成公开网页链接。',
    note: '无痕窗口、未登录状态可正常访问；提交时注明发布平台名称。',
  },
  {
    code: 'B',
    title: '代码仓库',
    summary: 'GitHub / Gitee 仓库链接 + README（含运行步骤）。',
    note: 'README 须写清环境要求、启动命令与已知问题。',
  },
  {
    code: 'C',
    title: '本地包',
    summary: 'zip 压缩包（代码 + 运行说明）+ 2 分钟录屏。',
    note: '适合完全本地运行的作品；现场由组委会统一电脑运行。',
  },
];

export const finalMaterials = [
  {
    title: '2 分钟演示录屏',
    badge: '必交',
    text: '展示核心功能的实际操作，作为现场设备故障时的 fallback。',
  },
  {
    title: '1 页作品说明',
    badge: '必交',
    text: '作品名、作者、组别、一句话简介、核心功能、运行方式、AI 使用说明、已知问题。',
  },
  {
    title: '团队分工表',
    badge: '团队必交',
    text: '每人负责的具体内容与交付物；个人参赛无需提交。',
  },
];

export const submissionRedlines = [
  '链接有效性：在线链接须在无痕窗口、未登录状态下可正常访问，有效期覆盖至 2026 年 12 月 8 日（评审与公示期）。',
  '失效处理：因链接失效、需登录或区域限制导致评委无法访问的，按「未提交可运行成果」处理。',
  '截止纪律：2026 年 12 月 4 日 18:00 截止，逾期视为弃赛；截止后不接受补交或替换材料。',
  '安全红线：不得在提交材料中泄露 API 密钥、账号密码或他人隐私；使用真实用户数据须确保合法来源与授权。',
];

export const timelinePhases: TimelinePhase[] = [
  {
    day: '11/21',
    dateLabel: '周六',
    time: '10:00',
    stage: '报名启动',
    summary: '腾讯文档报名表上线；可个人报名，也可按规则提交团队报名。',
    deliverable: '在线填写报名表',
  },
  {
    day: '11/24',
    dateLabel: '周二',
    time: '10:00',
    stage: '报名截止',
    summary: '报名名单与组别确认；信息不完整的按要求补正，逾期视为报名无效。',
    deliverable: '完成报名信息提交',
  },
  {
    day: '11/24',
    dateLabel: '周二',
    time: '下午',
    stage: '开赛会（线下）',
    summary:
      '规则讲解、评分说明、Agent 实操演示、选题指导、现场组队/结对与答疑；现场可补报名。',
    deliverable: '确认组别、项目起点与成员分工',
  },
  {
    day: '11/26',
    dateLabel: '周四',
    time: '20:00–20:30',
    stage: '线上答疑（第 1 次）',
    summary: '自愿参加；集中回答开发环境、模板改造与选题问题。',
    deliverable: '按需参加',
  },
  {
    day: '11/28',
    dateLabel: '周六',
    time: '20:00 前',
    stage: '中期检查',
    summary: '提交当前可运行截图或 30 秒录屏 + 进度说明；团队须逐人单独说明。',
    deliverable: '中期进度材料',
  },
  {
    day: '11/30–12/3',
    dateLabel: '周一至周四',
    time: '全天',
    stage: '自主开发',
    summary: '线上自由开发，按自己的节奏完善功能与测试。',
    deliverable: '完成核心功能与验证材料',
  },
  {
    day: '12/2',
    dateLabel: '周三',
    time: '20:00–20:30',
    stage: '线上答疑（第 2 次）',
    summary: '自愿参加；重点回答提交材料、部署上线与现场演示准备。',
    deliverable: '按需参加',
  },
  {
    day: '12/4',
    dateLabel: '周五',
    time: '18:00',
    stage: '作品提交截止',
    summary: '提交作品访问方式、2 分钟录屏、1 页作品说明；团队附分工表。项目到此结束。',
    deliverable: '完整作品材料',
  },
  {
    day: '12/5',
    dateLabel: '周六',
    time: '线上',
    stage: '线上评审',
    summary: '评委线上查看材料与作品，形成初评意见；具体安排以选手群通知为准。',
    deliverable: '线上初评意见',
  },
  {
    day: '12/6',
    dateLabel: '周日下午',
    time: '14:00–17:30',
    stage: '线下讲解、Demo 与颁奖',
    summary: '现场讲解 + Demo + 答辩 + 公布成绩并颁奖；每队 5 分钟（3 分钟演示 + 2 分钟提问）。',
    deliverable: '现场讲解、答辩与颁奖',
  },
];

export const scoringGroups: ScoringGroup[] = [
  {
    id: 'starter',
    label: '新手组评分表',
    shortLabel: '新手组',
    tag: '100 分 · 模板改造',
    summary: '适合零基础、首次用 AI 做作品的同学；仅限个人参赛。',
    dimensions: [
      {
        name: '可运行与完成度',
        weight: 40,
        criteria: '模板是否跑通，核心流程是否完整，能否现场演示。',
      },
      {
        name: '改造深度',
        weight: 20,
        criteria: '是否在模板基础上有实质性改造（功能、交互、数据），而非仅换配色或文字。',
      },
      {
        name: '学习与过程记录',
        weight: 20,
        criteria: '中期检查、每日记录、遇到的问题与解决过程是否真实可查。',
      },
      {
        name: 'AI 使用合理性',
        weight: 10,
        criteria: '是否用 AI 完成关键环节，能否解释 AI 产出的内容。',
      },
      {
        name: '展示与表达',
        weight: 10,
        criteria: '5 分钟内能否讲清「做了什么、怎么做的、还差什么」。',
      },
    ],
    tiebreak: '同分时依次比较「可运行与完成度」「改造深度」得分。',
  },
  {
    id: 'open',
    label: '进阶组评分表',
    shortLabel: '进阶组',
    tag: '100 分 · 自由选题',
    summary: '适合有开发或 Agent 使用经验的同学；个人或 ≤2 人团队。',
    dimensions: [
      {
        name: '实际完成度与可用性',
        weight: 30,
        criteria: '核心功能是否真实运行，关键流程是否完整，有无伪造数据。',
      },
      {
        name: '需求与创意',
        weight: 20,
        criteria: '创作目标是否清晰，想法是否有趣、设计是否合理。',
      },
      {
        name: '测试与验证',
        weight: 15,
        criteria: '是否有与作品类型匹配的测试证据，是否识别边界与已知问题。',
      },
      {
        name: 'AI 使用与技术合理性',
        weight: 15,
        criteria: 'AI 在工作流或产品中的角色，技术选择是否适合任务。',
      },
      {
        name: '学习与迭代',
        weight: 15,
        criteria: '赛期解决了哪些困难，是否基于反馈产生可观察改进。',
      },
      {
        name: '展示与表达',
        weight: 5,
        criteria: '是否在规定时间内清晰展示实操，回答是否坦诚准确。',
      },
    ],
    tiebreak: '同分时依次比较「实际完成度与可用性」「测试与验证」得分。',
  },
];

export const scoringExecution = [
  '现场评委组 3–5 人（技术核查评委不少于 1 人、创意体验评委不少于 1 人）；项目评委组 7–10 人，负责材料初评与项目评审。',
  '项目评委组材料初评占 40%，现场评委组 Demo 与答辩占 60%。',
  '各组评委独立打分，取平均分；同分时按两组各自的同分排序规则比较。',
  '技术评委拥有真实性核验权：发现核心功能虚构、静态写死冒充动态系统、旧作未披露直接参赛的，可提请评委组降档或取消评奖资格。',
  '评委本人指导的团队须回避。',
];

export const aiAssistNote =
  '组委会计划使用 AI 工具辅助材料查重与初筛，帮助识别直接搬运的开源项目与明显失真的材料；最终评分由真人评委按两套 100 分评分表独立完成，AI 不直接决定奖项。';

export const awardRows: AwardRow[] = [
  { group: '新手组', title: '一等奖', quantity: '1', reward: '校级证书 + 奖品' },
  { group: '新手组', title: '二等奖', quantity: '2', reward: '校级证书 + 奖品' },
  { group: '新手组', title: '三等奖', quantity: '3', reward: '校级证书 + 奖品' },
  { group: '新手组', title: '最佳新人奖', quantity: '1', reward: '校级证书' },
  { group: '进阶组', title: '一等奖', quantity: '1', reward: '校级证书 + 奖品' },
  { group: '进阶组', title: '二等奖', quantity: '2', reward: '校级证书 + 奖品' },
  { group: '进阶组', title: '三等奖', quantity: '3', reward: '校级证书 + 奖品' },
  { group: '进阶组', title: '最佳创意奖', quantity: '1', reward: '校级证书' },
];

export const awardNotes = [
  '奖项数量可根据实际参赛人数调整，调整前公示；允许奖项空缺。',
  '某组别参赛作品少于 5 件时，组委会可合并评奖。',
  '所有获奖作品须通过真实性核验；获奖者颁发校级证书与奖品。',
  '验收结束后 3 个工作日内公示成绩，公示期 3 个工作日；对成绩有异议可在公示期内向组委会书面提出。',
  '本赛事为校级活动；综测加分最终以各学院认定为准，不作绝对承诺。',
];

export const challengeFaqs: FaqItem[] = [
  {
    question: '完全不会编程、不是计算机专业可以报名吗？',
    answer:
      '可以。新手组明确面向零基础、首次用 AI 做作品的同学，提供 7–10 个可运行模板；你只需要在模板基础上完成至少 1 项有意义的改造。评分不按代码量、算法难度或技术栈复杂度给分。',
  },
  {
    question: '新手组和进阶组怎么选？',
    answer:
      '零基础、第一次用 AI 做作品，选新手组；有开发经验或 Agent 使用经验，选进阶组。报名时自行选择，组委会在报名截止后 3 天内审核；新手组可申请升入进阶组，进阶组不得降入新手组。',
  },
  {
    question: '可以组队吗？',
    answer:
      '新手组仅限个人参赛；进阶组鼓励个人，团队不超过 2 人。3 人及以上团队须在报名时提交书面申请，经组委会审核通过后方可参赛。每人只能加入一个作品，团队须提交每人至少 2 项可验证的具体交付物。',
  },
  {
    question: '可以拿以前做过的项目或开源模板继续改造参赛吗？',
    answer:
      '允许，但须在报名或开赛时披露项目起点与已有完成度。评分只针对赛期（11 月 24 日—12 月 4 日）新增的功能、改进与验证，不把旧项目全部功能计入本次成果；不得将他人现成作品冒充为本次原创成果。',
  },
  {
    question: '可以用哪些 AI 工具？',
    answer:
      '允许并鼓励使用任何符合学校规定与法律法规的 AI 工具，不限定厂商与产品。须在说明文档中简述 AI 承担的环节（需求分析、编码、素材生成、测试等）；不按「是否手写代码」区分高低，不因使用 AI 扣分。',
  },
  {
    question: '作品必须上线公网或解决校园痛点吗？',
    answer:
      '都不强制。作品可以是校园工具、学习效率工具、小游戏、交互体验、可视化或 AI 应用；提交时提供在线链接、代码仓库或本地包三选一即可，评分完全平等。不设外部体验人数门槛，不以拉票量或数据规模决定名次。',
  },
  {
    question: '中期检查没交会怎样？',
    answer:
      '中期检查是轻量节点：提交当前可运行截图或 30 秒录屏 + 进度说明即可。未提交者由组委会约谈；无故缺席且未说明的，取消评奖资格。提交截止后不接受补交或替换材料。',
  },
  {
    question: '作品的版权和展示怎么处理？',
    answer:
      '参赛作品著作权归参赛者所有。组委会有权在活动宣传、成果展示中使用作品截图、简介与演示视频，使用前取得参赛者授权；是否开源、是否公开体验由参赛者自主决定。',
  },
];
