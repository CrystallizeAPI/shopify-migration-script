import orderMutation from "../mutations/create-order.js";
import apiCrystallizeCall from "./api-call.js";

const createCrystallizeOrder = (order, injections = {}) => {
  const { apiCall = apiCrystallizeCall } = injections;

  return apiCall(orderMutation, order, {
    apiUrl: `https://api.crystallize.com/${process.env.CRYSTALLIZE_TENANT_IDENDIFIER}/orders`,
    ...injections,
  });
};

export default createCrystallizeOrder;
