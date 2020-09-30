export default function formatCSVOrder(order) {
  const customerName = order["Shipping Name"].split(" ");
  const customerBillingName = order["Billing Name"].split(" ");
  return {
    customer: {
      identifier: order.Email,
      firstName: customerName[0],
      lastName: customerName[customerName.length - 1],
      addresses: [
        {
          type: "billing",
          firstName: customerBillingName[0],
          lastName: customerBillingName[customerBillingName.length - 1],
          street: order["Billing Address1"],
          street2: order["Billing Address2"],
          postalCode: order["Billing Zip"],
          city: order["Billing City"],
          state: order["Billing Province"],
          country: order["Billing Country"],
          phone: order["Billing Phone"],
          email: order.Email,
        },
        {
          type: "delivery",
          firstName: customerName[0],
          lastName: customerName[customerName.length - 1],
          street: order["Shipping Address1"],
          street2: order["Shipping Address2"],
          postalCode: order["Shipping Zip"],
          city: order["Shipping City"],
          state: order["Shipping Province"],
          country: order["Shipping Country"],
          phone: order["Shipping Phone"],
          email: order.Email,
        },
      ],
    },
    total: {
      gross: parseFloat(order.Total),
      net: parseFloat(order.Subtotal),
      currency: order.Currency,
      tax: {
        name: "Tax",
        percent: (parseFloat(order.Taxes) / parseFloat(order.Total)) * 100,
      },
    },
    cart: [
      {
        name: order["Lineitem name"],
        quantity: parseInt(order["Lineitem quantity"]),
        price: {
          gross: parseFloat(order["Lineitem price"]),
          net: parseFloat(order["Lineitem price"]),
          currency: order.Currency,
        },
      },
    ],
    payment: [
      {
        provider: "custom",
        custom: {
          properties: [
            { property: "payment", value: "shopify" },
            { property: "employee", value: order.Employee },
            { property: "shopifyId", value: order.Id },
            { property: "financial_status", value: order["Financial Status"] },
            { property: "payment_method", value: order["Payment Method"] },
            {
              property: "payment_reference",
              value: order["Payment Reference"],
            },
            { property: "risk_level", value: order["Risk Level"] },
            { property: "receipt_number", value: order["Receipt Number"] },
          ],
        },
      },
    ],

    additionalInformation: JSON.stringify({
      "Fulfillment Status": order["Fulfillment Status"],
      "Fulfilled at": order["Fulfilled at"],
      Notes: order.Notes,
      Vendor: order.Vendor,
    }),
  };
}
