import React from 'react';
import styles from './decisions.module.css';
import { XMarkIcon } from '@heroicons/react/24/outline';
import InputComponent from '../../lib/ui/input/input-component';
import SideBarButtonComponent from '../../lib/ui/side-bar/side-bar-button-component';
import { useSearch } from '../../lib/context/search-context';

const ItemTemplate = ({ item, isSelected }) => {
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

  return (
    <div
      className={`flex rounded py-1 px-2 items-center ${
        isSelected ? 'bg-indigo-200' : ''
      }`}
    >
      {/* <PlayButtonComponent></PlayButtonComponent>
      <DeleteButtonComponent></DeleteButtonComponent> */}
      <div className="font-medium truncate">{item.name}</div>
      {artist(item)}
    </div>
  );
};

export default function DecisionsComponent() {
  const { currentResults } = useSearch();

  return (
    <div className={styles.Decisions}>
      <div className="p-4">
        <div>Decisions </div>
        <div className="flex flex-col gap-2">
          <InputComponent
            id={'song-search'}
            name={'song-search'}
            type={'string'}
            placeHolder={'Search for songs'}
            autoComplete={'off'}
            spellCheck={false}
          >
            <>
              <SideBarButtonComponent>
                <XMarkIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
              </SideBarButtonComponent>
            </>
          </InputComponent>
        </div>
      </div>
      <div className="px-4 overflow-auto">
        {currentResults &&
          currentResults.map((result, i) => {
            return (
              <ItemTemplate
                item={result}
                key={result.id}
                isSelected={1 === result.id}
              />
            );
          })}
      </div>
    </div>
  );
}
