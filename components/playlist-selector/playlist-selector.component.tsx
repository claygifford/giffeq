import React from "react";
import { usePlaylist } from "../../lib/context/playlist-context";
import styles from "./player-selector.module.css";
import { PageMode, useLayout } from "../../lib/context/layout-context";
import LoadingComponent from "../../lib/ui/loading/loading-component";
import {
  MusicalNoteIcon,
  SparklesIcon,
  LightBulbIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import InfoComponent from "../../lib/ui/info/info-component";

export default function PlaylistSelectorComponent() {
  const { playlists, getPlaylistsAction } = usePlaylist();
  const { changePageMode, colors } = useLayout();

  const onSelectPlaylist = (playlist) => {
    if (playlist) {
      changePageMode(PageMode.Listening, playlist);
    } else {
      changePageMode(PageMode.Playlist);
    }
  };

  const getBackground = () => {
    return (
      <div className="absolute h-full w-full">
        <div className={`flex absolute top-8 left-1/2 -translate-x-1/2`}>
          <LightBulbIcon
            stroke={`${colors[0]}`}
            className={`h-8 w-8`}
          ></LightBulbIcon>
          <MusicalNoteIcon
            stroke={`${colors[1]}`}
            className={`h-8 w-8`}
          ></MusicalNoteIcon>
          <SparklesIcon
            stroke={`${colors[2]}`}
            className={`h-8 w-8`}
          ></SparklesIcon>
        </div>
        <div className={`flex absolute bottom-8 left-1/2 -translate-x-1/2`}>
          <PlayIcon className={`h-8 w-8 text-${colors[3]}-500`}></PlayIcon>
        </div>
      </div>
    );
  };
  if (getPlaylistsAction.isBusy) return <LoadingComponent></LoadingComponent>;
  if (playlists && playlists.length === 0)
    return (
      <InfoComponent id={""} name={""} label={""} value={false}></InfoComponent>
    );
  return (
    <div className="flex flex-1 flex-wrap content-center items-center justify-center gap-4">
      {playlists?.map((i) => (
        <div
          key={i.id}
          className={styles.SelectorItem}
          onClick={() => onSelectPlaylist(i)}
        >
          {getBackground()}
          {i.name}
        </div>
      ))}
    </div>
  );
}
