import React, { Children } from 'react';
import { Dialog, DialogContainer, DialogPosition } from './modal-component';

type ErrorMessage = {
  message: string;
  status: number;
}

type ErrorDialogProps = {
  response?: Response;
  error?: ErrorMessage;
  children?: React.ReactNode;
};

export default function ErrorDialogComponent(props: ErrorDialogProps): Dialog {
  const { children, response, error } = props;

  let body, header;
  if (error) {
    header = 'Catch Error';
    body = `${error?.status} ${error?.message}`;
  } else if (response) {
    header = 'Response Error';
    body = `${response.type} ${response.status} ${response.statusText}`;
  }

  return {
    Header: <div>{header}</div>,
    Body: <div>{body}</div>,
    Type: DialogContainer.Modal,
    Position: DialogPosition.BottomLeft
  };
}
