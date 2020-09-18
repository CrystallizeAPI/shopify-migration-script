// import {
//   getClient as getMagentoClient,
//   getProducts as getProductsInfo,
// } from "./shopify";
// import { storeProductImages, createProducts } from "./crystallize";
// import mapToProducts from "./helpers/map-product";
// import { performance } from "perf_hooks";

// export async function syncProduct(
//   SKUarray,
//   crystallizeFolderId,
//   topicCategories,
//   topics,
//   shapeId,
//   injections = {}
// ) {
//   const start = performance.now();

//   const {
//     storeCrystallizeProductImages = storeProductImages,
//     client = getMagentoClient(),
//   } = injections;
//   try {
//     // retrieve product info
//     const magentoProductsInfo = await getProductsInfo(SKUarray, {
//       mangClient: client,
//     });
//     // map to Crystallize data
//     const crystallizeProducts = await mapToProducts(
//       magentoProductsInfo,
//       crystallizeFolderId,
//       topicCategories,
//       topics,
//       shapeId
//     );

//     // generate Crystallize Products in Catalogue
//     console.log("Generating Category Products");
//     await createProducts(crystallizeProducts);

//     console.log("\t\t\tUploading Images");
//     // fire Image upload
//     for (const p of crystallizeProducts) {
//       await storeCrystallizeProductImages(p.externalReference);
//     }

//     const finish = ((performance.now() - start) / 1000).toFixed(2);
//     return Promise.resolve({
//       success: true,
//       executionTime: finish,
//     });
//   } catch (error) {
//     console.log(error);
//     return Promise.reject(error);
//   }
// }
