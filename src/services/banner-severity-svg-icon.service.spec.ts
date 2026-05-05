import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';
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

    it('should have SVG icon type', () => {
        expect(service.iconType).toBe(TbxMatIconType.Svg);
    });

    describe('resolve()', () => {
        it('should resolve all severity levels to distinct icon names', () => {
            const results = [service.resolve(TbxMatSeverityLevel.Success), service.resolve(TbxMatSeverityLevel.Error), service.resolve(TbxMatSeverityLevel.Warning), service.resolve(TbxMatSeverityLevel.Information), service.resolve(TbxMatSeverityLevel.Help)];

            for (const name of results) {
                expect(name).toBeTypeOf('string');
                expect(name!.length).toBeGreaterThan(0);
            }

            expect(new Set(results).size).toBe(results.length);
        });

        it('should return undefined for unknown keys', () => {
            expect(service.resolve('unknown')).toBeUndefined();
        });
    });
});
