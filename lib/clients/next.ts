export const createNextClient = () => {
  return {
    get: <T>(endpoint): Promise<T> => {
      return fetch(`/api/${endpoint}`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      }).then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<T>;
      });
    },
    post: <T>(endpoint, body: {}): Promise<T> => {
      return fetch(`/api/${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
        },
      }).then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<T>;
      });
    },
  };
};
