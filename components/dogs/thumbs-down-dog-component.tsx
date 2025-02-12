import styles from './thumbs-up-dog.module.css';

import Image from 'next/image';
export default function ThumbsDownDogComponent() {
  return (
    <div className={styles.ThumbsDownDog}>
      <Image
        src="/img/thumbs-down.png"
        alt="Boston Terrier thumbs down to music"
        width={121}
        height={110}
      />
      <div className={styles.ThumbsDownDogLine}></div>
    </div>
  );
}
