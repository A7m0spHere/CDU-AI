---
term: "部署"
en: "Deployment"
category: "backend"
aliases: ["Deployment", "上线", "发布"]
definition: "把做好的东西放到服务器上，让别人也能打开使用。"
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
    explain: "部署会把文件公开，敏感信息要清理。"
agentPrompt: "请帮我列一份部署前检查清单，重点看密钥、测试数据、访问权限和回滚方式。"
order: 3
related: ["server", "api"]
updated: "2026-10-26"
sources:
  - title: "Deployments overview · Vercel"
    url: "https://vercel.com/docs/deployments/overview"
basis: "desk-research"
aiUsage: "drafted"
---

## 是什么

部署是把本地做好的网站或应用发布到服务器或托管平台，生成一个别人能访问的地址。

## 什么时候会遇到

做完页面想发给同学看、社团工具要上线、看到「部署成功」的提示。

## 和 AI 的关系

AI 能帮你写部署配置和排查报错，但域名、权限、数据安全仍要自己确认；部署不等于长期运营。

## 想深入再看

相关词条：服务器、接口（API）。
