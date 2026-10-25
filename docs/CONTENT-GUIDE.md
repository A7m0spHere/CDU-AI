# 内容维护规范

> 面向协会内容维护者。先读这里，再改 `src/content/` 或 `src/data/`。完整文件地图和新增流程见 [贡献指南](../CONTRIBUTING.md)，其他说明见 [文档导航](README.md)。

## 0. 从模板开始

各内容目录保留 `_TEMPLATE.md` 写作模板。指南与作品正文待补充，术语库已有「AI 幻觉」示范词条，新增内容仍从对应模板开始：

- `src/content/guide/_TEMPLATE.md`：学习指南模板
- `src/content/works/_TEMPLATE.md`：作品示例模板
- `src/content/glossary/_TEMPLATE.md`：术语模板

复制模板 → 去掉文件名开头的下划线并改成正式文件名 → 按注释填写 frontmatter 与正文。**以 `_` 开头的文件不会作为内容集合条目加载**，可以作为草稿模板长期保留。指南首页正文是例外：[`src/content/guide/_HOME.md`](../src/content/guide/_HOME.md) 由 `/guide/` 页面直接导入，不生成独立文章路由，也不套用普通指南的 frontmatter。

新增指南时，还需在 [`src/data/guide-nav.ts`](../src/data/guide-nav.ts) 登记相同的 slug 与目录分组；只创建 Markdown 文件而未登记会被内容检查器拒绝。

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

- `stage` 决定学习阶段归属；`order` 是指南集合内全局唯一的正整数，决定「上一篇 / 下一篇」的跨阶段阅读顺序，不在新阶段从 1 重编号；
- `guideNavGroups` 决定文章出现在侧边栏哪个栏目、栏目内第几条；指南首页显示维护者提供的 `_HOME.md` 正文，不自动生成目录总览和阶段列表；
- 只登记 `slug` 没有对应文件 = 「规划中」占位（灰色不可点，不生成路由）；
- 建了文件但没登记 = `npm run check:content` 报错（避免文章写了却不在目录里）。

新增一篇文章的完整流程：

1. 在 `guide-nav.ts` 找到目标栏目，确认已有占位条目（如 `{ label: '任务描述', slug: 'task-description' }`）；没有就加一条；
2. 用同一个 `slug` 建文件 `src/content/guide/<slug>.md`（可先复制 `_TEMPLATE.md`）；
3. 填 frontmatter（`stage` 决定阶段归属、`order` 决定全局阅读顺序）与正文；
4. 跑 `npm run verify`：侧边栏自动变成真实链接，标题取文章 `title`，目录计数同步。

调整栏目（改名、加分组、换顺序）只改 `guide-nav.ts`，不需要动组件或页面。

```yaml
---
title: "先建立使用 AI 的基本姿势"
summary: "用一句话说明这个模块能帮上什么忙。"
stage: "start" # start | make | share
order: 1 # 指南集合内全局唯一；跨阶段也不能重号，可以留空档
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

可选页面区块与约束：

| 字段 | 用途与约束 |
| --- | --- |
| `youMaySay` | 读者会问出口的一句话，最多 240 字 |
| `scenario` | 场景标题与 2–4 步可点击流程；每步必填 `label` / `body`，可选 `quote` / `meta` / `note` |
| `quiz` | 最多 3 题；每题 2–4 个选项，且恰好一个 `correct: true`；可用 `explain` 解释答案 |
| `agentPrompt` | 可复制给 Agent 的提示词，最多 600 字 |

写法示例放在 [`术语模板`](../src/content/glossary/_TEMPLATE.md)，不写可选区块时页面不渲染。分类与选题批次见 [术语库规划](GLOSSARY-PLAN.md)。

两类词条的正文结构不同：

| 分支 | 分类 id | 正文要求 |
| --- | --- | --- |
| AI 主分支 | `basics` / `prompt` / `tools` / `agents` / `safety` / `cost` | 使用下列六段结构，最后一段可选 |
| 延伸分支 | `vibecoding` / `frontend` / `backend` / `product` / `testing` / `git` | 300–500 字；是什么 / 什么时候会遇到 / 和 AI 的关系 /（可选）想深入再看；只解释术语，不教操作步骤或 Git 命令 |

AI 主分支分节：

- `一句话说清`：它是什么，为什么重要；
- `打个比方`：一个生活化的类比；
- `它是怎么运作的`：分步骤说明，不堆术语；
- `你会碰到它的场景`：校园或学习中的具体动作；
- `常见误解`：两三条「以为……其实……」；
- `想再深入一点`（可选）：一两句技术补充。

写作要求：面向非计算机专业同学，不假设读者知道 API、模型、上下文等前置概念；必须出现的术语要当场解释清楚，或链接到本表另一条。

新词条至少提供 1 条支持正文事实的官方文档或原始论文；`definition` 不超过 60 字。`order` 在同一分类内唯一，`related` 只能引用已存在的词条。词条正文由人规划、起草和确定判断，AI 可协助查证、润色、排版与工程校验；人工核校签字仍按 [审校规范](CONTENT-REVIEW.md) 执行。

来源标注要与实际情况一致，分两层写：

- 词条定义、别名与一句话释义由本站独立撰写，事实与数字以 `sources` 中列出的官方文档为准；
- 详情页正文（类比、步骤、场景、常见误解）同样由本站独立撰写。**页面状态由 frontmatter 推导**：`needsUpdate: true` 优先显示待更新；没有审校日期时显示「初稿 · 尚未人工核校」，真人逐条核校后填写 `reviewed` / `reviewedBy` 才会显示「已人工核校」。不要为了消掉提示而提前填日期。

校准一条术语的标准：能指出它「不成立」的边界（例如微调不能可靠记住新事实），并且没有写死会变化的价格、额度、版本号。

### 外链协议规则（安全）

- `sources` 与工具 `url` **只允许 `http:` / `https:` 绝对地址**；`javascript:`、`data:`、`file:`、`vbscript:` 以及协议相对的 `//example.com` 一律被拒绝，报错会指出文件与字段。
- 正文 Markdown 里的链接同一规则：危险协议在渲染阶段直接去掉 `href`（文字保留），外链自动加 `target="_blank"` 与 `rel="noopener noreferrer"`。
- 站内链接写 `/guide/`、`#anchor` 这类相对路径即可，不要写完整域名。

