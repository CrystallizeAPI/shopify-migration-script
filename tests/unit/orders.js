import { expect } from "chai";
import sinon from "sinon";
import { ordersImport, handleOrder } from "../../orders";

describe("Import Orders", () => {
  it("reads a file", async () => {
    const readFile = sinon.fake.returns({ pipe: () => {} });

    ordersImport(".", { readFile });

    sinon.assert.calledOnce(readFile);
  });

  it("returns if no file provided", async () => {
    const readFile = sinon.fake.returns({ pipe: () => {} });

    ordersImport("", { readFile });

    sinon.assert.notCalled(readFile);
  });

  it("hanldes an order", async () => {
    const formatOrder = sinon.fake.returns({});
    const createOrder = sinon.fake.returns();

    handleOrder({}, { formatOrder, createOrder });

    sinon.assert.calledOnce(createOrder);
    sinon.assert.calledOnce(formatOrder);
  });
});
