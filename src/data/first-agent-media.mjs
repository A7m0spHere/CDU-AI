import { existsSync } from 'node:fs';

// 素材统一存放在 public/guide/first-agent/。已集成且文件存在时才渲染媒体。
export const firstAgentMedia = {
  M01: {
    kind: 'image', file: 'm01-workbuddy-workbench.webp', status: '待录制',
    description: 'WorkBuddy 首次进入工作台，标注「新建任务」。',
  },
  M02: {
    kind: 'image', file: 'm02-zcode-workspace.webp', status: '待录制',
    description: 'ZCode 首次启动与工作区界面，标注工作区选择和模型入口。',
  },
  'M03-W': {
    kind: 'image', file: 'm03-w-workbuddy-directory.webp', status: '待录制',
    description: 'WorkBuddy 选择 CDU-介绍网站 文件夹作为工作目录。',
  },
  'M03-Z': {
    kind: 'image', file: 'm03-z-zcode-project.webp', status: '待录制',
    description: 'ZCode 打开 CDU-介绍网站 文件夹作为项目工作区。',
  },
  M04: {
    kind: 'image', file: 'm04-agent-development.webp', status: '待录制',
    description: 'Agent 执行网页开发任务，突出文件创建和编辑过程。',
  },
  M05: {
    kind: 'image', file: 'm05-cdu-html-file.webp', status: '待录制',
    description: '文件资源管理器中显示 CDU-介绍网站 文件夹内的 CDU.html。',
  },
  M06: {
    kind: 'image', file: 'm06-cdu-browser.webp', status: '待录制',
    description: '浏览器打开 CDU.html，展示实际生成的成都大学介绍网页。',
  },
  'M07-B': {
    kind: 'image', file: 'm07-before.webp', status: '待录制',
    description: '第一次生成的网页。',
  },
  'M07-A': {
    kind: 'image', file: 'm07-after.webp', status: '待录制',
    description: '修改后的网页，使用与修改前相同的视口和页面位置。',
  },
  V01: {
    kind: 'video', file: 'v01-first-agent-flow.mp4', status: '待录制',
    description: '完整任务流程录屏（可选），从发送任务到检查和修改网页。',
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
