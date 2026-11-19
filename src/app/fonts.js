import { Manrope } from 'next/font/google';

/**
 * Admin typography
 * ----------------
 * One family, three weights. Dashboards need scanability, not personality:
 * order numbers, dates, amounts and status badges all read cleanest in a
 * neutral geometric sans. The storefront's display serif is deliberately
 * NOT used here.
 */
export const fontAdmin = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});
