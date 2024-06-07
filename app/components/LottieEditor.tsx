import React, { useEffect } from "react";
import Collapse from "./Collapse";
import Input from "./Input";
import { useForm, Controller, useWatch } from "react-hook-form";

interface LottieEditorProps {
  data: any;
  onUpdate?: (data: any) => void;
}

const LottieEditor: React.FC<LottieEditorProps> = ({ data, onUpdate }) => {
  const dataObj = JSON.parse(data);
  const { control } = useForm({
    defaultValues: dataObj,
  });
  const watchedValues = useWatch({ control });

  useEffect(() => {
    if (onUpdate) {
      onUpdate(watchedValues);
    }
  }, [watchedValues, onUpdate]);

  return (
    <div>
      <Controller
        name="nm"
        control={control}
        render={({ field }) => (
          <Input label="Name" value={field.value} onChange={field.onChange} />
        )}
      />
      {watchedValues.layers?.map((layer, layerIndex) => (
        <Collapse title={layer.nm} key={layerIndex}>
          <Controller
            name={`layers.${layerIndex}.nm`}
            control={control}
            render={({ field }) => (
              <Input
                label="Layer Name"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name={`layers.${layerIndex}.sr`}
            control={control}
            render={({ field }) => (
              <Input
                label="Timestr"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {layer.shapes?.map((shape, shapeIndex) => (
            <Collapse title={shape.nm} key={shapeIndex}>
              <Controller
                name={`layers.${layerIndex}.shapes.${shapeIndex}.nm`}
                control={control}
                render={({ field }) => (
                  <Input
                    label="Shape Name"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name={`layers.${layerIndex}.shapes.${shapeIndex}.sr`}
                control={control}
                render={({ field }) => (
                  <Input
                    label="Timestr"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Collapse>
          ))}
        </Collapse>
      ))}
    </div>
  );
};

export default LottieEditor;
