import React, {
  Dispatch,
  createContext,
  useCallback,
  useState,
  useMemo,
} from "react";
import { createNextClient } from "../clients/next";
import { useDialog } from "../hooks/use-dialog";
import ErrorDialog from "../ui/dialog/error-dialog";
import { Action } from "../types/action";
import pick from "lodash/pick";
import { Playlist } from "../types/playlist";
import { Song } from "../types/song";

type PlaylistValue = {
  playlist: Playlist;
  saveSearch: (search: string) => void;
  songPlayed: (song: any) => void;
  getPlaylists: () => Promise<void>;
  getPlaylistsAction: Action;
  playlists: Playlist[];
  createPlaylist: ({ name }: { name: string }) => Promise<Playlist>;
  createPlaylistAction: Action;
  deletePlaylist: () => Promise<void>;
  deletePlaylistAction: Action;
  getPlaylistById: (id: string) => Promise<Playlist>;
  setPlaylist: Dispatch<any>;
};

const PlaylistContext = createContext({} as PlaylistValue);

const PlaylistProvider = (props) => {
  const dialog = useDialog();

  const [playlist, setPlaylist] = useState<Playlist>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>(null);
  const [getPlaylistsAction, setGetPlaylistsAction] = useState<Action>({
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
    [playlist],
  );

  const songPlayed = useCallback(
    (song: Song) => {
      if (song && playlist) {
        var item = {
          ...pick(song, ["id", "name", "preview_url", "type"]),
          artists: song.artists.map((i) => pick(i, ["id", "name"])),
        };

        client.post<void>("play", {
          playlistId: playlist.id,
          song: item,
        });
      }
    },
    [playlist, client],
  );

  const createPlaylist = useCallback(
    async ({ name }: { name: string }) => {
      if (createPlaylistAction.isBusy) return;

      try {
        setCreatePlaylistAction({
          isBusy: true,
          errorMessage: undefined,
        });

        const item = await client.post<Playlist>("playlist", {
          name,
        });
        setCreatePlaylistAction({
          isBusy: false,
          errorMessage: undefined,
        });

        return item;
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
    [createPlaylistAction.isBusy, client, dialog],
  );

  const deletePlaylist = useCallback(async () => {
    if (deletePlaylistAction.isBusy || !playlist) return;

    try {
      setDeletePlaylistAction({
        isBusy: true,
        errorMessage: undefined,
      });

      console.log(`yo::>${playlist.id}`);

      await client.delete("playlist", {
        playlistId: playlist.id,
      });

      setDeletePlaylistAction({
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
      setDeletePlaylistAction({
        isBusy: false,
        errorMessage: error.message,
      });
      dialog.showDialog({ dialog: ErrorDialog(item) });
    }
  }, [client, dialog, playlist, deletePlaylistAction.isBusy]);

  const getPlaylistById = useCallback(
    async (id) => {
      try {
        return await client.get<Playlist>("playlist", { playlistId: id });
      } catch (error) {
        let item = {};
        if (error instanceof Response) {
          item = { response: error };
        } else {
          item = { error: error };
        }
        dialog.showDialog({ dialog: ErrorDialog(item) });
      }
    },
    [client, dialog],
  );

  const getPlaylists = useCallback(async () => {
    if (getPlaylistsAction.isBusy) return;

    try {
      setGetPlaylistsAction({
        isBusy: true,
        errorMessage: undefined,
      });
      const items = await client.get<Playlist[]>("playlists");
      setPlaylists(items);
      setGetPlaylistsAction({
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
      setGetPlaylistsAction({
        isBusy: false,
        errorMessage: error.message,
      });
      dialog.showDialog({ dialog: ErrorDialog(item) });
    }
  }, [client, dialog, getPlaylistsAction.isBusy]);

  const value = useMemo(
    () => ({
      playlist,
      setPlaylist,
      saveSearch,
      songPlayed,
      getPlaylists,
      getPlaylistsAction,
      playlists,
      createPlaylist,
      createPlaylistAction,
      deletePlaylist,
      deletePlaylistAction,
      getPlaylistById,
    }),
    [
      playlist,
      setPlaylist,
      saveSearch,
      songPlayed,
      getPlaylists,
      getPlaylistsAction,
      playlists,
      createPlaylist,
      createPlaylistAction,
      deletePlaylist,
      deletePlaylistAction,
      getPlaylistById,
    ],
  );

  return (
    <PlaylistContext.Provider value={value}>
      {props.children}
    </PlaylistContext.Provider>
  );
};

const usePlaylist = () => {
  const context = React.useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error("usePlaylist must be used within a PlaylistProvider");
  }
  return context;
};

export { PlaylistProvider, usePlaylist };
