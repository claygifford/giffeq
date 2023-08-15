import {
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { PanelMode, useLayout } from '../../lib/context/layout-context';
import { useMusic } from '../../lib/context/music-context';

type ConnectorPanelProps = {

};

export default function ConnectorPanelComponent(props: ConnectorPanelProps) {
  const { connectorPane, changeConnectorPane } = useLayout();
  const {
    spotifyConnectorStatus,
  } = useMusic();
  
  const onClose = () => {
    changeConnectorPane(PanelMode.Collapsed);
  }

  if (connectorPane === PanelMode.Collapsed) return;

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="flex">
        <div className="text-xl font-medium">Connectors</div>
        <button
          onClick={onClose}
          className="ml-auto group relative flex justify-center rounded-full border border-transparent py-1 px-1 text-sm font-medium text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <XMarkIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem] stroke-2 [&>path]:stroke-[2]" />
        </button>
      </div>
      <div>Status: {spotifyConnectorStatus}</div>

      {/* <Link type="button" href="/api/spotify/login" passHref legacyBehavior>
        <Button>Login with Spotify</Button>
      </Link> */}

      <Link href="/api/spotify/login" passHref legacyBehavior>
        <a className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Login with Spotify
        </a>
      </Link>
    </div>
  );
}
