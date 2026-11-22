import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { glossaryCategoryIds } from './data/glossary';
import { CONTENT_TYPES, REVIEW_FIELDS } from './lib/content-rules.mjs';

type ReviewMeta = Pick<z.infer<typeof CONTENT_TYPES.guide.schema>, (typeof REVIEW_FIELDS)[number]>;

/** 跨字段一致性校验：前端展示的每一条「已审校 / 亲测」都必须有对应依据。 */
function refineReview(data: ReviewMeta, ctx: z.RefinementCtx) {
  if (data.reviewedBy && !data.reviewed) {
    ctx.addIssue({
      code: 'custom',
      path: ['reviewedBy'],
      message: '填写 reviewedBy 时必须同时填写 reviewed（审核日期）',
    });
  }

  if (data.reviewed && !data.reviewedBy) {
    ctx.addIssue({
      code: 'custom',
      path: ['reviewedBy'],
      message: '填写 reviewed 时必须同时填写 reviewedBy（审核负责人）',
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
  schema: CONTENT_TYPES.guide.schema.superRefine(refineReview),
});

/**
 * 作品广场：M0 只收录明确标注的「策划示例」，不冒充真实学生投稿。
 * 未来接入真实投稿时，把 status 改为 community，并补充作者与授权字段即可。
 */
const works = defineCollection({
  loader: glob({ pattern: '**/[!_]*.md', base: './src/content/works' }),
  schema: CONTENT_TYPES.works.schema.superRefine(refineReview),
});

/**
 * 术语表：一个 Markdown 一个术语。
 * frontmatter 只放结构化信息，正文写「给电脑小白看的详细解释」。
 */
const glossary = defineCollection({
  loader: glob({ pattern: '**/[!_]*.md', base: './src/content/glossary' }),
  schema: CONTENT_TYPES.glossary.schema
    .extend({ category: z.enum(glossaryCategoryIds) })
    .superRefine(refineReview),
});

export const collections = { guide, works, glossary };
