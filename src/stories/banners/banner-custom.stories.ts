import { Component, effect, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TbxMatBannerAnimation, TbxMatBannerService } from '../../index';

type VerticalPosition = 'top' | 'bottom';
type EnterExitAnimation = 'none' | 'slide' | 'fade';

// Custom panel styles applied via the `panelClass` config option on the
// banner service. The styles are injected once at the document level so they
// reach the overlay (which renders outside the component tree via CDK portal).
// The consumer panel class (e.g. tbx-demo-brand) is applied to the CDK
// overlay pane, while the severity styling (background/color) is applied to
// the tbx-mat-banner component host inside the pane. To visually customize
// the banner surface, target the tbx-mat-banner descendant.
const CUSTOM_PANEL_CSS = `
  /* Brand-colored banner: indigo background, white text/icon */
  .tbx-demo-brand tbx-mat-banner {
    background-color: #4f46e5;
    color: #ffffff;
    --tbx-mat-banner-action-icon-color: #ffffff;
    --tbx-mat-banner-close-icon-color: #ffffff;
  }

  /* Dark mode banner: dark slate background, light indigo icon */
  .tbx-demo-dark tbx-mat-banner {
    background-color: #1e293b;
    color: #e2e8f0;
    --tbx-mat-banner-action-icon-color: #a5b4fc;
    --tbx-mat-banner-close-icon-color: #a5b4fc;
  }

  /* Gradient banner: diagonal indigo to pink gradient */
  .tbx-demo-gradient tbx-mat-banner {
    background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
    color: #ffffff;
    --tbx-mat-banner-action-icon-color: #ffffff;
    --tbx-mat-banner-close-icon-color: #ffffff;
  }

  /* Fully rounded "pill" shape with generous horizontal padding */
  .tbx-demo-pill tbx-mat-banner {
    border-radius: 999px;
    margin: 0.5rem;
    background-color: #fef3c7;
    color: #78350f;
    --tbx-mat-banner-action-icon-color: #b45309;
    --tbx-mat-banner-close-icon-color: #b45309;
  }

  /* Outlined style: white fill with colored border */
  .tbx-demo-outlined tbx-mat-banner {
    background-color: #ffffff;
    border: 2px solid #10b981;
    color: #064e3b;
    --tbx-mat-banner-action-icon-color: #10b981;
    --tbx-mat-banner-close-icon-color: #10b981;
  }

  /* Severity override: repaint the built-in success theme in teal. */
  .tbx-demo-teal-success tbx-mat-banner {
    background-color: #0d9488;
    color: #f0fdfa;
    --tbx-mat-banner-action-icon-color: #f0fdfa;
    --tbx-mat-banner-close-icon-color: #f0fdfa;
  }
`;

