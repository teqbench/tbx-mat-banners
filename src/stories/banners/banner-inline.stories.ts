import { Component, computed, effect, input, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-icons';
import { TbxMatBannerComponent, type TbxMatBannerResult, type TbxMatBannerActionsGroupControl } from '../../index';

@Component({
    selector: 'tbx-banner-inline-harness',
    imports: [MatButtonModule, JsonPipe, TbxMatBannerComponent],
    template: `
        <div class="harness" [style]="iconSizeStyle()">
            <div class="instructions">
                <p><strong>Inline banners</strong> render directly in your template, flowing with the surrounding page content rather than overlaying it. The consumer controls visibility via <code>&#64;if</code> / signals (unlike overlay banners which are managed by <code>TbxMatBannerService</code>). Place a <code>&lt;tbx-mat-banner&gt;</code> element wherever the message belongs in the DOM.</p>
                <p>Every example below uses a different banner configuration — severity level, action buttons, or form controls. Severity panel classes (<code>tbx-mat-banner-panel-*</code>) are applied to the component host automatically based on the <code>[type]</code> input. Dismiss events fire via the <code>(dismissed)</code> output and include the action key plus collected control values. The <strong>Controls</strong> panel below adjusts icon size and icon animation across all banners on this page.</p>
            </div>

            <h3>Severity Levels</h3>
            <div class="severity-stack">
                <tbx-mat-banner [type]="defaultLevel" message="Default — no severity styling applied." [style.display]="isDismissed('default') ? 'none' : ''" (dismissed)="onDismiss('default', $event)" />
                @if (isDismissed('default')) {
                    <p class="dismissed-note">Dismissed. <button mat-button (click)="show('default')">Show again</button></p>
                }

                <tbx-mat-banner [type]="successLevel" message="Success — operation completed." [style.display]="isDismissed('success') ? 'none' : ''" (dismissed)="onDismiss('success', $event)" />
                @if (isDismissed('success')) {
                    <p class="dismissed-note">Dismissed. <button mat-button (click)="show('success')">Show again</button></p>
                }

                <tbx-mat-banner [type]="errorLevel" message="Error — something went wrong." [style.display]="isDismissed('error') ? 'none' : ''" (dismissed)="onDismiss('error', $event)" />
                @if (isDismissed('error')) {
                    <p class="dismissed-note">Dismissed. <button mat-button (click)="show('error')">Show again</button></p>
                }

                <tbx-mat-banner [type]="warningLevel" message="Warning — your session will expire soon." [style.display]="isDismissed('warning') ? 'none' : ''" (dismissed)="onDismiss('warning', $event)" />
                @if (isDismissed('warning')) {
                    <p class="dismissed-note">Dismissed. <button mat-button (click)="show('warning')">Show again</button></p>
                }

                <tbx-mat-banner [type]="informationLevel" message="Information — a new version is available." [style.display]="isDismissed('information') ? 'none' : ''" (dismissed)="onDismiss('information', $event)" />
                @if (isDismissed('information')) {
                    <p class="dismissed-note">Dismissed. <button mat-button (click)="show('information')">Show again</button></p>
                }

                <tbx-mat-banner [type]="helpLevel" message="Help — click the + button to add a new item." [style.display]="isDismissed('help') ? 'none' : ''" (dismissed)="onDismiss('help', $event)" />
                @if (isDismissed('help')) {
                    <p class="dismissed-note">Dismissed. <button mat-button (click)="show('help')">Show again</button></p>
                }
            </div>

            <h3>With Action Buttons</h3>
            <tbx-mat-banner [type]="warningLevel" message="Unsaved changes will be lost." [actionsGroup]="actionButtons" [style.display]="isDismissed('actions') ? 'none' : ''" (dismissed)="onDismiss('actions', $event)" />
            @if (isDismissed('actions')) {
                <p class="dismissed-note">Dismissed. <button mat-button (click)="show('actions')">Show again</button></p>
            }

            <h3>With Checkbox</h3>
            <tbx-mat-banner [type]="informationLevel" message="Cookies are required for this site." [actionsGroup]="checkboxControls" [style.display]="isDismissed('checkbox') ? 'none' : ''" (dismissed)="onDismiss('checkbox', $event)" />
            @if (isDismissed('checkbox')) {
                <p class="dismissed-note">Dismissed. <button mat-button (click)="show('checkbox')">Show again</button></p>
            }

            <h3>With Toggle</h3>
            <tbx-mat-banner [type]="informationLevel" message="Auto-save is disabled." [actionsGroup]="toggleControls" [style.display]="isDismissed('toggle') ? 'none' : ''" (dismissed)="onDismiss('toggle', $event)" />
            @if (isDismissed('toggle')) {
                <p class="dismissed-note">Dismissed. <button mat-button (click)="show('toggle')">Show again</button></p>
            }

            <h3>With Radio Group</h3>
            <tbx-mat-banner [type]="informationLevel" message="Choose export format before proceeding." [actionsGroup]="radioGroupControls" [style.display]="isDismissed('radioGroup') ? 'none' : ''" (dismissed)="onDismiss('radioGroup', $event)" />
            @if (isDismissed('radioGroup')) {
                <p class="dismissed-note">Dismissed. <button mat-button (click)="show('radioGroup')">Show again</button></p>
            }

            <h3>With Toggle Group</h3>
            <tbx-mat-banner [type]="informationLevel" message="Select notification channels." [actionsGroup]="toggleGroupControls" [style.display]="isDismissed('toggleGroup') ? 'none' : ''" (dismissed)="onDismiss('toggleGroup', $event)" />
            @if (isDismissed('toggleGroup')) {
                <p class="dismissed-note">Dismissed. <button mat-button (click)="show('toggleGroup')">Show again</button></p>
            }

            <h3>With Mixed Controls</h3>
            <tbx-mat-banner [type]="informationLevel" message="Configure your preferences." [actionsGroup]="mixedControls" [style.display]="isDismissed('controls') ? 'none' : ''" (dismissed)="onDismiss('controls', $event)" />
            @if (isDismissed('controls')) {
                <p class="dismissed-note">Dismissed. <button mat-button (click)="show('controls')">Show again</button></p>
            }

            <h3>Narrow Container</h3>
            <p class="theme-note">Constrained to 500px — the responsive container query wraps controls and buttons onto separate rows.</p>
            <div class="narrow-wrapper">
                <tbx-mat-banner [type]="informationLevel" message="Configure notification preferences." [actionsGroup]="narrowWrapControls" [style.display]="isDismissed('narrowWrap') ? 'none' : ''" (dismissed)="onDismiss('narrowWrap', $event)" />
                @if (isDismissed('narrowWrap')) {
                    <p class="dismissed-note">Dismissed. <button mat-button (click)="show('narrowWrap')">Show again</button></p>
                }
            </div>

            <h3>No Close Button</h3>
            <tbx-mat-banner [type]="errorLevel" message="This banner cannot be dismissed by the user." [showCloseButton]="false" />

            <h3>No Severity Icon</h3>
            <tbx-mat-banner [type]="helpLevel" message="This banner has no severity icon." [showSeverityIcon]="false" [style.display]="isDismissed('noIcon') ? 'none' : ''" (dismissed)="onDismiss('noIcon', $event)" />
            @if (isDismissed('noIcon')) {
                <p class="dismissed-note">Dismissed. <button mat-button (click)="show('noIcon')">Show again</button></p>
            }

            @if (lastResult()) {
                <div class="result-panel">
                    <h3>Last Dismiss Result ({{ lastSource() }})</h3>
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
                margin: 0;
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
            .severity-stack {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            .dismissed-note {
                font-size: 0.875rem;
                color: #666;
            }
            .narrow-wrapper {
                max-width: 500px;
                border: 1px dashed #ccc;
            }
        `,
    ],
})
class BannerInlineHarnessComponent {
    readonly iconSize = input<'standard' | 'medium' | 'large'>('standard');
    readonly iconAnimation = input<'none' | 'state-transition' | 'pulse'>('none');

