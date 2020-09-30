import mapToFolders from "./lib/helpers/map-folder";
import mapToProducts from "./lib/helpers/map-product";
import createCrystallizeShape from "./lib/crystallize/helpers/create-shape";
import filterOutTagCategories from "./lib/helpers/category-filter";
import { getCollections, getProducts } from "./lib/shopify";
import {
  createFolderStructure,
  createTopics,
  createProducts,
  storeProductImages,
  getCrystallizeTopics,
} from "./lib/crystallize";

import { CRYSTALLIZE_ROOT_ITEM_ID } from "./lib/config";
import product from "./lib/crystallize/mutations/product";

export async function logic() {
  try {
    const { collections } = await getCollections();
    const categories = collections.edges.map((c) => c.node);
    console.log(categories);
    return;
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}

function productCollection({ collections, shopifyIdMap }) {}
export async function recurringProductImport(
  {
    first = 250,
    after = null,
    crystallizeGenericShapeId,
    shopifyIdMap,
    shopifyTopicCollections = [],
    topics = [],
  },
  injections
) {
  const {
    queryProducts = getProducts,
    mapToCrystallizeProducts = mapToProducts,
    createCrystallizeProducts = createProducts,
    storeCrystallizeProductImages = storeProductImages,
  } = injections;
  const {
    products: {
      pageInfo: { hasNextPage },
      edges,
    },
  } = await queryProducts(first, after);

  const shopifyProducts = edges.map((e) => e.node);

  // Find proper collection for the product

  const crystallizeProducts = mapToCrystallizeProducts(
    shopifyProducts,
    shopifyIdMap,
    shopifyTopicCollections,
    topics,
    crystallizeGenericShapeId
  );

  console.log("Generating Category Products");
  await createCrystallizeProducts(crystallizeProducts);

  console.log("\t\t\tUploading Images");
  for (const p of shopifyProducts) {
    await storeCrystallizeProductImages(p);
  }

  if (hasNextPage) {
    await recurringProductImport({
      first,
      after: edges[edges.length - 1].cursor,
      crystallizeGenericShapeId,
      shopifyIdMap,
      shopifyTopicCollections,
      topics,
    });
  }
  return Promise.resolve();
}

export async function catalogueImport(
  shopifyTopicCollections = [],
  injections = {}
) {
  const {
    getCategories = getCollections,
    filterCategories = filterOutTagCategories,
    mapToCrystallizeFolders = mapToFolders,
    createCrystallizeFolderStructure = createFolderStructure,
    createCrystallizeTopics = createTopics,
    getTopics = getCrystallizeTopics,
    importCrystallizeCatalogue = recurringProductImport,
    createCrystallizeGenericShape = createCrystallizeShape,
  } = injections;

  try {
    console.log("Getting categories");
    const { collections } = await getCategories();
    const categories = collections.edges.map((c) => c.node);

    const filteredCategories = filterCategories(
      categories,
      shopifyTopicCollections
    );
    console.log("Mapping to Crystallize");
    const crystallizeFolders = mapToCrystallizeFolders(filteredCategories);

    console.log("Creating Folder Structure");
    const shopifyIdMap = await createCrystallizeFolderStructure(
      crystallizeFolders
    );

    console.log("Creating Topics");
    const topicCategories = categories.filter((c) =>
      shopifyTopicCollections.includes(c.title)
    );
    await createCrystallizeTopics(topicCategories);

    console.log("Create Crystallize generic Shape");
    const { data } = await createCrystallizeGenericShape();

    const topics = await getTopics();

    console.log("Importing Catalogue");
    return importCrystallizeCatalogue(
      {
        shopifyIdMap,
        categories,
        crystallizeGenericShapeId: data.shape.create.id,
        topics,
      },
      injections
    );
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}

export async function singleProductImport(
  shopifyTopicCollections = [],
  injections = {}
) {
  const {
    createCrystallizeGenericShape = createCrystallizeShape,
    queryProducts = getProducts,
    mapToCrystallizeProducts = mapToProducts,
    createCrystallizeProducts = createProducts,
    storeCrystallizeProductImages = storeProductImages,
  } = injections;

  try {
    console.log("Creating Crystallize generic Shape");
    const { data } = await createCrystallizeGenericShape({ attempts: 1 });
    // Fetch Product information from Magento
    console.log("Fetching Shopify Products");
    const { products, hasSecondPage } = await queryProducts(1);
    const shopifyProduct = products.edges[0].node;

    const crystallizeProducts = mapToCrystallizeProducts(
      [shopifyProduct],
      CRYSTALLIZE_ROOT_ITEM_ID,
      shopifyTopicCollections,
      [],
      data.shape.create.id
    );

    console.log("Generating Category Products");
    await createCrystallizeProducts(crystallizeProducts);

    console.log("\t\t\tUploading Images");
    for (const p of [shopifyProduct]) {
      await storeCrystallizeProductImages(p);
    }
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}