@Component({
    selector: 'tbx-banner-custom-harness',
    imports: [MatButtonModule],
    template: `
        <div class="harness">
            <div class="instructions">
                <p>
                    <strong>Custom banner styling</strong> goes beyond the built-in severity themes. The banner service accepts a <code>panelClass</code> config option — any CSS class (or array of classes) that gets added to the
                    <a href="https://material.angular.dev/cdk/overlay/api" target="_blank" rel="noopener">CDK Overlay</a>
                    pane hosting the banner.
                </p>

                <h4>How the DOM is structured</h4>
                <p>When a banner opens, the CDK produces this DOM tree (simplified):</p>
                <pre>
&lt;div class="cdk-overlay-pane tbx-mat-banner-overlay-panel
     tbx-mat-banner-position-top
     <strong>my-custom-class</strong>"&gt;
  &lt;tbx-mat-banner class="tbx-mat-banner-panel-success"&gt;
    ...icon, message, actions...
  &lt;/tbx-mat-banner&gt;
&lt;/div&gt;</pre
                >
                <p>Your <code>panelClass</code> is applied to the <strong>outer pane</strong>, but the visible banner surface (background, border, padding) belongs to the inner <code>&lt;tbx-mat-banner&gt;</code> component host. To style that surface, target it as a descendant of your panel class:</p>
                <pre>
.my-custom-class tbx-mat-banner &#123;
  background-color: #4f46e5;
  color: #ffffff;
&#125;</pre
                >

                <h4>Theming buttons and icons via CSS custom properties</h4>
                <p>The banner exposes a set of CSS custom properties consumed by its internal buttons, severity icon, and close icon. Setting these on your panel class themes every inner element consistently — no need to target individual button classes:</p>
                <ul>
                    <li><code>--tbx-mat-banner-action-icon-color</code> — color for icon-only action buttons in the actions group</li>
                    <li><code>--tbx-mat-banner-close-icon-color</code> — color for the close (<span>&times;</span>) button in the top-right corner</li>
                    <li><code>--mat-button-filled-container-color</code>, <code>--mat-button-filled-label-text-color</code> — filled button background and text</li>
                    <li><code>--mat-button-outlined-outline-color</code>, <code>--mat-button-outlined-label-text-color</code> — outlined button border and text</li>
                    <li>(and equivalent tokens for <code>tonal</code>, <code>text</code>, <code>elevated</code> button variants plus <code>checkbox</code>, <code>toggle</code>, and <code>radio</code> controls)</li>
                </ul>
                <p>Look at <code>_tbx-mat-banners.scss</code> in the package to see the full token list and the <code>_severity-panel</code> mixin that maps them for the built-in severities.</p>

                <h4>Demos below</h4>
                <ul>
                    <li><strong>Brand &amp; Color Themes</strong> — solid colors, dark mode, and a gradient background, each overriding the banner surface and icon tokens.</li>
                    <li><strong>Shape &amp; Layout Variations</strong> — fully-rounded pill shape and an outlined style (white fill with a green border) that depart from the default rectangular severity styling.</li>
                    <li><strong>Severity Override</strong> — the most targeted use of <code>panelClass</code>: called alongside <code>banner.success(&hellip;)</code> so both <code>tbx-mat-banner-panel-success</code> and the custom class are present, letting the override repaint just that one severity.</li>
                </ul>
            </div>

            <h3>Brand &amp; Color Themes</h3>
            <div class="button-group">
                <button mat-flat-button (click)="brand()">Brand Indigo</button>
                <button mat-flat-button (click)="dark()">Dark Mode</button>
                <button mat-flat-button (click)="gradient()">Gradient</button>
            </div>

            <h3>Shape &amp; Layout Variations</h3>
            <div class="button-group">
                <button mat-flat-button (click)="pill()">Pill Shape</button>
                <button mat-flat-button (click)="outlined()">Outlined</button>
            </div>

            <h3>Severity Override</h3>
            <p class="theme-note">The panel class can coexist with a severity method to override just that severity's appearance — here <code>success</code> is repainted with a teal theme.</p>
            <div class="button-group">
                <button mat-flat-button (click)="tealSuccess()">Teal Success</button>
            </div>

            <h3>Queue</h3>
            <div class="button-group">
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
            .instructions code,
            .theme-note code {
                background: #eef2ff;
                color: #4338ca;
                padding: 0.1em 0.35em;
                border-radius: 3px;
                font-size: 0.9em;
            }
            .instructions h4 {
                margin: 1rem 0 0.375rem;
                font-size: 0.875rem;
                font-weight: 600;
                color: #1e293b;
            }
            .instructions p {
                margin: 0 0 0.5rem;
            }
            .instructions ul {
                margin: 0 0 0.5rem;
                padding-left: 1.25rem;
            }
            .instructions li {
                margin-bottom: 0.125rem;
            }
            .instructions pre {
                background: #1e293b;
                color: #e2e8f0;
                padding: 0.75rem 1rem;
                border-radius: 6px;
                overflow-x: auto;
                font-size: 0.8125rem;
                font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
                margin: 0 0 0.75rem;
            }
            .instructions pre code,
            .instructions pre strong {
                background: transparent;
                color: inherit;
                padding: 0;
                font-size: inherit;
            }
            .instructions pre strong {
                color: #a5b4fc;
                font-weight: 600;
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
                color: #666;
                border-left: 3px solid #ddd;
                padding: 0.25rem 0.75rem;
                margin: 0 0 1rem;
            }
        `,
    ],
})
class BannerCustomHarnessComponent {
    readonly banner = inject(TbxMatBannerService);

    readonly verticalPosition = input<VerticalPosition>('top');
    readonly enterExitAnimation = input<EnterExitAnimation>('none');

    constructor() {
        // Inject the custom panel styles once at the document level so they
        // reach the CDK-rendered overlay banners.
        const STYLE_ID = 'tbx-banner-story-custom-panels';

        effect(() => {
            if (document.getElementById(STYLE_ID)) return;
            const style = document.createElement('style');
            style.id = STYLE_ID;
            style.textContent = CUSTOM_PANEL_CSS;
            document.head.appendChild(style);
        });
    }

    private fire(message: string, panelClass: string): void {
        this.banner.default(message, {
            panelClass,
            verticalPosition: this.verticalPosition(),
            animation: this.mapAnimation(),
        });
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

    brand(): void {
        this.fire('TeqBench brand colors — indigo background with white text.', 'tbx-demo-brand');
    }

    dark(): void {
        this.fire('Dark mode banner with light indigo accent icon.', 'tbx-demo-dark');
    }

    gradient(): void {
        this.fire('Gradient background from indigo to pink.', 'tbx-demo-gradient');
    }

    pill(): void {
        this.fire('Fully rounded pill shape with amber background.', 'tbx-demo-pill');
    }

    outlined(): void {
        this.fire('Outlined style — transparent background with emerald border.', 'tbx-demo-outlined');
    }

    tealSuccess(): void {
        // Use the success severity method but with a custom panel class that
        // repaints the success theme in teal.
        this.banner.success('Deployment complete — repainted in teal via panel class override.', {
            panelClass: 'tbx-demo-teal-success',
            verticalPosition: this.verticalPosition(),
            animation: this.mapAnimation(),
        });
    }
}

const meta: Meta<BannerCustomHarnessComponent> = {
    title: 'Banners',
    tags: ['banners'],
    component: BannerCustomHarnessComponent,
    decorators: [moduleMetadata({ imports: [BannerCustomHarnessComponent] })],
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
    },
};

export default meta;
type Story = StoryObj<BannerCustomHarnessComponent>;

export const Custom: Story = {
    args: {
        verticalPosition: 'top',
        enterExitAnimation: 'none',
    },
};
