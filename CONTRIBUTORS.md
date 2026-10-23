# 贡献者

> 记录已经确认的贡献：代码、文档、内容校对、视觉设计、真实使用经验、有效建议与 Bug 反馈。
> 项目仍在 M0 阶段，名单只收「能对应到具体 PR / Issue / 实际成果」的贡献，**不做排名，也不按提交次数排序**。
> 想被记名、改名或撤下，见 [CONTRIBUTING.md 第 8 节](CONTRIBUTING.md#8-署名与致谢)。

## 项目发起与维护

**[A7m0spHere](https://github.com/A7m0spHere)**（git 署名 `A7m` / `A7m0spHere`）— 发起项目并负责日常维护：

- **站点框架与内容管线**：Astro 静态站、内容集合 schema、构建时搜索索引、站内链接检查与 CI `npm run verify`（PR #10–#13、#18、#25）。
- **内容可信度机制**：内容状态与人工审校标注（#3 / PR #11）、GitHub 网页共建与审稿流程（#2 / PR #10）。
- **视觉与交互**：设计系统与分阶段视觉升级（#5 / PR #14、#15、#17）、术语模块与分支树导航（PR #19、#20）、学习指南目录六分组（PR #25）、导航与关于页调整（PR #21）。
- **安全与目录维护**：外链协议白名单三层拦截（#22 / PR #24）、工具目录改为维护者按需添加（#8 / PR #23）。
- **文档**：[ARCHITECTURE](docs/ARCHITECTURE.md)、[CONTENT-GUIDE](docs/CONTENT-GUIDE.md)、[CONTENT-REVIEW](docs/CONTENT-REVIEW.md)、[DESIGN-SYSTEM](docs/DESIGN-SYSTEM.md)、[GLOSSARY-PLAN](docs/GLOSSARY-PLAN.md)、[CONTRIBUTING](CONTRIBUTING.md) 与 README 的持续维护。
- **内容审校**：首条人工核校术语「AI 幻觉」（`reviewedBy: A7m`，2026-10-21）。

## 内容与结构贡献

**[FJHin](https://github.com/FJHin)**（git 署名 `Scenic`）— **PR #1**（2026-10-18）：把术语表从 `src/data/glossary.ts` 的数组迁移为 Markdown 内容集合，新增 `/glossary/[id]/` 详情页（一句话说清 / 打个比方 / 它是怎么运作的 / 你会碰到它的场景 / 常见误解），改造搜索索引与分类筛选，并补上内容层测试（49 个文件，+2255 / −411）。这批词条正文在 2026-10-20 的内容重建（#13）中清空重写，但内容集合、详情页与字段校验的结构沿用至今。

## 代码与交互

**[kdjdhe](https://github.com/kdjdhe)**（git 署名 `Super`）— **PR #26**（2026-10-23）：首页 ASCII「AI」的指针交互从整块视差改为逐字符局部驱散（半径与最大位移按字符格换算、移开后带阻尼回位），并让 `prefers-reduced-motion` 下完全不响应指针，同时修掉指针状态可能残留的问题。

## 建议、反馈与社区支持

暂无已确认记录。这类贡献同样会被记录：线下或群里的有效建议、Bug 反馈、帮忙校对都可以，前提是**贡献事实可确认**且**本人同意署名**。

## 说明

- **记录标准**：能对应到具体 PR、Issue 或实际成果；未经确认的口头贡献先不写进名单，也不替别人认领。
- **不做排名**：不按提交次数、代码行数或时间排序。一次有效反馈和一次大改动同样值得记。
- **署名方式**：GitHub 用户名、昵称、笔名或匿名代称都可以；不要求公开真实姓名、学号、专业或联系方式。
- **更正与撤下**：随时可以在 issue / PR 里说一声，改名字或撤下都会照办，不需要理由。
- **内容页署名**：单篇指南 / 术语 / 作品的贡献者另见 frontmatter 的 `contributors` 字段，规则在 [docs/CONTENT-REVIEW.md](docs/CONTENT-REVIEW.md) 第 3.4 节。
