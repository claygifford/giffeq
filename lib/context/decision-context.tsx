import React, { createContext, useCallback, useMemo, useState } from "react";
import { createNextClient } from "../clients/next";
import { Action } from "../types/action";
import { Query, EmptyQuery } from "../types/query";
import { DecisionData } from "../types/song";
import { Playlist } from "../types/playlist";

type DecisionValue = {
  deleteDecision: (playlist: Playlist, index: number) => void;
  getDecisions: (playlistId: string) => void;
  getDecisionsAction: Action;
  decisions: Query<DecisionData>;
};

const DecisionContext = createContext({} as DecisionValue);

const DecisionProvider = (props) => {
  const client = createNextClient();
  const [decisions, setDecisions] = useState<Query<DecisionData>>(EmptyQuery);
  const [getDecisionsAction, setGetDecisionsAction] = useState<Action>({
    isBusy: false,
  });

  const getDecisions = useCallback(
    async (playlistId: string) => {
      if (getDecisionsAction.isBusy) return;
      try {
        setGetDecisionsAction({
          isBusy: true,
          errorMessage: undefined,
        });
        const result = await client.get<Query<DecisionData>>(
          "decisions/query",
          {
            playlistId: playlistId,
            start: 0,
            count: 50,
          },
        );
        setDecisions(result);
        setGetDecisionsAction({
          isBusy: false,
          errorMessage: undefined,
        });
      } catch (error) {
        const item = await error.json();
        setGetDecisionsAction({
          isBusy: false,
          errorMessage: item.message,
        });
      }
    },
    [client, getDecisionsAction.isBusy],
  );

  const deleteDecision = useCallback(
    async (playlist: Playlist, index: number) => {
      decisions.items.splice(index, 1);
      setDecisions({
        ...decisions,
      });

      await client.delete("decisions/decision", {
        playlistId: playlist.id,
        index: index,
      });
    },
    [client, decisions],
  );

  const value = useMemo(
    () => ({
      deleteDecision,
      getDecisions,
      getDecisionsAction,
      decisions,
    }),
    [deleteDecision, getDecisions, getDecisionsAction, decisions],
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
