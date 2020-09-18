import filterOutTagCats from "../../../lib/helpers/category-filter";
import { dummyTopics } from "./dummy-data";
import { expect } from "chai";
describe("Category filter", () => {
  it("filters out passed tag caegories correctly", () => {
    const result = filterOutTagCats(dummyTopics, ["third"]);

    expect(result)
      .to.be.an("array")
      .and.to.have.length(2)
      .and.that.does.not.include("third");
  });
});
