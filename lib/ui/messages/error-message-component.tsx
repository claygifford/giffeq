import React from 'react';
import XMarkIcon from '../icons/close-icon';
import HandRaisedIcon from '../icons/hand-raised-icon';

type ErrorMessageProps = {
    message?: string;
}

export default function ErrorMessageComponent(props: ErrorMessageProps) {
    const { message } = props;
    if (!message) return;
    return (
      <div className="flex rounded-md border border-transparent bg-yellow-200 rounded p-3 text-indigo-900">
        <HandRaisedIcon />
        <div className="px-2">{message}</div>
        <div className="ml-auto">
          <button >
            <XMarkIcon />
          </button>
        </div>
      </div>
    );
}
