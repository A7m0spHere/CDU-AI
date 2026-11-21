# 《第一次使用 Agent》素材清单

文章中的占位框标注“素材待补充”。M03-W 和 M03-Z 截图已遮盖练习目录以外的分组和项目名称。

| 编号 | 建议文件名 | 章节 | 截图内容 | 建议分辨率 / 比例 | 必须 | 当前状态 |
| --- | --- | --- | --- | --- | --- | --- |
| M01 | `m01-workbuddy-workbench.webp` | 02 | WorkBuddy 工作台和「新建任务」入口 | 1600×900 / 16:9 | 是 | 已集成 |
| M02 | `m02-zcode-workspace.webp` | 02 | ZCode 首页的项目选择和模型入口 | 1600×900 / 16:9 | 是 | 已集成 |
| M03-W | `m03-w-workbuddy-directory.webp` | 03 | WorkBuddy 选择 `CDU-介绍网站` 工作目录 | 1600×900 / 16:9 | 是 | 已集成 |
| M03-Z | `m03-z-zcode-project.webp` | 03 | ZCode 打开 `CDU-介绍网站` 项目工作区 | 1600×900 / 16:9 | 是 | 已集成 |
| M04-W | `m04-w-workbuddy-development.webp` | 04 | WorkBuddy 收到任务后开始查找成都大学官网资料 | 1600×900 / 16:9 | 是 | 已集成 |
| M04-Z | `m04-z-zcode-development.webp` | 04 | ZCode 收到任务后显示「正在思考」和「工作中」 | 1600×900 / 16:9 | 是 | 已集成 |
| M05 | `m05-cdu-html-file.webp` | 05 | 文件管理器显示练习文件夹中的 `CDU.html` | 1600×900 / 16:9 | 是 | 待截图 |
| M06 | `m06-cdu-browser.webp` | 05 | 浏览器实际打开生成的成都大学介绍网页 | 1600×900 / 16:9 | 是 | 待截图 |
| M07-B | `m07-before.webp` | 06 | 第一次生成的网页 | 1600×900 / 16:9 | 是 | 待截图 |
| M07-A | `m07-after.webp` | 06 | 同一网页修改后，保持相同视口和页面位置 | 与 M07-B 一致 | 是 | 待截图 |

## 补充素材

1. 将实际截图放入 [`public/guide/first-agent/`](../public/guide/first-agent/)。
2. 更新 [`first-agent-media.mjs`](../src/data/first-agent-media.mjs) 中对应编号的 `file`、`description` 和 `status`，状态依次使用“待截图”“已截图”“已集成”。
3. 设置为“已集成”且文件实际存在时，构建过程才输出图片。路径错误或文件缺失时继续显示占位。浏览器加载失败也会恢复占位。
4. 同步本清单的状态，运行 `npm run verify`，再检查页面显示、替代文字和手机宽度。

截图使用 WebP，资源 URL 为 `/guide/first-agent/<文件名>`。拍摄时使用本文的 `CDU-介绍网站` 与 `CDU.html`，示例任务与三条修改指令保存在文章 Markdown 中。

素材配置和文件存在状态参与 Astro 的构建配置缓存键。补图、删图或变更说明后，重新执行构建即可更新渲染结果。使用 `npm run dev` 时，新增或移除素材后重启开发服务器，确保重新计算文件状态。

修改前后图当前并列展示占位。补入两张真实素材后可继续沿用现有区域，后续需要拖动对比时可围绕 `data-agent-comparison` 替换交互。

## 正文与交互维护

正文为 [`first-agent.md`](../src/content/guide/first-agent.md)。Markdown 原生标题继续用于章节锚点和本页目录。本文的 `first-agent:*` 注释在构建时转换为可见教学组件。

- `selector` 生成默认 WorkBuddy 的原生单选控件。
- `choices`、`tool workbuddy`、`tool zcode`、`endchoices` 按所选工具切换安装说明、工作目录说明和任务截图。
- `copy task` 将紧随其后的引用块转换为任务卡片，`revision` 将原文标题和引用块转换为修改卡片。复制和显示使用同一份派生纯文本，Markdown 链接包含实际 URL。
- `media <编号>` 从统一配置生成截图或占位，`comparison` 对应 M07-B 与 M07-A。

扩展由 [`rehype-first-agent.mjs`](../src/lib/rehype-first-agent.mjs) 限定到本篇文件。页面使用原生 TypeScript 增强，禁用 JavaScript 时可阅读两个工具的说明及完整提示词，复制按钮和工具选择器隐藏。

正文由维护者提供，保留原有工具评价与额度表述。按 A7m 于 2026-11-18 确认的[上传正文审阅规则](CONTENT-REVIEW.md#32-审核结论-reviewed--reviewedby)，已补记人工审阅。元数据仍记录为教学示例与 AI 辅助。安装、首次配置和额度信息仍待核对。
