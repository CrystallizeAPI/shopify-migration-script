require("dotenv").config();
require("esm")(module /*, options*/);

const importer = require("./main.js");

function runImport() {
  const { MODE, FILE } = process.env;
  if (MODE === "ORDERS") {
    importer.ordersImport(FILE);
  } else {
    importer.catalogueImport(["manual coll"]);
  }
}

runImport();
