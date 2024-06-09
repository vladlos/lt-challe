export const lottieColorToHEX = (color: any) => {
  const rgb = color?.map((c: number) => Math.round(c * 255));
  return (
    "#" +
    rgb
      .slice(0, 3)
      .map((c: number) => c.toString(16).padStart(2, "0"))
      .join("")
  );
};

export const HEXToLottieColor = (color: any) => {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return [r, g, b];
};
