export type Song = {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  available_markets: [];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: [];
  external_urls: [];
  href: string;
  is_local: boolean;
  is_playable: boolean;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
};

export type MusicMeta = {
  uri: string;
  name: string;
  group: string;
  timestamp: number;
  album_uri: string;
  artists_uri: string[];
};
export type MusicData = { track: Song; album: Album; artists: Artist[] };
export type HistoryData = History & MusicData;
export type DecisionData = Decision & MusicData;
export type History = MusicMeta & { count: number };
export type Decision = MusicMeta & { like: number };

export type Artist = {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
  images: [
    {
      url: string;
      height: number;
      width: number;
    },
  ];
};

export type Album = {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: [
    {
      url: string;
      height: number;
      width: number;
    },
  ];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions: {
    reason: string;
  };
  type: string;
  uri: string;
  artists: Artist[];
};

export type Track = {
  id: string;
  name: string;
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: [];
  external_urls: [];
  href: string;
  is_local: boolean;
  is_playable: boolean;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  album_uri: string;
  artists_uri: string[];
  artists?: Artist[];
  album?: Album;
};
