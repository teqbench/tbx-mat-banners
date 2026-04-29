import { Component, effect, inject, input, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TbxMatIconType } from '@teqbench/tbx-mat-icons';
import { TbxMatBannerService } from '../services/banner.service';
import { type TbxMatBannerResult } from '../models/banner-result.model';
import { type TbxMatBannerActionsGroupControl } from '../types/banner-actions-group-control.type';
import { applyIconAnimation, applyIconSize, DEFAULT_OVERLAY_ARGS, type EnterExitAnimation, type IconAnimation, type IconSize, mapAnimation, SHARED_OVERLAY_ARG_TYPES, type VerticalPosition } from './banner-overlay.stories.common';

// ─── Action Icon Resolver ────────────────────────────────────────────────────

/**
 * Identity font icon resolver. Material Symbols ligatures use the icon name
 * directly so resolve() returns the input unchanged.
 */
export const fontIconResolver = {
    iconType: TbxMatIconType.Font,
    resolve: (key: string) => key,
};

// ─── Severity Type ───────────────────────────────────────────────────────────

export type Severity = 'default' | 'success' | 'error' | 'warning' | 'information' | 'help';

// ─── Shared Argument Types ───────────────────────────────────────────────────

export const ACTIONS_ARG_TYPES = {
    severity: {
        name: 'Severity',
        control: 'select',
        options: ['default', 'success', 'error', 'warning', 'information', 'help'],
        description: 'Severity level applied to every fired banner',
    },
    verticalPosition: SHARED_OVERLAY_ARG_TYPES.verticalPosition,
    enterExitAnimation: SHARED_OVERLAY_ARG_TYPES.enterExitAnimation,
    showSeverityIcon: SHARED_OVERLAY_ARG_TYPES.showSeverityIcon,
    showCloseButton: SHARED_OVERLAY_ARG_TYPES.showCloseButton,
    duration: SHARED_OVERLAY_ARG_TYPES.duration,
    iconSize: SHARED_OVERLAY_ARG_TYPES.iconSize,
    iconAnimation: SHARED_OVERLAY_ARG_TYPES.iconAnimation,
} as const;

export const DEFAULT_ACTIONS_ARGS = {
    severity: 'warning' as Severity,
    ...DEFAULT_OVERLAY_ARGS,
};

// ─── Harness Component ───────────────────────────────────────────────────────

@Component({
    selector: 'tbx-banner-actions-harness',
    imports: [MatButtonModule, JsonPipe],
    template: `
        <div class="harness">
            @if (description()) {
                <p class="story-description">{{ description() }}</p>
            }

            <h3>Button Appearances</h3>
            <div class="button-group">
                <button mat-flat-button (click)="buttonsText()">Text</button>
                <button mat-flat-button (click)="buttonsFilled()">Filled</button>
                <button mat-flat-button (click)="buttonsTonal()">Tonal</button>
                <button mat-flat-button (click)="buttonsOutlined()">Outlined</button>
                <button mat-flat-button (click)="buttonsMixed()">Mixed Appearances</button>
            </div>

            <h3>Buttons with Icons</h3>
            <div class="button-group">
                <button mat-flat-button (click)="buttonsLeadingIcons()">Leading Icons</button>
                <button mat-flat-button (click)="buttonsTrailingIcons()">Trailing Icons</button>
                <button mat-flat-button (click)="buttonsIconOnly()">Icon-Only</button>
                <button mat-flat-button (click)="buttonsMixedIcons()">Mixed Icons + Text</button>
            </div>

            <h3>Form Controls</h3>
            <div class="button-group">
                <button mat-flat-button (click)="withCheckbox()">Checkbox + Button</button>
                <button mat-flat-button (click)="withToggle()">Toggle + Button</button>
                <button mat-flat-button (click)="withRadioGroup()">Radio Group + Button</button>
                <button mat-flat-button (click)="withToggleGroup()">Toggle Group + Button</button>
                <button mat-flat-button (click)="withMixedControls()">All Control Types</button>
            </div>

            <h3>Queue</h3>
            <div class="button-group">
                <button mat-flat-button (click)="banner.dismissAll()">Dismiss All</button>
            </div>
            <p class="state">Active: {{ banner.isActive() }} &middot; Pending: {{ banner.pendingCount() }}</p>

            @if (lastResult()) {
                <div class="result-panel">
                    <h3>Last Dismiss Result</h3>
                    <pre>{{ lastResult() | json }}</pre>
                </div>
            }
        </div>
    `,
    styleUrl: './story-harness.css',
})
export class BannerActionsHarnessComponent {
    readonly banner = inject(TbxMatBannerService);

