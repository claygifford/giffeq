import styles from "./thumbs-up-dog.module.css";

import Image from "next/image";
export default function ThumbsUpDogComponent() {
  return (
    <div className={styles.ThumbsUpDog}>
      <Image
        src="/img/thumbs-up.png"
        alt="Boston Terrier thumbs up to music"
        width={121}
        height={110}
      />
      <div className={styles.ThumbsUpDogLine}></div>
    </div>
  );
}
