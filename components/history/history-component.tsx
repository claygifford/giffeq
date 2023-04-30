import React from 'react';
import styles from './history.module.css';
import { usePlaylist } from '../../lib/context/playlist-context';

export default function HistoryComponent() {  
  const { playlist } = usePlaylist();

  return (
    <div className={styles.History}>
      <div>Dis History</div>
      {playlist && playlist.history?.map(h => {
        return <div key={1}>{h.name}</div>
      })}
    </div>
  );
}
