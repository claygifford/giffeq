import { PlusIcon as PlusSolidIcon } from "@heroicons/react/24/solid";
import React from "react";
import {
  PageMode,
  PanelMode,
  useLayout,
} from "../../lib/context/layout-context";
import styles from "./side-bar.module.css";
import SideBarActionComponent from "../../lib/ui/side-bar/side-bar-action-component";

export default function PlaylistSideBarComponent() {
  const { sideBarPane } = useLayout();
  const { changePageMode } = useLayout();

  const isOpen = sideBarPane === PanelMode.Expanded;
  return (
    <div
      className={`${
        isOpen ? styles.SideBarContainerOpen : styles.SideBarContainer
      }`}
    >
      <div className={`${styles.SideBar} ${isOpen ? styles.SideBarOpen : ""}`}>
        <SideBarActionComponent
          isOpen={isOpen}
          onClick={() => {
            changePageMode(PageMode.NewPlaylist);
          }}
        >
          <PlusSolidIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
          {isOpen ? <div>New Playlist</div> : null}
        </SideBarActionComponent>
      </div>
    </div>
  );
}
