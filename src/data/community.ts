import type {
  CommunityChannel,
  CommunityPrinciple,
  JoiningStep,
  StarterTopic,
} from './types';

/** 社区版块：M0 只做设计稿，status 标注当前状态，不暗示已经有人发帖。 */
export const communityChannels: CommunityChannel[] = [
  {
    id: 'first-question',
    title: '第一次提问',
    subtitle: '没有「太基础」的问题',
    description:
      '给刚接触 AI 的同学留的位置。说清你想做什么、试到哪一步、看到了什么提示，别人更容易帮上忙；问得零碎也没关系，会有人帮你把问题补齐。',
    goodFor: '第一次用 AI 就卡住，不确定问题该问到什么程度',
    status: 'M1 开放',
    icon: 'sprout',
  },
  {
    id: 'tool-help',
    title: '工具互助',
    subtitle: '一个工具卡住了，来这里问',
    description:
      '登录不了、导不出、额度用完、找不到按钮，这类具体问题放这里。发帖时写明工具名称、用的平台（网页 / 手机 / 电脑）、你点了什么、报错原文，别人才能复现。',
    goodFor: '官方说明看不懂、导出格式不对、功能找不到入口',
    status: 'M1 开放',
    icon: 'wrench',
  },
  {
    id: 'inspiration',
    title: '灵感与作品',
    subtitle: '半成品也值得被看见',
    description:
      '放你做出来的东西和过程：原始需求、用过的提示词、改了几版、哪里失败了。不要求完整，也不评比好坏，回复优先说「我看到了什么」，而不是打分。',
    goodFor: '想找人看看半成品，或者想找下一个可以做的题目',
    status: 'M1 开放',
    icon: 'spark',
  },
  {
    id: 'events-teams',
    title: '活动与组队',
    subtitle: '找搭子一起做一个小项目',
    description:
      'M1 起用于发布活动通知和组队需求：想做什么、还缺什么角色、每周能投入多少时间。当前只有形式设计，没有真实活动、报名入口或加群方式。',
    goodFor: '想组队参加比赛，或者找队友一起完成一个作品',
    status: '筹备中',
    icon: 'users',
  },
];

/** 讨论起点由发起人拟定，用于展示讨论会长什么样，不是真实帖子。 */
export const starterTopics: StarterTopic[] = [
  {
    id: 'small-fix',
    question: '你最近用 AI 解决的一个小麻烦是什么？',
    context:
      '不用是大事：把一段录音转成待办、看懂英文说明书、把照片里的表格抄成 Excel 都算。写清原来要花多久、AI 帮到哪一步、哪一步最后还是自己做的。',
    tags: ['真实场景', '经验分享'],
    status: '发起人拟定 · 非真实帖子',
  },
  {
    id: 'misled',
    question: '被 AI 带偏的一次经历：它是在哪一步说错的？',
    context:
      '很多错误不是明显胡说，而是看起来很像真的。可以贴出原文并打码，说说你后来怎么发现不对，以及下次准备怎么验证。',
    tags: ['AI 素养', '事实核对'],
    status: '发起人拟定 · 非真实帖子',
  },
  {
    id: 'save-an-hour',
    question: '如果 AI 能帮你省下一小时，你最想省掉哪件事？',
    context:
      '越具体越好：整理实验数据、给社团活动写通知、把课件缩成复习提纲。先说清这件事现在怎么做、哪一步最重复，再想工具也不迟。',
    tags: ['需求发现', '学习效率'],
    status: '发起人拟定 · 非真实帖子',
  },
];

/** 社区公约：写成能照着做、也能被指出的规则。 */
export const communityPrinciples: CommunityPrinciple[] = [
  {
    id: 'no-basic-question',
    title: '问题没有「太基础」',
    text: '新手提问时先回答问题本身，别用「这也要问」开头。需要补充背景，用「这里可能有个前提」的句式，把话说在事情上。',
  },
  {
    id: 'declare-ai',
    title: 'AI 参与要写出来',
    text: '用 AI 生成或改写的文字、图片、代码，发布时注明用了什么工具、改了哪些部分。作业、比赛、投稿按各自规则先申报，别把生成内容写成自己的原创。',
  },
  {
    id: 'protect-privacy',
    title: '别人的隐私不进对话框',
    text: '不发同学姓名、学号、成绩、聊天记录和未公开的社团材料。举例时替换或打码；涉及他人信息的截图，先征得本人同意。',
  },
  {
    id: 'cite-sources',
    title: '引用要给得出来源',
    text: '引用论文、政策、数据时贴原文链接或页码；「AI 说某研究指出」不算来源。转发 AI 总结前，先回到原文核对结论和数字。',
  },
  {
    id: 'no-flooding',
    title: '不刷屏、不重复发',
    text: '同一个问题只发一个版块，补充信息用编辑原帖，而不是新开一帖。宣传自己的作品集中在一处，不跨版块复制粘贴。',
  },
  {
    id: 'words-not-people',
    title: '对事不对人',
    text: '指出问题时说清是哪句话、哪个做法、可以怎么改；不猜测动机、不点名嘲讽、不把争论搬到别处继续。',
  },
];

/** 参与路径：只写已经确定或文档中已规划的内容，不给未确认的报名渠道。 */
export const joiningSteps: JoiningStep[] = [
  {
    step: 'M0 · 现在',
    title: '先读，不用登记',
    text: '当前的社区页是设计稿：版块、讨论起点和公约都可以读，但没有注册入口，也不需要留任何个人信息。先把公约看一遍，判断这里是否适合你。',
  },
  {
    step: 'M1 · 接下来',
    title: '从协会内部与邀请开始',
    text: 'M1 会先把交流区放在协会内部和少量邀请用户中小范围试运行，确认值班与审核能跟上，再在本页说明具体加入方式。确认之前不设 QQ 群、微信群或报名链接。',
  },
  {
    step: 'M2 · 后续',
    title: '自己发起话题与活动',
    text: '试运行稳定后，再开放发起讨论、组队和活动提案，并把选题规则、负责人与审核流程写清楚。活动信息以场地和负责人确认后的版本为准。',
  },
];
