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

export interface CompetitionTrack {
  code: string;
  title: string;
  teamRule: string;
  summary: string;
  requirement: string;
  note: string;
}

export interface WorkRequirementItem {
  badge: string;
  title: string;
  text: string;
  tone?: 'brand' | 'warn';
}

export interface TimelinePhase {
  day: string;
  dateLabel: string;
  stage: string;
  summary: string;
  deliverable: string;
}

export interface ReviewHighlight {
  step: string;
  badge: string;
  title: string;
  text: string;
}

export interface RuleSection {
  id: string;
  title: string;
  lead?: string;
  bullets: string[];
  note?: string;
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
  title: '成都大学第八届网络创新大赛——AI创作挑战赛',
  shortTitle: '第八届网络创新大赛 · AI创作挑战赛',
  eyebrow: '活动',
  statusBadge: '2026年11月24日 – 12月4日',
  subtitle:
    '由成都大学计算机协会承办的首个 AI 相关赛事，设新手组与进阶组双赛道，以个人参赛为主。',
  organizerNote:
    '由成都大学计算机协会承办（协会承办的首个 AI 相关赛事），积极争取校团委盖章认证与学院综测加分认可；本站为社区活动信息页，非成都大学官方平台。',
  updatedOn: '2026-11-20',

  /** 关键日期配置：保留未确认表单占位，同时同步已定核心赛程节点 */
  dates: {
    overall: '2026年11月24日 – 2026年12月4日',
    briefing: '2026年11月24日（周二）',
    onlineReview: '2026年12月4日（周五）晚间',
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
    badge: '计协首个 AI 赛事',
    title: '成都大学第八届网络创新大赛——AI创作挑战赛',
    summary: '2026年11月24日 – 12月4日 · 设新手组与进阶组，以个人参赛为主，12月5日线下 Demo Day',
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
    qrAlt: '成都大学第八届网络创新大赛——AI创作挑战赛交流群二维码',
    groupIdText: '待公布',
    description: '用于发布赛程时间确认通知、飞书报名与提交链接、自由寻找队友以及赛期答疑交流。',
    placeholderHint: '群二维码待补充，确认后将在此直接展示',
  },
};

export const quickFacts = [
  { label: '活动周期', value: `${challengeConfig.dates.overall}（7–10 天）` },
  { label: '承办定位', value: '计算机协会承办的首个 AI 相关赛事' },
  { label: '双赛道设置', value: '新手组 / 进阶组' },
  { label: '参赛人数', value: '个人参赛为主（进阶组原则上不超过 2 人）' },
  { label: '作品形式', value: 'AI 项目开发 · 自制功能头图' },
];

export const competitionTracks: CompetitionTrack[] = [
  {
    code: '赛道一',
    title: '新手组',
    teamRule: '尽量单人参赛（防怠工）',
    summary: '面向首次接触 AI 项目开发、希望在参考框架上完成第一次真实实践的同学。',
    requirement: '基于活动提供的优秀参考模板开展创作，参赛作品须在模板基础上实现至少一项有意义的改进。',
    note: '后续将结合报名情况统计新手人数，并依托官网学习指南与工具库提供针对性引导。',
  },
  {
    code: '赛道二',
    title: '进阶组',
    teamRule: '鼓励单人 · 组队原则上不超过 2 人',
    summary: '面向具备一定开发或交互设计经验、希望自主打造完整功能的同学。',
    requirement: '独立或至多两人协作完成原创项目设计与功能实现，并自行设计展示核心功能的头图。',
    note: '双人组队须明确各自实质开发分工，不接受跨队挂名或空挂名义参与。',
  },
];

