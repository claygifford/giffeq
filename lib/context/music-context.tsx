import React, {
  createContext,
  Dispatch,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useEffectOnce } from '../hooks/use-effect-once';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useDialog } from './dialog-context';
import ErrorDialog from '../ui/dialog/error-dialog';

type MusicValue = {
  playMusic: () => void;
  playSpotifyMusic: () => void;
  setAmazonAccessToken: Dispatch<any>;
  setSpotifyAccessToken: Dispatch<any>;
  searchMusic: (search: string) => void;
  currentSong: any;
  currentResults: any;
  clearResults: () => void;
  selectItem: (item: any) => void;
  spotifyConnectorStatus: string;
};

const MusicContext = createContext({} as MusicValue);

const Env = {
  CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID,
};

const MusicProvider = (props) => {
  const router = useRouter();
  const dialog = useDialog();

  const {
    query: { spotify_activated },
  } = useRouter();

  const [amazonAccessToken, setAmazonAccessToken] = useState<any>(null);
  const [spotifyAccessToken, setSpotifyAccessToken] = useState<any>(null);
  const [spotifyRefreshToken, setSpotifyRefreshToken] = useState<any>(null);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [currentResults, setCurrentResults] = useState<any>(null);
  const [spotifyConnectorStatus, setSpotifyConnectorStatus] =
    useState<any>(null);

  const playMusic = useCallback(async () => {
    try {
      // play music
      console.log(
        `old school way token: ${amazonAccessToken} client: ${Env.CLIENT_ID}`
      );
      const results = await fetch('https://music-api.amazon.com/', {
        method: 'get',
        headers: new Headers({
          'x-api-key': Env.CLIENT_ID,
          Authorization: amazonAccessToken,
        }),
      });
      console.log(`old school way -- play music: ${JSON.stringify(results)}`);
    } catch (error) {
      console.log('error playing music old school way', error);
    }

    try {
      // play music
      console.log(
        `new school way token: ${amazonAccessToken} client: ${Env.CLIENT_ID}`
      );
      const results = await fetch(
        'https://api.music.amazon.dev/v1/albums/?ids=B0064UPU4G,B091BHTFTZ,B0869N1S7F',
        {
          method: 'get',
          headers: new Headers({
            'x-api-key': Env.CLIENT_ID,
            Authorization: amazonAccessToken,
          }),
        }
      );
      console.log(`new school way -- play music: ${JSON.stringify(results)}`);
    } catch (error) {
      console.log('error playing music new school way', error);
    }
  }, [amazonAccessToken]);

  const playSpotifyMusic = useCallback(async () => {
    try {
      // play music
      console.log(`about to play spotify music!`);

      //
      const results1 = await fetch(
        'https://api.spotify.com/v1/me/player/play',
        {
          method: 'put',
          headers: new Headers({
            Authorization: 'Bearer ' + spotifyAccessToken,
            'Content-Type': 'application/json',
          }),
        }
      );
      console.log(`old school way -- play music: ${JSON.stringify(results1)}`);

      const results2 = await fetch('https://api.spotify.com/v1/me/player', {
        method: 'get',
        headers: new Headers({
          Authorization: 'Bearer ' + spotifyAccessToken,
          'Content-Type': 'application/json',
        }),
      });
      console.log(`old school way -- play music: ${JSON.stringify(results2)}`);
    } catch (error) {
      console.log('error playing music old school way', error);
    }
  }, [spotifyAccessToken]);

  const searchMusic = useCallback(
    async (search: string) => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${search}&type=album,track,artist`,
          {
            method: 'get',
            headers: new Headers({
              Authorization: 'Bearer ' + spotifyAccessToken,
              'Content-Type': 'application/json',
            }),
          }
        );

        if (response.status !== 200) {
          dialog.showDialog({ dialog: ErrorDialog({ response }) });
          return;
        }

        const data = (await response.json()) as {
          tracks: { items: any[] };
          albums: { items: any[] };
          artists: { items: any[] };
        };

        if (data && data.tracks && data.tracks.items) {
          const all = [
            ...data.tracks.items,
            ...data.artists.items,
            ...data.albums.items,
          ];
          setCurrentResults(all);
          const [first] = data.tracks.items;
          setCurrentSong(first);
        }
      } catch (error) {
        dialog.showDialog({ dialog: ErrorDialog({ error }) });
      }
    },
    [spotifyAccessToken, dialog]
  );

  const selectItem = useCallback((item: any) => {
    if (item.type === 'track') {
      setCurrentSong(item);
    }
  }, []);

  const clearResults = useCallback(() => {
    setCurrentResults(undefined);
  }, []);

  const refreshToken = useCallback(async (refreshToken) => {
    try {
      const response = await fetch(
        `/api/spotify/refresh_token?refresh_token=${refreshToken}`,
        {
          method: 'get'
        }
      );

      if (response.status !== 200) {
        dialog.showDialog({ dialog: ErrorDialog({ response }) });
        return;
      }
      
      const tokens = (await response.json()) as { access_token: string };
      setSpotifyAccessToken(tokens.access_token);
      setSpotifyConnectorStatus('Spotify Connected');
    } catch (error) {
      dialog.showDialog({ dialog: ErrorDialog({ error }) });
    }
  }, [spotifyAccessToken, dialog]);

  const getCookies = useCallback(() => {
    if (spotify_activated) {
      const { ['spotify_activated']: removedProperty, ...rest } = router.query;
      setSpotifyConnectorStatus('Spotify Activated');
      router.replace({
        query: rest,
      });
    }
    const value = Cookies.get('spotify_tokens');
    if (value) {
      var tokens = JSON.parse(value) as { access_token; refresh_token };
      setSpotifyAccessToken(tokens.access_token);
      setSpotifyRefreshToken(tokens.refresh_token);
      setSpotifyConnectorStatus('Has Spotify Tokens');
      refreshToken(tokens.refresh_token);
      // refresh token
    }
  }, [spotify_activated, router, refreshToken]);

  useEffectOnce(getCookies);

  const value = {
    getCookies,
    playMusic,
    playSpotifyMusic,
    setAmazonAccessToken,
    setSpotifyAccessToken,
    searchMusic,
    currentSong,
    currentResults,
    clearResults,
    selectItem,
    spotifyConnectorStatus,
  } as MusicValue;

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
