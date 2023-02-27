import Image from 'next/image';
import React, { useEffect } from 'react';
import { useMusic } from '../../lib/context/music-context';
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
  const { setAmazonAccessToken } = useMusic();
  var amazon;

  const logIn = async (e) => {
    e.preventDefault();
    console.log('The link was clicked.');

    console.log(
      `testing ${process.env.NEXT_PUBLIC_TESTINGENV} ${process.env.NEXT_PUBLIC_CLIENT_ID}`
    );
    var tokenResponse = await amazon.Login.retrieveToken();
    if (tokenResponse) {
      console.log('Cached Access Token: ' + tokenResponse.access_token);
      setAmazonAccessToken(tokenResponse.access_token);
      return;
    } else {
    }

    const options = {
      scope: 'profile, amazon_music:access',
      response_type: 'code',
      pkce: true,
    };
    await amazon.Login.authorize(options, async (response) => {
      console.log('Now in here?');

      if (response.error) {
        alert('oauth error authorize' + response.error);
        return;
      }
      alert('success: ' + response.code);

      amazon.Login.retrieveToken(response.code, async (response) => {
        if (response.error) {
          alert('oauth error retrieveToken' + response.error);
          return;
        }
        alert('Access Token: ' + response.access_token);
        setAmazonAccessToken(tokenResponse.access_token);
        amazon.Login.retrieveProfile(
          response.access_token,
          function (response) {
            alert('Hello, ' + response.profile.Name);
            alert('Your e-mail address is ' + response.profile.PrimaryEmail);
            alert('Your unique ID is ' + response.profile.CustomerId);
            if (window.console && window.console.log)
              window.console.log(response);
          }
        );
      });
    });

    console.log('Waited all the way to here?');
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

