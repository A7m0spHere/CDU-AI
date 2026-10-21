# 参与内容与文档维护

> 内容组织参考 [AI-Research-Guide](https://github.com/Takamatsu-Hikaru/AI-Research-Guide) 的做法：正文、导航、搜索和校验尽量来自同一份内容源，先定义内容，再让页面自动消费。我们不复制它的代码、品牌或页面结构。

这是一个开放共建的站点，**不需要会写代码**也能参与：在 GitHub 网页上点几下，就能改一个错别字、指出一处错误，或分享一次真实使用经验。本文先讲网页贡献路径，再讲内容规范；最后给出维护者的审稿清单与仓库设置清单。

## 1. 入口一览

| 我想…… | 从哪里开始 | 需要什么 |
| --- | --- | --- |
| 改几个字、修一句话 | 打开对应页面 → 底部的「在 GitHub 编辑本页」 | 免费 GitHub 账号 |
| 指出错误，但不确定怎么改 | [文档纠错 issue](https://github.com/A7m0spHere/CDU-AI/issues/new?template=doc-correction.yml) | GitHub 账号 |
| 分享一次真实使用经验 | [经验投稿 issue](https://github.com/A7m0spHere/CDU-AI/issues/new?template=experience-submission.yml) | GitHub 账号、真实经历 |
| 推荐或更新工具 | [工具建议 issue](https://github.com/A7m0spHere/CDU-AI/issues/new?template=tool-suggestion.yml) | GitHub 账号 |
| 改代码、样式或测试 | 读第 6 节，按 PR 流程提交 | Node.js ≥ 22（可选） |

所有贡献默认按仓库 [LICENSE](LICENSE)（MIT）发布。M0 不开放匿名投稿：贡献需要一个公开的 GitHub 账号。

## 2. 最快的一次贡献：在网页上改几个字

不用命令行，也不用懂 Astro。以一篇指南为例：

1. 打开要修改的页面。学习指南、术语和作品详情页的底部都有「在 GitHub 编辑本页」。
2. 点击链接，会直接跳到仓库里对应的 Markdown 文件（`src/content/…/*.md`）。
3. 没有登录时 GitHub 会提示登录，免费注册即可；GitHub 会自动 Fork 一份到你的账号下。
4. 在网页编辑框里修改 Markdown。正文就是普通文字；frontmatter 字段的写法见第 5 节和 [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md)。
5. 在页面底部「Commit changes」里写清改了什么（例如「修正：术语表 token 定义中的错别字」），选择 **Create a new branch for this commit**，点 **Propose changes**。
6. 点 **Create pull request**，按模板填写验证方式、事实来源与隐私版权；文档 / 内容 / 文案类修改再填写 AI 辅助声明。
7. 维护者审阅，CI 自动运行 `npm run verify`；通过并确认后合并，站点下次构建时更新。

小提示：

- 一次 PR 只改一件事，不要顺手重排无关段落或改动其他文件。
- 只改文字时不需要本地环境，GitHub 网页足够。
- 涉及事实、数据、价格、工具能力时先看 [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md)；没有依据的内容标注「待核实」，不要写成亲测。
- 不要编辑生成的 `dist/`、`.astro/` 或搜索结果文件，它们是构建产物。

## 3. 什么时候用 issue 表单

issue 表单用于「还说不清该怎么改」的情况：需要维护者核实事实，或内容是经验分享而不是小修小改。三个表单都尽量只问必要信息：

- **文档纠错**：指出页面中的错误、过期信息、错别字或失效链接。填页面地址和原文；有来源更好，没有依据也会一起核实。
- **经验投稿**：分享你亲自用 AI 解决校园/学习问题的过程。优先真实经历，包括失败和返工；AI 虚构的案例、访谈和「同学评价」不接受。
- **工具建议**：推荐收录或更新工具信息。只收官方入口，不收聚合站、网盘和邀请码；收录不等于推荐。
- **其他问题**：也可以开空白 issue；能归入上面三类时优先用表单，维护者更容易处理。

提交前请确认：不要把真实姓名、学号、手机号、聊天记录、未公开数据粘贴到公开 issue 里。

## 4. 内容放在哪里

| 要改什么 | 文件 |
| --- | --- |
| 学习指南正文 | [`src/content/guide/`](src/content/guide/)，一篇 Markdown = 一个模块 |
| 指南阶段名称、阶段说明 | [`src/data/site.ts`](src/data/site.ts) 中的 `guideStages` |
| 指南排序与分级 | 指南 frontmatter 中的 `stage` 与 `order` |
| 作品示例 | [`src/content/works/`](src/content/works/) |
| AI 术语正文 | [`src/content/glossary/`](src/content/glossary/)，一个词一篇 Markdown（含白话详解） |
| 术语分类 | [`src/data/glossary.ts`](src/data/glossary.ts) 中的 `glossaryCategories` |
| 工具目录 | [`src/data/tools.ts`](src/data/tools.ts)（后续会迁移为 Markdown，见 [#8](https://github.com/A7m0spHere/CDU-AI/issues/8)） |
| 活动、首页入口 | `src/data/events.ts`、`home.ts` |
| 全站搜索索引 | [`src/pages/search-index.json.ts`](src/pages/search-index.json.ts)，构建时生成，不要手工编辑 |
| 技术文档 | [`docs/`](docs/)：架构、内容规范、设计系统 |
| 内容状态与审校规范 | [`docs/CONTENT-REVIEW.md`](docs/CONTENT-REVIEW.md)：状态模型、审校清单、署名与迁移规则 |
| 内容与页面测试 | [`tests/site.test.mjs`](tests/site.test.mjs) |
| 内容一致性检查 | [`scripts/check-content.mjs`](scripts/check-content.mjs) 与 `tests/fixtures/content/`（合法 / 错误条目样例） |
| 写作模板 | `src/content/{guide,works,glossary}/_TEMPLATE.md`（当前三个内容目录只保留模板） |
| 协作模板与 CI | [`.github/`](.github/)：Issue 表单、PR 模板、CODEOWNERS、工作流 |

## 5. 各内容类型的字段与写法

### 从模板开始（当前内容重建中）

三个内容目录目前只保留 `_TEMPLATE.md` 写作模板，旧内容已清空：

1. 复制对应目录的 `_TEMPLATE.md`，改名为内容文件（例如 `src/content/guide/09-my-first-guide.md`）；
2. **去掉文件名开头的下划线**——以 `_` 开头的文件不会进入构建，只作为模板；
3. 按模板里的注释填写 frontmatter 和正文，运行 `npm run verify` 检查；
4. 内容为空时，列表页会显示「内容准备中」占位；加入第一篇内容后会自动恢复正常列表与详情页。

### 学习指南

在 [`src/content/guide/`](src/content/guide/) 新建 Markdown，文件名就是 URL slug。frontmatter 至少包含：

```yaml
---
title: "一篇指南的标题"
summary: "一句话说清这篇解决什么问题。"
stage: "start" # start | make | share
order: 9
level: "零基础"
outcome: "读完后能完成的一件具体小事。"
forWho: "最适合哪类同学。"
updated: "2026-10-18"
sources: # 可选；有外部依据时填写，必须可打开
  - title: "来源标题"
    url: "https://example.com/source"
tools: ["DeepSeek"] # 必须是工具目录里已有的名字
tags: ["示例"]
# 内容状态字段（可选；不写则按「初稿 + 教学示例 + AI 辅助起草」展示）
# reviewed / reviewedBy / needsUpdate / reviewNote / basis / aiUsage / testedOn / testedEnvironment / contributors
---
```

- 正文从 `##` 二级标题开始；页面会自动生成阶段目录、右侧「本页内容」、上一篇/下一篇和章节级搜索记录。
- 一个新模块 = 一个新文件，不需要手改导航或搜索索引；`order` 在同一阶段内排序。
- 正文 900–1500 汉字为宜，一个模块只解决一个问题；至少包含一个真实场景、一个可照做的步骤、一个常见坑或边界提醒。
- 不写作者个人经历冒充普遍结论；如需举例，用明确标注的假设/示例。

### 作品示例

在 [`src/content/works/`](src/content/works/) 新建 Markdown。M0 阶段必须保留：

```yaml
status: "example"
updated: "2026-10-18"
```

不能把策划示例写成真实学生投稿，也不能编造作者、时间和数据。UI 会统一展示「策划示例」。

### 术语

在 [`src/content/glossary/`](src/content/glossary/) 新建 Markdown，文件名（去掉 `.md`）就是 URL 与锚点。frontmatter 与现有词条保持一致；重点字段：

- `term` / `en`：中文名与英文名；
- `category`：必须使用已有分类 id（见 [`src/data/glossary.ts`](src/data/glossary.ts)）；
- `definition`：一句话释义，列表卡片、搜索与页面标题都会用它；
- `example`：校园或学习场景示例；
- `order`：同一分类内排序，从 1 连续；
- `related`：相关词条的 id，详情页会渲染成「接着看」；
- `updated`：最后核对日期；
- `sources`：支持正文事实的官方文档或原始论文（`title` + `url`），详情页会展示为参考来源；不能只写网站名；
- `reviewed` / `reviewedBy`：**实际完成逐条人工核校**后再填日期与审校人（可笔名）。仅补充来源或由 AI 校订不能算人工核校完成。
- `needsUpdate` / `reviewNote`、`basis`、`aiUsage`、`testedOn` / `testedEnvironment`、`contributors`：内容状态与依据字段，定义见 [`docs/CONTENT-REVIEW.md`](docs/CONTENT-REVIEW.md)；`basis: first-hand` 必须填写亲测日期与环境。

正文用二级标题分成固定几节：`一句话说清`、`打个比方`、`它是怎么运作的`、`你会碰到它的场景`、`常见误解`，需要时再加 `想再深入一点`。面向零基础读者，不堆术语；必须出现的术语要当场讲清或指向本表另一条。

### 工具内容

- 工具只收录官方入口，不写聚合站、网盘和邀请码；
- 价格、额度、可用性会变化，不写死具体数字；收录不等于推荐；
- 活动只写已确认的形式和流程，不虚构日期、场地、嘉宾和人数；
- 作品示例要有明确状态标注。
- 社区功能已关闭，不再维护社区数据；如需重启，先走设计/内容评审。

## 6. 本地开发与验证（可选）

环境：Node.js ≥ 22。只想改文字时可以跳过这一节，CI 会在 PR 上运行同样的检查。

```bash
npm install
npm run dev        # http://localhost:4321
npm run verify     # 类型检查 + 生产构建 + 内容测试 + 站内链接检查
```

其他命令：`npm run check`（类型检查）、`npm run check:content`（内容与审校字段一致性检查）、`npm run build`（生成 `dist/`）、`npm run preview`（预览构建产物）、`npm run test`、`npm run check:links`。

### 新增或修改内容后的验证流程

1. `npm run check:content`：检查必填字段、日期格式、order 重复、工具 / 术语引用、审校字段组合等文件级规则；
2. `npm run build`（或直接 `npm run verify`）：Zod schema 校验 + 页面构建 + 内容与搜索测试 + 站内链接检查；
3. 修改了检查规则时，在 [`tests/fixtures/content/`](tests/fixtures/content/) 里补充「合法 / 错误」样例，运行 `npm test` 验证检查器仍然生效，不会污染正式内容。

### 内容缓存排查

**典型症状**：删改 Markdown 后，本地 `npm run verify` 仍按旧内容失败（构建页数、搜索索引或「初稿 / 已人工核校」断言的报错里出现已经删掉的文件），而 CI 是绿的。

原因：Astro 5 把内容层缓存放在 **`node_modules/.astro`**（不是根目录的 `.astro/`），删文件不会自动让它失效。先清缓存再重试：

```powershell
# Windows PowerShell
Remove-Item -Recurse -Force node_modules/.astro, .astro, dist
npm run verify
```

```bash
# macOS / Linux
rm -rf node_modules/.astro .astro dist && npm run verify
```

CI 不受影响：每次 `npm ci` 都是全新的 `node_modules`，不存在旧缓存。

顺带说明：内容检查器会拒绝 schema 之外的**未知字段**（例如已废弃的 `duration`）。Zod 本身会静默忽略这类字段，所以由 `npm run check:content` 显式拦截，避免数据被悄悄丢掉。

### 文档是怎样串起来的

```text
src/content/guide/*.md
        │  frontmatter: stage / order / updated / sources / reviewed
        ▼
GuideNav + 指南首页 + 搜索索引 + 上一篇/下一篇
        │
        └── 构建 → HTML → 内容测试 → 内部链接检查
```

- **Zod schema** 在 [`src/content.config.ts`](src/content.config.ts) 校验字段；字段写错会在构建时失败。
- **导航**从内容集合与 `guideStages` 生成，新增模块不需要改组件。
- **搜索索引**按页面、指南章节、工具、作品和术语生成；章节结果可以跳到正文锚点。
- **页面元信息**从 `updated` 与 `sources` 渲染，编辑链接指向仓库中的真实文件。
- **CI** 在推送和 PR 上运行 `npm run verify`；静态站发布前必须通过。

## 7. 审稿与合并：维护者检查清单

**角色**：贡献者写内容；审阅人核对事实、隐私与版权；合并人（协会维护组成员）负责最终合并。M0 阶段后两个角色由维护组承担。

**合并标准**（四项缺一不可）：

1. CI 的 `verify` 通过；
2. PR 模板填写完整（来源、隐私版权；文档 / 内容类修改需 AI 辅助声明）；
3. 至少一位维护者按下面的清单确认；
4. 没有未解决的讨论。

**审稿清单**：

- **事实与来源**：外部事实是否有可打开的依据；没有依据的表述是否标注「待核实」。
- **真实经历**：是否存在编造的经历、访谈、数据、同学评价；AI 生成内容是否被写成「亲测」。
- **隐私与版权**：姓名、学号、联系方式、聊天记录、未公开数据；图片与引文是否有来源或授权。
- **M0 边界**：示例作品保留「策划示例」标注；活动不写未确认的日期、场地与人数；不写学校授权或合作。
- **状态与 AI 声明**：页面「内容状态」是否与 frontmatter 一致（未审校不得显示已审核）；`basis`、`aiUsage` 是否如实；文档 / 内容类 PR 是否声明 AI 用途。规则见 [`docs/CONTENT-REVIEW.md`](docs/CONTENT-REVIEW.md)。
- **链接与页面**：站内链接与外链可达，无占位文字，移动端不溢出。

**处理方式**：不达标时请求修改；长期无响应可关闭并说明；已合并内容发现事实问题，用 revert 或后续 PR 修正并留下说明。

**节奏建议**：错别字与死链可以当天合；事实类内容必须核实来源再合；结构与视觉改动先走设计评审（[#5](https://github.com/A7m0spHere/CDU-AI/issues/5)），不要用内容 PR 顺带改版。

## 8. AI 辅助贡献的规则

- **适用范围**：仅文档、内容与文案类贡献需要在 PR / issue 中声明 AI 辅助情况；纯工程、样式、测试、构建与配置类 PR 不要求填写 AI 声明。
- **允许**：用 AI 做提纲、润色、翻译、校对，甚至起草初稿。
- **必须（文档 / 内容类）**：在 issue 或 PR 模板里声明具体用途；较大篇幅由 AI 起草时，写清哪一部分。
- **禁止**：虚构经历、访谈、数据、评价；把 AI 生成内容写成「亲测」；把 AI 初稿当作已人工审校；批量生成低质量词条充数量。
- **责任**：真实性与版权由贡献者和审阅人承担。AI 不是作者，CI 绿灯也不等于内容可信。
- 指南 / 术语 / 作品在人工逐条核校前显示「初稿 · 尚未人工核校」；核校完成后由审阅人补 `reviewed` 与 `reviewedBy`，页面自动切换为「已人工核校」，不要为了消掉提示而提前填日期。

## 9. 仓库管理设置（需要管理员权限）

以下为 **2026-10-20 通过 GitHub API 核实**的现状，仅记录事实，不代表已经开启：

| 项目 | 当前状态 |
| --- | --- |
| `main` 分支保护 | 未开启（`GET /branches/main/protection` 返回 404） |
| Rulesets | 无（返回空数组） |
| CODEOWNERS | 已添加 [`.github/CODEOWNERS`](.github/CODEOWNERS)，尚未强制要求 Code Owner 审阅 |
| GitHub Actions | 已启用，`allowed_actions: all`，未要求 SHA pinning |
| 仓库 secrets | CI 未使用；外部 fork 的 PR 默认拿不到 secrets |
| 合并方式 | merge / squash / rebase 均允许，尚未统一 |

建议由维护者按顺序完成（GitHub 网页设置）：

1. Settings → Branches → Add branch protection rule（或 Settings → Rulesets）作用于 `main`：
   - Require a pull request before merging（建议至少 1 位审阅人；单人维护阶段可先保留管理员绕过，或暂不要求 approval）
   - Require status checks to pass：勾选 `verify`，并勾选 Require branches to be up to date
   - Require conversation resolution before merging
   - Block force pushes、Restrict deletions
2. 有第二位维护者后，再开启 Require review from Code Owners；否则单人维护会被自己的 PR 卡住。
3. Settings → Actions → General：Workflow permissions 设为 **Read repository contents only**；非必要不勾选允许 Actions 创建或批准 PR。
4. 统一合并方式：建议只保留 Squash merging，减少历史噪音。
5. 定期检查外部 fork PR 的 CI 日志；CI 只应有 `contents: read` 权限、不读取 secrets（当前 [`.github/workflows/ci.yml`](.github/workflows/ci.yml) 已按此配置）。

核对命令（只读，需要 [GitHub CLI](https://cli.github.com/)）：

```bash
gh api repos/A7m0spHere/CDU-AI/branches/main/protection   # 404 表示未开启
gh api repos/A7m0spHere/CDU-AI/rulesets
```

## 10. 提交信息规范

提交主题使用 `类型: 中文说明`，类型前缀保留英文：

```text
feat: 新增第一次对话指南
fix: 修复移动端正文溢出
docs: 补充内容维护说明
test: 增加内容清单校验
chore: 更新依赖
```

描述要说明「改了什么、为什么改」，避免只写 `update`、`changes` 或「修改」。

## 11. 参考与边界

本项目的内容管理方式参考了 AI-Research-Guide 的清单、内容分层和构建时校验思路，但保留 Astro 的内容集合与静态构建方案；术语定义与正文由本站独立撰写，事实依据以词条 `sources` 中列出的官方文档为准（不再参考第三方术语图鉴）。我们不复制上述项目的代码、品牌或视觉资产。

未来如果增加投稿、评论或成员工作台，再单独设计数据与审核流程；M0 不引入登录、CMS 或后台，也不把生成文本冒充真实经验。
