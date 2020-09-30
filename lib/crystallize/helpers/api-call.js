import request from "node-fetch";
import {
  MY_CRYSTALLIZE_SECRET_TOKEN,
  MY_CRYSTALLIZE_SECRET_TOKEN_ID,
  CRYSTALLIZE_API_URL,
} from "../../config";
import { Policy, ConsecutiveBreaker } from "cockatiel";

const apiCall = async (query, variables, injections = {}) => {
  const {
    crystallizeTokenId = MY_CRYSTALLIZE_SECRET_TOKEN_ID,
    crystallizeTokenSecret = MY_CRYSTALLIZE_SECRET_TOKEN,
    apiUrl = CRYSTALLIZE_API_URL,
  } = injections;

  return new Promise(async (resolve, reject) => {
    const options = {
      headers: {
        "content-type": "application/json",
        "X-Crystallize-Access-Token-Id": crystallizeTokenId,
        "X-Crystallize-Access-Token-Secret": crystallizeTokenSecret,
      },
      method: "post",
      body: JSON.stringify({ query, variables }),
    };
    request(apiUrl, options)
      .then((res) => {
        return res.json();
      })
      .then((res) =>
        res.errors &&
        res.errors[0] &&
        res.errors[0].extensions.code !== "PRODUCT_VARIANT_SKU_IN_USE"
          ? reject({ ...res.errors[0], stack: res.errors[0].message })
          : resolve(res)
      )
      .catch((err) => {
        err.extensions && err.extensions.code === "PRODUCT_VARIANT_SKU_IN_USE"
          ? resolve(err)
          : reject(err);
      });
  });
};

const concurrentApiCall = async (query, variables, injections = {}) => {
  const { apiRequest = apiCall } = injections;

  const policy = Policy.handleAll().retry().exponential({ maxAttempts: 10 });
  return policy.execute(() => apiRequest(query, variables, injections));
};
export default concurrentApiCall;
