import React, { useEffect } from "react";
import Collapse from "./Collapse";
import Input from "./Input";
import ColorInput from "./ColorInput";
import { useForm, Controller, useWatch } from "react-hook-form";
import { lottieColorToHEX, HEXToLottieColor } from "~/utils/colorUtils";

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

  const renderItems = (items, path) => {
    return items?.map((item, index) => {
      const itemPath = `${path}.${index}`;
      return (
        (item.c || item.it) && (
          <Collapse title={item.nm || `Item ${index}`} key={itemPath}>
            {item.c && (
              <>{renderColorInputField(`${itemPath}.c.k`, "Item Color")}</>
            )}
            {item.it && renderItems(item.it, `${itemPath}.it`)}
          </Collapse>
        )
      );
    });
  };

  const renderLayerShapes = (layer, layerIndex) =>
    layer.shapes?.map((shape, shapeIndex) => (
      <Collapse title={shape.nm} key={shapeIndex}>
        {renderItems(shape.it, `layers.${layerIndex}.shapes.${shapeIndex}.it`)}
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
