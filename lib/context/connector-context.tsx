import React, { createContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./auth-context";
import { forEach } from "lodash";
import { Connector } from "../types/playlist";
import { getDateTime } from "../formats/date-time";

type ConnectorValue = {
  spotifyConnectorStatus: string;
  connectors: Plugin[];
};

export type Plugin = {
  type: string;
  status: string;
  src: string;
  link: string;
  name: string;
  message: string;
};

export const ConnectorStatus = {
  none: "none",
  disconnected: "disconnected",
  connected: "connected",
};

//type ConnectorType = ['spotify', 'apple-music', 'amazon-music'];

const Plugins = [
  {
    type: "spotify",
    status: ConnectorStatus.none,
    src: "/connectors/spotify.png",
    link: "/api/spotify/login",
    name: "Spotify",
    message: "",
  },
  {
    type: "apple",
    status: ConnectorStatus.none,
    src: "/connectors/apple-music.jpg",
    link: "/api/spotify/login",
    name: "Apple Music",
    message: "",
  },
  {
    type: "amazon",
    status: ConnectorStatus.none,
    src: "/connectors/amazon-music.png",
    link: "/api/spotify/login",
    name: "Amazon Music",
    message: "",
  },
];

const ConnectorContext = createContext({} as ConnectorValue);

const ConnectorProvider = (props) => {
  const { user } = useAuth();

  const [spotifyConnectorStatus] = useState<any>(null);

  const [connectors, setConnectors] = useState<any[]>([]);
  useEffect(() => {
    if (user) {
      if (user.connectors) {
        forEach(Plugins, (p) => {
          let connector = user.connectors[p.type] as Connector;
          if (connector) {
            p.message = `Last update ${getDateTime(connector.refresh_date)}`;

            p.status = "connected";
          }
        });
      }
      setConnectors(Plugins);
    }
  }, [user]);

  const value = useMemo(
    () => ({
      spotifyConnectorStatus,
      connectors,
    }),
    [spotifyConnectorStatus, connectors],
  );

  return (
    <ConnectorContext.Provider value={value}>
      {props.children}
    </ConnectorContext.Provider>
  );
};

const useConnector = () => {
  const context = React.useContext(ConnectorContext);
  if (context === undefined) {
    throw new Error("useConnector must be used within a ConnectorProvider");
  }
  return context;
};

export { ConnectorProvider, useConnector };
