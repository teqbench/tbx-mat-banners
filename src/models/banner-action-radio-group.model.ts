/**
 * Individual option within a {@link TbxMatBannerActionRadioGroup}
 *
 * @example
 * ```typescript
 * { label: 'Low', value: 'low' }
 * ```
 *
 * @category Models
 * @category Interface
 * @displayName Banner Radio Option
 * @order 7
 * @since 1.0.0
 *
 * @public
 */
export interface TbxMatBannerRadioOption {
    /**
     * Display label for the radio button
     *
     * @public
     */
    readonly label: string;

    /**
     * Value submitted when this option is selected
     *
     * @public
     */
    readonly value: string;
}

/**
 * Radio group control in a banner actions group
 *
 * @remarks
 * Renders a {@link https://material.angular.dev/components/radio/api | MatRadioGroup}
 * with {@link https://material.angular.dev/components/radio/api | MatRadioButton}
 * options in the banner's actions group slot. The selected value is tracked
 * internally by the banner component and included in
 * {@link TbxMatBannerResult.actionsGroupValues} as a `string` under
 * this control's `key` when the banner is dismissed.
 *
 * @usage
 * Add a radio group to the `actionsGroup` array on {@link TbxMatBannerConfig}
 * to collect a single-select choice alongside the banner's message.
 *
 * @example
 * ```typescript
 * {
 *     type: 'radio-group',
 *     key: 'priority',
 *     options: [
 *         { label: 'Low', value: 'low' },
 *         { label: 'Medium', value: 'medium' },
 *         { label: 'High', value: 'high' },
 *     ],
 *     defaultValue: 'medium',
 * }
 * ```
 *
 * @category Models
 * @category Interface
 * @displayName Banner Action Radio Group
 * @order 8
 * @since 1.0.0
 * @related TbxMatBannerRadioOption
 * @related TbxMatBannerConfig
 * @related TbxMatBannerResult
 *
 * @public
 */
export interface TbxMatBannerActionRadioGroup {
    /**
     * Discriminant — identifies this control as a radio group
     *
     * @public
     */
    readonly type: 'radio-group';

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
     * Available options
     *
     * @public
     */
    readonly options: readonly TbxMatBannerRadioOption[];

    /**
     * Initially selected option value
     *
     * @remarks
     * Should match the `value` of one of the `options`. When omitted,
     * no option is pre-selected.
     *
     * @public
     */
    readonly defaultValue?: string;
}
