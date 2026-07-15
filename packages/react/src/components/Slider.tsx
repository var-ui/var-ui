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
import { cx } from './utils';
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
    <AriaSlider {...props} className={cx(s.root, className)}>
      {label ? (
        <Label className={s.label}>
          <span>{label}</span>
          {showOutput ? <SliderOutput className={s.output} /> : null}
        </Label>
      ) : null}
      <SliderTrack className={s.control}>
        {({ state }) => (
          <>
            <div className={s.track} />
            <SliderFill
              className={s.fill}
              style={{
                width: `${state.getThumbPercent(0) * 100}%`,
              }}
            />
            <SliderThumb className={s.thumb} />
          </>
        )}
      </SliderTrack>
      {description ? <p className={s.description}>{description}</p> : null}
      {errorMessage ? <p className={s.error}>{errorMessage}</p> : null}
    </AriaSlider>
  );
}
