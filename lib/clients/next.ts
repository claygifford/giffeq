import { HttpMethods } from "../../pages/api/methods";

export const createNextClient = () => {
  return {
    get: <T>(
      endpoint,
      params?: {[key: string]: string}
    ): Promise<T> => {
      let search = '';
      if (params) {
        search = '?';
        for (const param in params) {
          search += `${param}=${params[param]}`;
        }
      }
      return fetch(`/api/${endpoint}${search}`, {
        method: HttpMethods.get,
        headers: {
          'content-type': 'application/json',
        },
      }).then(async (response) => {
        if (!response.ok) {
          response.type;
          throw response;
        }
        return response.json() as Promise<T>;
      });
    },
    post: <T>(endpoint, body: {}): Promise<T> => {
      return fetch(`/api/${endpoint}`, {
        method: HttpMethods.post,
        body: JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
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
      params?: { name: string; value: string }
    ): Promise<string> => {
      let search = '';
      if (params) {
        search = `?${params.name}=${params.value}`;
      }
      return fetch(`/api/${endpoint}${search}`, {
        method: 'DELETE',
      }).then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.text();
      });
    },
  };  
};