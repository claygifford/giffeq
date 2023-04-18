import { Bars3Icon } from '@heroicons/react/24/solid';
import { PanelMode, useLayout } from '../../lib/context/layout-context';

type SideBarMainButtonProps = {
  //children: React.ReactNode;
  //onClick: () => void;
};

export default function SideBarMainButtonComponent(props: SideBarMainButtonProps) {
  const { sideBarPane, setSideBarPane } = useLayout();

  const onClick = () => {
    if (sideBarPane === PanelMode.Collapsed)
      setSideBarPane(PanelMode.Expanded);
    else setSideBarPane(PanelMode.Collapsed);
  };

  return (
    <div className="relative pl-2">
      <button
        onClick={onClick}
        className="group relative flex w-full justify-center rounded-full border border-transparent py-2 px-2 text-sm font-medium text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        <Bars3Icon className="h-6 w-6 text-gray-600" />
      </button>
    </div>
  );
}
