# CDU AI

> 面向成都大学全校学生的开源 AI 学习与交流社区。  
> **当前处于 M0 开发阶段**：这是一个仍在持续建设的静态站点原型，内容、功能和视觉都会继续调整，暂不承诺线上稳定性或完整度。  
> 由成都大学计算机协会 AI 方向发起，非学校官方平台。  
> [GitHub 仓库](https://github.com/A7m0spHere/CDU-AI) · [MIT License](LICENSE)

## 开发状态

| 项目 | 当前状态 |
| --- | --- |
| 项目阶段 | M0 · 基础框架，开发中 |
| 站点形态 | 可本地构建的静态原型，尚未正式上线 |
| 内容 | **内容重建中**：2026-10-20 已移除 8 篇指南 / 38 条术语 / 4 个作品示例；写作模板见 `src/content/*/_TEMPLATE.md` |
| 贡献方式 | GitHub 网页 Issue / PR，无需命令行；说明见 [CONTRIBUTING.md](CONTRIBUTING.md) |
| 账号 / 投稿 / 评论 / 活动报名 | 未开放 |
| 社区与活动 | 社区功能已关闭（/community/ 仅提示暂不开放）；活动只有形式设计，不展示真实排期 |
| 作品广场 | 当前为空；重新填充后仍会明确标注「策划示例」，不是真实学生投稿 |
| 视觉资源 | Logo 与 favicon 已使用维护者提供的角色插画；作品封面仍为占位素材 |
| 官方关系 | 非成都大学官方平台 |

仓库公开用于开发协作和预览，**不代表项目已经完成或正式发布**。功能清单描述的是当前开发范围，不是上线承诺。

## 参与共建

这是一个开放共建的项目，**不需要会写代码**也能参与，所有入口都在 GitHub 网页上完成：

- **发现错误**：指南、术语和作品详情页底部都有「在 GitHub 编辑本页」，点开即可在网页上修改 Markdown 并提交 PR；不确定怎么改就先提交 [文档纠错](https://github.com/A7m0spHere/CDU-AI/issues/new?template=doc-correction.yml)。
- **分享真实经验**：提交 [经验投稿](https://github.com/A7m0spHere/CDU-AI/issues/new?template=experience-submission.yml)，维护者会与你确认是否整理成指南或作品示例。
- **推荐或更新工具**：提交 [工具建议](https://github.com/A7m0spHere/CDU-AI/issues/new?template=tool-suggestion.yml)。
- **改代码、样式或测试**：先读 [CONTRIBUTING.md](CONTRIBUTING.md)，再按 PR 模板提交。

贡献流程：找到页面 → 点「在 GitHub 编辑本页」→ Fork 后在网页编辑 → 提交 PR（模板会询问验证方式、事实来源、隐私与版权、AI 辅助声明）→ 维护者审核，CI 自动运行 `npm run verify` → 合并发布。

- 内容按仓库 [LICENSE](LICENSE)（MIT）发布；引用与图片需要能说明来源或授权。
- AI 允许用于整理、润色和起草，但必须在 PR / issue 中声明用途；不能虚构经历、访谈、数据或「同学评价」。
- M0 不开放匿名投稿：贡献需要一个公开的 GitHub 账号；涉及个人经历可先与维护组确认公开范围。

## 品牌与视觉素材

站点名称为 **CDU AI**。左上角 Logo 与浏览器 favicon 已替换为维护者提供的角色插画；作品封面仍为占位图形，组件尺寸和替换位置保留。

- Logo 组件：[src/components/LogoMark.astro](src/components/LogoMark.astro)
- Logo 资源：[public/brand/logo-512.png](public/brand/logo-512.png)（页面使用 160px 版本，按 2–4 倍屏预留）
- Favicon：[public/favicon-32.png](public/favicon-32.png) / [public/favicon-16.png](public/favicon-16.png) / [public/apple-touch-icon.png](public/apple-touch-icon.png)；PWA 图标见 [public/site.webmanifest](public/site.webmanifest)
- 原始插画（不参与构建）：[docs/design/brand/logo-source.png](docs/design/brand/logo-source.png)
- 看板娘（首页 Hero 右侧）：[public/brand/mascot.webp](public/brand/mascot.webp)，原始透明插画见 [docs/design/brand/mascot-source.png](docs/design/brand/mascot-source.png)
- 作品封面：[src/components/WorkArt.astro](src/components/WorkArt.astro)（仍为占位）

> 角色插画由维护者提供，用于本站品牌展示；如需在其他场合复用请联系维护组。

## 这是什么

很多 AI 教程默认你已经会写代码、懂术语、有 GPU。这个站想反过来：**从每个专业都能理解的真实问题出发，先学会安全地用，再慢慢做出自己的东西。**

M0 先搭可持续迭代的框架，而不是堆完整功能。目前已经进入可构建、可预览的开发版本，但仍在继续完善：

- 全局搜索：顶栏搜索框 / Ctrl·Cmd + K，支持页面、指南章节、术语、工具和作品；结果可直达正文锚点
- 首页：定位、入口、学习路径、工具与作品预览、活动与项目状态
- 学习指南：三阶段框架 + Notion 风格文档排版（内容重建中，模板见 `src/content/guide/_TEMPLATE.md`）；每篇自动生成更新时间、参考来源、内容状态和 GitHub 编辑入口
- 术语表：术语详情页、分类筛选与来源标注框架（内容重建中，模板见 `src/content/glossary/_TEMPLATE.md`）
- 工具资源：按真实使用场景分类、可搜索筛选的工具目录
- 作品广场：「策划示例」的组织方式（内容重建中，模板见 `src/content/works/_TEMPLATE.md`）
- 社区：功能已关闭，页面仅保留「暂不开放」提示（不开放注册、发帖或评论）
- 活动：活动形式蓝图与项目路线（不虚构日期、场地、嘉宾或参与人数）
- 关于 / 共建：项目边界、透明说明与内容协作规范

## 界面预览

> 以下截图来自内容清空前的开发预览，仅用于展示版式；内容与样式还会继续调整。

| 首页 | 工具资源 |
| --- | --- |
| ![首页](docs/screenshots/home.png) | ![工具资源](docs/screenshots/tools.png) |

| 学习指南 | 全局搜索（Ctrl/Cmd + K） |
| --- | --- |
| ![学习指南](docs/screenshots/guide.png) | ![全局搜索](docs/screenshots/search.png) |

| AI 术语表 | 内容元信息 |
| --- | --- |
| ![AI 术语表](docs/screenshots/glossary.png) | ![内容元信息](docs/screenshots/guide-meta.png) |


## 技术栈

| 选择 | 原因 |
| --- | --- |
| **Astro 5**（静态输出） | 内容型站点首选；默认输出静态 HTML；Markdown 内容与页面代码天然分离 |
| **TypeScript** | 数据文件有类型约束，协会多人协作时更不容易把字段写坏 |
| **原生 CSS**（设计令牌 + 分层样式） | 不引入重型 UI 框架；白底、蓝色交互色与目录式筛选可精细控制 |
| **Astro Content Collections + Markdown** | 同学新增一篇指南 = 新增一个 .md 文件，不需要碰页面代码 |
| **少量原生脚本**（约 7KB） | 只负责全局搜索、筛选、主题、复制与移动菜单；无 JS 时核心内容仍可阅读，增强入口自动隐藏 |

无后端、无登录、无数据库、无第三方统计脚本。未来接入投稿/评论时，可从静态内容层平滑过渡到 API。

## 本地运行

环境：Node.js ≥ 22。

```bash
npm install
npm run dev        # http://localhost:4321
npm run verify     # 类型检查 + 生产构建 + 内容测试 + 内部链接检查
```

其他命令：

```bash
npm run check        # Astro / TypeScript 类型检查
npm run check:content # 内容字段与跨文件一致性检查（含审核状态字段）
npm run build        # 生成静态站点到 dist/
npm run preview     # 本地预览生产构建
npm run test        # 构建后的页面结构、M0 标注与链接安全测试
npm run check:links # 检查 dist/ 中指向站内的链接是否存在
```

## 目录结构

```text
src/
├── components/          # 可复用 UI（导航、卡片、封面、图标等）
├── content/
│   ├── guide/           # 学习指南：一篇 Markdown = 一个模块（当前仅 _TEMPLATE.md）
│   ├── glossary/        # 术语表：一个词一篇 Markdown（当前仅 _TEMPLATE.md）
│   └── works/           # 作品广场：示例提案 / 未来真实投稿（当前仅 _TEMPLATE.md）
├── data/                # 工具、术语、活动、首页入口等结构化内容
│   ├── types.ts         # 内容类型约束
│   ├── site.ts          # 站点名、导航、页脚与透明说明
│   ├── home.ts          # 首页入口与学习地图
│   ├── glossary.ts      # 术语分类与展示名
│   ├── tools.ts         # 工具目录
│   └── events.ts        # 活动形式与项目路线
├── layouts/             # 全局页面骨架
├── pages/               # 路由页面 + 构建时搜索索引 search-index.json
├── scripts/             # 全局交互与筛选等渐进增强脚本
├── styles/              # 设计令牌、基础/组件/页面样式与视觉收口
└── content.config.ts    # 内容集合 frontmatter 校验
tests/site.test.mjs      # 构建产物的结构与内容边界测试
tests/fixtures/content/  # 内容检查器的「合法 / 错误条目」测试样例
.github/
├── ISSUE_TEMPLATE/          # 纠错 / 经验投稿 / 工具建议的 GitHub 表单
├── pull_request_template.md # PR 自检模板（来源、隐私、AI 声明）
├── CODEOWNERS               # 默认审阅人（未强制，见 CONTRIBUTING）
└── workflows/ci.yml         # CI：类型检查、构建、测试与链接检查
docs/
├── ARCHITECTURE.md      # M0 架构决策与信息架构
├── CONTENT-GUIDE.md     # 内容字段规范、语气与禁写事项
└── DESIGN-SYSTEM.md     # 视觉语言与组件约定
scripts/check-links.mjs   # 构建产物内部链接检查
scripts/check-content.mjs # 内容字段、order、引用与审校状态一致性检查
```

## 内容怎么维护

完整文件地图、写作流程和提交检查见 [`CONTRIBUTING.md`](CONTRIBUTING.md)。

> **内容重建中**：三个内容目录当前只保留 `_TEMPLATE.md` 写作模板。复制模板、去掉文件名开头的下划线并改名后即可开始写；以 `_` 开头的文件不会进入构建。

1. 阅读 [`docs/CONTENT-GUIDE.md`](docs/CONTENT-GUIDE.md)，确认字段、语气与事实边界。
2. 学习指南：复制 `src/content/guide/_TEMPLATE.md` 为 `序号-英文短名.md`，按 frontmatter 填写；页面自动生成并排序。
3. 作品示例：复制 `src/content/works/_TEMPLATE.md` 并改名；M0 必须保持 `status: example`。
4. 术语：复制 `src/content/glossary/_TEMPLATE.md` 并改名，按固定分节写白话解释；分类在 `src/data/glossary.ts`。
5. 工具 / 活动：编辑 `src/data/*.ts` 中对应数组，不改页面结构。
6. 在网页上直接改：打开页面，点底部的「在 GitHub 编辑本页」，按 [CONTRIBUTING.md](CONTRIBUTING.md) 的步骤提交 PR。
7. 本地跑 `npm run verify`，通过后提交。新增或修改指南时补充 `updated`，有外部依据时填写 `sources`。

> 不要在没有来源的情况下写「官方合作」「学校认证」「已有 XX 名同学」「某月某日举办」等事实性表述。

### 验证

本地修改后运行：

```bash
npm run verify
```

它会依次执行类型检查、内容一致性检查、生产构建、内容清单与搜索覆盖测试、章节锚点检查、站内链接检查。CI 使用同一命令。

## 提交信息

提交使用 `类型: 中文说明` 的格式。类型前缀保留英文，冒号后的描述使用中文：

- `feat: 新增 AI 术语表`
- `fix: 修复移动端搜索框溢出`
- `docs: 补充内容维护说明`
- `refactor: 拆分搜索索引生成逻辑`
- `test: 增加章节锚点校验`
- `chore: 更新依赖`

描述要说明「改了什么、为什么改」，避免只写 `update`、`changes` 或「修改」。

## 参考与致谢

信息架构和交互借鉴了以下开放项目的组织方式，正文、示例与实现均为本项目原创，不复制其代码、品牌或视觉资产：

- [AI 科研入门指南](https://github.com/Takamatsu-Hikaru/AI-Research-Guide)：按阶段组织长文、内容清单、构建时生成导航与校验；我们借鉴其内容管理方式，但保留 Astro 实现
- [AI Demo 作品集](https://github.com/deepdemos/ds-demos-showcase)：作品广场的分类、状态标注与「过程即内容」思路
- [WayToAGI](https://github.com/WayToAGI)：按工具与场景组织的目录型入口
- [VibeHub](https://vibe-hub.org/)：白底、蓝色交互色、全局搜索与目录侧栏的产品化浏览体验；术语表释义参考其 AI 术语并改写，页面末尾统一标注来源