改动后运行 `npm run verify`（包含 `npm run check:content` 文件级检查与完整构建测试），检查术语条目、筛选、详情页和搜索索引是否正常生成。

## 6. 工具数据

工具目录只由维护者审核后入库（不开放自动发布、不迁移 Markdown），条目数据在 [`src/data/tools.ts`](../src/data/tools.ts)，字段由 [`src/data/types.ts`](../src/data/types.ts) 的 `Tool` 约束。页内分区和折叠规则集中在 [`src/data/tool-sections.mjs`](../src/data/tool-sections.mjs)，视图生成与分区校验复用 [`src/lib/tool-catalog.mjs`](../src/lib/tool-catalog.mjs)。新增工具时同步所属栏目的分区规则，页面、筛选计数、首页推荐和搜索索引从数据推导。

2026-10-24 的 Agent 补充、社区项目维护状态与仓库迁移依据见 [AGENT-CATALOG-REVIEW.md](AGENT-CATALOG-REVIEW.md)。

书签增补、工具页缺项补充的取舍、重复入口与新旧域名核对见 [工具目录增补记录](TOOL-CATALOG-REVIEW.md)。新增条目优先成熟生态与明确使用场景，同类只保留少量代表。

**对话工具分组**：「语言模型与对话」按 `toolSections['llm-chat']` 的顺序展示国内工具、海外工具、开源项目。条目的 `catalogGroup` 分别填写 `domestic`、`overseas`、`open-source`；不能仅因关联模型有开放权重就给在线产品添加开源能力标签。开源客户端与项目不分地区，没有匹配结果的分组自动隐藏。

**Agent 分组与默认展示**：「Agent 与 Harness」按 `toolSections.agent` 展示国内工具、海外工具、非官方社区项目，通过 `catalogGroup` 明确归属，不按 `tier` 或是否开源推断。DSH、Qwen Code 放在国内工具，Hermes Agent 放在海外工具。社区区的 `collapse.featuredIds` 列出默认直接显示的 OpenCode、Pi、OpenClaw，其余社区条目默认折叠。折叠数量按当前匹配条目计算；切换栏目保持收起，搜索或能力筛选时展开匹配项，手动展开会同步更新已折叠数量。

**AIGC 分组与收录边界**：`aigc` 一级分类按 `toolSections.aigc` 展示图片创作、视频创作、创作工作流、资源社区；`aigcSection` 分别填写 `image`、`video`、`workflow`、`resources`。按主要用途归类，兼有能力写入介绍和标签；即梦归入视频创作，Midjourney、Canva 归入图片与设计用途。ComfyUI、RunningHub 和 Civitai 保留，API 平台与算力服务使用独立入口。

**全目录与关联栏目**：「全部工具」按主分类分区，每个条目只出现一次。进入具体栏目时同时显示 `alsoIn` 关联条目，但使用当前栏目的分区规则和标签。例如 Dify、Coze 在工作流栏目属于可视化编排；Canva 在 AIGC 属于图片创作，在办公栏目属于办公工具。规则必须覆盖每个成员且不能重复匹配，失效工具引用也会被检查器拦截。

