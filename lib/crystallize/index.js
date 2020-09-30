import createCrystallizeProduct from "./helpers/store-product";
import createCrystallizeFolder from "./helpers/create-folder";
import createCrystallizeTopic from "./helpers/create-topic";
import fetchCrystallizeCatalogue from "./helpers/get-catalogue";
import removeCrystallizeFolder from "./helpers/del-folder";
import fetchCrystallizeTopics from "./helpers/get-topics";
import publishCrystallizeFolder from "./helpers/publish-folder";
import publishProduct from "./helpers/publish-product";
import createCrystallizeOrder from "./helpers/create-order";

import {
  CRYSTALLIZE_LANGUAGE_CODE,
  CRYSTALLIZE_TENANT_ID,
  PUBLISH_INACTIVE_CATEGORIES,
} from "../config";

export { default as storeProductImages } from "./helpers/store-product-images";

export function storeCrystallizeOrder(order, injections = {}) {
  const { createOrder = createCrystallizeOrder } = injections;

  return createOrder(order);
}

export async function createFolderStructure(folders, injections = {}) {
  const {
    createCrystalFolder = createCrystallizeFolder,
    publishFolder = publishCrystallizeFolder,
  } = injections;

  const shopifyCrystallizeIdMap = [];

  for (const folder of folders) {
    const { data } = await createCrystalFolder(folder);
    const { id } = data.folder.create;

    await publishFolder({
      id: id,
      language: CRYSTALLIZE_LANGUAGE_CODE,
    });
    shopifyCrystallizeIdMap.push({
      shopifyId: folder.shopifyId,
      name: folder.name,
      crystallizeFolderId: id,
    });
  }

  return Promise.resolve(shopifyCrystallizeIdMap);
}

export async function createProducts(products, injections = {}) {
  const { generateProduct = createCrystallizeProduct } = injections;

  for (const product of products) {
    try {
      const res = await generateProduct(product);

      if (
        res.errors &&
        res.errors[0] &&
        res.errors[0].extensions &&
        res.errors[0].extensions.code !== "PRODUCT_VARIANT_SKU_IN_USE"
      ) {
        console.log("Handle error");
        // const { id } = res.data.product.create
        // // Sync here in case product has no images?
        // await publishProduct({ id: id, language: CRYSTALLIZE_LANGUAGE_CODE })
      } else if (
        res.errors &&
        res.errors[0] &&
        res.errors[0].extensions &&
        res.errors[0].extensions.code === "PRODUCT_VARIANT_SKU_IN_USE"
      ) {
        console.log("Variant in use");
        // Your sync Logic here
      } else {
        console.log("\t\tProduct Created");
        // Your sync Logic here
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
  return Promise.resolve();
}

export async function clearCatalogue() {
  try {
    const { data } = await fetchCrystallizeCatalogue();

    for (const folder of data.treeNode.children) {
      await removeCrystallizeFolder(folder.itemId);
    }
    return { success: true };
  } catch ({ stack }) {
    return { success: false, error: stack };
  }
}

export async function uploadImageToCrystallize(imageObj) {
  try {
    const imageFile = await downloadImage(imageObj);
    await generatePresignedRequest(imageObj);
    return uploadToCrystallize;
  } catch ({ stack }) {
    return Promise.reject(stack);
  }
}

export async function createTopics(categories, injections = {}) {
  for (const c of categories) {
    // TODO: hack to not get the following as topics in kids

    const crystallizeTopic = {
      name: c.title,
      children: null,
      language: CRYSTALLIZE_LANGUAGE_CODE,
      tenantId: CRYSTALLIZE_TENANT_ID,
    };

    await createCrystallizeTopic(crystallizeTopic);
  }
}

function flattenTopics(topics) {
  return topics.reduce((acc, cur) => {
    acc.push({ id: cur.id, name: cur.name });
    return acc;
  }, []);
}

export async function getCrystallizeTopics(injections = {}) {
  const { fetchTopics = fetchCrystallizeTopics } = injections;
  const { data } = await fetchTopics();

  return Promise.resolve(data.topic.getRootTopics);
}
