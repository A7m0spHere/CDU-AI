---
term: "部署"
en: "Deployment"
category: "backend"
aliases: ["Deployment", "上线", "发布"]
definition: "将网站、应用或服务安装、发布到目标运行环境，使指定用户或系统能够使用。"
example: "本地做好的社团工具，部署之后同学点链接就能用，不用把你的电脑一直开着。"
youMaySay: "本地做好，怎么让同学直接打开链接就能用？"
scenario:
  title: "发布社团工具"
  steps:
    - label: "本地完成"
      body: "页面在自己电脑上能跑。"
      note: "只有你能访问。"
    - label: "部署上线"
      body: "推到托管平台，得到公开链接。"
      meta: "别人可访问"
    - label: "检查范围"
      body: "确认没有把测试数据或密钥一起发布。"
quiz:
  - question: "部署前最容易被忽略的检查是？"
    options:
      - text: "页面颜色"
        correct: false
      - text: "密钥与测试数据是否被一起发布"
        correct: true
      - text: "按钮数量"
        correct: false
    explain: "部署可能让文件或服务被目标用户访问，需检查访问范围和敏感信息。"
agentPrompt: "请帮我列一份部署前检查清单，重点看密钥、测试数据、访问权限和回滚方式。"
order: 3
related: ["server", "api"]
updated: "2026-11-01"
sources:
  - title: "Deployments overview · Vercel"
    url: "https://vercel.com/docs/deployments/overview"
  - title: "Publishing your website · MDN"
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Publishing_your_website"
basis: "desk-research"
aiUsage: "drafted"
reviewed: "2026-11-01"
reviewedBy: "A7m"
reviewNote: "负责人确认修改定义和题目解释；托管网页正文保留，未实测托管平台。"
---

## 是什么

部署可以把本地做好的网站或应用发布到服务器或托管平台，让指定用户能够访问；访问范围取决于配置。

## 什么时候会遇到

做完页面想发给同学看、社团工具要上线、看到「部署成功」的提示。

## 和 AI 的关系

AI 能帮你写部署配置和排查报错，但域名、权限、数据安全仍要自己确认；部署不等于长期运营。

## 想深入再看

相关词条：服务器、接口（API）。
