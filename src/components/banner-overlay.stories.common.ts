import { Component, effect, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { provideTbxMatSeverityTheme } from '@teqbench/tbx-mat-severity-theme';
import { TbxMatBannerAnimation } from '../enums/banner-animation.enum';
import { TbxMatBannerService } from '../services/banner.service';
import { TbxMatBannerSeveritySvgIconService } from '../services/banner-severity-svg-icon.service';
import { TBX_MAT_BANNER_PROVIDER_CONFIG } from '../tokens/banner-provider-config.token';

// ─── Shared Control Types ────────────────────────────────────────────────────

export type VerticalPosition = 'top' | 'bottom';
export type EnterExitAnimation = 'none' | 'slide' | 'fade';
export type IconSize = 'standard' | 'medium' | 'large';
export type IconAnimation = 'none' | 'state-transition' | 'pulse';

// ─── Reactive CSS Injection ──────────────────────────────────────────────────

const ICON_SIZE_STYLE_ID = 'tbx-banner-story-icon-size';
const ICON_ANIM_STYLE_ID = 'tbx-banner-story-icon-animation';

const ICON_SIZE_MAP: Record<IconSize, string> = {
    standard: '',
    medium: '2rem',
    large: '3rem',
};

const STATE_TRANSITION_ANIM_CSS = `
    @keyframes tbx-banner-icon-fill {
        from { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        to   { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    }
    .material-symbols-rounded {
        animation: tbx-banner-icon-fill 0.3s ease-in-out 0.15s forwards;
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
`;

const PULSE_ANIM_CSS = `
    @keyframes tbx-banner-icon-pulse {
        from { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        to   { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    }
    .tbx-mat-banner-icon {
        animation: tbx-banner-icon-pulse 1s ease-in-out infinite alternate;
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
`;

export function applyIconSize(size: IconSize): void {
    const value = ICON_SIZE_MAP[size];
    document.getElementById(ICON_SIZE_STYLE_ID)?.remove();
    if (!value) return;
    const style = document.createElement('style');
    style.id = ICON_SIZE_STYLE_ID;
    style.textContent = `html { --tbx-mat-banner-icon-size: ${value}; }`;
    document.head.appendChild(style);
}

export function applyIconAnimation(mode: IconAnimation): void {
    document.getElementById(ICON_ANIM_STYLE_ID)?.remove();
    if (mode === 'none') return;
    const style = document.createElement('style');
    style.id = ICON_ANIM_STYLE_ID;
    style.textContent = mode === 'state-transition' ? STATE_TRANSITION_ANIM_CSS : PULSE_ANIM_CSS;
    document.head.appendChild(style);
}

export function mapAnimation(mode: EnterExitAnimation): TbxMatBannerAnimation {
    switch (mode) {
        case 'slide':
            return TbxMatBannerAnimation.Slide;
        case 'fade':
            return TbxMatBannerAnimation.Fade;
        default:
            return TbxMatBannerAnimation.None;
    }
}

// ─── Shared Argument Types ───────────────────────────────────────────────────

export const SHARED_OVERLAY_ARG_TYPES = {
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
    showSeverityIcon: {
        name: 'Show Severity Icon',
        control: 'boolean',
        description: 'Show the severity icon in the banner',
    },
    showCloseButton: {
        name: 'Show Close Button',
        control: 'boolean',
        description: 'Show the close/dismiss button in the banner',
    },
    duration: {
        name: 'Duration (ms)',
        control: { type: 'number', min: 0, step: 500 },
        description: 'Auto-dismiss duration in milliseconds (0 = indefinite, requires manual dismiss)',
    },
    iconSize: {
        name: 'Icon Size',
        control: 'select',
        options: ['standard', 'medium', 'large'],
        description: 'Severity icon size (overrides --tbx-mat-banner-icon-size at the document level)',
    },
    iconAnimation: {
        name: 'Icon Animation',
        control: 'select',
        options: ['none', 'state-transition', 'pulse'],
        description: 'Severity icon animation mode (Material Symbols FILL axis)',
    },
} as const;

export const DEFAULT_OVERLAY_ARGS = {
    verticalPosition: 'top' as VerticalPosition,
    enterExitAnimation: 'none' as EnterExitAnimation,
    showSeverityIcon: true,
    showCloseButton: true,
    duration: 0,
    iconSize: 'standard' as IconSize,
    iconAnimation: 'none' as IconAnimation,
};

// ─── Provider Decorators ─────────────────────────────────────────────────────

/**
 * Application config decorator that swaps the severity icon resolver to
 * the SVG implementation. The font preconfigured by `.storybook/preview.ts`
 * stays in place via `MAT_ICON_DEFAULT_OPTIONS`.
 */
export function withSvgIcons() {
    return applicationConfig({
        providers: [
            provideAnimationsAsync(),
            provideTbxMatSeverityTheme({ invert: false, applyToRoot: true }),
            {
                provide: MAT_ICON_DEFAULT_OPTIONS,
                useValue: { fontSet: 'material-symbols-rounded' },
            },
            {
                provide: TBX_MAT_BANNER_PROVIDER_CONFIG,
                useFactory: () => ({
                    severityIconResolverService: new TbxMatBannerSeveritySvgIconService(),
                }),
            },
        ],
    });
}

// ─── Harness Component ───────────────────────────────────────────────────────

@Component({
    selector: 'tbx-banner-overlay-harness',
    imports: [MatButtonModule],
    template: `
        <div class="harness">
            @if (description()) {
                <p class="story-description">{{ description() }}</p>
            }
            <p class="theme-note">Theme: Angular Material prebuilt <strong>Azure Blue</strong>. Banner severity colors are independent of the M3 theme palette.</p>

            <h3>Severity Triggers</h3>
            <div class="button-group">
                <button mat-flat-button (click)="fire('default')">Default</button>
                <button mat-flat-button (click)="fire('success')">Success</button>
                <button mat-flat-button (click)="fire('error')">Error</button>
                <button mat-flat-button (click)="fire('warning')">Warning</button>
                <button mat-flat-button (click)="fire('information')">Information</button>
                <button mat-flat-button (click)="fire('help')">Help</button>
            </div>

            <h3>Queue Demo</h3>
            <p class="theme-note">Banners display in FIFO order — fire a queue of six and they appear one after another.</p>
            <div class="button-group">
                <button mat-flat-button (click)="queueAll()">Fire 6 Queued</button>
                <button mat-flat-button (click)="banner.dismissAll()">Dismiss All</button>
            </div>
            <p class="state">Active: {{ banner.isActive() }} &middot; Pending: {{ banner.pendingCount() }}</p>
        </div>
    `,
    styleUrl: './story-harness.css',
})
export class BannerOverlayHarnessComponent {
    readonly banner = inject(TbxMatBannerService);

    readonly description = input<string>('');
    readonly verticalPosition = input<VerticalPosition>('top');
    readonly enterExitAnimation = input<EnterExitAnimation>('none');
    readonly showSeverityIcon = input<boolean>(true);
    readonly showCloseButton = input<boolean>(true);
    readonly duration = input<number>(0);
    readonly iconSize = input<IconSize>('standard');
    readonly iconAnimation = input<IconAnimation>('none');

    private readonly messages: Record<string, string> = {
        default: 'This is a default banner with no severity styling.',
        success: 'Operation completed successfully.',
        error: 'Something went wrong. Please try again.',
        warning: 'Your session will expire in 5 minutes.',
        information: 'A new version is available.',
        help: 'Click the + button to add a new item.',
    };

    constructor() {
        effect(() => applyIconSize(this.iconSize()));
        effect(() => applyIconAnimation(this.iconAnimation()));
    }

    fire(level: string): void {
        const method = this.banner[level as keyof TbxMatBannerService] as (msg: string, args?: object) => void;
        method.call(this.banner, this.messages[level], this.buildArgs());
    }

    queueAll(): void {
        const args = this.buildArgs();
        this.banner.default('Step 1: This is a default banner.', args);
        this.banner.success('Step 2: Operation completed successfully.', args);
        this.banner.error('Step 3: Something went wrong.', args);
        this.banner.warning('Step 4: Review needed.', args);
        this.banner.information('Step 5: A new version is available.', args);
        this.banner.help('Step 6: Click the + button to add a new item.', args);
    }

    private buildArgs(): object {
        return {
            verticalPosition: this.verticalPosition(),
            animation: mapAnimation(this.enterExitAnimation()),
            showSeverityIcon: this.showSeverityIcon(),
            showCloseButton: this.showCloseButton(),
            duration: this.duration(),
        };
    }
}
