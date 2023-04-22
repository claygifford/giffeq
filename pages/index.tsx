import React from 'react';

import PageComponent from '../components/page-component';
import ConnectorPanel from '../components/connectors/connector-panel-component';
import HeaderComponent from '../components/header/header-component';
import PlayerComponent from '../components/player/player-component';
import SideBarComponent from '../components/side-bar/side-bar-component';
import MainPanelComponent from '../components/main/main-panel-components';
import { usePlaylist } from '../lib/context/playlist-context';
import { PageMode, useLayout } from '../lib/context/layout-context';
import ContainerComponent from '../lib/ui/container/container';

export default function Home() {
  const { playlist, selectPlaylist } = usePlaylist();
  const { pageMode } = useLayout();

  const onSelectPlaylist = (playlist) => {
    selectPlaylist(playlist);
  };

  const onNewPlaylist = () => {
    selectPlaylist('+ new playlist');
  };

  const renderPage = () => {
    switch (pageMode) {
      case PageMode.Listening:
        return (
          <>
            <ContainerComponent>
              <SideBarComponent></SideBarComponent>
              <MainPanelComponent></MainPanelComponent>
              <ConnectorPanel />
            </ContainerComponent>
            <PlayerComponent />
          </>
        );
      case PageMode.Playlist:
      default:
        return (
          <>
            <ContainerComponent>
              {playlist}
              <div>
                <div onClick={() => onSelectPlaylist('Playlist 1')}>
                  Playlist 1
                </div>
                <div onClick={() => onNewPlaylist()}>+ New</div>
              </div>
              <ConnectorPanel />
            </ContainerComponent>
          </>
        );
    }
  };

  return (
    <PageComponent classes="overflow-hidden">
      <HeaderComponent></HeaderComponent>
      {renderPage()}
    </PageComponent>
  );
}

export function getServerSideProps() {
  return {
    props: { protected: true },
  };
}
