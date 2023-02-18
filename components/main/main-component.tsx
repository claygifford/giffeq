import React from 'react';
import styles from './main.module.css';

export default function MainComponent(props) {
    const { children } = props;
  return <main className={styles.main}>{children}</main>;
}
