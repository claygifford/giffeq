import Head from 'next/head';
import React from 'react';
import styles from './main.module.css';

export default function HeadComponent() {
  return (
    <Head>
      <title>Playlist</title>
      <meta name="description" content="Playlist developed by Clay Gifford" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
