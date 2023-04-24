import React from 'react';
import { Dialog, DialogContainer } from '../../lib/ui/dialog/modal-component';

type AboutSlideInProps = {
  response?: Response;
  error?: any;
  children?: React.ReactNode;
};

export default function AboutSlideInComponent(): Dialog {
  return {
    Header: <div>Copmpletely new stuff</div>,
    Body: <div className="bg-blue-300">more of that</div>,
    Type: DialogContainer.SlideIn,
  };
}
