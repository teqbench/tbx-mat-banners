import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-icons';
import { TbxMatIconType } from '@teqbench/tbx-mat-icons';
import { TbxMatBannerSeveritySvgIconService } from './banner-severity-svg-icon.service';

describe('TbxMatBannerSeveritySvgIconService', () => {
    let service: TbxMatBannerSeveritySvgIconService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: TbxMatBannerSeveritySvgIconService,
                    useFactory: () => new TbxMatBannerSeveritySvgIconService(),
                },
            ],
        });

        service = TestBed.inject(TbxMatBannerSeveritySvgIconService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should have SVG icon type', () => {
        expect(service.iconType).toBe(TbxMatIconType.Svg);
    });

    describe('resolve()', () => {
        it('should resolve all severity levels to registered icon names', () => {
            expect(service.resolve(TbxMatSeverityLevel.Success)).toBeDefined();
            expect(service.resolve(TbxMatSeverityLevel.Error)).toBeDefined();
            expect(service.resolve(TbxMatSeverityLevel.Warning)).toBeDefined();
            expect(service.resolve(TbxMatSeverityLevel.Information)).toBeDefined();
            expect(service.resolve(TbxMatSeverityLevel.Help)).toBeDefined();
        });

        it('should return undefined for unknown keys', () => {
            expect(service.resolve('unknown')).toBeUndefined();
        });
    });
});
