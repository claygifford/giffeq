import {
  AcademicCapIcon as AcademicCapSolidIcon,
  BeakerIcon as BeakerSolidIcon,
  BoltIcon as BoltSolidIcon,
  Cog6ToothIcon as Cog6ToothSolidIcon,
  MusicalNoteIcon as MusicalNoteSolidIcon,
} from '@heroicons/react/24/solid';
import {
  AcademicCapIcon as AcademicCapOutlineIcon,
  BeakerIcon as BeakerOutlineIcon,
  BoltIcon as BoltOutlineIcon,
  Cog6ToothIcon as Cog6ToothOutlineIcon,
  MusicalNoteIcon as MusicalNoteOutlineIcon,
} from '@heroicons/react/24/outline';
import React from 'react';
import {
  MainMode,
  PanelMode,
  useLayout,
} from '../../lib/context/layout-context';
import styles from './side-bar.module.css';
import SideBarButtonComponent from '../../lib/ui/side-bar/side-bar-button-component';

export default function SideBarComponent() {
  const { mainPane, showMainPane, sideBarPane } = useLayout();

  const isOpen = sideBarPane === PanelMode.Expanded;
  return (
    <div
      className={`${
        isOpen ? styles.SideBarContainerOpen : styles.SideBarContainer
      }`}
    >
      <div className={`${styles.SideBar} ${isOpen ? styles.SideBarOpen : ''}`}>
        <SideBarButtonComponent
          isOpen={isOpen}
          isSelected={mainPane === MainMode.Search}
          onClick={() => showMainPane(MainMode.Search)}
        >
          {mainPane === MainMode.Search ? (
            <MusicalNoteSolidIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
          ) : (
            <MusicalNoteOutlineIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
          )}
          {isOpen ? <div>Search</div> : null}
        </SideBarButtonComponent>
        <SideBarButtonComponent
          isOpen={isOpen}
          isSelected={mainPane === MainMode.Decisions}
          onClick={() => showMainPane(MainMode.Decisions)}
        >
          {mainPane === MainMode.Decisions ? (
            <AcademicCapSolidIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
          ) : (
            <AcademicCapOutlineIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
          )}
          {isOpen ? <div>Decisions</div> : null}
        </SideBarButtonComponent>
        <SideBarButtonComponent
          isOpen={isOpen}
          isSelected={mainPane === MainMode.NextSong}
          onClick={() => showMainPane(MainMode.NextSong)}
        >
          {mainPane === MainMode.NextSong ? (
            <BeakerSolidIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
          ) : (
            <BeakerOutlineIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
          )}
          {isOpen ? <div>Song</div> : null}
        </SideBarButtonComponent>
        <SideBarButtonComponent
          isOpen={isOpen}
          isSelected={mainPane === MainMode.History}
          onClick={() => showMainPane(MainMode.History)}
        >
          {mainPane === MainMode.History ? (
            <BoltSolidIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
          ) : (
            <BoltOutlineIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
          )}
          {isOpen ? <div>History</div> : null}
        </SideBarButtonComponent>
        <SideBarButtonComponent
          isOpen={isOpen}
          isSelected={mainPane === MainMode.Settings}
          onClick={() => showMainPane(MainMode.Settings)}
        >
          {mainPane === MainMode.Settings ? (
            <Cog6ToothSolidIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
          ) : (
            <Cog6ToothOutlineIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
          )}
          {isOpen ? <div>Settings</div> : null}
        </SideBarButtonComponent>
      </div>
    </div>
  );
}