    readonly iconSizeStyle = computed(() => {
        const sizes = { standard: '', medium: '2rem', large: '3rem' };
        const size = sizes[this.iconSize()];
        return size ? `--tbx-mat-banner-icon-size: ${size}` : '';
    });

    constructor() {
        // Reactively inject animation CSS into document.head to pierce encapsulation
        const STYLE_ID = 'tbx-banner-story-icon-animation';

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
            document.getElementById(STYLE_ID)?.remove();
            if (mode === 'none') return;
            const style = document.createElement('style');
            style.id = STYLE_ID;
            style.textContent = mode === 'state-transition' ? STATE_CSS : PULSE_CSS;
            document.head.appendChild(style);
        });
    }

    readonly defaultLevel = TbxMatSeverityLevel.Default;
    readonly successLevel = TbxMatSeverityLevel.Success;
    readonly warningLevel = TbxMatSeverityLevel.Warning;
    readonly errorLevel = TbxMatSeverityLevel.Error;
    readonly informationLevel = TbxMatSeverityLevel.Information;
    readonly helpLevel = TbxMatSeverityLevel.Help;

    readonly dismissedKeys = signal<ReadonlySet<string>>(new Set());
    readonly lastResult = signal<TbxMatBannerResult | null>(null);
    readonly lastSource = signal('');

    isDismissed(key: string): boolean {
        return this.dismissedKeys().has(key);
    }

    show(key: string): void {
        const next = new Set(this.dismissedKeys());
        next.delete(key);
        this.dismissedKeys.set(next);
    }

    readonly actionButtons: TbxMatBannerActionsGroupControl[] = [
        { type: 'button', key: 'discard', label: 'Discard' },
        { type: 'button', key: 'save', label: 'Save', appearance: 'filled' },
    ];

    readonly checkboxControls: TbxMatBannerActionsGroupControl[] = [
        { type: 'checkbox', key: 'dontShowAgain', label: "Don't show again", defaultValue: false },
        { type: 'button', key: 'accept', label: 'Accept', appearance: 'filled' },
    ];

    readonly toggleControls: TbxMatBannerActionsGroupControl[] = [
        { type: 'toggle', key: 'autoSave', label: 'Enable auto-save', defaultValue: false },
        { type: 'button', key: 'confirm', label: 'Confirm', appearance: 'filled' },
    ];

    readonly radioGroupControls: TbxMatBannerActionsGroupControl[] = [
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
    ];

    readonly toggleGroupControls: TbxMatBannerActionsGroupControl[] = [
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
    ];

    readonly narrowWrapControls: TbxMatBannerActionsGroupControl[] = [
        { type: 'checkbox', key: 'email', label: 'Email', defaultValue: true },
        { type: 'checkbox', key: 'sms', label: 'SMS', defaultValue: false },
        { type: 'checkbox', key: 'push', label: 'Push', defaultValue: true },
        { type: 'button', key: 'cancel', label: 'Cancel' },
        { type: 'button', key: 'reset', label: 'Reset', appearance: 'outlined' },
        { type: 'button', key: 'save', label: 'Save', appearance: 'filled' },
    ];

    readonly mixedControls: TbxMatBannerActionsGroupControl[] = [
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
    ];

    onDismiss(source: string, result: TbxMatBannerResult): void {
        this.lastSource.set(source);
        this.lastResult.set(result);
        const next = new Set(this.dismissedKeys());
        next.add(source);
        this.dismissedKeys.set(next);
    }
}

const meta: Meta<BannerInlineHarnessComponent> = {
    title: 'Banners',
    tags: ['banners'],
    component: BannerInlineHarnessComponent,
    decorators: [moduleMetadata({ imports: [BannerInlineHarnessComponent] })],
    argTypes: {
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
type Story = StoryObj<BannerInlineHarnessComponent>;

export const Inline: Story = {
    args: {
        iconSize: 'standard',
        iconAnimation: 'none',
    },
};