    readonly description = input<string>('');
    readonly severity = input<Severity>('warning');
    readonly verticalPosition = input<VerticalPosition>('top');
    readonly enterExitAnimation = input<EnterExitAnimation>('none');
    readonly showSeverityIcon = input<boolean>(true);
    readonly showCloseButton = input<boolean>(true);
    readonly duration = input<number>(0);
    readonly iconSize = input<IconSize>('standard');
    readonly iconAnimation = input<IconAnimation>('none');

    readonly lastResult = signal<TbxMatBannerResult | null>(null);

    constructor() {
        effect(() => applyIconSize(this.iconSize()));
        effect(() => applyIconAnimation(this.iconAnimation()));
    }

    private show(message: string, actionsGroup: TbxMatBannerActionsGroupControl[]): void {
        const level = this.severity();
        const method = this.banner[level as keyof TbxMatBannerService] as (msg: string, args?: object) => { result: Promise<TbxMatBannerResult> };
        const ref = method.call(this.banner, message, {
            actionsGroup,
            verticalPosition: this.verticalPosition(),
            animation: mapAnimation(this.enterExitAnimation()),
            showSeverityIcon: this.showSeverityIcon(),
            showCloseButton: this.showCloseButton(),
            duration: this.duration(),
        });
        ref.result.then((result: TbxMatBannerResult) => this.lastResult.set(result));
    }

    // ── Button Appearances ─────────────────────────────────────────────────────

    buttonsText(): void {
        this.show('Unsaved changes will be lost.', [
            { type: 'button', key: 'discard', label: 'Discard' },
            { type: 'button', key: 'save', label: 'Save' },
        ]);
    }

    buttonsFilled(): void {
        this.show('A new version is available.', [
            { type: 'button', key: 'later', label: 'Later', appearance: 'filled' },
            { type: 'button', key: 'update', label: 'Update Now', appearance: 'filled' },
        ]);
    }

    buttonsTonal(): void {
        this.show('Connection lost. Retrying...', [
            { type: 'button', key: 'cancel', label: 'Cancel', appearance: 'tonal' },
            { type: 'button', key: 'retry', label: 'Retry', appearance: 'tonal' },
        ]);
    }

    buttonsOutlined(): void {
        this.show('Your trial expires in 3 days.', [
            { type: 'button', key: 'dismiss', label: 'Dismiss', appearance: 'outlined' },
            { type: 'button', key: 'upgrade', label: 'Upgrade', appearance: 'outlined' },
        ]);
    }

    buttonsMixed(): void {
        this.show('Upload failed for 2 of 10 files.', [
            { type: 'button', key: 'ignore', label: 'Ignore' },
            { type: 'button', key: 'details', label: 'View Details', appearance: 'outlined' },
            { type: 'button', key: 'retry', label: 'Retry', appearance: 'filled' },
        ]);
    }

    // ── Buttons with Icons ─────────────────────────────────────────────────────

    buttonsLeadingIcons(): void {
        this.show('Changes saved to draft.', [
            {
                type: 'button',
                key: 'undo',
                label: 'Undo',
                icon: 'undo',
                appearance: 'outlined',
                actionIconResolverService: fontIconResolver,
            },
            {
                type: 'button',
                key: 'publish',
                label: 'Publish',
                icon: 'publish',
                appearance: 'filled',
                actionIconResolverService: fontIconResolver,
            },
        ]);
    }

