/**
 * Checkbox control in a banner actions group
 *
 * @remarks
 * Renders a {@link https://material.angular.dev/components/checkbox/api | MatCheckbox}
 * in the banner's actions group slot. The checkbox value is tracked internally
 * by the banner component and included in
 * {@link TbxMatBannerResult.actionsGroupValues} as a `boolean` under
 * this control's `key` when the banner is dismissed.
 *
 * @usage
 * Add a checkbox to the `actionsGroup` array on {@link TbxMatBannerConfig}
 * to collect a boolean preference alongside the banner's message.
 *
 * @example
 * ```typescript
 * { type: 'checkbox', key: 'dontShowAgain', label: "Don't show again", defaultValue: false }
 * ```
 *
 * @category Models
 * @category Interface
 * @displayName Banner Action Checkbox
 * @order 5
 * @since 1.0.0
 * @related TbxMatBannerConfig
 * @related TbxMatBannerResult
 *
 * @public
 */
export interface TbxMatBannerActionCheckbox {
    /**
     * Discriminant — identifies this control as a checkbox
     *
     * @public
     */
    readonly type: 'checkbox';

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
     * Label displayed next to the checkbox
     *
     * @public
     */
    readonly label: string;

    /**
     * Initial checked state
     *
     * @remarks
     * Defaults to `false` when omitted.
     *
     * @public
     */
    readonly defaultValue?: boolean;
}
