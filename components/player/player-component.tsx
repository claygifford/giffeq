import {
  ForwardIcon,
  HandThumbDownIcon,
} from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';

import { HandThumbUpIcon, PauseIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useRef, useState } from 'react';
import { useMusic } from '../../lib/context/music-context';
import { useEffectOnce } from '../../lib/hooks/use-effect-once';
import styles from './player.module.css';

export default function PlayerComponent() {
  const { currentSong } = useMusic();
  const [isPlaying, setIsPlaying] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [duration, setDuration] = useState(null);
  const [elapsed, setElapsed] = useState(null);

  const audioRef = useRef<HTMLVideoElement>(null);

  const onPlay = () => {
    if (audioRef && audioRef.current) {
      if (audioRef.current.paused) audioRef.current.play();
      else audioRef.current.pause();
    }
  };

  const onAudioPlay = () => {setIsPlaying(true);};

  const onAudioPause = () => {setIsPlaying(false);}
  const onAudioTimeUpdate = () => {
    if (audioRef && audioRef.current) {
      setElapsed(Math.round(audioRef.current.currentTime));
    }
  };

  const onAudioCanPlay = () => {
    if (audioRef && audioRef.current && audioRef.current.duration > 0) {
      setIsPlaying(false);
      setCanPlay(true);
      setDuration({ start: 0, finish: Math.round(audioRef.current.duration) });
      setElapsed(0);
    } else {
      setIsPlaying(false);
      setCanPlay(false);
      setElapsed(null);
    }
  };

  useEffectOnce(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('play', onAudioPlay);
      audioRef.current.addEventListener('pause', onAudioPause);
      audioRef.current.addEventListener('loadstart', onAudioCanPlay);
      audioRef.current.addEventListener('canplay', onAudioCanPlay);
      audioRef.current.addEventListener('timeupdate', onAudioTimeUpdate);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('play', onAudioPlay);
        audioRef.current.removeEventListener('pause', onAudioPause);
        audioRef.current.removeEventListener('loadstart', onAudioCanPlay);
        audioRef.current.removeEventListener('canplay', onAudioCanPlay);
        audioRef.current.removeEventListener('timeupdate', onAudioTimeUpdate);
      }
    }
  });

  useEffect(() => {
    if (audioRef && audioRef.current) audioRef.current.load();
  }, [currentSong]);

  return (
    <div className={styles.Player}>
      <audio ref={audioRef} className="invisible h-0 w-0">
        <source src={currentSong?.preview_url} type="audio/mpeg" />
      </audio>
      <div className={styles.CurrentSongContainer}>
        {currentSong && (
          <div className={styles.CurrentSong}>
            <div className="flex gap-1">
              Name:<span className="font-medium">{currentSong.name}</span>
            </div>
            <div className="flex gap-1">
              Artist:
              {currentSong.artists.map((artist, i) => (
                <span key={artist.id}>{artist.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className={styles.AudioPlayer}>
        <div>
          <div>Score</div>
          <div>56%</div>
        </div>
        <div className={styles.AudioPlayerPlay}>
          <button
            onClick={onPlay}
            disabled={!canPlay}
            className={`${
              canPlay
                ? 'hover:bg-yellow-100 focus:ring-yellow-200 text-yellow-500'
                : 'bg-gray-500 text-white'
            } group relative flex justify-center rounded-full border border-transparent py-2 px-2 text-sm font-medium text-black focus:outline-none focus:ring-2`}
          >
            {isPlaying ? (
              <PauseIcon className="h-6 w-6" />
            ) : (
              <PlayIcon className="h-6 w-6" />
            )}
          </button>
          {elapsed ? <div>{elapsed}</div> : <div>-</div>}
          {duration && (
            <div>
              {duration.start} - {duration.finish}
            </div>
          )}
        </div>
        <div>
          <button className="group relative flex justify-center rounded-full border border-transparent py-1 px-1 text-sm font-medium text-white hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-200">
            <ForwardIcon className="h-6 w-6 text-blue-500" />
          </button>
        </div>
      </div>

      <div className={styles.ActionPanel}>
        <button className="group relative flex justify-center rounded-full border border-transparent py-1 px-1 text-sm font-medium text-white hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-200">
          <HandThumbUpIcon className="h-6 w-6 text-red-500" />
        </button>
        <button className="group relative flex justify-center rounded-full border border-transparent py-1 px-1 text-sm font-medium text-white hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-200">
          <HandThumbDownIcon className="h-6 w-6 text-orange-500" />
        </button>
        <button className="group relative flex justify-center rounded-full border border-transparent py-1 px-1 text-sm font-medium text-white hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-200">
          <HandThumbUpIcon className="h-6 w-6 text-green-500" />
        </button>
      </div>
    </div>
  );
}
