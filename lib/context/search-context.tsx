import React, { createContext, useCallback, useMemo, useState } from "react";
import { createNextClient } from "../clients/next";
import debounce from "lodash/debounce";
import { useDialog } from "../hooks/use-dialog";
import ErrorDialog from "../ui/dialog/error-dialog";
import { Album, Artist, Track } from "../types/song";

type SearchValue = {
  isSearchingMusic: boolean;
  searchMusic: (search: string) => void;
  clearResults: () => void;
  currentResults: SearchItem[];
};

export type SearchItem = Album | Artist | Track;

export const isAlbum = (check: Album | Artist | Track): check is Album => {
  return check.type === "album";
};

export const isArtist = (check: Album | Artist | Track): check is Artist => {
  return check.type === "artist";
};

export const isTrack = (check: Album | Artist | Track): check is Track => {
  return check.type === "track";
};

const SearchContext = createContext({} as SearchValue);

const SearchProvider = (props) => {
  const client = createNextClient();
  const dialog = useDialog();

  const [isSearchingMusic, setIsSearchingMusic] = useState<boolean>(false);

  const [currentResults, setCurrentResults] = useState<SearchItem[]>(null);

  const clearResults = useCallback(() => {
    setCurrentResults(undefined);
  }, []);

  const searchMusicHandler = useCallback(
    async (search: string) => {
      try {
        setIsSearchingMusic(true);

        const data = await client.get<{
          tracks: { items: Track[] };
          albums: { items: Album[] };
          artists: { items: Artist[] };
        }>("search/get", {
          q: search,
          type: "album,track,artist",
        });

        if (data && data.tracks && data.tracks.items) {
          const all = [
            ...data.tracks.items,
            ...data.artists.items,
            ...data.albums.items,
          ];
          setCurrentResults(all);
        }
      } catch (error) {
        dialog.showDialog({ dialog: ErrorDialog({ error }) });
      } finally {
        setIsSearchingMusic(false);
      }
    },
    [client, dialog],
  );

  const searchMusic = debounce(searchMusicHandler, 300);

  const value = useMemo(
    () => ({
      searchMusic,
      isSearchingMusic,
      clearResults,
      currentResults,
    }),
    [searchMusic, isSearchingMusic, clearResults, currentResults],
  );

  return (
    <SearchContext.Provider value={value}>
      {props.children}
    </SearchContext.Provider>
  );
};

const useSearch = () => {
  const context = React.useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export { SearchProvider, useSearch };
