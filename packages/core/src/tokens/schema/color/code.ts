import { atProperty, type TokenSchema } from 'typestyles';

export const codeTokenSchema = {
  base: atProperty.color,
  keyword: atProperty.color,
  title: atProperty.color,
  attr: atProperty.color,
  string: atProperty.color,
  builtIn: atProperty.color,
  comment: atProperty.color,
  name: atProperty.color,
  section: atProperty.color,
  bullet: atProperty.color,
  addition: atProperty.color,
  additionBackground: atProperty.color,
  deletion: atProperty.color,
  deletionBackground: atProperty.color,
} as const satisfies TokenSchema;
