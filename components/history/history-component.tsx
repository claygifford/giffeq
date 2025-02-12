import React, { useState } from "react";
import styles from "./history.module.css";
import { usePlaylist } from "../../lib/context/playlist-context";
import { XMarkIcon } from "@heroicons/react/24/outline";
import BusyIcon from "../../lib/ui/icons/busy-icon";
import InputComponent from "../../lib/ui/input/input-component";
import SideBarButtonComponent from "../../lib/ui/side-bar/side-bar-button-component";
import PlayButtonComponent from "../../lib/ui/buttons/play-button";
import { useMusic } from "../../lib/context/music-context";
import DeleteButtonComponent from "../../lib/ui/buttons/delete-button";
import { useHistory } from "../../lib/context/history-context";

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
        isSelected ? 'bg-indigo-200' : ''
      }`}
    >
      <PlayButtonComponent onClick={() => onPlay(item)}></PlayButtonComponent>
      <DeleteButtonComponent onClick={onDelete}></DeleteButtonComponent>
      <div className="font-medium truncate">{item.name}</div>
      {artist(item)}
    </div>
  );
};

export default function HistoryComponent() {
  const { deleteEvent, history } = useHistory();
  const { playSong } = useMusic();
  const { playlist } = usePlaylist();

  const [songSearch, setSongSearch] = useState("");

  const onPlay = (item) => {
    item.type = "track";
    playSong(item, playlist.id, true);
  };

  const onDelete = (index: number) => {
    deleteEvent(playlist, index);
  };

  const isSearchingHistory = false;
  const onSearch = (search: string) => {
    setSongSearch(search);
  };
  
  const onClear = () => {
    //clearResults();
    setSongSearch("");
  };

  const getResults = () => {
    if (history) {
      if (songSearch)
        return history.items.filter((h) => h.name.includes(songSearch));
      return history.items;
    }
    return [];
  };

  return (
    <div className={styles.History}>
      <div className="p-4">
        <div>
          <div>History</div>{' '}
          <div>
            {history.start}-{history.count} of {history.total}
          </div>
          <div>
            <div></div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <InputComponent
            id={'history-search'}
            name={'history-search'}
            type={'string'}
            placeHolder={'Search history'}
            value={songSearch}
            onChange={(event) => onSearch(event.target.value)}
            autoComplete={'off'}
            spellCheck={false}
          >
            <>
              <SideBarButtonComponent onClick={onClear}>
                <XMarkIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
              </SideBarButtonComponent>
              {isSearchingHistory && <BusyIcon />}
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
