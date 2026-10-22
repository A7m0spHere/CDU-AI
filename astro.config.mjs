// @ts-check
import { defineConfig } from 'astro/config';
import rehypeSafeLinks from './src/lib/rehype-safe-links.mjs';

// Astro 5 在内容集合为空时，会对每次 getCollection 调用打印
//「The collection "x" does not exist or is empty」的警告；内容重建期间空集合是预期状态。
// 这里只过滤这一条已知提示，避免十几条重复警告淹没真正的构建信息。
const originalWarn = console.warn.bind(console);
console.warn = (...args) => {
  const [first] = args;
  if (typeof first === 'string' && first.includes('does not exist or is empty')) return;
  originalWarn(...args);
};

// 部署到自有域名后，在这里补充 site（例如 https://ai.example.edu.cn），
// Astro 才能生成绝对 URL。M0 不预设任何未经确认的线上地址。
export default defineConfig({
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
      wrap: true,
    },
  },
});