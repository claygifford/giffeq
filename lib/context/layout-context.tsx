import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
} from 'react';

export const PanelMode = {
  Collapsed: 1,
  Expanded: 2,
} as const;
type PanelModeType = typeof PanelMode[keyof typeof PanelMode];

export const MainMode = {
  Search: 1,
  NextSong: 2,
  Decisions: 3,
  History: 4,
  Settings: 5,
} as const;
type MainModeType = typeof MainMode[keyof typeof MainMode];

export const PageMode = {
  Playlist: 1,
  Listening: 2,
} as const;
type PageModeType = typeof PageMode[keyof typeof PageMode];

type LayoutValue = {
  connectorPane: number;
  changeConnectorPane: (pane: PanelModeType) => void;
  sideBarPane: number;
  changeSideBarPane: (pane: PanelModeType) => void;
  mainPane: number;
  showMainPane: (pane: MainModeType) => void;
  pageMode: number;
  changePageMode: (mode: PageModeType) => void;
};

const LayoutContext = createContext({} as LayoutValue);

const LayoutProvider = (props) => {
  const [connectorPane, setConnectorPane] =
    useState<PanelModeType>(PanelMode.Collapsed);
  const [sideBarPane, setSideBarPane] =
    useState<PanelModeType>(PanelMode.Collapsed);
  const [mainPane, setMainPane] = useState<MainModeType>(MainMode.Search);
  const [pageMode, setPageMode] = useState<PageModeType>(PageMode.Listening);

  const changeConnectorPane = useCallback((pane: PageModeType) => {
    setConnectorPane(pane);
  }, []);

  const changeSideBarPane = useCallback((pane: PageModeType) => {
    setSideBarPane(pane);
  }, []);

  const showMainPane = useCallback((pane: MainModeType) => {
    setMainPane(pane);
  }, []);

  const changePageMode = useCallback((pane: PageModeType) => {
    setPageMode(pane);
  }, []);

  const value = {
    connectorPane,
    changeConnectorPane,
    sideBarPane,
    changeSideBarPane,
    mainPane,
    showMainPane,
    pageMode,
    changePageMode,
  } as LayoutValue;

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
