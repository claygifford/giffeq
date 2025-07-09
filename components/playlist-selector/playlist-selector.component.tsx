import React from "react";
import { usePlaylist } from "../../lib/context/playlist-context";
import styles from "./player-selector.module.css";
import { PageMode, useLayout } from "../../lib/context/layout-context";
import LoadingComponent from "../../lib/ui/loading/loading-component";
import { PlayIcon } from "@heroicons/react/24/outline";
import InfoComponent from "../../lib/ui/info/info-component";
import LineBackgroundComponent from "../cards/line-background-component";
import CandyBackgroundComponent from "../cards/candy-background-component";

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

  const getBackgroundCandy = (index: number) => {
    if (index === 0)
      return (
        <LineBackgroundComponent colors={colors}></LineBackgroundComponent>
      );
    return (
      <CandyBackgroundComponent
        colors={colors}
        index={index}
      ></CandyBackgroundComponent>
    );
  };

  const getBackground = (index: number) => {
    return (
      <div className="absolute h-full w-full">
        {getBackgroundCandy(index)}
        <div className={`flex absolute bottom-8 left-1/2 -translate-x-1/2`}>
          <PlayIcon className={`h-8 w-8 text-${colors[3]}-500`}></PlayIcon>
        </div>
      </div>
    );
  };

  if (getPlaylistsAction.isBusy) return <LoadingComponent></LoadingComponent>;
  if (playlists && playlists.length === 0)
    return <InfoComponent></InfoComponent>;
  return (
    <div className="flex flex-1 flex-wrap content-center items-center justify-center gap-4">
      {playlists?.map((i, index) => (
        <div
          key={i.id}
          className={styles.SelectorItem}
          onClick={() => onSelectPlaylist(i)}
        >
          {getBackground(index)}
          <div className={`z-0 bg-white`}>{i.name}</div>
          <div className={styles.SelectorItemOverlay}></div>
        </div>
      ))}
    </div>
  );
}
