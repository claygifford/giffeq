import React, { useEffect, useState } from 'react';
import styles from './history.module.css';
import { usePlaylist } from '../../lib/context/playlist-context';
import { XMarkIcon } from '@heroicons/react/24/outline';
import BusyIcon from '../../lib/ui/icons/busy-icon';
import InputComponent from '../../lib/ui/input/input-component';
import SideBarButtonComponent from '../../lib/ui/side-bar/side-bar-button-component';
import PlayButtonComponent from '../../lib/ui/buttons/play-button';
import { useMusic } from '../../lib/context/music-context';
import DeleteButtonComponent from '../../lib/ui/buttons/delete-button';


const ItemTemplate = ({ item, onPlay, onDelete, isSelected }) => {
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
      <PlayButtonComponent onClick={onPlay}></PlayButtonComponent>
      <DeleteButtonComponent onClick={onDelete}></DeleteButtonComponent>
      <div className="font-medium truncate">{item.name}</div>
      {artist(item)}
    </div>
  );
};

export default function HistoryComponent() {
  //const { currentResults, clearResults } = useMusic();

    const { selectItem } = useMusic();
    
  const {playlist} = usePlaylist();

  //isSearchingHistory
  //currentResults

  const [songSearch, setSongSearch] = useState('');

  const onPlay = (item) => {
    item.type = 'track';
    selectItem(item, true);
  };

  const onDelete = (index) => {
    //item.type = 'track';
    //selectItem(item, true);
    playlist.history = [];
  };

  // useEffect(() => {
  //   if (songSearch) {
  //     searchMusic(songSearch);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [songSearch]);

  const isSearchingHistory = false;
  const onSearch = (search: string) => {
    setSongSearch(search);
  };

  const onClear = () => {
    //clearResults();
    setSongSearch('');
  };

  return (
    <div className={styles.History}>
      <div className="sticky top-0 bg-white dark:bg-slate-900">
        <div className="p-4">
          <div>History</div>
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
                {isSearchingHistory && <BusyIcon />}
              </>
            </InputComponent>
          </div>
        </div>
      </div>
      <div className="px-4">
        {playlist &&
          playlist.history?.map((result, i) => {
            return (
              <ItemTemplate
                onPlay={onPlay}
                onDelete={() => onDelete(i)}
                item={result}
                key={i}
                isSelected={false}
                //isSelected={currentSong.id === result.id}
              />
            );
          })}
      </div>
    </div>
  );
}