export const workRequirements: WorkRequirementItem[] = [
  {
    badge: '形式要求',
    title: '完成可演示的 AI 创作项目',
    text: '围绕赛事方向开发可真实运行或可完整演示的创作项目，做好核心流程验证，便于线上评审与线下 Demo Day 展示体验。',
  },
  {
    badge: '展示要求',
    title: '自制核心功能展示头图',
    text: '参赛者须自行设计一张作品头图，清晰展现项目的核心功能、使用场景与创意卖点，随作品资料一并呈现。',
  },
  {
    badge: '作品审核',
    title: '重点审查合规、合法与创意亮点',
    text: '审核环节将重点核查作品内容的合规性、合法性及是否具备独特的创意亮点，不接收仅做静态包装的空壳页面或违规内容。',
  },
  {
    badge: '反作弊底线',
    title: '严禁套壳搬运 · 旧作追溯提交记录',
    text: '严禁直接复制参考模板或搬运他人开源源码充当作品。若基于个人旧项目参赛，将追溯正赛前 3–4 天的代码提交记录进行判定，只认可赛期真实新增与改进成果。',
    tone: 'warn',
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
    day: '赛前窗口期',
    dateLabel: '11月24日前',
    stage: '宣传发布与报名窗口',
    summary: '公开活动页面、赛制说明与飞书报名入口，预留多日窗口期。',
    deliverable: '浏览赛制与教程 · 前往飞书完成报名',
  },
  {
    day: '11月24日（周二）',
    dateLabel: '正式开赛',
    stage: '线下宣讲会与开赛说明',
    summary: '召开线下宣讲会，集中讲解双赛道赛制、综测方向政策说明、新人引导与组队意向收集。',
    deliverable: '明确赛道 · 核对参考模板或项目思路',
  },
  {
    day: '11月24日 – 12月4日',
    dateLabel: '7–10 天开发期',
    stage: 'AI 项目开发与迭代',
    summary:
      '新手组基于参考模板完成至少一项有意义的改进，进阶组自主完成项目设计与开发，并自行设计展示核心功能的头图。',
    deliverable: '参赛开发项目 + 核心功能自制头图',
  },
  {
    day: '12月4日（周五）晚间',
    dateLabel: '截稿与线上评审',
    stage: '作品提交截止并开启线上评审',
    summary:
      '当晚统一截止提交参赛作品，并随即开启线上评审。组织方重点进行合规、创意与反抄袭核验，由真人评委结合 AI 多维度评分综合评定。',
    deliverable: '线上评审 · 评选新人奖与创新奖等赛道奖项',
  },
  {
    day: '12月5日（周六）',
    dateLabel: '线下 Demo Day',
    stage: '开启线下 Demo Day（项目展示与交流）',
    summary: '开展线下 Demo Day，包含参赛项目展示、现场体验交流以及奖项相关环节。',
    deliverable: '线下 Demo Day · 项目展示与交流',
  },
];

export const reviewAndAwardHighlights: ReviewHighlight[] = [
  {
    step: '01',
    badge: '线上评审',
    title: 'AI 多维度 + 真人评委',
    text: '引入真人评委保障评审公平性，结合 AI 多维度评分与人类评委主观评价，并适当设定权重对比进行综合评定。',
  },
  {
    step: '02',
    badge: '动态公开',
    title: '评分细则开赛后公布',
    text: '具体的线上评分系统指标与评奖细则将在比赛正式开始后逐步制定并向全体参赛者公开，不提前锁死刚性指标。',
  },
  {
    step: '03',
    badge: '赛道奖项',
    title: '新人奖与创新奖',
    text: '分设新人奖、创新奖等赛道奖项，主要奖励物理实体奖品（实物样品）与证书，鼓励新手完成首次实践与创意突破。',
  },
  {
    step: '04',
    badge: '认证推进',
    title: '争取校级盖章与综测认可',
    text: '正积极争取校团委盖章认证以提升比赛层级，从而推动学院对获奖者综测加分的认可（最终认定以官方批复为准）。',
  },
];

/**
 * 完整赛事细则（/events/rules/）章节数据
 * 每个章节的 id 与 title 同步生成右侧 ArticleToc 目录和站内搜索索引。
 */
