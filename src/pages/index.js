import Head from 'next/head';
import React from 'react';

import styles from '../../styles/Home.module.css';

import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';

Amplify.configure(awsExports);

export default function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>Playlist</title>
        <meta name="description" content="Playlist developed by Clay Gifford" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>header</header>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Playlist!</h1>
        <button>Sign in</button>
      </main>

      <footer className={styles.footer}>footer</footer>
    </React.Fragment>
  );
}
