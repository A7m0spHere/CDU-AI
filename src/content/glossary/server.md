---
term: "服务器"
en: "Server"
category: "backend"
aliases: ["Server", "主机", "服务端"]
definition: "接收并回应客户端请求的程序，也可以指运行这些程序的计算机。"
example: "打开报名页时，浏览器向服务器请求数据；「服务器错误」可能来自程序或依赖服务，不能直接断定机器损坏。"
youMaySay: "网站打不开，说是「服务器错误」，跟我有什么关系？"
scenario:
  title: "社团工具突然打不开"
  steps:
    - label: "正常访问"
      body: "同学打开工具报名，一切正常。"
      note: "服务器在回请求。"
    - label: "出现故障"
      body: "页面提示服务器错误，所有人都打不开。"
      meta: "服务中断"
    - label: "排查恢复"
      body: "查看服务状态与日志，恢复后通知同学。"
quiz:
  - question: "服务器在网站里的角色是？"
    options:
      - text: "存放和展示所有网页文件"
        correct: false
      - text: "接收请求、处理数据并返回结果"
        correct: true
      - text: "只负责美化页面"
        correct: false
    explain: "服务器既可以指服务程序，也可以指运行它的机器。"
agentPrompt: "请帮我列一份社团工具上线前的服务器检查清单，覆盖备份、权限、监控和故障通知。"
order: 1
related: ["deployment", "database"]
updated: "2026-10-30"
sources:
  - title: "Server · MDN Glossary"
    url: "https://developer.mozilla.org/en-US/docs/Glossary/Server"
basis: "desk-research"
aiUsage: "drafted"
reviewed: "2026-11-01"
reviewedBy: "AI 初审（负责人授权）"
reviewNote: "AI 按定义、例子及参考资料初审；链接可访问，未逐项核验全部事实或实测产品。"
---

## 是什么

服务器可以指接收请求、处理数据并返回结果的程序，也可以指运行它的机器。它可以在远程机房、虚拟环境或你的电脑上运行。

## 什么时候会遇到

网页打不开提示「服务器错误」、部署应用要买服务器、听说「服务器在机房」。

## 和 AI 的关系

AI 应用也依赖服务器：模型接口、数据存储、账号系统都在后端；本地部署则是把模型放到自己的机器上。

## 想深入再看

相关词条：数据库、部署。
