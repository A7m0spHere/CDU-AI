# 参与内容与文档维护

> 内容组织参考 [AI-Research-Guide](https://github.com/Takamatsu-Hikaru/AI-Research-Guide) 的做法：正文、导航、搜索和校验尽量来自同一份内容源，先定义内容，再让页面自动消费。我们不复制它的代码、品牌或页面结构。

## 1. 文档放在哪里

| 要改什么 | 文件 |
| --- | --- |
| 学习指南正文 | [`src/content/guide/`](src/content/guide/)，一篇 Markdown = 一个模块 |
| 指南阶段名称、阶段说明 | [`src/data/site.ts`](src/data/site.ts) 中的 `guideStages` |
| 指南排序与分级 | 指南 frontmatter 中的 `stage` 与 `order` |
| 作品示例 | [`src/content/works/`](src/content/works/) |
| AI 术语与分类 | [`src/data/glossary.ts`](src/data/glossary.ts) |
| 工具目录 | [`src/data/tools.ts`](src/data/tools.ts) |
| 社区、活动、首页入口 | `src/data/community.ts`、`events.ts`、`home.ts` |
| 指南正文与文档页视觉 | [`src/styles/notion.css`](src/styles/notion.css) |
| 全站搜索索引 | [`src/pages/search-index.json.ts`](src/pages/search-index.json.ts)，构建时生成，不要手工编辑 |
| 技术文档 | [`docs/`](docs/)：架构、内容规范、设计系统 |
| 内容与页面测试 | [`tests/site.test.mjs`](tests/site.test.mjs) |
| 自动发布检查 | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) |

**不要编辑生成的 `dist/`、`.astro/` 或搜索结果文件。** 修改源文件后重新构建即可。

## 2. 新增或修改一篇学习指南

1. 在 `src/content/guide/` 新建 Markdown 文件，文件名就是 URL slug。
2. 写 frontmatter，至少包含：

```yaml
---
title: "一篇指南的标题"
summary: "一句话说清这篇解决什么问题。"
stage: "start" # start | make | share
order: 9
duration: "15 分钟"
level: "零基础"
outcome: "读完后能完成的一件具体小事。"
forWho: "最适合哪类同学。"
updated: "2026-10-18"
sources: # 可选；有外部依据时填写
  - title: "来源标题"
    url: "https://example.com/source"
tools: ["DeepSeek"]
tags: ["示例"]
---
```

3. 正文从 `##` 二级标题开始写。页面会自动生成：
   - 左侧阶段目录与当前篇高亮；
   - 右侧「本页内容」；
   - 上一篇 / 下一篇；
   - 章节级搜索记录；
   - 页面底部的更新时间与「在 GitHub 编辑本页」。
4. 不需要手动改导航或搜索索引。`order` 在同一阶段内排序，新文件会自动加入。
5. 本地运行 `npm run verify`，通过后提交 PR。

## 3. 其他内容类型

### 作品示例

在 `src/content/works/` 新建 Markdown。M0 阶段必须保留：

```yaml
status: "example"
updated: "2026-10-18"
```

不能把策划示例写成真实学生投稿，也不能编造作者、时间和数据。

### 术语

在 `src/data/glossary.ts` 的 `glossaryTerms` 中新增一条：

- `id` 是稳定锚点；
- `definition` 一句话解释；
- `example` 给校园或学习场景示例；
- `aliases` 写常见别名；
- 分类使用已有 `glossaryCategories`。

术语表来源统一写在页面末尾，卡片内不放站外跳转链接；释义要以官方文档和产品说明为准。

### 工具与社区内容

- 工具只收录官方入口，不写聚合站、网盘和邀请码；
- 价格、额度、可用性会变化，不写死具体数字；
- 活动只写已确认的形式和流程，不虚构日期、场地、嘉宾和人数；
- 收录不等于推荐，作品示例与社区内容要有明确状态。

## 4. 文档是怎样串起来的

我们使用 Astro Content Collections，而不是手写一套生成器：

```text
src/content/guide/*.md
        │  frontmatter: stage / order / updated / sources
        ▼
GuideNav + 指南首页 + 搜索索引 + 上一篇/下一篇
        │
        └── 构建 → HTML → 内容测试 → 内部链接检查
```

- **Zod schema** 在 [`src/content.config.ts`](src/content.config.ts) 校验字段；字段写错会在构建时失败。
- **导航**从内容集合与 `guideStages` 生成，新增模块不需要改组件。
- **搜索索引**按页面、指南章节、工具、作品和术语生成；章节结果可以跳转到正文锚点。
- **页面元信息**从 `updated` 与 `sources` 渲染，编辑链接指向仓库中的真实文件。
- **测试**覆盖页面数量、唯一 h1、Notion 文档结构、内容边界、搜索锚点、术语数量和编辑入口。
- **CI** 在推送后运行同一套检查；静态站发布前必须通过。

## 5. 提交前检查

```bash
npm run verify
```

它会依次执行类型检查、生产构建、内容测试、锚点检查和站内链接检查。另外请人工确认：

- 有没有编造学校授权、活动日期、真实姓名、作者或作品数据？
- 外部事实是否有可打开的来源？来源是否填进 `sources`？
- 作品是否保留 `status: "example"`，或明确标注为真实投稿？
- 手机宽度下是否可读，代码块和表格是否溢出？
- 内容是否符合 [`docs/CONTENT-GUIDE.md`](docs/CONTENT-GUIDE.md)？

## 6. 提交信息

提交主题使用 `类型: 中文说明`，类型前缀保留英文：

```text
feat: 新增第一次对话指南
fix: 修复移动端正文溢出
docs: 补充内容维护说明
test: 增加内容清单校验
```

## 7. 参考来源与边界

本项目的内容管理方式参考了 AI-Research-Guide 的清单、内容分层和构建时校验思路，但保留 Astro 的内容集合与静态构建方案。未来如果增加投稿、评论或成员工作台，再单独设计数据与审核流程，不把后台能力塞进静态页面。
