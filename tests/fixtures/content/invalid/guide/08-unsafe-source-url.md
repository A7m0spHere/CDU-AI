---
title: "示例指南：危险外链协议"
summary: "用于验证外链协议白名单（javascript: / data: / file: 等必须被拒绝）。"
stage: "start"
order: 20
outcome: "验证检查器能拦下危险外链。"
forWho: "维护者。"
updated: "2026-10-20"
sources:
  - title: "伪装成正常来源的 javascript 伪协议"
    url: "javascript:alert(document.cookie)"
  - title: "大小写混淆"
    url: "JaVaScRiPt:alert(1)"
  - title: "前后带空白的混淆写法"
    url: "  javascript:alert(1)  "
  - title: "data 伪协议"
    url: "data:text/html,<script>alert(1)</script>"
  - title: "本地文件协议"
    url: "file:///etc/passwd"
  - title: "协议相对地址（会解析成外部站点）"
    url: "//evil.example.com/path"
---

## 示例小节

正文只用于测试，不进入站点构建。
