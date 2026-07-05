import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

export const fileTree = styles.component(
  'fileTree',
  (c) => {
    const v = c.vars({
      rootForeground: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      rootBorder: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
      rootBackground: {
        value: `${t.color.background.subtle}`,
        syntax: '<color>',
        inherits: false,
      },
      nestedBorder: {
        value: `${t.color.border.default}`,
        syntax: '<color>',
        inherits: false,
      },
      rowColor: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      folderColor: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      fileColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['root', 'list', 'item', 'listNested', 'row', 'folder', 'file'],
      root: {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontSize: t.fontSize.sm,
        lineHeight: 1.5,
        color: v.rootForeground.var,
        margin: `${t.space[3]} 0`,
        padding: t.space[3],
        borderRadius: t.radius.md,
        border: `1px solid ${v.rootBorder.var}`,
        backgroundColor: v.rootBackground.var,
        overflowX: 'auto',
      },
      list: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
      },
      item: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
      },
      listNested: {
        listStyle: 'none',
        marginTop: t.space[1],
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: t.space[4],
        borderLeft: `1px solid ${v.nestedBorder.var}`,
      },
      row: {
        display: 'block',
        padding: `${t.space[1]} 0`,
        color: v.rowColor.var,
      },
      folder: {
        fontWeight: t.fontWeight.semibold,
        color: v.folderColor.var,
      },
      file: {
        color: v.fileColor.var,
      },
    };
  },
  { layer: 'components' },
);
