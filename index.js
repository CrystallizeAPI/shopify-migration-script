require("dotenv").config();
require("esm")(module /*, options*/);

const importer = require("./main.js");

function runImport() {
  const { MODE, SKU } = process.env;
  if (MODE === "SINGLE") importer.singleProductImport(SKU);
  else {
    importer.catalogueImport(["manual coll"]);
  }
}

runImport();
