import { Injectable } from '@angular/core';
import {
    TbxMatSeverityFontIconService,
    TbxMatSeverityLevel,
} from '@teqbench/tbx-mat-severity-icons';

/**
 * Default font-based severity banner icon service
 *
 * @remarks
 * Extends `TbxMatSeverityFontIconService` from `@teqbench/tbx-mat-severity-icons`
 * and registers {@link https://fonts.google.com/icons | Material Symbols} ligatures
 * for each severity level. The inherited `resolve()` and severity
 * methods (`success()`, `error()`, etc.) work via the registered mappings.
 *
 * ### fontSet resolution
 *
 * The fontSet is resolved by `TbxMatFontIconService`'s fallback chain:
 *
 * 1. **Explicit constructor argument** — `new TbxMatBannerSeverityFontIconService('material-symbols-sharp')`
 * 2. **`TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` token** — set once in `app.config.ts`
 * 3. **`MAT_ICON_DEFAULT_OPTIONS.fontSet`** —
 *    {@link https://material.angular.dev/components/icon/api | Angular Material}'s global icon default
 * 4. **Error** — if none of the above provides a fontSet
 *
 * @example Using with MAT_ICON_DEFAULT_OPTIONS:
 * ```typescript
 * // app.config.ts
 * import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
 * import { TBX_MAT_BANNER_PROVIDER_CONFIG, TbxMatBannerSeverityFontIconService }
 *     from '@teqbench/tbx-mat-banners';
 *
 * providers: [
 *     { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-rounded' } },
 *     {
 *         provide: TBX_MAT_BANNER_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatBannerSeverityFontIconService(),
 *         }),
 *     },
 * ]
 * ```
 *
 * @example Using with an explicit fontSet:
 * ```typescript
 * // app.config.ts
 * import { TBX_MAT_BANNER_PROVIDER_CONFIG, TbxMatBannerSeverityFontIconService }
 *     from '@teqbench/tbx-mat-banners';
 *
 * providers: [
 *     {
 *         provide: TBX_MAT_BANNER_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatBannerSeverityFontIconService('material-symbols-rounded'),
 *         }),
 *     },
 * ]
 * ```
 *
 * @category Services
 * @since 1.0.0
 * @related TBX_MAT_BANNER_PROVIDER_CONFIG
 * @related TbxMatBannerSeveritySvgIconService
 *
 * @public
 */
@Injectable()
export class TbxMatBannerSeverityFontIconService extends TbxMatSeverityFontIconService {
    /**
     * @param fontSet - Optional fontSet identifier (e.g., `'material-symbols-rounded'`).
     *                  When provided, takes precedence over all global defaults.
     *                  When omitted, falls back to `TBX_MAT_FONT_ICON_DEFAULT_FONT_SET`,
     *                  then `MAT_ICON_DEFAULT_OPTIONS.fontSet`.
     */
    constructor(fontSet?: string) {
        super(fontSet);
    }

    /**
     * Register default {@link https://fonts.google.com/icons | Material Symbols}
     * ligature names for each severity level
     *
     * @remarks
     * These work with any {@link https://fonts.google.com/icons | Material Symbols}
     * font variant (outlined, rounded, sharp) since the ligature names are consistent
     * across variants. Subclasses can override any of these defaults by calling
     * `register()` with the same key and a different ligature.
     *
     * @internal
     */
    protected override initialize(): void {
        super.initialize();
        this.register(TbxMatSeverityLevel.Success, 'check_circle');
        this.register(TbxMatSeverityLevel.Error, 'error');
        this.register(TbxMatSeverityLevel.Warning, 'warning_amber');
        this.register(TbxMatSeverityLevel.Information, 'info');
        this.register(TbxMatSeverityLevel.Help, 'help');
    }
}
