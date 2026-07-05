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
      slots: ['overlay', 'modal', 'content', 'heading', 'description'],
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
      heading: {
        fontSize: '18px',
        fontWeight: t.fontWeight.semibold,
        margin: 0,
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
