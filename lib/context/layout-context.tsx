import { useRouter } from "next/router";
import { usePlaylist } from "./playlist-context";
import React, { createContext, useCallback, useMemo, useState } from "react";
import { Playlist } from "../types/playlist";
import { useMusic } from "./music-context";
import { useHistory } from "./history-context";
import { getColor } from "../ui/colors/colors";
import { useDecision } from "./decision-context";

export const PanelMode = {
  Collapsed: 1,
  Expanded: 2,
} as const;
type PanelModeType = (typeof PanelMode)[keyof typeof PanelMode];

export const MainMode = {
  Song: 1,
  Search: 2,
  Decisions: 3,
  History: 4,
  Settings: 5,
} as const;
type MainModeType = (typeof MainMode)[keyof typeof MainMode];

export const PageMode = {
  Playlist: 1,
  Listening: 2,
  NewPlaylist: 3,
} as const;
type PageModeType = (typeof PageMode)[keyof typeof PageMode];

type LayoutValue = {
  connectorPane: number;
  changeConnectorPane: (pane: PanelModeType) => void;
  sideBarPane: number;
  changeSideBarPane: (pane: PanelModeType) => void;
  themesPane: number;
  changeThemesPane: (pane: PanelModeType) => void;
  mainPane: number;
  showMainPane: (pane: MainModeType) => void;
  pageMode: number;
  changePageMode: (mode: PageModeType, list?: Playlist) => void;
  initializeLayout: () => void;
  colors: string[];
};

const LayoutContext = createContext({} as LayoutValue);

const LayoutProvider = (props) => {
  const router = useRouter();
  const { asPath } = useRouter();
  const { playlist, setPlaylist, getPlaylistById, getPlaylists } =
    usePlaylist();
  const { clearSong } = useMusic();
  const { getHistory } = useHistory();
  const { getDecisions } = useDecision();

  const [connectorPane, setConnectorPane] = useState<PanelModeType>(
    PanelMode.Collapsed,
  );
  const [sideBarPane, setSideBarPane] = useState<PanelModeType>(
    PanelMode.Collapsed,
  );
  const [themesPane, setThemesPane] = useState<PanelModeType>(
    PanelMode.Collapsed,
  );
  const [mainPane, setMainPane] = useState<MainModeType>(MainMode.Search);
  const [pageMode, setPageMode] = useState<PageModeType>(PageMode.Playlist);
  const [colors] = useState<string[]>([
    getColor(),
    getColor(),
    getColor(),
    getColor(),
  ]);

  const changeConnectorPane = useCallback((pane: PanelModeType) => {
    setConnectorPane(pane);
  }, []);

  const changeSideBarPane = useCallback((pane: PanelModeType) => {
    setSideBarPane(pane);
  }, []);

  const changeThemesPane = useCallback((pane: PanelModeType) => {
    setThemesPane(pane);
  }, []);

  const showMainPane = useCallback(
    (pane: MainModeType) => {
      switch (pane) {
        case MainMode.History: {
          if (!playlist) return;
          getHistory(playlist.id);
          break;
        }
        case MainMode.Decisions: {
          if (!playlist) return;
          getDecisions(playlist.id);
          break;
        }
      }
      setMainPane(pane);
    },
    [getHistory, getDecisions, playlist],
  );

  const changePageMode = useCallback(
    (pane: PageModeType, list?: Playlist) => {
      console.log("about to changePageMode");
      switch (pane) {
        case PageMode.Listening:
          if (!list) return;
          setPlaylist(list);
          //playNextSong(list.id);
          getHistory(list.id);
          router.push(`/#listening/${list.id}`, undefined, { shallow: true });
          break;
        case PageMode.NewPlaylist:
          router.push("/#newplaylist", undefined, { shallow: true });
          break;
        case PageMode.Playlist: {
          clearSong();
          setPlaylist(null);
          getPlaylists();
          router.push("/", undefined, { shallow: true });
          break;
        }
      }

      setPageMode(pane);
    },
    [setPlaylist, getHistory, router, clearSong, getPlaylists],
  );

  const initializeLayout = useCallback(async () => {
    let [, path] = asPath.split("#");
    path = path ?? asPath;
    if (path) {
      const [firstPath, rest] = path.split("/");
      const mode =
        PageMode[
          Object.keys(PageMode).find(
            (key) => key.toLowerCase() === firstPath.toLowerCase(),
          )
        ];
      if (rest === "about") return;

      if (mode) {
        switch (mode) {
          case PageMode.Listening: {
            if (rest) {
              const playlist = await getPlaylistById(rest);
              changePageMode(PageMode.Listening, playlist);
            }
            return;
          }
          case PageMode.NewPlaylist: {
            changePageMode(PageMode.NewPlaylist);
            return;
          }
          case PageMode.Playlist:
          default: {
            changePageMode(PageMode.Playlist);
            return;
          }
        }
      }
    }

    changePageMode(PageMode.Playlist);
  }, [asPath, changePageMode, getPlaylistById]);

  const value = useMemo(
    () => ({
      connectorPane,
      changeConnectorPane,
      sideBarPane,
      changeSideBarPane,
      themesPane,
      changeThemesPane,
      mainPane,
      showMainPane,
      pageMode,
      changePageMode,
      initializeLayout,
      colors,
    }),
    [
      connectorPane,
      changeConnectorPane,
      sideBarPane,
      changeSideBarPane,
      themesPane,
      changeThemesPane,
      mainPane,
      showMainPane,
      pageMode,
      changePageMode,
      initializeLayout,
      colors,
    ],
  );

  return (
    <LayoutContext.Provider value={value}>
      {props.children}
    </LayoutContext.Provider>
  );
};

const useLayout = () => {
  const context = React.useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};

export { LayoutProvider, useLayout };
