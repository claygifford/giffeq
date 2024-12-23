import React from "react";
import HeadComponent from "./head/head-component";
import MainComponent from "./main/main-component";

type Props = {
  header?: any;
  head?: any;
  footer?: any;
  children: any;
  classes?: string;
};

export default function PageComponent(props: Props) {
  const { children, classes } = props;
  return (
    <React.Fragment>
      <HeadComponent />
      <MainComponent classes={classes}>{children}</MainComponent>
    </React.Fragment>
  );
}
