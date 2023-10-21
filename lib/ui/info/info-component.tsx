import React from 'react';

type InfoProps = {
  id: string;
  name: string;
  label: string;
  value: boolean | undefined;
  onChange?: any;
};
export default function InfoComponent(props: InfoProps) {
  const { label, name, id, value, onChange } = props;
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <div className="flex">
        <div>Playlist icon</div>
        <div>Playlist</div>
      </div>
      <div>
        Hey looks like there are no playlists yet. To start add a playlist
      </div>
    </div>
  );
}
