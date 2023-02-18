import Link from 'next/link';
import React from 'react';
import { useAuth } from '../../lib/context/auth-context';
import NoteIcon from '../../lib/ui/icons/note-icon';
import styles from './header.module.css';
import UserProfileComponent from './user-profile/user-profile-component';

export default function HeaderComponent() {
  const { user } = useAuth();
  
  return (
    <header className={styles.header}>
      <div className="flex flex-1 px-3">
        <Link href="/">
          <div className="flex gap-3">
            <NoteIcon height={32} width={32} className="fill-indigo-600" />{' '}
            Playlist
          </div>
        </Link>
      </div>
      <div className="flex flex-1 justify-center">Playlist</div>
      <div className="flex flex-1 items-center justify-end px-3">
        right
        {<UserProfileComponent></UserProfileComponent>}
      </div>
    </header>
  );
}
