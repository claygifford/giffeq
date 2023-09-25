import React from 'react';
import styles from './settings.module.css';
import ButtonComponent from '../../lib/ui/button/button-component';
import BusyIcon from '../../lib/ui/icons/busy-icon';
import { usePlaylist } from '../../lib/context/playlist-context';
import { PageMode, useLayout } from '../../lib/context/layout-context';
import CheckboxInputComponent from '../../lib/ui/input/checkbox-input-component';
import { usePreferences } from '../../lib/context/preferences-context';

export default function SettingsComponent() {
  const { changePageMode } = useLayout();
  const { setPreference, preferences } = usePreferences();
  const { deletePlaylist, deletePlaylistAction } = usePlaylist();
  const deleteEvent = async () => {
    await deletePlaylist();
    changePageMode(PageMode.Playlist);
  };

  return (
    <div className={styles.Settings}>
      <div className="p-4">Settings</div>
      <div className="p-2">Auto play song</div>
      <CheckboxInputComponent
        id={'auto-play-song'}
        name={'auto-play-song'}
        label={'Auto play song'}
        value={preferences.AutoPlaySong}
        onChange={(event) => setPreference('AutoPlaySong', event.target.value)}
      />
      <div className="p-2">
        <ButtonComponent
          labelText="Delete playlist"
          variant="action"
          size="sm"
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
