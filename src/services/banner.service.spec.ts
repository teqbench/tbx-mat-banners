import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Overlay } from '@angular/cdk/overlay';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-icons';
import { TBX_MAT_FONT_ICON_DEFAULT_FONT_SET, TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED } from '@teqbench/tbx-mat-icons';
import { TbxMatBannerService } from './banner.service';
import { TbxMatBannerSeverityFontIconService } from './banner-severity-font-icon.service';
import { TBX_MAT_BANNER_PROVIDER_CONFIG } from '../tokens/banner-provider-config.token';
import { TBX_MAT_BANNER_DATA } from '../tokens/banner-data.token';
import { TbxMatBannerDismissReason } from '../enums/banner-dismiss-reason.enum';
import { BANNER_DEFAULT_DURATION_MS } from '../constants/banner.constants';

describe('TbxMatBannerService', () => {
    let service: TbxMatBannerService;
    let overlayRefSpy: {
        attach: ReturnType<typeof vi.fn>;
        dispose: ReturnType<typeof vi.fn>;
    };
    let overlaySpy: {
        create: ReturnType<typeof vi.fn>;
        position: ReturnType<typeof vi.fn>;
    };
    let mockComponentInstance: {
        collectActionsGroupValues: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
        mockComponentInstance = {
            collectActionsGroupValues: vi.fn().mockReturnValue({}),
        };

        overlayRefSpy = {
            attach: vi.fn().mockReturnValue({ instance: mockComponentInstance }),
            dispose: vi.fn(),
        };

        const positionStrategySpy = {
            global: vi.fn().mockReturnThis(),
            centerHorizontally: vi.fn().mockReturnThis(),
            top: vi.fn().mockReturnThis(),
            bottom: vi.fn().mockReturnThis(),
        };

        overlaySpy = {
            create: vi.fn().mockReturnValue(overlayRefSpy),
            position: vi.fn().mockReturnValue(positionStrategySpy),
        };

        TestBed.configureTestingModule({
            providers: [
                TbxMatBannerService,
                { provide: Overlay, useValue: overlaySpy },
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

        service = TestBed.inject(TbxMatBannerService);
    });

    describe('show()', () => {
        it('should create an overlay and attach the component', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Saved' });

            expect(overlaySpy.create).toHaveBeenCalledTimes(1);
            expect(overlayRefSpy.attach).toHaveBeenCalledTimes(1);
        });

        it('should apply the correct panel class for each severity', () => {
            const cases: Array<[TbxMatSeverityLevel, string]> = [
                [TbxMatSeverityLevel.Default, 'tbx-mat-banner-panel-default'],
                [TbxMatSeverityLevel.Success, 'tbx-mat-banner-panel-success'],
                [TbxMatSeverityLevel.Error, 'tbx-mat-banner-panel-error'],
                [TbxMatSeverityLevel.Warning, 'tbx-mat-banner-panel-warning'],
                [TbxMatSeverityLevel.Information, 'tbx-mat-banner-panel-information'],
                [TbxMatSeverityLevel.Help, 'tbx-mat-banner-panel-help'],
            ];

            for (const [type, expectedClass] of cases) {
                // Dismiss previous by invoking the close callback
                if (overlaySpy.create.mock.calls.length > 0) {
                    service.dismiss();
                }

                service.show({ type, message: 'test' });

                const config = overlaySpy.create.mock.calls.at(-1)![0];
                expect(config.panelClass).toContain(expectedClass);
            }
        });

        it('should use default duration (0 = indefinite) when none is provided', () => {
            service.show({ type: TbxMatSeverityLevel.Information, message: 'Hello' });

            // Default duration is 0 (indefinite) — no setTimeout should be set
            expect(BANNER_DEFAULT_DURATION_MS).toBe(0);
        });

        it('should return a ref with the consumer config', () => {
            const inputConfig = { type: TbxMatSeverityLevel.Success, message: 'Test' };
            const ref = service.show(inputConfig);

            expect(ref.config).toBe(inputConfig);
        });

        it('should include overlay-panel and position classes', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });

            const config = overlaySpy.create.mock.calls[0][0];
            expect(config.panelClass).toContain('tbx-mat-banner-overlay-panel');
            expect(config.panelClass).toContain('tbx-mat-banner-position-top');
        });

        it('should use bottom position class when verticalPosition is bottom', () => {
            service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
                verticalPosition: 'bottom',
            });

            const config = overlaySpy.create.mock.calls[0][0];
            expect(config.panelClass).toContain('tbx-mat-banner-position-bottom');
        });

        it('should merge consumer panelClass string', () => {
            service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
                panelClass: 'my-class',
            });

            const config = overlaySpy.create.mock.calls[0][0];
            expect(config.panelClass).toContain('my-class');
            expect(config.panelClass).toContain('tbx-mat-banner-panel-success');
        });

        it('should merge consumer panelClass array', () => {
            service.show({
                type: TbxMatSeverityLevel.Error,
                message: 'Test',
                panelClass: ['class-a', 'class-b'],
            });

            const config = overlaySpy.create.mock.calls[0][0];
            expect(config.panelClass).toContain('class-a');
            expect(config.panelClass).toContain('class-b');
        });
    });

    describe('duration', () => {
        it('should treat undefined duration as indefinite (0)', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });
            // No auto-dismiss — banner stays active
            expect(service.isActive()).toBe(true);
        });

        it('should treat zero duration as indefinite', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test', duration: 0 });
            expect(service.isActive()).toBe(true);
        });

        it('should treat negative duration as indefinite', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test', duration: -100 });
            expect(service.isActive()).toBe(true);
        });

        it('should auto-dismiss after positive duration', () => {
            vi.useFakeTimers();

            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test', duration: 5000 });

            expect(service.isActive()).toBe(true);
            vi.advanceTimersByTime(5000);
            expect(service.isActive()).toBe(false);
            expect(overlayRefSpy.dispose).toHaveBeenCalled();

            vi.useRealTimers();
        });

        it('should clear duration timeout when dismissed before expiry', () => {
            vi.useFakeTimers();

            service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
                duration: 5000,
            });

            // Dismiss before the 5000ms timeout fires
            service.dismiss();

            // Advance past the original timeout — should NOT create a second overlay
            vi.advanceTimersByTime(5000);
            expect(overlayRefSpy.dispose).toHaveBeenCalledTimes(1);

            vi.useRealTimers();
        });

        it('should resolve result with Timeout after duration expires', async () => {
            vi.useFakeTimers();

            const ref = service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
                duration: 3000,
            });

            vi.advanceTimersByTime(3000);

            const result = await ref.result;
            expect(result.dismissReason).toBe(TbxMatBannerDismissReason.Timeout);

            vi.useRealTimers();
        });
    });

    describe('queue', () => {
        it('should display the first banner immediately', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'First' });

            expect(overlaySpy.create).toHaveBeenCalledTimes(1);
        });

        it('should not display a second banner until the first is dismissed', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'First' });
            service.show({ type: TbxMatSeverityLevel.Error, message: 'Second' });

            expect(overlaySpy.create).toHaveBeenCalledTimes(1);
        });

        it('should display the second banner after the first is dismissed', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'First' });
            service.show({ type: TbxMatSeverityLevel.Error, message: 'Second' });

            service.dismiss();

            expect(overlaySpy.create).toHaveBeenCalledTimes(2);
        });

        it('should process multiple queued banners in FIFO order', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'First' });
            service.show({ type: TbxMatSeverityLevel.Error, message: 'Second' });
            service.show({ type: TbxMatSeverityLevel.Warning, message: 'Third' });

            service.dismiss();
            expect(overlaySpy.create).toHaveBeenCalledTimes(2);

            service.dismiss();
            expect(overlaySpy.create).toHaveBeenCalledTimes(3);
        });

        it('should report correct pendingCount', () => {
            expect(service.pendingCount()).toBe(0);

            service.show({ type: TbxMatSeverityLevel.Success, message: 'First' });
            expect(service.pendingCount()).toBe(0);

            service.show({ type: TbxMatSeverityLevel.Error, message: 'Second' });
            expect(service.pendingCount()).toBe(1);

            service.show({ type: TbxMatSeverityLevel.Warning, message: 'Third' });
            expect(service.pendingCount()).toBe(2);
        });

        it('should report isActive correctly', () => {
            expect(service.isActive()).toBe(false);

            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });
            expect(service.isActive()).toBe(true);

            service.dismiss();
            expect(service.isActive()).toBe(false);
        });

        it('should accept new banners after queue drains', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'First' });
            service.dismiss();

            service.show({ type: TbxMatSeverityLevel.Error, message: 'New' });
            expect(overlaySpy.create).toHaveBeenCalledTimes(2);
        });
    });

    describe('dismiss()', () => {
        it('should dispose the overlay', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });
            service.dismiss();
            expect(overlayRefSpy.dispose).toHaveBeenCalled();
        });

        it('should resolve result with ProgrammaticDismissCurrent', async () => {
            const ref = service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });
            service.dismiss();

            const result = await ref.result;
            expect(result.dismissReason).toBe(TbxMatBannerDismissReason.ProgrammaticDismissCurrent);
        });

        it('should advance to the next queued banner', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'First' });
            service.show({ type: TbxMatSeverityLevel.Error, message: 'Second' });

            service.dismiss();

            expect(overlaySpy.create).toHaveBeenCalledTimes(2);
            expect(service.isActive()).toBe(true);
        });
    });

    describe('dismissAll()', () => {
        it('should dispose the active overlay', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });
            service.dismissAll();
            expect(overlayRefSpy.dispose).toHaveBeenCalled();
        });

        it('should clear the queue', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'First' });
            service.show({ type: TbxMatSeverityLevel.Error, message: 'Second' });
            service.show({ type: TbxMatSeverityLevel.Warning, message: 'Third' });

            service.dismissAll();

            expect(service.pendingCount()).toBe(0);
            expect(service.isActive()).toBe(false);
            expect(overlaySpy.create).toHaveBeenCalledTimes(1);
        });

        it('should resolve active with ProgrammaticDismissAll', async () => {
            const ref = service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });
            service.dismissAll();

            const result = await ref.result;
            expect(result.dismissReason).toBe(TbxMatBannerDismissReason.ProgrammaticDismissAll);
        });

        it('should resolve queued with ProgrammaticDismissAll', async () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'First' });
            const ref2 = service.show({ type: TbxMatSeverityLevel.Error, message: 'Second' });
            const ref3 = service.show({ type: TbxMatSeverityLevel.Warning, message: 'Third' });

            service.dismissAll();

            const result2 = await ref2.result;
            const result3 = await ref3.result;
            expect(result2.dismissReason).toBe(TbxMatBannerDismissReason.ProgrammaticDismissAll);
            expect(result3.dismissReason).toBe(TbxMatBannerDismissReason.ProgrammaticDismissAll);
        });

        it('should allow new banners after dismissAll', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'First' });
            service.dismissAll();

            service.show({ type: TbxMatSeverityLevel.Help, message: 'Fresh' });
            expect(overlaySpy.create).toHaveBeenCalledTimes(2);
            expect(service.isActive()).toBe(true);
        });

        it('should handle dismissAll when no banner is active', () => {
            service.dismissAll();
            expect(service.pendingCount()).toBe(0);
            expect(service.isActive()).toBe(false);
        });
    });

    describe('convenience methods', () => {
        it('success() should show a Success banner', () => {
            const ref = service.success('Saved');
            expect(ref.config.type).toBe(TbxMatSeverityLevel.Success);
            expect(ref.config.message).toBe('Saved');
        });

        it('error() should show an Error banner', () => {
            const ref = service.error('Failed');
            expect(ref.config.type).toBe(TbxMatSeverityLevel.Error);
            expect(ref.config.message).toBe('Failed');
        });

        it('warning() should show a Warning banner', () => {
            const ref = service.warning('Careful');
            expect(ref.config.type).toBe(TbxMatSeverityLevel.Warning);
            expect(ref.config.message).toBe('Careful');
        });

        it('information() should show an Information banner', () => {
            const ref = service.information('FYI');
            expect(ref.config.type).toBe(TbxMatSeverityLevel.Information);
            expect(ref.config.message).toBe('FYI');
        });

        it('help() should show a Help banner', () => {
            const ref = service.help('Try this');
            expect(ref.config.type).toBe(TbxMatSeverityLevel.Help);
            expect(ref.config.message).toBe('Try this');
        });

        it('default() should show a Default banner', () => {
            const ref = service.default('General');
            expect(ref.config.type).toBe(TbxMatSeverityLevel.Default);
            expect(ref.config.message).toBe('General');
        });

        it('convenience methods should accept optional configArgs', () => {
            const ref = service.success('Done', { duration: 5000 });
            expect(ref.config.duration).toBe(5000);
        });
    });

    describe('DTO default fallbacks', () => {
        it('should default showSeverityIcon to true when not specified', async () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            expect(data.showSeverityIcon).toBe(true);
        });

        it('should pass showSeverityIcon false when specified', async () => {
            service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
                showSeverityIcon: false,
            });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            expect(data.showSeverityIcon).toBe(false);
        });

        it('should default showCloseButton to true when not specified', async () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            expect(data.showCloseButton).toBe(true);
        });

        it('should pass showCloseButton false when specified', async () => {
            service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
                showCloseButton: false,
            });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            expect(data.showCloseButton).toBe(false);
        });

        it('should default actionsGroup to empty array when not specified', async () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            expect(data.actionsGroup).toEqual([]);
        });

        it('should use default close icon service when provider does not specify one', async () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            expect(data.closeIconResolverService).toBeDefined();
        });

        it('should use provider close icon service when specified', () => {
            TestBed.resetTestingModule();

            const customCloseResolver = {
                iconType: 0 as const,
                resolve: () => 'cancel',
            };

            TestBed.configureTestingModule({
                providers: [
                    TbxMatBannerService,
                    { provide: Overlay, useValue: overlaySpy },
                    {
                        provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
                        useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
                    },
                    {
                        provide: TBX_MAT_BANNER_PROVIDER_CONFIG,
                        useFactory: () => ({
                            severityIconResolverService: new TbxMatBannerSeverityFontIconService(),
                            closeIconResolverService: customCloseResolver,
                        }),
                    },
                ],
            });

            const svc = TestBed.inject(TbxMatBannerService);
            svc.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });

            const portal = overlayRefSpy.attach.mock.calls.at(-1)![0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            expect(data.closeIconResolverService).toBe(customCloseResolver);
        });
    });

    describe('isDismissing guard', () => {
        it('should ignore re-entrant dismissByClose calls', async () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);

            // First call dismisses normally
            data.dismissByClose();
            // Second call should be ignored (isDismissing guard)
            data.dismissByClose();

            // Only one dispose call
            expect(overlayRefSpy.dispose).toHaveBeenCalledTimes(1);
        });

        it('should ignore re-entrant dismissByAction calls', async () => {
            service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
                actionsGroup: [{ type: 'button', key: 'ok', label: 'OK' }],
            });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);

            data.dismissByAction('ok');
            data.dismissByAction('ok');

            expect(overlayRefSpy.dispose).toHaveBeenCalledTimes(1);
        });
    });

    describe('dismiss with null component ref', () => {
        it('should return empty actionsGroupValues on dismiss when component ref is null', async () => {
            overlayRefSpy.attach.mockReturnValue({ instance: null });

            const ref = service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });
            service.dismiss();

            const result = await ref.result;
            expect(result.actionsGroupValues).toEqual({});
        });

        it('should return empty actionsGroupValues on timeout when component ref is null', async () => {
            vi.useFakeTimers();
            overlayRefSpy.attach.mockReturnValue({ instance: null });

            const ref = service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
                duration: 1000,
            });

            vi.advanceTimersByTime(1000);

            const result = await ref.result;
            expect(result.actionsGroupValues).toEqual({});
            expect(result.dismissReason).toBe(TbxMatBannerDismissReason.Timeout);

            vi.useRealTimers();
        });
    });

    describe('dismiss reasons via DTO callbacks', () => {
        it('should resolve with Close when dismissByClose is called', async () => {
            const ref = service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });

            // Get the DTO data from the injector passed to the portal
            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            data.dismissByClose();

            const result = await ref.result;
            expect(result.dismissReason).toBe(TbxMatBannerDismissReason.Close);
        });

        it('should resolve with Action and actionKey when dismissByAction is called', async () => {
            const ref = service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
                actionsGroup: [{ type: 'button', key: 'undo', label: 'Undo' }],
            });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            data.dismissByAction('undo');

            const result = await ref.result;
            expect(result.dismissReason).toBe(TbxMatBannerDismissReason.Action);
            expect(result.actionKey).toBe('undo');
        });

        it('should collect actionsGroupValues on dismiss', async () => {
            mockComponentInstance.collectActionsGroupValues.mockReturnValue({
                dontShowAgain: true,
            });

            const ref = service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
                actionsGroup: [
                    { type: 'checkbox', key: 'dontShowAgain', label: "Don't show again" },
                    { type: 'button', key: 'ok', label: 'OK' },
                ],
            });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            data.dismissByAction('ok');

            const result = await ref.result;
            expect(result.actionsGroupValues).toEqual({ dontShowAgain: true });
        });
    });
});
