import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { ReactNode } from 'react';
import styles from './modal.module.css';

type ModalProps = {
  children: Dialog;
  onClose: () => void;
};

export type Dialog = {
  Header: ReactNode;
  Body: ReactNode;
  Footer?: ReactNode;
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
