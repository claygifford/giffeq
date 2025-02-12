export type Song = {
  id: string;
  name: string;
  href: string;
  preview_url: string;
  artists: Artist[];
};

export type Decision = {
  song: Song;
  like: number;
};

export type Artist = {
  id: string;
  name: string;
};

export type Track = {
  actions: {
    interrupting_playback: boolean;
    pausing: boolean;
    resuming: boolean;
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
    toggling_repeat_context: boolean;
    toggling_shuffle: boolean;
    toggling_repeat_track: boolean;
    transferring_playback: boolean;
  };
  context: {
    type: string;
    href: string;
    external_urls: {
      spotify: string;
    };
    uri: string;
  };
  currently_playing_type: string;
  is_playing: boolean;
  timestamp: number;
  progress_ms: number;

  item: {
    album: {
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
      artists: [
        {
          external_urls: {
            spotify: string;
          };
          href: string;
          id: string;
          name: string;
          type: string;
          uri: string;
        },
      ];
    };
    artists: [
      {
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
      },
    ];
    available_markets: [string];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
      isrc: string;
      ean: string;
      upc: string;
    };
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    is_playable: boolean;
    linked_from: {};
    restrictions: {
      reason: string;
    };
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
  };
};
