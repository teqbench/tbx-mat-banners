import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { TbxMatBannerService } from '../services/banner.service';
import { TbxMatBannerSeveritySvgIconService } from '../services/banner-severity-svg-icon.service';
import { TBX_MAT_BANNER_PROVIDER_CONFIG } from '../tokens/banner-provider-config.token';
import { withCustomProperties, withDefaultProperties } from './story-overrides';

// ─── CSS Custom Property Overrides ───────────────────────────────────────────

const LARGE_ICON_CSS = `
    html {
        --tbx-mat-banner-icon-size: 3rem;
    }
`;

// ─── SVG Provider Decorator ──────────────────────────────────────────────────

function withSvgIcons() {
    return applicationConfig({
        providers: [
            provideAnimationsAsync(),
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
    selector: 'tbx-banner-svg-icons-harness',
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
    styleUrl: './story-harness.css',
})
class BannerSvgIconsHarnessComponent {
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

const meta: Meta<BannerSvgIconsHarnessComponent> = {
    title: 'Banners/Overlay SVG Icons',
    component: BannerSvgIconsHarnessComponent,
    decorators: [moduleMetadata({ imports: [BannerSvgIconsHarnessComponent] }), withSvgIcons()],
};

export default meta;
type Story = StoryObj<BannerSvgIconsHarnessComponent>;

export const Default: Story = {
    name: 'Default SVG Icons',
    decorators: [withDefaultProperties()],
};

export const Large: Story = {
    name: 'Large SVG Icons',
    decorators: [withCustomProperties(LARGE_ICON_CSS)],
};
