import Head from 'next/head';
import React from 'react';

import styles from '../styles/Home.module.css';

import PageComponent from '../components/page-component';
import LogInComponent from '../components/auth/log-in-component';
import ButtonComponent from '../lib/ui/button/button-component';
import { PlayIcon } from '@heroicons/react/24/solid';

export default function Home() {
    function play() {
      console.log('You clicked submit.');      
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