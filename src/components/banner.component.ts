import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, type OnInit, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { TbxMatIconType } from '@teqbench/tbx-mat-icons';
import { type TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-icons';
import { TBX_MAT_BANNER_PROVIDER_CONFIG } from '../tokens/banner-provider-config.token';
import { TBX_MAT_BANNER_DATA } from '../tokens/banner-data.token';
import { type TbxMatBannerActionsGroupControl } from '../types/banner-actions-group-control.type';
import { type TbxMatBannerResult } from '../models/banner-result.model';
import { TbxMatBannerDismissReason } from '../enums/banner-dismiss-reason.enum';
import { TbxMatBannerCloseFontIconService } from '../services/banner-close-font-icon.service';
import { BANNER_DEFAULT_ACTION_BUTTON_APPEARANCE } from '../constants/banner.constants';

/** Resolved icon ready for template rendering. */
interface ResolvedIcon {
    readonly name: string;
    readonly isSvg: boolean;
}

/**
 * Banner content component for both inline and overlay display
 *
 * @remarks
 * Renders a severity-styled banner with an optional severity icon, message,
 * actions group (buttons and form controls), and close button.
 *
 * ### Display Modes
 *
 * - **Overlay mode:** Created by {@link TbxMatBannerService} via
 *   {@link https://material.angular.dev/cdk/overlay/api | CDK Overlay}.
 *   Receives data through the `TBX_MAT_BANNER_DATA` injection token.
 *   Consumers do not instantiate the component directly in this mode.
 *
 * - **Inline mode:** Placed directly in a consumer's template.
 *   Receives data through signal inputs and emits dismiss events via outputs.
 *
 * ### Template element order
 *
 * severity icon | message | actions group | close button
 *
 * All elements are optional except the message. The actions group and
 * close button render in the actions slot.
 *
 * ### Actions group rendering
 *
 * Controls render in array order via `@switch (control.type)`. Form control
 * values are tracked internally via writable signals initialized from each
 * control's `defaultValue`. Current values are collected into the
 * `actionsGroupValues` record on dismiss.
 *
 * @example Overlay mode (consumers do not instantiate directly):
 * ```typescript
 * // Consumers use the service:
 * void this.bannerService.success('Item saved.');
 * ```
 *
 * @example Inline mode:
 * ```typescript
 * // In template:
 * // <tbx-mat-banner [type]="severityLevel" [message]="'Hello'" (dismissed)="onDismiss($event)" />
 * // TbxMatBannerComponent is a hypothetical inline usage
 * ```
 *
 * @category Components
 * @displayName Banner Component
 * @since 1.0.0
 * @related TbxMatBannerService
 *
 * @public
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'tbx-mat-banner',
    imports: [NgTemplateOutlet, FormsModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatSlideToggleModule, MatRadioModule, MatButtonToggleModule],
    template: `
        <!-- Shared icon template — handles font ligature vs SVG branching -->
        <ng-template #tbxNgIconTemplate let-icon="icon" let-class="class">
            @if (icon) {
                @if (icon.isSvg) {
                    <mat-icon [svgIcon]="icon.name" [class]="class" aria-hidden="true"></mat-icon>
                } @else {
                    <mat-icon [class]="class" aria-hidden="true">{{ icon.name }}</mat-icon>
                }
            }
        </ng-template>

        <div class="tbx-mat-banner-label">
            @if (resolvedData().showSeverityIcon) {
                <ng-container *ngTemplateOutlet="tbxNgIconTemplate; context: { icon: severityIcon(), class: 'tbx-mat-banner-icon' }"></ng-container>
            }
            <span>{{ resolvedData().message }}</span>
        </div>

        @if (resolvedData().showCloseButton) {
            <button mat-icon-button class="tbx-mat-banner-close-icon-button" (click)="onCloseClick()" aria-label="Dismiss banner">
                <ng-container *ngTemplateOutlet="tbxNgIconTemplate; context: { icon: closeIcon() }"></ng-container>
            </button>
        }

        @if (resolvedData().actionsGroup.length > 0) {
            <div class="tbx-mat-banner-actions">
                <div class="tbx-mat-banner-controls">
                    @for (control of resolvedData().actionsGroup; track control.key) {
                        @switch (control.type) {
                            @case ('checkbox') {
                                <mat-checkbox [checked]="getControlValue(control.key)" (change)="setControlValue(control.key, $event.checked)">{{ control.label }}</mat-checkbox>
                            }
                            @case ('toggle') {
                                <mat-slide-toggle [checked]="getControlValue(control.key)" (change)="setControlValue(control.key, $event.checked)">{{ control.label }}</mat-slide-toggle>
                            }
                            @case ('radio-group') {
                                <mat-radio-group [value]="getControlValue(control.key)" (change)="setControlValue(control.key, $event.value)">
                                    @for (option of control.options; track option.value) {
                                        <mat-radio-button [value]="option.value">{{ option.label }}</mat-radio-button>
                                    }
                                </mat-radio-group>
                            }
                            @case ('toggle-group') {
                                <mat-button-toggle-group [multiple]="control.multiple ?? false" [value]="getControlValue(control.key)" (change)="setControlValue(control.key, $event.value)">
                                    @for (option of control.options; track option.value) {
                                        <mat-button-toggle [value]="option.value">
                                            @if (option.icon) {
                                                <mat-icon aria-hidden="true">{{ option.icon }}</mat-icon>
                                            } @else {
                                                {{ option.label }}
                                            }
                                        </mat-button-toggle>
                                    }
                                </mat-button-toggle-group>
                            }
                        }
                    }
                </div>
                <div class="tbx-mat-banner-buttons">
                    @for (control of resolvedData().actionsGroup; track control.key) {
                        @if (control.type === 'button') {
                            @if (control.appearance === 'icon') {
                                <button mat-icon-button class="tbx-mat-banner-action-icon-button" (click)="onActionClick(control.key)" [attr.aria-label]="control.label">
                                    <ng-container *ngTemplateOutlet="tbxNgIconTemplate; context: { icon: resolveActionIcon(control) }"></ng-container>
                                </button>
                            } @else {
                                @let icon = resolveActionIcon(control);
                                <button class="tbx-mat-banner-action-button" [matButton]="control.appearance ?? defaultButtonAppearance" (click)="onActionClick(control.key)">
                                    @if ((control.iconPosition ?? 'before') === 'before') {
                                        <ng-container ngProjectAs="mat-icon:not([iconPositionEnd])" *ngTemplateOutlet="tbxNgIconTemplate; context: { icon: icon }"></ng-container>
                                    }

                                    {{ control.label }}

                                    @if (control.iconPosition === 'after') {
                                        <ng-container ngProjectAs="mat-icon[iconPositionEnd]" *ngTemplateOutlet="tbxNgIconTemplate; context: { icon: icon }"></ng-container>
                                    }
                                </button>
                            }
                        }
                    }
                </div>
            </div>
        }
    `,
    styles: `
        :host {
            container-type: inline-size;
            display: grid;
            grid-template-columns: 1fr auto auto;
            grid-template-rows: auto;
            align-items: center;
            padding: var(--tbx-mat-banner-padding, 0.5rem 1rem);
            width: 100%;
            box-sizing: border-box;
        }

        /* ── Single-row layout (wide) ── */

        .tbx-mat-banner-label {
            grid-column: 1;
            grid-row: 1;
            display: flex;
            align-items: center;
            gap: var(--tbx-mat-banner-label-gap, 1rem);
            font-size: var(--tbx-mat-banner-font-size, inherit);
            min-width: 0;
        }

        .tbx-mat-banner-label span {
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .tbx-mat-banner-actions {
            grid-column: 2;
            grid-row: 1;
            display: flex;
            align-items: center;
            gap: var(--tbx-mat-banner-actions-gap, 0.5rem);
            padding-left: var(--tbx-mat-banner-actions-padding, 1rem);
        }

        .tbx-mat-banner-controls {
            display: flex;
            align-items: center;
            gap: var(--tbx-mat-banner-controls-gap, 0.75rem);
        }

        .tbx-mat-banner-controls:empty {
            display: none;
        }

        .tbx-mat-banner-buttons {
            display: flex;
            align-items: center;
            gap: var(--tbx-mat-banner-buttons-gap, 0.5rem);
            margin-left: auto;
        }

        .tbx-mat-banner-buttons:empty {
            display: none;
        }

        .tbx-mat-banner-close-icon-button {
            grid-column: 3;
            grid-row: 1;
            margin-left: var(--tbx-mat-banner-close-gap, 0.5rem);
        }

        .tbx-mat-banner-icon {
            flex-shrink: 0;
            font-size: var(--tbx-mat-banner-icon-size, 1.5rem);
            width: var(--tbx-mat-banner-icon-size, 1.5rem);
            height: var(--tbx-mat-banner-icon-size, 1.5rem);
        }

        /* ── Two-row layout (narrow) ── */

        @container (max-width: 600px) {
            :host {
                grid-template-columns: 1fr auto;
                grid-template-rows: auto auto;
            }

            .tbx-mat-banner-label {
                grid-column: 1;
                grid-row: 1;
            }

            .tbx-mat-banner-label span {
                white-space: normal;
                overflow: visible;
                text-overflow: unset;
            }

            .tbx-mat-banner-close-icon-button {
                grid-column: 2;
                grid-row: 1;
            }

            .tbx-mat-banner-actions {
                grid-column: 1 / -1;
                grid-row: 2;
                padding-left: 0;
                padding-top: var(--tbx-mat-banner-actions-row-gap, 0.5rem);
            }
        }
    `,
})
export class TbxMatBannerComponent implements OnInit {
    private readonly config = inject(TBX_MAT_BANNER_PROVIDER_CONFIG);
    private readonly overlayData = inject(TBX_MAT_BANNER_DATA, { optional: true });

    /** Default button appearance constant for template use. */
    readonly defaultButtonAppearance = BANNER_DEFAULT_ACTION_BUTTON_APPEARANCE;

    // ── Inline mode inputs ──

    /** Severity level (inline mode). */
    @Input() type?: TbxMatSeverityLevel;

    /** Message text (inline mode). */
    @Input() message?: string;

    /** Display duration in milliseconds (inline mode). */
    @Input() duration?: number;

    /** Show severity icon (inline mode). */
    @Input() showSeverityIcon?: boolean;

    /** Show close button (inline mode). */
    @Input() showCloseButton?: boolean;

    /** Actions group controls (inline mode). */
    @Input() actionsGroup?: TbxMatBannerActionsGroupControl[];

    // ── Inline mode outputs ──

    /** Emitted when the banner is dismissed (inline mode). */
    @Output() readonly dismissed = new EventEmitter<TbxMatBannerResult>();

    // ── Internal state ──

    /** Writable signals for form control values, keyed by control key. */
    private readonly controlValues = new Map<string, ReturnType<typeof signal>>();

    /**
     * Resolved data — overlay DTO takes precedence, inline inputs as fallback.
     * Returns a normalized shape usable by the template.
     */
    readonly resolvedData = computed(() => {
        if (this.overlayData) {
            return this.overlayData;
        }
        return {
            type: this.type!,
            message: this.message ?? '',
            dismissByClose: () => this.dismissInline(TbxMatBannerDismissReason.Close),
            dismissByAction: (actionKey: string) => this.dismissInline(TbxMatBannerDismissReason.Action, actionKey),
            duration: this.duration ?? 0,
            showSeverityIcon: this.showSeverityIcon ?? true,
            showCloseButton: this.showCloseButton ?? true,
            closeIconResolverService: this.config.closeIconResolverService ?? this.defaultCloseIconService,
            actionsGroup: this.actionsGroup ?? [],
        };
    });

    private readonly defaultCloseIconService = new TbxMatBannerCloseFontIconService();

    /** Resolved severity icon. */
    readonly severityIcon = computed(() => this.resolveIcon(this.config.severityIconResolverService, this.resolvedData().type));

    /** Resolved close button icon. */
    readonly closeIcon = computed(() => this.resolveIcon(this.resolvedData().closeIconResolverService, 'close'));

    ngOnInit(): void {
        // Initialize form control values from defaultValue
        const controls = this.resolvedData().actionsGroup;
        for (const control of controls) {
            if (control.type === 'checkbox' || control.type === 'toggle') {
                this.controlValues.set(control.key, signal(control.defaultValue ?? false));
            } else if (control.type === 'radio-group') {
                this.controlValues.set(control.key, signal(control.defaultValue));
            } else if (control.type === 'toggle-group') {
                this.controlValues.set(control.key, signal(control.defaultValue));
            }
        }
    }

    /** Get the current value of a form control by key. */
    getControlValue(key: string): unknown {
        return this.controlValues.get(key)?.();
    }

    /** Set the current value of a form control by key. */
    setControlValue(key: string, value: unknown): void {
        this.controlValues.get(key)?.set(value);
    }

    /** Collect current values from all form controls. */
    collectActionsGroupValues(): Record<string, unknown> {
        const values: Record<string, unknown> = {};
        for (const [key, sig] of this.controlValues) {
            values[key] = sig();
        }
        return values;
    }

    /** Handle action button click — dismiss with action reason. */
    onActionClick(actionKey: string): void {
        this.resolvedData().dismissByAction(actionKey);
    }

    /** Handle close button click — dismiss with close reason. */
    onCloseClick(): void {
        this.resolvedData().dismissByClose();
    }

    /** Resolve an action button icon. */
    resolveActionIcon(control: {
        icon?: string;
        actionIconResolverService?: {
            readonly iconType: TbxMatIconType;
            resolve(key: string): string | undefined;
        };
    }): ResolvedIcon | null {
        if (!control.icon || !control.actionIconResolverService) {
            return null;
        }
        return this.resolveIcon(control.actionIconResolverService, control.icon);
    }

    /** Resolve an icon from a resolver service. */
    private resolveIcon(resolver: { readonly iconType: TbxMatIconType; resolve(key: string): string | undefined } | undefined, key: string | undefined): ResolvedIcon | null {
        /* v8 ignore start -- defensive guard; resolver and key are always present in normal flow */
        if (!resolver || !key) {
            return null;
        }
        /* v8 ignore stop */
        const name = resolver.resolve(key);
        if (!name) {
            return null;
        }
        return { name, isSvg: resolver.iconType === TbxMatIconType.Svg };
    }

    /** Emit dismiss event for inline mode. */
    private dismissInline(reason: TbxMatBannerDismissReason, actionKey?: string): void {
        this.dismissed.emit({
            dismissReason: reason,
            actionKey,
            actionsGroupValues: this.collectActionsGroupValues(),
        });
    }
}
