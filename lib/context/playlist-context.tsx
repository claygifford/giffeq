import React, { createContext, useCallback, useEffect, useState } from 'react';
import { MainMode, PageMode, useLayout } from './layout-context';
import { Router, useRouter } from 'next/router';
import { createNextClient } from '../clients/next';
import { useDialog } from './dialog-context';
import ErrorDialog from '../ui/dialog/error-dialog';
import { useAuth } from './auth-context';
import { Action } from '../types/action';
import { useEffectOnce } from '../hooks/use-effect-once';
import { Recordable, Song } from '../types/song';
import { keys, pick } from 'lodash';

export type Playlist = {
  name: string;
  id: string;
  history: any[];
  searches: string[];
};

type PlaylistValue = {
  playlist: Playlist;
  selectNewPlaylist: () => void;
  selectPlaylist: (list?: Playlist) => void;
  saveSearch: (search: string) => void;
  songPlayed: (song: any) => void;
  getPlaylists: () => Promise<void>;
  playlists: Playlist[];
  createPlaylist: ({ name }: { name: string }) => void;
  createPlaylistAction: Action;
  deletePlaylist: () => void;
  deletePlaylistAction: Action;
};

const PlaylistContext = createContext({} as PlaylistValue);

const PlaylistProvider = (props) => {
  const dialog = useDialog();
  const { user } = useAuth();
  const { changePageMode } = useLayout();

  const [playlist, setPlaylist] = useState<Playlist>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>(null);
  const [getPlaylistAction, setGetPlaylistAction] = useState<Action>({
    isBusy: false,
  });

  const [createPlaylistAction, setCreatePlaylistAction] = useState<Action>({
    isBusy: false,
  });

  const [deletePlaylistAction, setDeletePlaylistAction] = useState<Action>({
    isBusy: false,
  });

  const client = createNextClient();

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
    (song: Song & Recordable) => {
      if (song && playlist && !song.recorded) {
        song.recorded = true;
        if (!playlist.history) {
          playlist.history = [song];
        } else {
          playlist.history.push(song);
        }

        client.post<void>('play', {
          playlistId: playlist.id,
          song: pick(song, ['name', 'preview_url', 'artists']),
        });
      }
    },
    [playlist, client]
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

  const selectNewPlaylist = useCallback(() => {
    changePageMode(PageMode.NewPlaylist);
  }, [changePageMode]);

  // useEffect(() => {
  //   const onHashChangeStart = (url) => {
  //     if (!url) return;
  //     const [, item] = url.split('#');
  //     const [mode] = item ? item.split('/') : '';
  //     switch (mode) {
  //       case 'newplaylist': {
  //         changePageMode(PageMode.NewPlaylist);
  //         return;
  //       }
  //       case 'playlist': {
  //         changePageMode(PageMode.Listening);
  //         return;
  //       }
  //       default: {
  //         changePageMode(PageMode.Playlist);
  //         return;
  //       }
  //     }
  //   };

  //   router.events.on('hashChangeStart', onHashChangeStart);

  //   return () => {
  //     router.events.off('hashChangeStart', onHashChangeStart);
  //   };
  // }, [changePageMode, router.events]);

  const createPlaylist = useCallback(
    async ({ name }: {name: string}) => {
      if (createPlaylistAction.isBusy) return;

      try {
        setCreatePlaylistAction({
          isBusy: true,
          errorMessage: undefined,
        });

        const item = await client.post<Playlist>('playlist', {
          name,
        });
        setCreatePlaylistAction({
          isBusy: false,
          errorMessage: undefined,
        });

        selectPlaylist(item);
      } catch (error) {
        let item = {};
        if (error instanceof Response) {
          item = { response: error };
        } else {
          item = { error: error };
        }
        setCreatePlaylistAction({
          isBusy: false,
          errorMessage: error.message,
        });
        dialog.showDialog({ dialog: ErrorDialog(item) });
      }
    },
    [client, dialog, selectPlaylist, createPlaylistAction.isBusy]
  );

  const deletePlaylist = useCallback(async () => {
    if (deletePlaylistAction.isBusy || !playlist) return;

    try {
      setDeletePlaylistAction({
        isBusy: true,
        errorMessage: undefined,
      });

      console.log(`yo::>${playlist.id}`);

      await client.delete('playlist', {
        name: 'playlistId', value: playlist.id,
      });

      setPlaylist(null);
      changePageMode(PageMode.Playlist);

      setDeletePlaylistAction({
        isBusy: false,
        errorMessage: undefined,
      });

      // navigate to playlists
    } catch (error) {
      let item = {};
      if (error instanceof Response) {
        item = { response: error };
      } else {
        item = { error: error };
      }
      setDeletePlaylistAction({
        isBusy: false,
        errorMessage: error.message,
      });
      dialog.showDialog({ dialog: ErrorDialog(item) });
    }
  }, [client, dialog, changePageMode, playlist, deletePlaylistAction.isBusy]);

  const getPlaylists = useCallback(async () => {
    if (getPlaylistAction.isBusy) return;

    try {
      setGetPlaylistAction({
        isBusy: true,
        errorMessage: undefined,
      });
      const items = await client.get<Playlist[]>('playlists');
      setPlaylists(items);
      setGetPlaylistAction({
        isBusy: false,
        errorMessage: undefined,
      });
    } catch (error) {
      let item = {};
      if (error instanceof Response) {
        item = { response: error };
      } else {
        item = { error: error };
      }
      setGetPlaylistAction({
        isBusy: false,
        errorMessage: error.message,
      });
      dialog.showDialog({ dialog: ErrorDialog(item) });
    }
  }, [client, dialog, getPlaylistAction.isBusy]);

  useEffectOnce(() => {
    if (user) getPlaylists();
  });

  const value = {
    playlist,
    selectNewPlaylist,
    selectPlaylist,
    saveSearch,
    songPlayed,
    getPlaylists,
    playlists,
    createPlaylist,
    createPlaylistAction,
    deletePlaylist,
    deletePlaylistAction,
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
