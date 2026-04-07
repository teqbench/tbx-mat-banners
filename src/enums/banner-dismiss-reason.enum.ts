/**
 * Reason a banner was dismissed
 *
 * @remarks
 * Returned as part of {@link TbxMatBannerResult} via
 * {@link TbxMatBannerRef.result}. Each value corresponds to a
 * distinct dismissal trigger:
 *
 * - `Action` — the user clicked an action button in the actions group.
 * - `Close` — the user clicked the close button.
 * - `Timeout` — the banner auto-dismissed after the configured duration expired.
 * - `ProgrammaticDismissAll` — {@link TbxMatBannerService.dismissAll} was called,
 *   clearing the queue and dismissing the active banner.
 * - `ProgrammaticDismissCurrent` — {@link TbxMatBannerService.dismiss} was called,
 *   dismissing only the currently active banner.
 *
 * @usage
 * Inspect the dismiss reason after awaiting the result promise to determine
 * which user or programmatic action closed the banner.
 *
 * @example
 * ```typescript
 * const ref = this.bannerService.success('Item deleted', {
 *     actionsGroup: [{ type: 'button', key: 'undo', label: 'Undo' }],
 *     duration: 30_000,
 * });
 *
 * const result = await ref.result;
 *
 * if (result.dismissReason === TbxMatBannerDismissReason.Action) {
 *     this.undoDelete();
 * }
 * ```
 *
 * @category Enums
 * @displayName Banner Dismiss Reason
 * @order 1
 * @since 1.0.0
 * @related TbxMatBannerResult
 * @related TbxMatBannerRef
 *
 * @public
 */
export enum TbxMatBannerDismissReason {
    /**
     * The user clicked an action button in the actions group
     *
     * @public
     */
    Action = 'action',

    /**
     * The user clicked the close button
     *
     * @public
     */
    Close = 'close',

    /**
     * The banner auto-dismissed after the configured duration expired
     *
     * @public
     */
    Timeout = 'timeout',

    /**
     * {@link TbxMatBannerService.dismissAll} was called programmatically
     *
     * @remarks
     * All queued banners and the active banner are dismissed.
     * Queued banners that were never displayed resolve their
     * {@link TbxMatBannerRef.result} promise with this reason.
     *
     * @public
     */
    ProgrammaticDismissAll = 'programmatic-dismiss-all',

    /**
     * {@link TbxMatBannerService.dismiss} was called programmatically
     *
     * @remarks
     * Only the currently active banner is dismissed. Queued
     * banners are not affected.
     *
     * @public
     */
    ProgrammaticDismissCurrent = 'programmatic-dismiss-current',
}
