# 文档导航

第一次了解项目，请先看 [项目 README](../README.md)。贡献方式与审稿流程见 [CONTRIBUTING.md](../CONTRIBUTING.md)；贡献者名单及参考项目致谢统一放在 [CONTRIBUTORS.md](../CONTRIBUTORS.md)。

## 按任务查找

| 我想做什么 | 先看哪里 |
| --- | --- |
| 在 GitHub 网页改字、反馈错误或分享经验 | [贡献指南](../CONTRIBUTING.md) |
| 新增指南、术语或作品示例 | [内容维护规范](CONTENT-GUIDE.md) |
| 核对来源、记录内容审核或真实经验 | [内容可信度与审校](CONTENT-REVIEW.md) |
| 新增、更新或核对工具条目 | [工具条目规范](CONTENT-GUIDE.md#6-工具数据) |
| 替换工具图标、追溯来源 | [工具图标来源与处理](TOOL-LOGOS.md) |
| 查看 Agent 收录、旧名和仓库迁移依据 | [Agent 目录核对记录](AGENT-CATALOG-REVIEW.md) |
| 查看书签增补、去重与暂缓收录依据 | [工具目录增补记录](TOOL-CATALOG-REVIEW.md) |
| 调整栏目、内容模型、构建或部署 | [架构说明](ARCHITECTURE.md) |
| 调整视觉、组件与交互 | [设计系统](DESIGN-SYSTEM.md) / [设计评审与修订记录](DESIGN-REVIEW.md) |
| 参与术语库规划与分类治理 | [术语库规划](GLOSSARY-PLAN.md) |
| 查看术语词条 P0 审核范围与结论 | [2026-10-31 术语审核记录](GLOSSARY-REVIEW-20261031.md) |
| 查看术语词条 P1 审核范围、取舍与依据 | [2026-11-01 术语审核记录](GLOSSARY-REVIEW-20261101.md) |
| 查看术语词条 P2 AI 初审结果与待二审项 | [2026-11-01 P2 初审记录](GLOSSARY-REVIEW-P2-20261101.md) |
| 查看术语选题清单与分批切法 | [术语选题清单](GLOSSARY-TERMS.md) |
| 排查缓存、检查文档或管理仓库设置 | [维护者操作说明](MAINTAINING.md) |
| 补充或修改贡献记录、项目参考来源 | [贡献与致谢](../CONTRIBUTORS.md) |

## 内容与页面的对应关系

| 内容 | 源文件 | 维护要点 |
| --- | --- | --- |
| 学习指南 | [`src/content/guide/`](../src/content/guide/) | 复制模板后，在 [`guide-nav.ts`](../src/data/guide-nav.ts) 登记 slug 和分组 |
| 术语 | [`src/content/glossary/`](../src/content/glossary/) | 分类取自 [`glossary.ts`](../src/data/glossary.ts)，审核结论按实际情况标注 |
| 作品示例 | [`src/content/works/`](../src/content/works/) | M0 保留 `status: example`，不虚构真实投稿 |
| 工具目录 | [`src/data/tools.ts`](../src/data/tools.ts) | 官网和仓库入口分别维护，图标来源同步记录 |
| 活动形式与项目路线 | [`src/data/events.ts`](../src/data/events.ts) | 只写已确认的形式，不填写虚构排期 |
| 搜索索引 | [`src/pages/search-index.json.ts`](../src/pages/search-index.json.ts) | 构建时从内容与数据生成，不直接编辑构建产物 |

以 `_` 开头的 Markdown 文件不作为内容集合条目加载：`_TEMPLATE.md` 是写作模板；[`_HOME.md`](../src/content/guide/_HOME.md) 是指南首页正文，由页面直接导入并参与构建。首页的审核记录方式见[内容审校规范](CONTENT-REVIEW.md#指南首页与独立页面正文)。指南、术语和作品允许逐步补充，新增内容仍从各自模板开始。

## 验证入口

本地安装依赖后运行 `npm run verify`，统一执行类型检查、内容与文档校验、构建、测试和站内链接检查。`npm run build` 只生成构建产物，单独运行页面测试前需要先构建。只检查说明文档可运行 `npm run check:docs`，覆盖范围见 [维护者操作说明](MAINTAINING.md#文档检查范围)。

文档或截图更新还需检查本地路径、标题锚点、图像引用及当前内容状态。页面视觉、可访问性与内容审核结论分别记录，构建成功不等于 M0 阶段验收完成。

## 文档职责

贡献指南负责参与与合并流程；内容规范负责字段与写法；审校规范负责真实性、状态与核校流程；架构和设计系统描述当前实现。术语规划保留分类目标与分工，术语选题清单保留逐条选题、口径草稿与批次切分，设计评审、Agent 核对记录和仓库设置快照保留各自日期下的历史依据，不作为当前完成状态。

## 品牌、素材与截图

| 资源 | 位置与说明 |
| --- | --- |
| 站点 Logo | [`LogoMark.astro`](../src/components/LogoMark.astro)，使用 [`logo-160.png`](../public/brand/logo-160.png)，另保留 [`512px 版本`](../public/brand/logo-512.png) |
| 浏览器与 PWA 图标 | [`site.webmanifest`](../public/site.webmanifest)、[`favicon-32.png`](../public/favicon-32.png)、[`apple-touch-icon.png`](../public/apple-touch-icon.png) |
| 首页角色插画 | [`mascot.webp`](../public/brand/mascot.webp)；原始插画保存在 [`docs/design/brand/`](design/brand/) |
| 作品封面组件 | [`WorkArt.astro`](../src/components/WorkArt.astro)，当前用于示例版式 |
| 工具品牌图标 | [`public/tool-logos/`](../public/tool-logos/)，来源与处理方式见 [TOOL-LOGOS.md](TOOL-LOGOS.md) |
| 主题图片、贴图与字体 | 来源、署名及各自许可见 [THEME-ASSETS.md](THEME-ASSETS.md) |
| README 界面预览 | [`home.png`](screenshots/home.png) / [`home-scenarios.png`](screenshots/home-scenarios.png) / [`home-explore.png`](screenshots/home-explore.png) / [`tools.png`](screenshots/tools.png)，2026-10-27 本地生产构建截图 |

代码使用 [MIT License](../LICENSE)。角色插画由维护者提供，复用请先联系维护组；第三方工具品牌图标的出处与使用说明见 [TOOL-LOGOS.md](TOOL-LOGOS.md)。主题图片、像素贴图与字体按 [THEME-ASSETS.md](THEME-ASSETS.md) 中记录的来源、署名及各自许可使用，其中奶鲸为维护者确认的 AI 创作图，鲸鱼娘沿用上游标注的 CC BY-NC-SA 4.0。

`docs/screenshots/` 中其他截图保留为历史版式资料，不用来说明当前内容数量或完成状态。
