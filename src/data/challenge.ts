import { isSafeExternalUrl } from '../lib/url-guard.mjs';

export type EntryStatus = 'upcoming' | 'open' | 'closed';

export interface ExternalEntry {
  id: string;
  code: string;
  stageLabel: string;
  title: string;
  dateLabel: string;
  status: EntryStatus;
  /** 外部表单链接（如飞书表单 URL）。留空时页面自动显示待开放状态，不输出无效链接。 */
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
  stage: string;
  summary: string;
  deliverable: string;
}

export interface ScoringDimension {
  name: string;
  weight: number;
  criteria: string;
}

export interface AwardItem {
  title: string;
  reward: string;
  badge: string;
  description: string;
  independent?: boolean;
}

export interface RuleSection {
  id: string;
  title: string;
  lead?: string;
  bullets: string[];
  note?: string;
}

export interface IdeaTier {
  level: string;
  tag: string;
  tone: 'brand' | 'sky' | 'warn';
  examples: string;
  tip: string;
}

export interface IdeaDirection {
  title: string;
  subtitle: string;
  examples: string[];
  icon: 'palette' | 'wrench' | 'book-open' | 'spark' | 'compass' | 'layers';
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
 * ============================================================================
 * 赛事统一配置区（正式发版 / 赛程推进时，只需更新以下配置即可全站生效）
 * ============================================================================
 */
export const challengeConfig = {
  title: '成都大学首届 AI 创作挑战赛',
  shortTitle: '首届 AI 创作挑战赛',
  eyebrow: '活动 · 首届赛事',
  statusBadge: '筹备发布 · 日期待定',
  subtitle:
    '面向成都大学各专业同学的限时数字创作赛事。不要求编程基础、不限制专业、不强制命题，在 14 天内借助 AI 将想法做成可运行、可体验的真实作品。',
  organizerNote: '由成都大学计算机协会 AI 方向发起筹备，非学校官方平台。',
  updatedOn: '2026-11-20',

  /** 关键日期占位：确认后直接替换「待定」即可 */
  dates: {
    overall: '待定（14 天赛期）',
    registration: '待定',
    teamConfirm: '待定（开赛前截止）',
    kickoff: '待定（D1）',
    midterm: '待定（D7）',
    submission: '待定（D11–D12）',
    correction: '待定（D12 截止后 2–4 小时）',
    preliminary: '待定（D13）',
    demoDay: '待定（D14）',
    venue: '待定（校内线下场地）',
  },

  /** 首页顶部横幅提示 */
  homeBanner: {
    badge: '首届赛事',
    title: '成都大学首届 AI 创作挑战赛',
    summary: '不限专业、零编程基础可参与，1–2 人组队，14 天用 AI 做出真实可运行作品（活动日期待定）',
    ctaLabel: '查看详情与报名',
    href: '/events/',
  },

  /**
   * 报名入口配置（计划使用飞书外部表单）
   * 使用方法：将 url 替换为真实飞书表单地址（https://...），并将 status 改为 'open' 即可激活跳转。
   */
  registration: {
    platform: '飞书表单',
    intentForm: {
      id: 'intent-registration',
      code: '阶段 A',
      stageLabel: '意向报名（个人可先报）',
      title: '前往飞书填写意向报名表',
      dateLabel: '开放时间：待定',
      status: 'upcoming' as EntryStatus,
      url: '',
      buttonLabel: '前往飞书填写报名表',
      pendingLabel: '飞书报名入口待开放',
      closedLabel: '意向报名已截止',
      collects: '姓名、学院与年级、常用联系方式、当前组队情况（选填：感兴趣方向、开发经验、期望队友）',
      purpose: '先入场再成队：还没想好点子、没有队友都可以先报名进群。',
      highlight: '无需提交项目策划书、GitHub 账号或 API 使用计划。',
    } satisfies ExternalEntry,
    teamConfirmForm: {
      id: 'team-confirmation',
      code: '阶段 B',
      stageLabel: '正式组队确认（开赛前截止）',
      title: '正式组队确认与编号发放',
      dateLabel: '截止时间：待定',
      status: 'upcoming' as EntryStatus,
      url: '',
      buttonLabel: '前往飞书确认组队',
      pendingLabel: '组队确认入口待开放',
      closedLabel: '组队确认已截止',
      collects: '最终 1–2 人成员名单、双人队指定 1 名队长作为主要联系人',
      purpose: '确认参赛资格，由组委会统一发放唯一队伍编号（如 CDUAI-001），作为全赛程提交主键。',
    } satisfies ExternalEntry,
    privacyNotice:
      '报名通过外部飞书表单收集，仅用于赛事通知、资格核对与组队对接。个人联系方式与后续公开展示的作品资料分表隔离，未经本人同意不对外公开。',
  },

  /**
   * 赛事交流群二维码配置
   * 使用方法：将二维码图片放到 public/images/events/challenge-group-qr.png，
   * 然后把下方 qrImage 改为 '/images/events/challenge-group-qr.png' 即可显示。
   */
  communityGroup: {
    title: '赛事通知与组队交流群',
    platform: 'QQ / 微信交流群',
    qrImage: '',
    qrAlt: '成都大学首届 AI 创作挑战赛交流群二维码',
    groupIdText: '待公布',
    description: '用于发布赛程时间确认通知、飞书报名与提交链接、自由寻找队友以及赛期答疑交流。',
    placeholderHint: '群二维码待补充，确认后将在此直接展示',
  },
};

export const quickFacts = [
  { label: '活动日期', value: challengeConfig.dates.overall },
  { label: '参赛规模', value: '8–15 支队伍（校内首届）' },
  { label: '队伍人数', value: '1–2 人（鼓励单人参赛）' },
  { label: '参与门槛', value: '不限专业，不要求编程基础' },
  { label: '开发机制', value: '线上自由开发 + 线下 Demo Day' },
  { label: '线下场地', value: challengeConfig.dates.venue },
];

export const coreHighlights = [
  {
    icon: 'sprout' as const,
    title: '允许新手，不限专业',
    description:
      '不要求先会写代码，也不按手写代码比例或技术栈复杂度打分。借助 AI Agent 完成人生第一个可运行的数字作品同样有竞争力。',
  },
  {
    icon: 'compass' as const,
    title: '自由选题，不强制命题',
    description:
      '小游戏、效率工具、学习辅助、交互艺术或实用应用均可平等参赛。不强制解决校园痛点，也不要求对接教务等非公开校内系统。',
  },
  {
    icon: 'target' as const,
    title: '作品优先，拒绝纯 PPT',
    description:
      '至少交付一项可现场运行或可复现验证的实际功能。允许原型不完整、界面朴素，但只有 PPT、效果图或不可验证视频不能参与主赛评奖。',
  },
];

export const workCategories = [
  {
    code: 'A 类',
    title: 'AI 辅助开发作品',
    summary: '用 AI 工具把作品做出来，作品本身不必接入大模型 API。',
    examples: '网页应用、桌面软件、自动化脚本、小游戏、数据可视化或个人实用小工具。',
    note: 'AI 辅助开发是正当的创作方式，不按“是否手写代码”区分价值。',
  },
  {
    code: 'B 类',
    title: '具有 AI 功能的作品',
    summary: '将大模型、语音、图像识别或其他 AI 能力集成到作品功能中。',
    examples: '智能内容处理、多模态交互应用、Agent 工作流或特定场景的 AI 助手原型。',
    note: '两类作品在主赛中完全平等，不会仅因“接入了大模型”获得额外加分。',
  },
];

export const admissionSteps = [
  {
    code: '阶段 A',
    title: '意向报名',
    timing: challengeConfig.dates.registration,
    text: '面向个人开放。没有项目点子、还没找到队友都可以先通过飞书表报名并加入交流群。',
  },
  {
    code: '阶段 B',
    title: '正式组队确认',
    timing: challengeConfig.dates.teamConfirm,
    text: '确认最终 1–2 人名单（双人队指定 1 名队长），组委会核验后分配唯一队伍编号（如 CDUAI-001）。',
  },
  {
    code: '阶段 C',
    title: 'D1 项目起点登记',
    timing: challengeConfig.dates.kickoff,
    text: '开赛当天登记选题方向、成员初步分工与既有项目基础（如有），作为后续“赛期增量评价”的基线。',
  },
];

export const registrationFieldsPreview = [
  { name: '姓名', required: true, note: '校内身份识别' },
  { name: '学院与年级', required: true, note: '基础统计与校内参赛资格核对' },
  { name: '常用联系方式', required: true, note: 'QQ / 微信，用于赛事通知与拉群' },
  { name: '当前组队情况', required: true, note: '个人参赛 / 已有队友 / 希望寻找队友' },
  { name: '感兴趣的创作方向', required: false, note: '用于自愿组队匹配参考' },
  { name: '项目开发经验', required: false, note: '仅用于统计与匹配，不影响评分' },
  { name: '期望队友方向', required: false, note: '仅面向希望寻找队友的同学' },
];

export const teamRuleSummary = [
  '每队 1–2 人，鼓励个人参赛；双人队不会因人数更多而获得更高的基准评价。',
  '每人仅允许加入 1 支队伍，严禁跨队挂名或兼职开发；所有成员须有明确交付分工。',
  '阶段 B 截止前允许自由组队或拆分；确认后原则上锁定名单，赛中若有一人退赛，另一人可保留原编号以单人队继续完赛。',
  '寻找队友的匹配完全自愿，匹配未成功默认转为个人参赛；未经本人同意不公开私人联系方式。',
];

/**
 * 作品提交入口配置（目前暂定，保留三阶段独立表单结构与信息）
 * 使用方法：各节点开放前填入对应外部表单 url，并将 status 改为 'open'。
 */
export const submissionForms: ExternalEntry[] = [
  {
    id: 'form-d1-baseline',
    code: '表 1 · D1',
    stageLabel: '开赛起点登记',
    title: '项目起点登记表',
    dateLabel: challengeConfig.dates.kickoff,
    status: 'upcoming',
    url: '',
    buttonLabel: '填写起点登记表',
    pendingLabel: '提交入口暂定',
    closedLabel: '起点登记已截止',
    collects: '唯一队伍编号、选题名称、成员初步分工、既有项目/代码基础（如有则附链接或截图）、赛期计划新增内容。',
    purpose: '建立增量评价基线，明确区分旧项目原有功能与本次赛期新增工作。',
  },
  {
    id: 'form-d7-midterm',
    code: '表 2 · D7',
    stageLabel: '中期轻量节点',
    title: '中期进度提交表',
    dateLabel: challengeConfig.dates.midterm,
    status: 'upcoming',
    url: '',
    buttonLabel: '提交中期进度',
    pendingLabel: '提交入口暂定',
    closedLabel: '中期提交已截止',
    collects: '唯一队伍编号、当前已完成功能简述、最小可运行原型（MVP）截图或 15 秒操作录屏、遇到的主要困难。',
    purpose: '验证开发真实过程，留足下半程测试与迭代时间。',
    highlight: 'D7 不设硬性淘汰：尚未做出完整 MVP 也须如实提交当前进度与卡点，保留继续开发与参评资格。',
  },
  {
    id: 'form-d12-final',
    code: '表 3 · D11–D12',
    stageLabel: '最终作品交付',
    title: '最终作品提交表',
    dateLabel: challengeConfig.dates.submission,
    status: 'upcoming',
    url: '',
    buttonLabel: '提交最终作品',
    pendingLabel: '提交入口暂定',
    closedLabel: '作品提交已截止',
    collects: '唯一队伍编号、2 页以内项目说明文档、实际运行入口、操作演示视频、测试与验证证据、最终成员交付分工。',
    purpose: '作为 D13 线上初评与真实性核验的主要依据。截止前允许重复提交覆盖，以最后一次为准。',
  },
];

export const finalDeliverables = [
  {
    title: '项目说明文档',
    badge: '必填 · 建议 ≤ 2 页',
    text: 'PDF 或 Markdown。写清创作目标、核心功能、运行方式、开赛起点与赛期增量、AI 使用方式、成员具体分工、测试验证情况及已知限制。',
  },
  {
    title: '实际运行材料',
    badge: '必填 · 任选其一',
    text: '网页应用提供在线访问链接（及必要测试账号）；桌面软件/游戏提供安装包或压缩包链接 + 运行说明；本地依赖项目提供代码仓库 + 复现步骤或说明 D14 现场自带设备演示。',
  },
  {
    title: '简短操作演示视频',
    badge: '强烈建议 · 1–3 分钟',
    text: '帮助评委在 D13 快速预览核心流程，并作为现场突发网络/设备故障时的辅助参考；视频不能替代实际运行验收。',
  },
  {
    title: '测试与验证证据',
    badge: '必填 · 按类型自选',
    text: '功能测试用例、边界测试记录、性能/效果对照、交互试玩反馈等均可，不强制外部真人用户试用或固定人数门槛。',
  },
];

export const notRequiredItems = [
  '不需要商业计划书或融资测算',
  '不强制提交完整 AI 对话或提示词记录',
  '不强制开源整个项目代码',
  '不强制公开部署到公网服务器',
];

export const submissionRedlines = [
  '唯一主键关联：三张独立表单统一通过「唯一队伍编号（如 CDUAI-007）」串联，请勿填错编号。',
  '入口与大文件分离：表单主要收集说明与外部访问链接（网页地址、合规网盘、代码仓库等），请确保链接在评审彻底结束前持续有效。',
  '安全与隐私红线：严禁在提交材料、代码或测试账号中泄露 API 密钥、个人密码、他人隐私或未经授权的数据。',
  '材料补正窗口：D12 正式截止后设 2–4 小时统一补正窗口，仅限修复链接失效、提取码错误、文件损坏或必填项漏填，严禁借此新增功能或大幅修改代码。',
];

export const timelinePhases: TimelinePhase[] = [
  {
    day: '赛前',
    dateLabel: challengeConfig.dates.registration,
    stage: '意向报名与组队确认',
    summary: '开放飞书意向报名并拉入交流群；可自由寻找队友。开赛前完成 1–2 人正式组队确认并领取唯一队伍编号。',
    deliverable: '意向报名表 · 组队确认 · 唯一队伍编号',
  },
  {
    day: '第 1 天（D1）',
    dateLabel: challengeConfig.dates.kickoff,
    stage: '开幕启动与起点登记',
    summary: '发布赛事规则提醒与评分表说明，各队确认分工、既有项目起点及赛期计划新增内容。',
    deliverable: '提交表 1：项目起点登记表',
  },
  {
    day: '第 2–7 天',
    dateLabel: challengeConfig.dates.midterm,
    stage: '上半程自由开发（搭建 MVP）',
    summary: '线上自由开发，完成需求拆解与最小可运行原型（MVP）。第 7 天提交轻量进度记录，不设淘汰。',
    deliverable: '提交表 2：中期进度提交表（截图或 15 秒录屏）',
  },
  {
    day: '第 8–10 天',
    dateLabel: '赛期第 8–10 天（待定）',
    stage: '下半程迭代与测试验证',
    summary: '完善核心功能，根据作品类型开展功能测试、边界验证、交互试玩或实验对照，记录发现的问题与改动。',
    deliverable: '沉淀测试证据与迭代改动记录',
  },
  {
    day: '第 11–12 天',
    dateLabel: challengeConfig.dates.submission,
    stage: '最终交付与材料补正',
    summary: '整理 2 页说明文档、运行环境与验证材料并正式提交；截止后设 2–4 小时补正窗口仅用于修复坏链与漏填。',
    deliverable: '提交表 3：最终作品提交表',
  },
  {
    day: '第 13 天（D13）',
    dateLabel: challengeConfig.dates.preliminary,
    stage: '评委线上初评与预核验',
    summary: '评委上手实测提交作品、核对 D1/D7 增量记录、提前预警运行故障，形成除“展示与表达”外的 95 分内部参考初评。',
    deliverable: '不出最终排名 · 符合最低标准全员进入 Demo Day',
  },
  {
    day: '第 14 天（D14）',
    dateLabel: challengeConfig.dates.demoDay,
    stage: '全员线下 Demo Day 与颁奖',
    summary: '全员上台实操演示（每队 5 分钟）、Open Demo 自由体验集市与贴纸投票、评委闭门定分并现场颁奖。',
    deliverable: '公布主赛获奖、最佳探索奖与现场最受欢迎奖',
  },
];

export const demoDaySessions = [
  {
    step: '01',
    title: '全员上台实操演示',
    duration: '每队 5 分钟（3 分钟实操 + 2 分钟提问）',
    text: '满足最低交付标准的队伍全员入围、不中途淘汰。PPT 不超过 3 页（可不用 PPT），开场 60 秒内必须切入真实可运行界面操作。',
  },
  {
    step: '02',
    title: '自由体验集市（Open Demo）',
    duration: '约 30–40 分钟',
    text: '所有队伍在桌面展开设备，评委与观众走动式上手试玩、输入临时测试数据面对面交流；同步开展「现场最受欢迎奖」实体贴纸投票。',
  },
  {
    step: '03',
    title: '评委闭门终评定分',
    duration: '约 20–30 分钟',
    text: '评委结合现场实操与问答坦诚度，补填「展示与表达（5 分）」并对 D13 的 95 分初评做必要微调，取无利益冲突评委有效平均分锁定结果。',
  },
  {
    step: '04',
    title: '现场颁奖与复盘合影',
    duration: '约 15 分钟',
    text: '现场公布主赛一二三等奖、最佳探索奖与现场最受欢迎奖，颁发证书/奖品并合影留念。',
  },
];

export const scoringDimensions: ScoringDimension[] = [
  {
    name: '实际完成度与可用性',
    weight: 30,
    criteria: '核心功能是否真实运行，关键流程是否完整，操作是否可复现，有无伪造数据或纯静态冒充动态能力。',
  },
  {
    name: '需求与创意',
    weight: 20,
    criteria: '创作目标是否清晰，是否体现有趣的想法、合理的设计、实际用途或独特表达；不局限于现实痛点。',
  },
  {
    name: '测试与验证',
    weight: 15,
    criteria: '是否采用与作品类型匹配的验证方法，测试证据是否可信，是否识别边界及已知问题。',
  },
  {
    name: 'AI 使用与技术合理性',
    weight: 15,
    criteria: 'AI 在工作流或产品中承担什么角色，技术选择是否适合任务，能否解释关键取舍。',
  },
  {
    name: '学习与迭代',
    weight: 15,
    criteria: '活动期间解决了哪些困难，是否基于测试或反馈产生可观察的改进（结合 D1/D7 过程记录互证）。',
  },
  {
    name: '展示与表达',
    weight: 5,
    criteria: '是否在规定时间内清晰展示实操，回答评委问题是否坦诚准确（D14 现场补填）。',
  },
];

export const tiebreakerNote =
  '若两支队伍最终总分完全相同，按以下维度得分从高到低依次排序：① 实际完成度与可用性（30 分）→ ② 测试与验证（15 分）→ ③ 学习与迭代（15 分）；仍相同则由评委组闭门投票决定。';

export const awardsList: AwardItem[] = [
  {
    title: '一等奖',
    reward: '300 元',
    badge: '主赛奖项',
    description: '综合 100 分评审表现最优，实际可运行功能扎实、验证可信、迭代清晰的作品。',
  },
  {
    title: '二等奖',
    reward: '200 元',
    badge: '主赛奖项',
    description: '核心功能真实可用、设计合理且完整走完开发与验证流程的优秀作品。',
  },
  {
    title: '三等奖',
    reward: '100 元',
    badge: '主赛奖项',
    description: '明确达成创作目标、展现良好 AI 协作与实践交付能力的参赛作品。',
  },
  {
    title: '最佳探索奖',
    reward: '100 元',
    badge: '专项鼓励',
    description: '偏向在赛期主动尝试、攻克具体困难、通过适当测试形成实质改进的队伍（仍须有可观察成果）。',
  },
  {
    title: '现场最受欢迎奖',
    reward: '独立荣誉奖',
    badge: '零加分 · 实体贴纸投票',
    description:
      '仅限 D14 线下签到入场的观众与选手使用 2–3 张实体贴纸现场投票（不可投给自己）。完全独立于主赛 100 分评审，不折算任何加分。',
    independent: true,
  },
];

export const judgeGuardrails = [
  {
    title: '统一评分表',
    text: '3–5 名以高年级实战学生为主的评委（可特邀 1 名教师顾问）共用同一张 100 分评分表，不割裂拆分打分。',
  },
  {
    title: '集体裁决真实性',
    text: '对造假、纯静态冒充动态或未披露旧作的质疑，须由评委组与组委会共同合议裁决，不得由单名评委取消资格，并保留申辩机会。',
  },
  {
    title: '赛前公开评委履历',
    text: '开赛前向全体参赛者公示评委名单及其过往项目、技术或设计背景，确保透明可信。',
  },
  {
    title: '硬性利益冲突回避',
    text: '与某队存在直系亲友、同寝室、同项目组共同开发或赛中深度帮调代码的评委，必须主动申报并回避该队评分。',
  },
  {
    title: '赛前试评校准尺度',
    text: 'D13 正式评审前使用 2–3 个不同类型的模拟作品做内部试评，对齐各分数段松紧度，减少打分方差。',
  },
];

export const challengeFaqs: FaqItem[] = [
  {
    question: '完全不会编程、不是计算机专业可以报名吗？',
    answer:
      '完全可以。首届赛事明确不要求编程基础、不限制专业，评分也不按手写代码比例或技术栈复杂程度给分。你可以借助 AI Agent 完成网页小工具、交互演示或小游戏，只要核心功能能真实运行并坦诚说明实现边界即可。',
  },
  {
    question: '现在还没想好做什么、也没有队友，可以先报名吗？',
    answer:
      '可以。报名分为「阶段 A 意向报名」和「阶段 B 正式组队确认」两步。意向报名面向个人开放，不需要提交项目策划书或 GitHub 账号；进群后可以自由寻找队友，也完全欢迎单人参赛。',
  },
  {
    question: '可以拿以前做过的项目或开源模板继续改造参赛吗？',
    answer:
      '允许，但必须在 D1「项目起点登记表」中如实披露原有功能、来源和初始状态。正式评审只评价比赛 14 天内完成的新增功能、改进与验证，不把旧项目原有成果计入本次成绩。',
  },
  {
    question: '作品必须解决校园痛点、接入教务系统或拉很多人试用吗？',
    answer:
      '都不强制。个人兴趣、小游戏、效率工具、学科可视化或技术实验均可平等参赛；严禁未经授权接入校内非公开系统，允许使用本地数据或明确标注的模拟数据；测试验证方式由作品类型决定，不设外部体验人数门槛，不拼拉票。',
  },
  {
    question: '如果第 7 天还没做出完整 MVP，会被直接淘汰吗？',
    answer:
      '不会。D7 中期节点用于帮助队伍把握节奏和留存过程证据，不设硬性淘汰。若尚未做出完整 MVP，如实提交当前进度与卡点即可继续参赛（过程完整度会客观反映在「学习与迭代」维度中）。',
  },
  {
    question: '作品提交后，版权和开源怎么算？',
    answer:
      '参赛作品的所有权归参赛团队所有。主办方仅在经团队同意后获取项目介绍、截图或体验链接的展示授权，不取得所有权或商业使用权；是否开源、是否开放公众试用均由参赛者自主选择。',
  },
];

/**
 * 完整赛事细则（/events/rules/）章节数据
 * 每个章节的 id 与 title 同步生成右侧 ArticleToc 目录和站内搜索索引。
 */
export const ruleSections: RuleSection[] = [
  {
    id: 'positioning',
    title: '一、赛事定位与基本参数',
    lead: '本赛事是一场实践与学习导向的校园限时创作赛事，不是创业融资竞赛，也不是以算法研究难度、代码量或商业壁垒为核心的技术选拔赛。',
    bullets: [
      '举办范围与规模：面向成都大学校内各专业学生，首届拟定 8–15 支队伍（是否开放校外观摩另行通知）。',
      '参赛形式：每队 1–2 人，鼓励单人参赛；不限制专业，不要求编程基础。',
      '赛期与场地：建议 14 天赛程（线上自由开发含中期节点 + 线下 Demo Day 展示与体验）。当前具体日历日期与线下场地均处于「待定」状态，确认后将在本页与交流群同步公布。',
      '工具中立原则：允许自由选择符合学校规定与法律法规的 AI 工具、平台与开发方式，不强制使用指定厂商产品或指定教程。',
    ],
  },
  {
    id: 'registration-and-teams',
    title: '二、报名准入与组队管理规则',
    lead: '为降低新手心理门槛，报名与准入拆分为「阶段 A 意向报名 → 阶段 B 正式组队确认 → 阶段 C D1 项目起点登记」三步。',
    bullets: [
      '意向报名（飞书表单）：面向个人开放，无项目方向或无队友均可先报名入群；不要求提交策划书、GitHub 账号或 API 计划。',
      '正式组队确认与唯一编号：开赛前截止确认最终 1–2 人名单，双人队指定 1 名队长对接通知与提交；组委会审核后分配唯一队伍编号（格式如 CDUAI-001），两名成员享有同等参赛与获奖资格。',
      '人数与防挂名：每人仅允许加入 1 支队伍，严禁跨队挂名或兼职开发；不强制“技术 + 非技术”搭配，但 D1 登记与结项说明必须明确每位成员的具体交付内容。双人队不会因人数更多而获得高于个人队的基准评价。',
      '自愿匹配与隐私保护：寻找队友的同学可在群内自由双选，组委会不保证一定匹配成功，未匹配成功默认转为个人参赛；未经本人同意严禁公开私人联系方式。',
      '成员锁定与变动：阶段 B 截止前允许自由调整；确认后原则上锁定名单，特殊情况须书面申请。双人队赛中如有一人退赛，剩余成员可保留原队伍编号以单人队身份继续完赛。',
    ],
  },
  {
    id: 'scope-and-mvp',
    title: '三、作品范围与最低交付标准',
    lead: '首届以数字应用和交互作品为主，不设硬件主赛道；A 类（AI 辅助开发）与 B 类（具有 AI 功能）在主赛中平等参赛。',
    bullets: [
      '自由选题原则：不设置统一命题，不以商业价值、技术复杂程度、校园关联性或社会影响力作为必要条件。',
      '可观察的实际功能：主赛评奖作品须至少具备一项与项目目标相关的功能，能够现场运行或经评委复现验证。',
      '清晰的运行方式：须提供在线访问链接、可执行程序/安装包、可复现本地运行步骤或可操作的本地演示环境之一。',
      '真实的功能边界：须如实说明哪些功能已实现、哪些仅为设想、哪些依赖模拟数据或第三方服务，不得将静态展示或模拟数据包装为不存在的实时动态能力。',
      '非合格主赛作品处理：允许原型不完整、外观朴素或存在已知缺陷；但只有 PPT、静态效果图或无法验证的演示视频，不具备主赛 100 分评奖资格（如现场时间充裕，可安排非竞赛性创意交流展示）。',
      '现场故障个案处理：确因 Demo Day 现场网络或设备突发故障无法演示的作品，组委会将结合赛前提交的可复现证据、备用环境与评委补测做个案处理，不以单一视频自动替代可运行验收。',
    ],
  },
  {
    id: 'incremental-and-checkpoints',
    title: '四、旧项目参赛与过程检查规则',
    lead: '允许基于已有代码库、开源框架、模板或个人旧作继续开发，但正式评审仅评价比赛 14 天内的新增成果与验证质量。',
    bullets: [
      'D1 起点披露：凡使用既有项目、代码或模板的队伍，须在 D1「项目起点登记表」中写明原有功能与完成度、来源链接或截图，以及本次赛期计划新增或改进的功能。',
      'D7 中期轻量检查：第 7 天提交最小可运行原型（MVP）截图或 15 秒操作录屏。该节点旨在防止拖延并留存过程证据，不设硬性淘汰；尚未做出完整 MVP 也须如实提交当前进度与卡点，其完整度客观反映在「学习与迭代」评分中。',
      '轻量核验边界：不强制所有队伍使用 GitHub，也不要求公开完整 AI 对话或商业敏感信息；必要时由技术背景评委开展针对性核查。',
    ],
  },
  {
    id: 'compliance-and-integrity',
    title: '五、数据合规、安全与诚信底线',
    bullets: [
      '优先独立实现：鼓励使用本地数据、自建数据、已获授权数据或合法公开资源；允许接入第三方 API，但访问权限、额度、费用与网络稳定性由团队自行评估，主办方不提供接口。',
      '校园内部系统红线：不以接入教务、校园卡、场地预约等非公开校内系统作为门槛或评分优势；严禁未经授权绕过访问控制或抓取受限数据。',
      '允许规范使用模拟数据：可用合成数据、示例数据或受控测试环境验证原型，但须明确披露用途与边界，不得冒充真实实时服务。',
      '严禁敏感信息泄露：提交材料、公开链接或代码仓库中不得包含明文 API 密钥、账号密码、他人隐私或未获授权的组织内部数据。',
      '原创与诚信要求：允许使用符合许可协议的第三方依赖与开源代码并说明关键来源；严禁将他人现成作品冒充本次原创成果，严禁伪造运行结果、测试反馈或开发证据。',
    ],
  },
  {
    id: 'submission-rules',
    title: '六、作品投稿与材料补正细则',
    lead: '本赛事不自建复杂后台，统一通过现成在线表单在 D1、D7、D11–D12 三个节点收集材料，全流程以唯一队伍编号串联。',
    bullets: [
      '最终提交四项材料（表 3）：① 2 页以内项目说明文档（必填）；② 实际运行材料（必填，在线链接 / 安装包 / 仓库与复现步骤任选其一）；③ 1–3 分钟操作演示视频（强烈建议，不能替代实测）；④ 与作品类型匹配的测试与验证证据（必填）。',
      '不强制提交内容：无需商业计划书、融资测算、完整提示词记录，也不强制开源或公开部署上线。',
      '入口与大文件分离：表单收集文字说明与外部访问链接（网页地址、合规网盘、代码仓库等），不强制上传超大附件；队伍须保证所提交链接在评审彻底结束前持续有效。',
      '重复提交与补正窗口：D12 截止前允许重复提交覆盖，以最后一次有效提交为准。截止后次日设 2–4 小时统一材料补正窗口，仅限修复链接失效、提取码错误、文件损坏或必填项漏填，严禁借补正窗口新增功能或大幅修改代码（通过时间戳与旧版比对核查）。',
    ],
  },
  {
    id: 'judging-and-guardrails',
    title: '七、评审流程与学生评委公信力护栏',
    lead: '8–15 支队伍规模下，满足最低交付标准的作品全员进入 D14 现场 Demo Day，不设中途淘汰；采用「D13 线上初评 + D14 现场定分」两步机制。',
    bullets: [
      'D13 线上初评与预核验：评委实测运行材料并核对 D1/D7 增量记录；发现链接失效或疑点时立即联系队长在规定窗口内核实；形成除「展示与表达（5 分）」外的前五项（共 95 分）内部参考初评，并记录 D14 现场追问要点（不出最终排名）。',
      'D14 现场终评定分：评委结合上台实操演示与 Open Demo 上手试玩，补填「展示与表达（5 分）」并对 95 分参考初评作必要微调，锁定 100 分最终成绩，汇总所有有效评委平均分。',
      '评委构成：3–5 名以具备实战经验的高年级学生为主的评委（覆盖技术核验、创意与体验、AI 实践三类能力视角），视条件可特邀 1 名校内教师担任特邀评委或赛事顾问。',
      '五项公信力护栏：① 全体评委共用同一张 100 分评分表；② 对造假、抄袭或未披露旧作须由评委组与组委会共同合议裁决并给队伍申辩机会，单名评委不得直接取消资格；③ 赛前公示评委名单与项目履历；④ 直系亲友、同寝室、同项目组或赛中深度帮调代码者须硬性回避该队评分；⑤ D13 开评前用 2–3 个模拟作品试评校准尺度。',
    ],
    note: '评委名单与过往项目履历将在开赛前统一在此处及交流群公示。',
  },
  {
    id: 'demoday-and-awards',
    title: '八、Demo Day 规则与奖项评定',
    bullets: [
      '上台实操演示：每队 5 分钟（3 分钟介绍与实操 + 2 分钟评委提问）。PPT 不超过 3 页（可不用 PPT），开场 60 秒内必须进入实际可运行界面的操作演示。',
      '自由体验集市（Open Demo）：约 30–40 分钟，所有队伍在桌面展开设备供评委与观众上手试玩、输入临时测试数据并交流。',
      '多元化验证原则：不同作品可采用功能测试用例、稳定性验证、可玩性试玩、实验对照或自愿用户试用等证据；不设外部体验人数门槛，不以拉票量、转发量或数据规模决定主赛名次。',
      '主赛奖项与最佳探索奖：设一等奖（300 元）、二等奖（200 元）、三等奖（100 元）及最佳探索奖（100 元）；奖项具体发放与证书形式按校内合规要求执行。',
      '独立荣誉奖「现场最受欢迎奖」：仅限 D14 线下签到入场的观众与参赛者使用 2–3 张实体投票贴纸在 Open Demo 环节现场投票（不得投给本队），得票最高 1 支队伍获奖；本奖项不折算任何分数加入主赛 100 分总评。',
    ],
  },
  {
    id: 'rights-and-appeals',
    title: '九、作品权益、同分排序与申诉机制',
    bullets: [
      '作品所有权与展示授权：参赛作品所有权归参赛者所有。赛后可建设轻量作品展示页（含项目介绍、截图与经授权的访问链接），是否公开体验、是否开源均由团队自主决定；主办方获取展示授权不代表取得所有权或商业使用权。',
      '主赛同分排序：总分完全相同时，按 ① 实际完成度与可用性（30 分）→ ② 测试与验证（15 分）→ ③ 学习与迭代（15 分）依次比较；若仍一致，由评委组闭门投票决定。',
      '结果公示与 48 小时申诉：如对违规、抄袭或计分存在异议，可在结果公布后 48 小时内向组委会提交书面申诉及相关证据，由组委会与无利益冲突评委共同复核并反馈处理结论。',
    ],
  },
];

/**
 * 可选选题灵感指南（/events/ideas/）数据
 * 遵循 v0.4 第 3.2.2 节：独立于正式赛事规则，按资源依赖分级呈现。
 */
export const dependencyTiers: IdeaTier[] = [
  {
    level: '低依赖',
    tag: '优先推荐新手',
    tone: 'brand',
    examples: '本地小工具、小游戏、交互网页、学科知识点可视化、文本与文件批处理工具',
    tip: '核心功能不依赖非公开系统或持续外部服务，调试链路短，14 天内最容易交付高质量可运行成品。',
  },
  {
    level: '中依赖',
    tag: '按资源条件选择',
    tone: 'sky',
    examples: 'AI API 应用、公开数据集分析、第三方开放接口集成、多模态内容处理原型',
    tip: '开赛前务必核实 API 授权、费用、额度与校园网络可用性，建议准备离线示例或降级演示方案。',
  },
  {
    level: '高依赖',
    tag: '不作入门推荐',
    tone: 'warn',
    examples: '依赖校内非公开业务系统、受限数据或特殊审批授权的项目',
    tip: '仅在事先具备合法授权与稳定接入条件时考虑；严禁未经授权抓取或绕过权限，可优先改用手动录入或脱敏示例数据实现核心功能。',
  },
];

export const ideaDirections: IdeaDirection[] = [
  {
    title: '创意与互动体验',
    subtitle: '把有趣的脑洞做成能上手玩的作品',
    icon: 'palette',
    examples: ['规则新奇的网页小游戏', '多分支互动故事或文字冒险', '音乐/数学可视化实验', '趣味物理或生态模拟器'],
  },
  {
    title: '个人效率与实用工具',
    subtitle: '顺手解决自己每天会遇到的小麻烦',
    icon: 'wrench',
    examples: ['批量文件命名与格式转换器', 'Markdown / 论文排版辅助工具', '轻量个人待办或专注计时器', '本地数据清洗与图表生成器'],
  },
  {
    title: '学习与知识探索',
    subtitle: '把难懂的课程概念变成可交互界面',
    icon: 'book-open',
    examples: ['算法/电路/化学分子交互演示', '专业课错题拆解与自测工具', '实验数据拟合与可视化面板', '面向通识知识的教育类小游戏'],
  },
  {
    title: 'AI 应用与技术探索',
    subtitle: '基于公开模型与接口做有边界的实验',
    icon: 'spark',
    examples: ['带清晰验证流程的智能文档助手', '多模态灵感拆解与素材整理工作流', '面向具体任务的轻量 Agent 工具链', '提示词对比与效果评测小实验'],
  },
  {
    title: '现实问题与生活创意',
    subtitle: '从日常观察出发，做可独立验证的原型',
    icon: 'compass',
    examples: ['手动导入课表的空余时间匹配器', '宿舍/社团活动排班与分工生成器', '预算记账与消费结构可视化工具', '校园/城市探索路线交互地图'],
  },
  {
    title: '自由创作',
    subtitle: '不受以上分类限制',
    icon: 'layers',
    examples: ['跨专业艺术或声音交互实验', '只为满足个人奇思妙想的小玩具', '已有个人工具的赛期核心能力升级', '任何能清晰演示并验证的数字作品'],
  },
];

export const scopeShrinkExamples = [
  {
    before: '直接爬取教务系统做全校课表冲突检测',
    after: '支持手动录入或导入标准模板课表，专注把冲突检测与最优时段推荐做到准确流畅',
    why: '避免未授权接入校内非公开系统，把精力聚焦在真实可验证的核心算法与交互体验上。',
  },
  {
    before: '做一个“全能校园超级助手”覆盖十几个功能模块',
    after: '只挑 1 个高频小场景（例如社团排班或实验数据整理），做到输入真实数据即可稳定跑通并给出边界提示',
    why: '评审以实际完成度与可用性（30 分）为最高权重，一个稳定可用的小工具远胜十个点不动的空页面。',
  },
  {
    before: '必须依赖昂贵或校园网不稳定的海外闭源 API 才能打开首页',
    after: '提供自带示例数据或可切换接口配置，并在说明中标注边界与降级模式',
    why: '确保 D13 评委实测和 D14 现场 Demo Day 不会因为额度或网络波动彻底卡死。',
  },
];
