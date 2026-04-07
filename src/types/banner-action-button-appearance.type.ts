import type { MatButtonAppearance } from '@angular/material/button';

/**
 * Visual appearance of a banner action button
 *
 * @remarks
 * Union of {@link https://material.angular.dev/components/button/api | MatButtonAppearance}
 * (`'text'` | `'filled'` | `'elevated'` | `'outlined'` | `'tonal'`) and the
 * custom `'icon'` value for icon-only action buttons.
 *
 * Values other than `'icon'` map directly to the `[appearance]` input on
 * {@link https://material.angular.dev/components/button/api | Angular Material} button
 * directives. The `'icon'` value renders a `mat-icon-button` instead.
 *
 * This type is coupled to `MatButtonAppearance` from `@angular/material/button`.
 * If {@link https://material.angular.dev | Angular Material} renames, removes,
 * or adds values to that type, this type will need a corresponding update.
 *
 * Each button in the actions group specifies its own appearance. When omitted,
 * defaults to `'text'`.
 *
 * @usage
 * Specify the action button appearance when the default `'text'` style
 * is not desired.
 *
 * @example
 * ```typescript
 * // Tonal action button
 * this.bannerService.warning('Connection lost', {
 *     actionsGroup: [{
 *         type: 'button',
 *         key: 'retry',
 *         label: 'Retry',
 *         appearance: 'tonal',
 *     }],
 * });
 *
 * // Icon-only action button
 * this.bannerService.error('Upload failed', {
 *     actionsGroup: [{
 *         type: 'button',
 *         key: 'retry',
 *         label: 'Retry', // used as aria-label
 *         icon: 'refresh',
 *         appearance: 'icon',
 *     }],
 * });
 * ```
 *
 * @category Types
 * @displayName Banner Action Button Appearance
 * @order 1
 * @since 1.0.0
 * @related TbxMatBannerActionButton
 *
 * @public
 */
export type TbxMatBannerActionButtonAppearance = MatButtonAppearance | 'icon';
