import Image from 'next/image';
import React, { useEffect } from 'react';
import { useEffectOnce } from '../../lib/hooks/use-effect-once';

declare global {
  interface Window {
    onAmazonLoginReady: any;
    amazon: any;
  }
}

const Env = {
  CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID,
};

export default function AmazonConnectorComponent() {
  var amazon;

  const logIn = () => {
    console.log(
        `testing ${process.env.NEXT_PUBLIC_TESTINGENV} ${process.env.NEXT_PUBLIC_CLIENT_ID}`
    );

    const options = {
      scope: 'profile',
      response_type: 'code',
    };
    amazon.Login.authorize(options, (response) => {
      if (response.error) {
        alert('oauth error ' + response.error);
        return;
      }
      alert('success: ' + response.code);
    });
  };

  const onLoginReady = (event) => {
    console.log('yes sir?');
  };

  useEffectOnce(() => {
    window.addEventListener('onAmazonLoginReady', onLoginReady);
    window.onAmazonLoginReady = function () {
      amazon = window.amazon;
      amazon.Login.setClientId(Env.CLIENT_ID);
    };
    // cleanup this component
    return () => {
      console.log('hey');
      window.removeEventListener('onAmazonLoginReady ', onLoginReady);
    };
  });

  useEffectOnce(() => {
    const script = document.createElement('script');

    script.src = 'https://assets.loginwithamazon.com/sdk/na/login1.js';
    script.async = true;
    script.id = 'amazon-login-sdk';
    document.getElementById('amazon-root').appendChild(script);

    return () => {
      console.log('hey yup');
      document.getElementById('amazon-root').removeChild(script);
    };
  });
  return (
    <div>
      <div>wuf?</div>
      <div id="amazon-root"></div>
      <a href="" id="LoginWithAmazon" onClick={logIn}>
        <img
          style={{
            border: 0,
          }}
          alt="Login with Amazon"
          src="https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_156x32.png"
          width="156"
          height="32"
        />
      </a>
    </div>
  );
}
