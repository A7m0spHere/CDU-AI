# 工具目录开发说明

本文说明工具数据如何生成分类视图、驱动筛选以及手机端 App 网格与底部抽屉交互。收录范围、事实核对、字段写法和基本筛选规则统一见[工具数据规范](../CONTENT-GUIDE.md#6-工具数据)，图标来源见[工具图标记录](../TOOL-LOGOS.md)。

## 职责与边界

工具由维护者维护 TypeScript 数据，构建时生成静态卡片和视图配置；浏览器只重排和筛选已有卡片，并在手机宽度下切换为「图标 + 名称」网格与底部详情抽屉。目录不提供模型推理、工具评测后台或按热度排序。全站搜索另由[搜索模块](search.md)生成索引。

## 文件地图

| 入口 | 职责 |
| --- | --- |
| [`types.ts`](../../src/data/types.ts) | `Tool`、分类、能力、资源形态等类型 |
| [`tools.ts`](../../src/data/tools.ts) | 工具条目、分类、能力及依据标签 |
| [`tool-sections.mjs`](../../src/data/tool-sections.mjs) | 分类内分区、展示顺序、折叠配置及旧分类别名 |
| [`tool-catalog.mjs`](../../src/lib/tool-catalog.mjs) | `createCatalogView` 生成视图、`getToolSectionLabels` 提供分区关键词、`validateCatalogSections` 校验覆盖 |
| [`tools/index.astro`](../../src/pages/tools/index.astro) | 构建全部视图，生成卡片、底部抽屉结构、`data-catalog-config` JSON 与能力折叠开关 |
| [`ToolCard.astro`](../../src/components/ToolCard.astro) | 链接、图标、分类/能力标记、`data-best-for`、`data-search` 文本及手机瓷贴触发器 |
| [`filter.ts`](../../src/scripts/filter.ts) | 工具页与术语页共用的筛选、计数、空状态及 URL 恢复 |
| [`tool-catalog.ts`](../../src/scripts/tool-catalog.ts) | 卡片重排、手机端 App 网格与底部抽屉、能力筛选折叠、打印与结果定位 |
| [`tools.css`](../../src/styles/routes/tools.css) | 工具页布局、手机端横向分类条、App 网格及底部抽屉样式 |
| [`check-content.mjs`](../../scripts/check-content.mjs) | 解析工具源码，检查内容中的工具引用，并提供 `validateTools` |

## 数据流与接口

构建链路为：`tools.ts` + `tool-sections.mjs` → `createCatalogView` → 工具页静态 HTML 与视图配置。分类名、条目数量和折叠数量从数据计算，不手工维护第二份清单。

- 全目录按主分类收录一次；单栏目视图同时纳入 `alsoIn` 关联工具。目前数据只填写主分类，关联能力仍由类型和视图逻辑支持。
- 每个工具在其主分类和每个关联分类中必须恰好匹配一个分区。分区按字段匹配或显式 `toolIds` 列表选取；显式列表按配置顺序展示，字段分组保留工具数据顺序。
- `excludeIds` 从分区中排除指定条目，视图、搜索分区关键词和覆盖校验共用这一规则。Agent 的个人助理使用独立分区，其 ID 从地区与开源分区中排除，地区信息仍保留在工具数据中。
- `collapse.featuredIds` 决定折叠分区中哪些条目直接展示；目录排序和折叠不读取工具自身的 `featured` 字段。
- 卡片仅生成一次。客户端用工具 ID 定位并移动现有 DOM，不克隆卡片；`data-category` 保留主分类和关联分类，`data-search` 由卡片统一生成。
- 内容检查和页面测试共用 `parseToolsFromSource`；分区校验另检查遗漏、重复匹配和失效引用。新增分区不能只看页面是否构建成功。

### 筛选生命周期

`initToolCatalog` 调用 `initFilter`，传入 `searchWithinCategory: true`、分类别名和两个钩子：

1. `beforeApply`：按栏目选择视图，把卡片移入普通或折叠目标分区。
2. `filter.ts`：用分类、关键词和能力计算完整匹配集，更新卡片、分区、折叠计数及 `aria-pressed`。
3. `afterApply`：同步手机能力筛选按钮计数与初始展开状态，桌面端按变化原因决定是否定位结果区域。

`FilterState.reason` 区分 `init`、`filter`、`history` 和 `refresh`。工具页与术语页共享筛选器，但术语页输入关键词时可跨分类检索；不要通过修改默认选项把两页的搜索范围意外统一。

### URL、折叠与手机端展示

| 状态 | 当前处理 |
| --- | --- |
| `category` / `caps` / `q` | 筛选器读取并恢复；能力以逗号分隔并校验合法值，关键词归一化。用户筛选通过 `replaceState` 同步 URL |
| 旧分类 | 经 `toolCategoryAliases` 映射后选择视图，保留搜索条件；完整映射以分区配置为准 |
| 手机 App 网格（≤ 760px） | 仅屏幕浏览且脚本就绪时启用（`data-mobile-app-grid="true"`）：`360–760px` 为 4 列，`≤ 359px` 为 3 列，仅显示图标与名称，按分区直接展示全部匹配条目，不再分页；页头仅保留标题与 3 个常规状态胶囊，隐藏外层分类大标题（全部工具下保留单分区栏目小标题），结果栏视觉隐藏「匹配 N 项」仅保留无障碍播报与清除筛选入口 |
| 手机底部抽屉 | 点击图标瓷贴打开原生 `<dialog data-tool-sheet>`，填充该工具完整信息与官网/仓库入口；关闭（按钮、遮罩、`Esc` 或切回桌面）后焦点回到原图标 |
| 手机能力与场景条 | 场景分类为单行横向滚动胶囊；能力筛选默认折叠，URL 含 `caps` 时自动展开 |
| 折叠 | 普通浏览默认收起，关键词或能力筛选自动展开匹配条目；折叠数量随匹配集和手动开合更新 |

打印前临时关闭手机 App 网格与抽屉、展示完整信息卡片并展开折叠区，打印后恢复屏幕视图；无 JS 时保留完整静态卡片和原生折叠入口。

桌面（≥ 1021px）用户筛选后定位到结果开头，保留操作控件焦点；初始化、历史恢复和尺寸变化不额外定位。手机输入与点击筛选不附加滚动。相关体验要求见[设计系统](../DESIGN-SYSTEM.md#筛选)。

## 必须保持的行为

- 全目录一个工具只出现一次，单栏目使用自己的关联条目和分区；配置中的引用必须有效。
- 手机 App 网格态下把卡片内部链接与折叠区设为 `inert` / `aria-hidden`，避免与瓷贴按钮产生重复焦点或读屏播报；切回桌面、打印或无 JS 时恢复原交互。
- 旧分类链接继续提供合理入口；增加或合并分类时检查别名和全站搜索关键词。
- 卡片与抽屉跟随语义主题令牌，减少动效、打印和无 JS 均有完整内容路径。

## 常见修改路径

| 修改 | 需要核对的入口 |
| --- | --- |
| 新增或移动工具 | 按内容规范更新 `tools.ts`；核对主分类和关联分类的分区匹配、官方链接、图标记录及全站搜索 |
| 新增分类 | `toolCategories` → 分区配置 → 分类说明与旧链接处理；检查各视图、计数、空分类和相关测试 |
| 调整分组或顺序 | 修改 `tool-sections.mjs` 的字段规则或显式列表；核对分区覆盖、折叠精选 |
| 调整筛选/手机展示 | 先区分共享筛选器与工具专用钩子；核对分类/能力/搜索组合、App 网格瓷贴、抽屉字段、URL、历史、断点和打印 |
| 增加可搜索字段 | 同时检查 `ToolCard.astro` 的 `data-search` 与全站搜索索引；两者范围并非自动一致 |

## 验证与排障

命令及浏览器环境统一见[维护说明](../MAINTAINING.md#验证入口)。数据、页面或脚本变更运行 `npm run verify`；涉及筛选、手机 App 网格/抽屉或主题兼容时，在当前构建上补充 `npm run test:browser`。

| 证据入口 | 检查内容 |
| --- | --- |
| [`tool-catalog.test.mjs`](../../tests/tool-catalog.test.mjs) | 主分类去重、分区覆盖、显式顺序、关联栏目、旧分类别名和错误配置 |
| [`site.test.mjs`](../../tests/site.test.mjs) | 工具类型/数据、图标、页面结构、筛选标记与全站搜索索引 |
| [`theme.browser.test.mjs`](../../tests/theme.browser.test.mjs) | 栏目搜索、能力交集、折叠、URL/历史、手机 App 网格与底部抽屉、主题、无 JS 和打印 |

- 工具消失或重复：检查分类归属与 `validateCatalogSections`，再看客户端卡片是否进入正确目标分区。
- 手机底部抽屉字段缺失：检查 `ToolCard.astro` 对应数据源（如 `data-best-for`、`.tool-card__verify`）与 `tool-catalog.ts` 中的填充逻辑。
- 手机出现留白或横向溢出：检查显现动画 `opacity`、横向分类条 `min-width: 0` 约束及 `scrollWidth <= innerWidth`。
