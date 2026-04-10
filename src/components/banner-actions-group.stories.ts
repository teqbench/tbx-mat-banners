import { Component, inject, input, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TbxMatIconType } from '@teqbench/tbx-mat-icons';
import { TbxMatBannerAnimation } from '../enums/banner-animation.enum';
import { TbxMatBannerService } from '../services/banner.service';
import { type TbxMatBannerResult } from '../models/banner-result.model';
import { type TbxMatBannerActionsGroupControl } from '../types/banner-actions-group-control.type';

/**
 * Simple font icon resolver for Storybook — resolves Material Symbols
 * ligature names as-is (the name IS the ligature).
 */
const fontIconResolver = {
    iconType: TbxMatIconType.Font,
    resolve: (key: string) => key,
};

@Component({
    selector: 'tbx-banner-actions-harness',
    imports: [MatButtonModule, JsonPipe],
    template: `
        <div class="harness">
            <h3>Buttons Only</h3>
            <div class="button-group">
                <button mat-flat-button (click)="buttonsText()">Text Buttons</button>
                <button mat-flat-button (click)="buttonsFilled()">Filled Buttons</button>
                <button mat-flat-button (click)="buttonsTonal()">Tonal Buttons</button>
                <button mat-flat-button (click)="buttonsOutlined()">Outlined Buttons</button>
                <button mat-flat-button (click)="buttonsMixed()">Mixed Appearances</button>
            </div>

            <h3>Buttons with Icons</h3>
            <div class="button-group">
                <button mat-flat-button (click)="buttonsLeadingIcons()">Leading Icons</button>
                <button mat-flat-button (click)="buttonsTrailingIcons()">Trailing Icons</button>
                <button mat-flat-button (click)="buttonsIconOnly()">Icon-Only</button>
                <button mat-flat-button (click)="buttonsMixedIcons()">Mixed Icons + Text</button>
            </div>

            <h3>With Checkbox</h3>
            <div class="button-group">
                <button mat-flat-button (click)="withCheckbox()">Checkbox + Button</button>
            </div>

            <h3>With Toggle</h3>
            <div class="button-group">
                <button mat-flat-button (click)="withToggle()">Toggle + Button</button>
            </div>

            <h3>With Radio Group</h3>
            <div class="button-group">
                <button mat-flat-button (click)="withRadioGroup()">Radio Group + Button</button>
            </div>

            <h3>With Toggle Group</h3>
            <div class="button-group">
                <button mat-flat-button (click)="withToggleGroup()">Toggle Group + Button</button>
            </div>

            <h3>Mixed Controls</h3>
            <div class="button-group">
                <button mat-flat-button (click)="mixedControls()">All Control Types</button>
            </div>

            <h3>Queue Demo</h3>
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
class BannerActionsHarnessComponent {
    readonly banner = inject(TbxMatBannerService);
    readonly severity = input<string>('warning');
    readonly verticalPosition = input<'top' | 'bottom'>('top');
    readonly animation = input<TbxMatBannerAnimation>(TbxMatBannerAnimation.None);
    readonly lastResult = signal<TbxMatBannerResult | null>(null);

    private show(message: string, actionsGroup: TbxMatBannerActionsGroupControl[]): void {
        const level = this.severity();
        const method = this.banner[level as keyof TbxMatBannerService] as (msg: string, args?: object) => { result: Promise<TbxMatBannerResult> };
        const ref = method.call(this.banner, message, { actionsGroup, verticalPosition: this.verticalPosition(), animation: this.animation() });
        ref.result.then((result: TbxMatBannerResult) => this.lastResult.set(result));
    }

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
        this.show('File uploaded with warnings.', [
            { type: 'button', key: 'ignore', label: 'Ignore' },
            { type: 'button', key: 'details', label: 'View Details', appearance: 'outlined' },
            { type: 'button', key: 'fix', label: 'Fix Now', appearance: 'filled' },
        ]);
    }

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
            {
                type: 'button',
                key: 'dismiss',
                label: 'Dismiss',
            },
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
            {
                type: 'button',
                key: 'dismiss',
                label: 'Dismiss',
            },
        ]);
    }

    withCheckbox(): void {
        this.show('Cookies are required for this site.', [
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

    mixedControls(): void {
        this.show('Configure update preferences.', [
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

const meta: Meta<BannerActionsHarnessComponent> = {
    title: 'Banners/Overlay Actions Group',
    component: BannerActionsHarnessComponent,
    decorators: [moduleMetadata({ imports: [BannerActionsHarnessComponent] })],
    argTypes: {
        severity: {
            control: 'select',
            options: ['default', 'success', 'error', 'warning', 'information', 'help'],
            description: 'Severity level for the banner',
        },
        verticalPosition: {
            control: 'select',
            options: ['top', 'bottom'],
            description: 'Vertical position of the overlay banner',
        },
        animation: {
            control: 'select',
            options: [TbxMatBannerAnimation.None, TbxMatBannerAnimation.Slide, TbxMatBannerAnimation.Fade],
            description: 'Enter/exit animation mode',
        },
    },
};

export default meta;
type Story = StoryObj<BannerActionsHarnessComponent>;

export const Default: Story = {
    name: 'Default',
    args: { severity: 'default', verticalPosition: 'top', animation: TbxMatBannerAnimation.None },
};

export const Success: Story = {
    name: 'Success',
    args: { severity: 'success', verticalPosition: 'top', animation: TbxMatBannerAnimation.None },
};

export const Error: Story = {
    name: 'Error',
    args: { severity: 'error', verticalPosition: 'top', animation: TbxMatBannerAnimation.None },
};

export const Warning: Story = {
    name: 'Warning',
    args: { severity: 'warning', verticalPosition: 'top', animation: TbxMatBannerAnimation.None },
};

export const Information: Story = {
    name: 'Information',
    args: { severity: 'information', verticalPosition: 'top', animation: TbxMatBannerAnimation.None },
};

export const Help: Story = {
    name: 'Help',
    args: { severity: 'help', verticalPosition: 'top', animation: TbxMatBannerAnimation.None },
};
