import { resolveFirstAgentMedia } from '../data/first-agent-media.mjs';

const element = (tagName, properties, children = []) => ({ type: 'element', tagName, properties, children });
const text = value => ({ type: 'text', value });

function mediaFigure(id, mediaEntries) {
  const media = mediaEntries[id];
  if (!media) throw new Error(`未知的首次 Agent 素材编号 ${id}`);
  const ready = media.status === '已集成' && media.available;
  const placeholder = element('div', {
    className: ['first-agent-media__placeholder'], hidden: ready, 'data-media-placeholder': '',
  }, [
    element('span', { ariaHidden: 'true', className: ['first-agent-media__icon'] }, [text(media.kind === 'video' ? '▷' : '▧')]),
    element('span', {}, [text('素材待补充')]),
  ]);
  const content = [placeholder];
  if (ready) {
    const properties = {
      src: `/guide/first-agent/${media.file}`, width: 1600, height: 900,
      'data-media-content': '',
    };
    const node = media.kind === 'video'
      ? element('video', { ...properties, controls: true, preload: 'metadata', ariaLabel: media.description })
      : element('img', { ...properties, loading: 'lazy', alt: media.description });
    content.unshift(node);
  }
  return element('figure', {
    className: ['first-agent-media'], 'data-agent-media': id, 'data-media-state': ready ? 'ready' : 'pending',
  }, [
    element('div', { className: ['first-agent-media__stage'] }, content),
    element('figcaption', {}, [element('span', { className: ['first-agent-media__id'] }, [text(id)]), text(` ${media.description}`)]),
  ]);
}

// 从同一份已渲染的 Markdown 提取可见纯文本，链接附上实际 URL。
function promptText(node) {
  if (node.type === 'text') return node.value;
  const children = node.children ?? [];
  if (node.tagName === 'br') return '\n';
  if (node.tagName === 'ol' || node.tagName === 'ul') {
    return children.filter(child => child.tagName === 'li').map((child, index) => {
      const prefix = node.tagName === 'ol' ? `${index + 1}. ` : '- ';
      return prefix + promptText(child).trim();
    }).join('\n') + '\n\n';
  }
  const value = children.map(promptText).join('');
  if (node.tagName === 'a' && node.properties?.href) return `${value} (${node.properties.href})`;
  if (node.tagName === 'p') return value.trim() + '\n\n';
  return value;
}

function copyCard(id, title, quote, icon) {
  const target = `first-agent-prompt-${id}`;
  const heading = [];
  if (icon) heading.push(element('span', { ariaHidden: 'true', className: ['first-agent-card__icon'] }, [text(icon)]));
  heading.push(element('strong', {}, [text(title)]));
  const children = [element('p', { className: ['first-agent-card__title'] }, heading)];
  if (id === 'task') children.push(element('p', { className: ['first-agent-card__description'] }, [text('复制后，在所选 Agent 的对话输入框中发送。')]));
  children.push(
    element('div', { id: target, className: ['first-agent-prompt'], 'data-agent-prompt': id }, [text(promptText(quote).trim().replace(/\n{3,}/g, '\n\n'))]),
    element('button', {
      type: 'button', hidden: true, 'data-copy-target': `#${target}`, ariaLabel: id === 'task' ? '复制提示词' : `复制${title}提示词`,
    }, [element('span', { 'data-copy-label': '' }, [text('复制提示词')])]),
    element('p', { role: 'status', ariaLive: 'polite', className: ['first-agent-copy-status'], 'data-copy-status': '' }),
  );
  return element('section', { className: ['first-agent-card'], 'data-copy-card': id, ariaLabel: title }, children);
}

function toolPicker() {
  return element('fieldset', { className: ['first-agent-picker'], hidden: true, 'data-agent-picker': '' }, [
    element('legend', {}, [text('选择本次练习使用的工具')]),
    element('div', { className: ['first-agent-picker__options'] }, [
      ['workbuddy', 'WorkBuddy', '适合初次体验 Agent 的用户'],
      ['zcode', 'ZCode', '适合尝试开发任务的用户'],
    ].map(([value, name, description]) => element('label', {}, [
      element('input', { type: 'radio', name: 'first-agent-tool', value, checked: value === 'workbuddy' }),
      element('span', {}, [element('strong', {}, [text(name)]), element('small', {}, [text(description)])]),
    ]))),
  ]);
}

/** 仅处理本篇的明确标记。普通文章直接返回原始树。 */
export default function rehypeFirstAgent({ media = resolveFirstAgentMedia() } = {}) {
  return (tree, file) => {
    if (!String(file.path ?? '').replaceAll('\\', '/').endsWith('/guide/first-agent.md')) return;
    const output = { type: 'root', children: [] };
    const containers = [output];
    const nodes = tree.children;
    let index = 0;
    const append = node => containers.at(-1).children.push(node);
    function consume(tagName) {
      while (nodes[index + 1]?.type === 'text' && !nodes[index + 1].value.trim()) index++;
      const node = nodes[++index];
      if (node?.tagName !== tagName) throw new Error(`首次 Agent 标记后需要 ${tagName}`);
      return node;
    }
    for (; index < nodes.length; index++) {
      const node = nodes[index];
      const marker = node.type === 'raw' && node.value.trim().match(/^<!--\s*first-agent:([\w-]+)(?:\s+([\w-]+))?\s*-->$/);
      if (!marker) { append(node); continue; }
      const [, command, value] = marker;
      switch (command) {
        case 'selector':
          append(toolPicker());
          break;
        case 'choices': {
          const group = element('div', { className: ['first-agent-choices'], 'data-agent-choices': '' });
          append(group);
          containers.push(group);
          break;
        }
        case 'tool': {
          if (containers.at(-1).properties?.['data-agent-tool']) containers.pop();
          if (!['workbuddy', 'zcode'].includes(value) || !containers.at(-1).properties?.className.includes('first-agent-choices')) throw new Error('首次 Agent 工具分组无效');
          const panel = element('div', { 'data-agent-tool': value });
          append(panel);
          containers.push(panel);
          break;
        }
        case 'endchoices':
          containers.pop();
          containers.pop();
          break;
        case 'media':
          append(mediaFigure(value, media));
          break;
        case 'copy':
          append(copyCard(value, '复制你的第一个任务', consume('blockquote')));
          break;
        case 'revisions': {
          const group = element('div', { className: ['first-agent-revisions'] });
          append(group);
          containers.push(group);
          break;
        }
        case 'revision': {
          const title = promptText(consume('p')).trim();
          append(copyCard(value, title, consume('blockquote'), { visual: '◐', content: '☷', mobile: '▯' }[value]));
          break;
        }
        case 'endrevisions':
          containers.pop();
          break;
        case 'comparison':
          append(element('div', { className: ['first-agent-comparison'], 'data-agent-comparison': '', ariaLabel: '网页修改前后对比' }, [mediaFigure('M07-B', media), mediaFigure('M07-A', media)]));
          break;
        default:
          throw new Error(`未知的首次 Agent 标记 ${command}`);
      }
    }
    if (containers.length !== 1) throw new Error('首次 Agent 分组标记未闭合');
    tree.children = output.children;
  };
}
