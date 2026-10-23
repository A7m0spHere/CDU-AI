# 内容维护规范

> 面向协会内容维护者。先读这里，再改 `src/content/` 或 `src/data/`。完整文件地图和新增流程见 [`CONTRIBUTING.md`](https://github.com/A7m0spHere/CDU-AI/blob/main/CONTRIBUTING.md)。

## 0. 从模板开始

三个内容目录当前只保留 `_TEMPLATE.md`（旧内容已于 2026-10-20 清空）：

- `src/content/guide/_TEMPLATE.md`：学习指南模板
- `src/content/works/_TEMPLATE.md`：作品示例模板
- `src/content/glossary/_TEMPLATE.md`：术语模板

复制模板 → 去掉文件名开头的下划线并改成正式文件名 → 按注释填写 frontmatter 与正文。**以 `_` 开头的文件不会进入构建**，可以作为草稿模板长期保留。内容为空时列表页会显示「内容准备中」占位。

## 1. 三条底线

1. **不编事实**：没有确认的活动日期、场地、嘉宾、人数、学校授权、合作方、学生作品，一律不写。
2. **不替工具打广告**：不写「最强」「第一」「官方推荐」「必备」；写清楚适用场景、门槛、限制。
3. **不制造焦虑**：不用「再不学就被淘汰」「人人都该会」这类话。面向零基础不等于降低准确性。

## 2. 语气

- 像一个耐心的学长/学姐，具体、直接、说人话。
- 第二人称「你」；少用「我们」替读者做判断。
- 先给场景，再给方法，最后给边界。
- 专业术语第一次出现时用一句话解释。
- 标题尽量包含动词或结果，不要只写「提示词」「工具」这类空泛名词。

## 3. 学习指南 frontmatter

文件放在 `src/content/guide/`，文件名用英文小写与连字符，例如 `01-ai-first-step.md`。

### 目录归属：`src/data/guide-nav.ts`

侧边栏的**分组（栏目）**单独维护在 [`src/data/guide-nav.ts`](../src/data/guide-nav.ts)，与文章的 `stage` / `order` 解耦：

- `stage` + `order` 只决定「上一篇 / 下一篇」的阅读顺序；
- `guideNavGroups` 决定文章出现在侧边栏哪个栏目、栏目内第几条、以及目录总览卡片；
- 只登记 `slug` 没有对应文件 = 「规划中」占位（灰色不可点，不生成路由）；
- 建了文件但没登记 = `npm run check:content` 报错（避免文章写了却不在目录里）。

新增一篇文章的完整流程：

1. 在 `guide-nav.ts` 找到目标栏目，确认已有占位条目（如 `{ label: '任务描述', slug: 'task-description' }`）；没有就加一条；
2. 用同一个 `slug` 建文件 `src/content/guide/<slug>.md`（可先复制 `_TEMPLATE.md`）；
3. 填 frontmatter（`stage` 决定阅读顺序、`order` 决定同阶段排序）与正文；
4. 跑 `npm run verify`：侧边栏自动变成真实链接，标题取文章 `title`，目录计数同步。

调整栏目（改名、加分组、换顺序）只改 `guide-nav.ts`，不需要动组件或页面。

```yaml
---
title: "先建立使用 AI 的基本姿势"
summary: "用一句话说明这个模块能帮上什么忙。"
stage: "start" # start | make | share
order: 1
level: "零基础"
outcome: "读完后你能做到的一件具体小事。"
forWho: "最适合哪类同学，避免写给所有人。"
updated: "2026-10-18" # 必填，ISO 日期；页面显示“最后更新”
sources: # 可选；有外部依据时填写，必须可打开
  - title: "Anthropic · Prompt engineering overview"
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview"
tools: ["DeepSeek", "Kimi"] # 可留空，但必须是工具目录里已有的名字
tags: ["AI 素养", "安全"]
# 内容状态字段（可选；默认按「初稿 + AI 辅助起草 + 教学示例」展示）
# reviewed / reviewedBy / needsUpdate / reviewNote / basis / aiUsage / testedOn / testedEnvironment / contributors
# 定义与判定规则见 docs/CONTENT-REVIEW.md
---
```

正文要求：

- 900–1500 汉字为宜，一个模块只解决一个问题。
- **不写估算阅读时长**：不写「约 15 分钟读完」，步骤里也不标分钟数——这类数字没有依据，容易被当成承诺。
- 用 `##` 二级标题组织结构；页面会自动生成侧边目录。
- 至少包含：一个真实场景、一个可照着做的步骤、一个常见坑或边界提醒。
- 提示词示例用 ```text 代码块，方便复制。
- 不写作者个人经历冒充普遍结论；如需举例，用明确标注的假设/示例。

阶段含义：

| stage | 页面文案 | 内容 |
| --- | --- | --- |
| `start` | 先建立判断 | AI 能做什么、安全与隐私、如何提问 |
| `make` | 动手做出东西 | 找需求、用工具、验证结果、完成一个成果 |
| `share` | 整理与分享 | 记录过程、表达作品、复盘与进阶 |

## 4. 作品示例 frontmatter

文件放在 `src/content/works/`。M0 **所有条目必须是策划示例**：

```yaml
---
title: "食堂选择困难救援站"
summary: "一句话说清它回应什么真实需求。"
category: "校园生活" # 校园生活 | 学习效率 | 创意表达 | 跨专业实验
format: "对话式小工具"
tools: ["DeepSeek"]
tags: ["决策辅助", "校园"]
prompt: "可以复制给 AI 的第一条提示词。"
effort: "一个下午"
level: "零基础"
order: 1
updated: "2026-10-18" # 必填，ISO 日期；页面显示“最后更新”
status: "example" # M0 只能是 example
---
```

正文建议结构：

- `## 它回应的问题`
- `## 可以怎么做`（3–5 步）
- `## 一个起点提示词`（可选，页面已展示 frontmatter 的 prompt）
- `## 别急着做大`（边界与最小可行范围）

必须使用「可以做」「适合从这里开始」等设计语气，不能写成「我们已经完成」「同学们已经投稿」。UI 会统一展示「策划示例」。

## 5. 术语表

在 `src/content/glossary/` 新建 Markdown，一个词一篇；分类在 `src/data/glossary.ts` 的 `glossaryCategories` 中维护。

frontmatter：

- `term` / `en`：中文名与英文名；
- `category`：已有分类 id；
- `definition`：一句话释义，列表卡片、搜索结果和页面标题都会用到；
- `example`：校园或学习场景示例；
- `aliases`：常见别名；
- `order`：同分类内排序，从 1 连续；
- `related`：相关词条 id；
- `updated`：最后核对日期。
- `sources`：正文事实的官方文档或原始论文，包含 `title` 与 `url`，详情页自动渲染参考来源。
- `reviewed` / `reviewedBy`：真人逐条核校完成的日期与审校人署名（可笔名）；只补来源或由 AI 校订不算人工核校完成。
- `needsUpdate` / `reviewNote`：发现过期或问题时标记待更新，并写明原因（≤200 字）。
- `basis`：`first-hand`（亲自实测）/ `desk-research`（资料整理）/ `teaching-example`（默认，教学示例）；`first-hand` 必须同时填写 `testedOn` 与 `testedEnvironment`。
- `aiUsage`：`none` / `assisted` / `drafted`（默认），如实标注 AI 参与程度。
- `contributors`：最多 5 个贡献者代称，不写真实姓名、学号等隐私。

正文固定分节，每节都要能被零基础读者读懂：

- `一句话说清`：它是什么，为什么重要；
- `打个比方`：一个生活化的类比；
- `它是怎么运作的`：分步骤说明，不堆术语；
- `你会碰到它的场景`：校园或学习中的具体动作；
- `常见误解`：两三条「以为……其实……」；
- `想再深入一点`（可选）：一两句技术补充。

写作要求：面向非计算机专业同学，不假设读者知道 API、模型、上下文等前置概念；必须出现的术语要当场解释清楚，或链接到本表另一条。

来源标注要与实际情况一致，分两层写：

- 词条定义、别名与一句话释义由本站独立撰写，事实与数字以 `sources` 中列出的官方文档为准；
- 详情页正文（类比、步骤、场景、常见误解）同样由本站撰写，初稿可由 AI 协助。**页面状态由 `reviewed` 字段自动推导**：没有审校日期就显示「初稿 · 尚未人工核校」，真人逐条核校后填写 `reviewed` / `reviewedBy` 才会显示「已人工核校」。不要为了消掉提示而提前填日期。

校准一条术语的标准：能指出它「不成立」的边界（例如微调不能可靠记住新事实），并且没有写死会变化的价格、额度、版本号。

### 外链协议规则（安全）

- `sources` 与工具 `url` **只允许 `http:` / `https:` 绝对地址**；`javascript:`、`data:`、`file:`、`vbscript:` 以及协议相对的 `//example.com` 一律被拒绝，报错会指出文件与字段。
- 正文 Markdown 里的链接同一规则：危险协议在渲染阶段直接去掉 `href`（文字保留），外链自动加 `target="_blank"` 与 `rel="noopener noreferrer"`。
- 站内链接写 `/guide/`、`#anchor` 这类相对路径即可，不要写完整域名。

改动后运行 `npm run verify`（包含 `npm run check:content` 文件级检查与完整构建测试），检查术语条目、筛选、详情页和搜索索引是否正常生成。

## 6. 工具数据

工具目录只由维护者审核后入库（不开放自动发布、不迁移 Markdown），全部数据在 [`src/data/tools.ts`](../src/data/tools.ts)，字段由 [`src/data/types.ts`](../src/data/types.ts) 的 `Tool` 约束。**改数据就能加工具**：页面、筛选计数、首页推荐、搜索索引都由这份数组推导，不需要动组件。

### 6.1 分类与技术类型不是一回事

分类回答「我想做什么」，技术类型回答「它靠什么实现」。两者必须分开写，否则页面会变成一锅粥：

| 层次 | 例子 | 写在哪里 |
| --- | --- | --- |
| 场景分类 | 语言模型与对话 / 图像生成与编辑 | `category`（`toolCategories` 里的 id） |
| 资源形态 | 在线产品 / 开源项目 / 模型 / 工作流工具 / 开发工具 | `kind` |
| 技术类型 | LLM 对话应用 / 扩散模型 / Agent Harness / TTS / STT | `tech` |

常见错误：把 ChatGPT 写成「LLM」（它是产品，LLM 是模型类别）；把 Claude Code 写成「开源项目」（产品闭源，仓库只放文档）；把 ComfyUI 写成「扩散模型」（它是跑模型的工作流工具）。**收录前先确认它属于哪一层。**

### 6.2 一条工具的字段

```ts
{
  id: 'deepseek',            // 稳定唯一，用于筛选与未来的详情页
  name: 'DeepSeek',
  category: 'llm-chat',      // 主分类
  alsoIn: ['workflow'],      // 可选：还能在哪些场景被找到
  aliases: ['深度求索'],      // 可选：别名，参与搜索
  summary: '一句话：它是什么',
  description: '两三句话：新手拿它做什么',
  bestFor: '最适合的具体场景，不要写「提效」这类空话',
  difficulty: '零门槛',        // 零门槛 / 稍加摸索 / 需要动手
  pricing: '免费可用',         // 免费可用 / 免费增值 / 需要付费（不写具体价格）
  url: 'https://chat.deepseek.com/',
  githubUrl: 'https://github.com/...', // 可选：开源项目或官方仓库
  tech: 'LLM 对话应用',
  kind: '在线产品',
  capabilities: ['beginner', 'zh'],    // open-source / local / beginner / zh
  tier: '主流产品',                    // 主流产品 / 社区热门 / 小众探索
  verifiedOn: '2026-10-23',           // 最近一次核对官网的日期
  basis: 'official',                  // official / docs / community
  logo: { src: '/tool-logos/deepseek.svg', source: '...', license: '...' },
  tags: ['对话', '推理'],
  caution: '使用前值得知道的一句话',
}
```

写作要求：

- `summary` 一句话；`description` 2–3 句；`bestFor` 写具体任务。
- `caution` 写真实限制：隐私、版权、地区限制、额度、需要登录，不写营销话术。
- 不写「最强」「必备」「吊打」；没有实际长期使用的项目，不写「亲测」「社区推荐」。
- 价格与额度会变化：只写模式（免费可用 / 免费增值 / 需要付费），不写具体金额。
- `verifiedOn` 只在真的打开过官网/仓库并核对名称与归属后填写。

### 6.3 新增一条工具的完整流程

1. **核验**：打开官网，确认名称、归属（哪家公司/哪个团队）、当前是否可用；开源项目再看仓库的许可与最近提交。
2. **定层次**：先定 `category`，再定 `kind` 与 `tech`，最后才写文案。
3. **准备 Logo**（见 6.4），放进 `public/tool-logos/`。
4. **写条目**：在 `tools` 数组末尾追加对象，字段顺序不必固定，但不要漏 `verifiedOn` 与 `logo.source`。
5. **跑检查**：`npm run verify`。内容检查器会校验分类是否存在、枚举是否合法、id/名称是否重复、Logo 文件是否真的存在、外链协议是否安全。
6. **看页面**：`npm run dev` 打开 `/tools/`，确认筛选计数、深色主题下的 Logo、移动端布局。

### 6.4 Logo 从哪里来

按优先级取图，并在 `logo.source` 写清出处、在 `logo.license` 写清授权：

1. **官网图标本体**：品牌官网的 apple-touch-icon / PWA 图标（≥180×180 最好），其次 favicon；
2. **官方 Brand Assets / Media Kit**（如 `github.com/logos`、`elevenlabs.io/brand`）；
3. **开源项目的官方 GitHub 组织头像**；
4. **有明确授权的开源品牌图标库**：本项目个别条目用 [Simple Icons](https://simple-icons.org)（CC0 1.0）；
5. **确实拿不到官方图标时**：省略 `logo` 字段，页面回退成名称首字母。

**保留官方图标的底板**：官方图标是白底、深底或圆角方块就照原样显示，不要抠成透明，也不要自己再加白框。卡片图标区本身不带底色和描边——图标有底板就显示底板，本身透明就浮在卡片上。

**首字母只是加载失败的兜底**：有 `logo` 时首字母默认隐藏（`hidden`），只有 `onerror` 触发后才显示。不要让它垫在透明图标下面，否则会从透明区域透出来，很难看。

禁止：搜索引擎里的随机图片、带水印图、来源不明的 CDN 热链、用 AI 重画的官方 Logo。

技术细节：

- 位图转成 96×96 WebP（保留原图透明通道），矢量图保留原始 SVG，单个文件控制在 12KB 以内。
- 深色单色标志（Qwen、Cline、Udio、Elicit、Coze 等）要加 `mono: true`，深色主题会自动反色。
- 授权与出处汇总见 [`docs/TOOL-LOGOS.md`](TOOL-LOGOS.md)。

### 6.5 链接与失效处理

- `url` 只写官方入口：不写聚合站、网盘、邀请码、第三方镜像。
- 开源项目可额外填 `githubUrl`；仓库改名或迁移时（例如 CosyVoice 从 FunAudioLLM 迁到 QwenAudio），要更新为跳转后的新地址，并在 `caution` 里说明旧链接会跳转。
- **产品停运或长期不可用**：直接从数组里删除该条目，并在 PR 说明里写清依据；不要为了凑数保留失效链接。
- **只改了价格/额度**：更新 `caution` 文案与 `verifiedOn`，不动其他字段。
- **拿不准来源**：先不收录。工具目录空着比放错更安全。

### 6.6 页面上的筛选规则

- 场景分类：单选，代表「当前浏览的分支」；输入关键词时暂时让位给搜索。
- 能力筛选（开源 / 本地部署 / 入门友好 / 中文界面）：多选，取交集，搜索时依然生效。
- 搜索范围：名称、别名、技术类型、形态、分类、能力与标签。
- 三者都满足才显示，结果数量、空状态与 URL（`?category=&caps=&q=`）始终一致。
- 不按热度或「综合评分」排序：数组顺序就是展示顺序，`featured: true` 只影响首页三张卡。

### 6.7 社区建议

页面底部与页头卡片都有「建议收录工具」入口，指向仓库已有的 [工具建议 Issue 模板](https://github.com/A7m0spHere/CDU-AI/issues/new?template=tool-suggestion.yml)。入库仍由维护者审核，不提供无需审查的自动发布。

## 7. 活动数据

- 社区功能已关闭（`/community/` 仅提示暂不开放），不再维护社区版块、话题与公约数据。
- 活动只写形式与流程蓝图，不写日期、地点、嘉宾、报名方式，除非负责人已确认并同步给维护者。

## 8. 内容状态与审校

每篇指南、术语和作品详情页底部都会展示「内容状态」：初稿（尚未人工核校）/ 已人工核校 / 待更新，并显示内容依据（亲测 / 资料整理 / 教学示例）、AI 参与程度、审校人与日期、贡献者。

- 字段定义、状态推导规则、审校清单与生命周期流程见 [`docs/CONTENT-REVIEW.md`](CONTENT-REVIEW.md)。
- 默认值保守：不写 `reviewed` 就按初稿展示；不写 `basis` 就按教学示例；不写 `aiUsage` 就按 AI 辅助起草。
- 已有内容不需要一次性迁移。实质修改事实性内容后必须重新审校，不能沿用旧的审校日期。

## 9. 提交前检查

```bash
npm run verify
```

同时人工检查：

- 是否有未经确认的事实性表述？
- 是否写死了工具价格或排名？
- 是否有真实姓名、联系方式、学号、聊天记录等隐私？
- 移动端阅读是否一屏内出现过多并列信息？
- 外部链接是否可打开、是否指向官网？
- 指南的 `updated` 和 `sources` 是否准确？页面底部的编辑链接是否指向正确文件？

提交时说明改了什么、依据是什么、哪些内容还需要核实。
