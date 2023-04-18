import {
  CpuChipIcon,
} from '@heroicons/react/24/outline';
import { PanelMode, useLayout } from '../../lib/context/layout-context';

type ConnectorButtonProps = {
  //children: React.ReactNode;
  //onClick: () => void;
};

export default function ConnectorButtonComponent(props: ConnectorButtonProps) {
  const { connectorPane, setConnectorPane } = useLayout();

  const onClick = () => {
    if (connectorPane === PanelMode.Collapsed)
      setConnectorPane(PanelMode.Expanded);
    else setConnectorPane(PanelMode.Collapsed);
  };

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="group relative flex w-full justify-center rounded-full border border-transparent py-1 px-1 text-sm font-medium text-white hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-200"
      >
        <CpuChipIcon className="h-6 w-6 text-yellow-500" />
      </button>
    </div>
  );
}
