import { textField } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const tf = textField();
  const label = serializeHtmlTag(
    'label',
    { ...mergeProps(tf.label), for: 'project-name' },
    'Project name',
  );
  const input = serializeHtmlTag(
    'input',
    {
      ...mergeProps(tf.input),
      id: 'project-name',
      type: 'text',
      placeholder: 'My project',
    },
    '',
  );
  const description = serializeHtmlTag('p', mergeProps(tf.description), 'Shown on the dashboard.');
  return serializeHtmlTag('div', mergeProps(tf.root), `${label}${input}${description}`);
}
