import { type TbxMatBannerDismissReason } from '../enums/banner-dismiss-reason.enum';

/**
 * Result returned when a banner is dismissed
 *
 * @remarks
 * Resolved by the {@link TbxMatBannerRef.result} promise when a
 * banner is dismissed for any reason — user action, timeout, or
 * programmatic dismissal. The `dismissReason` property indicates
 * which trigger caused the dismissal. When an action button triggered
 * the dismissal, `actionKey` identifies the button. Form control
 * values from the actions group are collected in `actionsGroupValues`.
 *
 * @usage
 * Await the result promise from any {@link TbxMatBannerService} method
 * to determine how a banner was dismissed and retrieve collected values.
 *
 * @example
 * ```typescript
 * const ref = this.bannerService.warning('Update available', {
 *     actionsGroup: [
 *         { type: 'checkbox', key: 'autoUpdate', label: 'Auto-update', defaultValue: false },
 *         { type: 'button', key: 'update', label: 'Update Now', appearance: 'filled' },
 *         { type: 'button', key: 'later', label: 'Later' },
 *     ],
 * });
 *
 * const result: TbxMatBannerResult = await ref.result;
 *
 * if (result.actionKey === 'update') {
 *     const autoUpdate = result.actionsGroupValues['autoUpdate'] as boolean;
 *     this.performUpdate(autoUpdate);
 * }
 * ```
 *
 * @category Models
 * @category Interface
 * @displayName Banner Result
 * @order 3
 * @since 1.0.0
 * @related TbxMatBannerDismissReason
 * @related TbxMatBannerRef
 *
 * @public
 */
export interface TbxMatBannerResult {
    /**
     * The reason the banner was dismissed
     *
     * @public
     */
    readonly dismissReason: TbxMatBannerDismissReason;

    /**
     * Key of the action button that triggered dismissal
     *
     * @remarks
     * Present only when `dismissReason` is
     * {@link TbxMatBannerDismissReason.Action}. Corresponds to the
     * `key` property of the {@link TbxMatBannerActionButton} that
     * was clicked.
     *
     * @public
     */
    readonly actionKey?: string;

    /**
     * Collected values from all form controls in the actions group at time of dismissal
     *
     * @remarks
     * A record keyed by each control's `key` property. Value types depend
     * on the control type:
     *
     * - `'checkbox'` — `boolean`
     * - `'toggle'` — `boolean`
     * - `'radio-group'` — `string | undefined`
     * - `'toggle-group'` (single-select) — `string | undefined`
     * - `'toggle-group'` (multi-select) — `string[]`
     *
     * Empty when no form controls are in the actions group.
     *
     * @public
     */
    readonly actionsGroupValues: Record<string, unknown>;
}
