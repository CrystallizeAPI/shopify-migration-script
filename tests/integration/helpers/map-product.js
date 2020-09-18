import * as mapper from "../../../lib/helpers/map-product";
import {
  dummyProduct,
  dummyShopifyCategories,
  dummyCrystallizeTopics,
  dummyProducts,
} from "./dummy-data";
import { expect } from "chai";

describe("Product map", () => {
  it.skip("maps fields correctly", () => {
    const result = mapper.fieldMatch(dummyProduct, "random", [], [], {});

    expect(result)
      .to.be.an("object")
      .and.to.have.all.keys(
        "name",
        "tenantId",
        "shapeId",
        "vatTypeId",
        "components",
        "language",
        "variants",
        "topicIds",
        "externalReference",
        "tree"
      );

    expect(result.components).to.be.an("array");
    expect(result.components[0]);
    expect(result.variants).to.be.an("array");
    expect(result.tree).to.have.all.keys("parentId", "position");
  });

  it("selects a folder as product parent, that doesnt exist as a topic", () => {
    const shopifyIdMap = [
      {
        name: "Fist",
        shopifyId: "1",
        crystallizeFolderId: "1",
      },
      {
        name: "Third",
        shopifyId: "3",
        crystallizeFolderId: "3",
      },
    ];

    const topicCategories = ["First", "Second"];

    const result = mapper.getValidCrystallizeFolderId({
      product: dummyProduct,
      shopifyIdMap,
      topicCategories,
    });

    expect(result.crystallizeFolderId).equals("1");
  });

  it("selects a folder as product parent, that doesnt exist as a topic if topics are empty", () => {
    const shopifyIdMap = [
      {
        name: "Fist",
        shopifyId: "1",
        crystallizeFolderId: "1",
      },
      {
        name: "Third",
        shopifyId: "3",
        crystallizeFolderId: "3",
      },
    ];

    const topicCategories = [];

    const result = mapper.getValidCrystallizeFolderId({
      product: dummyProduct,
      shopifyIdMap,
      topicCategories,
    });

    expect(result.crystallizeFolderId).equals("1");
  });

  it("associates correct topics based on product Shopify categories", () => {
    const result = mapper.matchProductTopics({
      product: dummyProduct,
      crystallizeFolderName: "First",
      topics: dummyCrystallizeTopics,
    });

    expect(result)
      .to.be.an("array")
      .and.to.include.members([
        "5e6f7612e749b9001cee6568",
        "5e6f7612e749b9001cee656b",
      ]);
  });

  it.skip("handles if description is null", () => {
    const result = mapper.getParagraphsFromHtml();

    expect(result).to.be.a("null");
  });

  it.skip("handles categories that are not topics, by not adding them ", () => {
    const dummyProductCategories = ["5"];

    const result = mapper.matchProductTopics(
      dummyProductCategories,
      dummyShopifyCategories,
      dummyCrystallizeTopics
    );

    expect(result).to.be.a("null");
  });

  it.skip("adds single SKUs containing `_` as seperate products", () => {});

  it.skip("verifies that position is non-negative", () => {
    const result = mapper.fieldMatch(
      { ...dummyProduct, position: -5 },
      "test",
      [],
      []
    );

    expect(result.tree.position).equals(1);
  });

  it("Handles Variant Attributes", () => {
    const result = mapper.handleVariantAttributes(
      dummyProduct.variants.edges[0].node.selectedOptions
    );

    expect(result)
      .to.be.an("array")
      .and.to.deep.include.members([
        { attribute: "Size", value: "big" },
        { attribute: "Color", value: "blue" },
      ]);
  });
});
