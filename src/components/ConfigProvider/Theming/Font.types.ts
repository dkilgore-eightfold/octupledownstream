import { Value, Variables } from './Theming.types';

export interface CustomFont {
  fontFamily: string;
  src: string;
  fontStyle?: string;
  fontWeight?: string;
  unicodeRange?: string;
}

export interface OcBaseFont {
  fontFamily?: Value;
  fontSize?: number;
  fontStack?: Value;
}

export interface OcFont extends OcBaseFont {}

export interface FontOptions {
  /**
   * Define a custom font
   * @type {OcBaseFont}
   * @default null
   */
  customFont?: OcBaseFont;
}

export interface IGetFontStyle {
  variables: Variables;
}

export interface IRegisterFont extends IGetFontStyle {
  styleNode: HTMLStyleElement;
}
