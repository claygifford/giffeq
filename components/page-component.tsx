import React from 'react';
import FooterComponent from './footer/footer-component';
import HeadComponent from './head/head-component';
import HeaderComponent from './header/header-component';
import MainComponent from './main/main-component';

type Props = {
  header?: any;
  head?: any;
  footer?: any;
  children: any;
};
export default function PageComponent(props: Props) {
  const { children } = props;
  return (
    <React.Fragment>
      <HeadComponent />
      <HeaderComponent />
      <MainComponent>{children}</MainComponent>
      <FooterComponent />
    </React.Fragment>
  );
}
