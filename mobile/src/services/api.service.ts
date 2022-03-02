import axios, { AxiosRequestHeaders } from "axios";
import Constants from "expo-constants";

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
    : `localhost:3000`;

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

  return options[method]();
};
