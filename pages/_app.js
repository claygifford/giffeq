import React from 'react';
import App from 'next/app';
import SiteLayout from '../components/site-layout';
import Head from 'next/head';
import '../styles/global.css';

class GiffEq extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>Giff Eq</title>
          <link rel="icon" href="/favicon.ico" />
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, viewport-fit=cover"
          />
          <meta
            name="Description"
            content="My video game project. This site is to track the progress of my video game development."
          />
        </Head>
        <SiteLayout>
          <Component {...pageProps} />
        </SiteLayout>
      </React.Fragment>
    );
  }
}

export default GiffEq;
