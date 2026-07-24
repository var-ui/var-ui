import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from './field';

export const slider = typestyles.styles.component(
  'slider',
  (c) => {
    const v = c.vars({
      labelColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
        inherits: false,
      },
      trackBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
        inherits: false,
      },
      fillBackground: {
        value: t.color.accent.default.var,
        syntax: '<color>',
        inherits: false,
      },
      thumbBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
        inherits: false,
      },
      thumbBorder: {
        value: t.color.accent.default.var,
        syntax: '<color>',
        inherits: false,
      },
      outputColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
        inherits: false,
      },
      descriptionColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
        inherits: false,
      },
      errorColor: {
        value: t.color.danger.default.var,
        syntax: '<color>',
        inherits: false,
      },
    });
    const chrome = fieldChrome({
      label: v.labelColor.var,
      description: v.descriptionColor.var,
      error: v.errorColor.var,
    });
    return {
      slots: [
        'root',
        'label',
        'description',
        'error',
        'control',
        'track',
        'fill',
        'thumb',
        'output',
      ],
      root: {
        ...chrome.root,
        minWidth: '240px',
      },
      label: {
        ...chrome.label,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: t.space[2].var,
      },
      description: chrome.description,
      error: chrome.error,
      control: {
        display: 'grid',
        alignItems: 'center',
        width: '100%',
        height: '1.25rem',
      },
      track: {
        gridArea: '1 / 1',
        height: '4px',
        borderRadius: t.radius.full.var,
        backgroundColor: v.trackBackground.var,
      },
      fill: {
        gridArea: '1 / 1',
        height: '4px',
        borderRadius: t.radius.full.var,
        backgroundColor: v.fillBackground.var,
      },
      thumb: {
        gridArea: '1 / 1',
        width: '1rem',
        height: '1rem',
        borderRadius: t.radius.full.var,
        border: `2px solid ${v.thumbBorder.var}`,
        backgroundColor: v.thumbBackground.var,
        boxShadow: t.shadow.sm.var,
        justifySelf: 'start',
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '2px',
        },
      },
      output: {
        fontSize: t.fontSize.sm.var,
        color: v.outputColor.var,
      },
    };
  },
  { layer: 'components' },
);
