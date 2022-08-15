import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./navigation.module.css";
import React from "react";

export default function Navigation() {
  const router = useRouter();
  return (
    <React.Fragment>
      <div className={`${styles.NavigationLink} ${router.pathname == "/" ? styles.NavigationActive : ""}`}>
        <Link href="/">About Me</Link>
      </div>
      <div
        className={`${styles.NavigationLink} ${router.pathname == "/portfolio" ? styles.NavigationActive : ""}`}
      >
        <Link href="/portfolio">Portfolio</Link>
      </div>
      <div
        className={`${styles.NavigationLink} ${router.pathname == "/contact" ? styles.NavigationActive : ""}`}
      >
        <Link href="/contact">Contact</Link>
      </div>
      <div
        className={`${styles.NavigationLink} ${
          router.pathname == "/resume" ? styles.NavigationActive : ""
        }`}
      >
        <Link href="/resume">Resume</Link>
      </div>
    </React.Fragment>
  );
}
