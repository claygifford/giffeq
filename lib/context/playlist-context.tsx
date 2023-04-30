import React, { createContext, useCallback, useState } from 'react';
import { MainMode, PageMode, useLayout } from './layout-context';

export type Playlist = {
  name: string;
  id: string;
  history: any[];
  searches: string[];
};

type PlaylistValue = {
  playlist: Playlist;
  selectPlaylist: (list?: Playlist) => void;
  saveSearch: (search: string) => void;
  songPlayed: (song: any) => void;
};

const PlaylistContext = createContext({} as PlaylistValue);

const PlaylistProvider = (props) => {
  const [playlist, setPlaylist] = useState<Playlist>(null);
  const { changePageMode } = useLayout();

    const saveSearch = useCallback(
      (search: string) => {
        if (search && playlist) {
          if (!playlist.searches) {
            playlist.searches = [search];            
          } else {
            playlist.searches.push(search);
          }
        }
      },
      [playlist]
    );

    const songPlayed = useCallback(
      (song: any) => {
        if (song && playlist && !song.recorded) {
          song.recorded = true;
          if (!playlist.history) {
            playlist.history = [song];
          } else {
            playlist.history.push(song);
          }
        }
      },
      [playlist]
    );

  const selectPlaylist = useCallback(
    (list?: Playlist) => {
      if (list) {
        setPlaylist(list);
        changePageMode(PageMode.Listening);
      } else {
        setPlaylist(null);
        changePageMode(PageMode.Playlist);
      }
    },
    [changePageMode]
  );

  const value = {
    playlist,
    selectPlaylist,
    saveSearch,
    songPlayed,
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
