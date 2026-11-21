import { closeSync, existsSync, openSync, readSync } from 'node:fs';

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
    file: 'm05-cdu-html-file.webp', status: '已集成',
    description: '文件资源管理器中显示 CDU-介绍网站 文件夹内的 CDU.html。',
  },
  M06: {
    file: 'm06-cdu-browser.webp', status: '已集成',
    description: '浏览器打开 CDU.html，展示实际生成的成都大学介绍网页。',
  },
  'M07-B': {
    file: 'm06-cdu-browser.webp', status: '已集成',
    description: '第一次生成的网页。',
  },
  'M07-A': {
    file: 'm07-after.webp', status: '已集成',
    description: '使用「调整视觉风格」提示词修改后的网页，保持与修改前相同的视口和页面位置。',
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
