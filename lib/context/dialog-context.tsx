import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { createPortal } from 'react-dom';
import ModalComponent, {
  Dialog,
  DialogContainer,
} from '../ui/dialog/modal-component';
import SlideInComponent from '../ui/dialog/slide-in-component';
import { useEffectOnce } from '../hooks/use-effect-once';

type DialogValue = {
  showDialog: ({ dialog }) => void;
};

const DialogContext = createContext({} as DialogValue);

const DialogProvider = (props) => {
  const [windows, setWindows] = useState([]);

  const isBrowser = typeof window !== 'undefined';

  const showDialog = useCallback(
    async ({ dialog }: { dialog: Dialog }) => {
      if (isBrowser) {
        switch (dialog.Type) {
          case DialogContainer.SlideIn: {
            setWindows([
              <SlideInComponent
                key={'1'}
                onClose={() => {
                  setWindows([]);
                }}
              >
                {dialog}
              </SlideInComponent>,
            ]);
            break;
          }
          case DialogContainer.Modal:
          default: {
            setWindows([
              <ModalComponent
                key={'1'}
                onClose={() => {
                  setWindows([]);
                }}
              >
                {dialog}
              </ModalComponent>,
            ]);
          }
        }
      }
    },
    [isBrowser]
  );

  const dialogs = useMemo(() => {
    return windows.map((item) => createPortal(item, document.body));
  }, [windows]);

  const value = useMemo(() => ({
    showDialog
  }), [showDialog]);

  return (
    <DialogContext.Provider value={value}>
      {props.children}
      {dialogs}
    </DialogContext.Provider>
  );
};

export { DialogProvider, DialogContext };
