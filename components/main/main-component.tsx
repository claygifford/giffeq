import React from 'react';
import styles from './main.module.css';

type Props = {
  children: any;
  innerRef?: any;
};

export default function MainComponent(props: Props) {
  const { children, innerRef } = props;
  return (
    <main ref={innerRef} className={styles.main}>
      {children}
    </main>
  );
}