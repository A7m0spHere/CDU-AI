// @ts-check
import { defineConfig } from 'astro/config';
import rehypeSafeLinks from './src/lib/rehype-safe-links.mjs';
import { themeCodeTokens } from './src/lib/theme-code-tokens.mjs';

// Astro 5 在内容集合为空时，会对每次 getCollection 调用打印
//「The collection "x" does not exist or is empty」的警告；内容重建期间空集合是预期状态。
// 这里只过滤这一条已知提示，避免十几条重复警告淹没真正的构建信息。
const originalWarn = console.warn.bind(console);
console.warn = (...args) => {
  const [first] = args;
  if (typeof first === 'string' && first.includes('does not exist or is empty')) return;
  originalWarn(...args);
};

// Sites 公开开发预览地址，用于生成绝对 URL。
export default defineConfig({
  site: 'https://cdu-ai-commons.a7m0sphere.chatgpt.site',
  output: 'static',
  devToolbar: {
    enabled: false,
  },
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  markdown: {
    // 正文里的外链兜底（#22）：危险协议去掉 href，外链补 target/rel
    rehypePlugins: [rehypeSafeLinks],
    shikiConfig: {
      theme: 'github-light',
      transformers: [themeCodeTokens],
      wrap: true,
    },
  },
});
