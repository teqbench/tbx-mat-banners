import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TbxMatBannerService } from '../services/banner.service';

// ─── CSS Custom Property Overrides ───────────────────────────────────────────

const STYLE_TAG_ID = 'tbx-banner-icon-story-overrides';

function withCustomProperties(css: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (story: () => any) => {
        document.getElementById(STYLE_TAG_ID)?.remove();
        if (css) {
            const style = document.createElement('style');
            style.id = STYLE_TAG_ID;
            style.textContent = css;
            document.head.appendChild(style);
        }
        return story();
    };
}

function withDefaultProperties() {
    return withCustomProperties('');
}

const LARGE_ICON_CSS = `
    html {
        --tbx-mat-banner-icon-size: 3rem;
    }
`;

const STATE_TRANSITION_CSS = `
    @keyframes tbx-banner-icon-fill {
        from { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        to   { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    }
    .tbx-mat-banner-overlay-panel .material-symbols-rounded {
        animation: tbx-banner-icon-fill 0.3s ease-in-out 0.15s forwards;
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
`;

const LARGE_ICON_STATE_TRANSITION_CSS = `
    html {
        --tbx-mat-banner-icon-size: 3rem;
    }
    @keyframes tbx-banner-icon-fill {
        from { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        to   { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    }
    .tbx-mat-banner-overlay-panel .material-symbols-rounded {
        animation: tbx-banner-icon-fill 0.3s ease-in-out 0.15s forwards;
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
`;

const PULSE_CSS = `
    @keyframes tbx-banner-icon-pulse {
        from { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        to   { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    }
    .tbx-mat-banner-overlay-panel .tbx-mat-banner-icon {
        animation: tbx-banner-icon-pulse 1s ease-in-out infinite alternate;
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
`;

const LARGE_ICON_PULSE_CSS = `
    html {
        --tbx-mat-banner-icon-size: 3rem;
    }
    @keyframes tbx-banner-icon-pulse {
        from { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        to   { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    }
    .tbx-mat-banner-overlay-panel .tbx-mat-banner-icon {
        animation: tbx-banner-icon-pulse 1s ease-in-out infinite alternate;
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
`;

// ─── Harness Component ───────────────────────────────────────────────────────

@Component({
    selector: 'tbx-banner-icon-variants-harness',
    imports: [MatButtonModule],
    template: `
        <div class="harness">
            <h3>Severity Triggers</h3>
            <div class="button-group">
                <button mat-flat-button (click)="fire('default')">Default</button>
                <button mat-flat-button (click)="fire('success')">Success</button>
                <button mat-flat-button (click)="fire('error')">Error</button>
                <button mat-flat-button (click)="fire('warning')">Warning</button>
                <button mat-flat-button (click)="fire('information')">Information</button>
                <button mat-flat-button (click)="fire('help')">Help</button>
            </div>

            <h3>Queue All</h3>
            <div class="button-group">
                <button mat-flat-button (click)="queueAll()">Fire 6 Queued</button>
                <button mat-flat-button (click)="banner.dismissAll()">Dismiss All</button>
            </div>
            <p class="state">Active: {{ banner.isActive() }} &middot; Pending: {{ banner.pendingCount() }}</p>
        </div>
    `,
    styles: `
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
    `,
})
class BannerIconVariantsHarnessComponent {
    readonly banner = inject(TbxMatBannerService);
    readonly verticalPosition = input<'top' | 'bottom'>('top');

    private readonly messages: Record<string, string> = {
        default: 'This is a default banner.',
        success: 'Operation completed successfully.',
        error: 'Something went wrong. Please try again.',
        warning: 'Your session will expire in 5 minutes.',
        information: 'A new version is available.',
        help: 'Click the + button to add a new item.',
    };

    fire(level: string): void {
        const method = this.banner[level as keyof TbxMatBannerService] as (msg: string, args?: object) => void;
        method.call(this.banner, this.messages[level], {
            verticalPosition: this.verticalPosition(),
        });
    }

    queueAll(): void {
        const args = { verticalPosition: this.verticalPosition() };
        this.banner.default('Step 1: This is a default banner.', args);
        this.banner.success('Step 2: Operation completed successfully.', args);
        this.banner.error('Step 3: Something went wrong.', args);
        this.banner.warning('Step 4: Review needed.', args);
        this.banner.information('Step 5: A new version is available.', args);
        this.banner.help('Step 6: Click the + button to add a new item.', args);
    }
}

// ─── Meta ────────────────────────────────────────────────────────────────────

const meta: Meta<BannerIconVariantsHarnessComponent> = {
    title: 'Banners/Overlay Font Icon Variants',
    component: BannerIconVariantsHarnessComponent,
    decorators: [moduleMetadata({ imports: [BannerIconVariantsHarnessComponent] })],
};

export default meta;
type Story = StoryObj<BannerIconVariantsHarnessComponent>;

export const DefaultIcons: Story = {
    name: 'Default Icons',
    decorators: [withDefaultProperties()],
};

export const LargeIcons: Story = {
    name: 'Large Icons',
    decorators: [withCustomProperties(LARGE_ICON_CSS)],
};

export const StateTransition: Story = {
    name: 'State Transition',
    decorators: [withCustomProperties(STATE_TRANSITION_CSS)],
};

export const LargeStateTransition: Story = {
    name: 'Large + State Transition',
    decorators: [withCustomProperties(LARGE_ICON_STATE_TRANSITION_CSS)],
};

export const Pulse: Story = {
    name: 'Pulse',
    decorators: [withCustomProperties(PULSE_CSS)],
};

export const LargePulse: Story = {
    name: 'Large + Pulse',
    decorators: [withCustomProperties(LARGE_ICON_PULSE_CSS)],
};
