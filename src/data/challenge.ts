import { isSafeExternalUrl } from '../lib/url-guard.mjs';

export interface CompetitionTrack {
  title: string;
  teamRule: string;
  summary: string;
  requirement: string;
}

export interface WorkRequirementItem {
  badge: string;
  title: string;
  text: string;
}

export interface TimelinePhase {
  day: string;
  dateLabel: string;
  time: string;
  stage: string;
  summary: string;
}

export interface ScoringDimension {
  name: string;
  weight: number;
  criteria: string;
}

export interface ScoringGroup {
  id: 'starter' | 'open';
  label: string;
  dimensions: ScoringDimension[];
  tiebreak: string;
}

export interface AwardRow {
  group: '新手组' | '进阶组';
  title: string;
  quantity: string;
  reward: string;
}

export interface RuleSection {
  id: string;
  title: string;
  lead?: string;
  bullets: string[];
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

export const challengeConfig = {
  title: '成都大学第八届网络创新大赛——AI创作挑战赛',
  shortTitle: '第八届网络创新大赛 · AI创作挑战赛',
  eyebrow: '活动',
  statusBadge: '2026年11月24日 – 12月4日',
  subtitle: '用 AI 把一个想法做成可运行、可验证的作品。面向成都大学在读学生，设新手组与进阶组。',
  organizerNote: '由共青团成都大学委员会、成都大学电子信息与电气工程学院主办，成都大学计算机协会承办。',
  updatedOn: '2026-11-20',
  dates: {
    overall: '2026年11月24日 – 2026年12月4日',
    registration: '11 月 21 日 10:00 至 11 月 24 日 10:00（北京时间）',
    briefing: '11 月 24 日下午',
    midterm: '11 月 28 日 20:00 前',
    submission: '12 月 4 日 18:00',
    onlineReview: '12 月 5 日',
    demoDay: '12 月 6 日 14:00–17:30',
    venue: '第十教学楼（具体教室以选手群通知为准）',
  },
  homeBanner: {
    badge: 'AI 创作挑战赛',
    title: '成都大学第八届网络创新大赛——AI创作挑战赛',
    summary: '11/21 10:00 至 11/24 10:00 报名 · 11/24 开赛 · 12/6 线下展示及颁奖',
    ctaLabel: '查看详情与报名',
    href: '/events/',
  },
  registration: {
    opensAt: '2026-11-21T10:00:00+08:00',
    closesAt: '2026-11-24T10:00:00+08:00',
    platform: '腾讯文档',
    url: 'https://docs.qq.com/form/page/DYXhGYXJYQ2V0bnZD',
    qrImage: '/images/events/tencent-docs-registration-qr.png',
    contact: '提交后 24 小时内，组委会通过短信或 QQ 发送确认信息与选手群入口。',
    privacyNotice: '报名信息用于资格核验、赛事通知与组队对接。联系方式与作品公开展示资料分开管理。',
  },
};

export const quickFacts = [
  { label: '线上报名', value: challengeConfig.dates.registration },
  { label: '赛期', value: challengeConfig.dates.overall },
  { label: '参赛对象', value: '成都大学在读本科生和研究生，专业、年级不限' },
  { label: '组别', value: '新手组 / 进阶组，分别评奖' },
  { label: '线下展示及颁奖', value: challengeConfig.dates.demoDay },
];

export const competitionTracks: CompetitionTrack[] = [
  {
    title: '新手组',
    teamRule: '个人参赛',
    summary: '适合零基础或第一次用 AI 做作品的同学。',
    requirement: '选一个组委会提供的模板，跑通后做至少一项实质改进。',
  },
  {
    title: '进阶组',
    teamRule: '个人或 2 人团队',
    summary: '适合有开发经验或用过 Agent 的同学。',
    requirement: '自由选题，交付至少一项可现场运行的核心功能。',
  },
];

export const workRequirements: WorkRequirementItem[] = [
  {
    badge: '功能',
    title: '至少一项可验证的功能',
    text: '评委能实际操作或复现核心流程。纯 PPT、静态效果图或无法验证的录屏不足以作为参赛作品。',
  },
  {
    badge: '交付',
    title: '提供可运行的作品与说明',
    text: '在线链接、代码仓库或本地运行包任选一种，并说明运行方式和已知限制。',
  },
  {
    badge: '原创',
    title: '说明项目起点与赛期增量',
    text: '允许使用模板、AI 或继续自己的旧项目。需说明已有内容、赛期新增成果及 AI 用途。',
  },
];

export const finalDeliverables = [
  '作品访问或运行方式',
  '2 分钟演示录屏',
  '1 页作品说明',
  '团队分工表（团队提交）',
];

export const timelinePhases: TimelinePhase[] = [
  {
    day: '11/21',
    dateLabel: '周六',
    time: '10:00',
    stage: '报名启动',
    summary: '腾讯文档报名表上线；可个人报名，也可按规则提交团队报名。',
  },
  {
    day: '11/24',
    dateLabel: '周二',
    time: '10:00',
    stage: '报名截止',
    summary: '线上报名截止，信息补正与现场补报名安排以组委会通知为准。',
  },
  {
    day: '11/24',
    dateLabel: '周二',
    time: '下午',
    stage: '开赛会（线下）',
    summary:
      '规则讲解、评分说明、Agent 实操演示、选题指导、现场组队、结对与答疑。',
  },
  {
    day: '11/26',
    dateLabel: '周四',
    time: '20:00–20:30',
    stage: '线上答疑（第 1 次）',
    summary: '自愿参加；集中回答开发环境、模板改造与选题问题。',
  },
  {
    day: '11/28',
    dateLabel: '周六',
    time: '20:00 前',
    stage: '中期检查',
    summary: '提交当前可运行截图或 30 秒录屏 + 进度说明；团队须逐人单独说明。',
  },
  {
    day: '11/30–12/3',
    dateLabel: '周一至周四',
    time: '全天',
    stage: '自主开发',
    summary: '线上自由开发，按自己的节奏完善功能与测试。',
  },
  {
    day: '12/2',
    dateLabel: '周三',
    time: '20:00–20:30',
    stage: '线上答疑（第 2 次）',
    summary: '自愿参加；重点回答提交材料、部署上线与现场演示准备。',
  },
  {
    day: '12/4',
    dateLabel: '周五',
    time: '18:00',
    stage: '作品提交截止',
    summary: '提交作品访问方式、2 分钟录屏和 1 页作品说明，团队另附分工表。',
  },
  {
    day: '12/5',
    dateLabel: '周六',
    time: '线上',
    stage: '线上评审',
    summary: '评委线上查看材料与作品，形成初评意见；具体安排以选手群通知为准。',
  },
  {
    day: '12/6',
    dateLabel: '周日下午',
    time: '14:00–17:30',
    stage: '线下讲解、Demo 与颁奖',
    summary: '现场讲解 + Demo + 答辩 + 公布成绩并颁奖；每队 5 分钟（3 分钟演示 + 2 分钟提问）。',
  },
];

export const scoringGroups: ScoringGroup[] = [
  {
    id: 'starter',
    label: '新手组评分表',
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
  { group: '新手组', title: '一等奖', quantity: '1', reward: '证书及奖品' },
  { group: '新手组', title: '二等奖', quantity: '2', reward: '证书及奖品' },
  { group: '新手组', title: '三等奖', quantity: '3', reward: '证书及奖品' },
  { group: '新手组', title: '最佳新人奖', quantity: '1', reward: '证书' },
  { group: '进阶组', title: '一等奖', quantity: '1', reward: '证书及奖品' },
  { group: '进阶组', title: '二等奖', quantity: '2', reward: '证书及奖品' },
  { group: '进阶组', title: '三等奖', quantity: '3', reward: '证书及奖品' },
  { group: '进阶组', title: '最佳创意奖', quantity: '1', reward: '证书' },
];

export const awardNotes = [
  '奖项数量可根据实际参赛人数调整，调整前公示；允许奖项空缺。',
  '某组别参赛作品少于 5 件时，组委会可合并评奖。',
  '所有获奖作品须通过真实性核验。证书级别与综测认定以最终通知为准。',
  '验收结束后 3 个工作日内公示成绩，公示期 3 个工作日；对成绩有异议可在公示期内向组委会书面提出。',
];

export const ruleSections: RuleSection[] = [
  {
    id: 'positioning',
    title: '一、赛事定位与承办说明',
    lead: challengeConfig.organizerNote,
    bullets: [
      '面向成都大学在读本科生和研究生。参赛作品围绕真实可运行、可演示的数字成果展开。',
      '不设统一命题，新手可从模板起步。活动期间提供学习指南、工具资源与答疑。',
    ],
  },
  {
    id: 'registration-and-teams',
    title: '二、组别与组队规则',
    bullets: [
      `腾讯文档线上报名时间为 ${challengeConfig.dates.registration}。${challengeConfig.registration.contact}`,
      ...competitionTracks.map((track) => `${track.title} · ${track.teamRule}。${track.requirement}`),
      '进阶组如需 3 人及以上组队，须在报名时书面申请，经组委会审核。每人只能参与一件作品，每位团队成员须有至少 2 项可验证交付物。',
      '报名时自行选组。新手组可申请升入进阶组，进阶组不得降入新手组。',
    ],
  },
  {
    id: 'work-requirements',
    title: '三、作品形式与提交材料',
    lead: '提交能够验证核心功能的作品，并写清如何运行与演示。',
    bullets: [
      ...workRequirements.map((item) => item.text),
      `提交材料包括${finalDeliverables.join('、')}。作品说明应包含已实现功能、项目起点、关键依赖、AI 使用方式与已知问题。`,
      '在线链接须能在未登录的无痕窗口中访问，有效期覆盖至 12 月 8 日。核心功能展示头图可作为说明素材，是否列为必交材料以组委会通知为准。',
    ],
  },
  {
    id: 'schedule-and-exemptions',
    title: '四、赛程安排与线下交流',
    lead: `赛期为 ${challengeConfig.dates.overall}。答疑和中期检查安排见活动主页时间线。`,
    bullets: [
      `${challengeConfig.dates.briefing}线下开赛会，讲解赛制并安排选题、实操演示与答疑。`,
      `中期进度材料于 ${challengeConfig.dates.midterm}提交。作品提交于 ${challengeConfig.dates.submission}截止。`,
      `${challengeConfig.dates.onlineReview}线上评审。${challengeConfig.dates.demoDay}在${challengeConfig.dates.venue}举行线下展示与颁奖，每队 3 分钟演示、2 分钟答辩。`,
    ],
  },
  {
    id: 'audit-and-anticheat',
    title: '五、真实性核验与反抄袭',
    bullets: [
      '禁止直接搬运他人作品或把已有项目冒充赛期成果。旧项目须披露已有进度，必要时复核提交记录，以赛期内可验证的增量为评价依据。',
      '说明示例数据、外部接口与功能限制。提交材料与作品展示中不得暴露 API 密钥、个人隐私或受限数据。',
    ],
  },
  {
    id: 'judging-and-awards',
    title: '六、评分标准与奖项',
    lead: '两组各用一套 100 分评分表。现场评委与项目评委分别评审，评分以组委会最终公示为准。',
    bullets: [...scoringExecution, aiAssistNote],
  },
  {
    id: 'rights-and-privacy',
    title: '七、作品权益与信息保护',
    bullets: [
      '参赛作品著作权归参赛者或团队。组委会在获得授权后可用于赛事成果展示。',
      challengeConfig.registration.privacyNotice,
    ],
  },
];
