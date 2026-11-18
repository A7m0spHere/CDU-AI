---
term: "速率限制"
en: "Rate Limit"
category: "cost"
aliases:
  - "Rate Limit"
  - "限流"
  - "请求频率限制"
definition: "服务端对单位时间内的请求频次、token 吞吐量或并发数设定的上限。"
example: "脚本在短时间内连续发起数百次接口请求时，服务端因超出每分钟允许的请求上限而拒绝响应，并提示稍后重试。"
order: 4
related:
  - "usage-based-billing"
  - "token"
  - "trial-quota"
  - "truncation"
updated: "2026-11-18"
sources:
  - title: "Rate limits · Anthropic"
    url: "https://platform.claude.com/docs/en/api/rate-limits"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

在推理算力资源高度密集的 AI 服务中，速率限制是服务端维护系统稳定性与多租户公平性的核心流量控制机制。当单位时间内的请求密度超过分配阈值时，请求会被拒绝或进入排队延迟。

## 主要限制维度

接口平台与在线服务通常从多个独立维度同时实施限流，任一维度超标均会触发拦截：

| 限制维度 | 常见指标 | 控制对象 |
| --- | --- | --- |
| **请求频次** | RPM / RPD（每分钟或每天请求数） | 短时间内的接口调用次数与高频轮询 |
| **吞吐量** | TPM / TPD（每分钟或每天 [token](/glossary/token/) 数） | 随输入与输出文本规模增长的算力负载 |
| **并发度** | 最大并发连接数 | 同一时刻尚未返回结果的在途请求数量 |

## 分级配额与触发场景

不同账号等级享有的限流阈值差异明显：[试用额度](/glossary/trial-quota/)阶段通常配额最低，随着[订阅制](/glossary/subscription/)档位提升或[按量计费](/glossary/usage-based-billing/)累计消费等级晋升，平台会逐步放宽上限。实际使用中，同一组织或账号下的多个脚本、测试任务若共用同一个 [API](/glossary/api/) 密钥，其吞吐消耗会合并计算，极易在批量处理或并发任务中触发限流。

## 工程应对策略

面对临时限流，客户端持续高频重发只会加剧拥塞。规范的工程处理方式包括：解析服务端响应头中返回的剩余配额与建议等待时长；采用指数退避（Exponential Backoff）配合随机抖动延迟重试；以及通过任务队列平滑发送节奏，避免瞬时突发流量。

## 概念边界

- **不等于账号封禁或服务宕机**：触发限流通常返回特定状态码（如 HTTP 429），待时间窗口滑动重置后即可恢复正常调用。
- **不同于容量或输出限制**：速率限制约束的是单位时间内的调用流量，而非单次请求的[上下文窗口](/glossary/context-window/)上限，也不同于因长度或策略导致的输出[截断](/glossary/truncation/)。
