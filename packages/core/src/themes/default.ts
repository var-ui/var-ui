import { createDesignTheme } from '../create-theme';
import { defaultTokens } from './default-pack';

export {
  defaultDarkColorValues,
  defaultDarkSyntaxValues,
  defaultLightColorValues,
  defaultLightSyntaxValues,
} from './default-values';
export { defaultTokens } from './default-pack';

export const defaultTheme = createDesignTheme({
  name: 'default',
  from: defaultTokens,
});
