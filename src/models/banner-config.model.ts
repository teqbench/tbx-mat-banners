import { type TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-icons';

import { type TbxMatBannerActionsGroupControl } from '../types/banner-actions-group-control.type';

/**
 * Configuration for a single banner
 *
 * @remarks
 * Passed to {@link TbxMatBannerService.show} for full control over
 * severity level, message, duration, actions group,
 * icon visibility, and close button visibility.
 * The convenience methods (`success()`, `error()`, `warning()`, `information()`,
 * `help()`) set `type` automatically — use this interface directly when
 * you need to specify all options.
 *
 * @example Full control via show():
 * ```typescript
 * import { TbxMatBannerService, TbxMatSeverityLevel } from '@teqbench/tbx-mat-banners';
 *
 * private readonly banner = inject(TbxMatBannerService);
 *
 * this.banner.show({
 *     type: TbxMatSeverityLevel.Warning,
 *     message: 'Unsaved changes will be lost.',
 *     actionsGroup: [
 *         { type: 'button', key: 'discard', label: 'Discard', appearance: 'filled' },
 *         { type: 'button', key: 'cancel', label: 'Cancel' },
 *     ],
 * });
 * ```
 *
 * @example Convenience method with actions group and form controls:
 * ```typescript
 * this.banner.warning('A new version is available.', {
 *     actionsGroup: [
 *         { type: 'checkbox', key: 'autoUpdate', label: 'Auto-update', defaultValue: true },
 *         { type: 'button', key: 'update', label: 'Update Now', appearance: 'filled' },
 *         { type: 'button', key: 'later', label: 'Later' },
 *     ],
 * });
 * ```
 *
 * @category Models
 * @since 1.0.0
 * @related TbxMatBannerConfigArgs
 * @related TbxMatBannerService
 * @related TbxMatBannerActionsGroupControl
 * @related TbxMatBannerRef
 *
 * @public
 */
export interface TbxMatBannerConfig {
    /**
     * Severity level — determines the icon, panel color, and CSS class applied to the banner
     *
     * @public
     */
    readonly type: TbxMatSeverityLevel;

    /**
     * Message text displayed in the banner body
     *
     * @public
     */
    readonly message: string;

    /**
     * Display duration in milliseconds
     *
     * @remarks
     * - `<= 0` or omitted — indefinite (no auto-dismiss). The banner remains visible
     *   until dismissed by an action button, close button, or programmatic
     *   `dismiss()` / `dismissAll()`.
     * - `> 0` — used as-is, no clamping applied. The banner auto-dismisses
     *   after this duration.
     *
     * Defaults to `0` (indefinite) when omitted.
     *
     * @public
     */
    readonly duration?: number;

    /**
     * Show the severity icon in the banner
     *
     * @remarks
     * When `true` (the default), the severity-level icon is rendered to the
     * left of the message text. Set to `false` to hide the icon and display
     * only the message.
     *
     * Defaults to `true`.
     *
     * @public
     */
    readonly showSeverityIcon?: boolean;

    /**
     * Show the close/dismiss button in the banner
     *
     * @remarks
     * When `true` (the default), a dismiss button is rendered on the
     * trailing edge of the banner. Set to `false` to hide the button
     * so the banner can only be dismissed by an action button,
     * duration timeout, or programmatically via `dismiss()` / `dismissAll()`.
     *
     * Defaults to `true`.
     *
     * @public
     */
    readonly showCloseButton?: boolean;

    /**
     * Actions group controls
     *
     * @remarks
     * An array of controls rendered in the slot between the message and
     * the close button. Supports buttons, checkboxes, toggles, radio groups,
     * and toggle groups. Controls render in array order.
     *
     * Button controls dismiss the banner when clicked. Form controls
     * (checkbox, toggle, radio-group, toggle-group) have their current
     * values collected into {@link TbxMatBannerResult.actionsGroupValues}
     * when the banner is dismissed.
     *
     * @public
     */
    readonly actionsGroup?: TbxMatBannerActionsGroupControl[];

    /**
     * Additional CSS classes applied to the overlay panel
     *
     * @remarks
     * Merged with the severity-level panel class — consumer-provided
     * classes are appended, not replaced. Only applicable to overlay
     * banners created via {@link TbxMatBannerService}.
     *
     * @public
     */
    readonly panelClass?: string | string[];

    /**
     * Vertical position of the overlay banner
     *
     * @remarks
     * Controls whether the overlay banner renders at the top or bottom
     * of the viewport. Defaults to `'top'` when omitted. Only applicable
     * to overlay banners created via {@link TbxMatBannerService}.
     *
     * @public
     */
    readonly verticalPosition?: 'top' | 'bottom';
}
