/** 全站共享的内容类型。页面只依赖这些结构，方便 M1 换成 CMS / JSON / 数据库。 */

export type ToolDifficulty = '零门槛' | '稍加摸索' | '需要动手';
export type ToolPricing = '免费可用' | '免费增值' | '需要付费';

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
}

export interface Tool {
  /** 稳定且唯一的英文 id，用于筛选与未来详情页 */
  id: string;
  name: string;
  category: string;
  /** 一句话：它是什么 */
  summary: string;
  /** 两三句话：新手拿它做什么 */
  description: string;
  /** 最适合的具体场景，避免只写「提效」这类空话 */
  bestFor: string;
  difficulty: ToolDifficulty;
  pricing: ToolPricing;
  /** 官方入口 */
  url: string;
  tags: string[];
  featured?: boolean;
  /** 使用前值得知道的一句话（隐私、引用、付费变动等） */
  caution?: string;
}

export interface CommunityChannel {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  goodFor: string;
  status: string;
  icon: 'sprout' | 'wrench' | 'spark' | 'users';
}

export interface StarterTopic {
  id: string;
  question: string;
  context: string;
  tags: string[];
  status: string;
}

export interface CommunityPrinciple {
  id: string;
  title: string;
  text: string;
}

export interface JoiningStep {
  step: string;
  title: string;
  text: string;
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