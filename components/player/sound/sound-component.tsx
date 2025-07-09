import React from "react";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import ButtonComponent from "../../../lib/ui/button/button-component";
import { useMusic } from "../../../lib/context/music-context";
import RangeInputComponent from "../../../lib/ui/range/range-component";

export default function SoundComponent() {
  const { volume, changeVolume } = useMusic();

  const onUpdateSimple = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeVolume(+e.target.value);
  };

  const isMuted = volume === 0;
  const onMuteToggle = () => {
    const value = !isMuted;
    if (value) {
      changeVolume(0);
    } else {
      changeVolume(1);
    }
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

      <RangeInputComponent
        value={volume}
        min={0}
        max={1}
        step={0.1}
        onChange={onUpdateSimple}
        orient="vertical"
      ></RangeInputComponent>
    </div>
  );
}
