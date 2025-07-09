import React, {
  createContext,
  Dispatch,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from "react";
import { Song } from "../types/song";
import { createNextClient } from "../clients/next";
import { tokenIsFresh } from "../clients/spotify";
import { Connector } from "../types/playlist";

type MusicValue = {
  currentTrack: Spotify.Track;
  currentSong: Song;
  autoPlay: Song;
  setAutoPlay: Dispatch<Song>;
  playSong: (song: any, playlistId?: string, autoPlay?: boolean) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  clearSong: () => void;
  likeSong: (playlistId: string) => void;
  dislikeSong: (playlistId: string) => void;
  setConnector: React.Dispatch<Connector>;
  spotifyToken: string;
  volume: number;
  changeVolume: (volume: number) => void;
  progress: number;
  isPlaying: boolean;
};

const MusicContext = createContext({} as MusicValue);

const MusicProvider = (props) => {
  const client = createNextClient();

  const [currentSong, setCurrentSong] = useState<any>(null);

  const [autoPlay, setAutoPlay] = useState<Song>(null);
  const [deviceId, setDeviceId] = useState<string>(undefined);
  const [volume, setVolume] = useState<number>(1);
  const [spotifyToken, setSpotifyToken] = useState<string>("");
  const [connector, setConnector] = useState<Connector>(undefined);
  const [currentTrack, setCurrentTrack] = useState<Spotify.Track>(null);
  const [progress, setProgress] = useState<number>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!connector) return;
    const createSpotifyDevice = async () => {
      let access_token;
      if (!tokenIsFresh(connector)) {
        const { refresh_token } = connector;
        const spotify = await client.get<Connector>("spotify/refresh_token", {
          refresh_token,
        });
        access_token = connector.access_token;
        setConnector(spotify);
      } else {
        access_token = connector.access_token;
      }
      setSpotifyToken(access_token);
    };

    createSpotifyDevice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connector, setSpotifyToken, setConnector]);

  const playSong = useCallback(
    async (song: any, playlistId, autoPlay = false) => {
      if (song && deviceId) {
        setCurrentSong(song);
        await client.put(
          "spotify/play",
          { uris: [song.uri] },
          { device_id: deviceId },
        );
        await client.put("history/addSong", { song }, { playlistId });
        if (autoPlay) {
          setAutoPlay(song);
        }
      }
    },
    [client, deviceId],
  );

  const resumeSong = useCallback(async () => {
    if (currentTrack) {
      //if (item.type === 'track' && deviceId) {
      //  setCurrentSong(item);
      await client.put(
        "spotify/play",
        {
          uris: [currentTrack.uri],
          //offset: {
          //  position: track.item.,
          //},
          position_ms: progress,
        },
        { device_id: deviceId },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, deviceId]);

  // const playNextSong = useCallback(
  //   async (id?: string) => {
  //     try {
  //       let playlistId = id ?? currentPlaylistId;
  //       if (!playlistId) return;
  //       setCurrentPlaylistId(playlistId);
  //       const song = await client.get<Song>('next-song', { playlistId });
  //       if (song) {
  //         playSong(song, true);
  //       }
  //     } catch (error) {
  //       let item = {};
  //       if (error instanceof Response) {
  //         item = { response: error };
  //       } else {
  //         item = { error: error };
  //       }
  //       dialog.showDialog({ dialog: ErrorDialog(item) });
  //     }
  //   },
  //   [client, currentPlaylistId, dialog, playSong]
  // );

  const pauseSong = useCallback(async () => {
    await client.put("spotify/pause", {}, { device_id: deviceId });
  }, [client, deviceId]);

  const clearSong = useCallback(() => {
    setCurrentSong(null);
  }, []);

  const likeSong = useCallback(
    async (playlistId) => {
      if (currentSong) {
        await client.put(
          "decisions/addSong",
          { song: currentSong, like: 1 },
          { playlistId },
        );
      }
    },
    [client, currentSong],
  );

  const dislikeSong = useCallback(
    async (playlistId) => {
      if (currentSong) {
        await client.put(
          "decisions/addSong",
          { song: currentSong, like: 0 },
          { playlistId },
        );
      }
    },
    [client, currentSong],
  );

  const [isReady, setIsReady] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);

  const accountError = () => {
    console.log("accountError");
  };

  const playerRef = React.useRef<Spotify.Player | null>(null);

  const getVolume = useCallback(async () => {
    if (playerRef.current) {
      const currentVolume = await playerRef.current.getVolume();
      setVolume(currentVolume);
    }
  }, [setVolume]);

  const changeVolume = useCallback(async (currentVolume: number) => {
    if (playerRef.current) {
      await playerRef.current.setVolume(currentVolume);
      setVolume(currentVolume);
    }
  }, []);

  const ready = useCallback(
    (cb: Spotify.WebPlaybackInstance) => {
      console.log(`ready --> ${cb.device_id}`);

      getVolume();
      setDeviceId(cb.device_id);
    },
    [getVolume],
  );

  const notReady = (cb: Spotify.WebPlaybackInstance) => {
    console.log(`notReady --> ${cb.device_id}`);
  };

  const progressChanged = ({ position }: { position: number }) => {
    setProgress(position);
  };

  const playerStateChanged = (cb: Spotify.PlaybackState) => {
    if (cb && cb.track_window && cb.track_window.current_track) {
      const {
        loading,
        paused,
        track_window: { current_track },
      } = cb;
      setCurrentTrack(current_track);
      setIsPlaying(!loading && !paused);
    }
  };

  const initializationError = () => {
    console.log("initializationError");
  };

  const authenticationError = () => {
    console.log("authenticationError");
  };
  const playbackError = () => {
    console.log("playbackError");
  };

  useEffect(() => {
    if (!isReady || isConnecting) return;
    setIsConnecting(true);
    playerRef.current.addListener("ready", ready);
    playerRef.current.addListener("not_ready", notReady);
    playerRef.current.addListener("account_error", accountError);
    playerRef.current.addListener("initialization_error", initializationError);
    playerRef.current.addListener("authentication_error", authenticationError);
    playerRef.current.addListener("playback_error", playbackError);
    console.log("did I add the listener too many times?");
    playerRef.current.addListener("player_state_changed", playerStateChanged);
    playerRef.current.addListener("progress" as any, progressChanged as any);
    playerRef.current.connect();
  }, [isReady, ready, isConnecting]);

  useEffect(() => {
    if (!spotifyToken || isReady) return;
    if (window.Spotify) {
      playerRef.current = new Spotify.Player({
        name: "Giff Eq",
        getOAuthToken: async (cb) => {
          const token = spotifyToken;
          cb(token);
        },
      });
      setIsReady(true);
      return;
    }

    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      playerRef.current = new Spotify.Player({
        name: "Giff Eq",
        getOAuthToken: async (cb) => {
          const token = spotifyToken;
          cb(token);
        },
      });

      setIsReady(true);
    };

    if (!window.Spotify) {
      const scriptTag = document.createElement("script");
      scriptTag.src = "https://sdk.scdn.co/spotify-player.js";

      document.head!.appendChild(scriptTag);
    }
  }, [spotifyToken, isReady, setIsReady]);

  const value = useMemo(
    () => ({
      currentSong,
      currentTrack,
      playSong,
      pauseSong,
      resumeSong,
      autoPlay,
      setAutoPlay,
      clearSong,
      likeSong,
      dislikeSong,
      setConnector,
      spotifyToken,
      volume,
      changeVolume,
      progress,
      isPlaying,
    }),
    [
      currentSong,
      currentTrack,
      playSong,
      pauseSong,
      resumeSong,
      autoPlay,
      setAutoPlay,
      clearSong,
      likeSong,
      dislikeSong,
      setConnector,
      spotifyToken,
      volume,
      changeVolume,
      progress,
      isPlaying,
    ],
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
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};

export { MusicProvider, useMusic };
