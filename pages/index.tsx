import React, { useEffect, useRef, useState } from 'react';

import PageComponent from '../components/page-component';
import ButtonComponent from '../lib/ui/button/button-component';
import { PlayIcon } from '@heroicons/react/24/solid';
import { useMusic } from '../lib/context/music-context';
import Link from 'next/link';
import InputComponent from '../lib/ui/input/input-component';

const ItemTemplate = ({ item, onClick }) => {
  const artist = (i) => {
    if (i.type === 'album' || i.type === 'track')
      return <div className="flex px-2 gap-2">| {i.artists.map((artist, i) => {
        return <div key={artist.id}>{artist.name}</div>;
      })}</div>;
  };

  const onItemClick = () => {
    onClick(item);
  }

  return (
    <div
      className="flex py-1 items-center cursor-pointer"
      onClick={onItemClick}
    >
      <div className="font-medium">{item.name}</div>
      {artist(item)}
      <div className="bg-red-300 rounded px-2 py-1 text-white ml-2">
        {item.type}
      </div>
    </div>
  );
};

export default function Home() {
  const { searchMusic, currentSong, currentResults, clearResults, selectItem } = useMusic();
  const [songSearch, setSongSearch] = useState('');

  const play = () => {
    if (videoRef && videoRef.current) videoRef.current.play();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      searchMusic(songSearch);
    }
  };

  const onItemClick = (item) => {
    selectItem(item);
  };

  const onSearch = () => {
    searchMusic(songSearch);
  };

  const onClear = () => {
    clearResults();
  };

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef && videoRef.current) videoRef.current.load();
  }, [currentSong]);

  return (
    <PageComponent>
      <div className="flex w-full overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-slate-900">
            <div className="p-4">
              <div>Search</div>
              <div className="flex flex-col gap-2">
                <InputComponent
                  id={'song-search'}
                  name={'song-search'}
                  type={'string'}
                  label={'Search for songs'}
                  placeHolder={'Search for songs'}
                  value={songSearch}
                  onKeyDown={handleKeyDown}
                  onChange={(event) => setSongSearch(event.target.value)}
                />
                <div className="flex gap-2">
                  <ButtonComponent onClick={onSearch}>Search</ButtonComponent>
                  <ButtonComponent onClick={onClear}>Clear</ButtonComponent>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4">
            {currentResults &&
              currentResults.map((result, i) => {
                return (
                  <ItemTemplate
                    onClick={onItemClick}
                    item={result}
                    key={result.id}
                  />
                );
              })}
          </div>
        </div>
        <div className="flex-1 bg-orange-500 p-4 overflow-y-auto">
          <div>Play</div>
          {currentSong && (
            <div>
              <div>{currentSong.name}</div>
              <video ref={videoRef} controls>
                <source src={currentSong.preview_url} type="audio/mpeg" />
              </video>
              <div>
                <ButtonComponent type={'submit'} onClick={play}>
                  <PlayIcon className="h-6 w-6 text-white" />
                  Play
                </ButtonComponent>
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 bg-green-500 p-4 overflow-y-auto">
          <div>Connector</div>
          <ButtonComponent>
            <Link href="/api/spotify/login">Login with Spotify</Link>
          </ButtonComponent>
        </div>
      </div>
    </PageComponent>
  );
}

export function getServerSideProps() {
  return {
    props: { protected: true },
  };
}
