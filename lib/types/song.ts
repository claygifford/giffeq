export type Song = {
  id: string;
  name: string;
  href: string;
  preview_url: string;
  artists: Artist[];
};

export type Artist = {
  id: string;
  name: string;
};
