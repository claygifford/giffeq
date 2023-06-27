
import React from 'react';
import styles from './new-playlist.module.css';

export default function NewPlaylistComponent() {

  return (
    <div className="flex flex-1 items-center justify-center gap-4">
      <div>Yo new playlist?</div>
      <div>
        <button
          aria-label="Create playlist"
          onClick={() => console.log('wow ser!')}
          className="bg-blue-200 flex whitespace-nowrap items-center group relative w-full justify-center rounded-full border border-transparent py-5 px-10 text-xl font-medium text-gray-800 hover:bg-blue-100 hover:ring-blue-300 hover:ring-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Create playlist
        </button>
      </div>
    </div>
  );
}
