import { createDesignTheme } from '../create-theme';
import { defaultTokens } from './default-pack';

export {
  defaultDarkCodeValues,
  defaultDarkCodeValues as defaultDarkSyntaxValues,
  defaultDarkColorValues,
  defaultLightCodeValues,
  defaultLightCodeValues as defaultLightSyntaxValues,
  defaultLightColorValues,
} from './default-values';
export { defaultTokens } from './default-pack';

export const defaultTheme = createDesignTheme({
  name: 'default',
  from: defaultTokens,
});
