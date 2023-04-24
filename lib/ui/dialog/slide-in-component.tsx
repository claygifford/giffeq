import { XMarkIcon } from '@heroicons/react/24/outline';
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './slide-in-component.module.css';
import { Dialog } from './modal-component';

type SlideInProps = {
  children: Dialog;
  onClose: () => void;
};

export default function SlideInComponent(props: SlideInProps) {
  const { children, onClose } = props;
  const [isClosing, setIsClosing] = useState(false);
  const modal = useRef(null);

  useEffect(() => {
    const node = modal.current;
    if (node) {
      node.addEventListener('click', animateClose);
    }
    return () => {
      if (node) {
        node.removeEventListener('click', animateClose);
      }
    };
  }, []);

  const animateClose = () => {
    setIsClosing(true);
  };
  const closeDialog = () => {
    if (isClosing) {
      onClose();
    }
  };
  return (
    <div
      ref={modal}
      className={`${styles.Modal} ${
        isClosing ? styles.ModalClosed : styles.ModalOpen
      }`}
    >
      <div
        onAnimationEnd={closeDialog}
        className={`${styles.ModalContent} ${
          isClosing ? styles.ModalContentClosed : styles.ModalContentOpen
        }`}
      >
        <div className={styles.ModalHeader}>
          {children.Header}{' '}
          <button className={styles.ModalHeaderButton} onClick={animateClose}>
            <XMarkIcon className="h-6 w-6 stroke-2 [&>path]:stroke-[2]" />
          </button>
        </div>
        <div className={styles.ModalBody}>{children.Body}</div>
        {children.Footer && (
          <div className={styles.footer}>Footer {children.Footer}</div>
        )}
      </div>
    </div>
  );
}
