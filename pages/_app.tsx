import React from 'react';
import App from 'next/app';
import Header from "../components/header/header";
import Head from 'next/head';
import '../styles/global.css';
import Footer from '../components/footer/footer';

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
          <meta name="Description" content="This is my React Portfolio" />
        </Head>
        <Header></Header>
        <div className="container">
          <Component {...pageProps} />
        </div>
        <Footer></Footer>
      </React.Fragment>
    );
  }
}

export default GiffEq;
