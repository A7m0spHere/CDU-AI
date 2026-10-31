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
| 修改主题参数、编辑器、存储或导入导出 | [主题系统开发说明](modules/theme.md) |
| 修改工具分组、分类视图、筛选或手机分页 | [工具目录开发说明](modules/tool-catalog.md) |
| 修改搜索索引、匹配、弹层或失败重试 | [站内搜索开发说明](modules/search.md) |
| 调整视觉、组件与交互 | [设计系统](DESIGN-SYSTEM.md)；旧方案依据见 [设计评审记录](DESIGN-REVIEW.md) |
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

当前实现以源码、类型、内容 schema 和检查脚本为准。文档按以下职责维护，同一规则优先保留一个完整说明位置，其他入口链接引用。

| 状态 | 文档 | 维护职责 |
| --- | --- | --- |
| 现行规范 | [贡献指南](../CONTRIBUTING.md) | 参与、PR、审稿、合并和署名流程 |
| 现行规范 | [内容维护规范](CONTENT-GUIDE.md)、[审校规范](CONTENT-REVIEW.md) | 内容字段与写法、收录、来源和审核规则 |
| 当前实现与边界 | [架构说明](ARCHITECTURE.md) | 技术选择、页面/内容关系、整体边界；M1/M2 单独标为后续规划 |
| 现行设计要求 | [设计系统](DESIGN-SYSTEM.md) | 视觉令牌、用户可见的交互和可访问性要求 |
| 当前模块实现 | [主题](modules/theme.md)、[工具目录](modules/tool-catalog.md)、[搜索](modules/search.md) | 文件职责、数据流、关键行为、常见修改与测试对应关系 |
| 现行操作说明 | [维护说明](MAINTAINING.md) | 命令、环境、检查边界与排障；其中仓库设置快照仅表示当日状态 |
| 素材来源 | [主题素材](THEME-ASSETS.md)、[工具图标](TOOL-LOGOS.md) | 来源、署名、授权与处理方式，不推导为项目统一许可 |
| 规划 | [术语库规划](GLOSSARY-PLAN.md)、[选题清单](GLOSSARY-TERMS.md) | 分类目标、候选选题与分批安排，不表示文章或审核已完成 |
| 历史记录 | [设计评审](DESIGN-REVIEW.md)、[Agent 核对](AGENT-CATALOG-REVIEW.md)、[工具增补](TOOL-CATALOG-REVIEW.md)、各批次术语审校记录 | 保留带日期的依据、范围与结论；当前状态仍需结合源码核实 |

### 代码变更时同步哪里

| 变更影响 | 优先更新 |
| --- | --- |
| 主题参数、存档、编辑会话或加载方式 | 主题模块说明；用户操作或视觉要求改变时再同步设计系统，素材变化另记来源 |
| 工具分类、分区、筛选、URL 或分页 | 工具目录模块说明；收录与字段写法改变时同步内容规范 |
| 搜索来源、字段、匹配或弹层行为 | 搜索模块说明；用户操作要求改变时同步设计系统 |
| 内容模型、路由、模块关系或阶段边界 | 架构说明；字段/审校规则分别更新内容规范和审校规范 |
| 检查命令、浏览器环境或排障方式 | 维护说明；模块文档只维护对应测试与需核对的行为 |
| 新增文档、入口迁移或对外功能状态变化 | 本导航；影响项目介绍时同步根 README |

PR 按[贡献流程](../CONTRIBUTING.md#7-审稿与合并维护者检查清单)说明更新位置或无需更新的原因，不要求每个组件、每次修复另建文档。重要技术选择涉及多方案取舍时，可另写决策记录，交代背景、备选、决策和后果；普通修复无需增加记录文件。

指南目录、术语、首页等其他模块暂由架构、设计系统和内容规范覆盖；本次没有为它们另建开发说明。发现维护说明缺口时按实际修改补充，历史记录不作为当前实现的替代文档。

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
