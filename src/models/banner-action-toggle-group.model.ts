/**
 * Individual option within a {@link TbxMatBannerActionToggleGroup}
 *
 * @category Models
 * @since 1.0.0
 *
 * @public
 */
export interface TbxMatBannerToggleOption {
    /**
     * Display label for the toggle button
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

    /**
     * Material icon name for an icon-only toggle button
     *
     * @remarks
     * When provided, renders an icon instead of the label text.
     *
     * @public
     */
    readonly icon?: string;
}

/**
 * Button toggle group control in a banner actions group
 *
 * @remarks
 * Renders a {@link https://material.angular.dev/components/button-toggle/api | MatButtonToggleGroup}
 * with {@link https://material.angular.dev/components/button-toggle/api | MatButtonToggle}
 * options in the banner's actions group slot. The selected value is tracked
 * internally by the banner component and included in
 * {@link TbxMatBannerResult.actionsGroupValues} as a `string` (single-select)
 * or `string[]` (multi-select) under this control's `key` when the banner
 * is dismissed.
 *
 * @usage
 * Add a toggle group to the `actionsGroup` array on {@link TbxMatBannerConfig}
 * to collect a selection alongside the banner's message.
 *
 * @example Single-select:
 * ```typescript
 * {
 *     type: 'toggle-group',
 *     key: 'format',
 *     options: [
 *         { label: 'JSON', value: 'json' },
 *         { label: 'CSV', value: 'csv' },
 *     ],
 *     defaultValue: 'json',
 * }
 * ```
 *
 * @example Multi-select with icons:
 * ```typescript
 * {
 *     type: 'toggle-group',
 *     key: 'channels',
 *     multiple: true,
 *     options: [
 *         { label: 'Email', value: 'email', icon: 'email' },
 *         { label: 'SMS', value: 'sms', icon: 'sms' },
 *     ],
 *     defaultValue: ['email'],
 * }
 * ```
 *
 * @category Models
 * @displayName Banner Action Toggle Group
 * @order 8
 * @since 1.0.0
 * @related TbxMatBannerToggleOption
 * @related TbxMatBannerConfig
 * @related TbxMatBannerResult
 *
 * @public
 */
export interface TbxMatBannerActionToggleGroup {
    /**
     * Discriminant — identifies this control as a button toggle group
     *
     * @public
     */
    readonly type: 'toggle-group';

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
    readonly options: readonly TbxMatBannerToggleOption[];

    /**
     * Allow multiple selections
     *
     * @remarks
     * Defaults to `false` (single-select). When `true`, the result
     * value is `string[]` instead of `string`.
     *
     * @public
     */
    readonly multiple?: boolean;

    /**
     * Initially selected value(s)
     *
     * @remarks
     * `string` for single-select, `string[]` for multi-select.
     * Should match the `value` of one or more `options`.
     * When omitted, no option is pre-selected.
     *
     * @public
     */
    readonly defaultValue?: string | string[];
}
