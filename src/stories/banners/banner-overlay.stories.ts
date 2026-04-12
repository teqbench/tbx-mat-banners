import { Component, effect, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TbxMatBannerAnimation, TbxMatBannerService } from '../../index';

type VerticalPosition = 'top' | 'bottom';
type EnterExitAnimation = 'none' | 'slide' | 'fade';
type IconSize = 'standard' | 'medium' | 'large';
type IconAnimation = 'none' | 'state-transition' | 'pulse';

@Component({
    selector: 'tbx-banner-overlay-harness',
    imports: [MatButtonModule],
    template: `
        <div class="harness">
            <div class="instructions">
                <p><strong>Overlay banners</strong> display pinned at the top or bottom of the viewport via <a href="https://material.angular.dev/cdk/overlay/api" target="_blank" rel="noopener">CDK Overlay</a>. The lifecycle is managed by <code>TbxMatBannerService</code>: call <code>banner.success(&hellip;)</code>, <code>banner.error(&hellip;)</code>, etc. and the service creates the overlay, queues the banner if another is already visible, and resolves a promise when dismissed.</p>
                <p>The queue is FIFO and only one banner shows at a time — "Fire 6 Queued" sends six in sequence so you can watch them advance. "Dismiss All" empties the queue and closes the active banner. The live state below shows <code>isActive()</code> and <code>pendingCount()</code> signals from the service.</p>
                <p>Use the <strong>Controls</strong> panel to try all combinations of:</p>
                <ul>
                    <li><strong>Position</strong> — top (default) or bottom of the viewport</li>
                    <li><strong>Enter/Exit Animation</strong> — none, slide (from the edge), or fade</li>
                    <li><strong>Icon Size</strong> — standard / medium / large severity icon</li>
                    <li><strong>Icon Animation</strong> — none, state-transition (fill-in on enter), or pulse</li>
                </ul>
            </div>

            <h3>Severity Levels</h3>
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
                margin: 0;
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
            .instructions a {
                color: #4338ca;
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
            .theme-note {
                font-size: 0.8125rem;
                color: #888;
                border-left: 3px solid #ddd;
                padding: 0.25rem 0.75rem;
                margin: 0 0 1rem;
            }
        `,
    ],
})
class BannerOverlayHarnessComponent {
    readonly banner = inject(TbxMatBannerService);

    readonly verticalPosition = input<VerticalPosition>('top');
    readonly enterExitAnimation = input<EnterExitAnimation>('none');
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
        // Inject icon size CSS custom property at document level so it reaches
        // overlay banners (which render outside the component tree via CDK portal).
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

        // Inject icon animation CSS at document level (same reason as above).
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

    fire(level: string): void {
        const method = this.banner[level as keyof TbxMatBannerService] as (msg: string, args?: object) => void;
        method.call(this.banner, this.messages[level], {
            verticalPosition: this.verticalPosition(),
            animation: this.mapAnimation(),
        });
    }

    queueAll(): void {
        const args = {
            verticalPosition: this.verticalPosition(),
            animation: this.mapAnimation(),
        };
        this.banner.default('Step 1: This is a default banner.', args);
        this.banner.success('Step 2: Operation completed successfully.', args);
        this.banner.error('Step 3: Something went wrong.', args);
        this.banner.warning('Step 4: Review needed.', args);
        this.banner.information('Step 5: A new version is available.', args);
        this.banner.help('Step 6: Click the + button to add a new item.', args);
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
}

const meta: Meta<BannerOverlayHarnessComponent> = {
    title: 'Banners',
    tags: ['banners'],
    component: BannerOverlayHarnessComponent,
    decorators: [moduleMetadata({ imports: [BannerOverlayHarnessComponent] })],
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
type Story = StoryObj<BannerOverlayHarnessComponent>;

export const Overlays: Story = {
    args: {
        verticalPosition: 'top',
        enterExitAnimation: 'none',
        iconSize: 'standard',
        iconAnimation: 'none',
    },
};
