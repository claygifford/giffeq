import { PaintBrushIcon } from "@heroicons/react/24/outline";
import { PanelMode, useLayout } from "../../lib/context/layout-context";

export default function ThemesButtonComponent() {
  const { themesPane, changeThemesPane } = useLayout();

  const onClick = () => {
    if (themesPane === PanelMode.Collapsed)
      changeThemesPane(PanelMode.Expanded);
    else changeThemesPane(PanelMode.Collapsed);
  };

  return (
    <div className="relative">
      <button
        aria-label="Connector"
        onClick={onClick}
        className="group relative flex w-full justify-center rounded-full border border-transparent py-1 px-1 text-sm font-medium text-white hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
      >
        <PaintBrushIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem] text-red-500" />
      </button>
    </div>
  );
}
