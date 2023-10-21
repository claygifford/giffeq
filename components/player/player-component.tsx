import { ForwardIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { PlayIcon, PlayCircleIcon } from '@heroicons/react/24/solid';

import { HandThumbUpIcon, PauseIcon } from '@heroicons/react/24/solid';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMusic } from '../../lib/context/music-context';
import { useEffectOnce } from '../../lib/hooks/use-effect-once';
import styles from './player.module.css';
import { usePlaylist } from '../../lib/context/playlist-context';
import { useSong } from '../../lib/context/song-context';
import ScoreComponent from '../../lib/ui/score/score';

export default function PlayerComponent() {
  const { playNextSong } = useSong();
  const { currentSong, autoPlay, setAutoPlay } = useMusic();
  const { songPlayed } = usePlaylist();
  const [isPlaying, setIsPlaying] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [duration, setDuration] = useState(null);
  const [elapsed, setElapsed] = useState(null);

  const audioRef = useRef<HTMLVideoElement>(null);

  const currentSongLoaded =
    audioRef && audioRef.current && audioRef.current.duration > 0;

  const onPlay = useCallback(() => {
    if (audioRef && audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        songPlayed(currentSong);
      } else audioRef.current.pause();
    }
  }, [currentSong, songPlayed]);

  const onAudioPlay = () => setIsPlaying(true);
  const onAudioPause = () => setIsPlaying(false);

  const onAudioEnded = () => {
    playNextSong();
  }

  const onAudioTimeUpdate = () => {
    if (audioRef && audioRef.current) {
      setElapsed(Math.round(audioRef.current.currentTime));
    }
  };

  const onAudioCanPlay = () => {
    if (audioRef && audioRef.current && audioRef.current.duration > 0) {      
      setCanPlay(true);
      setDuration({ start: 0, finish: Math.round(audioRef.current.duration) });
      setElapsed(0);
    } else {
      setCanPlay(false);
      setElapsed(null);
    }
  };

  const range = () => {
    return <>
      <input id="default-range" type="range" value="50" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
    </>;
  }
  useEffect(() => {
    if (autoPlay && canPlay && currentSong) {
      if (
        currentSongLoaded &&
        audioRef.current.currentSrc === autoPlay.preview_url
      ) {
        console.log(`yo: ${autoPlay} ${canPlay}`);
        setAutoPlay(null);
        onPlay();
      }
    }
  }, [autoPlay, canPlay, setAutoPlay, currentSong, onPlay, currentSongLoaded]);

  useEffectOnce(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('play', onAudioPlay);
      audioRef.current.addEventListener('pause', onAudioPause);
      audioRef.current.addEventListener('loadstart', onAudioCanPlay);
      audioRef.current.addEventListener('canplay', onAudioCanPlay);
      audioRef.current.addEventListener('timeupdate', onAudioTimeUpdate);
      audioRef.current.addEventListener('ended', onAudioEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('play', onAudioPlay);
        audioRef.current.removeEventListener('pause', onAudioPause);
        audioRef.current.removeEventListener('loadstart', onAudioCanPlay);
        audioRef.current.removeEventListener('canplay', onAudioCanPlay);
        audioRef.current.removeEventListener('timeupdate', onAudioTimeUpdate);
        audioRef.current.addEventListener('ended', onAudioEnded);
      }
    };
  });

  const getTime = (time) => {
    return new Date(time * 1000).toISOString().substring(14, 19);
  }
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
              {currentSong.artists.map((artist, i) => {
                if (!artist) return;
                return <span key={artist.id}>{artist.name}</span>;
              })}
            </div>
          </div>
        )}
      </div>
      <div className={styles.AudioPlayer}>
        <div>
          <ScoreComponent></ScoreComponent>
        </div>
        <div>
          <PlayCircleIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
        </div>
        <div className={styles.AudioPlayerPlay}>
          <div className="flex items-center gap-2">
            <button
              aria-label={'Thumbs up'}
              className="group relative flex justify-center rounded-full border border-transparent py-1 px-1 text-sm font-medium text-white hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-200"
            >
              <HandThumbUpIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem] text-red-500" />
            </button>
            <button
              aria-label={isPlaying ? 'Pause Song' : 'Play Song'}
              onClick={onPlay}
              disabled={!canPlay}
              className={`${
                canPlay
                  ? 'hover:bg-yellow-100 focus:ring-yellow-200 text-yellow-500'
                  : 'bg-gray-500 text-white'
              } group relative flex justify-center rounded-full border border-transparent py-2 px-2 text-sm font-medium text-black focus:outline-none focus:ring-2`}
            >
              {isPlaying ? (
                <PauseIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
              ) : (
                <PlayCircleIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem] pl-[2px]" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm">
              {audioRef?.current?.currentTime
                ? getTime(audioRef?.current.currentTime)
                : '0:00'}
            </div>
            {duration && range()}
            <div className="text-sm">
              {audioRef?.current?.duration
                ? getTime(audioRef?.current.duration)
                : '0:00'}
            </div>
          </div>
        </div>
        <div>
          <button
            aria-label={'Next Song'}
            className="group relative flex justify-center rounded-full border border-transparent py-1 px-1 text-sm font-medium text-white hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-200"
          >
            <ForwardIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem] text-blue-500" />
          </button>
        </div>
      </div>

      <div className={styles.ActionPanel}>
        <button
          aria-label={'Thumbs up'}
          className="group relative flex justify-center rounded-full border border-transparent py-1 px-1 text-sm font-medium text-white hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-200"
        >
          <HandThumbUpIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem] text-red-500" />
        </button>
        <button
          aria-label={'Thumbs down'}
          className="group relative flex justify-center rounded-full border border-transparent py-1 px-1 text-sm font-medium text-white hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-200"
        >
          <HandThumbDownIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem] text-orange-500" />
        </button>
        <button
          aria-label={'Thumbs up more'}
          className="group relative flex justify-center rounded-full border border-transparent py-1 px-1 text-sm font-medium text-white hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-200"
        >
          <HandThumbUpIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem] text-green-500" />
        </button>
      </div>
    </div>
  );
}
