import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

export const fileTree = typestyles.styles.component(
  'fileTree',
  (c) => {
    const v = c.vars({
      rootForeground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
        inherits: false,
      },
      rootBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
        inherits: false,
      },
      rootBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
        inherits: false,
      },
      nestedBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
        inherits: false,
      },
      rowColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
        inherits: false,
      },
      folderColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
        inherits: false,
      },
      fileColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['root', 'list', 'item', 'listNested', 'row', 'folder', 'file'],
      root: {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontSize: t.fontSize.sm.var,
        lineHeight: 1.5,
        color: v.rootForeground.var,
        margin: `${t.space[3].var} 0`,
        padding: t.space[3].var,
        borderRadius: t.radius.md.var,
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
        marginTop: t.space[1].var,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: t.space[4].var,
        borderLeft: `1px solid ${v.nestedBorder.var}`,
      },
      row: {
        display: 'block',
        padding: `${t.space[1].var} 0`,
        color: v.rowColor.var,
      },
      folder: {
        fontWeight: t.fontWeight.semibold.var,
        color: v.folderColor.var,
      },
      file: {
        color: v.fileColor.var,
      },
    };
  },
  { layer: 'components' },
);
