import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideTbxMatSeverityTheme } from '@teqbench/tbx-mat-severity-theme';
import { TbxMatBannerAnimation } from '../enums/banner-animation.enum';
import { TbxMatBannerService } from '../services/banner.service';

@Component({
    selector: 'tbx-banner-overlay-harness',
    imports: [MatButtonModule],
    template: `
        <div class="harness">
            <p class="theme-note">Theme: Angular Material prebuilt <strong>Azure Blue</strong>. Banner severity colors are independent of the M3 theme palette.</p>

            <h3>Overlay Banner Triggers</h3>
            <div class="button-group">
                <button mat-flat-button (click)="fire('default')">Default</button>
                <button mat-flat-button (click)="fire('success')">Success</button>
                <button mat-flat-button (click)="fire('error')">Error</button>
                <button mat-flat-button (click)="fire('warning')">Warning</button>
                <button mat-flat-button (click)="fire('information')">Information</button>
                <button mat-flat-button (click)="fire('help')">Help</button>
            </div>

            <h3>Position: Bottom</h3>
            <div class="button-group">
                <button mat-flat-button (click)="fire('default', 'bottom')">Default</button>
                <button mat-flat-button (click)="fire('success', 'bottom')">Success</button>
                <button mat-flat-button (click)="fire('error', 'bottom')">Error</button>
                <button mat-flat-button (click)="fire('warning', 'bottom')">Warning</button>
                <button mat-flat-button (click)="fire('information', 'bottom')">Information</button>
                <button mat-flat-button (click)="fire('help', 'bottom')">Help</button>
            </div>

            <h3>Queue Demo</h3>
            <div class="button-group">
                <button mat-flat-button (click)="queueDemo()">Fire 6 Queued</button>
                <button mat-flat-button (click)="banner.dismissAll()">Dismiss All</button>
            </div>
            <p class="state">Active: {{ banner.isActive() }} &middot; Pending: {{ banner.pendingCount() }}</p>
        </div>
    `,
    styleUrl: './story-harness.css',
})
class BannerOverlayHarnessComponent {
    readonly banner = inject(TbxMatBannerService);
    readonly verticalPosition = input<'top' | 'bottom'>('top');
    readonly animation = input<TbxMatBannerAnimation>(TbxMatBannerAnimation.None);

    private readonly messages: Record<string, string> = {
        default: 'This is a default banner with no severity styling.',
        success: 'Operation completed successfully.',
        error: 'Something went wrong. Please try again.',
        warning: 'Your session will expire in 5 minutes.',
        information: 'A new version is available.',
        help: 'Click the + button to add a new item.',
    };

    fire(level: string, position?: 'top' | 'bottom'): void {
        const method = this.banner[level as keyof TbxMatBannerService] as (msg: string, args?: object) => void;
        method.call(this.banner, this.messages[level], {
            verticalPosition: position ?? this.verticalPosition(),
            animation: this.animation(),
        });
    }

    queueDemo(): void {
        const args = { verticalPosition: this.verticalPosition(), animation: this.animation() };
        this.banner.default('Step 1: This is a default banner.', args);
        this.banner.success('Step 2: Operation completed successfully.', args);
        this.banner.error('Step 3: Something went wrong.', args);
        this.banner.warning('Step 4: Review needed.', args);
        this.banner.information('Step 5: A new version is available.', args);
        this.banner.help('Step 6: Click the + button to add a new item.', args);
    }
}

const meta: Meta<BannerOverlayHarnessComponent> = {
    title: 'Banners/Overlay',
    component: BannerOverlayHarnessComponent,
    decorators: [moduleMetadata({ imports: [BannerOverlayHarnessComponent] })],
    argTypes: {
        verticalPosition: {
            control: 'select',
            options: ['top', 'bottom'],
            description: 'Default vertical position of the overlay banner',
        },
        animation: {
            control: 'select',
            options: [TbxMatBannerAnimation.None, TbxMatBannerAnimation.Slide, TbxMatBannerAnimation.Fade],
            description: 'Enter/exit animation mode',
        },
    },
};

export default meta;
type Story = StoryObj<BannerOverlayHarnessComponent>;

export const Default: Story = {
    args: {
        verticalPosition: 'top',
        animation: TbxMatBannerAnimation.None,
    },
};

export const Inverted: Story = {
    args: {
        verticalPosition: 'top',
        animation: TbxMatBannerAnimation.None,
    },
    decorators: [
        applicationConfig({
            providers: [provideTbxMatSeverityTheme({ invert: true, applyToRoot: true })],
        }),
    ],
    parameters: {
        docs: {
            description: {
                story: 'Inverted severity palette — white backgrounds with colored text. Wired via `provideTbxMatSeverityTheme({ invert: true, applyToRoot: true })` at bootstrap. The inversion is app-global: banners, notifications, and dialogs consuming the same shared theme invert simultaneously.',
            },
        },
    },
};
