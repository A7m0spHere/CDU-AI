---
term: "验收"
en: "Acceptance"
category: "product"
aliases: ["Acceptance", "验收测试", "交付检查"]
definition: "按事先说好的标准检查结果行不行，决定算不算完成。"
example: "工具交给社团前，按清单逐项试：报名成功了吗？导出正常吗？手机上能用吗？"
youMaySay: "做到什么程度才算「做完了」？"
scenario:
  title: "工具交付前验收"
  steps:
    - label: "约定标准"
      body: "交付前列出必须通过的功能清单。"
      note: "没有标准就没有验收。"
    - label: "逐项测试"
      body: "按清单试用，记录不通过的项。"
      meta: "逐项核对"
    - label: "修复复查"
      body: "修完后只复查相关项，避免遗漏。"
quiz:
  - question: "验收前最重要的是？"
    options:
      - text: "先开发完再说"
        correct: false
      - text: "事先约定可检查的完成标准"
        correct: true
      - text: "找一个同学点赞"
        correct: false
    explain: "标准先行，验收才有依据。"
agentPrompt: "请根据下面的需求抽出验收清单，每条写成「操作＋预期结果」，并按重要性排序。"
order: 3
related: ["requirements", "test-case"]
updated: "2026-10-26"
sources:
  - title: "Acceptance testing · ISTQB 术语表"
    url: "https://glossary.istqb.org/en_US/term/acceptance-testing"
basis: "desk-research"
aiUsage: "drafted"
reviewed: "2026-11-01"
reviewedBy: "AI 初审（负责人授权）"
reviewNote: "AI 按定义、例子及参考资料初审；链接可访问，未逐项核验全部事实或实测产品。"
---

## 是什么

验收是按约定标准逐项检查成果：功能是否做到、边界情况是否处理、是否符合使用场景。

## 什么时候会遇到

小组作业交付前、工具给同学用之前、和 AI 反复修改到「差不多了」时。

## 和 AI 的关系

AI 可以帮你列检查清单，但验收要人来拍板；没有事先标准，就容易各说各话。

## 想深入再看

相关词条：测试用例、需求。
