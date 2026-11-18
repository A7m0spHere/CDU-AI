---
term: "试用额度"
en: "Trial Quota"
category: "cost"
aliases:
  - "试用期额度"
  - "赠送额度"
  - "试用次数"
definition: "服务商面向新用户或评估场景提供的有限免费用量或限时体验权限。"
example: "开发者注册接口平台后获得一定期限或数量的免费调用额度，用于测试连通性与生成质量，耗尽后需切换为付费方案。"
order: 3
related:
  - "subscription"
  - "usage-based-billing"
  - "rate-limit"
  - "api"
updated: "2026-11-18"
sources:
  - title: "Free Google Cloud features and trial offer · Google Cloud"
    url: "https://docs.cloud.google.com/free/docs/free-cloud-features"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

试用额度通常用于在正式付费前降低体验门槛，帮助个人用户或技术团队在真实任务中检验产品交互、模型能力与系统兼容性。其具体形态与有效期高度依赖平台当前的运营规则。

## 常见发放形式

不同定位的 AI 服务会根据自身入口形态设计差异化的试用资源：

- **一次性额度赠金**：常见于开发者 [API](/glossary/api/) 平台，账号激活或完成认证后发放一定金额或 [token](/glossary/token/) 数量，用完即止且通常设有失效日期。
- **限时功能体验**：面向终端用户的产品常提供数天的高级模型或特定工作流试用期，到期后恢复为受限功能。
- **周期性基础配额**：部分产品为未付费用户保留每日或每小时刷新的基础调用次数，作为长期免费的入门体验层。

## 生效条件与约束

试用资源的获取与使用往往附带严格边界。服务商常通过手机号验证、支付方式绑定或组织认证防止批量滥用，并对试用账号施加比付费用户更严格的[速率限制](/glossary/rate-limit/)与并发上限。在能力层面，试用期内的可用模型版本、最大[上下文窗口](/glossary/context-window/)以及响应优先级也可能受到限制。

## 到期与耗尽后的衔接

当试用时长到期或赠送配额耗尽时，平台通常会暂停高阶调用并引导升级。面向日常对话的应用多建议转为[订阅制](/glossary/subscription/)套餐，而需要持续接入业务系统的接口服务则需绑定结算方式以切换至[按量计费](/glossary/usage-based-billing/)。

## 概念边界

- **不构成稳定服务承诺**：试用额度、周期性基础免费额度与付费套餐配额属于不同规则体系，免费规则随时可能调整或收回，不宜直接用于生产环境依赖。
- **不代表完整产品上限**：试用阶段遭遇的排队延迟或功能阉割，并不等同于正式付费版本的能力上限。
