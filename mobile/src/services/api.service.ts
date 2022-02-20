import axios, { AxiosRequestHeaders } from "axios";
import Constants from "expo-constants";

// NOTE: We might enhance the API "look" to something like this:
//
// await api.get("/users/:id", {
//     data
//  }, {
//     customHeaders
//  })
//
// await api.post("/users/:id", {
//     data
//  }, {
//     customHeaders
//  }).auth(domain)
//
//  Might look cleaner

interface IApi {
  method: "get" | "post" | "put" | "delete" | "patch";
  resource: string;
  data?: Record<string, any>;
  scoped?: {
    domain: string;
  };
}

const { manifest } = Constants;

const url =
  typeof manifest?.packagerOpts === `object` && manifest?.packagerOpts.dev
    ? manifest?.debuggerHost?.split(`:`)?.shift()?.concat(`:3000`)
    : `localhost`;

export const api = async ({ method = "get", resource = "", data, scoped }: IApi) => {
  const baseUrl = `http://${url}/${resource}`;

  const headers: AxiosRequestHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: scoped?.domain || "",
  };

  if (!scoped?.domain) {
    delete headers["Authorization"];
  }

  const options = {
    get: async () => axios.get(baseUrl, { headers }),
    post: async () => axios.post(baseUrl, data, { headers }),
    put: async () =>
      axios.put(baseUrl, data, {
        headers,
      }),
    patch: async () => axios.patch(baseUrl, data, { headers }),
    delete: async () => axios.delete(baseUrl, { headers }),
  };

  console.log(`[${method}] ${baseUrl}`);
  console.log(headers);

  return options[method]();
};
