// @ts-check
import { defineConfig } from 'astro/config';

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
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});