import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { glossaryCategoryIds } from './data/glossary';

/**
 * 内容状态与审校字段（guide / glossary / works 共用）。
 * 定义、判定标准与迁移规则见 docs/CONTENT-REVIEW.md。
 *
 * 设计原则：
 * - 所有字段都有保守默认值，存量 Markdown 不需要一次性迁移；
 * - 没有 reviewed 日期就视为「初稿 · 尚未人工核校」，不允许默认显示成已审核；
 * - basis（内容依据）与 reviewed（人工核校）是两个维度：核验过事实不等于亲自实测。
 */
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式应为 YYYY-MM-DD');

const reviewFields = {
  /** 人工逐条核校完成的日期；填写后才允许在页面显示「已人工核校」。 */
  reviewed: isoDate.optional(),
  /** 审校人署名，可用笔名或匿名；必须与 reviewed 同时填写。 */
  reviewedBy: z.string().trim().min(1).max(40).optional(),
  /** 内容已发现过期或问题、等待更新；优先级高于 reviewed。 */
  needsUpdate: z.boolean().default(false),
  /** 待更新原因或审校范围说明，不超过 200 字。 */
  reviewNote: z.string().trim().min(1).max(200).optional(),
  /** 内容依据：真实使用经验 / 资料整理 / 教学示例（默认）。 */
  basis: z.enum(['first-hand', 'desk-research', 'teaching-example']).default('teaching-example'),
  /** AI 参与程度；默认按「AI 辅助起草」保守标注。 */
  aiUsage: z.enum(['none', 'assisted', 'drafted']).default('drafted'),
  /** 亲测日期与环境，只有 basis: first-hand（真实使用经验）才允许填写。 */
  testedOn: isoDate.optional(),
  testedEnvironment: z.string().trim().min(1).max(120).optional(),
  /** 内容贡献者（笔名或匿名代称，不写真实姓名/学号等隐私）。 */
  contributors: z.array(z.string().trim().min(1).max(40)).max(5).default([]),
};

interface ReviewMeta {
  reviewed?: string;
  reviewedBy?: string;
  needsUpdate: boolean;
  basis: 'first-hand' | 'desk-research' | 'teaching-example';
  testedOn?: string;
  testedEnvironment?: string;
  contributors: string[];
}

/** 跨字段一致性校验：前端展示的每一条「已审校 / 亲测」都必须有对应依据。 */
function refineReview(data: ReviewMeta, ctx: z.RefinementCtx) {
  if (data.reviewedBy && !data.reviewed) {
    ctx.addIssue({
      code: 'custom',
      path: ['reviewedBy'],
      message: '填写 reviewedBy 时必须同时填写 reviewed（人工审校日期）',
    });
  }

  if (data.basis === 'first-hand') {
    if (!data.testedOn) {
      ctx.addIssue({
        code: 'custom',
        path: ['testedOn'],
        message: 'basis 为 first-hand（真实使用经验）时必须填写 testedOn（亲测日期）',
      });
    }
    if (!data.testedEnvironment) {
      ctx.addIssue({
        code: 'custom',
        path: ['testedEnvironment'],
        message: 'basis 为 first-hand（真实使用经验）时必须填写 testedEnvironment（亲测环境）',
      });
    }
  } else if (data.testedOn || data.testedEnvironment) {
    ctx.addIssue({
      code: 'custom',
      path: ['testedOn'],
      message: '只有 basis 为 first-hand 的内容才允许填写 testedOn / testedEnvironment',
    });
  }

  if (new Set(data.contributors).size !== data.contributors.length) {
    ctx.addIssue({
      code: 'custom',
      path: ['contributors'],
      message: 'contributors 中有重复的贡献者',
    });
  }
}

/**
 * 学习指南：一篇 Markdown 就是一个模块。
 * 新增内容只需在 src/content/guide/ 下放一个 .md 文件，并在 frontmatter 里声明阶段与顺序。
 *
 * 以 _ 开头的文件（如 _TEMPLATE.md）不会被当作内容加载，可作为写作模板使用。
 */
const guide = defineCollection({
  loader: glob({ pattern: '**/[!_]*.md', base: './src/content/guide' }),
  schema: z
    .object({
      title: z.string(),
      summary: z.string(),
      stage: z.enum(['start', 'make', 'share']),
      order: z.number().int().positive(),
      level: z.string().default('零基础'),
      outcome: z.string(),
      forWho: z.string(),
      updated: isoDate,
      sources: z
        .array(
          z.object({
            title: z.string(),
            url: z.string().url(),
          }),
        )
        .default([]),
      tools: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      ...reviewFields,
    })
    .superRefine(refineReview),
});

/**
 * 作品广场：M0 只收录明确标注的「策划示例」，不冒充真实学生投稿。
 * 未来接入真实投稿时，把 status 改为 community，并补充作者与授权字段即可。
 */
const works = defineCollection({
  loader: glob({ pattern: '**/[!_]*.md', base: './src/content/works' }),
  schema: z
    .object({
      title: z.string(),
      summary: z.string(),
      category: z.enum(['校园生活', '学习效率', '创意表达', '跨专业实验']),
      format: z.string(),
      tools: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      prompt: z.string(),
      effort: z.string(),
      level: z.string().default('零基础'),
      order: z.number().int().positive(),
      updated: isoDate,
      status: z.enum(['example', 'community']).default('example'),
      ...reviewFields,
    })
    .superRefine(refineReview),
});

/**
 * 术语表：一个 Markdown 一个术语。
 * frontmatter 只放结构化信息，正文写「给电脑小白看的详细解释」。
 */
const glossary = defineCollection({
  loader: glob({ pattern: '**/[!_]*.md', base: './src/content/glossary' }),
  schema: z
    .object({
      term: z.string(),
      en: z.string(),
      category: z.enum(glossaryCategoryIds),
      aliases: z.array(z.string()).default([]),
      definition: z.string(),
      example: z.string(),
      order: z.number().int().positive(),
      related: z.array(z.string()).default([]),
      updated: isoDate,
      sources: z
        .array(
          z.object({
            title: z.string(),
            url: z.string().url(),
          }),
        )
        .default([]),
      ...reviewFields,
    })
    .superRefine(refineReview),
});

export const collections = { guide, works, glossary };
