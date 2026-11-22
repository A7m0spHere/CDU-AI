import type { AwardRow, RuleSection, ScoringGroup } from './challenge';
import {
  challengeConfig as config2026,
  ruleSections as ruleSections2026,
  scoringGroups as scoringGroups2026,
  awardRows as awardRows2026,
  awardNotes as awardNotes2026,
} from './challenge-2026';

/**
 * 把需要长期保留的规则版本登记到这里，归档页会保留当时的规则内容。
 * 当前届赛事不要从这里读取，统一走 challenge.ts。
 */
export interface ArchivedChallenge {
  slug: string;
  title: string;
  period: string;
  updated: string;
  summary: string;
  config: typeof config2026;
  ruleSections: RuleSection[];
  scoringGroups: ScoringGroup[];
  awardRows: AwardRow[];
  awardNotes: string[];
}

export const archivedChallenges: ArchivedChallenge[] = [
  {
    slug: '2026-ai-challenge',
    title: config2026.title,
    period: config2026.dates.overall,
    updated: config2026.updatedOn,
    summary: '新手组与进阶组的组队、作品提交、真实性核验、评分表与奖项规则。',
    config: config2026,
    ruleSections: ruleSections2026,
    scoringGroups: scoringGroups2026,
    awardRows: awardRows2026,
    awardNotes: awardNotes2026,
  },
];
