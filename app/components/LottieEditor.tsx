import React, { useEffect, useRef } from "react";
import Collapse from "./Collapse";
import Input from "./Input";
import ColorInput from "./ColorInput";
import { useForm, Controller, useWatch } from "react-hook-form";
import { lottieColorToHEX, HEXToLottieColor } from "~/utils/colorUtils";
import _ from "lodash";

type LottieEditorProps = {
  data: {};
  onUpdate?: (data: any) => void;
};

const LottieEditor: React.FC<LottieEditorProps> = ({ data, onUpdate }) => {
  const { control, setValue, reset } = useForm({ defaultValues: data });
  const watchedValues = useWatch({ control });
  const isResetting = useRef(false);

  useEffect(() => {
    // Indicate that the form is resetting
    isResetting.current = true;
    // Update the form values without triggering onUpdate
    reset(data);
  }, [data, reset]);

  useEffect(() => {
    if (isResetting.current) {
      // Skip the first onUpdate call after resetting
      console.log("Skipping onUpdate");
      isResetting.current = false;
    } else if (onUpdate && !_.isEqual(watchedValues, data)) {
      onUpdate(watchedValues);
    }
  }, [watchedValues, onUpdate, data]);

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
