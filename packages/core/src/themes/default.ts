import { createDesignTheme } from '../create-theme';
import { defaultDarkValues, defaultLightValues } from './default-values';

export {
  defaultDarkColorValues,
  defaultDarkValues,
  defaultLightColorValues,
  defaultLightValues,
} from './default-values';

export const defaultTheme = createDesignTheme({
  name: 'default',
  light: defaultLightValues,
  dark: defaultDarkValues,
  surfaces: {
    light: defaultLightValues,
    dark: defaultDarkValues,
  },
});
