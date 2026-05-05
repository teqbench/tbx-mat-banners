import { type TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';

import { type TbxMatBannerActionsGroupControl } from '../types/banner-actions-group-control.type';
import { type TbxMatBannerIconResolver } from '../types/banner-icon-resolver.type';

/**
 * Internal DTO injected into {@link TbxMatBannerComponent} for overlay mode
 *
 * @remarks
 * Not part of the public API — consumers use
 * {@link TbxMatBannerService} or the inline component API, not this
 * interface directly. The service constructs this DTO from
 * {@link TbxMatBannerConfig}, applying defaults, then passes it to the
 * component via a custom injection token.
 *
 * @internal
 */
export interface BannerDataDto {
    /** Severity level — used to resolve the icon and apply the panel class. */
    readonly type: TbxMatSeverityLevel;

    /** Message text displayed in the banner body. */
    readonly message: string;

    /** Callback to dismiss the banner via the close button. */
    readonly dismissByClose: () => void;

    /** Callback to dismiss the banner via an action button. */
    readonly dismissByAction: (actionKey: string) => void;

    /**
     * Resolved duration in milliseconds.
     * `0` indicates indefinite (no auto-dismiss).
     */
    readonly duration: number;

    /** Whether to render the severity icon. */
    readonly showSeverityIcon: boolean;

    /** Whether to render the close/dismiss button. */
    readonly showCloseButton: boolean;

    /** Close button icon resolver. */
    readonly closeIconResolverService: TbxMatBannerIconResolver;

    /** Actions group controls to render. */
    readonly actionsGroup: TbxMatBannerActionsGroupControl[];

    /** CSS class for the enter animation (empty string = no animation). */
    readonly enterAnimationClass: string;

    /** CSS class for the leave animation (empty string = no animation). */
    readonly leaveAnimationClass: string;

    /** Callback invoked when the leave animation completes. */
    readonly onLeaveAnimationDone: (() => void) | null;
}
