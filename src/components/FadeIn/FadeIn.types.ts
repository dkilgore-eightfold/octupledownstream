import { ReactNode } from 'react';

export interface FadeInProps {
  /**
   * The FadeIn child renderer.
   */
  children: ReactNode;
  /**
   * The FadeIn delay amount.
   */
  delay?: number;
  /**
   * The FadeIn animation duration.
   * @default 300
   */
  duration?: number;
  /**
   * Whether the FadeIn style is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Custom classes of FadeIn.
   */
  classNames?: string;
  /**
   * The FadeIn test id.
   */
  'data-testid'?: string;
}
