import Link from "next/link";
import router from "next/router";
import React from "react";
import { useAuth } from "../../lib/context/auth-context";
import NoteIcon from "../../lib/ui/icons/note-icon";
import ConnectorButton from "../connectors/connector-button-component";
import styles from "./header.module.css";
import UserProfileComponent from "./user-profile/user-profile-component";
import { usePlaylist } from "../../lib/context/playlist-context";
import { XMarkIcon } from "@heroicons/react/24/outline";
import HamburgerButtonComponent from "../side-bar/hamburger-button-component";
import SideBarButtonComponent from "../../lib/ui/side-bar/side-bar-button-component";
import { PageMode, useLayout } from "../../lib/context/layout-context";

export default function HeaderComponent() {
  const { user } = useAuth();
  const { playlist } = usePlaylist();
  const { changePageMode } = useLayout();
  return (
    <header className={styles.header}>
      <HamburgerButtonComponent></HamburgerButtonComponent>
      <div className="flex px-3">
        <Link href="/">
          <div className="flex gap-3 items-center">
            <NoteIcon height={32} width={32} className="fill-blue-900" />{" "}
            Playlist
          </div>
        </Link>
      </div>
      {playlist && (
        <div className="flex items-center gap-2">
          {playlist.name}{" "}
          <SideBarButtonComponent
            classes="py-1 px-1"
            onClick={() => {
              changePageMode(PageMode.Playlist);
            }}
          >
            <XMarkIcon className="h-4 w-4" />
          </SideBarButtonComponent>
        </div>
      )}
      <div className="flex flex-1 items-center justify-end px-3">
        <ConnectorButton></ConnectorButton>
        {user ? (
          <UserProfileComponent></UserProfileComponent>
        ) : (
          <div className="flex gap-1">
            <button
              aria-label="Sign up"
              onClick={() => router.push("/about/signup")}
              className="flex whitespace-nowrap items-center group relative w-full justify-center rounded-full border border-transparent py-2 px-5 text-sm font-medium text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              Sign up
            </button>
            <button
              aria-label="Log in"
              onClick={() => router.push("/about/login")}
              className="flex whitespace-nowrap items-center group relative w-full justify-center rounded-full border border-transparent py-2 px-5 text-sm font-medium text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              Log in
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
