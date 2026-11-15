# 终止嵌入式官方教程方案

决策日期为 2026-11-16，最终结论为 **NO-GO**。

## 决策

嵌入式官方教程已完成初步技术验证。维护者认定实际产品体验未达到预期，决定终止该方案。后续采用“官方文档链接 + 本站简要指导 + 真实操作实践”。

此决策取代 2026-11-15 实验报告中的 CONDITIONAL GO 建议。iframe、官方网页分屏操作窗口、第三方页面步骤识别、DOM 操作与自动标注、嵌入式跨域兼容方案均从后续产品规划中移除。

## 保留的技术发现

2026-11-15 在 Windows 11、Chrome 157.0.8103.51 和本地静态预览中进行过验证。以下为当时的结果，官方网站策略可能随时间变化。

| 资源 | 当时的观察 |
| --- | --- |
| [WorkBuddy 官网](https://www.workbuddy.cn/) | 可显示、滚动并点击内部链接 |
| [腾讯云 WorkBuddy Enterprise 安装指南](https://cloud.tencent.cn/document/product/1831/134387) | 出现反复导航和空白，稳定嵌入能力未能确认 |
| [ZCode 官网](https://zcode.z.ai/)及[安装指南](https://zcode.z.ai/cn/docs/install) | 可显示、滚动并点击内部链接，官网经 HTTP 跳转到 `/cn` |
| [DSH 官网](https://deepseek.com/harness/)及[开发者文档](https://deepseek-harness.github.io/deepseek-harness/) | 可显示、滚动并点击链接，文档首页经浏览器脚本导航到 quickstart |
| [WorkBuddy 官网 Windows 安装指南](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Installation-Win-Guide) | 补测可显示、滚动并切换文档 |

当时七个入口的最终 HTTP 状态均为 200，捕获的响应未发现 `X-Frame-Options` 或 CSP。腾讯云文档仍出现空白，说明响应头和 iframe 的 `load` 事件都不足以确认实际可读性。

浏览器同源策略限制本站读取跨域页面的 DOM、点击位置和当前步骤。第三方文档还会带入自己的导航、配色和滚动区域。原型中观察到了 iframe 滚动到底后继续带动父页面的现象，窄屏上下分区也增加了阅读距离。

验证范围限于公开页面、浏览器交互和视口模拟。账号登录、Cookie 收紧策略、实际安装、Agent 任务及真实移动设备操作仍待独立核验。产品体验评价依据本轮维护者决策及原型观察。

## 《第一次使用 Agent》的后续方向

1. 简要介绍 WorkBuddy、ZCode、DSH 的适用场景与优缺点。
2. 引导学习者根据需求选择一款工具。
3. 提供对应的官方下载入口和安装文档链接。
4. 为官方教程中容易让零基础学习者困惑的部分补充少量本站说明。
5. 完成一次简单的真实 Agent 操作。
6. 检查实际执行结果。

后续素材可采用常规图文和真实录屏。章节规划继续使用 `/guide/first-agent/`，具体教程另行编写。

## 清理归档

实验基线为 `44dd8040450613943d62f2823897e54a082489ae`。清理时 `spike/embedded-official-docs` 与 `main` 指向同一提交，实验成果均为未提交改动，未发现同名远程实验分支。

本记录提炼原实验报告中的必要事实。实验页面、专用数据、脚本、样式、路由测试登记、截图、探针输出和调试材料随实验废弃，仅保留此决策记录及文档导航入口。
