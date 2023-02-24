import React, { createContext, useCallback } from 'react';

type MusicValue = {
  playMusic: () => void;
};

const MusicContext = createContext({} as MusicValue);

const Env = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
};

const MusicProvider = (props) => {
console.log(
  `testing ${process.env.TESTINGENV} ${process.env.CLIENT_ID} ${process.env.CLIENT_SECRET}`
);
    
  const playMusic = useCallback(async () => {
    try {
      const request = await fetch('https://www.amazon.com/ap/oa', {
        method: 'get',
        headers: new Headers({
          client_id: Env.CLIENT_ID,
          scope: 'profile',
          response_type: 'code',
          redirect_uri: 'https://www.giffeq.com/about/login',
        }),
      });
      console.log(`wowzers -- request: ${JSON.stringify(request)}`);
    } catch (error) {
      console.log('error getting the request', error);
    } finally {
    }

    try {
      const token = await fetch('https://api.amazon.com/auth/o2/token', {
        method: 'get',
        headers: new Headers({
          grant_type: 'Authorization_code',
          code: '',
          //redirect_uri: '',
          client_id: Env.CLIENT_ID,
          client_secret: Env.CLIENT_SECRET,
        }),
      });
      console.log(`wowzers -- token: ${JSON.stringify(token)}`);      
    } catch (error) {
      console.log('error getting the token', error);
    } finally {
    }

    try {
      // play music
      const results = await fetch(
        'https://api.music.amazon.dev/v1/albums/?ids=B0064UPU4G,B091BHTFTZ,B0869N1S7F',
        {
          method: 'get',
        }
      );
      console.log(`wowzers -- play music: ${JSON.stringify(results)}`);
    } catch (error) {
      console.log('error playing music', error);
    }
  }, []);

  const value = {
    playMusic,
  } as MusicValue;

  return (
    <MusicContext.Provider value={value}>
      {props.children}
    </MusicContext.Provider>
  );
};

const useMusic = () => {
  const context = React.useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export { MusicProvider, useMusic };
