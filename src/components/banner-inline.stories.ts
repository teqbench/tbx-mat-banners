import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-icons';
import { TbxMatBannerComponent } from './banner.component';
import { type TbxMatBannerResult } from '../models/banner-result.model';
import { type TbxMatBannerActionsGroupControl } from '../types/banner-actions-group-control.type';

@Component({
    selector: 'tbx-banner-inline-harness',
    imports: [MatButtonModule, JsonPipe, TbxMatBannerComponent],
    template: `
        <div class="harness">
            <p class="theme-note">Inline banners are placed directly in the consumer's template. Severity panel classes are applied to the host element automatically.</p>

            <h3>Severity Levels</h3>
            <div class="severity-stack">
                <tbx-mat-banner [type]="defaultLevel" message="Default — no severity styling applied." (dismissed)="onDismiss('default', $event)" />
                <tbx-mat-banner [type]="successLevel" message="Success — operation completed." (dismissed)="onDismiss('success', $event)" />
                <tbx-mat-banner [type]="errorLevel" message="Error — something went wrong." (dismissed)="onDismiss('error', $event)" />
                <tbx-mat-banner [type]="warningLevel" message="Warning — your session will expire soon." (dismissed)="onDismiss('warning', $event)" />
                <tbx-mat-banner [type]="informationLevel" message="Information — a new version is available." (dismissed)="onDismiss('information', $event)" />
                <tbx-mat-banner [type]="helpLevel" message="Help — click the + button to add a new item." (dismissed)="onDismiss('help', $event)" />
            </div>

            <h3>With Action Buttons</h3>
            @if (showWithActions()) {
                <tbx-mat-banner [type]="warningLevel" message="Unsaved changes will be lost." [actionsGroup]="actionButtons" (dismissed)="onDismiss('actions', $event)" />
            } @else {
                <p class="dismissed-note">Dismissed. <button mat-button (click)="showWithActions.set(true)">Show again</button></p>
            }

            <h3>With Mixed Controls</h3>
            @if (showWithControls()) {
                <tbx-mat-banner [type]="informationLevel" message="Configure your preferences." [actionsGroup]="mixedControls" (dismissed)="onDismiss('controls', $event)" />
            } @else {
                <p class="dismissed-note">Dismissed. <button mat-button (click)="showWithControls.set(true)">Show again</button></p>
            }

            <h3>No Close Button</h3>
            <tbx-mat-banner [type]="errorLevel" message="This banner cannot be dismissed by the user." [showCloseButton]="false" />

            <h3>No Severity Icon</h3>
            <tbx-mat-banner [type]="helpLevel" message="This banner has no severity icon." [showSeverityIcon]="false" (dismissed)="onDismiss('noIcon', $event)" />

            @if (lastResult()) {
                <div class="result-panel">
                    <h3>Last Dismiss Result ({{ lastSource() }})</h3>
                    <pre>{{ lastResult() | json }}</pre>
                </div>
            }
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
            margin-bottom: 1rem;
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

        .theme-note {
            font-size: 0.8125rem;
            color: #888;
            border-left: 3px solid #ddd;
            padding: 0.25rem 0.75rem;
            margin: 0 0 1rem;
        }

        .dismissed-note {
            font-size: 0.875rem;
            color: #666;
        }
    `,
})
class BannerInlineHarnessComponent {
    readonly defaultLevel = TbxMatSeverityLevel.Default;
    readonly successLevel = TbxMatSeverityLevel.Success;
    readonly warningLevel = TbxMatSeverityLevel.Warning;
    readonly errorLevel = TbxMatSeverityLevel.Error;
    readonly informationLevel = TbxMatSeverityLevel.Information;
    readonly helpLevel = TbxMatSeverityLevel.Help;

    readonly showWithActions = signal(true);
    readonly showWithControls = signal(true);

    readonly lastResult = signal<TbxMatBannerResult | null>(null);
    readonly lastSource = signal('');

    readonly actionButtons: TbxMatBannerActionsGroupControl[] = [
        { type: 'button', key: 'discard', label: 'Discard' },
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

        if (source === 'actions') this.showWithActions.set(false);
        if (source === 'controls') this.showWithControls.set(false);
    }
}

const meta: Meta<BannerInlineHarnessComponent> = {
    title: 'Banners/Inline',
    component: BannerInlineHarnessComponent,
    decorators: [moduleMetadata({ imports: [BannerInlineHarnessComponent] })],
};

export default meta;
type Story = StoryObj<BannerInlineHarnessComponent>;

export const Default: Story = {};
