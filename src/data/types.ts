/** 全站共享的内容类型。页面只依赖这些结构，方便 M1 换成 CMS / JSON / 数据库。 */

export type ToolDifficulty = '稍加摸索' | '需要动手';
export type ToolPricing = '需要付费';

/** 当前目录收录产品、工具、项目和资源入口，暂不收录独立模型。 */
export type ToolKind = '在线产品' | '本地应用' | '开源项目' | '工作流工具' | '开发工具' | '资源社区' | '开发平台';

/** 收录标签：说明它凭什么被收录，不用来做热度排名。 */
export type ToolTier = '主流产品' | '社区热门' | '小众探索';

/** 内容依据：这条信息是怎么核对来的。 */
export type ToolBasis = 'official' | 'docs' | 'community';

/** 能力标签（可筛选）：开源 / 本地部署 / 入门友好 / 中文界面。 */
export type ToolCapability = 'open-source' | 'local' | 'beginner' | 'zh';

/** 工具目录的展示分组；厂商工具、开源项目与非官方社区项目分别归类。 */
export type ToolCatalogGroup = 'domestic' | 'overseas' | 'open-source' | 'community';

/** AIGC 页内分区，每个条目只有一个主要展示位置。 */
export type AigcSection = 'image' | 'video' | 'workflow' | 'resources';

export interface ToolLogo {
  /** 站内路径，例如 /tool-logos/deepseek.svg */
  src: string;
  /** 图标来源（官方站点 / 官方仓库 / 图标库地址），用于追溯授权 */
  source: string;
  /** 授权说明：CC0、品牌方媒体资源、仅用于识别产品等 */
  license: string;
  /** 仅用于黑白灰的近黑标志：深色主题下反色；彩色品牌图标不要设置 */
  mono?: boolean;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  /** 这一类里常见的技术类型，用于说明「模型 / 产品 / 工作流」的区别 */
  techHint?: string;
}

export interface Tool {
  /** 稳定且唯一的英文 id，用于筛选与未来详情页 */
  id: string;
  name: string;
  category: string;
  /** 用于对话、Agent 与 API 平台的地区或资源分组，与热度标签无关。 */
  catalogGroup?: ToolCatalogGroup;
  /** AIGC 中的图片、视频、工作流或资源社区分区。 */
  aigcSection?: AigcSection;
  /** 次要分类：同一个工具还能在哪些场景里被找到 */
  alsoIn?: string[];
  /** 别名与常见叫法，参与搜索 */
  aliases?: string[];
  /** 一句话：它是什么 */
  summary: string;
  /** 两三句话：新手拿它做什么 */
  description: string;
  /** 最适合的具体场景，避免只写「提效」这类空话 */
  bestFor: string;
  /** 仅在需要说明上手要求时填写。 */
  difficulty?: ToolDifficulty;
  /** 仅记录已核实的付费要求；没有明确结论时省略。 */
  pricing?: ToolPricing;
  /** 优先填写独立官网或官方项目介绍页；没有时才回退到官方仓库 */
  url: string;
  /** 官方 GitHub 仓库，供 GitHub 图标入口使用，与官网入口分别维护 */
  githubUrl?: string;
  /** 技术类型：LLM、扩散模型、Harness、TTS、STT 等 */
  tech: string;
  /** 资源形态：在线产品 / 本地应用 / 开源项目 / 工作流工具 / 开发工具 / 资源社区 / 开发平台 */
  kind: ToolKind;
  capabilities: ToolCapability[];
  tier: ToolTier;
  /** 最近一次核对官网 / 仓库的日期 */
  verifiedOn: string;
  basis: ToolBasis;
  logo?: ToolLogo;
  tags: string[];
  featured?: boolean;
  /** 使用前值得知道的一句话（隐私、引用、付费变动等） */
  caution?: string;
}

export interface EventFormat {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  goodFor: string;
  status: string;
  icon: 'workshop' | 'clinic' | 'build' | 'stage';
}

export interface BlueprintStep {
  label: string;
  title: string;
  text: string;
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  status: '当前阶段' | '接下来' | '后续';
  description: string;
  items: string[];
}

export interface Pathway {
  number: string;
  title: string;
  description: string;
  meta: string;
  href: string;
  label: string;
  accent: 'green' | 'orange' | 'blue';
}
export interface GlossaryCategory {
  id: string;
  name: string;
  description: string;
  /** primary = AI 主分支（重点）；extension = 接触 AI 后绕不开的延伸分支（只做术语介绍）。 */
  kind: 'primary' | 'extension';
}

export interface GlossaryTerm {
  id: string;
  term: string;
  en: string;
  category: string;
  definition: string;
  example: string;
  aliases: string[];
}
