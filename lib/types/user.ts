import { Preferences } from "./playlist";

export type User = {
  username: string;
  email: string;
  preferences: Preferences;
};

export type Account = {
  username: string;
  email: string;
  id: string;
};