**其他栏目**：语音合成、录音转写、音乐生成统一到 `audio`；工作流按可视化编排、Harness 与编程框架、浏览器自动化、创作工作流、知识库与文档处理划分。搜索科研、本地运行、API、算力和资源社区也分别维护自身的用途分区。旧 `image`、`video` 链接兼容进入 AIGC，旧 `tts`、`stt`、`music` 链接进入语音与音频。

当前暂不收录独立模型条目，包括图像、视频与语音模型。具有同名网页产品的资源只保留产品入口，例如万相保留网页视频创作介绍，去掉模型下载仓库与本地部署标签；对话助手、开源客户端、运行器与工具包不因底层使用模型而移除。

### 6.1 分类与技术类型不是一回事

分类回答「我想做什么」，技术类型回答「它靠什么实现」。两者必须分开写，否则页面会变成一锅粥：

| 层次 | 例子 | 写在哪里 |
| --- | --- | --- |
| 场景分类 | 语言模型与对话 / AIGC / API 与开发平台 | `category`（`toolCategories` 里的 id） |
| AIGC 页内分区 | 图片创作 / 视频创作 / 创作工作流 / 资源社区 | `aigcSection` |
| 资源形态 | 在线产品 / 开源项目 / 工作流工具 / 开发工具 / 资源社区 / 开发平台 | `kind` |
| 技术类型 | LLM 对话应用 / 扩散模型 / Agent Harness / TTS / STT | `tech` |

常见错误：把 ChatGPT 写成「LLM」（它是产品，LLM 是模型类别）；把 Claude Code 写成「开源项目」（产品闭源，仓库只放文档）；把 ComfyUI 写成「扩散模型」（它是跑模型的工作流工具）。**收录前先确认它属于哪一层。**

Hugging Face、魔搭社区、Kaggle 和飞桨 AI Studio 等入口归入「模型与数据社区」，使用 `kind: '资源社区'`。托管开源资源不等于整个平台开源或可本地部署，不因此添加 `open-source` / `local` 能力标签；具体模型、数据集的许可与算力限制分别核对。

模型 API 与开发工作台归入 `api`，使用 `kind: '开发平台'`；云端 GPU 实例归入 `compute`。同一厂商的聊天产品和 API 后台按不同任务分别记录，同一个平台的登录页、文档页与控制台不重复建条目。租用云端算力不标为 `local`；Google AI Studio 与飞桨 AI Studio 保留完整厂商名称，避免同名混淆。

文档与表格、演示文稿、设计排版和笔记整理归入 `office`；辅助阅读资料的双语翻译、OCR 和结构化文档解析归入 `research`，不再单设文档分类，旧 `document` 链接兼容进入搜索科研。同一工具兼有录音、科研或图像用途时用 `alsoIn` 补充入口，不复制条目。Google Colab 按云端实验环境归入 `compute`，不标为本地部署。

