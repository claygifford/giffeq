
import React, {  } from 'react';
import { Playlist, usePlaylist } from '../../lib/context/playlist-context';
import styles from './player-selector.module.css';

export default function PlaylistSelectorComponent() {
  const { selectPlaylist, selectNewPlaylist } = usePlaylist();

  const onSelectPlaylist = (playlist) => {
    selectPlaylist(playlist);
  };

  const onNewPlaylist = () => {
    selectNewPlaylist();
  };

  return (
    <div className="flex flex-1 items-center justify-center gap-4">
      <div
        className={styles.SelectorItem}
        onClick={() => onSelectPlaylist({name: 'Playlist 1'})}
      >
        Playlist 1
      </div>
      <div className={styles.SelectorNewItem} onClick={() => onNewPlaylist()}>
        + New
      </div>
    </div>
  );
}
