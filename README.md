<img src="public/brand/logo-160.png" width="72" height="72" align="right" alt="CDU AI 角色标识">

# CDU AI

面向成都大学全校同学的开放 AI 学习站与共建项目。先从一个具体问题出发，找到合适的工具，再把可复现的做法整理成指南。

由成都大学计算机协会 AI 方向发起，**非学校官方平台**。

[参与共建](CONTRIBUTING.md) · [文档导航](docs/README.md) · [贡献与致谢](CONTRIBUTORS.md) · [反馈问题](https://github.com/A7m0spHere/CDU-AI/issues)

> **M0 · 开发中**：站点框架和工具目录已可使用，指南、术语与作品仍在补充。账号、论坛、评论、站内投稿表单和活动报名尚未开放。

![CDU AI 首页：学习入口、项目定位与当前开发状态](docs/screenshots/home.png)

## 当前可以看什么

以下为 **2026-10-24 当前分支的内容快照**。栏目与内容数量由页面数据生成，收录不等于推荐。

| 栏目 | 可用内容与进度 |
| --- | --- |
| 工具资源 | 91 项工具与社区资源、12 个一级分类；各栏目按用途分区，语音与音频统一入口；支持栏目内搜索与能力筛选，更多社区 Agent 默认折叠，暂不收录独立模型 |
| AI 术语表 | 已有「AI 幻觉」人工核校示范词条，其他词条待社区补充 |
| 学习指南 | 三阶段学习路径与六个目录分组已建立，指南正文待补充 |
| 作品广场 | 当前为空；新增示例时会明确标注「策划示例」 |
| 社区与活动 | 社区暂不开放；活动页展示形式规划，没有真实排期 |
| 站内搜索 | 支持页面、工具与现有内容检索；快捷键为 Ctrl / Cmd + K |

<details>
<summary>查看工具目录界面</summary>

![工具资源页：场景筛选、能力筛选及工具卡片](docs/screenshots/tools.png)

</details>

截图来自 2026-10-24 的本地开发构建，主要展示界面布局，内容数量以当前页面为准；不代表已完成 M0 阶段验收。

## 参与共建

不需要先会编程。可以从一处错误、一条来源或一次真实使用经验开始：

- **纠正内容**：使用 [文档纠错表单](https://github.com/A7m0spHere/CDU-AI/issues/new?template=doc-correction.yml)，或从内容详情页底部的「在 GitHub 编辑本页」提交修改。
- **分享实践**：使用 [经验投稿表单](https://github.com/A7m0spHere/CDU-AI/issues/new?template=experience-submission.yml)，写清实际需求、做法、结果与遇到的问题。
- **推荐或更新工具**：使用 [工具建议表单](https://github.com/A7m0spHere/CDU-AI/issues/new?template=tool-suggestion.yml)，由维护者核对后入库。
- **改代码、样式或测试**：阅读 [贡献指南](CONTRIBUTING.md)，按 PR 模板说明修改与验证结果。

AI 可以辅助整理和起草，但不能虚构经历、数据或同学评价。内容类贡献需要声明 AI 用途，人工审校与真实使用经验分别记录。署名规则见 [贡献指南第 8 节](CONTRIBUTING.md#8-署名与致谢)。

## 本地运行

需要 **Node.js ≥ 22**。仓库使用 Astro 5、TypeScript 和原生 CSS，构建产物为静态文件。

```bash
npm ci
npm run dev
```

打开 [http://localhost:4321](http://localhost:4321) 查看本地站点。

```bash
npm run verify   # 类型检查、内容与文档校验、构建、测试与站内链接检查
npm run build    # 生成 dist/
npm run preview  # 预览构建产物
```

不需要配置数据库或模型 API Key。站点本身不调用大模型服务。

## 内容与开发文档

- [文档导航](docs/README.md)：按内容维护、工具目录、设计与开发任务查找说明。
- [贡献指南](CONTRIBUTING.md)：GitHub 网页贡献、本地开发、审稿与署名流程。
- [内容维护规范](docs/CONTENT-GUIDE.md) / [内容可信度与审校](docs/CONTENT-REVIEW.md)：字段、写作模板、来源与审核状态。
- [架构说明](docs/ARCHITECTURE.md)：内容模型、目录组织、验证流程与阶段边界。

内容放在 `src/content/`；工具等结构化数据放在 `src/data/`。新增指南时，还需在 `src/data/guide-nav.ts` 登记目录位置。详细文件地图和操作步骤见贡献指南。

## 许可与素材

代码许可见 [MIT License](LICENSE)。角色插画由维护者提供，复用请先联系维护组；第三方品牌图标的出处与使用说明见 [图标来源记录](docs/TOOL-LOGOS.md)。

贡献者名单与项目致谢统一记录在 [CONTRIBUTORS.md](CONTRIBUTORS.md)。