能力标签按当前工具本身的实现和许可核对。Qwen Chat 不借用关联模型的开放权重状态；n8n、Dify、MinerU 等源码可获取但许可含附加条件的项目省略 `open-source` 标签，在 `caution` 说明边界。可自托管和采用标准开源许可证是两件事；本地客户端连接云端模型时仍可能发送请求与材料。

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
  // difficulty: '稍加摸索',   // 可选：稍加摸索 / 需要动手；无额外上手要求时省略
  // pricing: '需要付费',      // 可选，仅在核实付费要求后填写；此示例未设置
  url: 'https://chat.deepseek.com/',
  githubUrl: 'https://github.com/...', // 可选：开源项目或官方仓库
  tech: 'LLM 对话应用',
  kind: '在线产品',
  capabilities: ['beginner', 'zh'],    // open-source / local / beginner / zh
  tier: '主流产品',                    // 主流产品 / 社区热门 / 小众探索
  verifiedOn: '2026-10-23',           // 最近一次核对官网的日期
  basis: 'official',                  // official / docs / community
  logo: { src: '/tool-logos/deepseek.webp', source: '...', license: '...' },
  tags: ['对话', '推理'],
  caution: '使用前值得知道的一句话',
}
```

写作要求：

- `summary` 一句话；`description` 2–3 句；`bestFor` 写具体任务。
- `caution` 写真实限制：隐私、版权、地区限制、额度、需要登录，不写营销话术。
- 不写「最强」「必备」「吊打」；没有实际长期使用的项目，不写「亲测」「社区推荐」。
- 价格与额度会变化：仅保留已核实的付费要求，不标注零成本承诺或具体金额；未确认时省略 `pricing`，使用条件与限制写入 `caution`。
- `verifiedOn` 只在真的打开过官网/仓库并核对名称与归属后填写。

### 6.3 新增一条工具的完整流程

1. **核验**：打开官网，确认名称、归属（哪家公司/哪个团队）、当前是否可用；开源项目再看仓库的许可与最近提交。
2. **定层次**：先定 `category`，再定 `kind` 与 `tech`，最后才写文案。
3. **准备 Logo**（见 6.4），放进 `public/tool-logos/`。
4. **写条目**：在 `tools` 数组末尾追加对象，字段顺序不必固定，但不要漏 `verifiedOn` 与 `logo.source`。
5. **跑检查**：`npm run verify`。类型检查和构建后的测试共同校验分类、枚举、id/名称、Logo 文件及外链协议，不能只凭 `npm run check:content` 判断工具条目已完整通过验证。
6. **看页面**：`npm run dev` 打开 `/tools/`，确认筛选计数、深色主题下的 Logo、移动端布局。

### 6.4 Logo 从哪里来

按优先级取图，并在 `logo.source` 写清出处、在 `logo.license` 写清授权：

1. **官网图标本体**：品牌官网的 apple-touch-icon / PWA 图标（≥180×180 最好），其次 favicon；
2. **官方 Brand Assets / Media Kit**（如 `github.com/logos`、`elevenlabs.io/brand`）；
3. **开源项目的官方 GitHub 组织头像**；
4. **有明确授权的开源品牌图标库**：本项目个别条目用 [Simple Icons](https://simple-icons.org)（CC0 1.0）；
5. **没有适合小尺寸展示的官方图标时**：省略 `logo` 字段，页面回退成名称首字母；不要使用 GitHub 自动生成头像代替产品标志。

**保留官方图标的底板**：官方图标是白底、深底或圆角方块就照原样显示，不要抠成透明，也不要自己再加白框。卡片图标区本身不带底色和描边——图标有底板就显示底板，本身透明就浮在卡片上。

**首字母只作加载失败兜底**：有 `logo` 时字母默认隐藏（`hidden`），图片加载失败后移除图片并显示首字母；没有配置图标时直接使用首字母。不要让字母垫在正常图标下面，从透明区域透出来。

禁止：搜索引擎里的随机图片、带水印图、来源不明的 CDN 热链、用 AI 重画的官方 Logo。

技术细节：

- 位图转成 96×96 WebP（保留原图透明通道），矢量图保留原始 SVG，单个文件控制在 12KB 以内。
- 只有黑白灰的近黑标志（如 Cline）才加 `mono: true`，深色主题会自动反色；Qwen、Udio、Elicit、Coze 等彩色图标必须保留品牌原色，不设置此字段。
- 授权与出处汇总见 [`docs/TOOL-LOGOS.md`](TOOL-LOGOS.md)。

### 6.5 链接与失效处理

- `url` 优先填写独立官网或官方项目介绍页，供工具名称和「打开官网」使用；只有没有可用官网时才回退到官方仓库。不写聚合站、网盘、邀请码、第三方镜像。
- 有官方 GitHub 仓库的项目单独填写 `githubUrl`，供 GitHub 图标旁的「代码仓库」入口使用；不要因为项目开源，就让「打开官网」也跳到仓库。
- `url` 回退到 GitHub 时，卡片只显示带 GitHub 图标的「代码仓库」，不把仓库标为官网，也不重复展示两个相同的入口。
- 回退到仓库时同时填写相同的 `url` 和 `githubUrl`。GitHub Copilot 等产品的官网也在 `github.com` 下，不能只凭域名把产品页认成仓库。
- 仓库改名或迁移时（例如 OpenCode 从 sst 迁到 anomalyco、CosyVoice 从 FunAudioLLM 迁到 QwenAudio），更新 `githubUrl` 为当前地址；有独立官网时保留官网入口。
- **产品停运或长期不可用**：直接从数组里删除该条目，并在 PR 说明里写清依据；不要为了凑数保留失效链接。
- **只改了价格/额度**：更新 `caution` 文案与 `verifiedOn`，不动其他字段。
- **拿不准来源**：先不收录。工具目录空着比放错更安全。

### 6.6 页面上的筛选规则

- 场景分类：单选，工具页搜索限定在当前栏目，点击「全部工具」扩大搜索范围并保留关键词；术语页仍采用原有的全局搜索规则。
- 能力筛选（开源 / 本地部署 / 入门友好 / 中文界面）：多选，取交集，搜索时依然生效。
- 搜索范围：名称、别名、技术类型、形态、分类、能力与标签。
- Agent 与 Harness 的更多社区条目默认收在折叠区；进入或切换场景分类时保持收起，可手动展开。输入关键词或启用能力筛选时自动展开匹配条目，清除关键词与能力筛选后恢复收起。
- 三者都满足才显示，结果数量、空状态与 URL（`?category=&caps=&q=`）始终一致；计数使用「匹配 N 项」，另标出当前已折叠数量。
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
