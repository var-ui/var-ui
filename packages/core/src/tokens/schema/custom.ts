import type { TokenSchema } from 'typestyles';

/** Unrestricted `@property` leaf for compound CSS values (shadows, transitions, font stacks, etc.). */
export const customToken = { syntax: '*', initial: 'none' } as const satisfies TokenSchema;
