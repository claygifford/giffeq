import {
  ForwardIcon,
  BackwardIcon,
  HandThumbDownIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  SpeakerWaveIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/solid';

import { HandThumbUpIcon, PauseIcon } from '@heroicons/react/24/solid';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMusic } from '../../lib/context/music-context';
import { useEffectOnce } from '../../lib/hooks/use-effect-once';
import styles from './player.module.css';
import { usePlaylist } from '../../lib/context/playlist-context';
import { useSong } from '../../lib/context/song-context';
import ScoreComponent from '../../lib/ui/score/score';
import ButtonComponent from '../../lib/ui/button/button-component';
import RangeInputComponent from '../../lib/ui/range/range-component';

export default function PlayerComponent() {
  const { playNextSong } = useSong();
  const { currentSong, autoPlay, setAutoPlay } = useMusic();
  const { songPlayed } = usePlaylist();
  const [isPlaying, setIsPlaying] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [duration, setDuration] = useState(null);
  const [elapsed, setElapsed] = useState(null);

  const [audioRef, setAudioRef] = useState<HTMLAudioElement>(null);
  //const audioRef = useRef<HTMLVideoElement>(null);

  const currentSongLoaded =
    audioRef && audioRef.duration > 0;

  const onPlay = useCallback(() => {
    if (audioRef) {
      if (audioRef.paused) {
        audioRef.play();
        songPlayed(currentSong);
      } else audioRef.pause();
    }
    console.log(`paused: ${audioRef?.paused}`);
  }, [audioRef, currentSong, songPlayed]);

  const onAudioPlay = () => setIsPlaying(true);
  const onAudioPause = () => setIsPlaying(false);

  const onAudioEnded = () => {
    playNextSong();
  }

  const onAudioTimeUpdate = () => {
    if (audioRef) {
      setElapsed(Math.round(audioRef.currentTime));
    }
  };

  const onAudioCanPlay = () => {
    if (audioRef && audioRef.duration > 0) {      
      setCanPlay(true);
      setDuration({ start: 0, finish: Math.round(audioRef.duration) });
      setElapsed(0);
    } else {
      setCanPlay(false);
      setElapsed(null);
    }
  };

  useEffect(() => {
    if (autoPlay && canPlay && currentSong) {
      if (
        currentSongLoaded &&
        audioRef.currentSrc === autoPlay.preview_url
      ) {
        console.log(`yo: ${autoPlay} ${canPlay}`);
        setAutoPlay(null);
        onPlay();
      }
    }
  }, [autoPlay, canPlay, setAutoPlay, currentSong, onPlay, currentSongLoaded, audioRef]);

  useEffect(() => {
      if (audioRef) {
        audioRef.addEventListener('play', onAudioPlay);
        audioRef.addEventListener('pause', onAudioPause);
        audioRef.addEventListener('loadstart', onAudioCanPlay);
        audioRef.addEventListener('canplay', onAudioCanPlay);
        audioRef.addEventListener('timeupdate', onAudioTimeUpdate);
        audioRef.addEventListener('ended', onAudioEnded);
      }
      return () => {
        if (audioRef) {
          audioRef.removeEventListener('play', onAudioPlay);
          audioRef.removeEventListener('pause', onAudioPause);
          audioRef.removeEventListener('loadstart', onAudioCanPlay);
          audioRef.removeEventListener('canplay', onAudioCanPlay);
          audioRef.removeEventListener('timeupdate', onAudioTimeUpdate);
          audioRef.addEventListener('ended', onAudioEnded);
        }
      };
  }, [audioRef]);
  // useEffectOnce(() => {
  //   if (audioRef) {
  //     //audioRef.current.addEventListener('play', onAudioPlay);
  //     //audioRef.current.addEventListener('pause', onAudioPause);
  //     audioRef.addEventListener('loadstart', onAudioCanPlay);
  //     audioRef.addEventListener('canplay', onAudioCanPlay);
  //     audioRef.addEventListener('timeupdate', onAudioTimeUpdate);
  //     audioRef.addEventListener('ended', onAudioEnded);
  //   }

  //   return () => {
  //     if (audioRef) {
  //       //audioRef.current.removeEventListener('play', onAudioPlay);
  //       //audioRef.current.removeEventListener('pause', onAudioPause);
  //       audioRef.removeEventListener('loadstart', onAudioCanPlay);
  //       audioRef.removeEventListener('canplay', onAudioCanPlay);
  //       audioRef.removeEventListener('timeupdate', onAudioTimeUpdate);
  //       audioRef.addEventListener('ended', onAudioEnded);
  //     }
  //   };
  // });

  const getTime = (time) => {
    return new Date(time * 1000).toISOString().substring(14, 19);
  }
  useEffect(() => {
    if (audioRef) audioRef.load();
  }, [audioRef, currentSong]);

  const refCallbackFn = useCallback((node: HTMLAudioElement) => {
    if (node) {
      // do something with the node
      console.log('ref callback called ', node.innerHTML);
      // set parent state conditionally
      setIsPlaying(!node.paused);
      //if (node.innerHTML.length > 5) {
        //setPstate((prevState) => {
      //    return { pState: prevState + 1 };
     //  });
      //}
    }
    setAudioRef(node);
    //audioRef.current = node;
    //return node;
  }, []);  

  // const isPlaying = () => {
  //   if (audioRef && audioRef.current) {
  //     console.log('asdasd');
  //     return !audioRef.current.paused;
  //   }
  //   console.log('wut face?');
  //   return false;
  // }

  return (
    <div className={styles.Player}>
      <audio ref={refCallbackFn} className="invisible h-0 w-0">
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
        <ButtonComponent
          variant="player"
          aria-label={isPlaying ? 'Pause Song' : 'Play Song'}
          onClick={onPlay}
          disabled={!canPlay}
        >
          <ArrowUturnLeftIcon className="fill-blue-900 h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
        </ButtonComponent>
        <ButtonComponent
          variant="player"
          aria-label={isPlaying ? 'Pause Song' : 'Play Song'}
          onClick={onPlay}
          disabled={!canPlay}
        >
          {audioRef.paused ? (
            <PlayCircleIcon className="fill-blue-900 h-14 w-14 min-h-[3.5rem] min-w-[3.5rem]" />
          ) : (
            <PauseCircleIcon className="fill-blue-900 h-14 w-14 min-h-[3.5rem] min-w-[3.5rem]" />
          )}
        </ButtonComponent>
        <ButtonComponent
          variant="player"
          aria-label={isPlaying ? 'Pause Song' : 'Play Song'}
          onClick={onPlay}
          disabled={!canPlay}
        >
          <ArrowUturnRightIcon className="fill-blue-900 h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
        </ButtonComponent>
        <div className={styles.AudioPlayerPlay}>
          <div className="flex items-center gap-2">
            <div className="flex text-sm min-w[36px] justify-end">
              {audioRef?.currentTime ? getTime(audioRef?.currentTime) : '0:00'}
            </div>
            {duration && (
              <RangeInputComponent
                value={audioRef?.currentTime}
                min={0}
                max={audioRef?.duration}
              ></RangeInputComponent>
            )}
            <div className="flex text-sm min-w[36px]">
              {audioRef?.duration ? getTime(audioRef?.duration) : '0:00'}
            </div>
          </div>
        </div>
        <ButtonComponent
          variant="player"
          aria-label={isPlaying ? 'Pause Song' : 'Play Song'}
          onClick={onPlay}
          disabled={!canPlay}
        >
          <BackwardIcon className="fill-blue-900 h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
        </ButtonComponent>
        <ButtonComponent
          variant="player"
          aria-label={isPlaying ? 'Pause Song' : 'Play Song'}
          onClick={onPlay}
          disabled={!canPlay}
        >
          <ForwardIcon className="fill-blue-900 h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
        </ButtonComponent>
      </div>

      <div className={styles.ActionPanel}>
        <ButtonComponent
          variant="player"
          aria-label={isPlaying ? 'Pause Song' : 'Play Song'}
          onClick={onPlay}
          disabled={!canPlay}
        >
          <HandThumbDownIcon className="fill-blue-900 h-8 w-8 min-h-[1.5rem] min-w-[1.5rem]" />
        </ButtonComponent>
        <ButtonComponent
          variant="player"
          aria-label={isPlaying ? 'Pause Song' : 'Play Song'}
          onClick={onPlay}
          disabled={!canPlay}
        >
          <HandThumbUpIcon className="fill-blue-900 h-8 w-8 min-h-[1.5rem] min-w-[1.5rem]" />
        </ButtonComponent>
        <SpeakerWaveIcon className="fill-blue-900 h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
        <EllipsisVerticalIcon className="fill-blue-900 h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
      </div>
    </div>
  );
}
