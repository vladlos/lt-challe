import React, { useEffect, useState } from "react";
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
    dotLottie?.play();
  }

  function pause() {
    dotLottie?.pause();
  }

  function stop() {
    dotLottie?.stop();
  }

  useEffect(() => {
    function onPlay() {
      setIsPlaying(true);
    }

    function onPause() {
      setIsPlaying(false);
    }

    if (dotLottie) {
      dotLottie.addEventListener("play", onPlay);
      dotLottie.addEventListener("pause", onPause);
      dotLottie.addEventListener("stop", onPause);
    }

    return () => {
      if (dotLottie) {
        dotLottie.addEventListener("play", onPlay);
        dotLottie.addEventListener("pause", onPause);
        dotLottie.addEventListener("stop", onPause);
      }
    };
  }, [dotLottie]);

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
        data={JSON.stringify(data)}
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
