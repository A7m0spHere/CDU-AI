# 主题系统开发说明

本文说明主题的参数、首屏应用、运行时和编辑器如何协作。视觉与交互要求见[设计系统](../DESIGN-SYSTEM.md#主题)，图片和字体的来源与许可见[主题素材记录](../THEME-ASSETS.md)。

## 职责与边界

主题在本浏览器中运行和保存，不依赖账号或服务端。内置浅色、深色使用 CSS 默认令牌；预设与自定义主题通过参数推导覆盖变量。编辑器负责草稿和预览，运行时负责应用主题与保存数据。

## 文件地图

| 入口 | 职责 |
| --- | --- |
| [`theme-core.ts`](../../src/lib/theme-core.ts) | `ThemeParams`、`StoredTheme`、参数归一化、颜色计算与 `resolveThemeVars`，不依赖 DOM |
| [`themes.ts`](../../src/data/themes.ts) | 预设参数、稳定 ID 和菜单分组 |
| [`BaseLayout.astro`](../../src/layouts/BaseLayout.astro) | 构建时解析预设变量，内联脚本在首屏前读取本地偏好 |
| [`ThemePicker.astro`](../../src/components/ThemePicker.astro) | 色板菜单、错误提示与编辑器/导入对话框模板 |
| [`theme.ts`](../../src/scripts/theme.ts) | 读取存档、应用变量、菜单、持久化、字体加载与编辑器按需加载 |
| [`theme-editor.ts`](../../src/scripts/theme-editor.ts) | `ThemeEditorHost` 接口、草稿、预览、文件读取、导入导出 |
| [`tokens.css`](../../src/styles/tokens.css)、[`theme-picker.css`](../../src/styles/theme-picker.css)、[`theme-editor.css`](../../src/styles/theme-editor.css) | 默认令牌、菜单及按需加载的编辑器样式 |
| [`image-mode.css`](../../src/styles/image-mode.css)、[`techne.css`](../../src/styles/techne.css)、[`fonts.css`](../../src/styles/fonts.css) | 图片背景、特色场景和站内字体 |
| [`theme-code-tokens.mjs`](../../src/lib/theme-code-tokens.mjs) | 连接 Markdown 高亮产物与代码文字、注释的主题变量 |

全站模块脚本由 [`global.ts`](../../src/scripts/global.ts) 引入主题运行时。不要把编辑器作为全站静态依赖导入。

## 数据流与接口

### 参数与首屏

`ThemeParams` 是编辑和导入的参数模型，完整字段以 `theme-core.ts` 为准。`normalizeParams` 补齐旧存档中的缺省值，清洗颜色、图片和字体地址，限制数值范围；`resolveThemeVars` 将参数转换为语义 CSS 变量。

首屏与后续交互分两步：

1. `BaseLayout.astro` 把预设解析成变量表。头部内联脚本读取主题 ID，对预设使用构建时变量，对自定义主题使用存档中的 `vars`，并设置基础模式、背景标记及自定义字体；没有指定主题时跟随系统偏好。
2. `theme.ts` 加载后归一化自定义主题的 `params`，重新推导变量，再应用当前主题。切换到内置主题时清除行内自定义变量，恢复 CSS 默认值和 Shiki 高亮。

因此 `StoredTheme` 同时保存 `params` 与 `vars`：参数供运行时编辑，变量缓存供首屏使用。增加主题参数或修改变量名时，需要检查这两条路径，不能只验证编辑器里的即时预览。

### 按需加载与编辑会话

新建、编辑和导入共享 `theme.ts` 中的 `editorRequest`。首次操作动态加载 `theme-editor.ts`；初始化先加载编辑器 CSS，再克隆对话框模板并绑定事件。成功初始化后重复打开复用同一实例，加载失败时清空请求以允许重试。

`ThemeEditorHost` 通过 getter 提供当前主题列表和 ID，并提供应用、存储等操作。编辑器不直接另建一份持久化状态。

- `openSequence` 标识本次打开请求；加载期间取消后，迟到的初始化结果不能再弹出对话框。
- 草稿与存档分开，预览只应用变量，不写入主题列表。取消或关闭停止待执行预览并恢复已应用主题；保存成功后关闭时保留新主题。
- 图片读取检查 `editorSession`；字体读取还检查 `fontReadRequest`，切换字体风格或地址会使旧读取失效。字体拖放独立处理，不触发背景图片导入。

### 存储与导入导出

| 存储键 | 内容与失败行为 |
| --- | --- |
| `cdu-ai-theme` | 当前主题 ID。未设置时跟随系统；写入失败被忽略，因此本次切换可能生效但刷新后无法恢复 |
| `cdu-ai-custom-themes` | `StoredTheme[]`。读入失败回退空列表；保存、导入、删除只有在写入成功后才替换运行时列表，失败显示错误并保留原有列表 |

这两个键不是事务。主题列表成功保存不等于当前 ID 一定成功写入；不要把列表写入失败的回滚保障扩大到所有存储操作。保存失败时编辑器仍可展示草稿预览，原存档不变，可继续修改、导出或取消。

导出包装为 `{ format: 'cdu-ai-theme', version: 1, params }`，下载 JSON 并尝试复制。导入接受含 `params` 的对象或参数对象本身，归一化后作为新主题保存并应用；当前没有严格检查 `format` / `version`，也不直接信任外部 `vars`。

图片与字体文件各有 2 MiB 的读取上限，但最终存档受浏览器总配额约束。具体地址白名单和字段回退以 `sanitizeImageUrl`、`sanitizeFontSrc`、`normalizeParams` 为准。

## 必须保持的行为

- 参数规范与变量推导集中在 `theme-core.ts`；构建预设和运行时共用令牌推导，存档恢复和导入经参数归一化，不各写一套计算。
- 首屏变量缓存与运行时推导对应；旧存档缺少新字段时仍可恢复。
- 普通阅读和预设切换不加载编辑器脚本或样式；重复打开不创建重复对话框。
- 取消、关闭和保存终止待执行的预览；旧文件读取不能修改后续会话的草稿。
- 切回内置主题清除自定义覆盖；交互、对比度、手机菜单与无 JS 要求统一遵循设计系统。

## 常见修改路径

| 修改 | 需要核对的入口 |
| --- | --- |
| 增加一个预设 | `themes.ts`；检查 ID、分组、参数、首屏恢复；新增素材同步素材记录 |
| 增加主题参数 | `ThemeParams` → 默认值/归一化/变量推导 → 编辑器模板与字段绑定 → 使用变量的样式；检查旧 JSON、存档与首屏缓存 |
| 修改保存或导入 | 运行时持久化函数与 `ThemeEditorHost` → 编辑器错误路径；分别验证列表保存和当前 ID 恢复 |
| 修改代码配色 | `theme-code-tokens.mjs` 与代码块样式；检查自定义覆盖和内置 Shiki 回退 |

## 验证与排障

命令及浏览器环境设置统一见[维护说明](../MAINTAINING.md#验证入口)。修改主题交互或持久化时，完成 `npm run verify` 后运行 `npm run test:browser`。

| 证据入口 | 检查内容 |
| --- | --- |
| [`theme.test.mjs`](../../tests/theme.test.mjs) | 参数类型错误的回退、颜色对比度、代码高亮变量与字体参数 |
| [`theme.browser.test.mjs`](../../tests/theme.browser.test.mjs) | 按需加载/重试/取消、预览终止、存储失败与配额超限、文件读取隔离、字体恢复、手机菜单及目录兼容 |

仅修改说明文档不需要重跑浏览器来证明既有行为；测试覆盖也不等于所有任意主题组合都经过视觉验收。

- 刷新后主题不同：分别核对两个存储键、首屏缓存与运行时参数，区分存储失败和推导差异。
- 取消后颜色又变化：检查预览定时器、打开请求序号和文件读取的会话条件。
- 字体或图片缺失：检查地址清洗、资源加载、字体回退与存储配额；不要只看菜单中的色板。
