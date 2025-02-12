import { Decision, Song } from "./song";

export type Playlist = {
  name: string;
  id: string;
  history: Song[];
  decisions: Decision[];
  searches: string[];
};

export type Preferences = {
  AutoPlaySong: boolean;
};

export type Connector = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  refresh_date: number;
};
