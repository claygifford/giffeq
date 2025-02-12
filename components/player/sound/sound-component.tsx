import React, { useState } from "react";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import ButtonComponent from "../../../lib/ui/button/button-component";
import { useMusic } from "../../../lib/context/music-context";
import RangeInputComponent from "../../../lib/ui/range/range-component";

export default function SoundComponent() {
  const { volume, changeVolume } = useMusic();
  const [isMuted, setIsMuted] = useState(false);

  const onMuteToggle = () => {
    if (isMuted) {
      changeVolume(0.5);
    } else {
      changeVolume(1);
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex items-center">
      <ButtonComponent
        variant="player"
        aria-label={isMuted ? "Mute audio" : "Unmute audio"}
        onClick={onMuteToggle}
      >
        {isMuted ? (
          <SpeakerXMarkIcon className="fill-blue-900 h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
        ) : (
          <SpeakerWaveIcon className="fill-blue-900 h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]" />
        )}
      </ButtonComponent>

      <div>{volume}</div>
      <RangeInputComponent
        value={volume}
        min={0}
        max={1}
        onChange={() => console.log("asd")}
        orient="vertical"
      ></RangeInputComponent>
    </div>
  );
}
