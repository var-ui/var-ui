import type { JSX } from 'react';
import {
  Label,
  Slider as AriaSlider,
  SliderFill,
  SliderOutput,
  SliderThumb,
  SliderTrack,
  type SliderProps as RACSliderProps,
} from 'react-aria-components';
import { slider } from '@var-ui/core';
import { recipeProps } from './utils';
import type { FieldMeta } from './utils';

export type SliderProps = Omit<RACSliderProps, 'className'> &
  FieldMeta & {
    className?: string;
    /** Show the current value beside the label. @default true */
    showOutput?: boolean;
  };

export function Slider({
  label,
  description,
  errorMessage,
  className,
  showOutput = true,
  ...props
}: SliderProps): JSX.Element {
  const s = slider();
  return (
    <AriaSlider {...props} {...recipeProps(s.root, className)}>
      {label ? (
        <Label {...recipeProps(s.label)}>
          <span>{label}</span>
          {showOutput ? <SliderOutput {...recipeProps(s.output)} /> : null}
        </Label>
      ) : null}
      <SliderTrack {...recipeProps(s.control)}>
        {({ state }) => (
          <>
            <div {...recipeProps(s.track)} />
            <SliderFill
              {...recipeProps(s.fill)}
              style={{
                width: `${state.getThumbPercent(0) * 100}%`,
              }}
            />
            <SliderThumb {...recipeProps(s.thumb)} />
          </>
        )}
      </SliderTrack>
      {description ? <p {...recipeProps(s.description)}>{description}</p> : null}
      {errorMessage ? <p {...recipeProps(s.error)}>{errorMessage}</p> : null}
    </AriaSlider>
  );
}
