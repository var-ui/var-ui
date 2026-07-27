export type FontFaceDefinition = {
  family: string;
  src: string | string[];
  fontWeight?: string | number;
  fontStyle?: string;
  fontDisplay?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  unicodeRange?: string;
};

export type FontSlotConfig = {
  face: FontFaceDefinition;
  fallback: string;
};

export type DefineFontsInput = {
  display?: FontSlotConfig;
  sans?: FontSlotConfig;
  mono?: FontSlotConfig;
};

export type DefineFontsResult = {
  fonts: FontFaceDefinition[];
  tokens: {
    fontFamily: {
      display?: string;
      sans?: string;
      mono?: string;
    };
  };
};
