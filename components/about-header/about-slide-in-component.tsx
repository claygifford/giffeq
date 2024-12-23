import React from "react";
import {
  Dialog,
  DialogContainer,
  DialogPosition,
} from "../../lib/ui/dialog/modal-component";

export default function AboutSlideInComponent(): Dialog {
  return {
    Header: <div>Copmpletely new stuff</div>,
    Body: <div className="bg-blue-300">more of that</div>,
    Type: DialogContainer.SlideIn,
    Position: DialogPosition.Center,
  };
}
