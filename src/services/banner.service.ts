import { DestroyRef, inject, Injectable, Injector, signal } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-icons';
import { TbxMatBannerComponent } from '../components/banner.component';
import { type TbxMatBannerConfigArgs } from '../types/banner-config-args.type';
import { type TbxMatBannerConfig } from '../models/banner-config.model';
import { type TbxMatBannerRef } from '../models/banner-ref.model';
import { type TbxMatBannerResult } from '../models/banner-result.model';
import { type BannerDataDto } from '../models/banner-data-dto.model';
import { TbxMatBannerAnimation } from '../enums/banner-animation.enum';
import { TbxMatBannerDismissReason } from '../enums/banner-dismiss-reason.enum';
import { TBX_MAT_BANNER_PROVIDER_CONFIG } from '../tokens/banner-provider-config.token';
import { TBX_MAT_BANNER_DATA } from '../tokens/banner-data.token';
import { TbxMatBannerCloseFontIconService } from './banner-close-font-icon.service';
import { BANNER_DEFAULT_DURATION_MS } from '../constants/banner.constants';

/**
 * Internal queue entry. Pairs a banner config with the promise
 * resolver needed to fulfill the TbxMatBannerRef returned to
 * the consumer.
 */
interface QueueEntry {
    readonly config: TbxMatBannerConfig;
    readonly resolveResult: (result: TbxMatBannerResult) => void;
}

/**
 * Application-wide banner service for overlay display
 *
 * @remarks
 * Creates full-width banners via
 * {@link https://material.angular.dev/cdk/overlay/api | Angular CDK Overlay}
 * with typed severity levels, configurable duration, and an actions group
 * supporting buttons and form controls.
 *
 * Banners are queued FIFO and displayed one at a time. When the current
 * banner is dismissed (manually or by timeout), the next queued banner
 * is shown automatically.
 *
 * All public methods return a {@link TbxMatBannerRef} synchronously,
 * containing the consumer's config and a result promise that resolves
 * with a {@link TbxMatBannerResult} when the banner is dismissed.
 *
 * Consumers who do not need the ref or result should use the `void` prefix
 * to suppress unhandled-promise lint warnings:
 * ```typescript
 * void this.bannerService.success('Saved');
 * ```
 *
 * Queue state is exposed via {@link https://angular.dev/guide/signals | Angular signals}:
 * - `isActive()` — whether a banner is currently visible
 * - `pendingCount()` — number of banners waiting in the queue
 *
 * @usage
 * Inject the service and call the convenience methods for each severity level
 * (`success()`, `error()`, `warning()`, `information()`, `help()`, `default()`).
 * Use `show()` when full control over configuration is needed. Use `dismiss()`
 * and `dismissAll()` to programmatically clear banners.
 *
 * @example Fire-and-forget:
 * ```typescript
 * private readonly banner = inject(TbxMatBannerService);
 *
 * void this.banner.success('Item saved successfully.');
 * void this.banner.error('Failed to load data. Please try again.');
 * ```
 *
 * @example Reacting to action dismissal with form values:
 * ```typescript
 * const ref = this.banner.warning('Update available', {
 *     actionsGroup: [
 *         { type: 'checkbox', key: 'autoUpdate', label: 'Auto-update' },
 *         { type: 'button', key: 'update', label: 'Update', appearance: 'filled' },
 *         { type: 'button', key: 'later', label: 'Later' },
 *     ],
 * });
 *
 * const result = await ref.result;
 * if (result.actionKey === 'update') {
 *     const autoUpdate = result.actionsGroupValues['autoUpdate'] as boolean;
 *     this.performUpdate(autoUpdate);
 * }
 * ```
 *
 * @category Services
 * @since 1.0.0
 * @related TbxMatBannerConfig
 * @related TbxMatBannerConfigArgs
 * @related TbxMatBannerRef
 * @related TbxMatBannerResult
 * @related TBX_MAT_BANNER_PROVIDER_CONFIG
 *
 * @public
 */
@Injectable({ providedIn: 'root' })
export class TbxMatBannerService {
    private readonly overlay = inject(Overlay);
    private readonly injector = inject(Injector);
    private readonly providerConfig = inject(TBX_MAT_BANNER_PROVIDER_CONFIG);
    private readonly defaultCloseIconService = new TbxMatBannerCloseFontIconService();
    private destroyed = false;

