import { Component, effect, inject, input, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TbxMatIconType } from '@teqbench/tbx-mat-icons';
import { TbxMatBannerAnimation, TbxMatBannerService, type TbxMatBannerResult, type TbxMatBannerActionsGroupControl } from '../../index';

type Severity = 'default' | 'success' | 'error' | 'warning' | 'information' | 'help';
type VerticalPosition = 'top' | 'bottom';
type EnterExitAnimation = 'none' | 'slide' | 'fade';
type IconSize = 'standard' | 'medium' | 'large';
type IconAnimation = 'none' | 'state-transition' | 'pulse';

// Simple font icon resolver for the story — resolves Material Symbols ligature
// names as-is (the name IS the ligature, e.g., 'undo', 'download').
const fontIconResolver = {
    iconType: TbxMatIconType.Font,
    resolve: (key: string) => key,
};

@Component({
    selector: 'tbx-banner-overlay-actions-harness',
    imports: [MatButtonModule, JsonPipe],
    template: `
        <div class="harness">
            <div class="instructions">
                <p><strong>Overlay banners with an actions group.</strong> The actions group is an array of control descriptors on the <code>actionsGroup</code> config option. Each entry is one of five types:</p>
                <ul>
                    <li><code>button</code> — dismisses the banner when clicked. Result contains the button's <code>key</code>. Supports five appearances (<code>text</code>, <code>filled</code>, <code>tonal</code>, <code>outlined</code>, <code>icon</code>) and optional leading or trailing icons.</li>
                    <li><code>checkbox</code>, <code>toggle</code>, <code>radio-group</code>, <code>toggle-group</code> — form controls whose values are collected into <code>actionsGroupValues</code> on the dismiss result.</li>
                </ul>
                <p>Each demo below uses a <em>contextually appropriate severity level</em> for its message (not configurable — the severity is part of the example). The <strong>Controls</strong> panel below adjusts position, enter/exit animation, and icon size/animation across all demos. The "Last Dismiss Result" panel at the bottom shows the JSON result returned by the service's dismiss promise.</p>
            </div>

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
    styles: [
        `
            .harness {
                font-family: Roboto, sans-serif;
                padding: 1.5rem;
            }
            h3 {
                margin: 1.5rem 0 0.5rem;
            }
            h3:first-of-type {
                margin-top: 0;
            }
            .instructions {
                font-size: 0.875rem;
                color: #555;
                background: #f8f9fa;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 0.75rem 1rem;
                margin-bottom: 1.5rem;
                line-height: 1.6;
            }
            .instructions p {
                margin: 0 0 0.5rem;
            }
            .instructions p:last-child,
            .instructions ul:last-child {
                margin-bottom: 0;
            }
            .instructions ul {
                margin: 0 0 0.5rem;
                padding-left: 1.25rem;
            }
            .instructions li {
                margin-bottom: 0.125rem;
            }
            .instructions code {
                background: #eef2ff;
                color: #4338ca;
                padding: 0.1em 0.35em;
                border-radius: 3px;
                font-size: 0.9em;
            }
            .button-group {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }
            .state {
                margin-top: 1rem;
                font-size: 0.875rem;
                color: #666;
            }
            .result-panel {
                margin-top: 1rem;
                background: #f0f4ff;
                border-left: 3px solid #1565c0;
                padding: 0.5rem 0.75rem;
            }
            .result-panel pre {
                font-size: 0.8125rem;
                margin: 0.25rem 0 0;
                white-space: pre-wrap;
            }
        `,
    ],
})
class BannerOverlayActionsHarnessComponent {
    readonly banner = inject(TbxMatBannerService);

    readonly verticalPosition = input<VerticalPosition>('top');
    readonly enterExitAnimation = input<EnterExitAnimation>('none');
    readonly iconSize = input<IconSize>('standard');
    readonly iconAnimation = input<IconAnimation>('none');

    readonly lastResult = signal<TbxMatBannerResult | null>(null);

    constructor() {
        // Inject icon size CSS at document level (overlay banners render outside
        // the component tree via CDK portal).
        const SIZE_STYLE_ID = 'tbx-banner-story-icon-size';
        const SIZE_MAP: Record<IconSize, string> = {
            standard: '',
            medium: '2rem',
            large: '3rem',
        };

        effect(() => {
            const size = SIZE_MAP[this.iconSize()];
            document.getElementById(SIZE_STYLE_ID)?.remove();
            if (!size) return;
            const style = document.createElement('style');
            style.id = SIZE_STYLE_ID;
            style.textContent = `html { --tbx-mat-banner-icon-size: ${size}; }`;
            document.head.appendChild(style);
        });

        // Icon animation (state-transition / pulse) injected at document level.
        const ANIM_STYLE_ID = 'tbx-banner-story-icon-animation';

        const STATE_CSS = `
      @keyframes tbx-banner-icon-fill {
        from { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        to   { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      }
      .material-symbols-rounded {
        animation: tbx-banner-icon-fill 0.3s ease-in-out 0.15s forwards;
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      }
    `;

        const PULSE_CSS = `
      @keyframes tbx-banner-icon-pulse {
        from { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        to   { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      }
      .tbx-mat-banner-icon {
        animation: tbx-banner-icon-pulse 1s ease-in-out infinite alternate;
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      }
    `;

        effect(() => {
            const mode = this.iconAnimation();
            document.getElementById(ANIM_STYLE_ID)?.remove();
            if (mode === 'none') return;
            const style = document.createElement('style');
            style.id = ANIM_STYLE_ID;
            style.textContent = mode === 'state-transition' ? STATE_CSS : PULSE_CSS;
            document.head.appendChild(style);
        });
    }

    private show(severity: Severity, message: string, actionsGroup: TbxMatBannerActionsGroupControl[]): void {
        const method = this.banner[severity as keyof TbxMatBannerService] as (msg: string, args?: object) => { result: Promise<TbxMatBannerResult> };
        const ref = method.call(this.banner, message, {
            actionsGroup,
            verticalPosition: this.verticalPosition(),
            animation: this.mapAnimation(),
        });
        ref.result.then((result: TbxMatBannerResult) => this.lastResult.set(result));
    }

    private mapAnimation(): TbxMatBannerAnimation {
        switch (this.enterExitAnimation()) {
            case 'slide':
                return TbxMatBannerAnimation.Slide;
            case 'fade':
                return TbxMatBannerAnimation.Fade;
            default:
                return TbxMatBannerAnimation.None;
        }
    }

    // ── Button Appearances ─────────────────────────────────────────────────────

    buttonsText(): void {
        this.show('warning', 'Unsaved changes will be lost.', [
            { type: 'button', key: 'discard', label: 'Discard' },
            { type: 'button', key: 'save', label: 'Save' },
        ]);
    }

    buttonsFilled(): void {
        this.show('information', 'A new version is available.', [
            { type: 'button', key: 'later', label: 'Later', appearance: 'filled' },
            { type: 'button', key: 'update', label: 'Update Now', appearance: 'filled' },
        ]);
    }

    buttonsTonal(): void {
        this.show('error', 'Connection lost. Retrying...', [
            { type: 'button', key: 'cancel', label: 'Cancel', appearance: 'tonal' },
            { type: 'button', key: 'retry', label: 'Retry', appearance: 'tonal' },
        ]);
    }

    buttonsOutlined(): void {
        this.show('warning', 'Your trial expires in 3 days.', [
            { type: 'button', key: 'dismiss', label: 'Dismiss', appearance: 'outlined' },
            { type: 'button', key: 'upgrade', label: 'Upgrade', appearance: 'outlined' },
        ]);
    }

    buttonsMixed(): void {
        this.show('error', 'Upload failed for 2 of 10 files.', [
            { type: 'button', key: 'ignore', label: 'Ignore' },
            { type: 'button', key: 'details', label: 'View Details', appearance: 'outlined' },
            { type: 'button', key: 'retry', label: 'Retry', appearance: 'filled' },
        ]);
    }

    // ── Buttons with Icons ─────────────────────────────────────────────────────

    buttonsLeadingIcons(): void {
        this.show('success', 'Changes saved to draft.', [
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
        this.show('success', 'Export ready for download.', [
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
        this.show('default', '3 items selected.', [
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
        this.show('warning', 'Upload complete with warnings.', [
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
        this.show('information', 'Cookies are required for this site.', [
            {
                type: 'checkbox',
                key: 'dontShowAgain',
                label: "Don't show again",
                defaultValue: false,
            },
            { type: 'button', key: 'accept', label: 'Accept', appearance: 'filled' },
        ]);
    }

    withToggle(): void {
        this.show('default', 'Auto-save is disabled.', [
            { type: 'toggle', key: 'autoSave', label: 'Enable auto-save', defaultValue: false },
            { type: 'button', key: 'confirm', label: 'Confirm', appearance: 'filled' },
        ]);
    }

    withRadioGroup(): void {
        this.show('help', 'Choose export format before proceeding.', [
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
        this.show('help', 'Select notification channels.', [
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
        this.show('information', 'Configure update preferences.', [
            {
                type: 'checkbox',
                key: 'autoUpdate',
                label: 'Auto-update',
                defaultValue: true,
            },
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

const meta: Meta<BannerOverlayActionsHarnessComponent> = {
    title: 'Banners',
    tags: ['banners'],
    component: BannerOverlayActionsHarnessComponent,
    decorators: [moduleMetadata({ imports: [BannerOverlayActionsHarnessComponent] })],
    argTypes: {
        verticalPosition: {
            name: 'Position',
            control: 'select',
            options: ['top', 'bottom'],
            description: 'Vertical position of the overlay banner',
        },
        enterExitAnimation: {
            name: 'Enter/Exit Animation',
            control: 'select',
            options: ['none', 'slide', 'fade'],
            description: 'Enter and exit animation mode',
        },
        iconSize: {
            name: 'Icon Size',
            control: 'select',
            options: ['standard', 'medium', 'large'],
            description: 'Severity icon size',
        },
        iconAnimation: {
            name: 'Icon Animation',
            control: 'select',
            options: ['none', 'state-transition', 'pulse'],
            description: 'Icon fill animation',
        },
    },
};

export default meta;
type Story = StoryObj<BannerOverlayActionsHarnessComponent>;

export const OverlaysActions: Story = {
    name: 'Overlays + Actions',
    args: {
        verticalPosition: 'top',
        enterExitAnimation: 'none',
        iconSize: 'standard',
        iconAnimation: 'none',
    },
};
