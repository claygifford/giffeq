import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { ReactNode } from 'react';
import styles from './modal-component.module.css';

type ModalProps = {
  children: Dialog;
  onClose: () => void;
};

export const DialogContainer = {
  Modal: 1,
  SlideIn: 2,
} as const;
type DialogContainerType = typeof DialogContainer[keyof typeof DialogContainer];

export type Dialog = {
  Header: ReactNode;
  Body: ReactNode;
  Footer?: ReactNode;
  Type: DialogContainerType;
};

export default function ModalComponent(props: ModalProps) {
  const { children, onClose } = props;
  return (
    <div className={styles.modal}>
      <div className={styles.modalcontent}>
        <div className={styles.modalheader}>
          {children.Header}{' '}
          <button className={styles.modalheaderbutton} onClick={onClose}>
            <XMarkIcon className="h-6 w-6 stroke-2 [&>path]:stroke-[2]" />
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
