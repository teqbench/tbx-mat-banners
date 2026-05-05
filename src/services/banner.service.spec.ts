import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { type Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Overlay } from '@angular/cdk/overlay';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';
import { TBX_MAT_FONT_ICON_DEFAULT_FONT_SET, TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED, TbxMatIconType } from '@teqbench/tbx-mat-icons';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { TbxMatBannerService } from './banner.service';
import { TbxMatBannerCloseFontIconService } from './banner-close-font-icon.service';
import { TbxMatBannerSeverityFontIconService } from './banner-severity-font-icon.service';
import { TBX_MAT_BANNER_PROVIDER_CONFIG } from '../tokens/banner-provider-config.token';
import { TBX_MAT_BANNER_DATA } from '../tokens/banner-data.token';
import { TbxMatBannerAnimation } from '../enums/banner-animation.enum';
import { TbxMatBannerDismissReason } from '../enums/banner-dismiss-reason.enum';

describe('TbxMatBannerService', () => {
    let service: TbxMatBannerService;
    let overlayRefSpy: {
        attach: ReturnType<typeof vi.fn>;
        dispose: ReturnType<typeof vi.fn>;
        overlayElement: HTMLDivElement;
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
            overlayElement: document.createElement('div'),
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

    afterEach(() => {
        // Guarantee real timers are restored even if a test throws between
        // vi.useFakeTimers() and the matching vi.useRealTimers() call.
        vi.useRealTimers();
    });

    /**
     * Reset and reconfigure the TestBed with the standard provider set
     * (Overlay spy + font-set token + severity icon resolver) plus any
     * extra providers the caller needs. Returns a fresh service instance.
     *
     * Use for tests that override the provider config (custom close icon,
     * defaultAnimation, etc.). Do NOT use for the "no fontSet" test —
     * that one omits the font-set token on purpose.
     */
    function reconfigureServiceWith(extraProviders: ReadonlyArray<Provider>): TbxMatBannerService {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [
                TbxMatBannerService,
                { provide: Overlay, useValue: overlaySpy },
                {
                    provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
                    useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
                },
                ...extraProviders,
            ],
        });
        return TestBed.inject(TbxMatBannerService);
    }

    describe('show()', () => {
        it('should create an overlay and attach the component', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Saved' });

            expect(overlaySpy.create).toHaveBeenCalledTimes(1);
            expect(overlayRefSpy.attach).toHaveBeenCalledTimes(1);
        });

        it('should not include severity panel classes in overlay panelClass (severity is on the component host)', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'test' });

            const config = overlaySpy.create.mock.calls[0][0];
            const panelClasses = config.panelClass as string[];
            expect(panelClasses.some((c) => c.startsWith('tbx-mat-banner-panel-'))).toBe(false);
        });

        it('should not arm an auto-dismiss timer when duration is omitted (default = indefinite)', () => {
            const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

            service.show({ type: TbxMatSeverityLevel.Information, message: 'Hello' });

            expect(setTimeoutSpy).not.toHaveBeenCalled();

            setTimeoutSpy.mockRestore();
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

    describe('animation class wiring', () => {
        it('should set slide enter/leave classes in the DTO when animation is Slide', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test', animation: TbxMatBannerAnimation.Slide });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            expect(data.enterAnimationClass).toBe('tbx-mat-banner-slide-in-top');
            expect(data.leaveAnimationClass).toBe('tbx-mat-banner-slide-out-top');
        });

        it('should use bottom slide classes when verticalPosition is bottom', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test', animation: TbxMatBannerAnimation.Slide, verticalPosition: 'bottom' });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            expect(data.enterAnimationClass).toBe('tbx-mat-banner-slide-in-bottom');
            expect(data.leaveAnimationClass).toBe('tbx-mat-banner-slide-out-bottom');
        });

        it('should set fade enter/leave classes in the DTO when animation is Fade', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test', animation: TbxMatBannerAnimation.Fade });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            expect(data.enterAnimationClass).toBe('tbx-mat-banner-fade-in');
            expect(data.leaveAnimationClass).toBe('tbx-mat-banner-fade-out');
        });

        it('should set empty animation classes when animation is None', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test', animation: TbxMatBannerAnimation.None });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            expect(data.enterAnimationClass).toBe('');
            expect(data.leaveAnimationClass).toBe('');
        });

        it('should set empty animation classes when animation is omitted', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            expect(data.enterAnimationClass).toBe('');
            expect(data.leaveAnimationClass).toBe('');
        });

        it('should use provider defaultAnimation when config.animation is omitted', () => {
            const svc = reconfigureServiceWith([
                {
                    provide: TBX_MAT_BANNER_PROVIDER_CONFIG,
                    useFactory: () => ({
                        severityIconResolverService: new TbxMatBannerSeverityFontIconService(),
                        defaultAnimation: TbxMatBannerAnimation.Slide,
                    }),
                },
            ]);

            svc.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            expect(data.enterAnimationClass).toBe('tbx-mat-banner-slide-in-top');
        });

        it('should prefer per-call config.animation over provider defaultAnimation', () => {
            const svc = reconfigureServiceWith([
                {
                    provide: TBX_MAT_BANNER_PROVIDER_CONFIG,
                    useFactory: () => ({
                        severityIconResolverService: new TbxMatBannerSeverityFontIconService(),
                        defaultAnimation: TbxMatBannerAnimation.Fade,
                    }),
                },
            ]);

            svc.show({ type: TbxMatSeverityLevel.Success, message: 'Test', animation: TbxMatBannerAnimation.Slide });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            expect(data.enterAnimationClass).toBe('tbx-mat-banner-slide-in-top');
            expect(data.leaveAnimationClass).toBe('tbx-mat-banner-slide-out-top');
        });
    });

    describe('exit animation coordination', () => {
        it('should chain to the next banner immediately on dismissByClose even with animation enabled (queue must not stall)', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'A', animation: TbxMatBannerAnimation.Slide });
            service.show({ type: TbxMatSeverityLevel.Success, message: 'B' });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);

            data.dismissByClose();

            // Banner B must be shown immediately — overlay.create called twice in total.
            expect(overlaySpy.create).toHaveBeenCalledTimes(2);
        });

        it('should chain to the next banner immediately on dismissByAction even with animation enabled', () => {
            service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'A',
                animation: TbxMatBannerAnimation.Fade,
                actionsGroup: [{ type: 'button', key: 'ok', label: 'OK' }],
            });
            service.show({ type: TbxMatSeverityLevel.Success, message: 'B' });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);

            data.dismissByAction('ok');

            expect(overlaySpy.create).toHaveBeenCalledTimes(2);
        });

        it('should dispose immediately on dismissAll regardless of animation', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test', animation: TbxMatBannerAnimation.Slide });

            service.dismissAll();

            expect(overlayRefSpy.dispose).toHaveBeenCalledTimes(1);
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
        it('should default showSeverityIcon to true when not specified', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            expect(data.showSeverityIcon).toBe(true);
        });

        it('should pass showSeverityIcon false when specified', () => {
            service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
                showSeverityIcon: false,
            });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            expect(data.showSeverityIcon).toBe(false);
        });

        it('should default showCloseButton to true when not specified', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            expect(data.showCloseButton).toBe(true);
        });

        it('should pass showCloseButton false when specified', () => {
            service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
                showCloseButton: false,
            });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            expect(data.showCloseButton).toBe(false);
        });

        it('should default actionsGroup to empty array when not specified', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            expect(data.actionsGroup).toEqual([]);
        });

        it('should use default close icon service when provider does not specify one', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            expect(data.closeIconResolverService).toBeDefined();
        });

        it('should use provider close icon service when specified', () => {
            const customCloseResolver = {
                iconType: TbxMatIconType.Font,
                resolve: () => 'cancel',
            };

            const svc = reconfigureServiceWith([
                {
                    provide: TBX_MAT_BANNER_PROVIDER_CONFIG,
                    useFactory: () => ({
                        severityIconResolverService: new TbxMatBannerSeverityFontIconService(),
                        closeIconResolverService: customCloseResolver,
                    }),
                },
            ]);
            svc.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });

            const portal = overlayRefSpy.attach.mock.calls.at(-1)![0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            expect(data.closeIconResolverService).toBe(customCloseResolver);
        });

        it('should throw when neither TBX_MAT_FONT_ICON_DEFAULT_FONT_SET nor MAT_ICON_DEFAULT_OPTIONS is provided', () => {
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                providers: [
                    TbxMatBannerService,
                    { provide: Overlay, useValue: overlaySpy },
                    {
                        provide: TBX_MAT_BANNER_PROVIDER_CONFIG,
                        useFactory: () => ({
                            severityIconResolverService: new TbxMatBannerSeverityFontIconService(TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED),
                        }),
                    },
                ],
            });

            expect(() => TestBed.inject(TbxMatBannerService)).toThrow(/no fontSet resolved/);
        });

        it('should fall through to MAT_ICON_DEFAULT_OPTIONS.fontSet when TBX_MAT_FONT_ICON_DEFAULT_FONT_SET is not provided', () => {
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                providers: [
                    TbxMatBannerService,
                    { provide: Overlay, useValue: overlaySpy },
                    // TBX_MAT_FONT_ICON_DEFAULT_FONT_SET intentionally omitted; the
                    // service must fall through to MAT_ICON_DEFAULT_OPTIONS.fontSet.
                    {
                        provide: MAT_ICON_DEFAULT_OPTIONS,
                        useValue: { fontSet: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED },
                    },
                    {
                        provide: TBX_MAT_BANNER_PROVIDER_CONFIG,
                        useFactory: () => ({
                            severityIconResolverService: new TbxMatBannerSeverityFontIconService(TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED),
                        }),
                    },
                ],
            });

            const svc = TestBed.inject(TbxMatBannerService);
            svc.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });

            const portal = overlayRefSpy.attach.mock.calls.at(-1)![0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);
            const resolver = data.closeIconResolverService as TbxMatBannerCloseFontIconService;
            // Asserting fontSet — not just iconType — proves the fallback chain
            // actually consulted MAT_ICON_DEFAULT_OPTIONS rather than short-circuiting.
            expect(resolver.fontSet).toBe(TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED);
        });
    });

    describe('re-entrant dismiss guard', () => {
        it('should ignore a second synchronous dismissByClose on the same banner', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });

            const portal = overlayRefSpy.attach.mock.calls[0][0];
            const data = portal.injector.get(TBX_MAT_BANNER_DATA);

            data.dismissByClose();
            data.dismissByClose();

            expect(overlayRefSpy.dispose).toHaveBeenCalledTimes(1);
        });

        it('should ignore a second synchronous dismissByAction on the same banner', () => {
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

    describe('stale banner dismiss race', () => {
        // Use distinct overlay refs per overlay.create call so we can tell A and B apart.
        // Each ref attaches its own componentInstance so a write to one cannot
        // alias into the other (defends against future tests that mutate the
        // instance between A's and B's dismiss paths).
        let overlayRefA: { attach: ReturnType<typeof vi.fn>; dispose: ReturnType<typeof vi.fn> };
        let overlayRefB: { attach: ReturnType<typeof vi.fn>; dispose: ReturnType<typeof vi.fn> };

        beforeEach(() => {
            const componentInstanceA = { collectActionsGroupValues: vi.fn().mockReturnValue({}) };
            const componentInstanceB = { collectActionsGroupValues: vi.fn().mockReturnValue({}) };
            overlayRefA = {
                attach: vi.fn().mockReturnValue({ instance: componentInstanceA }),
                dispose: vi.fn(),
            };
            overlayRefB = {
                attach: vi.fn().mockReturnValue({ instance: componentInstanceB }),
                dispose: vi.fn(),
            };
            // The outer `beforeEach` rebuilds `overlaySpy` for every test, so
            // `overlaySpy.create` is brand-new here — no `mockReset()` needed.
            overlaySpy.create.mockReturnValueOnce(overlayRefA).mockReturnValueOnce(overlayRefB);
        });

        it('dismissByAction on a superseded banner should not dismiss the now-active banner', async () => {
            const refA = service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'A',
                actionsGroup: [{ type: 'button', key: 'ok', label: 'OK' }],
            });
            const refB = service.show({ type: TbxMatSeverityLevel.Success, message: 'B' });

            const portalA = overlayRefA.attach.mock.calls[0][0];
            const dataA = portalA.injector.get(TBX_MAT_BANNER_DATA);

            service.dismiss();

            expect(overlayRefA.dispose).toHaveBeenCalledTimes(1);
            expect(overlayRefB.dispose).not.toHaveBeenCalled();
            expect(service.isActive()).toBe(true);

            // Simulate a stale queued action click firing on A's (destroyed) action button
            dataA.dismissByAction('ok');

            expect(overlayRefB.dispose).not.toHaveBeenCalled();
            expect(service.isActive()).toBe(true);

            const resultA = await refA.result;
            expect(resultA.dismissReason).toBe(TbxMatBannerDismissReason.ProgrammaticDismissCurrent);

            const pending = Symbol('pending');
            const raceResult = await Promise.race([refB.result, Promise.resolve(pending)]);
            expect(raceResult).toBe(pending);
        });

        it('dismissByClose on a superseded banner should not dismiss the now-active banner', async () => {
            // Show banner A (becomes active) and banner B (queued)
            const refA = service.show({ type: TbxMatSeverityLevel.Success, message: 'A' });
            const refB = service.show({ type: TbxMatSeverityLevel.Success, message: 'B' });

            // Capture banner A's DTO while A is still active
            const portalA = overlayRefA.attach.mock.calls[0][0];
            const dataA = portalA.injector.get(TBX_MAT_BANNER_DATA);

            // Dismiss A via a different path so banner B becomes active
            service.dismiss();

            expect(overlayRefA.dispose).toHaveBeenCalledTimes(1);
            expect(overlayRefB.dispose).not.toHaveBeenCalled();
            expect(service.isActive()).toBe(true);

            // Simulate a stale queued close click firing on A's (destroyed) close button
            dataA.dismissByClose();

            // Banner B must not have been dismissed by A's stale callback
            expect(overlayRefB.dispose).not.toHaveBeenCalled();
            expect(service.isActive()).toBe(true);

            // Banner A's promise resolved via service.dismiss()
            const resultA = await refA.result;
            expect(resultA.dismissReason).toBe(TbxMatBannerDismissReason.ProgrammaticDismissCurrent);

            // Banner B's promise should still be pending
            const pending = Symbol('pending');
            const raceResult = await Promise.race([refB.result, Promise.resolve(pending)]);
            expect(raceResult).toBe(pending);
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
