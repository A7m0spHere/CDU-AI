/** 每个栏目的页内规则。关联条目在所进入的栏目中重新归组，不借用主分类的版式。
 * @type {Record<string, {id: string, name: string, description?: string, field?: 'catalogGroup' | 'aigcSection', value?: string, toolIds?: string[], collapse?: {label: string, featuredIds: string[]}}[]>}
 */
export const toolSections = {
  'llm-chat': [
    { id: 'domestic', name: '国内工具', description: '国内团队提供的在线对话产品。', field: 'catalogGroup', value: 'domestic' },
    { id: 'overseas', name: '海外工具', description: '海外团队提供的在线对话产品。', field: 'catalogGroup', value: 'overseas' },
    { id: 'open-source', name: '开源项目', description: '可自行配置模型服务的开源客户端与项目。', field: 'catalogGroup', value: 'open-source' },
  ],
  agent: [
    { id: 'domestic', name: '国内工具', description: '国内厂商推出的 Agent 与 Harness，包含厂商官方开源工具。', field: 'catalogGroup', value: 'domestic' },
    { id: 'overseas', name: '海外工具', description: '海外厂商推出的 Agent 产品与开发工具。', field: 'catalogGroup', value: 'overseas' },
    { id: 'open-source', name: '开源工具', description: '社区维护的开源 Agent、Harness、客户端与知识库工具；厂商官方产品按国内、海外归组。', field: 'catalogGroup', value: 'open-source', collapse: { label: '更多开源 Agent 与 Harness', featuredIds: ['opencode', 'pi', 'openclaw', 'cherry-studio', 'ragflow'] } },
  ],
  aigc: [
    { id: 'image', name: '图片创作', description: '主要用于图片生成、编辑与视觉设计，兼有能力见工具介绍。', field: 'aigcSection', value: 'image' },
    { id: 'video', name: '视频创作', description: '主要用于视频生成、镜头创作与编辑，兼有能力见工具介绍。', field: 'aigcSection', value: 'video' },
    { id: 'design', name: '设计与排版', description: '制作视觉设计、海报和演示文稿，并继续编辑版式与素材。', field: 'aigcSection', value: 'design' },
    { id: 'presentation', name: '演示文稿', description: '从主题、提纲或已有材料生成幻灯片，再补充事实与调整版式。', field: 'aigcSection', value: 'presentation' },
    { id: 'document', name: '文档与表格', description: '围绕已有材料起草文字、处理表格，生成可继续编辑的文档。', field: 'aigcSection', value: 'document' },
    { id: 'workflow', name: '创作工作流', description: '组合生成与处理步骤，搭建图片、视频创作流程。', field: 'aigcSection', value: 'workflow' },
  ],
  audio: [
    { id: 'tts', name: '语音合成', description: '把文稿转成配音，或制作合适的音色。', toolIds: ['elevenlabs'] },
    { id: 'stt', name: '录音转写', description: '把音视频转成文字，整理录音与会议材料。', toolIds: ['funasr', 'tingwu'] },
    { id: 'music', name: '音乐生成', description: '创作歌曲、配乐和音频素材。', toolIds: ['suno', 'udio'] },
  ],
  research: [
    { id: 'web', name: '网页搜索', description: '围绕问题检索网页，并核对回答的来源。', toolIds: ['perplexity', 'metaso'] },
    { id: 'reading', name: '资料阅读与知识库', description: '阅读已有材料，或建立可查询的资料库。', toolIds: ['notebooklm', 'notion-ai'] },
    { id: 'papers', name: '论文检索与文献管理', description: '查找论文证据，管理文献、阅读笔记与写作引用。', toolIds: ['elicit', 'consensus', 'zotero', 'obsidian'] },
    { id: 'related', name: '翻译与阅读辅助', description: '辅助阅读网页、PDF 和外语资料。', toolIds: ['immersive-translate'] },
  ],
  ocr: [
    { id: 'parsing', name: '文档解析与 OCR', toolIds: ['mineru'] },
  ],
  local: [
    { id: 'clients', name: '本地客户端', description: '在自己的电脑上管理模型、连接服务与进行对话。', toolIds: ['ollama', 'lmstudio'] },
    { id: 'engines', name: '推理引擎', description: '运行兼容模型，为其他程序提供推理服务。', toolIds: ['vllm', 'llama-cpp'] },
  ],
  community: [
    { id: 'models-data', name: '模型与数据', description: '查找模型、数据集和示范应用。', toolIds: ['hugging-face', 'modelscope'] },
    { id: 'creative', name: '创作资源', description: '查找图像创作资源与使用示例。', toolIds: ['civitai'] },
    { id: 'learning', name: '课程、竞赛与实验', description: '查找课程、实践项目与在线实验环境。', toolIds: ['kaggle', 'ai-studio'] },
  ],
  api: [
    { id: 'domestic-vendors', name: '国内模型与云平台', description: '国内模型厂商的官方 API 入口优先展示，随后为云开发平台。', toolIds: ['deepseek-api', 'qwen-api', 'kimi-api', 'zhipu-api', 'minimax-api', 'xiaomi-mimo', 'stepfun-api', 'volcengine-ark', 'tencent-tokenhub', 'baidu-qianfan', 'spark-api'] },
    { id: 'overseas-vendors', name: '海外模型与云平台', description: '海外厂商的官方模型 API 与开发工作台，接入条件按各平台说明核对。', toolIds: ['openai-api', 'claude-api', 'google-ai-studio', 'grok-api', 'mistral-studio', 'cohere-api'] },
    { id: 'domestic-aggregators', name: '国内聚合与推理平台', description: '通过国内平台的统一入口接入不同提供方的模型服务。', toolIds: ['aliyun-bailian', 'siliconflow'] },
    { id: 'overseas-aggregators', name: '海外聚合与推理平台', description: '通过海外平台的统一入口接入、路由与切换模型服务。', toolIds: ['openrouter'] },
    { id: 'applications', name: '应用搭建与自动化', description: '面向应用开发与流程编排，用节点、模型服务和接口搭建工具。', toolIds: ['dify', 'coze', 'n8n'] },
    { id: 'specialized', name: '专用接口', description: '当前收录海外服务，为程序接入网页搜索或多模态素材生成；条目标签注明地区。', toolIds: ['tavily', 'fal'] },
  ],
  compute: [
    { id: 'gpu', name: 'GPU 租用', description: '为训练与推理配置云端 GPU 实例。', toolIds: ['autodl'] },
    { id: 'notebooks', name: '在线 Notebook 与实验环境', description: '在浏览器中运行代码、课程实验与数据分析。', toolIds: ['google-colab'] },
  ],
};

/** 旧栏目链接保留兼容入口。 */
export const toolCategoryAliases = { office: 'all', workflow: 'all', image: 'aigc', video: 'aigc', tts: 'audio', stt: 'audio', music: 'audio', document: 'research' };
