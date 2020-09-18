import sinon from "sinon";
import * as crystallize from "../../lib/crystallize";
import { dummyTopics } from "./helpers/dummy-data";
import { expect } from "chai";

describe("crystallize utilities", () => {
  it("fetches and flattens all Crystallize topics in an array", async () => {
    const fetchTopics = sinon.fake.resolves({
      data: {
        topic: {
          getRootTopics: [
            {
              id: "5e8ac587109ecc001ffc0408",
              name: "Toys",
            },
            {
              id: "5e8ac587109ecc001ffc040a",
              name: "Girls",
            },
            { id: "5e8ac587109ecc001ffc0409", name: "Boys" },
          ],
        },
      },
    });

    const result = await crystallize.getCrystallizeTopics({ fetchTopics });

    expect(result).to.be.an("array").and.to.have.length(3);
  });
});
