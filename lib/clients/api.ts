import { HttpMethods } from '../../pages/api/methods';

export const createApiClient = () => {
  return {
    get: <T>(url, headers: {}): Promise<T> => {
      return fetch(`${url}`, {
        method: HttpMethods.get,
        headers,
      }).then((response) => {
        if (!response.ok) {
          response.type;
          throw response;
        }
        return response.json() as Promise<T>;
      });
    },
    post: <T>(url, headers: {}, body: {}): Promise<T> => {
      return fetch(`${url}`, {
        method: HttpMethods.post,
        body: body as BodyInit,
        headers,
      }).then((response) => {        
        if (!response.ok) {
          throw response;
        }
        return response.json() as Promise<T>;
      });
    },
  };
};
