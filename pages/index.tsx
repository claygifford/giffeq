import React from 'react';

import PageComponent from '../components/page-component';
import ConnectorPanel from '../components/connectors/connector-panel-component';
import HeaderComponent from '../components/header/header-component';
import PlayerComponent from '../components/player/player-component';
import SideBarComponent from '../components/side-bar/side-bar-component';
import MainPanelComponent from '../components/main/main-panel-components';

export default function Home() {
  return (
    <PageComponent>
      <HeaderComponent></HeaderComponent>
      <div className="flex flex-1 w-full overflow-hidden">
        <SideBarComponent></SideBarComponent>
        <MainPanelComponent></MainPanelComponent>
        <ConnectorPanel />
      </div>
      <PlayerComponent />
    </PageComponent>
  );
}

export function getServerSideProps() {
  return {
    props: { protected: true },
  };
}
