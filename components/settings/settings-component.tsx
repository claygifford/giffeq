import React from 'react';
import styles from './settings.module.css';
import ButtonComponent from '../../lib/ui/button/button-component';
import BusyIcon from '../../lib/ui/icons/busy-icon';
import { usePlaylist } from '../../lib/context/playlist-context';

export default function SettingsComponent() {
  const { deletePlaylist, deletePlaylistAction } = usePlaylist();
  return (
    <div className={styles.Settings}>
      <div>Dis Settings</div>
      <div className='p-2'>
        <ButtonComponent
          labelText="Delete playlist"
          variant="action"
          onClick={deletePlaylist}
          disabled={deletePlaylistAction.isBusy}
        >
          {deletePlaylistAction.isBusy && <BusyIcon />}{' '}
          {deletePlaylistAction.isBusy
            ? 'Deleting playlist...'
            : 'Delete playlist'}
        </ButtonComponent>
      </div>
    </div>
  );
}
