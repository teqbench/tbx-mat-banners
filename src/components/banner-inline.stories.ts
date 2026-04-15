import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';
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
                @if (!isDismissed('default')) {
                    <tbx-mat-banner [type]="defaultLevel" message="Default — no severity styling applied." (dismissed)="onDismiss('default', $event)" />
                } @else {
                    <p class="dismissed-note">Dismissed. <button mat-button (click)="show('default')">Show again</button></p>
                }
                @if (!isDismissed('success')) {
                    <tbx-mat-banner [type]="successLevel" message="Success — operation completed." (dismissed)="onDismiss('success', $event)" />
                } @else {
                    <p class="dismissed-note">Dismissed. <button mat-button (click)="show('success')">Show again</button></p>
                }
                @if (!isDismissed('error')) {
                    <tbx-mat-banner [type]="errorLevel" message="Error — something went wrong." (dismissed)="onDismiss('error', $event)" />
                } @else {
                    <p class="dismissed-note">Dismissed. <button mat-button (click)="show('error')">Show again</button></p>
                }
                @if (!isDismissed('warning')) {
                    <tbx-mat-banner [type]="warningLevel" message="Warning — your session will expire soon." (dismissed)="onDismiss('warning', $event)" />
                } @else {
                    <p class="dismissed-note">Dismissed. <button mat-button (click)="show('warning')">Show again</button></p>
                }
                @if (!isDismissed('information')) {
                    <tbx-mat-banner [type]="informationLevel" message="Information — a new version is available." (dismissed)="onDismiss('information', $event)" />
                } @else {
                    <p class="dismissed-note">Dismissed. <button mat-button (click)="show('information')">Show again</button></p>
                }
                @if (!isDismissed('help')) {
                    <tbx-mat-banner [type]="helpLevel" message="Help — click the + button to add a new item." (dismissed)="onDismiss('help', $event)" />
                } @else {
                    <p class="dismissed-note">Dismissed. <button mat-button (click)="show('help')">Show again</button></p>
                }
            </div>

            <h3>With Action Buttons</h3>
            @if (!isDismissed('actions')) {
                <tbx-mat-banner [type]="warningLevel" message="Unsaved changes will be lost." [actionsGroup]="actionButtons" (dismissed)="onDismiss('actions', $event)" />
            } @else {
                <p class="dismissed-note">Dismissed. <button mat-button (click)="show('actions')">Show again</button></p>
            }

            <h3>With Checkbox</h3>
            @if (!isDismissed('checkbox')) {
                <tbx-mat-banner [type]="informationLevel" message="Cookies are required for this site." [actionsGroup]="checkboxControls" (dismissed)="onDismiss('checkbox', $event)" />
            } @else {
                <p class="dismissed-note">Dismissed. <button mat-button (click)="show('checkbox')">Show again</button></p>
            }

            <h3>With Toggle</h3>
            @if (!isDismissed('toggle')) {
                <tbx-mat-banner [type]="informationLevel" message="Auto-save is disabled." [actionsGroup]="toggleControls" (dismissed)="onDismiss('toggle', $event)" />
            } @else {
                <p class="dismissed-note">Dismissed. <button mat-button (click)="show('toggle')">Show again</button></p>
            }

            <h3>With Radio Group</h3>
            @if (!isDismissed('radioGroup')) {
                <tbx-mat-banner [type]="informationLevel" message="Choose export format before proceeding." [actionsGroup]="radioGroupControls" (dismissed)="onDismiss('radioGroup', $event)" />
            } @else {
                <p class="dismissed-note">Dismissed. <button mat-button (click)="show('radioGroup')">Show again</button></p>
            }

            <h3>With Toggle Group</h3>
            @if (!isDismissed('toggleGroup')) {
                <tbx-mat-banner [type]="informationLevel" message="Select notification channels." [actionsGroup]="toggleGroupControls" (dismissed)="onDismiss('toggleGroup', $event)" />
            } @else {
                <p class="dismissed-note">Dismissed. <button mat-button (click)="show('toggleGroup')">Show again</button></p>
            }

            <h3>With Mixed Controls</h3>
            @if (!isDismissed('controls')) {
                <tbx-mat-banner [type]="informationLevel" message="Configure your preferences." [actionsGroup]="mixedControls" (dismissed)="onDismiss('controls', $event)" />
            } @else {
                <p class="dismissed-note">Dismissed. <button mat-button (click)="show('controls')">Show again</button></p>
            }

            <h3>Narrow Container (actions wrap to three rows)</h3>
            <p class="theme-note">This banner is constrained to 500px so the narrow-layout container query kicks in. With enough controls + buttons, the actions row wraps — controls on one row, buttons right-aligned on the next.</p>
            <div class="narrow-wrapper">
                @if (!isDismissed('narrowWrap')) {
                    <tbx-mat-banner [type]="informationLevel" message="Configure notification preferences." [actionsGroup]="narrowWrapControls" (dismissed)="onDismiss('narrowWrap', $event)" />
                } @else {
                    <p class="dismissed-note">Dismissed. <button mat-button (click)="show('narrowWrap')">Show again</button></p>
                }
            </div>

            <h3>No Close Button</h3>
            <tbx-mat-banner [type]="errorLevel" message="This banner cannot be dismissed by the user." [showCloseButton]="false" />

            <h3>No Severity Icon</h3>
            @if (!isDismissed('noIcon')) {
                <tbx-mat-banner [type]="helpLevel" message="This banner has no severity icon." [showSeverityIcon]="false" (dismissed)="onDismiss('noIcon', $event)" />
            } @else {
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
    styleUrl: './story-harness.css',
})
class BannerInlineHarnessComponent {
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
    title: 'Banners/Inline',
    component: BannerInlineHarnessComponent,
    decorators: [moduleMetadata({ imports: [BannerInlineHarnessComponent] })],
};

export default meta;
type Story = StoryObj<BannerInlineHarnessComponent>;

export const Default: Story = {};
