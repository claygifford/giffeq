import { Connector, Preferences } from "./playlist";

export type User = {
  username: string;
  email: string;
  preferences: Preferences;
  connectors: {
    spotify: Connector,
    amazon: Connector,
    apple: Connector
  }
};

export type Account = {
  username: string;
  email: string;
  id: string;
};