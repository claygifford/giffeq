import React, { createContext, useCallback, useMemo } from "react";
import { createNextClient } from "../clients/next";
import { Playlist } from "../types/playlist";

type DecisionValue = {
  deleteEvent: (playlist: Playlist, index: number) => void;
  getHistory: (playlistId: string) => void;
};

const DecisionContext = createContext({} as DecisionValue);

const DecisionProvider = (props) => {
  const client = createNextClient();

  const getHistory = useCallback(
    async (playlistId: string) => {
      await client.get("history", {
        playlistId: playlistId,
      });
    },
    [client],
  );

  const deleteEvent = useCallback(
    async (playlist: Playlist, index: number) => {
      await client.delete("event", {
        playlistId: playlist.id,
        index: index,
      });
    },
    [client],
  );

  const value = useMemo(
    () => ({
      deleteEvent,
      getHistory,
    }),
    [deleteEvent, getHistory],
  );

  return (
    <DecisionContext.Provider value={value}>
      {props.children}
    </DecisionContext.Provider>
  );
};

const useDecision = () => {
  const context = React.useContext(DecisionContext);
  if (context === undefined) {
    throw new Error("useDecisions must be used within a DecisionProvider");
  }
  return context;
};

export { DecisionProvider, useDecision };
