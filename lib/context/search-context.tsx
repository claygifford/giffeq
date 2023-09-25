import React, { createContext, useCallback, useMemo, useState } from 'react';
import { createNextClient } from '../clients/next';
import { createApiClient } from '../clients/api';
import debounce from 'lodash/debounce';
import { useDialog } from '../hooks/use-dialog';
import ErrorDialog from '../ui/dialog/error-dialog';
import { useMusic } from './music-context';

type SearchValue = {
  isSearchingMusic: boolean;
  searchMusic: (search: string) => void;
  clearResults: () => void;
  currentResults: any;
};

const SearchContext = createContext({} as SearchValue);

const SearchProvider = (props) => {
  const client = createNextClient();
  const dialog = useDialog();

  const [isSearchingMusic, setIsSearchingMusic] = useState<boolean>(false);


  const [currentResults, setCurrentResults] = useState<any>(null);
  
  
  const clearResults = useCallback(() => {
      setCurrentResults(undefined);
    }, []);

  const searchMusicHandler = useCallback(
    async (search: string) => {
      try {
        setIsSearchingMusic(true);

        const data = await client.get<{
          tracks: { items: any[] };
          albums: { items: any[] };
          artists: { items: any[] };
        }>('search', {
          q: search,
          type: 'album,track,artist'
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
    [client, dialog]
  );

  const searchMusic = debounce(searchMusicHandler, 300);
    
  const value = useMemo(
    () => ({
      searchMusic,
      isSearchingMusic,
      clearResults,
      currentResults
    }),
    [searchMusic, isSearchingMusic, clearResults, currentResults]
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
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export { SearchProvider, useSearch };
