import React, { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Input from "~/components/Input";
import Button from "~/components/Button";
import ColorInput from "~/components/ColorInput";
import CodeBlock from "~/components/CodeBlock";

const LottiePlayerWithControls: React.FC<{ data: string }> = ({ data }) => {
  const [dotLottie, setDotLottie] = useState<null | any>(null);

  const [speed, setSpeed] = useState(1);
  const [color, setColor] = useState("#ffffff");
  const [isPlaying, setIsPlaying] = useState(false);

  const dotLottieRefCallback = (dotLottie: any) => {
    setDotLottie(dotLottie);
  };

  function play() {
    if (dotLottie) {
      setIsPlaying(true);
      dotLottie.play();
    }
  }

  function pause() {
    if (dotLottie) {
      setIsPlaying(false);
      dotLottie.pause();
    }
  }

  function stop() {
    if (dotLottie) {
      setIsPlaying(false);
      dotLottie.stop();
    }
  }

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(parseFloat(event.target.value));
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  return (
    <div>
      <DotLottieReact
        dotLottieRefCallback={dotLottieRefCallback}
        data={data}
        loop={true}
        speed={speed}
        backgroundColor={color}
        autoplay
      />
      <div className="flex gap-4 mt-4">
        {isPlaying ? (
          <Button onClick={pause}>Pause ⏸︎</Button>
        ) : (
          <Button onClick={play}>Play ▶</Button>
        )}
        <Button onClick={stop}>Stop ⏹︎</Button>
      </div>
      <div className="flex gap-4 mt-10">
        <Input
          label="Speed"
          type="number"
          min={0}
          value={speed}
          onChange={handleSpeedChange}
        />
        <ColorInput
          label="BgColor"
          value={color}
          onChange={handleColorChange}
        />
      </div>
      <CodeBlock>{`<DotLottieReact \n\tdata={data} \n\tloop={true} \n\tspeed={${speed}} \n\tbackgroundColor={${color}} \n\tautoplay\n/>`}</CodeBlock>
    </div>
  );
};

export default LottiePlayerWithControls;
