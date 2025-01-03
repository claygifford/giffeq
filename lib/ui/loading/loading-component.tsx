import React from "react";
import NoteIcon from "../icons/note-icon";

export default function LoadingComponent() {
  return (
    <div className="flex flex-1 gap-4 flex-col items-center justify-center">
      <div className="flex gap-4">
        <NoteIcon height={64} width={64} className="fill-blue-900" />
        <div className="text-5xl font-medium">Playlist</div>
      </div>
      <div>
        <svg
          className="animate-spin -ml-1 mr-3 h-12 w-12 text-blue-900"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
