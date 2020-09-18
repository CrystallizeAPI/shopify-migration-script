import shapeMutation from "../mutations/shape.js";
import apiCrystallizeCall from "./api-call.js";

import { CRYSTALLIZE_TENANT_ID } from "../../config";

const createCrystallizeShape = (injections = {}) => {
  const { apiCall = apiCrystallizeCall } = injections;

  const input = {
    tenantId: CRYSTALLIZE_TENANT_ID,
    name: "Generic Crystallize Shopify Import Shape",
    type: "product",
    components: [
      {
        id: "vendor",
        name: "Vendor",
        type: "singleLine",
      },
      {
        id: "description",
        name: "Description ",
        type: "paragraphCollection",
      },
      {
        id: "properties",
        name: "Properties",
        type: "propertiesTable",
      },
    ],
  };

  return apiCall(shapeMutation, input, injections);
};

export default createCrystallizeShape;
