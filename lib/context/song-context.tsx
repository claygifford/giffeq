import React, { createContext, useCallback, useMemo, useState } from 'react';
import { createNextClient } from '../clients/next';
import { Song } from '../types/song';
import { useDialog } from '../hooks/use-dialog';
import ErrorDialog from '../ui/dialog/error-dialog';
import { useMusic } from './music-context';

type SongValue = { playNextSong: (id?: string) => void };

const SongContext = createContext({} as SongValue);

const SongProvider = (props) => {
  const { playSong } = useMusic();
  const client = createNextClient();
  const dialog = useDialog();
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string>(null);

  const playNextSong = useCallback(async (id?: string) => {
    try {
      let playlistId = id ?? currentPlaylistId;
      if (!playlistId) return;
      setCurrentPlaylistId(playlistId);
      const song = await client.get<Song>('next-song', { playlistId });
      if (song) {
        playSong(song, true);
      }
    } catch (error) {
      let item = {};
      if (error instanceof Response) {
        item = { response: error };
      } else {
        item = { error: error };
      }
      dialog.showDialog({ dialog: ErrorDialog(item) });
    }
  }, [client, currentPlaylistId, dialog, playSong]);

  const value = useMemo(() => ({ playNextSong }), [playNextSong]);

  return (
    <SongContext.Provider value={value}>{props.children}</SongContext.Provider>
  );
};

const useSong = () => {
  const context = React.useContext(SongContext);
  if (context === undefined) {
    throw new Error('useSong must be used within a SongProvider');
  }
  return context;
};

export { SongProvider, useSong };
