import { closeSync, existsSync, openSync, readSync } from 'node:fs';

// 素材统一存放在 public/guide/first-agent/。已集成且文件存在时才渲染媒体。
export const firstAgentMedia = {
  M01: {
    file: 'm01-workbuddy-workbench.webp', status: '已集成',
    label: 'WorkBuddy 工作台',
    description: '左侧栏顶部是「新建任务」入口，中央输入框下方可选择分组/目录，右下角可切换模型。',
  },
  M02: {
    file: 'm02-zcode-workspace.webp', status: '已集成',
    label: 'ZCode 工作台',
    description: '输入框上方可选择项目工作区，左下角可查看或切换权限模式，右下角可选择模型。',
  },
  'M03-W': {
    file: 'm03-w-workbuddy-directory.webp', status: '已集成',
    label: '选择工作目录',
    description: '点击输入框左下角的分组入口，通过「选择本地文件夹」选中「CDU-介绍网站」作为本次任务的工作目录。',
  },
  'M03-Z': {
    file: 'm03-z-zcode-project.webp', status: '已集成',
    label: '打开项目工作区',
    description: '点击输入框上方的项目下拉菜单，选择「CDU-介绍网站」作为当前项目工作区。',
  },
  'M04-W': {
    file: 'm04-w-workbuddy-development.webp', status: '已集成',
    label: '任务执行中',
    description: '收到要求后，WorkBuddy 会按步骤推进，先访问成都大学官网核实学校信息，再编写网页文件。',
  },
  'M04-Z': {
    file: 'm04-z-zcode-development.webp', status: '已集成',
    label: '任务执行中',
    description: '收到要求后，ZCode 会实时显示「正在思考」和「工作中」状态（截于旧版界面，左下角显示为「自主模式」；首次练习请按正文保持默认「变更前确认」）。',
  },
  M05: {
    file: 'm05-cdu-html-file.webp', status: '已集成',
    label: '查看生成文件',
    description: '在「CDU-介绍网站」文件夹中可以看到生成的 CDU.html，双击即可用系统默认浏览器打开。',
  },
  M06: {
    file: 'm06-cdu-browser.webp', status: '已集成',
    label: '浏览器预览效果',
    description: '浏览器直接打开本地 CDU.html 的实际效果，包含顶部导航、学校简介与数据概览等板块。',
  },
  'M07-B': {
    file: 'm06-cdu-browser.webp', status: '已集成',
    label: '修改前',
    description: '初次生成的版本，顶部为亮橙色渐变导航栏，整体偏暖色调。',
  },
  'M07-A': {
    file: 'm07-after.webp', status: '已集成',
    label: '修改后',
    description: '使用「调整视觉风格」提示词优化后的同位置效果，导航栏改为深灰质感，主视觉配色与层次更简洁现代，原有内容保持不变。',
  },
};

/** 从 WebP/PNG 文件头读取图片像素宽高（仅读前 32 字节），不可解析时返回 null。 */
export function readImageDimensions(fileUrl) {
  let fd;
  try {
    fd = openSync(fileUrl, 'r');
    const header = Buffer.allocUnsafe(32);
    const bytesRead = readSync(fd, header, 0, header.length, 0);
    const buf = header.subarray(0, bytesRead);

    if (buf.length >= 16 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
      const chunk = buf.toString('ascii', 12, 16);
      let width = 0;
      let height = 0;
      if (chunk === 'VP8 ' && buf.length >= 30 && buf[23] === 0x9d && buf[24] === 0x01 && buf[25] === 0x2a) {
        width = buf.readUInt16LE(26) & 0x3fff;
        height = buf.readUInt16LE(28) & 0x3fff;
      } else if (chunk === 'VP8L' && buf.length >= 25 && buf[20] === 0x2f) {
        const bits = buf.readUInt32LE(21);
        width = (bits & 0x3fff) + 1;
        height = ((bits >> 14) & 0x3fff) + 1;
      } else if (chunk === 'VP8X' && buf.length >= 30) {
        width = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
        height = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
      }
      return width > 0 && height > 0 ? { width, height } : null;
    }

    if (
      buf.length >= 24 &&
      buf.readUInt32BE(0) === 0x89504e47 &&
      buf.readUInt32BE(4) === 0x0d0a1a0a &&
      buf.toString('ascii', 12, 16) === 'IHDR'
    ) {
      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);
      return width > 0 && height > 0 ? { width, height } : null;
    }

    return null;
  } catch {
    return null;
  } finally {
    if (fd !== undefined) {
      try {
        closeSync(fd);
      } catch {
        // 忽略关闭异常
      }
    }
  }
}

// 将配置与文件存在状态及真实尺寸一起交给 Astro，素材变化时使 Markdown 渲染缓存失效。
export function resolveFirstAgentMedia(media = firstAgentMedia) {
  const directory = new URL('../../public/guide/first-agent/', import.meta.url);
  return Object.fromEntries(Object.entries(media).map(([id, item]) => {
    const fileUrl = new URL(item.file, directory);
    const available = existsSync(fileUrl);
    const dimensions = available ? readImageDimensions(fileUrl) : null;
    return [id, {
      ...item,
      available,
      ...(dimensions ?? {}),
    }];
  }));
}
