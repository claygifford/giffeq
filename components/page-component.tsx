import React from 'react';
import HeadComponent from './head/head-component';
import MainComponent from './main/main-component';

type Props = {
  header?: any;
  head?: any;
  footer?: any;
  children: any;
  innerRef?: any;
};

export default function PageComponent(props: Props) {
  const { children, innerRef } = props;
  return (
    <React.Fragment>
      <HeadComponent />
      <MainComponent innerRef={innerRef}>{children}</MainComponent>
    </React.Fragment>
  );
}
