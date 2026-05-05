import { type TbxMatBannerConfig } from './banner-config.model';
import { type TbxMatBannerResult } from './banner-result.model';

/**
 * Reference to a queued or active banner
 *
 * @remarks
 * Returned synchronously from all {@link TbxMatBannerService} methods
 * (`show()`, `success()`, `error()`, `warning()`, `information()`, `help()`,
 * `default()`).
 * Contains two members:
 *
 * - `config` — the consumer-provided configuration, available immediately.
 * - `result` — a promise that resolves with a {@link TbxMatBannerResult}
 *   containing the {@link TbxMatBannerDismissReason}, the `actionKey` of
 *   the button that triggered dismissal (if applicable), and the
 *   `actionsGroupValues` record when the banner is dismissed.
 *
 * #### Fire-and-Forget Usage
 *
 * Consumers who do not need the dismiss result should
 * prefix the call with `void` to suppress unhandled-promise lint warnings:
 *
 * ```typescript
 * void this.bannerService.success('Saved');
 * ```
 *
 * @usage
 * Capture the returned ref to react to banner dismissal or inspect the
 * original config.
 *
 * @example Reacting to action dismissal with form values:
 * ```typescript
 * const ref = this.bannerService.warning('Update available', {
 *     actionsGroup: [
 *         { type: 'checkbox', key: 'autoUpdate', label: 'Auto-update' },
 *         { type: 'button', key: 'update', label: 'Update', appearance: 'filled' },
 *     ],
 * });
 *
 * const result = await ref.result;
 *
 * if (result.actionKey === 'update') {
 *     const autoUpdate = result.actionsGroupValues['autoUpdate'] as boolean;
 *     this.performUpdate(autoUpdate);
 * }
 * ```
 *
 * @example Fire-and-forget:
 * ```typescript
 * void this.bannerService.success('Saved');
 * ```
 *
 * @category Models
 * @category Interface
 * @displayName Banner Ref
 * @order 2
 * @since 1.0.0
 * @related TbxMatBannerResult
 * @related TbxMatBannerDismissReason
 * @related TbxMatBannerConfig
 * @related TbxMatBannerService
 *
 * @public
 */
export interface TbxMatBannerRef {
    /**
     * The consumer-provided banner configuration
     *
     * @remarks
     * Available immediately (synchronous). Reflects the original config
     * as passed by the consumer, not the resolved config with defaults
     * applied.
     *
     * @public
     */
    readonly config: TbxMatBannerConfig;

    /**
     * Dismiss result, available when the banner is dismissed
     *
     * @remarks
     * Resolves with a {@link TbxMatBannerResult} containing the
     * {@link TbxMatBannerDismissReason}, the `actionKey` of the button
     * that triggered dismissal (if applicable), and the collected
     * `actionsGroupValues` from form controls.
     *
     * @public
     */
    readonly result: Promise<TbxMatBannerResult>;
}
