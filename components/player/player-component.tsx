/* eslint-disable @next/next/no-img-element */
import {
  HandThumbDownIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid";

import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import React from "react";
import styles from "./player.module.css";
import ScoreComponent from "../../lib/ui/score/score";
import ButtonComponent from "../../lib/ui/button/button-component";
import { getMilliseconds } from "../../lib/clients/spotify";
import { useMusic } from "../../lib/context/music-context";
import { usePlaylist } from "../../lib/context/playlist-context";
import SoundComponent from "./sound/sound-component";
import DurationComponent from "./duration/duration-component";

export default function PlayerComponent() {
  const {
    isPlaying,
    progress,
    currentTrack,
    pauseSong,
    resumeSong,
    dislikeSong,
    likeSong,
  } = useMusic();
  const { playlist } = usePlaylist();

  const getTrackTime = () => {
    if (progress) return getMilliseconds(progress);
    return "0:00";
  };

  const getTrackDuration = () => {
    if (currentTrack && currentTrack.duration_ms)
      return getMilliseconds(currentTrack.duration_ms);
    return "0:00";
  };

  const getDuration = () => {
    if (currentTrack && progress) {
      return { value: progress, max: currentTrack.duration_ms };
    }
    return undefined;
  };
  const duration = getDuration();

  const onPlay = () => {
    if (isPlaying) pauseSong();
    else resumeSong();
  };

  const onLike = () => {
    likeSong(playlist.id);
  };

  const onDislike = () => {
    dislikeSong(playlist.id);
  };

  const onSeek = (value: number) => {
    console.log(`${value}`);
  };

  const canPlay = !!currentTrack;

  return (
    <div className={styles.Player}>
      {currentTrack && (
        <div className={styles.CurrentSongControls}>
          <div className={styles.CurrentSongScoreContainer}>
            <ScoreComponent></ScoreComponent>
          </div>
          <div className={styles.CurrentSongImgContainer}>
            <img
              src={currentTrack.album.images[0].url}
              width={200}
              height={200}
              alt="Picture of the author"
            />
          </div>
          <div className={styles.CurrentSongNextContainer}>Next</div>
        </div>
      )}
      <div className={styles.CurrentSongContainer}>
        {currentTrack && (
          <div className={styles.CurrentSong}>
            <div className={styles.CurrentSongName}>
              <div className="flex gap-1">
                <span className="font-medium">{currentTrack.name}</span>
              </div>
              <div className="flex gap-1">
                {currentTrack.artists.map((artist) => {
                  if (!artist) return;
                  return <span key={artist.uri}>{artist.name}</span>;
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.AudioPlayer}>
        {/* <ButtonComponent
          variant="player"
          aria-label={isPlaying() ? 'Pause Song' : 'Play Song'}
          onClick={onPlay}
        >
          <ArrowUturnLeftIcon className="fill-blue-900 h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
        </ButtonComponent> */}

        {/* <ButtonComponent
          variant="player"
          aria-label={isPlaying() ? 'Pause Song' : 'Play Song'}
          onClick={onPlay}
          //disabled={!canPlay}
        >
          <ArrowUturnLeftIcon className="fill-blue-900 h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
        </ButtonComponent> */}
        <div className={styles.AudioPlayerControls}>
          <div className="flex justify-center">
            <ButtonComponent
              variant="player"
              aria-label={isPlaying ? "Pause Song" : "Play Song"}
              onClick={onPlay}
              disabled={!canPlay}
            >
              {isPlaying ? (
                <PauseCircleIcon className="h-14 w-14 min-h-[3.5rem] min-w-[3.5rem]" />
              ) : (
                <PlayCircleIcon className="h-14 w-14 min-h-[3.5rem] min-w-[3.5rem]" />
              )}
            </ButtonComponent>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`text-blue-900 flex text-sm min-w[36px] justify-end ${styles.digital7}`}
            >
              {getTrackTime()}
            </div>
            <DurationComponent
              duration={duration}
              onSeek={onSeek}
            ></DurationComponent>
            <div
              className={`flex text-blue-900 text-sm min-w[36px] ${styles.digital7}`}
            >
              {getTrackDuration()}
            </div>
          </div>
        </div>
        {/* <ButtonComponent
          variant="player"
          aria-label={isPlaying() ? 'Pause Song' : 'Play Song'}
          onClick={onPlay}
          //disabled={!canPlay}
        >
          <ArrowUturnRightIcon className="fill-blue-900 h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
        </ButtonComponent> */}

        {/* <ButtonComponent
          variant="player"
          aria-label={isPlaying() ? 'Pause Song' : 'Play Song'}
          onClick={onPlay}
          // disabled={!canPlay}
        >
          <BackwardIcon className="fill-blue-900 h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
        </ButtonComponent>
        <ButtonComponent
          variant="player"
          aria-label={isPlaying() ? 'Pause Song' : 'Play Song'}
          onClick={onPlay}
          // disabled={!canPlay}
        >
          <ForwardIcon className="fill-blue-900 h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
        </ButtonComponent> */}
      </div>
      <div className={styles.ActionPanel}>
        <ButtonComponent
          variant="player"
          aria-label="Dislike Song"
          onClick={onDislike}
          disabled={!canPlay}
        >
          <HandThumbDownIcon className="h-8 w-8 min-h-[1.5rem] min-w-[1.5rem]" />
        </ButtonComponent>
        <ButtonComponent
          variant="player"
          aria-label="Like Song"
          onClick={onLike}
          disabled={!canPlay}
        >
          <HandThumbUpIcon className="h-8 w-8 min-h-[1.5rem] min-w-[1.5rem]" />
        </ButtonComponent>
        <SoundComponent></SoundComponent>
        <EllipsisVerticalIcon className="fill-blue-900 h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
      </div>
    </div>
  );
}
