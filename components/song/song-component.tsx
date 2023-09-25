import React from 'react';
import styles from './song.module.css';
import { useMusic } from '../../lib/context/music-context';
import { HandThumbUpIcon } from '@heroicons/react/24/solid';
import { HandThumbDownIcon } from '@heroicons/react/24/outline';

export default function SongComponent() {
  const { currentSong } = useMusic();
  return (
    <div className={styles.Song}>
      <div className="p-4">Current Song</div>
      <div className="flex">
        <div className="p-4">
          <div>{currentSong.name}</div>
          <div>{currentSong.artists.map((a) => a.name)}</div>
        </div>
        <div className="flex items-center">
          <button
            aria-label={'Thumbs up'}
            className="group relative flex justify-center rounded-full border border-transparent py-1 px-1 text-sm font-medium text-white hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-200"
          >
            <HandThumbUpIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem] text-green-500" />
          </button>
          <button
            aria-label={'Thumbs down'}
            className="group relative flex justify-center rounded-full border border-transparent py-1 px-1 text-sm font-medium text-white hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-200"
          >
            <HandThumbDownIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem] text-red-500" />
          </button>
        </div>
      </div>
      <div>Score</div>
      <div>

      </div>      
    </div>
  );
}
