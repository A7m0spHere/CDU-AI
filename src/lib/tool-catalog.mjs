import { toolSections } from '../data/tool-sections.mjs';

/** @typedef {{id: string, category: string, alsoIn?: string[], catalogGroup?: string, aigcSection?: string}} CatalogTool */
/** @typedef {{id: string, name?: string}} CatalogCategory */
/** @typedef {{id: string, categories: {id: string, groups: {key: string, toolIds: string[], collapsedIds: string[]}[]}[]}} CatalogView */

const belongsTo = (tool, category) => tool.category === category || (tool.alsoIn ?? []).includes(category);
const matchesSection = (tool, section) => section.field
  ? tool[section.field] === section.value
  : (section.toolIds ?? []).includes(tool.id);

/** 全目录只显示主分类；具体栏目同时包含通过 alsoIn 关联的工具。
 * @param {string} categoryId
 * @param {CatalogTool[]} tools
 * @param {CatalogCategory[]} categories
 * @returns {CatalogView}
 */
export function createCatalogView(categoryId, tools, categories) {
  const selected = categoryId === 'all' ? categories : categories.filter((category) => category.id === categoryId);
  return {
    id: categoryId,
    categories: selected.map((category) => {
      const members = tools.filter((tool) => categoryId === 'all' ? tool.category === category.id : belongsTo(tool, category.id));
      const memberById = new Map(members.map((tool) => [tool.id, tool]));
      return {
        id: category.id,
        groups: (toolSections[category.id] ?? []).map((section) => {
          // 明确列举的分区以配置顺序展示；字段分组继续保留数据顺序。
          const groupTools = section.field
            ? members.filter((tool) => matchesSection(tool, section))
            : (section.toolIds ?? []).map((id) => memberById.get(id)).filter((tool) => tool !== undefined);
          return {
            key: `${category.id}-${section.id}`,
            toolIds: groupTools.map((tool) => tool.id),
            collapsedIds: section.collapse
              ? groupTools.filter((tool) => !section.collapse.featuredIds.includes(tool.id)).map((tool) => tool.id)
              : [],
          };
        }),
      };
    }),
  };
}

/** 构建、校验与搜索索引复用同一套分区定义。
 * @param {CatalogTool} tool
 * @returns {string[]}
 */
export function getToolSectionLabels(tool) {
  return [tool.category, ...(tool.alsoIn ?? [])].flatMap((category) => (
    (toolSections[category] ?? []).filter((section) => matchesSection(tool, section)).map((section) => section.name)
  ));
}

/** @param {CatalogTool[]} tools @param {(CatalogCategory | string)[]} categories @returns {string[]} */
export function validateCatalogSections(tools, categories) {
  const errors = [];
  if (tools.length === 0) return errors;
  const knownIds = new Set(tools.map((tool) => tool.id));
  const categoryIds = new Set(categories.map((category) => typeof category === 'string' ? category : category.id));
  for (const category of categoryIds) {
    const sections = toolSections[category];
    if (!sections?.length) { errors.push(`分类 ${category} 缺少页内分区`); continue; }
    if (new Set(sections.map((section) => section.id)).size !== sections.length) errors.push(`分类 ${category} 的分区 id 重复`);
    for (const tool of tools.filter((item) => belongsTo(item, category))) {
      const matched = sections.filter((section) => matchesSection(tool, section));
      if (matched.length !== 1) errors.push(`${tool.id} 在 ${category} 中必须且只能归入一个分区（当前 ${matched.length}）`);
    }
    for (const section of sections) {
      const explicitIds = section.toolIds ?? [];
      if (new Set(explicitIds).size !== explicitIds.length) errors.push(`分区 ${category}/${section.id} 的工具列表存在重复引用`);
      for (const id of [...(section.toolIds ?? []), ...(section.collapse?.featuredIds ?? [])]) {
        if (!knownIds.has(id)) errors.push(`分区 ${category}/${section.id} 引用了不存在的工具 ${id}`);
        else if (!belongsTo(tools.find((tool) => tool.id === id), category)) errors.push(`${id} 不属于分区所在分类 ${category}`);
      }
    }
  }
  for (const category of Object.keys(toolSections)) {
    if (!categoryIds.has(category)) errors.push(`分区配置引用了不存在的分类 ${category}`);
  }
  return errors;
}
