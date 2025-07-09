import React, { useState } from "react";
import styles from "./decisions.module.css";
import { XMarkIcon } from "@heroicons/react/24/outline";
import InputComponent from "../../lib/ui/input/input-component";
import SideBarButtonComponent from "../../lib/ui/side-bar/side-bar-button-component";
import { useDecision } from "../../lib/context/decision-context";
import DeleteButtonComponent from "../../lib/ui/buttons/delete-button";
import PlayButtonComponent from "../../lib/ui/buttons/play-button";
import { usePlaylist } from "../../lib/context/playlist-context";
import { useMusic } from "../../lib/context/music-context";
import { DecisionData } from "../../lib/types/song";
import { getRelativeTime } from "../../lib/clients/spotify";
import { HandThumbDownIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import ImageComponent from "../image/image-component";

type Item = {
  item: DecisionData;
  onDelete: () => void;
  onPlay: (item: DecisionData) => void;
  isSelected: boolean;
};

const ItemTemplate = ({ item, onPlay, onDelete, isSelected }: Item) => {
  return (
    <div
      className={`flex gap-4 rounded py-1 px-2 items-center border ${
        isSelected ? "bg-blue-100" : "bg-white"
      }`}
    >
      <ImageComponent item={item.album}></ImageComponent>
      <div className="font-medium truncate">{item.name}</div>
      <div className="truncate">{item.group}</div>
      <div className="grow"></div>
      {item.like ? (
        <HandThumbUpIcon className="h-8 w-8 min-h-[1.5rem] min-w-[1.5rem] text-blue-900" />
      ) : (
        <HandThumbDownIcon className="h-8 w-8 min-h-[1.5rem] min-w-[1.5rem] text-blue-900" />
      )}
      <div>{getRelativeTime(item.timestamp)}</div>
      <PlayButtonComponent onClick={() => onPlay(item)}></PlayButtonComponent>
      <DeleteButtonComponent onClick={onDelete}></DeleteButtonComponent>
    </div>
  );
};

export default function DecisionsComponent() {
  const { decisions, deleteDecision } = useDecision();
  const { playSong, currentSong } = useMusic();
  const { playlist } = usePlaylist();

  const [songSearch, setSongSearch] = useState("");

  const onPlay = (item) => {
    playSong(item, playlist.id, true);
  };

  const onDelete = (index: number) => {
    deleteDecision(playlist, index);
  };

  const getResults = () => {
    if (decisions) {
      if (songSearch)
        return decisions.items.filter((h) => h.name.includes(songSearch));
      return decisions.items;
    }
    return [];
  };

  const onSearch = (search: string) => {
    setSongSearch(search);
  };

  const onClear = () => {
    //clearResults();
    setSongSearch("");
  };

  return (
    <div className={styles.Decisions}>
      <div className="p-4">
        <div>Decisions </div>
        <div className="flex flex-col gap-2">
          <InputComponent
            id={"decision-search"}
            name={"decision-search"}
            type={"string"}
            placeHolder={"Search decisions"}
            value={songSearch}
            onChange={(event) => onSearch(event.target.value)}
            autoComplete={"off"}
            spellCheck={false}
          >
            <>
              <SideBarButtonComponent onClick={onClear}>
                <XMarkIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
              </SideBarButtonComponent>
            </>
          </InputComponent>
        </div>
      </div>
      <div className="px-4 overflow-auto flex flex-col gap-1">
        {getResults().map((result, i) => {
          return (
            <ItemTemplate
              onPlay={onPlay}
              onDelete={() => onDelete(i)}
              item={result}
              key={i}
              isSelected={currentSong && currentSong.uri === result.uri}
            />
          );
        })}
      </div>
    </div>
  );
}
