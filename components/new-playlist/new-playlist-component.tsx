
import React, { FormEvent, useState } from 'react';
import { usePlaylist } from '../../lib/context/playlist-context';
import BackButtonComponent from '../../lib/ui/buttons/back-button';
import ButtonComponent from '../../lib/ui/button/button-component';
import BusyIcon from '../../lib/ui/icons/busy-icon';
import InputComponent from '../../lib/ui/input/input-component';
import { PageMode, useLayout } from '../../lib/context/layout-context';

export default function NewPlaylistComponent() {
  const { changePageMode } = useLayout();
  const { createPlaylist, createPlaylistAction } = usePlaylist();
  const [yo, setYo] = useState({ name: '' });
  const [name, setName] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const playlist = await createPlaylist({ name });
    changePageMode(PageMode.Listening, playlist);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex">
        <BackButtonComponent
          onClick={() => changePageMode(PageMode.Playlist)}
        ></BackButtonComponent>
      </div>
      <div className="flex flex-1 items-center justify-center gap-4">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>Yo new playlist? {yo.name}</div>
          <InputComponent
            id={'playlist-name'}
            name={'playlist-name'}
            type={'text'}
            label={'Playlist Name'}
            placeHolder={'Playlist Name'}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <div>
            <ButtonComponent
              labelText="Create playlist"
              type={'submit'}
              variant="action"
              disabled={createPlaylistAction.isBusy}
            >
              {createPlaylistAction.isBusy && <BusyIcon />}{' '}
              {createPlaylistAction.isBusy
                ? 'Creating playlist...'
                : 'Create playlist'}
            </ButtonComponent>
          </div>
        </form>
      </div>
    </div>
  );
}
