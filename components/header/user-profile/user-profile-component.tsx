import { useAuth } from '../../../lib/context/auth-context';
import { useState } from 'react';
import {
  ArrowLeftOnRectangleIcon,
  BeakerIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import styles from './user-profile.module.css';
import { useOutsideClick } from '../../../lib/hooks/use-outside-click';
import router from 'next/router';

type UserProfileProps = {
  //children: React.ReactNode;
};

const Env = {
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
};

export default function UserProfileComponent(props: UserProfileProps) {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useOutsideClick(() => setIsOpen(false));

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex w-full justify-center rounded-full border border-transparent py-1 px-1 text-sm font-medium text-white hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        <UserCircleIcon className="h-6 w-6 text-blue-500" />
      </button>
      {isOpen ? (
        <div ref={ref} className={`${styles.dropdown} rounded-lg`}>
          <div className={styles.dropdowntop}>Profile</div>
          <div className={styles.dropdownitem}>{user.username}</div>
          <div
            className={`${styles.dropdownitem} py-3 flex gap-2 hover:bg-blue-100`}
            onClick={() => {
              router.push('/about');
            }}
          >
            About
          </div>
          <div
            className={`${styles.dropdownitem} py-3 flex gap-2 hover:bg-blue-100`}
            onClick={signOut}
          >
            <ArrowLeftOnRectangleIcon className="text-black-200 max-w-[24px] max-h-[24px]" />
            Sign out
          </div>
          <div>Build {Env.APP_VERSION}</div>
          <div className={styles.dropdownbottom}></div>
        </div>
      ) : undefined}
    </div>
  );
}
