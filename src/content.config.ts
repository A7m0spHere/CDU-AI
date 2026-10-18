import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 学习指南：一篇 Markdown 就是一个模块。
 * 新增内容只需在 src/content/guide/ 下放一个 .md 文件，并在 frontmatter 里声明阶段与顺序。
 */
const guide = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guide' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    stage: z.enum(['start', 'make', 'share']),
    order: z.number().int().positive(),
    duration: z.string(),
    level: z.string().default('零基础'),
    outcome: z.string(),
    forWho: z.string(),
    updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
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
  }),
});

/**
 * 作品广场：M0 只收录明确标注的「策划示例」，不冒充真实学生投稿。
 * 未来接入真实投稿时，把 status 改为 community，并补充作者与授权字段即可。
 */
const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: z.object({
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
    updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    status: z.enum(['example', 'community']).default('example'),
  }),
});

export const collections = { guide, works };