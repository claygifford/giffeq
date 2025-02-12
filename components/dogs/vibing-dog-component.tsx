import styles from './vibing-dog.module.css';

import Image from 'next/image';
export default function VibingDogComponent() {
  return (
    <div className={styles.VibingDog}>
      <Image
        src="/img/vibing-1.png"
        alt="Vibing Boston Terrier listening to music"
        width={712}
        height={712}
      />
      <div className={styles.VibingDogLine}></div>
    </div>
  );
}
