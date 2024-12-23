export type Query<T> = {
  items: T[];
  total: number;
  count: number;
  start: number;
};

export let EmptyQuery = {
  items: [],
  total: 0,
  count: 0,
  start: 0,
};
