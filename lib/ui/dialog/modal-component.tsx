import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { ReactNode } from 'react';
import styles from './modal-component.module.css';

type ModalProps = {
  children: Dialog;
  onClose: () => void;
};

export const DialogPosition = {
  Center: 1,
  BottomLeft: 2,
} as const;
type DialogPositionType = (typeof DialogPosition)[keyof typeof DialogPosition];

export const DialogContainer = {
  Modal: 1,
  SlideIn: 2,
} as const;
type DialogContainerType =
  (typeof DialogContainer)[keyof typeof DialogContainer];

export type Dialog = {
  Header: ReactNode;
  Body: ReactNode;
  Footer?: ReactNode;
  Type: DialogContainerType;
  Position: DialogPositionType;
};

export default function ModalComponent(props: ModalProps) {
  const { children, onClose } = props;
  const getPositionStyle = () => {
    if (children.Position === DialogPosition.BottomLeft) {
      return styles.ModalContentBottomLeft;
    }

    return styles.ModalContentCenter;
  };

  return (
    <div className={styles.modal}>
      <div className={`${styles.modalcontent} ${getPositionStyle()}`}>
        <div className={styles.modalheader}>
          {children.Header}{' '}
          <button
            aria-label="Close modal button"
            className={styles.modalheaderbutton}
            onClick={onClose}
          >
            <XMarkIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem] stroke-2 [&>path]:stroke-[2]" />
          </button>
        </div>
        <div className={styles.modalbody}>{children.Body}</div>
        {children.Footer && (
          <div className={styles.footer}>Footer {children.Footer}</div>
        )}
      </div>
    </div>
  );
}
