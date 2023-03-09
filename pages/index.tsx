import React, { useEffect, useRef, useState } from 'react';

import PageComponent from '../components/page-component';
import ButtonComponent from '../lib/ui/button/button-component';
import { PlayIcon } from '@heroicons/react/24/solid';
import { useMusic } from '../lib/context/music-context';
import AmazonConnectorComponent from '../components/connectors/amazon-connector-component';
import Link from 'next/link';
import TextInputComponent from './../lib/ui/input/text-input-component';
import InputComponent from '../lib/ui/input/input-component';

export default function Home() {
  const { playMusic, playSpotifyMusic, setSpotifyAccessToken, searchMusic, currentSong } =
    useMusic();
  const [songSearch, setSongSearch] = useState('');
  
    function play() {
      //console.log('You clicked submit.');      
      playSpotifyMusic();

      //https://api.spotify.com/v1/me/player
    }
    const onSearch = () => {
      searchMusic(songSearch);
    }
    const videoRef = useRef<HTMLVideoElement>(null);

     useEffect(() => {
      if (videoRef && videoRef.current)
        videoRef.current.load();
     }, [currentSong]);

    console.log(`${currentSong?.preview_url}`);
  return (
    <PageComponent>
      <div>yo logged in</div>
      <div>Play?</div>

      <AmazonConnectorComponent />

      <div>
        <Link href="/api/spotify/login">Login with Spotify</Link>
      </div>

      <div>
        <ButtonComponent type={'submit'} onClick={play}>
          <PlayIcon className="h-6 w-6 text-white" />
          Play
        </ButtonComponent>
      </div>

      <div>
        <InputComponent
          id={'song-search'}
          name={'song-search'}
          type={'string'}
          label={'Search for songs'}
          placeHolder={'Search for songs'}
          value={songSearch}
          onChange={(event) => setSongSearch(event.target.value)}
        />
        <div>
          <ButtonComponent onClick={onSearch}>Search</ButtonComponent>
        </div>
      </div>
      <div>
        {currentSong && (
          <div>
            <div>{currentSong.name}</div>
            <video ref={videoRef} controls>
              <source src={currentSong.preview_url} type="audio/mpeg" />
            </video>
          </div>
        )}
      </div>
    </PageComponent>
  );
}

export function getServerSideProps() {
  return {
    props: { protected: true },
  };
}