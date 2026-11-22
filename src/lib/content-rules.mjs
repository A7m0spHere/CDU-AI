import { z } from 'astro/zod';
import { isSafeExternalUrl } from './url-guard.mjs';

export const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const REVIEW_BASIS_VALUES = /** @type {const} */ (['first-hand', 'desk-research', 'teaching-example']);
export const AI_USAGE_VALUES = /** @type {const} */ (['none', 'assisted', 'drafted']);
export const GUIDE_STAGES = /** @type {const} */ (['start', 'make', 'share']);
export const WORK_CATEGORIES = /** @type {const} */ (['校园生活', '学习效率', '创意表达', '跨专业实验']);
export const WORK_STATUSES = /** @type {const} */ (['example', 'community']);

export const REVIEW_LIMITS = {
  reviewedByMax: 40,
  reviewNoteMax: 200,
  testedEnvironmentMax: 120,
  contributorsMax: 5,
  contributorNameMax: 40,
};

/**
 * 内容状态与审校字段（guide / glossary / works 共用）。
 * 定义、判定标准与迁移规则见 docs/CONTENT-REVIEW.md。
 *
 * 设计原则：
 * - 所有字段都有保守默认值，存量 Markdown 不需要一次性迁移；
 * - reviewed 日期与 reviewedBy 必须同时填写，缺少审核记录不得显示成已审核；
 * - basis（内容依据）与 reviewed（审核结论）是两个维度：审核不等于亲自实测。
 */
const isoDate = z.string().regex(ISO_DATE_RE, '日期格式应为 YYYY-MM-DD');

/**
 * 参考来源链接（#22）：语法合法 + 协议必须是 http(s)。
 * `z.string().url()` 会放过 javascript: / data: 这类「合法但危险」的 URL，
 * 所以这里再叠一层白名单；规则与 scripts/check-content.mjs、src/lib/url-guard.mjs 一致。
 */
const sourceUrl = z
  .string()
  .trim()
  .url('来源链接必须是完整 URL')
  .refine(isSafeExternalUrl, '来源链接只允许 http(s) 协议，不要写 javascript: / data: / file: 等');

const reviewFields = {
  /** 开发者确认审核结论的日期；可使用 AI 初审与辅助审核。 */
  reviewed: isoDate.optional(),
  /** 审校人署名，可用笔名或匿名；必须与 reviewed 同时填写。 */
  reviewedBy: z.string().trim().min(1).max(REVIEW_LIMITS.reviewedByMax).optional(),
  /** 内容已发现过期或问题、等待更新；优先级高于 reviewed。 */
  needsUpdate: z.boolean().default(false),
  /** 待更新原因或审校范围说明，不超过 200 字。 */
  reviewNote: z.string().trim().min(1).max(REVIEW_LIMITS.reviewNoteMax).optional(),
  /** 内容依据：真实使用经验 / 资料整理 / 教学示例（默认）。 */
  basis: z.enum(REVIEW_BASIS_VALUES).default('teaching-example'),
  /** AI 参与程度；默认按「AI 辅助起草」保守标注。 */
  aiUsage: z.enum(AI_USAGE_VALUES).default('drafted'),
  /** 亲测日期与环境，只有 basis: first-hand（真实使用经验）才允许填写。 */
  testedOn: isoDate.optional(),
  testedEnvironment: z.string().trim().min(1).max(REVIEW_LIMITS.testedEnvironmentMax).optional(),
  /** 内容贡献者（笔名或匿名代称，不写真实姓名/学号等隐私）。 */
  contributors: z
    .array(z.string().trim().min(1).max(REVIEW_LIMITS.contributorNameMax))
    .max(REVIEW_LIMITS.contributorsMax)
    .default([]),
};

export const REVIEW_FIELDS = /** @type {(keyof typeof reviewFields)[]} */ (Object.keys(reviewFields));

/**
 * 从同一份 Schema 推导字段清单，供 Node 检查器识别缺失字段和未知字段。
 * @template {z.ZodRawShape} Shape
 * @param {Shape} fields
 */
function defineContentType(fields) {
  const schema = z.object(fields).extend(reviewFields);
  const known = [...Object.keys(fields), ...REVIEW_FIELDS];
  const required = Object.entries(schema.shape)
    .filter(([, field]) => !field.isOptional())
    .map(([name]) => name);
  return { schema, known, required };
}

export const CONTENT_TYPES = {
  guide: defineContentType({
    title: z.string(),
    summary: z.string(),
    stage: z.enum(GUIDE_STAGES),
    order: z.number().int().positive(),
    level: z.string().default('零基础'),
    outcome: z.string(),
    forWho: z.string(),
    author: z.string().trim().min(1).max(80).optional(),
    aiAssistant: z.string().trim().min(1).max(80).optional(),
    updated: isoDate,
    sources: z
      .array(
        z.object({
          title: z.string(),
          url: sourceUrl,
        }),
      )
      .default([]),
    tools: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
  }),
  works: defineContentType({
    title: z.string(),
    summary: z.string(),
    category: z.enum(WORK_CATEGORIES),
    format: z.string(),
    tools: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    prompt: z.string(),
    effort: z.string(),
    level: z.string().default('零基础'),
    order: z.number().int().positive(),
    updated: isoDate,
    status: z.enum(WORK_STATUSES).default('example'),
  }),
  glossary: defineContentType({
    term: z.string(),
    en: z.string(),
    // Astro 构建时用术语分类数据收窄，Node 校验时从上下文读取分类。
    category: z.string(),
    aliases: z.array(z.string()).default([]),
    definition: z.string(),
    example: z.string(),
    /** 「你可能会说」：读者真实会问出口的一句话，用来把术语和场景连起来。 */
    youMaySay: z.string().trim().min(1).max(240).optional(),
    /** 「场景拆解」：把术语放进一个真实情境，用 2–4 步说明怎么处理。 */
    scenario: z
      .object({
        title: z.string().trim().min(1),
        /** 每一步都是一个可点击的标签，点开显示对应的「提示画面」。 */
        steps: z
          .array(
            z.object({
              label: z.string().trim().min(1),
              body: z.string().trim().min(1),
              quote: z.string().trim().min(1).optional(),
              meta: z.string().trim().min(1).optional(),
              note: z.string().trim().min(1).optional(),
            }),
          )
          .min(2)
          .max(4),
      })
      .optional(),
    /** 「选择题」：一条术语最多 3 题，每题 2–4 个选项且只有一个正确答案。 */
    quiz: z
      .array(
        z.object({
          question: z.string().trim().min(1),
          options: z
            .array(
              z.object({
                text: z.string().trim().min(1),
                correct: z.boolean().default(false),
              }),
            )
            .min(2)
            .max(4),
          explain: z.string().trim().min(1).optional(),
        }),
      )
      .max(3)
      .default([]),
    /** 「你可以这样告诉 AI Agent」：一段可直接复制的提示词。 */
    agentPrompt: z.string().trim().min(1).max(600).optional(),
    order: z.number().int().positive(),
    related: z.array(z.string()).default([]),
    updated: isoDate,
    sources: z
      .array(
        z.object({
          title: z.string(),
          url: sourceUrl,
        }),
      )
      .default([]),
  }),
};
