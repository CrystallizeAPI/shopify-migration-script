import {
  CRYSTALLIZE_FOLDER_SHAPE_ID,
  CRYSTALLIZE_TENANT_ID,
  CRYSTALLIZE_ROOT_ITEM_ID,
  CRYSTALLIZE_LANGUAGE_CODE,
} from "../config.js";

const fieldMatch = (cat) => {
  return {
    shopifyId: cat.shopifyId,
    tenantId: CRYSTALLIZE_TENANT_ID,
    shapeId: CRYSTALLIZE_FOLDER_SHAPE_ID,
    language: CRYSTALLIZE_LANGUAGE_CODE,
    externalReference: `${cat.shopifyId}`,
    name: cat.name,
    components: [
      {
        componentId: "body",
        paragraphCollection: {
          paragraphs: [
            {
              title: { text: "Description" },
              body: { html: cat.description },
            },
          ],
        },
      },
    ],
    tree: {
      parentId: CRYSTALLIZE_ROOT_ITEM_ID,
    },
  };
};

const mapCategory = (cat) => {
  if (cat.children && cat.children.length > 0) {
    return {
      ...fieldMatch(cat),
      children: cat.children.map(mapCategory),
    };
  } else {
    return fieldMatch(cat);
  }
};

export default (categories) => categories.map(mapCategory);
