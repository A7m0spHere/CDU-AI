<img src="public/brand/logo-160.png" width="72" height="72" align="right" alt="CDU AI 角色标识">

# CDU AI

面向成都大学全校同学的开放 AI 学习站与共建项目。先从一个具体问题出发，找到合适的工具，再把可复现的做法整理成指南。

由成都大学计算机协会 AI 方向发起，**非学校官方平台**。

**访问网站：[wiki.cduai.top](https://wiki.cduai.top/)**

[参与共建](CONTRIBUTING.md) · [文档导航](docs/README.md) · [贡献与致谢](CONTRIBUTORS.md) · [反馈问题](https://github.com/A7m0spHere/CDU-AI/issues)

> **M0 · 开发中**：首页、工具目录与指南首页已可浏览，独立指南文章、术语与作品仍在补充。账号、论坛、评论、站内投稿表单和活动报名尚未开放。

![CDU AI 首页：品牌角色、学习入口与栏目导航](docs/screenshots/home.png)

## 当前可以看什么

以下为 **2026-10-28 的仓库内容快照**。页面中的栏目与数量由数据生成，收录不等于推荐。

- **首页**：三组共 15 个 AI 应用场景，支持换卡浏览；「开始探索AI」用抽象点阵与流动菜单连接指南、工具和术语。场景展示不代表站内提供相应执行能力。
- **工具资源**：106 项工具与社区资源、10 个一级分类；每项只保留一个主栏目，OCR 独立成栏，AIGC 包含设计、演示、文档和创作工作流；支持栏目内搜索与能力筛选，更多开源 Agent 默认折叠，暂不收录独立模型。
- **AI 术语表**：已有「AI 幻觉」人工核校示范词条，其他词条待社区补充。
- **学习指南**：指南首页已有基础介绍与插图，六个目录分组已建立，独立指南文章待补充。
- **作品广场**：当前为空；新增示例时会明确标注「策划示例」。
- **社区与活动**：社区暂不开放；活动页展示形式规划，没有真实排期。
- **站内搜索**：支持页面、工具与现有内容检索；快捷键为 Ctrl / Cmd + K。
- **主题与阅读**：支持浅色、深色、预设和自定义主题，可调整配色、背景与字体；动效尊重系统的减少动效设置。

<details>
<summary>查看首页应用场景与探索入口</summary>

![首页应用场景：探索与理解、表达与创作、动手与实现三组叠卡，每组五个场景](docs/screenshots/home-scenarios.png)

![开始探索AI：随主题配色的抽象点阵，以及指南、工具、术语三个流动菜单入口](docs/screenshots/home-explore.png)

</details>

<details>
<summary>查看工具目录界面</summary>

![工具资源页：场景筛选、能力筛选及工具卡片](docs/screenshots/tools.png)

</details>

以上截图来自 2026-10-27 的本地生产构建，展示首页与工具目录界面，内容数量以当前页面为准；不代表已完成 M0 阶段验收。

## 参与共建

不需要先会编程。可以从一处错误、一条来源或一次真实使用经验开始：

- **纠正内容**：使用 [文档纠错表单](https://github.com/A7m0spHere/CDU-AI/issues/new?template=doc-correction.yml)，或从内容详情页底部的「在 GitHub 编辑本页」提交修改。
- **分享实践**：使用 [经验投稿表单](https://github.com/A7m0spHere/CDU-AI/issues/new?template=experience-submission.yml)，写清实际需求、做法、结果与遇到的问题。
- **推荐或更新工具**：使用 [工具建议表单](https://github.com/A7m0spHere/CDU-AI/issues/new?template=tool-suggestion.yml)，由维护者核对后入库。
- **改代码、样式或测试**：阅读 [贡献指南](CONTRIBUTING.md)，按 PR 模板说明修改与验证结果。

AI 可以辅助整理和起草，但不能虚构经历、数据或同学评价。内容类贡献需要声明 AI 用途，内容审核与真实使用经验分别记录；开发者可使用 AI 初审和辅助审核，最终结论由审核负责人确认。署名规则见 [贡献指南第 8 节](CONTRIBUTING.md#8-署名与致谢)。

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

[代码许可（MIT）](LICENSE) · [素材来源与使用说明](docs/README.md#品牌素材与截图) · [贡献与致谢](CONTRIBUTORS.md)
