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

const ItemTemplate = ({ item, onPlay, onDelete, isSelected }) => {
  const artist = (i) => {
    if (i.type === "album" || i.type === "track")
      return (
        <div className="flex px-2 gap-2 truncate bg-white border">
          |{" "}
          {i.artists.map((artist) => {
            if (!artist) return;
            return <span key={artist.id}>{artist.name}</span>;
          })}
        </div>
      );
  };

  return (
    <div
      className={`flex rounded py-1 px-2 items-center bg-white border ${
        isSelected ? "bg-indigo-200" : ""
      }`}
    >
      <PlayButtonComponent onClick={() => onPlay(item)}></PlayButtonComponent>
      <DeleteButtonComponent onClick={onDelete}></DeleteButtonComponent>
      <div className="font-medium truncate">{item.name}</div>
      {artist(item)}
    </div>
  );
};

export default function DecisionsComponent() {
  const { decisions, deleteDecision } = useDecision();
  const { playSong } = useMusic();
  const { playlist } = usePlaylist();

  const [songSearch, setSongSearch] = useState("");

  const onPlay = (item) => {
    item.type = "track";
    playSong(item, playlist.id, true);
  };

  const onDelete = (index: number) => {
    deleteDecision(playlist, index);
  };

  const getResults = () => {
    if (decisions) {
      console.log(`${JSON.stringify(decisions.items)}`);
      if (songSearch)
        return decisions.items.filter((h) => h.song.name.includes(songSearch));
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
              isSelected={false}
              //isSelected={currentSong.id === result.id}
            />
          );
        })}
      </div>
    </div>
  );
}
