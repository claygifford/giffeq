import Link from "next/link";
import styles from "./navigation-bar.module.css";

export default function NavigationBar() {
  return (
    <div className={styles.NavigationBar}>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/story">
        <a>Story</a>
      </Link>
      <Link href="/concepts">
        <a>Concepts</a>
      </Link>
      <Link href="/how-to">
        <a>How To</a>
      </Link>
      <Link href="/timeline">
        <a>Timeline</a>
      </Link>
    </div>
  );
}
