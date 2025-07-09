import styles from "./thumbs-up-dog.module.css";

import Image from "next/image";
export default function FeaturedPlaylistComponent() {
  return (
    <div className={styles.ThumbsUpDog}>
      <Image
        src="/img/featured-playlist.jpeg"
        alt="Boston Terrier thumbs up to music"
        width={121}
        height={110}
      />
      <div className={styles.ThumbsUpDogLine}></div>
    </div>
  );
}
