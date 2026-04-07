import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { TBX_MAT_FONT_ICON_DEFAULT_FONT_SET, TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED, TbxMatIconType } from '@teqbench/tbx-mat-icons';
import { TbxMatBannerCloseFontIconService } from './banner-close-font-icon.service';

describe('TbxMatBannerCloseFontIconService', () => {
    describe('with TBX_MAT_FONT_ICON_DEFAULT_FONT_SET token', () => {
        let service: TbxMatBannerCloseFontIconService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
                        useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
                    },
                    {
                        provide: TbxMatBannerCloseFontIconService,
                        useFactory: () => new TbxMatBannerCloseFontIconService(),
                    },
                ],
            });

            service = TestBed.inject(TbxMatBannerCloseFontIconService);
        });

        it('should be created', () => {
            expect(service).toBeTruthy();
        });

        it('should have Font icon type', () => {
            expect(service.iconType).toBe(TbxMatIconType.Font);
        });

        it('should resolve "close" to "close" ligature', () => {
            expect(service.resolve('close')).toBe('close');
        });

        it('should return undefined for unknown keys', () => {
            expect(service.resolve('unknown')).toBeUndefined();
        });
    });

    describe('with explicit fontSet via constructor', () => {
        let service: TbxMatBannerCloseFontIconService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: TbxMatBannerCloseFontIconService,
                        useFactory: () => new TbxMatBannerCloseFontIconService('material-symbols-sharp'),
                    },
                ],
            });

            service = TestBed.inject(TbxMatBannerCloseFontIconService);
        });

        it('should use the explicitly provided fontSet', () => {
            expect(service.fontSet).toBe('material-symbols-sharp');
        });
    });
});
