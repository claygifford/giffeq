import { useAuth } from '../../../lib/context/auth-context';
import { useState } from 'react';
import { ArrowLeftOnRectangleIcon, BeakerIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import styles from './user-profile.module.css';
import { useOutsideClick } from '../../../lib/hooks/use-outside-click';

type UserProfileProps = {
  //children: React.ReactNode;
};

export default function UserProfileComponent(props: UserProfileProps) {
  //const { children } = props;
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useOutsideClick(() => setIsOpen(false));

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex w-full justify-center rounded-full border border-transparent py-1 px-1 text-sm font-medium text-white hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-200"
      >
        <UserCircleIcon className="h-6 w-6 text-indigo-500" />
      </button>
      {isOpen ? (
        <div ref={ref} className={`${styles.dropdown} rounded-lg`}>
          <div className={styles.dropdowntop}>Profile</div>
          <div className={styles.dropdownitem}>{user.username}</div>
          <div
            className={`${styles.dropdownitem} py-2 flex gap-2 hover:bg-indigo-100 rounded`}
            onClick={() => console.log('asd')}
          >
            <ArrowLeftOnRectangleIcon className="text-indigo-500 max-w-[24px] max-h-[24px]" />
            Sign out
          </div>
          <div className={styles.dropdownbottom}></div>
        </div>
      ) : undefined}
    </div>
  );
}
