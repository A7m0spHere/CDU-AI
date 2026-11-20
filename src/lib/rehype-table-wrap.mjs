/**
 * 渲染 Markdown 正文表格时的窄屏横向滚动容器包裹。
 *
 * 为每张 `<table>` 外层包一层 `.table-scroll` / `.table-scroll__stage` / `.table-scroll__inner`，
 * 配合全局样式与 `initTableScroll` 在窄屏时支持横向滑动与右侧渐隐提示，
 * 避免多列表格被强行挤压折行或撑破视口。
 */
export default function rehypeTableWrap() {
  return (tree) => {
    wrapTables(tree);
  };
}

function wrapTables(node) {
  if (!node || !Array.isArray(node.children)) return;
  const isScrollInner =
    node.type === 'element' &&
    Array.isArray(node.properties?.className) &&
    node.properties.className.includes('table-scroll__inner');

  node.children = node.children.map((child) => {
    wrapTables(child);
    if (!isScrollInner && child?.type === 'element' && child.tagName === 'table') {
      return {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['table-scroll'],
          'data-table-scroll': '',
        },
        children: [
          {
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['table-scroll__stage'],
            },
            children: [
              {
                type: 'element',
                tagName: 'div',
                properties: {
                  className: ['table-scroll__inner'],
                },
                children: [child],
              },
            ],
          },
          {
            type: 'element',
            tagName: 'p',
            properties: {
              className: ['table-scroll__hint'],
              ariaHidden: 'true',
            },
            children: [{ type: 'text', value: '左右滑动查看完整表格' }],
          },
        ],
      };
    }
    return child;
  });
}
