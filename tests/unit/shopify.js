import sinon from "sinon";
import * as s from "../../lib/shopify";

describe("shopify ", () => {
  it("gets the API client", () => {
    const apiClient = sinon.fake();

    s.getClient({ apiClient });

    sinon.assert.calledOnce(apiClient);
  });

  it("fetches product info for all products", async () => {
    const getProducts = sinon.fake.resolves({});

    await s.getProducts(null, null, { client: { request: getProducts } });
    sinon.assert.calledOnce(getProducts);
  });

  it("fetches collections", async () => {
    const getCollections = sinon.fake.resolves({});

    await s.getCollections(null, null, { client: { request: getCollections } });
    sinon.assert.calledOnce(getCollections);
  });
});
