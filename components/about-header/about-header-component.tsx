import Link from 'next/link';
import router from 'next/router';
import React from 'react';
import { useAuth } from '../../lib/context/auth-context';
import NoteIcon from '../../lib/ui/icons/note-icon';
import styles from './about-header.module.css';
import UserProfileComponent from '../header/user-profile/user-profile-component';

type Props = {
  isScrolled: boolean;
  sections: { name: string }[];
  selectedSection: any;
  onSelectSection: (section) => void;
};

export default function AboutHeaderComponent(props: Props) {
  const { isScrolled, selectedSection, sections, onSelectSection } = props;
  const { user } = useAuth();

  console.log(selectedSection.name);
  return (
    <div
      className={`${styles.AboutHeader} ${
        isScrolled ? styles.AboutHeaderShadow : ''
      }`}
    >
      <header className={styles.header}>
        <div className="flex px-3">
          <Link href="/about">
            <div className="flex gap-3 items-center">
              <NoteIcon height={32} width={32} className="fill-blue-900" />{' '}
              Playlist
            </div>
          </Link>
        </div>

        <div className="flex flex-1 gap-6 px-3 h-full">
          {sections?.map((s) => {
            return (
              <div
                className={`border-b-2 flex cursor-pointer text-base font-medium hover:text-gray-900 ${
                  selectedSection.name == s.name
                    ? ' border-blue-900 text-gray-900'
                    : 'border-white text-gray-500'
                }`}
                onClick={() => onSelectSection(s)}
                key={s.name}
              >
                <div className="flex items-center">{s.name}</div>
              </div>
            );
          })}
        </div>
        {/* <div className="flex flex-1 justify-center">Playlist</div> */}
        <div className="flex items-center justify-end px-3">
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
    </div>
  );
}
