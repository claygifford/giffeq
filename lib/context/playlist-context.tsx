import React, { createContext, useCallback, useEffect, useState } from 'react';
import { MainMode, PageMode, useLayout } from './layout-context';
import { Router, useRouter } from 'next/router';

export type Playlist = {
  name: string;
  id: string;
  history: any[];
  searches: string[];
};

type PlaylistValue = {
  playlist: Playlist;
  selectNewPlaylist: () => void;
  selectPlaylist: (list?: Playlist) => void;
  saveSearch: (search: string) => void;
  songPlayed: (song: any) => void;
  getBooks: () => void;
};

const PlaylistContext = createContext({} as PlaylistValue);

const PlaylistProvider = (props) => {
  const router = useRouter();
  const [playlist, setPlaylist] = useState<Playlist>(null);
  const { changePageMode } = useLayout();

  const saveSearch = useCallback(
    (search: string) => {
      if (search && playlist) {
        if (!playlist.searches) {
          playlist.searches = [search];
        } else {
          playlist.searches.push(search);
        }
      }
    },
    [playlist]
  );

  const songPlayed = useCallback(
    (song: any) => {
      if (song && playlist && !song.recorded) {
        song.recorded = true;
        if (!playlist.history) {
          playlist.history = [song];
        } else {
          playlist.history.push(song);
        }
      }
    },
    [playlist]
  );

  const selectPlaylist = useCallback(
    (list?: Playlist) => {
      if (list) {
        setPlaylist(list);
        router.push('/#playlist/1', undefined, { shallow: true });
        
        //changePageMode(PageMode.Listening);
      } else {
        setPlaylist(null);
        router.push('/', undefined, { shallow: true });
        
        //changePageMode(PageMode.Playlist);
      }
    },
    [router]
  );

  const selectNewPlaylist = useCallback(() => {
    router.push('/#newplaylist', undefined, { shallow: true });
    changePageMode(PageMode.NewPlaylist);
  }, [changePageMode, router]);

  useEffect(() => {
    const onHashChangeStart = (url) => {
      if (!url) return;
      const [,item] = url.split('#');
      const [mode] = item ? item.split('/') : '';
      switch (mode) {
        case 'newplaylist': {
          changePageMode(PageMode.NewPlaylist);
          return;
        }
        case 'playlist': {
          changePageMode(PageMode.Listening);
          return;
        }
        default: {
          changePageMode(PageMode.Playlist);
          return;
        }
      }      
    };

    router.events.on('hashChangeStart', onHashChangeStart);

    return () => {
      router.events.off('hashChangeStart', onHashChangeStart);
    };
  }, [changePageMode, router.events]);

  // const GET_GREETING = gql`
  //   query GetGreeting($language: String!) {
  //     greeting(language: $language) {
  //       message
  //     }
  //   }
  // `;


  // const client = useApolloClient();

  const getBooks = useCallback(async () => {
//     const query1Result = await client.query({
//       query: `query ExampleQuery {
//   hello
// }`,
//     });

    console.log('asdasd');    
  }, []);

  const value = {
    playlist,
    selectNewPlaylist,
    selectPlaylist,
    saveSearch,
    songPlayed,
    getBooks,
  } as PlaylistValue;

  return (
    <PlaylistContext.Provider value={value}>
      {props.children}
    </PlaylistContext.Provider>
  );
};

const usePlaylist = () => {
  const context = React.useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};

export { PlaylistProvider, usePlaylist };