import {
  CRYSTALLIZE_PRODUCT_SHAPE_ID,
  CRYSTALLIZE_TENANT_ID,
  CRYSTALLIZE_DEFAULT_VAT_ID,
  CRYSTALLIZE_LANGUAGE_CODE,
  CRYSTALLIZE_ROOT_ITEM_ID,
} from "../config";
import { uploadImageToCrystallize } from "../crystallize";
import fromHTML from "../crystallize/helpers/content-transformer/fromHTML";

export const handleVariantAttributes = (shopifyOptions) =>
  shopifyOptions.map((o) => ({
    attribute: o.name,
    value: o.value,
  }));

export const handleVariantImages = async (images) => {
  const variantImages = [];
  for (const image of images) {
    const result = await uploadImageToCrystallize(image);
    variantImages.push(result);
  }
  return variantImages;
};

const between = (min, max) => Math.floor(Math.random() * (max - min) + min);

const matchVariants = (p) => {
  let productVariants;
  const variants = p.variants.edges.map((v) => v.node);

  if (variants && variants.length > 0) {
    productVariants = variants.map((v, i) => {
      return {
        name: v.name || p.title,
        sku: v.sku,
        price: parseFloat(v.price) || 10 * between(6, 12) - 0.1, //parseFloat(v.price) && Number.isFinite(parseFloat(v.price)) ? parseFloat(v.price) : 0,
        isDefault: i === 0,
        stock: parseFloat(v.stock) || 10 * between(30, 50),
        attributes: handleVariantAttributes(v.selectedOptions),
        externalReference: v.sku,
        // images: await handleVariantImages(
        //   i === 0 ? p.images.edges.map((i) => i.node) : v.image
        // ),
      };
    });
  } else {
    productVariants = [
      {
        name: p.title,
        sku: p.sku,
        price: parseFloat(p.price) || 10 * between(6, 12) - 0.1,
        isDefault: true,
        stock: parseFloat(p.stock) || 10 * between(30, 50),
        attributes: handleVariantAttributes(p.selectedOptions[1]),
        externalReference: p.sku,
        // images: handleVariantImages(p.images.edges.map((i) => i.node)),
      },
    ];
  }

  return productVariants;
};

export function handleBodyParagraph(obj) {
  if (!obj.type) {
    return {
      type: "paragraph",
      children: [obj],
    };
  }
  return obj;
}

export const getParagraphsFromHtml = (valuesObject) => {
  const paragraphs = [];

  try {
    const parsed = fromHTML(valuesObject);
    const p = parsed;
    let currentParagraph;
    if (!p) {
      return null;
    }
    for (const prop of p) {
      if (prop.type && prop.type.startsWith("heading")) {
        currentParagraph = {
          title: { text: toText(prop) },
          body: { json: [] },
        };
        paragraphs.push(currentParagraph);
      } else {
        const bodyParagraph = handleBodyParagraph(prop);
        if (currentParagraph) {
          currentParagraph.body.json.push(bodyParagraph);
        } else {
          currentParagraph = {
            title: { text: null },
            body: { json: [bodyParagraph] },
          };
          paragraphs.push(currentParagraph);
        }
      }
    }
  } catch (error) {
    return Promise.reject(error);
  }

  return paragraphs;
};

function generatePropertiesTable(cuddliness, fabric) {
  const properties = [];
  if (cuddliness) {
    properties.push({
      key: "cuddliness",
      value: cuddliness,
    });
  }
  if (fabric) {
    properties.push({
      key: "fabric",
      value: fabric,
    });
  }
  return properties;
}
const matchComponents = (shopifyCustomAttributes) => {
  const components = [];
  // For this example only the description attribute is used

  const descriptionAttribute = shopifyCustomAttributes[1];
  const vendorAttribute = { text: shopifyCustomAttributes[2] };

  if (descriptionAttribute) {
    const generatedParagraphs = getParagraphsFromHtml(descriptionAttribute);

    components.push({
      componentId: "description",
      paragraphCollection: {
        paragraphs: generatedParagraphs,
      },
    });
  }
  if (vendorAttribute) {
    components.push({
      componentId: "vendor",
      singleLine: vendorAttribute,
    });
  }
  return components;
};

export const getValidCrystallizeFolderId = ({
  product,
  shopifyIdMap,
  topicCategories,
}) => {
  const productCollections = product.collections.edges.reduce((acc, u) => {
    acc.push(u.node.id);
    return acc;
  }, []);

  return shopifyIdMap.find(
    ({ shopifyId, name }) =>
      productCollections.includes(shopifyId) &&
      !topicCategories.find((tc) => name == tc)
  );
};

export const matchProductTopics = ({
  product,
  crystallizeFolderName,
  topics,
}) => {
  const productTopics = [];

  const productCollections = product.collections.edges.reduce((acc, u) => {
    acc.push(u.node.title);
    return acc;
  }, []);

  for (const pc of productCollections) {
    const found = topics.find((t) => t.name === pc);
    if (found && pc !== crystallizeFolderName) {
      productTopics.push(found.id);
    }
  }

  return productTopics;
};

export const fieldMatch = (
  product,
  shopifyIdMap,
  topicCategories,
  topics,
  shapeId
) => {
  const folder = getValidCrystallizeFolderId({
    product,
    shopifyIdMap,
    topicCategories,
  });

  return {
    name: product.title,
    tenantId: CRYSTALLIZE_TENANT_ID,
    shapeId: shapeId || CRYSTALLIZE_PRODUCT_SHAPE_ID,
    vatTypeId: CRYSTALLIZE_DEFAULT_VAT_ID,
    components: matchComponents([
      product.description,
      product.descriptionHtml,
      product.vendor,
    ]),
    language: CRYSTALLIZE_LANGUAGE_CODE,
    variants: matchVariants(product),
    externalReference: product.id,
    // TODO: get categories from all variants, not only top level product
    topicIds: matchProductTopics({
      product,
      crystallizeFolderName: folder.name,
      topics,
    }),
    tree: {
      parentId: folder.crystallizeFolderId || CRYSTALLIZE_ROOT_ITEM_ID,
      position: product.position && product.position > 0 ? product.position : 1,
    },
  };
};

export default (
  productArray,
  shopifyIdMap,
  topicCollections,
  topics,
  shapeId
) =>
  productArray.map((p) =>
    fieldMatch(p, shopifyIdMap, topicCollections, topics, shapeId)
  );
