import { Injectable } from '@angular/core';
import { TBX_MAT_SEVERITY_DEFAULT_SVG_ICONS, TbxMatSeveritySvgIconService, TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';

/**
 * Default SVG-based severity banner icon service
 *
 * @remarks
 * Extends `TbxMatSeveritySvgIconService` from `@teqbench/tbx-mat-severity-theme`
 * and registers the shared default SVG icons (`TBX_MAT_SEVERITY_DEFAULT_SVG_ICONS`)
 * for every severity level. The inherited `resolve()` and severity methods
 * (`default()`, `success()`, `error()`, etc.) work via the registered mappings.
 *
 * Default icons ship with `@teqbench/tbx-mat-severity-theme`. Subclasses
 * can override any default by overriding `initialize()` and calling
 * `register()` with the same key and different SVG markup.
 *
 * @example Using the defaults directly:
 * ```typescript
 * // app.config.ts
 * import { TBX_MAT_BANNER_PROVIDER_CONFIG, TbxMatBannerSeveritySvgIconService }
 *     from '@teqbench/tbx-mat-banners';
 *
 * providers: [
 *     {
 *         provide: TBX_MAT_BANNER_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatBannerSeveritySvgIconService(),
 *         }),
 *     },
 * ]
 * ```
 *
 * @example Subclassing with custom SVG markup:
 * ```typescript
 * import { Injectable } from '@angular/core';
 * import { TbxMatBannerSeveritySvgIconService } from '@teqbench/tbx-mat-banners';
 * import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';
 *
 * // MyBannerSvgIcons is a consumer-defined subclass
 * @Injectable()
 * export class MyBannerSvgIcons extends TbxMatBannerSeveritySvgIconService {
 *     protected override initialize(): void {
 *         super.initialize();
 *         this.register(TbxMatSeverityLevel.Success, '<svg>...</svg>');
 *     }
 * }
 * ```
 *
 * @category Services
 * @displayName Severity SVG Icon Service
 * @order 3
 * @since 1.0.0
 * @related TBX_MAT_BANNER_PROVIDER_CONFIG
 * @related TbxMatBannerSeverityFontIconService
 *
 * @public
 */
@Injectable()
export class TbxMatBannerSeveritySvgIconService extends TbxMatSeveritySvgIconService {
    /**
     * Register the shared default SVG icons for every severity level
     *
     * @remarks
     * Iterates `TBX_MAT_SEVERITY_DEFAULT_SVG_ICONS` from
     * `@teqbench/tbx-mat-severity-theme`, registering each level's SVG markup.
     * Subclasses can override any of these defaults by calling `register()`
     * with the same key and different SVG markup.
     *
     * @internal
     */
    protected override initialize(): void {
        super.initialize();
        for (const level of Object.values(TbxMatSeverityLevel)) {
            this.register(level, TBX_MAT_SEVERITY_DEFAULT_SVG_ICONS[level]);
        }
    }
}