    private readonly _destroyCleanup = inject(DestroyRef).onDestroy(() => {
        this.destroyed = true;
        this.cleanupActive();
    });

    /** FIFO queue of pending banners. */
    private readonly queue: QueueEntry[] = [];

    /** Reference to the currently active overlay. */
    private activeOverlayRef: OverlayRef | null = null;

    /** Reference to the active banner component instance. */
    private activeComponentRef: TbxMatBannerComponent | null = null;

    /** Resolver for the active banner's result promise. */
    private activeResultResolver: ((result: TbxMatBannerResult) => void) | null = null;

    /** Guards against double-resolution of the active result promise. */
    private activeResultResolved = false;

    /** Timeout handle for duration-based auto-dismiss. */
    private durationTimeout: ReturnType<typeof setTimeout> | null = null;

    private readonly _isActive = signal(false);
    private readonly _pendingCount = signal(0);

    /**
     * Whether a banner is currently being displayed
     *
     * @remarks
     * Reactive {@link https://angular.dev/guide/signals | Angular signal}.
     *
     * @public
     */
    readonly isActive = this._isActive.asReadonly();

    /**
     * Number of banners waiting in the queue (not including the active one)
     *
     * @remarks
     * Reactive {@link https://angular.dev/guide/signals | Angular signal}.
     *
     * @public
     */
    readonly pendingCount = this._pendingCount.asReadonly();

    /**
     * Queue a banner for display
     *
     * @remarks
     * If no banner is currently visible, it displays immediately.
     * Otherwise, it is added to the FIFO queue and shown when all preceding
     * banners have been dismissed.
     *
     * Duration: zero or negative is indefinite (no auto-dismiss), positive
     * is used as-is. Defaults to 0 (indefinite) when omitted.
     *
     * @param config - Full banner configuration.
     *
     * @returns A {@link TbxMatBannerRef} with the consumer's config and
     * a promise for the dismiss result.
     *
     * @public
     */
    show(config: TbxMatBannerConfig): TbxMatBannerRef {
        let resolveResult!: QueueEntry['resolveResult'];

        const resultPromise = new Promise<TbxMatBannerResult>((resolve) => {
            resolveResult = resolve;
        });

        this.queue.push({ config, resolveResult });
        this._pendingCount.set(this.queue.length);

        if (!this.isActive()) {
            this.showNext();
        }

        return {
            config,
            result: resultPromise,
        };
    }

    /**
     * Dismiss the currently visible banner
     *
     * @remarks
     * The active banner's {@link TbxMatBannerRef.result} promise resolves with
     * {@link TbxMatBannerDismissReason.ProgrammaticDismissCurrent}.
     * If queued banners remain, the next one is shown automatically.
     *
     * @public
     */
    dismiss(): void {
        this.resolveAndCleanup({
            dismissReason: TbxMatBannerDismissReason.ProgrammaticDismissCurrent,
            actionsGroupValues: this.activeComponentRef?.collectActionsGroupValues() ?? {},
        });
        this.showNext();
    }

    /**
     * Dismiss the current banner and clear the entire queue
     *
     * @remarks
     * All queued (not yet displayed) banners have their
     * {@link TbxMatBannerRef.result} promise resolved with
     * {@link TbxMatBannerDismissReason.ProgrammaticDismissAll}.
     *
     * @public
     */
    dismissAll(): void {
        // Resolve all queued (not yet displayed) banner promises.
        for (const entry of this.queue) {
            entry.resolveResult({
                dismissReason: TbxMatBannerDismissReason.ProgrammaticDismissAll,
                actionsGroupValues: {},
            });
        }
        this.queue.length = 0;
        this._pendingCount.set(0);

        // Resolve the active banner's result promise.
        this.resolveAndCleanup({
            dismissReason: TbxMatBannerDismissReason.ProgrammaticDismissAll,
            actionsGroupValues: this.activeComponentRef?.collectActionsGroupValues() ?? {},
        });
    }

