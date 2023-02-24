import React from 'react';

import PageComponent from '../components/page-component';
import ButtonComponent from '../lib/ui/button/button-component';
import { PlayIcon } from '@heroicons/react/24/solid';
import { useMusic } from '../lib/context/music-context';

export default function Home() {
  const { playMusic } = useMusic();
    function play() {
      console.log('You clicked submit.');      
      playMusic();
    }
    
  return (
    <PageComponent>
      <div>yo logged in</div>
      <div>Play?</div>

      <div>
        <ButtonComponent type={'submit'} onClick={play}>
          <PlayIcon className="h-6 w-6 text-white" />
          Play
        </ButtonComponent>
      </div>
    </PageComponent>
  );
}

export function getServerSideProps() {
  return {
    props: { protected: true },
  };
}