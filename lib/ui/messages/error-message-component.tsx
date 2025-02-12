import React, { useEffect, useState } from "react";
import HandRaisedIcon from "../icons/hand-raised-icon";
import { XMarkIcon } from "@heroicons/react/24/solid";

type ErrorMessageProps = {
  message?: string;
  dismiss?: () => void;
};

export default function ErrorMessageComponent(props: ErrorMessageProps) {
  const { message, dismiss } = props;

  if (!message || dismiss) return;
  return (
    <div className="flex border border-transparent bg-yellow-200 rounded p-3 text-indigo-900">
      <HandRaisedIcon />
      <div className="px-2">{message}</div>
      <div className="ml-auto flex items-center">
        <button
          aria-label="Dismiss error button"
          className="hover:bg-gray-500/50 rounded h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]"
          onClick={() => dismiss()}
        >
          <XMarkIcon />
        </button>
      </div>
    </div>
  );
}
