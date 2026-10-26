# 参与共建

这是一个开放共建的站点，**不需要会写代码**也能参与：在 GitHub 网页上点几下，就能改一个错别字、指出一处错误，或分享一次真实使用经验。本文说明网页贡献、本地验证、审稿与署名流程；字段细节和维护操作通过链接查阅。

贡献者名单和参考项目统一收录在 [贡献与致谢](CONTRIBUTORS.md)，技术文档入口见 [文档导航](docs/README.md)。

## 1. 入口一览

| 我想…… | 从哪里开始 | 需要什么 |
| --- | --- | --- |
| 改几个字、修一句话 | 打开对应页面 → 底部的「在 GitHub 编辑本页」 | GitHub 账号 |
| 指出错误，但不确定怎么改 | [文档纠错 issue](https://github.com/A7m0spHere/CDU-AI/issues/new?template=doc-correction.yml) | GitHub 账号 |
| 分享一次真实使用经验 | [经验投稿 issue](https://github.com/A7m0spHere/CDU-AI/issues/new?template=experience-submission.yml) | GitHub 账号、真实经历 |
| 推荐或更新工具 | [工具建议 issue](https://github.com/A7m0spHere/CDU-AI/issues/new?template=tool-suggestion.yml) | GitHub 账号 |
| 改代码、样式或测试 | 读第 6 节，按 PR 流程提交 | Node.js ≥ 22（可选） |
| 想改名或撤下署名 | 见第 8 节；默认提交 PR 即署名，名单在 [CONTRIBUTORS.md](CONTRIBUTORS.md) | 一个 GitHub 账号 |

所有贡献默认按仓库 [LICENSE](LICENSE)（MIT）发布。M0 不开放匿名投稿：贡献需要一个公开的 GitHub 账号。

## 2. 最快的一次贡献：在网页上改几个字

不用命令行，也不用懂 Astro。以一篇指南为例：

1. 打开要修改的页面。学习指南、术语和作品详情页的底部都有「在 GitHub 编辑本页」。
2. 点击链接，会直接跳到仓库里对应的 Markdown 文件（`src/content/…/*.md`）。
3. 没有登录时 GitHub 会提示登录或注册；GitHub 会自动 Fork 一份到你的账号下。
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
| 指南阶段与阅读顺序 | frontmatter 的 `stage` 决定阶段归属，`order` 决定全局阅读顺序 |
| 指南目录分组与规划条目 | [`src/data/guide-nav.ts`](src/data/guide-nav.ts)；新增指南必须登记对应 slug |
| 作品示例 | [`src/content/works/`](src/content/works/) |
| AI 术语正文 | [`src/content/glossary/`](src/content/glossary/)，一个词一篇 Markdown（含白话详解） |
| 术语分类 | [`src/data/glossary.ts`](src/data/glossary.ts) 中的 `glossaryCategories` |
| 工具目录 | [`src/data/tools.ts`](src/data/tools.ts)；社区通过工具建议 Issue 提供线索，由维护者核对后入库，暂不迁移 Markdown |
| 活动、首页入口 | `src/data/events.ts`、`home.ts` |
| 全站搜索索引 | [`src/pages/search-index.json.ts`](src/pages/search-index.json.ts)，构建时生成，不要手工编辑 |
| 技术文档 | [`docs/`](docs/)：架构、内容规范、设计系统 |
| 内容状态与审校规范 | [`docs/CONTENT-REVIEW.md`](docs/CONTENT-REVIEW.md)：状态模型、审校清单、署名与迁移规则 |
| 内容与页面测试 | [`tests/site.test.mjs`](tests/site.test.mjs) |
| 内容一致性检查 | [`scripts/check-content.mjs`](scripts/check-content.mjs) 与 `tests/fixtures/content/`（合法 / 错误条目样例） |
| 写作模板 | `src/content/{guide,works,glossary}/_TEMPLATE.md`，以 `_` 开头，不参与构建 |
| 协作模板与 CI | [`.github/`](.github/)：Issue 表单、PR 模板、CODEOWNERS、工作流 |

## 5. 各内容类型的字段与写法

从对应目录的 `_TEMPLATE.md` 复制文件，去掉文件名开头的下划线，再填写正文与 frontmatter。模板不参与站点构建；正式内容逐步补充即可。

| 内容 | 按哪份规范填写 |
| --- | --- |
| 学习指南 | [指南字段与新增流程](docs/CONTENT-GUIDE.md#3-学习指南-frontmatter)：登记目录 slug；`stage` 负责阶段归属，`order` 在指南集合内全局唯一 |
| 作品 | [作品示例规范](docs/CONTENT-GUIDE.md#4-作品示例-frontmatter)：M0 保留 `status: example`，不写成真实学生投稿 |
| 术语 | [术语写作规范](docs/CONTENT-GUIDE.md#5-术语表)：区分 AI 与延伸分支，正文由人规划起草；可选交互区块见模板 |
| 工具 | [工具数据规范](docs/CONTENT-GUIDE.md#6-工具数据)：维护 TypeScript 数组，核对官方入口、来源与图标 |
| 内容状态 | [审校规范](docs/CONTENT-REVIEW.md)：依据、AI 参与、亲测环境与审校记录按实际填写；审核负责人确认结论前保留初稿状态 |

外链协议、来源格式和提交前内容检查统一见 [内容维护规范](docs/CONTENT-GUIDE.md)。指南与作品目前待补充，术语库已有「AI 幻觉」示范词条；新增内容仍从模板开始。

## 6. 本地开发与验证（可选）

环境：Node.js ≥ 22。只改文字可以使用 GitHub 网页，CI 会在 PR 上执行同样的检查。

```bash
npm ci
npm run dev        # http://localhost:4321
npm run verify     # 类型检查、内容与文档校验、构建、测试、站内链接检查
```

快速检查：`npm run check:content` 检查内容字段与引用；`npm run check:docs` 检查文档链接、图片、锚点和 YAML 示例。完整验证使用 `npm run verify`，单独运行页面测试前先构建。

缓存排障、检查器维护和各命令的边界见 [维护者操作说明](docs/MAINTAINING.md)；内容如何生成导航与搜索见 [架构说明](docs/ARCHITECTURE.md#4-内容模型)。

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

**合并之后**：把贡献者记进 [CONTRIBUTORS.md](CONTRIBUTORS.md)（默认用 GitHub 账号并加链接，也可用笔名或匿名），规则见第 8 节。

**节奏建议**：错别字与死链可以当天合；事实类内容必须核实来源再合；结构与视觉改动先说明方案，按[现行设计系统](docs/DESIGN-SYSTEM.md)评审，并提供相关截图，不要用内容 PR 顺带改版。

## 8. 署名与致谢

被记录的贡献会写进 [CONTRIBUTORS.md](CONTRIBUTORS.md)。**提交 PR 即视为同意署名**，不需要单独申请；这一节说明「记什么、记在哪、用什么名字、怎么改」。

### 8.1 哪些贡献会被记录

代码与测试、文档与指南、内容校对与审校、视觉与插画、真实使用经验、有效建议与 Bug 反馈、社区答疑与组织。**不是只有合并的代码才算**：指出一处错误、补一条来源、提一次有效反馈，都可以记名。

### 8.2 记在哪里

| 位置 | 内容 | 谁维护 |
| --- | --- | --- |
| [CONTRIBUTORS.md](CONTRIBUTORS.md) | 站点级贡献名单与参考项目：记录参与方向、具体成果及来源 | 维护组，随贡献与资料更新 |
| 内容页 frontmatter `contributors` | 单篇指南 / 术语 / 作品的贡献者代称（≤ 5 个），显示在页面底部「内容状态」 | 该内容的贡献者与审校人 |

字段规则见 [docs/CONTENT-REVIEW.md](docs/CONTENT-REVIEW.md) 第 3.4 节。

### 8.3 用什么名字

默认用 **GitHub 账号**，并在名单里做成指向个人主页的链接（如 [@A7m0spHere](https://github.com/A7m0spHere)）；如果更愿意用昵称、笔名或「某专业同学」这类匿名代称，就只写文字、不放链接。**不要求公开真实姓名、学号、专业或联系方式**；需要联系时维护组通过你的 GitHub 账号沟通，不把个人信息写进仓库或页面。

### 8.4 怎么申请或修改署名

- **提交 PR 即视为同意署名**：维护者合并时会把你的 GitHub 账号记进 `CONTRIBUTORS.md` 并链接到个人主页，不需要单独申请。
- 想换个名字（昵称 / 笔名 / 匿名代称）：在 PR 描述里写一句「署名用 XXX」即可；不希望在名单里出现，也直接说。
- 已经合并但没被记录：开一个空白 issue（或在任意 issue 里留言），说明你做了什么并附上 PR / Issue 链接，维护组核对后补记。
- 想改名或撤下：同样说一声即可，不需要理由。

### 8.5 GitHub 以外的贡献

线下或群里的建议、Bug 反馈、帮忙校对也可以记名，但需要满足两点：**贡献事实可确认**（维护者能复述具体内容或结果）、**本人同意署名**。没有确认前不写进名单，也不替别人认领贡献。

### 8.6 几条底线

- 不按提交次数、代码行数或时间排名，也不做贡献排行榜。
- 不虚构贡献者或贡献记录；没有实际参与的署名会被撤下。
- 不因为署名要求贡献者公开个人信息。

## 9. AI 辅助贡献的规则

- **适用范围**：仅文档、内容与文案类贡献需要在 PR / issue 中声明 AI 辅助情况；纯工程、样式、测试、构建与配置类 PR 不要求填写 AI 声明。
- **允许**：一般内容可用 AI 做提纲、润色、翻译、校对或起草初稿。术语库按[专属写作规范](docs/CONTENT-GUIDE.md#5-术语表)由人规划起草，AI 协助查证、润色与工程校验。
- **必须（文档 / 内容类）**：在 issue 或 PR 模板里声明具体用途；较大篇幅由 AI 起草时，写清哪一部分。
- **禁止**：虚构经历、访谈、数据、评价；把 AI 生成内容写成「亲测」；把未经确认的 AI 初审结果当作最终审核结论；批量生成低质量词条充数量。
- **责任**：真实性与版权由贡献者和审阅人承担。AI 不是作者，CI 绿灯也不等于内容可信。
- 开发者可以使用 AI 初审、来源查证与辅助审核，审核方式和发现的问题记录在 GitHub PR / Issue 或仓库文档中。指南 / 术语 / 作品在审核负责人确认结论前显示「初稿 · 尚未审核」；确认后同时填写 `reviewed` 与 `reviewedBy`，页面显示「已审核无误」。该状态不表示完全由人工审核；不因 AI 自评或 CI 通过自动补写结论。

## 10. 仓库管理设置（需要管理员权限）

分支保护、Rulesets、Actions 权限、合并方式和只读核对命令见 [维护者操作说明](docs/MAINTAINING.md#仓库管理设置)。其中保留了 2026-10-20 的核对快照；使用前需重新核实远端状态。

## 11. 提交信息规范

提交主题使用 `类型: 中文说明`，类型前缀保留英文：

```text
feat: 新增第一次对话指南
fix: 修复移动端正文溢出
docs: 补充内容维护说明
test: 增加内容清单校验
chore: 更新依赖
```

描述要说明「改了什么、为什么改」，避免只写 `update`、`changes` 或「修改」。

## 12. 资料与阶段边界

参考项目与借鉴范围集中记录在 [贡献与致谢](CONTRIBUTORS.md#参考项目与资料)。内容的事实依据仍需逐篇写进 `sources`，不能用项目致谢代替引用。

未来如果增加投稿、评论或成员工作台，再单独设计数据与审核流程；M0 不引入登录、CMS 或后台，也不把生成文本冒充真实经验。
