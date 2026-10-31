# 工具目录开发说明

本文说明工具数据如何生成分类视图、驱动筛选与分页。收录范围、事实核对、字段写法和基本筛选规则统一见[工具数据规范](../CONTENT-GUIDE.md#6-工具数据)，图标来源见[工具图标记录](../TOOL-LOGOS.md)。

## 职责与边界

工具由维护者维护 TypeScript 数据，构建时生成静态卡片和视图配置；浏览器只重排和筛选已有卡片。目录不提供模型推理、工具评测后台或按热度排序。全站搜索另由[搜索模块](search.md)生成索引。

## 文件地图

| 入口 | 职责 |
| --- | --- |
| [`types.ts`](../../src/data/types.ts) | `Tool`、分类、能力、资源形态等类型 |
| [`tools.ts`](../../src/data/tools.ts) | 工具条目、分类、能力及依据标签 |
| [`tool-sections.mjs`](../../src/data/tool-sections.mjs) | 分类内分区、展示顺序、折叠配置及旧分类别名 |
| [`tool-catalog.mjs`](../../src/lib/tool-catalog.mjs) | `createCatalogView` 生成视图、`getToolSectionLabels` 提供分区关键词、`validateCatalogSections` 校验覆盖 |
| [`tools/index.astro`](../../src/pages/tools/index.astro) | 构建全部视图，生成卡片、目标分区与 `data-catalog-config` JSON |
| [`ToolCard.astro`](../../src/components/ToolCard.astro) | 链接、图标、分类/能力标记及 `data-search` 文本 |
| [`filter.ts`](../../src/scripts/filter.ts) | 工具页与术语页共用的筛选、计数、空状态及 URL 恢复 |
| [`tool-catalog.ts`](../../src/scripts/tool-catalog.ts) | 工具专用的卡片重排、分页、折叠位置、打印与结果定位 |
| [`tools.css`](../../src/styles/routes/tools.css) | 工具页布局、手机分页样式及打印时隐藏分页控件 |
| [`check-content.mjs`](../../scripts/check-content.mjs) | 解析工具源码，检查内容中的工具引用，并提供 `validateTools` |

## 数据流与接口

构建链路为：`tools.ts` + `tool-sections.mjs` → `createCatalogView` → 工具页静态 HTML 与视图配置。分类名、条目数量和折叠数量从数据计算，不手工维护第二份清单。

- 全目录按主分类收录一次；单栏目视图同时纳入 `alsoIn` 关联工具。目前数据只填写主分类，关联能力仍由类型和视图逻辑支持。
- 每个工具在其主分类和每个关联分类中必须恰好匹配一个分区。分区按字段匹配或显式 `toolIds` 列表选取；显式列表按配置顺序展示，字段分组保留工具数据顺序。
- `collapse.featuredIds` 决定折叠分区中哪些条目直接展示；目录排序和折叠不读取工具自身的 `featured` 字段。
- 卡片仅生成一次。客户端用工具 ID 定位并移动现有 DOM，不克隆卡片；`data-category` 保留主分类和关联分类，`data-search` 由卡片统一生成。
- 内容检查和页面测试共用 `parseToolsFromSource`；分区校验另检查遗漏、重复匹配和失效引用。新增分区不能只看页面是否构建成功。

### 筛选生命周期

`initToolCatalog` 调用 `initFilter`，传入 `searchWithinCategory: true`、分类别名和三个钩子：

1. `beforeApply`：按栏目选择视图，把卡片移入普通或折叠目标分区。
2. `filter.ts`：用分类、关键词和能力计算完整匹配集，再交给 `selectCards` 选择当前页；总数和空状态始终使用完整匹配集。
3. 更新卡片、分区、折叠计数及 `aria-pressed` 后，`afterApply` 按变化原因决定是否定位结果区域。

`FilterState.reason` 区分 `init`、`filter`、`history` 和 `refresh`。工具页与术语页共享筛选器，但术语页输入关键词时可跨分类检索；不要通过修改默认选项把两页的搜索范围意外统一。

### URL、折叠与分页

| 状态 | 当前处理 |
| --- | --- |
| `category` / `caps` / `q` | 筛选器读取并恢复；能力以逗号分隔并校验合法值，关键词归一化。用户筛选通过 `replaceState` 同步 URL |
| 旧分类 | 经 `toolCategoryAliases` 映射后选择视图，保留搜索条件；完整映射以分区配置为准 |
| `page` | 仅手机宽度（≤ 760px）的“全部工具”视图分页，每页 9 项；先筛选完整集合，再按全目录顺序切页 |
| 翻页与历史 | 翻页用 `pushState`，`popstate` 恢复筛选与页码；改变筛选回第一页，非法页码回退，有效整数超出范围时限制到实际页数 |
| 单栏目或桌面 | 不分页并移除 `page`；切换宽度刷新当前匹配集，单栏目仍使用分区折叠 |
| 折叠 | 普通浏览默认收起，关键词或能力筛选自动展开匹配条目；折叠数量随匹配集和手动开合更新。手机全目录分页不再叠加折叠 |

打印前临时显示完整匹配集并展开折叠区，打印后恢复屏幕视图；无 JS 时保留静态目录和原生折叠入口，不让分页截断内容。

桌面（≥ 1021px）用户筛选后定位到结果开头，保留操作控件焦点；初始化、历史恢复和尺寸变化不额外定位。手机输入不附加滚动，翻页则聚焦并即时定位结果区。相关体验要求见[设计系统](../DESIGN-SYSTEM.md#筛选)。

## 必须保持的行为

- 全目录一个工具只出现一次，单栏目使用自己的关联条目和分区；配置中的引用必须有效。
- 匹配总数包含未在当前页展示或尚未手动展开的匹配项；空结果与清除入口不能只根据当前页判断。
- 搜索先于分页，不能只搜索当前屏幕上的卡片；URL 恢复不能留下前一次能力或关键词。
- 旧分类链接继续提供合理入口；增加或合并分类时检查别名和全站搜索关键词。
- 卡片跟随语义主题令牌，分页、减少动效、打印和无 JS 均有完整内容路径。

## 常见修改路径

| 修改 | 需要核对的入口 |
| --- | --- |
| 新增或移动工具 | 按内容规范更新 `tools.ts`；核对主分类和关联分类的分区匹配、官方链接、图标记录及全站搜索 |
| 新增分类 | `toolCategories` → 分区配置 → 分类说明与旧链接处理；检查各视图、计数、空分类和相关测试 |
| 调整分组或顺序 | 修改 `tool-sections.mjs` 的字段规则或显式列表；核对分区覆盖、折叠精选及手机分页顺序 |
| 调整筛选/分页 | 先区分共享筛选器与工具专用钩子；核对分类/能力/搜索组合、URL、历史、断点和打印 |
| 增加可搜索字段 | 同时检查 `ToolCard.astro` 的 `data-search` 与全站搜索索引；两者范围并非自动一致 |

## 验证与排障

命令及浏览器环境统一见[维护说明](../MAINTAINING.md#验证入口)。数据、页面或脚本变更运行 `npm run verify`；涉及筛选、分页或主题兼容时，在当前构建上补充 `npm run test:browser`。

| 证据入口 | 检查内容 |
| --- | --- |
| [`tool-catalog.test.mjs`](../../tests/tool-catalog.test.mjs) | 主分类去重、分区覆盖、显式顺序、关联栏目、旧分类别名和错误配置 |
| [`site.test.mjs`](../../tests/site.test.mjs) | 工具类型/数据、图标、页面结构、筛选标记与全站搜索索引 |
| [`theme.browser.test.mjs`](../../tests/theme.browser.test.mjs) | 栏目搜索、能力交集、折叠、URL/历史、手机分页与滚动、主题、无 JS 和打印 |

- 工具消失或重复：检查分类归属与 `validateCatalogSections`，再看客户端卡片是否进入正确目标分区。
- 数量与可见卡片不同：先区分匹配总数、当前页和折叠数量，再检查过滤后的完整集合。
- 手机出现留白或翻页定位不稳：在动画完成后检查实际 `opacity` 和滚动位置，不能只依赖 DOM 存在或 `isVisible()`；手机工具页关闭默认平滑滚动，避免原生聚焦滚动覆盖翻页定位。
