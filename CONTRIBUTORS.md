# 贡献与致谢

> 本项目由同学发起和维护，代码、文档、内容校对、视觉设计、真实使用经验、有效建议与 Bug 反馈都算贡献。
> 名单里的人名统一使用 **GitHub 账号**，点击可进入对应主页；只收录「能对应到具体 PR / Issue / 实际成果」的贡献，**不做排名，也不按提交次数排序**。
> 提交 PR 即视为同意以 GitHub 账号署名；想改名或撤下，见 [CONTRIBUTING.md 第 8 节](CONTRIBUTING.md#8-署名与致谢)。

本文统一记录贡献者与参考项目。项目介绍和使用入口见 [README](README.md)，参与方式见 [贡献指南](CONTRIBUTING.md)。

## 名单

| 贡献者 | 参与方向 | 对应记录 |
| --- | --- | --- |
| [@A7m0spHere](https://github.com/A7m0spHere) | 项目发起与维护 | PR #10–#25、#27，issue #2–#9、#22 |
| [@FJHin](https://github.com/FJHin) | 内容与结构 | PR #1 |
| [@kdjdhe](https://github.com/kdjdhe) | 内容初稿、代码与交互 | PR #26、[PR #35](https://github.com/A7m0spHere/CDU-AI/pull/35) |
| [@QiLiMiao](https://github.com/QiLiMiao) | 主题系统与交互 | [PR #31](https://github.com/A7m0spHere/CDU-AI/pull/31)、[PR #32](https://github.com/A7m0spHere/CDU-AI/pull/32) |

## 项目发起与维护

**[@A7m0spHere](https://github.com/A7m0spHere)**（git 署名 `A7m` / `A7m0spHere`）— 发起项目并负责日常维护：

- **站点框架与内容管线**：Astro 静态站、内容集合 schema、构建时搜索索引、站内链接检查与 CI `npm run verify`（PR #10–#13、#18、#25）。
- **内容可信度机制**：内容状态与人工审校标注（#3 / PR #11）、GitHub 网页共建与审稿流程（#2 / PR #10）。
- **视觉与交互**：设计系统与分阶段视觉升级（#5 / PR #14、#15、#17）、术语模块与分支树导航（PR #19、#20）、学习指南目录六分组（PR #25）、导航与关于页调整（PR #21）。
- **安全与目录维护**：外链协议白名单三层拦截（#22 / PR #24）、工具目录改为维护者按需添加（#8 / PR #23）。
- **文档**：[ARCHITECTURE](docs/ARCHITECTURE.md)、[CONTENT-GUIDE](docs/CONTENT-GUIDE.md)、[CONTENT-REVIEW](docs/CONTENT-REVIEW.md)、[DESIGN-SYSTEM](docs/DESIGN-SYSTEM.md)、[GLOSSARY-PLAN](docs/GLOSSARY-PLAN.md)、[CONTRIBUTING](CONTRIBUTING.md)、[CONTRIBUTORS](CONTRIBUTORS.md) 与 README 的持续维护。
- **内容审校**：首条人工核校术语「AI 幻觉」的审校签字（`reviewed: 2026-10-21` / `reviewedBy: A7m`，见 [src/content/glossary/hallucination.md](src/content/glossary/hallucination.md)）。

## 内容与结构贡献

**[@FJHin](https://github.com/FJHin)**（git 署名 `Scenic`）— **PR #1**（2026-10-18）：把术语表从 `src/data/glossary.ts` 的数组迁移为 Markdown 内容集合，新增 `/glossary/[id]/` 详情页（一句话说清 / 打个比方 / 它是怎么运作的 / 你会碰到它的场景 / 常见误解），改造搜索索引与分类筛选，并补上内容层测试（49 个文件，+2255 / −411）。这批词条正文在 2026-10-20 的内容重建（#13）中清空重写，但内容集合、详情页与字段校验的结构沿用至今。

**[@kdjdhe](https://github.com/kdjdhe)**（git 署名 `Super`）— **[PR #35](https://github.com/A7m0spHere/CDU-AI/pull/35)**（2026-10-30）：补齐 AI 术语表 12 个分类共 64 条词条初稿（含场景拆解、选择题与 Agent 提示词）与 [术语选题清单](docs/GLOSSARY-TERMS.md)；词条均标注为初稿，待按[审校规范](docs/CONTENT-REVIEW.md)逐条核校。

## 代码与交互

**[@kdjdhe](https://github.com/kdjdhe)**（git 署名 `Super`）— **PR #26**（2026-10-23）：首页 ASCII「AI」的指针交互从整块视差改为逐字符局部驱散（半径与最大位移按字符格换算、移开后带阻尼回位），并让 `prefers-reduced-motion` 下完全不响应指针，同时修掉指针状态可能残留的问题。

**[@QiLiMiao](https://github.com/QiLiMiao)** — **[PR #31](https://github.com/A7m0spHere/CDU-AI/pull/31)**（2026-10-24）：贡献可视化主题系统，包括主题选择面板、预设主题、自定义编辑器、背景图片和 JSON 导入导出，并将全站样式接入主题令牌。

在 **[PR #32](https://github.com/A7m0spHere/CDU-AI/pull/32)**（2026-10-27）中继续扩展主题系统：新增 7 个预设主题，按浅色、深色与特色分组，加入像素贴图、角色背景，以及字体风格选择与字体文件导入支持。

## 参考项目与资料

以下项目为本站的信息组织、作品展示或贡献记录方式提供了参考。这里记录具体借鉴范围，与上方的人员贡献分别列出。

| 项目 | 参考范围 |
| --- | --- |
| [AI 科研入门指南](https://github.com/Takamatsu-Hikaru/AI-Research-Guide) | 按阶段组织长文、内容清单，以及从内容生成导航与校验的组织方式；本站沿用自己的 Astro 实现 |
| [AI Demo 作品集](https://github.com/deepdemos/ds-demos-showcase) | 作品广场的分类、状态标注与记录创作过程的思路 |
| [WayToAGI](https://github.com/WayToAGI) | 按工具和使用场景组织目录入口的方式 |
| [dsh-status-rotator](https://github.com/01Virex/dsh-status-rotator) | 按贡献类型分组、关联 PR、支持笔名与匿名的致谢记录方式；本文件按这一组织思路编写 |

页面排版与动效参考的对应关系见 [设计评审记录](docs/DESIGN-REVIEW.md#3-参考与借鉴边界) 和 [设计系统](docs/DESIGN-SYSTEM.md)。第三方工具图标的出处与处理方式单独记录在 [TOOL-LOGOS.md](docs/TOOL-LOGOS.md)。

## 记录说明

- **记什么**：代码与测试、文档与指南、内容校对与审校、视觉与插画、真实使用经验、有效建议与 Bug 反馈、社区答疑与组织。建议与反馈类贡献会记在「名单」里，目前暂无已确认记录；有的话按同样格式补一行。
- **记录格式**：一条记录写清「做了什么 → 对应 PR / Issue / 文件 → 日期」，不写主观评价；新贡献插到对应分类下，并在「名单」表补一行。
- **不做排名**：不按提交次数、代码行数或时间排序。一次有效反馈和一次大改动同样值得记。
- **署名方式**：**提交 PR 即视为同意以 GitHub 账号记入本名单**，名字做成指向个人主页的链接；如果更愿意用昵称、笔名或匿名代称，只写文字、不放链接（追溯方式由维护组内部保留），不希望被记名也可以直接说，随时撤下。
- **更正与撤下**：随时可以在 issue / PR 里说一声，改名字或撤下都会照办，不需要理由。
- **内容页署名**：单篇指南 / 术语 / 作品的贡献者另见 frontmatter 的 `contributors` 字段，规则在 [docs/CONTENT-REVIEW.md](docs/CONTENT-REVIEW.md) 第 3.4 节；两处不重复维护。
