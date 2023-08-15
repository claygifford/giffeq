import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { useMusic } from '../../lib/context/music-context';
import BusyIcon from '../../lib/ui/icons/busy-icon';
import InputComponent from '../../lib/ui/input/input-component';
import SideBarButtonComponent from '../../lib/ui/side-bar/side-bar-button-component';

import styles from './search.module.css';

const ItemTemplate = ({ item, onClick, isSelected }) => {
  const artist = (i) => {
    if (i.type === 'album' || i.type === 'track')
      return (
        <div className="flex px-2 gap-2 truncate">
          |{' '}
          {i.artists.map((artist, i) => {
            if (!artist) return;
            return <span key={artist.id}>{artist.name}</span>;
          })}
        </div>
      );
  };

  const onItemClick = () => {
    onClick(item);
  };

  const getClass = () => {
    switch (item.type) {
      case 'track':
        return 'bg-red-300';
      case 'album':
        return 'bg-blue-300';
      case 'artist':
        return 'bg-yellow-300';
    }
    return 'bg-gray-300';
  };

  return (
    <div
      className={`flex rounded py-1 px-2 items-center cursor-pointer ${
        isSelected ? 'bg-indigo-200' : ''
      }`}
      onClick={onItemClick}
    >
      <div className="font-medium truncate">{item.name}</div>
      {artist(item)}
      <div className={`${getClass()} rounded px-2 py-1 text-white ml-auto`}>
        {item.type}
      </div>
    </div>
  );
};

export default function SearchComponent() {
  const {
    isSearchingMusic, 
    selectItem,
    searchMusic,
    currentSong,
    currentResults,
    clearResults,
  } = useMusic();

  const [songSearch, setSongSearch] = useState('');

  const onItemClick = (item) => {
    selectItem(item);
  };

  useEffect(() => {
    if (songSearch) {
      searchMusic(songSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songSearch]);

  const onSearch = (search: string) => {
    setSongSearch(search);
  };

  const onClear = () => {
    clearResults();
    setSongSearch('');
  };

  return (
    <div className={styles.Search}>
      <div className="sticky top-0 bg-white dark:bg-slate-900">
        <div className="p-4">
          <div>Search</div>
          <div className="flex flex-col gap-2">
            <InputComponent
              id={'song-search'}
              name={'song-search'}
              type={'string'}
              placeHolder={'Search for songs'}
              value={songSearch}
              onChange={(event) => onSearch(event.target.value)}
              autoComplete={'off'}
              spellCheck={false}
            >
              <>
                <SideBarButtonComponent onClick={onClear}>
                  <XMarkIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
                </SideBarButtonComponent>
                {isSearchingMusic && <BusyIcon />}
              </>
            </InputComponent>
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
                isSelected={currentSong.id === result.id}
              />
            );
          })}
      </div>
    </div>
  );
}