    /**
     * Display a success banner
     *
     * @param message - The message to display to the user.
     * @param configArgs - Optional overrides.
     *
     * @returns A {@link TbxMatBannerRef} for the queued banner.
     *
     * @public
     */
    success(message: string, configArgs?: TbxMatBannerConfigArgs): TbxMatBannerRef {
        return this.show({ type: TbxMatSeverityLevel.Success, message, ...configArgs });
    }

    /**
     * Display an error banner
     *
     * @param message - The message to display to the user.
     * @param configArgs - Optional overrides.
     *
     * @returns A {@link TbxMatBannerRef} for the queued banner.
     *
     * @public
     */
    error(message: string, configArgs?: TbxMatBannerConfigArgs): TbxMatBannerRef {
        return this.show({ type: TbxMatSeverityLevel.Error, message, ...configArgs });
    }

    /**
     * Display a warning banner
     *
     * @param message - The message to display to the user.
     * @param configArgs - Optional overrides.
     *
     * @returns A {@link TbxMatBannerRef} for the queued banner.
     *
     * @public
     */
    warning(message: string, configArgs?: TbxMatBannerConfigArgs): TbxMatBannerRef {
        return this.show({ type: TbxMatSeverityLevel.Warning, message, ...configArgs });
    }

    /**
     * Display an informational banner
     *
     * @param message - The message to display to the user.
     * @param configArgs - Optional overrides.
     *
     * @returns A {@link TbxMatBannerRef} for the queued banner.
     *
     * @public
     */
    information(message: string, configArgs?: TbxMatBannerConfigArgs): TbxMatBannerRef {
        return this.show({ type: TbxMatSeverityLevel.Information, message, ...configArgs });
    }

    /**
     * Display a help banner
     *
     * @param message - The message to display to the user.
     * @param configArgs - Optional overrides.
     *
     * @returns A {@link TbxMatBannerRef} for the queued banner.
     *
     * @public
     */
    help(message: string, configArgs?: TbxMatBannerConfigArgs): TbxMatBannerRef {
        return this.show({ type: TbxMatSeverityLevel.Help, message, ...configArgs });
    }

    /**
     * Display a default banner (no severity styling)
     *
     * @param message - The message to display to the user.
     * @param configArgs - Optional overrides.
     *
     * @returns A {@link TbxMatBannerRef} for the queued banner.
     *
     * @public
     */
    default(message: string, configArgs?: TbxMatBannerConfigArgs): TbxMatBannerRef {
        return this.show({ type: TbxMatSeverityLevel.Default, message, ...configArgs });
    }

