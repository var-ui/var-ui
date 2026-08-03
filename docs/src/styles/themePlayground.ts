import { designTokens as t, styles, typestyles } from '@var-ui/core';

export const themePlaygroundStyles = typestyles.styles.component(
  'theme-playground',
  () => ({
    slots: [
      'root',
      'workspace',
      'controls',
      'preview',
      'previewInner',
      'previewFrame',
      'previewFrameMobile',
      'toolbar',
      'code',
      'controlGroup',
      'controlLabel',
    ],
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: t.space[3].var,
    },
    workspace: {
      display: 'grid',
      gridTemplateColumns: '15rem 1fr',
      gap: 0,
      borderRadius: t.radius.lg.var,
      border: `1px solid ${t.color.border.default.var}`,
      backgroundColor: t.color.background.surface.var,
      overflow: 'hidden',
      ...styles.media('md', 'max', {
        gridTemplateColumns: '1fr',
      }),
    },
    controls: {
      display: 'flex',
      flexDirection: 'column',
      gap: t.space[4].var,
      padding: t.space[4].var,
      borderRight: `1px solid ${t.color.border.default.var}`,
      backgroundColor: t.color.background.surface.var,
      ...styles.media('md', 'max', {
        borderRight: 'none',
        borderBottom: `1px solid ${t.color.border.default.var}`,
      }),
    },
    preview: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '24rem',
      backgroundColor: t.color.background.app.var,
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: t.space[2].var,
      padding: t.space[3].var,
      borderBottom: `1px solid ${t.color.border.default.var}`,
    },
    previewInner: {
      flex: 1,
      padding: t.space[4].var,
      overflow: 'auto',
    },
    previewFrame: {
      width: '100%',
    },
    previewFrameMobile: {
      width: '100%',
      maxWidth: '24rem',
      marginInline: 'auto',
    },
    controlGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: t.space[2].var,
    },
    controlLabel: {
      fontSize: t.fontSize.sm.var,
      fontWeight: t.fontWeight.medium.var,
      color: t.color.text.secondary.var,
    },
    code: {
      borderRadius: t.radius.lg.var,
      overflow: 'hidden',
    },
  }),
  { layer: 'components' },
);
