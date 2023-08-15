import React from 'react';
import styles from './settings.module.css';
import ButtonComponent from '../../lib/ui/button/button-component';
import BusyIcon from '../../lib/ui/icons/busy-icon';
import { usePlaylist } from '../../lib/context/playlist-context';
import { PageMode, useLayout } from '../../lib/context/layout-context';

export default function SettingsComponent() {
  const { changePageMode } = useLayout();
  const { deletePlaylist, deletePlaylistAction } = usePlaylist();
  const deleteEvent = async () => {
    await deletePlaylist();
    changePageMode(PageMode.Playlist);
  };
  return (
    <div className={styles.Settings}>
      <div>Dis Settings</div>
      <div className="p-2">
        <ButtonComponent
          labelText="Delete playlist"
          variant="action"
          onClick={deleteEvent}
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
