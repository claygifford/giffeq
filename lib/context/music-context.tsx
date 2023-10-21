import React, {
  createContext,
  Dispatch,
  useCallback,
  useState,
  useMemo,
} from 'react';
import { Song } from '../types/song';

type MusicValue = {
  currentSong: Song;
  autoPlay: Song;
  setAutoPlay: Dispatch<Song>;
  playSong: (song: Song, autoPlay?: boolean) => void;
  clearSong: () => void;
};

const MusicContext = createContext({} as MusicValue);

const MusicProvider = (props) => {
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [autoPlay, setAutoPlay] = useState<Song>(null);

  const playSong = useCallback((item: any, autoPlay = false) => {
    if (item.type === 'track') {
      setCurrentSong(item);
      if (autoPlay) {
        setAutoPlay(item);
      }
    }
  }, []);

  const clearSong = useCallback(() => {
    setCurrentSong(null);
  }, []);

  const value = useMemo(
    () => ({
      currentSong,
      playSong,
      autoPlay,
      setAutoPlay,
      clearSong,
    }),
    [
      currentSong,
      playSong,
      autoPlay,
      setAutoPlay,
      clearSong,
    ]
  );

  return (
    <MusicContext.Provider value={value}>
      {props.children}
    </MusicContext.Provider>
  );
};

const useMusic = () => {
  const context = React.useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export { MusicProvider, useMusic };
