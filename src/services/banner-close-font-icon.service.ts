import { Injectable } from '@angular/core';
import { TbxMatFontIconService } from '@teqbench/tbx-mat-icons';

/**
 * Default font-based close button icon service
 *
 * @remarks
 * Extends `TbxMatFontIconService` from `@teqbench/tbx-mat-icons` and registers
 * the `'close'` {@link https://fonts.google.com/icons | Material Symbols} ligature.
 * Used as the package-provided default for
 * {@link TbxMatBannerProviderConfig.closeIconResolverService} when the
 * consumer does not supply a custom close icon resolver.
 *
 * No default SVG close icon service is provided. Consumers who want SVG
 * close icons must create a concrete subclass of `TbxMatSvgIconService`
 * from `@teqbench/tbx-mat-icons` and provide it via
 * {@link TbxMatBannerProviderConfig.closeIconResolverService}.
 *
 * #### fontSet resolution
 *
 * The fontSet is resolved by `TbxMatFontIconService`'s fallback chain:
 *
 * 1. **Explicit constructor argument** — `new TbxMatBannerCloseFontIconService('material-symbols-sharp')`
 * 2. **`TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` token** — set once in `app.config.ts`
 * 3. **`MAT_ICON_DEFAULT_OPTIONS.fontSet`** —
 *    {@link https://material.angular.dev/components/icon/api | Angular Material}'s global icon default
 * 4. **Error** — if none of the above provides a fontSet
 *
 * @example Using with MAT_ICON_DEFAULT_OPTIONS:
 * ```typescript
 * // app.config.ts — no explicit close icon service needed, package default used
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
 *             // closeIconResolverService omitted — package default (TbxMatBannerCloseFontIconService) used
 *         }),
 *     },
 * ]
 * ```
 *
 * @category Services
 * @displayName Close Font Icon Service
 * @order 4
 * @since 1.0.0
 * @related TbxMatBannerProviderConfig
 * @related TbxMatBannerSeverityFontIconService
 *
 * @public
 */
@Injectable()
export class TbxMatBannerCloseFontIconService extends TbxMatFontIconService<string> {
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
     * Register the default close icon ligature
     *
     * @remarks
     * Registers the `'close'`
     * {@link https://fonts.google.com/icons | Material Symbols} ligature
     * under the key `'close'`. Subclasses can override by calling
     * `register('close', 'different_ligature')`.
     *
     * @internal
     */
    protected override initialize(): void {
        super.initialize();
        this.register('close', 'close');
    }
}
