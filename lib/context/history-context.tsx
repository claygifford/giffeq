import React, { createContext, useCallback, useMemo, useState } from "react";
import { createNextClient } from "../clients/next";
import { Playlist } from "../types/playlist";
import { HistoryData } from "../types/song";
import { Action } from "../types/action";
import { EmptyQuery, Query } from "../types/query";

type HistoryValue = {
  deleteEvent: (playlist: Playlist, index: number) => void;
  getHistory: (playlistId: string) => void;
  getHistoryAction: Action;
  history: Query<HistoryData>;
};

const HistoryContext = createContext({} as HistoryValue);

const HistoryProvider = (props) => {
  const client = createNextClient();
  const [history, setHistory] = useState<Query<HistoryData>>(EmptyQuery);
  const [getHistoryAction, setGetHistoryAction] = useState<Action>({
    isBusy: false,
  });

  const getHistory = useCallback(
    async (playlistId: string) => {
      if (getHistoryAction.isBusy) return;
      try {
        setGetHistoryAction({
          isBusy: true,
          errorMessage: undefined,
        });
        const result = await client.get<Query<HistoryData>>("history/query", {
          playlistId: playlistId,
          start: 0,
          count: 50,
        });
        setHistory(result);
        setGetHistoryAction({
          isBusy: false,
          errorMessage: undefined,
        });
      } catch (error) {
        const item = await error.json();
        setGetHistoryAction({
          isBusy: false,
          errorMessage: item.message,
        });
      }
    },
    [client, getHistoryAction.isBusy],
  );

  const deleteEvent = useCallback(
    async (playlist: Playlist, index: number) => {
      history.items.splice(index, 1);
      setHistory({
        ...history,
      });

      await client.delete("history/event", {
        playlistId: playlist.id,
        index: index,
      });
    },
    [client, history],
  );

  const value = useMemo(
    () => ({
      deleteEvent,
      getHistory,
      getHistoryAction,
      history,
    }),
    [deleteEvent, getHistory, getHistoryAction, history],
  );

  return (
    <HistoryContext.Provider value={value}>
      {props.children}
    </HistoryContext.Provider>
  );
};

const useHistory = () => {
  const context = React.useContext(HistoryContext);
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
};

export { HistoryProvider, useHistory };
