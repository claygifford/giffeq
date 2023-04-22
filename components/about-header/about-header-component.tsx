import Link from 'next/link';
import router from 'next/router';
import React from 'react';
import { useAuth } from '../../lib/context/auth-context';
import NoteIcon from '../../lib/ui/icons/note-icon';
import styles from './about-header.module.css';
import UserProfileComponent from '../header/user-profile/user-profile-component';
import MenuButtonComponent from '../../lib/ui/button/menu-button-component';

type Props = {
  isScrolled: boolean;
  sections: { name: string }[];
  selectedSection: any;
  onSelectSection: (section) => void;
};

export default function AboutHeaderComponent(props: Props) {
  const { isScrolled, selectedSection, sections, onSelectSection } = props;
  const { user } = useAuth();

  return (
    <div
      className={`${styles.AboutHeader} ${
        isScrolled ? styles.AboutHeaderShadow : ''
      }`}
    >
      <header className={styles.header}>
        <div className="lg:hidden block">
          <MenuButtonComponent
            onClick={() => {
              console.log('asdas');
            }}
          ></MenuButtonComponent>
        </div>

        <div className="flex px-3">
          <Link href="/">
            <div className="flex gap-3 items-center cursor-pointer">
              <NoteIcon height={32} width={32} className="fill-blue-900" />{' '}
              Playlist
            </div>
          </Link>
        </div>

        <div className="flex-1 gap-6 px-3 h-full lg:flex hidden">
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
        <div className="items-center justify-end px-3 lg:flex hidden">
          {user ? (
            <div className="flex gap-1 items-center">
              <button
                onClick={() => router.push('/')}
                className="bg-blue-200 flex whitespace-nowrap items-center group relative w-full justify-center rounded-full border border-transparent py-2 px-5 text-base font-medium text-gray-800 hover:bg-blue-300 hover:ring-blue-400 hover:ring-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Go to Playlist
              </button>
              <UserProfileComponent></UserProfileComponent>
            </div>
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
