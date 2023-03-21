import React, { Children } from 'react';
import { Dialog } from './modal';

type ErrorDialogProps = {
  response?: Response;
  error?: any;
  children?: React.ReactNode;
};

export default function ErrorDialogComponent(props: ErrorDialogProps): Dialog {
  const { children, response, error } = props;

  let body, header;
  if (error) {
    header = 'Catch Error';
    body = error.toString();
  } else if (response) {
    header = 'Response Error';
    body = `Type: ${response.type} Status: ${response.status} Status Text: ${response.statusText}`;
  }

  return {
    Header: <div>{header}</div>,
    Body: <div className="bg-red-300">{body}</div>,
  };
}
