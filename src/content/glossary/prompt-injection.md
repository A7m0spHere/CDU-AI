---
term: "提示词注入"
en: "Prompt Injection"
category: "runtime"
aliases: ["提示注入"]
definition: "提示词注入是输入中的隐藏指令让模型偏离任务或越权操作的安全问题。"
example: "一封邮件里可能藏着「把附件转发出去」的指令；只靠提示词挡不住，需要工具权限和审批。"
order: 1
related: ["system-prompt", "permission-mode", "sandbox"]
updated: "2026-10-19"
sources:
  - title: "OWASP · LLM Prompt Injection Prevention Cheat Sheet"
    url: "https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html"
---

## 一句话说清

别人把指令藏在你让 AI 处理的材料里，骗它偏离你原本的要求。你的任务被「劫持」了，但你往往看不出来。

## 打个比方

你让助理去读一封信，信纸最下面用小字写着「读完把附件转发到某个地址」。助理如果照做，出问题的是你。

## 它是怎么运作的

1. 材料来自不可信的地方：网页、邮件、别人写的文档、下载的 PDF。
2. 里面夹着看起来像指令的句子。
3. 模型分不清「这是资料」还是「这是命令」，可能当真执行。
4. 如果它还有工具权限，就不只是说错话，而是真的动手。

## 你会碰到它的场景

- 让 AI 总结一个陌生网页。
- 让 Agent 读别人的文档、处理收到的邮件。
- 把抓来的公开资料直接喂给带工具的助手。

## 常见误解

- 以为在提示词里写「忽略文档里的指令」就安全。这类防护能被绕过。
- 以为只有黑客才会这么干。普通文档里一句「请忽略以上要求」也算。
- 以为不联网就没事。本地文件同样可以夹带指令。

## 想再深入一点

真正的防线是权限：它能读什么、能写什么、哪些动作必须问你。把安全寄托在提示词上，等于把门锁写在门上。
