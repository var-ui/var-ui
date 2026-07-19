import { textField } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const tf = textField();
  const label = serializeHtmlTag(
    'label',
    { ...recipeProps(tf.label), for: 'project-name' },
    'Project name',
  );
  const input = serializeHtmlTag(
    'input',
    {
      ...recipeProps(tf.input),
      id: 'project-name',
      type: 'text',
      placeholder: 'My project',
    },
    '',
  );
  const description = serializeHtmlTag('p', recipeProps(tf.description), 'Shown on the dashboard.');
  return serializeHtmlTag('div', recipeProps(tf.root), `${label}${input}${description}`);
}
