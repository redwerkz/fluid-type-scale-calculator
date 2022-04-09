import { siBuymeacoffee, siGithub, siLinkedin, siStackexchange, siTwitter } from 'simple-icons/icons';
import { FormState } from './types';

/** The root API endpoint for requesting @font-face declarations from Google Fonts. */
export const GOOGLE_FONTS_BASE_URL = `https://fonts.googleapis.com/css2`;

/** The default font family used by the app and shown in font pickers. */
export const DEFAULT_FONT_FAMILY = 'Inter';

/** Regex to match a comma-separated of values, with only alphanumeric characters permitted between the commas. */
export const COMMA_SEPARATED_LIST_REGEX = /^[a-zA-Z0-9-](?:(,\s*)?[a-zA-Z0-9-])*$/;

export const modularRatios = {
  minorSecond: {
    name: 'Minor second',
    ratio: 1.067,
  },
  majorSecond: {
    name: 'Major second',
    ratio: 1.125,
  },
  minorThird: {
    name: 'Minor third',
    ratio: 1.2,
  },
  majorThird: {
    name: 'Major third',
    ratio: 1.25,
  },
  perfectFourth: {
    name: 'Perfect fourth',
    ratio: 1.333,
  },
  augmentedFourth: {
    name: 'Augmented fourth',
    ratio: 1.414,
  },
  perfectFifth: {
    name: 'Perfect fifth',
    ratio: 1.5,
  },
  goldenRatio: {
    name: 'Golden ratio',
    ratio: 1.618,
  },
} as const;

/** The initial values used to populate the app's form. */
export const initialFormState: FormState = {
  min: {
    fontSize: 16,
    screenWidth: 400,
    modularRatio: modularRatios.majorThird.ratio,
  },
  max: {
    fontSize: 19,
    screenWidth: 1280,
    modularRatio: modularRatios.perfectFourth.ratio,
  },
  typeScaleSteps: {
    all: ['sm', 'base', 'md', 'lg', 'xl', 'xxl', 'xxxl'],
    base: 'base',
  },
  namingConvention: 'font-size',
  shouldUseRems: true,
  roundingDecimalPlaces: 2,
  fontFamily: DEFAULT_FONT_FAMILY,
};

/** Enum of delays in milliseconds, for consistency across event handlers. */
export enum Delay {
  SHORT = 150,
  MEDIUM = 300,
  LONG = 400,
}

/** Social media profiles and links. */
export const socials = {
  linkedin: {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/aleksandr-hovhannisyan-ba154b120/',
    icon: siLinkedin.svg,
  },
  github: {
    name: 'GitHub',
    url: 'https://github.com/AleksandrHovhannisyan',
    icon: siGithub.svg,
  },
  twitter: {
    name: 'Twitter',
    handle: '@hovhaDovah',
    url: 'https://twitter.com/hovhaDovah',
    icon: siTwitter.svg,
  },
  stackexchange: {
    name: 'Stack Exchange',
    url: 'https://stackexchange.com/users/6935154/aleksandrh',
    icon: siStackexchange.svg,
  },
  buymeacoffee: {
    name: 'Buy Me a Coffee',
    url: 'https://www.buymeacoffee.com/ahovhannisyan',
    icon: siBuymeacoffee.svg,
  },
} as const;
