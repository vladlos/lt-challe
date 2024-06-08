import React, { useEffect } from "react";
import Collapse from "./Collapse";
import Input from "./Input";
import ColorInput from "./ColorInput";
import { useForm, Controller, useWatch } from "react-hook-form";

const lottieColorToHEX = (color) => {
  const rgb = color?.map((c) => Math.round(c * 255));
  return "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");
};

const HEXToLottieColor = (color) => {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return [r, g, b];
};

const LottieEditor = ({ data, onUpdate }) => {
  const dataObj = JSON.parse(data || "{}");
  const { control, setValue } = useForm({ defaultValues: dataObj });
  const watchedValues = useWatch({ control });

  useEffect(() => {
    if (onUpdate) {
      onUpdate(JSON.stringify(watchedValues, null, 2));
    }
  }, [watchedValues, onUpdate]);

  const renderInputField = (name, label, type = "text", min, max) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          label={label}
          type={type}
          min={min}
          max={max}
          name={field.name}
          value={field.value}
          onChange={(e) =>
            setValue(
              field.name,
              type === "number"
                ? parseFloat(e.target.value) || 1
                : e.target.value
            )
          }
        />
      )}
    />
  );

  const renderColorInputField = (name, label) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ColorInput
          label={label}
          value={lottieColorToHEX(field.value)}
          onChange={(e) =>
            setValue(field.name, HEXToLottieColor(e.target.value))
          }
        />
      )}
    />
  );

  const renderLayerShapes = (layer, layerIndex) =>
    layer.shapes?.map((shape, shapeIndex) => (
      <Collapse title={shape.nm} key={shapeIndex}>
        {renderInputField(
          `layers.${layerIndex}.shapes.${shapeIndex}.nm`,
          "Shape Name"
        )}
        {shape.it?.map((item, itemIndex) => (
          <Collapse title={item.nm} key={itemIndex}>
            {item.c && (
              <>
                {renderInputField(
                  `layers.${layerIndex}.shapes.${shapeIndex}.it.${itemIndex}.c.a`,
                  "Opacity"
                )}
                {renderColorInputField(
                  `layers.${layerIndex}.shapes.${shapeIndex}.it.${itemIndex}.c.k`,
                  "Item Color"
                )}
              </>
            )}
          </Collapse>
        ))}
      </Collapse>
    ));

  return (
    <div>
      {renderInputField("nm", "Name")}
      {renderInputField("fr", "Frames (speed)", "number", 1, 1024)}
      {watchedValues.layers?.map((layer, layerIndex) => (
        <Collapse title={layer.nm} key={layerIndex}>
          {renderLayerShapes(layer, layerIndex)}
        </Collapse>
      ))}
    </div>
  );
};

export default LottieEditor;
