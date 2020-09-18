import download from "download";
import slug from "slug";
import fileType from "file-type";
import publishProduct from "./publish-product";

import {
  CRYSTALLIZE_LANGUAGE_CODE,
  MAGENTO_API_URL,
  CRYSTALLIZE_TENANT_ID,
} from "../../config";

import uploadFile from "./upload-file";
import apiCall from "./api-call";

function getUrlSafeFileName(fileName) {
  let options = {
    replacement: "-", // replace spaces with replacement
    symbols: true, // replace unicode symbols or not
    remove: null, // (optional) regex to remove characters
    lower: false, // result in lower case
    charmap: slug.charmap, // replace special characters
    multicharmap: slug.multicharmap, // replace multi-characters
  };

  return slug(fileName, options);
}

const mimeArray = {
  "image/jpeg": ".jpeg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "image/bmp": ".bmp",
  "image/webp": ".webp",
};

export default async function storeProductImages(p) {
  try {
    const {
      data: {
        products: {
          getMany: [product],
        },
      },
    } = await apiCall(`{
    products: item {
      getMany (
        tenantId: "${CRYSTALLIZE_TENANT_ID}"
        language: "en"
        externalReferences: ["${p.id}"]
      ) {
        id
        ... on Product {
          variants {
            name
            sku
            price
            stock
            attributes {
              attribute
              value
            }
            externalReference
            isDefault
          }
        }
      }
    }
  }
`);

    // // Get all the variants from Magento
    // const shopifyVariants = await Promise.all(
    //   product.variants
    //     .map((v) => v.externalReference)
    //     .reduce((arr, el) => {
    //       if (!arr.some((s) => s === el)) {
    //         arr.push(el);
    //       }
    //       return arr;
    //     }, [])
    //     .map(queryProduct)
    // );
    const variants = p.variants.edges.map((v) => v.node);

    async function handleVariant(variant, index) {
      // Download the images
      let images;
      if (index === 0) {
        images = await Promise.all(
          p.images.edges.map(async ({ node: { originalSrc, id } }) => {
            const urlSafeFilename = getUrlSafeFileName(
              `${id}-${variant.title}-${variant.sku}`
            );

            const fileBuffer = await download(originalSrc);
            const contentType = await fileType.fromBuffer(fileBuffer);

            const completeFilename = `${urlSafeFilename}${
              mimeArray[contentType.mime] || ".jpeg"
            }`;

            return {
              id,
              filename: completeFilename,
              contentType: contentType.mime,
              fileBuffer,
            };
          })
        );
      } else {
        const urlSafeFilename = getUrlSafeFileName(
          `${variant.image.id}-${variant.title}-${variant.sku}`
        );

        const fileBuffer = await download(variant.image.originalSrc);
        const contentType = await fileType.fromBuffer(fileBuffer);

        const completeFilename = `${urlSafeFilename}${
          mimeArray[contentType.mime] || ".jpeg"
        }`;

        images = [
          {
            id: variant.image.id,
            filename: completeFilename,
            contentType: contentType.mime,
            fileBuffer,
          },
        ];
      }

      const uploads = await Promise.all(
        images.filter((i) => !i.contentType.startsWith("video")).map(uploadFile)
      );
      // Set the key for the image

      product.variants
        .filter((v) => v.externalReference === variant.sku)
        .forEach((cv) => {
          cv.images = uploads.map(({ key, contentType, id }) => ({
            key,
            mimeType: contentType,
            meta: [
              {
                key: "shopify-media-id",
                value: id,
              },
            ],
          }));
        });
    }
    await Promise.all(variants.map(handleVariant));

    // Associcate the uploads with the variants
    await apiCall(
      `mutation updateProductVariantImages (
        $id: ID!
        $language: String!
        $variants: [UpdateProductVariantInput!]!
        ) {
      product {
        update(
          id: $id
          language: $language
          input: {
            variants: $variants
          }
        ) {
          id
        }
      }
    }`,
      {
        id: product.id,
        language: CRYSTALLIZE_LANGUAGE_CODE,
        variants: product.variants,
      }
    );
    console.log("\t\t\tPublishing product", product.id);
    return publishProduct({
      id: product.id,
      language: CRYSTALLIZE_LANGUAGE_CODE,
    });
  } catch (error) {
    console.log(JSON.stringify(error, null, 3));
    return Promise.reject(error);
  }
}
