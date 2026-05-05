/**
 * Slide toggle control in a banner actions group
 *
 * @remarks
 * Renders a {@link https://material.angular.dev/components/slide-toggle/api | MatSlideToggle}
 * in the banner's actions group slot. The toggle value is tracked internally
 * by the banner component and included in
 * {@link TbxMatBannerResult.actionsGroupValues} as a `boolean` under
 * this control's `key` when the banner is dismissed.
 *
 * @usage
 * Add a toggle to the `actionsGroup` array on {@link TbxMatBannerConfig}
 * to collect a boolean preference alongside the banner's message.
 *
 * @example
 * ```typescript
 * { type: 'toggle', key: 'autoRetry', label: 'Auto-retry', defaultValue: true }
 * ```
 *
 * @category Models
 * @category Interface
 * @displayName Banner Action Toggle
 * @order 6
 * @since 1.0.0
 * @related TbxMatBannerConfig
 * @related TbxMatBannerResult
 *
 * @public
 */
export interface TbxMatBannerActionToggle {
    /**
     * Discriminant — identifies this control as a slide toggle
     *
     * @public
     */
    readonly type: 'toggle';

    /**
     * Unique key identifying this control in the actions group
     *
     * @remarks
     * Used as the property name in {@link TbxMatBannerResult.actionsGroupValues}.
     * Must be unique within the `actionsGroup` array.
     *
     * @public
     */
    readonly key: string;

    /**
     * Label displayed next to the toggle
     *
     * @public
     */
    readonly label: string;

    /**
     * Initial toggle state
     *
     * @remarks
     * Defaults to `false` when omitted.
     *
     * @public
     */
    readonly defaultValue?: boolean;
}
