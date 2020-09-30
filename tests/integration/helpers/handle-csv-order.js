import formatCSVOrder from "../../../lib/helpers/format-csv-order";
import { dummyShoppifyOrder } from "./dummy-data";
import { expect } from "chai";
describe("Format CSV Order before pushing to  Crystallize", () => {
  it("maps the attributes", () => {
    const result = formatCSVOrder(dummyShoppifyOrder);

    expect(result).to.deep.equal({
      customer: {
        identifier: "testUser@gmail.com",
        firstName: "Bill",
        lastName: "Testson",
        addresses: [
          {
            type: "billing",
            firstName: "Bill",
            lastName: "Testson",
            street: "Billingstr 123",
            street2: "Billingstr 123",
            postalCode: "123456",
            city: "bilcity",
            state: "",
            country: "PL",
            phone: "123456",
            email: "testUser@gmail.com",
          },
          {
            type: "delivery",
            firstName: "Bill",
            lastName: "Testson",
            street: "Billingstr",
            street2: "",
            postalCode: "2222",
            city: "ShipCity",
            state: "",
            country: "NL",
            phone: "111111111",
            email: "testUser@gmail.com",
          },
        ],
      },
      total: {
        gross: 2.95,
        net: 2.95,
        currency: "EUR",
        tax: {
          name: "Tax",
          percent: 0,
        },
      },
      cart: [
        {
          name: "Nina",
          quantity: 1,
          price: {
            gross: 2.95,
            net: 2.95,
            currency: "EUR",
          },
        },
      ],
      payment: [
        {
          provider: "custom",
          custom: {
            properties: [
              ,
              { property: "payment", value: "shopify" },
              { property: "employee", value: "" },
              { property: "shopifyId", value: "123123" },
              { property: "financial_status", value: "paid" },
              { property: "payment_method", value: "card" },
              { property: "payment_reference", value: "123123" },
              { property: "risk_level", value: "Low" },
              { property: "receipt_number", value: "123123" },
            ],
          },
        },
      ],

      additionalInformation:
        '{"Fulfillment Status":"fulfilled","Fulfilled at":"2020-09-15 14:01:03 +0200","Notes":"example notes","Vendor":"A Vendor"}',
    });
  });
});
