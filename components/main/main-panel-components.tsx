import { MainMode, useLayout } from '../../lib/context/layout-context';
import DecisionsComponent from '../decisions/decisions-component';
import SongComponent from '../song/song-component';
import SearchComponent from '../search/search-component';
import SettingsComponent from '../settings/settings-component';
import HistoryComponent from './../history/history-component';

type ConnectorPanelProps = {

};

export default function MainPanelComponent(props: ConnectorPanelProps) {
  const { mainPane } = useLayout();

  switch (mainPane) {
    case MainMode.Song:
      return <SongComponent></SongComponent>;
    case MainMode.Search:
      return <SearchComponent></SearchComponent>;
    case MainMode.Decisions:
      return <DecisionsComponent></DecisionsComponent>;
    case MainMode.History:
      return <HistoryComponent></HistoryComponent>;
    case MainMode.Settings:
      return <SettingsComponent></SettingsComponent>;
  }
  return null;
}
