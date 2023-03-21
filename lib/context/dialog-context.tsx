import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { createPortal } from 'react-dom';
import ModalComponent, { Dialog } from '../ui/dialog/modal';

type DialogValue = {
  showDialog: ({ dialog }) => void;
};

const DialogContext = createContext({} as DialogValue);

const DialogProvider = (props) => {
  const [isBrowser, setIsBrowser] = useState(false);

  const [windows, setWindows] = useState([]);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const showDialog = useCallback(
    async ( {dialog} : {dialog: Dialog}) => {
      if (isBrowser) {
        setWindows([<ModalComponent key={'1'} onClose={() => { setWindows([]); }}>{dialog}</ModalComponent>]);
      }
    },
    [isBrowser]
  );

  const value = {
    showDialog,
  } as DialogValue;

  const dialogs = useMemo(() => {
    return windows.map((item) => createPortal(item, document.body));
  }, [windows]);

  return (
    <DialogContext.Provider value={value}>
      {props.children}
      {dialogs}
    </DialogContext.Provider>
  );
};

const useDialog = () => {
  const context = React.useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};

export { DialogProvider, useDialog };
