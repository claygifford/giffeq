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
};
type PanelModeType = typeof PanelMode[keyof typeof PanelMode];
export const MainMode = {
  Search: 1,
  NextSong: 2,
  Decisions: 3,
  History: 4,
  Settings: 5,
} as const;

type MainModeType = typeof MainMode[keyof typeof MainMode];

type LayoutValue = {
  connectorPane: number;
  setConnectorPane: Dispatch<SetStateAction<number>>;
  sideBarPane: number;
  setSideBarPane: Dispatch<SetStateAction<number>>;
  mainPane: number;
  showMainPane: (pane: MainModeType) => void;
};

const LayoutContext = createContext({} as LayoutValue);

const LayoutProvider = (props) => {
  const [connectorPane, setConnectorPane] = useState(PanelMode.Collapsed);
  const [sideBarPane, setSideBarPane] = useState(PanelMode.Collapsed);
  const [mainPane, setMainPane] = useState<MainModeType>(MainMode.Search);

  const showMainPane = useCallback((pane: MainModeType) => {
    setMainPane(pane);
  }, []);

  const value = {
    connectorPane,
    setConnectorPane,
    sideBarPane,
    setSideBarPane,
    mainPane,
    showMainPane,
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
