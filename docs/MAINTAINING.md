# 维护者操作说明

本文负责本地排障、文档检查与仓库管理。贡献入口和合并流程见 [贡献指南](../CONTRIBUTING.md)，内容事实与审核见 [审校规范](CONTENT-REVIEW.md)。

## 验证入口

在仓库根目录安装依赖后运行：

```bash
npm ci
npm run verify
```

`verify` 依次执行类型检查、内容校验、文档校验、生产构建、测试与站内链接检查。单独执行 `npm test` 或 `npm run check:links` 前，先运行 `npm run build`，避免拿旧产物判断当前修改。

修改检查规则时，在 `tests/fixtures/content/` 或检查器测试中补充能暴露该问题的合法 / 错误样例。正式内容不能充当错误样例。

| 修改范围 | 本地验证 |
| --- | --- |
| 仅维护说明或普通 Markdown 文案 | `npm run check:docs`、`git diff --check`；任务另有完整验证要求时按要求执行 |
| 工具数据、内容、schema、页面、脚本或样式 | `npm run verify`；交互变更补充相关浏览器检查 |
| 主题交互、持久化，或搜索/筛选与主题兼容 | 先 `npm run verify`，再 `npm run test:browser` |

`verify` 不包含浏览器回归，也不访问外部链接。记录结果时写清实际执行的命令、版本与范围，不把类型、链接或 CI 通过当作文档语义一致、真实设备体验或内容事实审核的证明。

### 主题浏览器回归

主题、搜索和工具目录共用 `tests/theme.browser.test.mjs`。需要运行浏览器回归时，先完成当前源码的 `npm run verify`，再运行：

```bash
npx playwright install chromium
npm run test:browser
```

浏览器测试使用刚构建的 `dist/`，在本机回环地址临时提供页面，完成后关闭服务与浏览器。CI 在常规验证后执行相同回归；Linux 安装浏览器依赖使用 `npx playwright install --with-deps chromium`。检查入口与关键行为分别见[主题模块](modules/theme.md#验证与排障)、[工具目录模块](modules/tool-catalog.md#验证与排障)、[搜索模块](modules/search.md#验证与排障)，共享测试文件还包含首页和指南等回归。

已有 Chrome 时，Windows PowerShell 也可通过 `$env:PLAYWRIGHT_CHANNEL = 'chrome'` 使用系统浏览器；自动查找不到时，用 `$env:PLAYWRIGHT_EXECUTABLE_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'` 指定实际安装路径。测试后移除本次设置的环境变量以恢复默认。手机视口模拟不等同于真实设备验收。

### 文档检查范围

`npm run check:docs` 检查根目录、`docs/`、`.github/` 的 Markdown，以及 `src/content/` 下以 `_` 开头的模板：

- 本地文件、目录、图片和 Markdown 标题锚点；引用式链接与 HTML 的 `href` / `src` 也检查。
- YAML 代码块的语法；代码围栏中标为 `yaml review-fields` 的示例，额外复用内容检查器的审校字段规则。
- 普通行内代码与代码块中的链接示例不当作真实引用。

外部链接不发网络请求；可达性、事实是否得到来源支持仍由维护者核对。文档检查也不能替代页面视觉、可访问性或内容审核与负责人确认。

## 内容缓存排查

删改 Markdown 后，如果本地验证仍提到已经删除的内容、旧搜索记录或旧审校状态，可能是内容缓存尚未刷新。先停止本地开发服务，在仓库根目录清理内容缓存与构建产物后重试：

```powershell
# Windows PowerShell
Remove-Item -LiteralPath 'node_modules/.astro', '.astro', 'dist' -Recurse -Force
npm run verify
```

```bash
# macOS / Linux
rm -rf node_modules/.astro .astro dist
npm run verify
```

Astro 5 的内容层缓存位于 `node_modules/.astro`，根目录 `.astro/` 也包含生成信息。CI 每次 `npm ci` 会重建依赖目录；CI 通过与本地清缓存后的验证结果分别记录。

内容检查器会显式拒绝 schema 之外的未知字段（例如已废弃的 `duration`），避免它们被 Zod 静默丢弃。

## 仓库管理设置

### 2026-10-20 核对快照

以下来自当日 GitHub API 核对，**不是当前远端状态**。变更设置前，用管理员账号重新核实；更新记录时写明日期与依据。

| 项目 | 当时状态 |
| --- | --- |
| `main` 分支保护 | 未开启（`GET /branches/main/protection` 返回 404） |
| Rulesets | 无（返回空数组） |
| CODEOWNERS | 已添加 [`.github/CODEOWNERS`](../.github/CODEOWNERS)，尚未强制要求 Code Owner 审阅 |
| GitHub Actions | 已启用，`allowed_actions: all`，未要求 SHA pinning |
| 仓库 secrets | CI 未使用；外部 fork 的 PR 默认拿不到 secrets |
| 合并方式 | merge / squash / rebase 均允许，尚未统一 |

### 管理员设置建议

1. 为 `main` 配置 branch protection 或 Ruleset：要求 PR、`verify` 检查通过及讨论解决，禁止强制推送和删除。单人维护阶段可保留管理员绕过，或暂不要求 approval。
2. 有第二位维护者后，再开启 Code Owner 审阅要求，避免单人维护时无法处理自己的 PR。
3. Actions 的 Workflow permissions 使用 **Read repository contents only**；非必要不允许 Actions 创建或批准 PR。
4. 合并方式建议统一为 Squash merging；由维护者在仓库设置中决定。
5. 检查外部 fork PR 的工作流日志；CI 使用 `contents: read`，不读取 secrets。本地工作流定义见 [ci.yml](../.github/workflows/ci.yml)。

只读核对命令，需要 GitHub CLI 和相应仓库权限：

```bash
gh api repos/A7m0spHere/CDU-AI/branches/main/protection
gh api repos/A7m0spHere/CDU-AI/rulesets
```

分支保护接口返回 404 时，先确认仓库、分支与当前账号权限，再结合 Rulesets 判断；不能仅凭 404 推断所有保护均未启用。
