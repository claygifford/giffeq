
import React, { useEffect } from 'react';
import { usePlaylist } from '../../lib/context/playlist-context';
import styles from './player-selector.module.css';

export default function PlaylistSelectorComponent() {
  const { playlists, selectPlaylist, selectNewPlaylist } = usePlaylist();
 
  const onSelectPlaylist = (playlist) => {
    selectPlaylist(playlist);
  };

  const onNewPlaylist = () => {
    selectNewPlaylist();
  };

  return (
    <div className="flex flex-1 flex-wrap content-center items-center justify-center gap-4">
      {playlists?.map((i) => (
        <div
          key={i.id}
          className={styles.SelectorItem}
          onClick={() => onSelectPlaylist(i)}
        >
          {i.name}
        </div>
      ))}
      <div className={styles.SelectorNewItem} onClick={() => onNewPlaylist()}>
        + New
      </div>
    </div>
  );
}
