import React, { createContext, useCallback, useMemo } from 'react';
import { createNextClient } from '../clients/next';
import { Playlist } from '../types/playlist';

type ConnectorValue = {
  deleteEvent: (playlist: Playlist, index: number) => void;
  getHistory: (playlistId: string) => void;
};

const ConnectorContext = createContext({} as ConnectorValue);

const ConnectorProvider = (props) => {
  const client = createNextClient();

  const getHistory = useCallback(
    async (playlistId: string) => {
      await client.get('history', {
        playlistId: playlistId,
      });
    },
    [client]
  );

  const deleteEvent = useCallback(
    async (playlist: Playlist, index: number) => {
      await client.delete('event', {
        playlistId: playlist.id,
        index: index,
      });
    },
    [client]
  );

  const value = useMemo(
    () => ({
      deleteEvent,
      getHistory,
    }),
    [deleteEvent, getHistory]
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
    throw new Error('useConnector must be used within a ConnectorProvider');
  }
  return context;
};

export { ConnectorProvider, useConnector };
