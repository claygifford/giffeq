import React, { createContext, useCallback, useState } from 'react';
import { MainMode, PageMode, useLayout } from './layout-context';

type PlaylistValue = {
  playlist: any;
  selectPlaylist: (list) => void;
};

const PlaylistContext = createContext({} as PlaylistValue);

const PlaylistProvider = (props) => {
  const [playlist, setPlaylist] = useState<any>(null);
  const { changePageMode } = useLayout();

  const selectPlaylist = useCallback(
    (list) => {
      setPlaylist(list);
      changePageMode(PageMode.Listening);
    },
    [changePageMode]
  );

  const value = {
    playlist,
    selectPlaylist,
  } as PlaylistValue;

  return (
    <PlaylistContext.Provider value={value}>
      {props.children}
    </PlaylistContext.Provider>
  );
};

const usePlaylist = () => {
  const context = React.useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};

export { PlaylistProvider, usePlaylist };
