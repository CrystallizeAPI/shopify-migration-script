import * as fs from "fs";
import { parse } from "fast-csv";
import formatCSVOrder from "./lib/helpers/format-csv-order";
import { storeCrystallizeOrder } from "./lib/crystallize";

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms * 100);
  });
}

export async function handleOrder(order, injections = {}) {
  const {
    formatOrder = formatCSVOrder,
    createOrder = storeCrystallizeOrder,
  } = injections;
  const formatedOrder = formatOrder(order);
  const { data } = await createOrder(formatedOrder);
  return Promise.resolve(data);
}

export function ordersImport(ordersFile, injections = {}) {
  const { readFile = fs.createReadStream, csvParse = parse } = injections;

  if (!ordersFile) {
    console.log(`Please provide a file, value is: ${ordersFile}`);
    return;
  }
  const stream = readFile(ordersFile);
  let orderObjectsArray = [];
  stream.pipe(
    csvParse({ headers: true })
      .on("error", (error) => console.log(error))
      .on("data", async (order) => {
        orderObjectsArray.push(order);
        if (orderObjectsArray.length === 10) {
          stream.pause();
          for (const o of orderObjectsArray) {
            await handleOrder(o, injections);
          }
          orderObjectsArray = [];
          stream.resume();
        }
      })
      .on("end", (rowCount) => console.log(`Parsed ${rowCount} rows`))
  );
}
