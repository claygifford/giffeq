import styles from './lazy-dog.module.css';

import Image from 'next/image';
export default function LazyDogComponent() {
  return (
    <div className={styles.LazyDog}>
      <Image
        src="/img/login-1.png"
        alt="Lazy Boston Terrier waiting for you to login"
        width={233}
        height={220}
      />
      <div className={styles.LazyDogLine}></div>
    </div>
  );
}