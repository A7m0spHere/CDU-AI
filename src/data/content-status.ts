/**
 * 内容状态与审校信息的展示规则。
 * 字段定义、判定标准与迁移规则见 docs/CONTENT-REVIEW.md。
 */
import { repository } from './site';

export type ContentStatusId = 'draft' | 'reviewed' | 'needs-update';
export type ContentBasis = 'first-hand' | 'desk-research' | 'teaching-example';
export type AiUsage = 'none' | 'assisted' | 'drafted';

/** guide / glossary / works 三种内容集合共有的审校字段。 */
export interface ReviewFields {
  reviewed?: string;
  reviewedBy?: string;
  needsUpdate?: boolean;
  reviewNote?: string;
  basis?: ContentBasis;
  aiUsage?: AiUsage;
  testedOn?: string;
  testedEnvironment?: string;
  contributors?: string[];
}

const basisLabels: Record<ContentBasis, string> = {
  'first-hand': '真实使用经验（本人实测）',
  'desk-research': '资料整理（基于公开来源）',
  'teaching-example': '教学示例（推演，非实测）',
};

const aiUsageLabels: Record<AiUsage, string> = {
  none: '未使用 AI',
  assisted: 'AI 辅助整理或润色',
  drafted: 'AI 辅助起草',
};

const contextNotes: Record<'guide' | 'glossary' | 'work', string> = {
  guide:
    '状态按《内容审校与溯源规范》标注；发现过期或错误内容，可在 GitHub 提 issue 或直接编辑本页。',
  glossary:
    '术语定义为本站独立撰写，事实以词条列出的来源文档为准；正文中的 AI 辅助内容需逐条人工核校后才能视为已确认。',
  work:
    '策划示例用于展示作品可以如何组织，不代表已完成或已验证的成品；真实投稿的审校与授权规则在 M1 明确。',
};

export interface ContentStatusView {
  id: ContentStatusId;
  label: string;
  basisLine: string;
  aiLine: string;
  reviewLine?: string;
  contributorsLine?: string;
  note: string;
  guidelineUrl: string;
}

/**
 * 由 frontmatter 推导展示状态，规则必须是保守的：
 * 没有 reviewed 就显示「初稿 · 尚未人工核校」，needsUpdate 优先显示「待更新」。
 */
export function getContentStatus(
  data: ReviewFields,
  options: { context?: 'guide' | 'glossary' | 'work' } = {},
): ContentStatusView {
  const basis = data.basis ?? 'teaching-example';
  const aiUsage = data.aiUsage ?? 'drafted';
  const needsUpdate = data.needsUpdate ?? false;
  const id: ContentStatusId = needsUpdate ? 'needs-update' : data.reviewed ? 'reviewed' : 'draft';

  const label =
    id === 'reviewed' ? '已人工核校' : id === 'needs-update' ? '待更新' : '初稿 · 尚未人工核校';

  const basisDetail =
    basis === 'first-hand' && data.testedOn
      ? `${basisLabels[basis]}｜亲测时间：${data.testedOn}` +
        (data.testedEnvironment ? `；环境：${data.testedEnvironment}` : '')
      : basisLabels[basis];

  let reviewLine: string | undefined;
  if (id === 'reviewed') {
    reviewLine = `审校人：${data.reviewedBy ?? '匿名维护者'} · ${data.reviewed}` +
      (data.reviewNote ? `；${data.reviewNote}` : '');
  } else if (id === 'needs-update') {
    reviewLine = `已标记待更新${data.reviewed ? `（上次审校：${data.reviewed}）` : ''}` +
      (data.reviewNote ? `；${data.reviewNote}` : '') +
      '。更新前请交叉核对，不要把旧内容当作已验证结论。';
  }

  const contributorsLine =
    data.contributors && data.contributors.length > 0
      ? `贡献者：${data.contributors.join('、')}`
      : undefined;

  return {
    id,
    label,
    basisLine: `内容依据：${basisDetail}`,
    aiLine: `AI 参与：${aiUsageLabels[aiUsage]}`,
    reviewLine,
    contributorsLine,
    note: contextNotes[options.context ?? 'guide'],
    guidelineUrl: `${repository.url}/blob/main/docs/CONTENT-REVIEW.md`,
  };
}
