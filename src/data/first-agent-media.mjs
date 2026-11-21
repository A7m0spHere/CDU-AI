import { existsSync } from 'node:fs';

// 素材统一存放在 public/guide/first-agent/。已集成且文件存在时才渲染媒体。
export const firstAgentMedia = {
  M01: {
    file: 'm01-workbuddy-workbench.webp', status: '已集成',
    description: 'WorkBuddy 工作台，左侧有「新建任务」入口。',
  },
  M02: {
    file: 'm02-zcode-workspace.webp', status: '已集成',
    description: 'ZCode 首页，输入框上方可选择项目，右下角可切换模型。',
  },
  'M03-W': {
    file: 'm03-w-workbuddy-directory.webp', status: '已集成',
    description: 'WorkBuddy 选择 CDU-介绍网站 文件夹作为工作目录。',
  },
  'M03-Z': {
    file: 'm03-z-zcode-project.webp', status: '已集成',
    description: 'ZCode 打开 CDU-介绍网站 文件夹作为项目工作区。',
  },
  'M04-W': {
    file: 'm04-w-workbuddy-development.webp', status: '已集成',
    description: 'WorkBuddy 收到网页任务后，开始查找成都大学官网资料。',
  },
  'M04-Z': {
    file: 'm04-z-zcode-development.webp', status: '已集成',
    description: 'ZCode 收到网页任务后，界面显示「正在思考」和「工作中」。',
  },
  M05: {
    file: 'm05-cdu-html-file.webp', status: '待截图',
    description: '文件资源管理器中显示 CDU-介绍网站 文件夹内的 CDU.html。',
  },
  M06: {
    file: 'm06-cdu-browser.webp', status: '待截图',
    description: '浏览器打开 CDU.html，展示实际生成的成都大学介绍网页。',
  },
  'M07-B': {
    file: 'm07-before.webp', status: '待截图',
    description: '第一次生成的网页。',
  },
  'M07-A': {
    file: 'm07-after.webp', status: '待截图',
    description: '修改后的网页，使用与修改前相同的视口和页面位置。',
  },
};

// 将配置与文件存在状态一起交给 Astro，素材变化时使 Markdown 渲染缓存失效。
export function resolveFirstAgentMedia(media = firstAgentMedia) {
  const directory = new URL('../../public/guide/first-agent/', import.meta.url);
  return Object.fromEntries(Object.entries(media).map(([id, item]) => [id, {
    ...item,
    available: existsSync(new URL(item.file, directory)),
  }]));
}
