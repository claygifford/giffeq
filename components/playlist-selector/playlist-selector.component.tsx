
import React from 'react';
import { usePlaylist } from '../../lib/context/playlist-context';
import styles from './player-selector.module.css';
import { PageMode, useLayout } from '../../lib/context/layout-context';
import LoadingComponent from '../../lib/ui/loading/loading-component';

export default function PlaylistSelectorComponent() {
  const { playlists, getPlaylistsAction } = usePlaylist();
  const { changePageMode } = useLayout();

  const onSelectPlaylist = (playlist) => {
    if (playlist) {
      changePageMode(PageMode.Listening, playlist);
    } else {
      changePageMode(PageMode.Playlist);
    }
  };

  if (getPlaylistsAction.isBusy) 
    return <LoadingComponent></LoadingComponent>;
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
    </div>
  );
}
