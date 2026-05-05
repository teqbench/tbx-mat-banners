import { describe, it, expect, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';
import { TBX_MAT_FONT_ICON_DEFAULT_FONT_SET, TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED, TbxMatIconType } from '@teqbench/tbx-mat-icons';
import { TBX_MAT_BANNER_PROVIDER_CONFIG } from '../tokens/banner-provider-config.token';
import { TBX_MAT_BANNER_DATA } from '../tokens/banner-data.token';
import { TbxMatBannerSeverityFontIconService } from '../services/banner-severity-font-icon.service';
import { TbxMatBannerComponent } from './banner.component';
import { type BannerDataDto } from '../models/banner-data-dto.model';

/** Helper to build BannerDataDto with sensible defaults. */
function buildData(overrides: Partial<BannerDataDto> = {}): BannerDataDto {
    return {
        type: TbxMatSeverityLevel.Information,
        message: 'Test',
        dismissByClose: vi.fn(),
        dismissByAction: vi.fn(),
        duration: 0,
        showSeverityIcon: true,
        showCloseButton: true,
        closeIconResolverService: {
            iconType: TbxMatIconType.Font,
            resolve: () => 'close',
        },
        actionsGroup: [],
        enterAnimationClass: '',
        leaveAnimationClass: '',
        onLeaveAnimationDone: null,
        ...overrides,
    };
}

/** Create a fixture with the given DTO injected for overlay mode. */
function createFixture(data: BannerDataDto): ComponentFixture<TbxMatBannerComponent> {
    TestBed.configureTestingModule({
        imports: [TbxMatBannerComponent],
        providers: [
            { provide: TBX_MAT_BANNER_DATA, useValue: data },
            {
                provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
                useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
            },
            {
                provide: TBX_MAT_BANNER_PROVIDER_CONFIG,
                useFactory: () => ({
                    severityIconResolverService: new TbxMatBannerSeverityFontIconService(),
                }),
            },
        ],
    });

    const fixture = TestBed.createComponent(TbxMatBannerComponent);
    fixture.detectChanges();
    return fixture;
}

describe('TbxMatBannerComponent', () => {
    describe('message', () => {
        it('should display the provided message', () => {
            const fixture = createFixture(buildData({ message: 'Hello world' }));

            const message = fixture.debugElement.query(By.css('.tbx-mat-banner-label span'));
            expect(message.nativeElement.textContent.trim()).toBe('Hello world');
        });
    });

    describe('host panel class', () => {
        const cases: Array<[TbxMatSeverityLevel, string]> = [
            [TbxMatSeverityLevel.Default, 'tbx-mat-banner-panel-default'],
            [TbxMatSeverityLevel.Success, 'tbx-mat-banner-panel-success'],
            [TbxMatSeverityLevel.Error, 'tbx-mat-banner-panel-error'],
            [TbxMatSeverityLevel.Warning, 'tbx-mat-banner-panel-warning'],
            [TbxMatSeverityLevel.Information, 'tbx-mat-banner-panel-information'],
            [TbxMatSeverityLevel.Help, 'tbx-mat-banner-panel-help'],
        ];

        for (const [type, expectedClass] of cases) {
            it(`should return "${expectedClass}" for ${type}`, () => {
                const fixture = createFixture(buildData({ type }));
                expect(fixture.componentInstance.hostPanelClass()).toBe(expectedClass);
            });
        }

        it('should return empty string for unknown severity type', () => {
            const fixture = createFixture(buildData({ type: 'unknown-type' as TbxMatSeverityLevel }));

            expect(fixture.componentInstance.hostPanelClass()).toBe('');
        });
    });

    describe('host aria role', () => {
        const cases: Array<[TbxMatSeverityLevel, 'alert' | 'status', 'assertive' | 'polite']> = [
            [TbxMatSeverityLevel.Default, 'status', 'polite'],
            [TbxMatSeverityLevel.Success, 'status', 'polite'],
            [TbxMatSeverityLevel.Information, 'status', 'polite'],
            [TbxMatSeverityLevel.Help, 'status', 'polite'],
            [TbxMatSeverityLevel.Warning, 'alert', 'assertive'],
            [TbxMatSeverityLevel.Error, 'alert', 'assertive'],
        ];

        for (const [type, role, live] of cases) {
            it(`should map ${type} → role="${role}", aria-live="${live}"`, () => {
                const fixture = createFixture(buildData({ type }));
                expect(fixture.componentInstance.hostAriaRole()).toBe(role);
                expect(fixture.componentInstance.hostAriaLive()).toBe(live);
            });
        }
    });

    describe('severity icon', () => {
        const cases: Array<[TbxMatSeverityLevel, string]> = [
            [TbxMatSeverityLevel.Success, 'check_circle'],
            [TbxMatSeverityLevel.Error, 'error'],
            [TbxMatSeverityLevel.Warning, 'warning_amber'],
            [TbxMatSeverityLevel.Information, 'info'],
            [TbxMatSeverityLevel.Help, 'help'],
        ];

        for (const [type, expectedIcon] of cases) {
            it(`should display "${expectedIcon}" icon for ${type}`, () => {
                const fixture = createFixture(buildData({ type }));

                const icon = fixture.debugElement.query(By.css('.tbx-mat-banner-icon'));
                expect(icon.nativeElement.textContent.trim()).toBe(expectedIcon);
            });
        }

        it('should render severity icon when showSeverityIcon is true', () => {
            const fixture = createFixture(buildData({ showSeverityIcon: true }));

            const icon = fixture.debugElement.query(By.css('.tbx-mat-banner-icon'));
            expect(icon).not.toBeNull();
        });

        it('should not render severity icon when showSeverityIcon is false', () => {
            const fixture = createFixture(buildData({ showSeverityIcon: false }));

            const icon = fixture.debugElement.query(By.css('.tbx-mat-banner-icon'));
            expect(icon).toBeNull();
        });
    });

    describe('close button', () => {
        it('should render close button when showCloseButton is true', () => {
            const fixture = createFixture(buildData({ showCloseButton: true }));

            const closeButton = fixture.debugElement.query(By.css('.tbx-mat-banner-close-icon-button'));
            expect(closeButton).not.toBeNull();
        });

        it('should not render close button when showCloseButton is false', () => {
            const fixture = createFixture(buildData({ showCloseButton: false }));

            const closeButton = fixture.debugElement.query(By.css('.tbx-mat-banner-close-icon-button'));
            expect(closeButton).toBeNull();
        });

        it('should call dismissByClose when the close button is clicked', () => {
            const dismissByClose = vi.fn();
            const fixture = createFixture(buildData({ dismissByClose }));

            const closeButton = fixture.debugElement.query(By.css('.tbx-mat-banner-close-icon-button'));
            closeButton.nativeElement.click();

            expect(dismissByClose).toHaveBeenCalledOnce();
        });

        it('should have an accessible aria-label', () => {
            const fixture = createFixture(buildData());

            const closeButton = fixture.debugElement.query(By.css('.tbx-mat-banner-close-icon-button'));
            expect(closeButton.nativeElement.getAttribute('aria-label')).toBe('Dismiss banner');
        });
    });

    describe('actions group — buttons', () => {
        it('should render action buttons', () => {
            const fixture = createFixture(
                buildData({
                    actionsGroup: [
                        { type: 'button', key: 'ok', label: 'OK' },
                        { type: 'button', key: 'cancel', label: 'Cancel' },
                    ],
                })
            );

            const buttons = fixture.debugElement.queryAll(By.css('.tbx-mat-banner-action-button'));
            expect(buttons.length).toBe(2);
            expect(buttons[0].nativeElement.textContent.trim()).toContain('OK');
            expect(buttons[1].nativeElement.textContent.trim()).toContain('Cancel');
        });

        it('should call dismissByAction with key when button is clicked', () => {
            const dismissByAction = vi.fn();
            const fixture = createFixture(
                buildData({
                    dismissByAction,
                    actionsGroup: [{ type: 'button', key: 'retry', label: 'Retry' }],
                })
            );

            const button = fixture.debugElement.query(By.css('.tbx-mat-banner-action-button'));
            button.nativeElement.click();

            expect(dismissByAction).toHaveBeenCalledWith('retry');
        });

        it('should render icon-only button with aria-label', () => {
            const fixture = createFixture(
                buildData({
                    actionsGroup: [
                        {
                            type: 'button',
                            key: 'delete',
                            label: 'Delete',
                            icon: 'delete',
                            appearance: 'icon',
                            actionIconResolverService: {
                                iconType: TbxMatIconType.Font,
                                resolve: (k: string) => k,
                            },
                        },
                    ],
                })
            );

            const iconButton = fixture.debugElement.query(By.css('.tbx-mat-banner-action-icon-button[aria-label="Delete"]'));
            expect(iconButton).not.toBeNull();
        });
    });

    describe('actions group — checkbox', () => {
        it('should render a checkbox control', () => {
            const fixture = createFixture(
                buildData({
                    actionsGroup: [
                        { type: 'checkbox', key: 'agree', label: 'I agree', defaultValue: false },
                        { type: 'button', key: 'ok', label: 'OK' },
                    ],
                })
            );

            const checkbox = fixture.debugElement.query(By.css('mat-checkbox'));
            expect(checkbox).not.toBeNull();
        });

        it('should initialize checkbox from defaultValue', () => {
            const fixture = createFixture(
                buildData({
                    actionsGroup: [
                        { type: 'checkbox', key: 'agree', label: 'I agree', defaultValue: true },
                        { type: 'button', key: 'ok', label: 'OK' },
                    ],
                })
            );

            const component = fixture.componentInstance;
            expect(component.getControlValue('agree')).toBe(true);
        });
    });

    describe('actions group — toggle', () => {
        it('should render a slide toggle control', () => {
            const fixture = createFixture(
                buildData({
                    actionsGroup: [
                        { type: 'toggle', key: 'auto', label: 'Auto', defaultValue: false },
                        { type: 'button', key: 'ok', label: 'OK' },
                    ],
                })
            );

            const toggle = fixture.debugElement.query(By.css('mat-slide-toggle'));
            expect(toggle).not.toBeNull();
        });
    });

    describe('actions group — radio group', () => {
        it('should render a radio group control', () => {
            const fixture = createFixture(
                buildData({
                    actionsGroup: [
                        {
                            type: 'radio-group',
                            key: 'format',
                            options: [
                                { label: 'JSON', value: 'json' },
                                { label: 'CSV', value: 'csv' },
                            ],
                            defaultValue: 'json',
                        },
                        { type: 'button', key: 'ok', label: 'OK' },
                    ],
                })
            );

            const radioGroup = fixture.debugElement.query(By.css('mat-radio-group'));
            expect(radioGroup).not.toBeNull();

            const radios = fixture.debugElement.queryAll(By.css('mat-radio-button'));
            expect(radios.length).toBe(2);
        });

        it('should initialize radio group from defaultValue', () => {
            const fixture = createFixture(
                buildData({
                    actionsGroup: [
                        {
                            type: 'radio-group',
                            key: 'format',
                            options: [
                                { label: 'JSON', value: 'json' },
                                { label: 'CSV', value: 'csv' },
                            ],
                            defaultValue: 'csv',
                        },
                        { type: 'button', key: 'ok', label: 'OK' },
                    ],
                })
            );

            const component = fixture.componentInstance;
            expect(component.getControlValue('format')).toBe('csv');
        });
    });

    describe('actions group — toggle group', () => {
        it('should render a button toggle group control', () => {
            const fixture = createFixture(
                buildData({
                    actionsGroup: [
                        {
                            type: 'toggle-group',
                            key: 'channel',
                            options: [
                                { label: 'Email', value: 'email' },
                                { label: 'SMS', value: 'sms' },
                            ],
                            defaultValue: 'email',
                        },
                        { type: 'button', key: 'ok', label: 'OK' },
                    ],
                })
            );

            const toggleGroup = fixture.debugElement.query(By.css('mat-button-toggle-group'));
            expect(toggleGroup).not.toBeNull();

            const toggles = fixture.debugElement.queryAll(By.css('mat-button-toggle'));
            expect(toggles.length).toBe(2);
        });
    });

    describe('collectActionsGroupValues()', () => {
        it('should collect current values from all form controls', () => {
            const fixture = createFixture(
                buildData({
                    actionsGroup: [
                        { type: 'checkbox', key: 'agree', label: 'I agree', defaultValue: true },
                        {
                            type: 'radio-group',
                            key: 'format',
                            options: [
                                { label: 'JSON', value: 'json' },
                                { label: 'CSV', value: 'csv' },
                            ],
                            defaultValue: 'json',
                        },
                        { type: 'button', key: 'ok', label: 'OK' },
                    ],
                })
            );

            const values = fixture.componentInstance.collectActionsGroupValues();
            expect(values).toEqual({ agree: true, format: 'json' });
        });

        it('should return empty object when no form controls exist', () => {
            const fixture = createFixture(
                buildData({
                    actionsGroup: [{ type: 'button', key: 'ok', label: 'OK' }],
                })
            );

            const values = fixture.componentInstance.collectActionsGroupValues();
            expect(values).toEqual({});
        });

        it('should reflect updated values after user interaction', () => {
            const fixture = createFixture(
                buildData({
                    actionsGroup: [
                        { type: 'checkbox', key: 'agree', label: 'I agree', defaultValue: false },
                        { type: 'button', key: 'ok', label: 'OK' },
                    ],
                })
            );

            const component = fixture.componentInstance;
            component.setControlValue('agree', true);

            const values = component.collectActionsGroupValues();
            expect(values).toEqual({ agree: true });
        });
    });

    describe('resolveActionIcon outer-guard edge cases', () => {
        it('should return null from resolveActionIcon when no icon name', () => {
            const fixture = createFixture(
                buildData({
                    actionsGroup: [{ type: 'button', key: 'ok', label: 'OK' }],
                })
            );

            const component = fixture.componentInstance;
            const result = component.resolveActionIcon({ icon: undefined });
            expect(result).toBeNull();
        });

        it('should return null from resolveActionIcon when no resolver', () => {
            const fixture = createFixture(buildData());

            const component = fixture.componentInstance;
            const result = component.resolveActionIcon({ icon: 'refresh' });
            expect(result).toBeNull();
        });

        it('should return null when resolver returns undefined', () => {
            const fixture = createFixture(
                buildData({
                    closeIconResolverService: {
                        iconType: TbxMatIconType.Font,
                        resolve: () => undefined as unknown as string,
                    },
                })
            );

            expect(fixture.componentInstance.closeIcon()).toBeNull();
        });

        it('should return null from resolveIcon when resolver is undefined', () => {
            const fixture = createFixture(buildData());
            const component = fixture.componentInstance;

            const result = component.resolveActionIcon({
                icon: 'test',
                actionIconResolverService: undefined,
            });
            expect(result).toBeNull();
        });

        it('should return null from resolveIcon when key is undefined with valid resolver', () => {
            const fixture = createFixture(buildData());
            const component = fixture.componentInstance;

            // resolver present but icon (key) is undefined — hits !key branch
            const result = component.resolveActionIcon({
                icon: undefined,
                actionIconResolverService: {
                    iconType: TbxMatIconType.Font,
                    resolve: () => 'test',
                },
            });
            expect(result).toBeNull();
        });
    });

    describe('inline mode', () => {
        function configureInlineModule(): void {
            TestBed.configureTestingModule({
                imports: [TbxMatBannerComponent],
                providers: [
                    {
                        provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
                        useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
                    },
                    {
                        provide: TBX_MAT_BANNER_PROVIDER_CONFIG,
                        useFactory: () => ({
                            severityIconResolverService: new TbxMatBannerSeverityFontIconService(),
                        }),
                    },
                ],
            });
        }

        function createInlineFixture(inputs?: Record<string, unknown>): ComponentFixture<TbxMatBannerComponent> {
            configureInlineModule();
            const fixture = TestBed.createComponent(TbxMatBannerComponent);
            const resolved = inputs ?? {
                type: TbxMatSeverityLevel.Warning,
                message: 'Inline banner',
                actionsGroup: [
                    { type: 'checkbox', key: 'remember', label: 'Remember', defaultValue: false },
                    { type: 'button', key: 'ok', label: 'OK' },
                ],
            };
            for (const [key, value] of Object.entries(resolved)) {
                fixture.componentRef.setInput(key, value);
            }
            fixture.detectChanges();
            return fixture;
        }

        it('should use fallback defaults when optional inputs are not set', () => {
            const fixture = createInlineFixture({ type: TbxMatSeverityLevel.Success });
            // message, actionsGroup not set — should fall back to '' and []
            const data = fixture.componentInstance.resolvedData();
            expect(data.message).toBe('');
            expect(data.actionsGroup).toEqual([]);
        });

        it('should default checkbox defaultValue to false when omitted', () => {
            const fixture = createInlineFixture({
                type: TbxMatSeverityLevel.Warning,
                message: 'Test',
                actionsGroup: [
                    { type: 'checkbox', key: 'check', label: 'Check' },
                    { type: 'button', key: 'ok', label: 'OK' },
                ],
            });

            expect(fixture.componentInstance.getControlValue('check')).toBe(false);
        });

        it('should render from inputs when no overlay data is injected', () => {
            const fixture = createInlineFixture();

            const message = fixture.debugElement.query(By.css('.tbx-mat-banner-label span'));
            expect(message.nativeElement.textContent.trim()).toBe('Inline banner');
        });

        it('should emit dismissed event on close click', () => {
            const fixture = createInlineFixture();
            const spy = vi.fn();
            fixture.componentInstance.dismissed.subscribe(spy);

            const closeButton = fixture.debugElement.query(By.css('.tbx-mat-banner-close-icon-button'));
            closeButton.nativeElement.click();

            expect(spy).toHaveBeenCalledWith(expect.objectContaining({ dismissReason: 'close' }));
        });

        it('should emit dismissed event with actionKey on button click', () => {
            const fixture = createInlineFixture();
            const spy = vi.fn();
            fixture.componentInstance.dismissed.subscribe(spy);

            const button = fixture.debugElement.query(By.css('.tbx-mat-banner-action-button'));
            button.nativeElement.click();

            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({
                    dismissReason: 'action',
                    actionKey: 'ok',
                })
            );
        });

        it('should include actionsGroupValues in dismissed event', () => {
            const fixture = createInlineFixture();
            fixture.componentInstance.setControlValue('remember', true);

            const spy = vi.fn();
            fixture.componentInstance.dismissed.subscribe(spy);

            const button = fixture.debugElement.query(By.css('.tbx-mat-banner-action-button'));
            button.nativeElement.click();

            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({
                    actionsGroupValues: { remember: true },
                })
            );
        });
    });

    describe('no actions and no close button', () => {
        it('should not render actions container', () => {
            const fixture = createFixture(buildData({ showCloseButton: false, actionsGroup: [] }));

            const actions = fixture.debugElement.query(By.css('.tbx-mat-banner-actions'));
            expect(actions).toBeNull();
        });
    });
});
