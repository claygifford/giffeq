import React, { useCallback } from "react";

import PageComponent from "../components/page-component";
import ConnectorPanel from "../components/connectors/connector-panel-component";
import HeaderComponent from "../components/header/header-component";
import PlayerComponent from "../components/player/player-component";
import SideBarComponent from "../components/side-bar/side-bar-component";
import MainPanelComponent from "../components/main/main-panel-components";
import { PageMode, useLayout } from "../lib/context/layout-context";
import ContainerComponent from "../lib/ui/container/container";
import PlaylistSelectorComponent from "../components/playlist-selector/playlist-selector.component";
import NewPlaylistComponent from "../components/new-playlist/new-playlist-component";
import PlaylistSideBarComponent from "../components/side-bar/playlist-side-bar-component";
import BackgroundComponent from "./../lib/ui/backgrounds/background-component";
import SearchBackgroundComponent from "../lib/ui/backgrounds/search-background-component";

export default function Home() {
  const { pageMode } = useLayout();

  const renderPage = useCallback(() => {
    switch (pageMode) {
      case PageMode.Listening:
        return (
          <>
            <ContainerComponent>
              <SearchBackgroundComponent></SearchBackgroundComponent>
              <SideBarComponent></SideBarComponent>
              <MainPanelComponent></MainPanelComponent>
              <ConnectorPanel />
            </ContainerComponent>
            <PlayerComponent />
          </>
        );
      case PageMode.NewPlaylist:
        return (
          <>
            <ContainerComponent>
              <BackgroundComponent></BackgroundComponent>
              <NewPlaylistComponent></NewPlaylistComponent>
              <ConnectorPanel />
            </ContainerComponent>
          </>
        );
      case PageMode.Playlist:
      default:
        return (
          <>
            <ContainerComponent>
              <BackgroundComponent></BackgroundComponent>
              <PlaylistSideBarComponent></PlaylistSideBarComponent>
              <PlaylistSelectorComponent></PlaylistSelectorComponent>
              <ConnectorPanel />
            </ContainerComponent>
          </>
        );
    }
  }, [pageMode]);

  return (
    <PageComponent classes="overflow-hidden">
      <HeaderComponent></HeaderComponent>
      {renderPage()}
    </PageComponent>
  );
}

export function getStaticProps() {
  return {
    props: { protected: true },
  };
}
