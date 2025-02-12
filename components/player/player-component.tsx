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
import RangeInputComponent from "../../lib/ui/range/range-component";
import { getMilliseconds } from "../../lib/clients/spotify";
import { useMusic } from "../../lib/context/music-context";
import { usePlaylist } from "../../lib/context/playlist-context";
import SoundComponent from "./sound/sound-component";

export default function PlayerComponent() {
  const { currentTrack, pauseSong, resumeSong, dislikeSong, likeSong, track } =
    useMusic();
  const { playlist } = usePlaylist();

  const isPlaying = () => {
    return track?.is_playing;
  };

  const getTrackTime = () => {
    if (track && track.progress_ms) return getMilliseconds(track.progress_ms);

    return "00:00";
  };

  const getTrackDuration = () => {
    if (track && track.item && track.item.duration_ms)
      return getMilliseconds(track.item.duration_ms);
    return "00:00";
  };

  const getDuration = () => {
    if (track && track.progress_ms) {
      return { value: track.progress_ms, max: track.item.duration_ms };
    }
    return undefined;
  };
  const duration = getDuration();

  const onPlay = () => {
    if (isPlaying()) pauseSong();
    else resumeSong();
  };

  const onLike = () => {
    likeSong(playlist.id);
  };

  const onDislike = () => {
    dislikeSong(playlist.id);
  };

  return (
    <div className={styles.Player}>
      {currentTrack && (
        <div className={styles.CurrentSongImgContainer}>
          <img
            src={currentTrack.album.images[0].url}
            width={500}
            height={500}
            alt="Picture of the author"
          />
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
        <div>
          <ScoreComponent></ScoreComponent>
        </div>

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
              aria-label={isPlaying() ? "Pause Song" : "Play Song"}
              onClick={onPlay}
              //disabled={!canPlay}
            >
              {isPlaying() ? (
                <PauseCircleIcon className="fill-blue-900 h-14 w-14 min-h-[3.5rem] min-w-[3.5rem]" />
              ) : (
                <PlayCircleIcon className="fill-blue-900 h-14 w-14 min-h-[3.5rem] min-w-[3.5rem]" />
              )}
            </ButtonComponent>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex text-sm min-w[36px] justify-end">
              {getTrackTime()}
              {/* {audioRef?.currentTime
                ? getTimestamp(audioRef?.currentTime)
                : "00:00"} */}
            </div>
            {duration && (
              <RangeInputComponent
                value={duration.value}
                min={0}
                max={duration.max}
                onChange={() => console.log("asd")}
              ></RangeInputComponent>
            )}
            <div className="flex text-sm min-w[36px]">{getTrackDuration()}</div>
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
          aria-label={isPlaying() ? "Pause Song" : "Play Song"}
          onClick={onDislike}
          // disabled={!canPlay}
        >
          <HandThumbDownIcon className="fill-blue-900 h-8 w-8 min-h-[1.5rem] min-w-[1.5rem]" />
        </ButtonComponent>
        <ButtonComponent
          variant="player"
          aria-label={isPlaying() ? "Pause Song" : "Play Song"}
          onClick={onLike}
          // disabled={!canPlay}
        >
          <HandThumbUpIcon className="fill-blue-900 h-8 w-8 min-h-[1.5rem] min-w-[1.5rem]" />
        </ButtonComponent>
        <SoundComponent></SoundComponent>
        <EllipsisVerticalIcon className="fill-blue-900 h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
      </div>
    </div>
  );
}
