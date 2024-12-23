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
import { createApiClient } from "../clients/api";

type MusicValue = {
  testing: any;
  currentTrack: Spotify.Track;
  currentSong: Song;
  autoPlay: Song;
  setAutoPlay: Dispatch<Song>;
  playSong: (song: Song, autoPlay?: boolean) => void;
  clearSong: () => void;
  setConnector: React.Dispatch<Connector>;
  spotifyToken: string;
};

const MusicContext = createContext({} as MusicValue);

const MusicProvider = (props) => {
  const client = createNextClient();

  const [testing, setTesting] = useState<any>(null);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [autoPlay, setAutoPlay] = useState<Song>(null);
  const [deviceId, setDeviceId] = useState<string>(undefined);
  const [spotifyToken, setSpotifyToken] = useState<string>("");
  const [connector, setConnector] = useState<Connector>(undefined);

  const [currentTrack, setCurrentTrack] = useState<Spotify.Track>(null);

  useEffect(() => {
    if (!connector) return;
    const createSpotifyDevice = async () => {
      const spotify = connector;
      let access_token;
      if (!tokenIsFresh(spotify)) {
        const connector = await client.get<Connector>("spotify/refresh_token", {
          refresh_token: spotify.refresh_token,
        });
        access_token = connector.access_token;
      } else {
        access_token = connector.access_token;
      }

      setSpotifyToken(access_token);
    };

    createSpotifyDevice();
  }, [client, connector]);

  const playSong = useCallback(
    async (item: any, autoPlay = false) => {
      console.log("asd!!!");
      if (item.type === "track" && deviceId) {
        setCurrentSong(item);
        await client.put(
          "spotify/play",
          { uris: [item.uri] },
          { device_id: deviceId },
        );

        // const apiClient = createApiClient();

        // await apiClient.put(
        //   'https://api.spotify.com/v1/me/player/play?device_id=' + deviceId,
        //   {
        //     Authorization: `Bearer ${spotifyToken}`,
        //     'Content-Type': 'application/json',
        //   },
        //   { uris: [item.uri] }
        //   // new URLSearchParams({
        //   //   code: code as string,
        //   //   grant_type: 'authorization_code',
        //   //   redirect_uri: Env.REDIRECT_URI,
        //   // })
        // );

        console.log("going to play song now.");
        if (autoPlay) {
          setAutoPlay(item);
        }
      }
    },
    [client, deviceId],
  );

  const clearSong = useCallback(() => {
    setCurrentSong(null);
  }, []);

  const value = useMemo(
    () => ({
      testing,
      currentSong,
      currentTrack,
      playSong,
      autoPlay,
      setAutoPlay,
      clearSong,
      setConnector,
      spotifyToken,
    }),
    [
      testing,
      currentSong,
      currentTrack,
      playSong,
      autoPlay,
      setAutoPlay,
      clearSong,
      setConnector,
      spotifyToken,
    ],
  );

  const [isReady, setIsReady] = React.useState(false);

  const accountError = () => {
    console.log("accountError");
  };

  const ready = (cb: Spotify.WebPlaybackInstance) => {
    console.log(`ready --> ${cb.device_id}`);
    setDeviceId(cb.device_id);
  };

  const notReady = (cb: Spotify.WebPlaybackInstance) => {
    console.log(`notReady --> ${cb.device_id}`);
  };

  const playerStateChanged = (cb: Spotify.PlaybackState) => {
    // current track
    if (cb && cb.track_window && cb.track_window.current_track) {
      console.log(
        `playerStateChanged --> ${cb.track_window.current_track.name}`,
      );
      setCurrentTrack(cb.track_window.current_track);
      //playerRef.current.getCurrentState;
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
    if (!isReady) return;

    playerRef.current.addListener("ready", ready);
    playerRef.current.addListener("not_ready", notReady);
    playerRef.current.addListener("account_error", accountError);
    playerRef.current.addListener("initialization_error", initializationError);
    playerRef.current.addListener("authentication_error", authenticationError);
    playerRef.current.addListener("playback_error", playbackError);
    playerRef.current.addListener("player_state_changed", playerStateChanged);

    async function connect() {
      // You can await here
      console.log("almost got here?");
      await playerRef.current.connect();
      setTesting(playerRef.current);
      //playerRef.current.togglePlay();
      console.log(`done`);
      // ...
    }

    connect();
  }, [isReady]);
  const playerRef = React.useRef<Spotify.Player | null>(null);

  useEffect(() => {
    console.log("yess---->asdasd");
    if (!spotifyToken || isReady) return;
    console.log("asdasd");
    if (window.Spotify) {
      console.log("asdasd --- unbelieveable");
      playerRef.current = new Spotify.Player({
        name: "Giff Eq",
        getOAuthToken: async (cb) => {
          const token = spotifyToken;
          cb(token);
        },
      });
      console.log("yess---->asdasd setIsReady");
      setIsReady(true);
      return;
    }

    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      console.log("asdasdasd --- wosers!");
      playerRef.current = new Spotify.Player({
        name: "Giff Eq",
        getOAuthToken: async (cb) => {
          const token = spotifyToken;
          cb(token);
        },
      });

      console.log("yessasddd---->asdasd setIsReady");

      setIsReady(true);
    };

    if (!window.Spotify) {
      const scriptTag = document.createElement("script");
      scriptTag.src = "https://sdk.scdn.co/spotify-player.js";

      document.head!.appendChild(scriptTag);
    }
  }, [spotifyToken, isReady]);

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