    buttonsTrailingIcons(): void {
        this.show('Export ready for download.', [
            { type: 'button', key: 'dismiss', label: 'Dismiss' },
            {
                type: 'button',
                key: 'download',
                label: 'Download',
                icon: 'download',
                iconPosition: 'after',
                appearance: 'filled',
                actionIconResolverService: fontIconResolver,
            },
        ]);
    }

    buttonsIconOnly(): void {
        this.show('3 items selected.', [
            {
                type: 'button',
                key: 'delete',
                label: 'Delete',
                icon: 'delete',
                appearance: 'icon',
                actionIconResolverService: fontIconResolver,
            },
            {
                type: 'button',
                key: 'archive',
                label: 'Archive',
                icon: 'archive',
                appearance: 'icon',
                actionIconResolverService: fontIconResolver,
            },
            {
                type: 'button',
                key: 'share',
                label: 'Share',
                icon: 'share',
                appearance: 'icon',
                actionIconResolverService: fontIconResolver,
            },
        ]);
    }

    buttonsMixedIcons(): void {
        this.show('Upload complete with warnings.', [
            {
                type: 'button',
                key: 'details',
                label: 'View Details',
                icon: 'info',
                appearance: 'outlined',
                actionIconResolverService: fontIconResolver,
            },
            {
                type: 'button',
                key: 'retry',
                label: 'Retry',
                icon: 'refresh',
                appearance: 'tonal',
                actionIconResolverService: fontIconResolver,
            },
            { type: 'button', key: 'dismiss', label: 'Dismiss' },
        ]);
    }

    // ── Form Controls ──────────────────────────────────────────────────────────

    withCheckbox(): void {
        this.show('Cookies are required for this site.', [
            { type: 'checkbox', key: 'dontShowAgain', label: "Don't show again", defaultValue: false },
            { type: 'button', key: 'accept', label: 'Accept', appearance: 'filled' },
        ]);
    }

    withToggle(): void {
        this.show('Auto-save is disabled.', [
            { type: 'toggle', key: 'autoSave', label: 'Enable auto-save', defaultValue: false },
            { type: 'button', key: 'confirm', label: 'Confirm', appearance: 'filled' },
        ]);
    }

    withRadioGroup(): void {
        this.show('Choose export format before proceeding.', [
            {
                type: 'radio-group',
                key: 'format',
                options: [
                    { label: 'JSON', value: 'json' },
                    { label: 'CSV', value: 'csv' },
                    { label: 'XML', value: 'xml' },
                ],
                defaultValue: 'json',
            },
            { type: 'button', key: 'export', label: 'Export', appearance: 'filled' },
        ]);
    }

    withToggleGroup(): void {
        this.show('Select notification channels.', [
            {
                type: 'toggle-group',
                key: 'channels',
                multiple: true,
                options: [
                    { label: 'Email', value: 'email' },
                    { label: 'SMS', value: 'sms' },
                    { label: 'Push', value: 'push' },
                ],
                defaultValue: ['email'],
            },
            { type: 'button', key: 'save', label: 'Save', appearance: 'filled' },
        ]);
    }

    withMixedControls(): void {
        this.show('Configure update preferences.', [
            { type: 'checkbox', key: 'autoUpdate', label: 'Auto-update', defaultValue: true },
            {
                type: 'radio-group',
                key: 'channel',
                options: [
                    { label: 'Stable', value: 'stable' },
                    { label: 'Beta', value: 'beta' },
                ],
                defaultValue: 'stable',
            },
            { type: 'button', key: 'cancel', label: 'Cancel' },
            { type: 'button', key: 'apply', label: 'Apply', appearance: 'filled' },
        ]);
    }
}
