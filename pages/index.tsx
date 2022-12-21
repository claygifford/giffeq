import Head from 'next/head';
import React from 'react';

import styles from '../styles/Home.module.css';

import { Amplify } from 'aws-amplify';
import awsExports from '../src/aws-exports';
import SignIn from '../components/auth/sign-in';
import SignUp from '../components/auth/sign-up';
import SignOut from '../components/auth/sign-out';
import { useAuth } from '../lib/context/auth-context';

Amplify.configure(awsExports);

export default function Home() {
  const { userName, createAccount } = useAuth();
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
        <h1 className="text-3xl font-bold underline">{userName}</h1>
        <button onClick={() => createAccount()}>Sign in!</button>
        <SignIn></SignIn>
        <SignUp></SignUp>
        <SignOut></SignOut>
      </main>

      <footer className={styles.footer}>footer</footer>
    </React.Fragment>
  );
}
