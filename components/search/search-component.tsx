import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useMusic } from "../../lib/context/music-context";
import BusyIcon from "../../lib/ui/icons/busy-icon";
import InputComponent from "../../lib/ui/input/input-component";
import SideBarButtonComponent from "../../lib/ui/side-bar/side-bar-button-component";
import ImageComponent from "../image/image-component";
import styles from "./search.module.css";
import { SearchItem, useSearch } from "../../lib/context/search-context";
import { usePlaylist } from "../../lib/context/playlist-context";

type ItemType = {
  item: SearchItem;
  onClick: (item: SearchItem) => void;
  isSelected: boolean;
};
const ItemTemplate = ({ item, onClick, isSelected }: ItemType) => {
  const artist = (i) => {
    if (i.type === "album" || i.type === "track")
      return (
        <div className="flex px-2 gap-2 truncate ">
          |{" "}
          {i.artists.map((artist) => {
            if (!artist) return;
            return <span key={artist.id}>{artist.name}</span>;
          })}
        </div>
      );
  };

  const onItemClick = () => {
    onClick(item);
  };

  const getClass = () => {
    switch (item.type) {
      case "track":
        return "bg-red-300";
      case "album":
        return "bg-blue-300";
      case "artist":
        return "bg-yellow-300";
    }
    return "bg-gray-300";
  };

  return (
    <div
      className={`flex gap-4 rounded py-1 px-2 items-center bg-white border cursor-pointer ${
        isSelected ? "bg-indigo-200" : ""
      }`}
      onClick={onItemClick}
    >
      <ImageComponent item={item}></ImageComponent>
      <div className="font-medium truncate">{item.name}</div>
      <div className="truncate">{artist(item)}</div>
      <div className={`${getClass()} rounded px-2 py-1 text-white ml-auto`}>
        {item.type}
      </div>
    </div>
  );
};

export default function SearchComponent() {
  const { playSong, currentSong } = useMusic();
  const { playlist } = usePlaylist();

  const { isSearchingMusic, searchMusic, currentResults, clearResults } =
    useSearch();

  const [songSearch, setSongSearch] = useState("");

  const onItemClick = (song) => {
    playSong(song, playlist.id);
  };

  useEffect(() => {
    if (songSearch) {
      searchMusic(songSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songSearch]);

  const onSearch = (search: string) => {
    setSongSearch(search);
  };

  const onClear = () => {
    clearResults();
    setSongSearch("");
  };

  return (
    <div className={styles.Search}>
      <div className="p-4">
        <div>Search</div>
        <div className="flex flex-col gap-2">
          <InputComponent
            id={"song-search"}
            name={"song-search"}
            type={"string"}
            placeHolder={"Search for songs"}
            value={songSearch}
            onChange={(event) => onSearch(event.target.value)}
            autoComplete={"off"}
            spellCheck={false}
          >
            <>
              <SideBarButtonComponent onClick={onClear}>
                <XMarkIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
              </SideBarButtonComponent>
              {isSearchingMusic && <BusyIcon />}
            </>
          </InputComponent>
        </div>
      </div>
      <div className="px-4 overflow-auto flex flex-col gap-1">
        {currentResults &&
          currentResults.map((result) => {
            return (
              <ItemTemplate
                onClick={onItemClick}
                item={result}
                key={result.id}
                isSelected={currentSong && currentSong.uri === result.uri}
              />
            );
          })}
      </div>
    </div>
  );
}
