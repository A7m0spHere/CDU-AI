# 《第一次使用 Agent》素材清单

全部素材均已集成，不再显示“素材待补充”占位。M03-W 和 M03-Z 截图已遮盖练习目录以外的分组和项目名称。

| 编号 | 建议文件名 | 章节 | 截图内容 | 实际 / 建议分辨率 | 必须 | 当前状态 |
| --- | --- | --- | --- | --- | --- | --- |
| M01 | `m01-workbuddy-workbench.webp` | 02 | WorkBuddy 工作台和「新建任务」入口 | 1492×993（自适应原比例） | 是 | 已集成 |
| M02 | `m02-zcode-workspace.webp` | 02 | ZCode 首页的项目选择和模型入口 | 1326×996（自适应原比例） | 是 | 已集成 |
| M03-W | `m03-w-workbuddy-directory.webp` | 03 | WorkBuddy 选择 `CDU-介绍网站` 工作目录 | 1092×530（自适应原比例） | 是 | 已集成 |
| M03-Z | `m03-z-zcode-project.webp` | 03 | ZCode 打开 `CDU-介绍网站` 项目工作区 | 953×952（自适应原比例） | 是 | 已集成 |
| M04-W | `m04-w-workbuddy-development.webp` | 04 | WorkBuddy 收到任务后开始查找成都大学官网资料 | 1071×932（自适应原比例） | 是 | 已集成 |
| M04-Z | `m04-z-zcode-development.webp` | 04 | ZCode 收到任务后显示「正在思考」和「工作中」 | 977×961（自适应原比例） | 是 | 已集成 |
| M05 | `m05-cdu-html-file.webp` | 05 | 文件管理器显示练习文件夹中的 `CDU.html` | 846×237（自适应原比例） | 是 | 已集成 |
| M06 | `m06-cdu-browser.webp` | 05 | 浏览器实际打开生成的成都大学介绍网页 | 1878×1067（自适应原比例） | 是 | 已集成 |
| M07-B | `m06-cdu-browser.webp` | 06 | 第一次生成的网页，复用 M06 | 与 M06 一致 | 是 | 已集成 |
| M07-A | `m07-after.webp` | 06 | 使用「调整视觉风格」提示词修改后的网页，保持相同视口和页面位置 | 1877×1063（自适应原比例） | 是 | 已集成 |

## 补充素材

1. 将实际截图放入 [`public/guide/first-agent/`](../public/guide/first-agent/)。
2. 更新 [`first-agent-media.mjs`](../src/data/first-agent-media.mjs) 中对应编号的 `file`、`description` 和 `status`，状态依次使用“待截图”“已截图”“已集成”。
3. 设置为“已集成”且文件实际存在时，构建过程会在 `resolveFirstAgentMedia()` 中自动读取图片头部真实宽高，按原始比例渲染（已插图去除 16:9 虚线占位框，过高的方形/竖向截图在桌面端限制显示高度，仍支持点击放大）；路径错误或文件缺失时继续显示占位。浏览器加载失败也会隐藏图片和放大按钮，恢复虚线占位。
4. 同步本清单的状态，运行 `npm run verify`，再检查页面显示、替代文字和手机宽度。

截图使用 WebP（也支持读取 PNG 尺寸），资源 URL 为 `/guide/first-agent/<文件名>`。拍摄时使用本文的 `CDU-介绍网站` 与 `CDU.html`，示例任务与三条修改指令保存在文章 Markdown 中。

素材配置、文件存在状态和真实宽高都会参与 Astro 的构建配置缓存键。补图、删图、替换尺寸或变更说明后，重新执行构建即可更新渲染结果。使用 `npm run dev` 时，新增或移除素材后重启开发服务器，确保重新计算文件状态。

对比区的修改前截图复用 M06，修改后截图为使用「调整视觉风格」提示词后的页面；两张图按各自真实比例渲染，桌面端并排展示。后续需要拖动对比时可围绕 `data-agent-comparison` 替换交互。

文末注记“文中演示网页由 GLM-5.3-Flash 制作”，说明示例截图的生成模型。

## 正文与交互维护

正文为 [`first-agent.md`](../src/content/guide/first-agent.md)。Markdown 原生标题继续用于章节锚点和本页目录。本文的 `first-agent:*` 注释在构建时转换为可见教学组件。

- `selector` 生成默认 WorkBuddy 的原生单选控件。
- `choices`、`tool workbuddy`、`tool zcode`、`endchoices` 按所选工具切换安装说明、工作目录说明和任务截图。
- `copy task` 将紧随其后的引用块转换为任务卡片，`revision` 将原文标题和引用块转换为修改卡片。复制和显示使用同一份派生纯文本，Markdown 链接包含实际 URL。
- `media <编号>` 从统一配置生成截图或占位，`comparison` 对应 M07-B 与 M07-A。

扩展由 [`rehype-first-agent.mjs`](../src/lib/rehype-first-agent.mjs) 限定到本篇文件。页面使用原生 TypeScript 增强，禁用 JavaScript 时可阅读两个工具的说明及完整提示词，复制按钮和工具选择器隐藏。

正文由维护者提供，保留原有工具评价与额度表述。按 A7m 于 2026-11-18 确认的[上传正文审阅规则](CONTENT-REVIEW.md#32-审核结论-reviewed--reviewedby)，已补记人工审阅。元数据仍记录为教学示例与 AI 辅助。安装、首次配置和额度信息仍待核对。