    /**
     * Shift the next banner off the queue and display it via CDK Overlay.
     */
    private showNext(): void {
        /* v8 ignore start -- DestroyRef guard */
        if (this.destroyed) {
            return;
        }
        /* v8 ignore stop */

        const entry = this.queue.shift();
        this._pendingCount.set(this.queue.length);

        if (!entry) {
            this._isActive.set(false);
            return;
        }

        const { config, resolveResult } = entry;

        this._isActive.set(true);
        this.activeResultResolver = resolveResult;
        this.activeResultResolved = false;

        const duration = this.resolveDuration(config.duration);

        // Build panel classes
        const consumerPanelClass = config.panelClass;
        const positionClass = config.verticalPosition === 'bottom' ? 'tbx-mat-banner-position-bottom' : 'tbx-mat-banner-position-top';
        const mergedPanelClass: string[] = ['tbx-mat-banner-overlay-panel', positionClass, ...(Array.isArray(consumerPanelClass) ? consumerPanelClass : consumerPanelClass ? [consumerPanelClass] : [])];

        const effectiveAnimation = config.animation ?? this.providerConfig.defaultAnimation;
        const position = config.verticalPosition === 'bottom' ? 'bottom' : 'top';
        let enterAnimationClass = '';
        let leaveAnimationClass = '';
        if (effectiveAnimation === TbxMatBannerAnimation.Slide) {
            enterAnimationClass = `tbx-mat-banner-slide-in-${position}`;
            leaveAnimationClass = `tbx-mat-banner-slide-out-${position}`;
        } else if (effectiveAnimation === TbxMatBannerAnimation.Fade) {
            enterAnimationClass = 'tbx-mat-banner-fade-in';
            leaveAnimationClass = 'tbx-mat-banner-fade-out';
        }

        // Create overlay
        const positionStrategy = this.overlay.position().global().centerHorizontally();

        if (config.verticalPosition === 'bottom') {
            positionStrategy.bottom('0');
        } else {
            positionStrategy.top('0');
        }

        const overlayConfig = new OverlayConfig({
            positionStrategy,
            width: '100%',
            panelClass: mergedPanelClass,
            hasBackdrop: false,
        });

        const overlayRef = this.overlay.create(overlayConfig);
        this.activeOverlayRef = overlayRef;

        // When animation is active, showNext is deferred to the leave animation callback
        const hasAnimation = enterAnimationClass !== '';

        // Build DTO
        const data: BannerDataDto = {
            type: config.type,
            message: config.message,
            dismissByClose: () => {
                if (this.activeOverlayRef !== overlayRef) return;
                this.resolveAndCleanup({
                    dismissReason: TbxMatBannerDismissReason.Close,
                    actionsGroupValues: this.activeComponentRef?.collectActionsGroupValues() ?? {},
                });
                if (!hasAnimation) this.showNext();
            },
            dismissByAction: (actionKey: string) => {
                if (this.activeOverlayRef !== overlayRef) return;
                this.resolveAndCleanup({
                    dismissReason: TbxMatBannerDismissReason.Action,
                    actionKey,
                    actionsGroupValues: this.activeComponentRef?.collectActionsGroupValues() ?? {},
                });
                if (!hasAnimation) this.showNext();
            },
            duration,
            showSeverityIcon: config.showSeverityIcon ?? true,
            showCloseButton: config.showCloseButton ?? true,
            closeIconResolverService: this.providerConfig.closeIconResolverService ?? this.defaultCloseIconService,
            actionsGroup: config.actionsGroup ?? [],
            enterAnimationClass,
            leaveAnimationClass,
            onLeaveAnimationDone: hasAnimation ? () => this.showNext() : null,
        };

        // Create component portal with injected data
        const injector = Injector.create({
            parent: this.injector,
            providers: [{ provide: TBX_MAT_BANNER_DATA, useValue: data }],
        });

        const portal = new ComponentPortal(TbxMatBannerComponent, null, injector);
        const componentRef = overlayRef.attach(portal);
        this.activeComponentRef = componentRef.instance;

        // Set up duration-based auto-dismiss
        if (duration > 0) {
            this.durationTimeout = setTimeout(() => {
                this.durationTimeout = null;
                this.resolveAndCleanup({
                    dismissReason: TbxMatBannerDismissReason.Timeout,
                    actionsGroupValues: this.activeComponentRef?.collectActionsGroupValues() ?? {},
                });
                if (!hasAnimation) this.showNext();
            }, duration);
        }
    }

    /**
     * Resolve the active result promise and clean up the overlay.
     * Guards against double-resolution.
     */
    private resolveAndCleanup(result: TbxMatBannerResult): void {
        if (this.durationTimeout) {
            clearTimeout(this.durationTimeout);
            this.durationTimeout = null;
        }

        if (!this.activeResultResolved && this.activeResultResolver) {
            this.activeResultResolver(result);
            this.activeResultResolver = null;
            this.activeResultResolved = true;
        }

        if (this.activeOverlayRef) {
            this.activeOverlayRef.dispose();
            this.activeOverlayRef = null;
        }

        this.activeComponentRef = null;
        this._isActive.set(false);
    }

    /** Clean up active overlay on service destroy. */
    private cleanupActive(): void {
        if (this.durationTimeout) {
            clearTimeout(this.durationTimeout);
            this.durationTimeout = null;
        }
        if (this.activeOverlayRef) {
            this.activeOverlayRef.dispose();
            this.activeOverlayRef = null;
        }
    }

    /**
     * Resolve duration from consumer config.
     * - undefined → default (BANNER_DEFAULT_DURATION_MS = 0, indefinite)
     * - zero or negative → 0 (indefinite)
     * - positive → as-is
     */
    private resolveDuration(duration: number | undefined): number {
        if (duration === undefined) {
            return BANNER_DEFAULT_DURATION_MS;
        }
        return duration <= 0 ? 0 : duration;
    }
}
