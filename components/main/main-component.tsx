import React from "react";
import styles from "./main.module.css";

type Props = {
  children: any;
  classes?: string;
};

export default function MainComponent(props: Props) {
  const { children, classes } = props;
  return <main className={`${styles.main} ${classes}`}>{children}</main>;
}
