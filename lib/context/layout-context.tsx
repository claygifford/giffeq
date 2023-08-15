import { useRouter } from 'next/router';
import { Playlist, usePlaylist } from './playlist-context';
import React, {
  createContext,
  useCallback,
  useMemo,
  useState,
} from 'react';

export const PanelMode = {
  Collapsed: 1,
  Expanded: 2,
} as const;
type PanelModeType = (typeof PanelMode)[keyof typeof PanelMode];

export const MainMode = {
  Search: 1,
  NextSong: 2,
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
  mainPane: number;
  showMainPane: (pane: MainModeType) => void;
  pageMode: number;
  changePageMode: (mode: PageModeType, list?: Playlist) => void;
  initializeLayout: () => void;
};

const LayoutContext = createContext({} as LayoutValue);

const LayoutProvider = (props) => {
  const router = useRouter();
  const { setPlaylist } = usePlaylist();
  const { asPath } = useRouter();
  const { getPlaylistById, getPlaylists } = usePlaylist();
  const [connectorPane, setConnectorPane] = useState<PanelModeType>(
    PanelMode.Collapsed
  );
  const [sideBarPane, setSideBarPane] = useState<PanelModeType>(
    PanelMode.Collapsed
  );
  const [mainPane, setMainPane] = useState<MainModeType>(MainMode.Search);
  const [pageMode, setPageMode] = useState<PageModeType>(PageMode.Playlist);

  const changeConnectorPane = useCallback((pane: PanelModeType) => {
    setConnectorPane(pane);
  }, []);

  const changeSideBarPane = useCallback((pane: PanelModeType) => {
    setSideBarPane(pane);
  }, []);

  const showMainPane = useCallback((pane: MainModeType) => {
    setMainPane(pane);
  }, []);

  const changePageMode = useCallback(
    (pane: PageModeType, list?: Playlist) => {
      switch (pane) {
        case PageMode.Listening:
          if (!list) return;
          setPlaylist(list);
          router.push(`/#listening/${list.id}`, undefined, { shallow: true });
          break;
        case PageMode.NewPlaylist:
          router.push('/#newplaylist', undefined, { shallow: true });
          break;
        case PageMode.Playlist: {
          setPlaylist(null);
          getPlaylists();
          router.push('/', undefined, { shallow: true });
          break;
        }
      }

      setPageMode(pane);
    },
    [getPlaylists, router, setPlaylist]
  );

  const initializeLayout = useCallback(async () => {
    const [, path] = asPath.split('#');
    if (path) {
      const [firstPath, rest] = path.split('/');
      const mode =
        PageMode[
          Object.keys(PageMode).find(
            (key) => key.toLowerCase() === firstPath.toLowerCase()
          )
        ];
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
      mainPane,
      showMainPane,
      pageMode,
      changePageMode,
      initializeLayout,
    }),
    [
      connectorPane,
      changeConnectorPane,
      sideBarPane,
      changeSideBarPane,
      mainPane,
      showMainPane,
      pageMode,
      changePageMode,
      initializeLayout,
    ]
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
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

export { LayoutProvider, useLayout };
