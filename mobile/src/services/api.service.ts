import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosRequestHeaders } from "axios";

interface IApi {
  method: "get" | "post" | "put" | "delete" | "patch";
  resource: string;
  data?: Record<string, any>;
  scoped?: {
    domain: string;
  };
}

export const api = async ({ method = "get", resource = "", data, scoped }: IApi) => {
  const url = (await AsyncStorage.getItem("apiUrl")) || "";
  const isHttp = url.includes("http");
  const baseUrl = `${isHttp ? "" : "http://"}${url}/${resource}`;

  console.log(baseUrl);

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
