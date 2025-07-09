import React from "react";
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
import { HistoryData } from "../../lib/types/song";
import { getMilliseconds, getRelativeTime } from "../../lib/clients/spotify";
import Image from "next/image";

type Item = {
  item: HistoryData;
  onDelete: () => void;
  onPlay: (item: HistoryData) => void;
  isSelected: boolean;
};

const ItemTemplate = ({ item, onPlay, onDelete, isSelected }: Item) => {
  return (
    <div
      className={`flex gap-2 p-1 items-center border ${
        isSelected ? "bg-blue-100" : "bg-white"
      }`}
    >
      <Image
        src={item.album.images[0].url}
        width={32}
        height={32}
        alt="Picture of the artist"
      />
      <div className="font-medium truncate">{item.name}</div>
      <div className="truncate">{item.group}</div>
      <div className="grow"></div>
      <div>{getRelativeTime(item.timestamp)}</div>
      <div>{item.count}</div>
      <div>{getMilliseconds(item.track.duration_ms)}</div>
      <PlayButtonComponent onClick={() => onPlay(item)}></PlayButtonComponent>
      <DeleteButtonComponent onClick={onDelete}></DeleteButtonComponent>
    </div>
  );
};

export default function HistoryComponent() {
  const { deleteEvent, history, songSearch, setSongSearch } = useHistory();
  const { playSong, currentSong } = useMusic();
  const { playlist } = usePlaylist();

  //const [songSearch, setSongSearch] = useState("");

  const onPlay = (item: HistoryData) => {
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
    console.log("onClear");
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
          <div className={styles.HistoryHeader}>History</div>{" "}
          <div>
            {history.start}-{history.count} of {history.total}
          </div>
          <div>
            <div></div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <InputComponent
            id={"history-search"}
            name={"history-search"}
            type={"string"}
            placeHolder={"Search history"}
            value={songSearch}
            onChange={(event) => onSearch(event.target.value)}
            autoComplete={"off"}
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
              isSelected={currentSong && currentSong.uri === result.uri}
            />
          );
        })}
      </div>
    </div>
  );
}
