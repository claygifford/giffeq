import Link from 'next/link';
import router from 'next/router';
import React from 'react';
import { useAuth } from '../../lib/context/auth-context';
import NoteIcon from '../../lib/ui/icons/note-icon';
import ConnectorButton from '../connectors/connector-button-component';
import styles from './header.module.css';
import UserProfileComponent from './user-profile/user-profile-component';
import SideBarButtonComponent from '../side-bar/side-bar-main-button-component';

export default function HeaderComponent() {
  const { user } = useAuth();

  return (
    <header className={styles.header}>
      <SideBarButtonComponent></SideBarButtonComponent>
      <div className="flex flex-1 px-3">
        <Link href="/">
          <div className="flex gap-3 items-center">
            <NoteIcon height={32} width={32} className="fill-blue-900" />{' '}
            Playlist
          </div>
        </Link>
      </div>
      <div className="flex flex-1 justify-center">Playlist</div>
      <div className="flex flex-1 items-center justify-end px-3">
        <ConnectorButton></ConnectorButton>
        {user ? (
          <UserProfileComponent></UserProfileComponent>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={() => router.push('/about/signup')}
              className="flex whitespace-nowrap items-center group relative w-full justify-center rounded-full border border-transparent py-2 px-5 text-sm font-medium text-indigo-500 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              Sign up
            </button>
            <button
              onClick={() => router.push('/about/login')}
              className="flex whitespace-nowrap items-center group relative w-full justify-center rounded-full border border-transparent py-2 px-5 text-sm font-medium text-indigo-500 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              Log in
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
