import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

export const dialog = styles.component(
  'dialog',
  (c) => {
    const v = c.vars({
      overlayBackground: {
        value: `${t.color.overlay.default}`,
        syntax: '<color>',
        inherits: false,
      },
      modalBackground: {
        value: `${t.color.background.surface}`,
        syntax: '<color>',
        inherits: false,
      },
      modalBorder: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
      descriptionColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['overlay', 'modal', 'content', 'header', 'heading', 'description', 'closeButton'],
      overlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: v.overlayBackground.var,
        display: 'grid',
        placeItems: 'center',
        padding: t.space[4],
      },
      modal: {
        width: 'min(480px, 100%)',
        backgroundColor: v.modalBackground.var,
        borderRadius: t.radius.lg,
        border: `1px solid ${v.modalBorder.var}`,
        boxShadow: t.shadow.md,
        padding: t.space[4],
      },
      content: {
        display: 'grid',
        gap: t.space[3],
      },
      header: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: t.space[3],
      },
      heading: {
        fontSize: '18px',
        fontWeight: t.fontWeight.semibold,
        margin: 0,
      },
      closeButton: {
        appearance: 'none',
        border: 'none',
        background: 'transparent',
        color: t.color.text.secondary,
        cursor: 'pointer',
        display: 'inline-flex',
        padding: t.space[1],
        marginRight: `calc(${t.space[1]} * -1)`,
        borderRadius: t.radius.sm,
        '&:hover': {
          backgroundColor: t.color.background.subtle,
          color: t.color.text.primary,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus}`,
          outlineOffset: '1px',
        },
      },
      description: {
        margin: 0,
        fontSize: t.fontSize.sm,
        color: v.descriptionColor.var,
      },
    };
  },
  { layer: 'components' },
);
