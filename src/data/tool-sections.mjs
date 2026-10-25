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
    { id: 'domestic', name: '国内工具', description: '国内团队推出的 Agent 与 Harness，包含官方开源工具。', field: 'catalogGroup', value: 'domestic' },
    { id: 'overseas', name: '海外工具', description: '海外团队推出的 Agent 产品与开发工具。', field: 'catalogGroup', value: 'overseas' },
    { id: 'community', name: '社区项目', description: '独立开发者与第三方社区维护的 Agent 和 Harness。', field: 'catalogGroup', value: 'community', collapse: { label: '更多社区 Agent 与 Harness', featuredIds: ['opencode', 'pi', 'openclaw'] } },
  ],
  aigc: [
    { id: 'image', name: '图片创作', description: '主要用于图片生成、编辑与视觉设计，兼有能力见工具介绍。', field: 'aigcSection', value: 'image' },
    { id: 'video', name: '视频创作', description: '主要用于视频生成、镜头创作与编辑，兼有能力见工具介绍。', field: 'aigcSection', value: 'video' },
    { id: 'workflow', name: '创作工作流', description: '组合生成与处理步骤，搭建图片、视频创作流程。', field: 'aigcSection', value: 'workflow' },
    { id: 'resources', name: '资源社区', description: '查找创作素材、工作流与资源示例。', field: 'aigcSection', value: 'resources' },
  ],
  audio: [
    { id: 'tts', name: '语音合成', description: '把文稿转成配音，或制作合适的音色。', toolIds: ['elevenlabs'] },
    { id: 'stt', name: '录音转写', description: '把音视频转成文字，整理录音与会议材料。', toolIds: ['funasr', 'tingwu'] },
    { id: 'music', name: '音乐生成', description: '创作歌曲、配乐和音频素材。', toolIds: ['suno', 'udio'] },
  ],
  research: [
    { id: 'web', name: '网页搜索', description: '围绕问题检索网页，并核对回答的来源。', toolIds: ['perplexity', 'metaso'] },
    { id: 'reading', name: '资料阅读与知识库', description: '阅读已有材料，或建立可查询的资料库。', toolIds: ['notebooklm', 'ragflow'] },
    { id: 'papers', name: '论文检索', description: '查找论文证据，整理文献与研究结论。', toolIds: ['elicit', 'consensus'] },
    { id: 'related', name: '相关文档与接口', description: '为检索准备文档，或在程序中接入搜索。', toolIds: ['immersive-translate', 'mineru', 'tavily'] },
  ],
  workflow: [
    { id: 'visual', name: '可视化编排', description: '用节点、配置与知识库搭建应用和自动化流程。', toolIds: ['dify', 'coze', 'n8n', 'aliyun-bailian'] },
    { id: 'frameworks', name: 'Harness 与编程框架', description: '通过代码组织 Agent 流程，或扩展其运行环境。', toolIds: ['openhands', 'pi', 'langgraph', 'crewai'] },
    { id: 'browser', name: '浏览器自动化', description: '把网页读取和操作接入 Agent 任务。', toolIds: ['browser-use'] },
    { id: 'creative', name: '创作工作流', description: '组织图片与视频的生成、处理和云端运行流程。', toolIds: ['comfyui', 'runninghub'] },
    { id: 'knowledge', name: '知识库与文档处理', description: '准备结构化材料，搭建检索与问答流程。', toolIds: ['ragflow', 'mineru'] },
  ],
  local: [
    { id: 'clients', name: '本地客户端', description: '在自己的电脑上管理模型、连接服务与进行对话。', toolIds: ['ollama', 'lmstudio', 'cherry-studio'] },
    { id: 'engines', name: '推理引擎', description: '运行兼容模型，为其他程序提供推理服务。', toolIds: ['vllm', 'llama-cpp'] },
    { id: 'knowledge', name: '知识库应用', description: '在自己的环境中组织资料检索与问答。', toolIds: ['ragflow'] },
  ],
  community: [
    { id: 'models-data', name: '模型与数据', description: '查找模型、数据集和示范应用。', toolIds: ['hugging-face', 'modelscope'] },
    { id: 'creative', name: '创作资源', description: '查找图像创作资源与使用示例。', toolIds: ['civitai'] },
    { id: 'learning', name: '课程、竞赛与实验', description: '查找课程、实践项目与在线实验环境。', toolIds: ['kaggle', 'ai-studio', 'google-colab'] },
  ],
  api: [
    { id: 'vendors', name: '厂商平台', description: '在模型厂商的平台试验能力并接入接口。', toolIds: ['google-ai-studio', 'aliyun-bailian', 'deepseek-api', 'zhipu-api', 'kimi-api', 'minimax-api', 'volcengine-ark'] },
    { id: 'aggregators', name: '聚合平台', description: '通过统一入口接入和切换不同提供方的服务。', toolIds: ['siliconflow', 'openrouter'] },
    { id: 'specialized', name: '专用接口', description: '为程序接入网页搜索或多模态素材生成。', toolIds: ['tavily', 'fal'] },
  ],
  compute: [
    { id: 'gpu', name: 'GPU 租用', description: '为训练与推理配置云端 GPU 实例。', toolIds: ['autodl'] },
    { id: 'notebooks', name: '在线 Notebook 与实验环境', description: '在浏览器中运行代码、课程实验与数据分析。', toolIds: ['google-colab'] },
  ],
  office: [
    { id: 'tools', name: '办公与演示工具', toolIds: ['gamma', 'canva', 'tingwu'] },
  ],
  document: [
    { id: 'tools', name: '翻译与文档工具', toolIds: ['immersive-translate', 'mineru'] },
  ],
};

/** 旧栏目链接保留兼容入口。 */
export const toolCategoryAliases = { image: 'aigc', video: 'aigc', tts: 'audio', stt: 'audio', music: 'audio' };
