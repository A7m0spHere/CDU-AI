---
term: "隐私"
en: "Privacy"
category: "safety"
aliases: ["Privacy", "数据隐私", "个人信息保护"]
definition: "关于谁能看、存多久、拿去做什么的数据边界问题。"
example: "把身份证照片、成绩单、聊天记录直接发给 AI 之前，先想清楚这些内容会被怎么保存和使用。"
youMaySay: "把成绩单发给 AI，会有什么后果？"
scenario:
  title: "上传含个人信息的表格"
  steps:
    - label: "查看说明"
      body: "上传前先检查服务条款和数据设置。"
      note: "了解保存方式与数据用途。"
    - label: "处理数据"
      body: "只提供完成任务必需的信息，并处理可能识别个人的字段。"
      meta: "尽量减少信息"
    - label: "确认授权"
      body: "是否能上传，还需遵守相关授权和组织规定。"
      note: "去掉姓名、学号也不必然等于匿名化。"
quiz:
  - question: "使用 AI 时保护隐私最有效的第一步是？"
    options:
      - text: "删除聊天记录"
        correct: false
      - text: "上传前脱敏，只给完成任务必需的信息"
        correct: true
      - text: "换一个模型"
        correct: false
    explain: "减少敏感信息暴露最直接有效。"
agentPrompt: "请分析下面表格的成绩分布；我已去掉姓名学号，如果还需要其他字段请先问我，不要推测个人信息。"
order: 3
related: ["copyright", "prompt-injection"]
updated: "2026-11-01"
sources:
  - title: "Privacy Policy · Anthropic"
    url: "https://www.anthropic.com/legal/privacy"
  - title: "中华人民共和国个人信息保护法 · 中国网信网"
    url: "https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm"
basis: "desk-research"
aiUsage: "drafted"
reviewed: "2026-11-01"
reviewedBy: "A7m"
reviewNote: "负责人确认修改上传前场景；法律与政策依具体情况适用，未实测产品。"
---

## 一句话说清

用 AI 时的隐私问题，核心是三件事：你传了什么、对方存多久、会不会用于训练或被别人看到。

## 打个比方

像把材料交给打印店：印完是否留底、谁能翻看，取决于店里的规定，而不是你的默认想象。

## 它是怎么运作的

对话内容可能被服务商保存、用于改进模型或人工审核；不同产品、不同套餐的策略不同，企业版与个人版也常不同。

## 你会碰到它的场景

- 上传含姓名学号的表格；
- 粘贴同学聊天记录让 AI 总结；
- 开启「帮助改进产品」选项。

## 常见误解

- 以为删了对话就没了：后台可能仍有留存；
- 以为企业版绝对保密：仍要看合同与配置；
- 以为打个码就安全：组合信息仍可能识别个人。

## 想再深入一点

传材料前先脱敏：去掉姓名、学号、联系方式，只保留完成任务必需的信息。
