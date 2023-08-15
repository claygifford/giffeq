
import React from 'react';
import { usePlaylist } from '../../lib/context/playlist-context';
import styles from './player-selector.module.css';
import { PageMode, useLayout } from '../../lib/context/layout-context';

export default function PlaylistSelectorComponent() {
  const { playlists } = usePlaylist();
  const { changePageMode } = useLayout();

  const onSelectPlaylist = (playlist) => {
    if (playlist) {
      changePageMode(PageMode.Listening, playlist);
    } else {
      changePageMode(PageMode.Playlist);
    }
  };

  const onNewPlaylist = () => {
    changePageMode(PageMode.NewPlaylist);
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
