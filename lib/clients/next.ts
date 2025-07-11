import { HttpMethods } from "../../pages/api/methods";

export const createNextClient = () => {
  return {
    get: <T>(
      endpoint,
      params?: { [key: string]: string | number },
    ): Promise<T> => {
      let search = "";
      if (params) {
        search = "?";
        let items = [];
        for (const param in params) {
          items.push(`${param}=${params[param]}`);
        }
        search += items.join("&");
      }
      return fetch(`/api/${endpoint}${search}`, {
        method: HttpMethods.get,
        headers: {
          "content-type": "application/json",
        },
      }).then(async (response) => {
        if (!response.ok) {
          response.type;
          throw response;
        }
        if (response.status === 204) return;
        return response.json() as Promise<T>;
      });
    },
    post: <T>(endpoint, body: {}): Promise<T> => {
      return fetch(`/api/${endpoint}`, {
        method: HttpMethods.post,
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json",
        },
      }).then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json() as Promise<T>;
      });
    },
    delete: (
      endpoint,
      params?: { [key: string]: string | number },
    ): Promise<string> => {
      let search = "";
      if (params) {
        const items = [];
        for (const key in params) {
          items.push(`${key}=${params[key]}`);
        }
        search = `?${items.join("&")}`;
      }
      return fetch(`/api/${endpoint}${search}`, {
        method: "DELETE",
      }).then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.text();
      });
    },
    put: <T>(
      endpoint,
      body: {},
      params?: { [key: string]: string | number },
    ): Promise<T> => {
      let search = "";
      if (params) {
        search = "?";
        let items = [];
        for (const param in params) {
          items.push(`${param}=${params[param]}`);
        }
        search += items.join("&");
      }
      return fetch(`/api/${endpoint}${search}`, {
        method: HttpMethods.put,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      }).then(async (response) => {
        if (!response.ok) {
          response.type;
          throw response;
        }
        return response.json() as Promise<T>;
      });
    },
  };
};
