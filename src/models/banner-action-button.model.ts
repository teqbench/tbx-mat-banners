import { type TbxMatBannerActionButtonAppearance } from '../types/banner-action-button-appearance.type';
import { type TbxMatBannerIconResolver } from '../types/banner-icon-resolver.type';

/**
 * Button control in a banner actions group
 *
 * @remarks
 * Defines a clickable button rendered in the banner's actions group slot
 * (between the message and the close button). Clicking the button
 * dismisses the banner. The button's `key` is included in
 * {@link TbxMatBannerResult.actionKey} so the consumer can identify
 * which button triggered the dismissal.
 *
 * Each button specifies its own `appearance` and optional `icon`.
 * The severity panel SCSS provides color token overrides for all six
 * {@link https://material.angular.dev/components/button/api | Angular Material}
 * button variants, so a `'filled'` button inside a success banner
 * automatically receives the success color treatment.
 *
 * @usage
 * Add one or more buttons to the `actionsGroup` array on
 * {@link TbxMatBannerConfig} to let users respond inline (e.g., undo,
 * retry, dismiss with intent).
 *
 * @example Text button:
 * ```typescript
 * { type: 'button', key: 'undo', label: 'Undo' }
 * ```
 *
 * @example Filled button with icon:
 * ```typescript
 * // myIconService is a hypothetical consumer-defined icon resolver
 * {
 *     type: 'button',
 *     key: 'retry',
 *     label: 'Retry',
 *     icon: 'refresh',
 *     appearance: 'filled',
 *     actionIconResolverService: myIconService,
 * }
 * ```
 *
 * @example Icon-only button:
 * ```typescript
 * // label serves as the aria-label for accessibility
 * // myIconService is a hypothetical consumer-defined icon resolver
 * {
 *     type: 'button',
 *     key: 'settings',
 *     label: 'Settings',
 *     icon: 'settings',
 *     appearance: 'icon',
 *     actionIconResolverService: myIconService,
 * }
 * ```
 *
 * @category Models
 * @category Interface
 * @displayName Banner Action Button
 * @order 4
 * @since 1.0.0
 * @related TbxMatBannerActionButtonAppearance
 * @related TbxMatBannerConfig
 *
 * @public
 */
export interface TbxMatBannerActionButton {
    /**
     * Discriminant — identifies this control as a button
     *
     * @public
     */
    readonly type: 'button';

    /**
     * Unique key identifying this button in the actions group
     *
     * @remarks
     * Included in {@link TbxMatBannerResult.actionKey} when this button
     * triggers dismissal. Must be unique within the `actionsGroup` array.
     *
     * @public
     */
    readonly key: string;

    /**
     * Button label text
     *
     * @remarks
     * Displayed as the button text when `appearance` is not `'icon'`.
     * Used as the `aria-label` when `appearance` is `'icon'`.
     *
     * @public
     */
    readonly label: string;

    /**
     * Icon name to resolve via the action icon resolver service
     *
     * @remarks
     * The resolved icon renders inside the action button. Required when
     * `appearance` is `'icon'`. Optional for other appearance values.
     *
     * The name is passed to the `resolve()` method of the
     * `actionIconResolverService`. For font icons, this is typically the
     * {@link https://fonts.google.com/icons | Material Symbols} ligature name.
     *
     * @public
     */
    readonly icon?: string;

    /**
     * Position of the icon relative to the label text
     *
     * @remarks
     * Controls whether the icon renders before or after the label.
     * Defaults to `'before'` when omitted. Has no effect when
     * `appearance` is `'icon'` (icon-only buttons have no label
     * to position relative to).
     *
     * @public
     */
    readonly iconPosition?: 'before' | 'after';

    /**
     * Visual appearance of the button
     *
     * @remarks
     * Defaults to `'text'` when omitted.
     *
     * @public
     */
    readonly appearance?: TbxMatBannerActionButtonAppearance;

    /**
     * Icon resolver service for this button's icon
     *
     * @remarks
     * Required when `icon` is set and the resolved appearance renders
     * an icon. If not provided and `icon` is set, the icon is silently
     * omitted (the button still functions as text-only).
     *
     * @public
     */
    readonly actionIconResolverService?: TbxMatBannerIconResolver;
}
