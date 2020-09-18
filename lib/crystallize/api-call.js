import request from "node-fetch";
import { Policy } from "cockatiel";
import { CRYSTALLIZE_API_URL } from "../config";

export function apiCall(
  query,
  variables,
  crystallizeTokenId,
  crystallizeTokenSecret,
  injections = {}
) {
  return new Promise(async (resolve, reject) => {
    const options = {
      headers: {
        "content-type": "application/json",
        "X-Crystallize-Access-Token-Id": crystallizeTokenId,
        "X-Crystallize-Access-Token-Secret": crystallizeTokenSecret,
      },
      method: "post",
      body: { query, variables },
    };
    request(CRYSTALLIZE_API_URL, options)
      .then((res) =>
        res.errors
          ? reject({ ...res.errors[0], stack: res.errors[0].message })
          : resolve(res)
      )
      .catch((err) => {
        console.log("AAA", err);
        reject(err);
      });
  });
}

export async function concurrentApiCall(
  query,
  variables,
  crystallizeTokenId,
  crystallizeTokenSecret,
  injections = {}
) {
  const { apiRequest = apiCall, attempts = 10 } = injections;

  const policy = Policy.handleAll()
    .retry()
    .exponential({ maxAttempts: attempts });
  return policy.execute(() =>
    apiRequest(
      query,
      variables,
      crystallizeTokenId,
      crystallizeTokenSecret,
      injections
    )
  );
}

export default concurrentApiCall;
