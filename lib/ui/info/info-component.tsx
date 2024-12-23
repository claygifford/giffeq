import React from "react";

export default function InfoComponent() {
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
