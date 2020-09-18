import {
  recurringProductImport,
  catalogueImport,
  singleProductImport,
} from "../../main";
import sinon from "sinon";

describe("Import functions", () => {
  it("Runs the product import recurringly", async () => {
    const queryProducts = sinon.fake.resolves({
      products: {
        pageInfo: { hasNextPage: false },
        edges: [
          {
            node: {},
          },
        ],
      },
    });
    const mapToCrystallizeProducts = sinon.fake.resolves([""]);
    const createCrystallizeProducts = sinon.fake.returns();
    const storeCrystallizeProductImages = sinon.fake.returns();

    await recurringProductImport(
      {},
      {
        queryProducts,
        mapToCrystallizeProducts,
        createCrystallizeProducts,
        storeCrystallizeProductImages,
      }
    );

    sinon.assert.calledOnce(queryProducts);
    sinon.assert.calledOnce(mapToCrystallizeProducts);
    sinon.assert.calledOnce(createCrystallizeProducts);
    sinon.assert.calledOnce(storeCrystallizeProductImages);
  });

  it.skip("runs recurringly if there is more pages", async () => {
    const queryProducts = sinon.fake.resolves({
      products: {
        pageInfo: { hasNextPage: true },
        edges: [
          {
            node: {},
          },
        ],
      },
    });

    const queryProductsFalse = sinon.fake.resolves({
      products: {
        pageInfo: { hasNextPage: false },
        edges: [
          {
            node: {},
          },
        ],
      },
    });
    const mapToCrystallizeProducts = sinon.fake.resolves([""]);
    const createCrystallizeProducts = sinon.fake.returns();
    const storeCrystallizeProductImages = sinon.fake.returns();
  });

  it("Syncs the Catalogue", async () => {
    const getClient = sinon.fake.returns();
    const getCategories = sinon.fake.resolves({
      collections: { edges: [{ node: {} }] },
    });
    const filterCategories = sinon.fake.returns();
    const mapToCrystallizeFolders = sinon.fake.returns();
    const createCrystallizeFolderStructure = sinon.fake.resolves();
    const createCrystallizeTopics = sinon.fake.resolves();
    const getTopics = sinon.fake.resolves([]);
    const importCrystallizeCatalogue = sinon.fake.resolves();
    const createCrystallizeGenericShape = sinon.fake.resolves({
      data: {
        shape: {
          create: {
            id: "test",
          },
        },
      },
    });
    const queryProducts = sinon.fake.resolves({
      products: {
        pageInfo: { hasNextPage: false },
        edges: [
          {
            node: {},
          },
        ],
      },
    });

    await catalogueImport([], {
      getClient,
      getCategories,
      filterCategories,
      mapToCrystallizeFolders,
      createCrystallizeFolderStructure,
      createCrystallizeTopics,
      getTopics,
      importCrystallizeCatalogue,
      createCrystallizeGenericShape,
    });
    sinon.assert.calledOnce(getCategories);
    sinon.assert.calledOnce(filterCategories);
    sinon.assert.calledOnce(mapToCrystallizeFolders);
    sinon.assert.calledOnce(createCrystallizeFolderStructure);
    sinon.assert.calledOnce(createCrystallizeTopics);
    sinon.assert.calledOnce(importCrystallizeCatalogue);
    sinon.assert.calledOnce(createCrystallizeGenericShape);
  });

  it("Syncs a single product", async () => {
    const queryProducts = sinon.fake.resolves({
      products: {
        pageInfo: { hasNextPage: false },
        edges: [
          {
            node: {},
          },
        ],
      },
    });
    const mapToCrystallizeProducts = sinon.fake.resolves([""]);
    const createCrystallizeProducts = sinon.fake.resolves([""]);
    const storeCrystallizeProductImages = sinon.fake.resolves([""]);
    const createCrystallizeGenericShape = sinon.fake.resolves({
      data: {
        shape: {
          create: {
            id: "test",
          },
        },
      },
    });

    await singleProductImport(["Test"], {
      createCrystallizeGenericShape,
      queryProducts,
      mapToCrystallizeProducts,
      createCrystallizeProducts,
      storeCrystallizeProductImages,
    });

    sinon.assert.calledOnce(createCrystallizeGenericShape);
    sinon.assert.calledOnce(queryProducts);
    sinon.assert.calledOnce(mapToCrystallizeProducts);
    sinon.assert.calledOnce(createCrystallizeProducts);
    sinon.assert.calledOnce(storeCrystallizeProductImages);
  });
});
