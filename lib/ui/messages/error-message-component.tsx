import React, { useEffect, useState } from 'react';
import XMarkIcon from '../icons/close-icon';
import HandRaisedIcon from '../icons/hand-raised-icon';

type ErrorMessageProps = {
    message?: string;
}

export default function ErrorMessageComponent(props: ErrorMessageProps) {
    const { message } = props;
    const [dismiss, setDismiss] = useState(false);
    useEffect(() => {
      setDismiss(false);
    }, [message]);

    if (!message || dismiss) return;
    return (
      <div className="flex border border-transparent bg-yellow-200 rounded p-3 text-indigo-900">
        <HandRaisedIcon />
        <div className="px-2">{message}</div>
        <div className="ml-auto flex items-center">
          <button className="hover:bg-gray-500/50 rounded" onClick={() => setDismiss(true)}>
            <XMarkIcon />
          </button>
        </div>
      </div>
    );
}
