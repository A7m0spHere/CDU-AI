import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { glossaryCategoryIds } from './data/glossary';
import { CONTENT_TYPES, refineReview } from './lib/content-rules.mjs';

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