export const ruleSections: RuleSection[] = [
  {
    id: 'positioning',
    title: '一、赛事定位与承办说明',
    lead: '成都大学第八届网络创新大赛——AI创作挑战赛由成都大学计算机协会承办，是计协承办的首个 AI 相关专项赛事，聚焦 AI 项目创作实践。',
    bullets: [
      '活动定位：面向全校各专业同学，以真实可演示的 AI 开发项目为载体，鼓励零基础新人与有经验开发者借助 AI 工具落地创意。',
      '赛期设置：开发周期为 7–10 天，安排为 2026年11月24日（周二）线下宣讲启动，12月4日（周五）晚间截稿并开启线上评审，12月5日（周六）开启线下 Demo Day。',
      '辅助资源支持：官网同步提供 AI 使用教程、学习指南与工具库，并在宣讲后统计新手用户人数，评估提供针对性入门指导。',
    ],
  },
  {
    id: 'registration-and-teams',
    title: '二、双赛道设置与组队规范',
    lead: '比赛划分为「新手组」与「进阶组」两个赛道，均以个人参加为主，鼓励独立开发与真实动手实践。',
    bullets: [
      '新手组规范：为防止组队依赖与怠工，新手组尽量单人参赛；赛事将提供官方参考模板，参赛作品须基于模板实现至少一项有意义的改进。',
      '进阶组规范：有经验的开发者同样鼓励单人参赛，如需组队，原则上不超过 2 人；队伍成员须有明确分工与实际代码或设计贡献。',
      '参赛纪律：每人仅限参与一支队伍，不得跨队挂名或代为开发。',
    ],
  },
  {
    id: 'work-requirements',
    title: '三、作品形式与基础展示要求',
    lead: '参赛作品强调真实可演示的开发成果与清晰的核心功能展示。',
    bullets: [
      '项目可演示要求：提交的参赛开发项目须具备清晰可验证的核心功能，确保 12 月 4 日晚间线上评审与 12 月 5 日线下 Demo Day 能够正常演示与体验。',
      '自制核心头图：参赛者须自行设计一张作品头图，用于直观展示项目的核心功能、亮点交互或适用场景。',
      '真实边界说明：项目如使用示例数据或外部公开接口，须在说明中如实标注适用范围与已知局限，不得虚构不存在的实时功能。',
    ],
  },
  {
    id: 'schedule-and-exemptions',
    title: '四、赛程安排与线下交流',
    lead: '赛程包含赛前报名窗口、周二线下宣讲、7–10 天开发期、12月4日晚间线上评审及 12月5日线下 Demo Day。',
    bullets: [
      '报名窗口期：在 11 月 24 日开赛前预留多日线上宣传与飞书报名窗口期。',
      '周二线下宣讲会（11 月 24 日）：开展线下宣讲会议，集中讲解双赛道赛制、综测方向政策说明、新人引导与组队意向收集。',
      '截稿与线上评审（12 月 4 日周五晚间）：正式截止作品提交，并同步启动线上评审工作。',
      '线下 Demo Day（12 月 5 日周六）：开展线下 Demo Day，包含参赛项目展示与现场交流环节。',
    ],
  },
  {
    id: 'audit-and-anticheat',
    title: '五、作品审核标准与反抄袭机制',
    lead: '所有参赛作品须经过严格的内容与原创性审核，确保比赛公平性与真实创作价值。',
    bullets: [
      '审核重点：重点审查作品的合规性、合法性以及是否具有独特的创意亮点；存在违规内容或无法正常运行的作品将不予通过。',
      '严禁直接复制搬运：禁止直接复制官方参考模板交差（仅改标题或少量文案不视为有效改进），严禁搬运他人或公开仓库源码充当参赛成果。',
      '旧项目追溯判定：对于使用个人旧项目继续改造参赛的情况，将追溯正赛前 3–4 天的代码提交记录进行核查判定，仅认可赛期内的实质性增量创作。',
      '数据与安全底线：严禁未经授权抓取或接入校内非公开系统，提交材料与展示内容中不得泄露 API 密钥、个人隐私或受限数据。',
    ],
  },
  {
    id: 'judging-and-awards',
    title: '六、评审机制、奖项规划与细则公布',
    lead: '结合线上评审与 12 月 5 日线下 Demo Day 展示交流，兼顾多维客观指标与评委专业判断。',
    bullets: [
      '线上多元评审：引入真人评委把关评审公平性，同时结合 AI 多维度评分与人工主观评价，适当设定权重对比进行综合评定。',
      '评分细则动态公开：具体的评分系统指标与完整评奖细则将在比赛正式开始后逐步制定并公开，确保评判标准透明可预期。',
      '奖项与奖励形式：分设「新人奖」与「创新奖」等赛道奖项，主要奖励物理实体奖品（实物样品）与证书。',
      '校级认证争取：主办团队正积极争取校团委盖章认证以提升比赛层级，从而争取学院对获奖者综测加分的认可；具体加分认定以最终官方批复与学校学院规定为准。',
    ],
    note: '具体评分系统指标与评奖细则将于 11 月 24 日正式开赛后逐步制定并同步至本页及赛事交流群。',
  },
  {
    id: 'rights-and-privacy',
    title: '七、作品权益与信息保护',
    bullets: [
      '作品所有权：参赛作品的知识产权与所有权归参赛者（或团队）所有；主办方仅在获得授权后用于赛果展示与经验分享，不取得商业使用权。',
      '信息隔离与隐私保护：报名收集的个人联系方式仅用于赛事通知与组队协调，与公开展示材料隔离管理，未经本人同意不对外公开。',
    ],
  },
];
