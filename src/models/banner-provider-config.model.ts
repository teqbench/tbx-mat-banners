import { type TbxMatIconResolver, type TbxMatIconType } from '@teqbench/tbx-mat-icons';
import type { TbxMatSeverityResolver, TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';

import { type TbxMatBannerAnimation } from '../enums/banner-animation.enum';

/**
 * Configuration for the banner component's injectable dependencies
 *
 * @remarks
 * Provided via the {@link TBX_MAT_BANNER_PROVIDER_CONFIG} injection token
 * in `app.config.ts`. Groups all banner icon customization into a single
 * provider entry.
 *
 * #### Properties
 *
 * - **`severityIconResolverService`** — resolves severity levels to icon identifiers. Must
 *   implement `TbxMatIconResolver` from `@teqbench/tbx-mat-icons`. Use
 *   {@link TbxMatBannerSeverityFontIconService} for font icons or
 *   {@link TbxMatBannerSeveritySvgIconService} for SVG icons.
 *
 * - **`closeIconResolverService`** (optional) — resolves the close button icon.
 *   When omitted, the package provides a default font-based resolver
 *   ({@link TbxMatBannerCloseFontIconService}) that registers the `'close'`
 *   {@link https://fonts.google.com/icons | Material Symbols} ligature.
 *
 * @example Font icons with explicit fontSet:
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
 * @example With custom close icon:
 * ```typescript
 * // app.config.ts
 * import { TBX_MAT_BANNER_PROVIDER_CONFIG, TbxMatBannerSeverityFontIconService }
 *     from '@teqbench/tbx-mat-banners';
 *
 * providers: [
 *     {
 *         provide: TBX_MAT_BANNER_PROVIDER_CONFIG,
 *         // MyCloseIconService is a hypothetical consumer-defined close icon resolver
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatBannerSeverityFontIconService('material-symbols-rounded'),
 *             closeIconResolverService: new MyCloseIconService('material-symbols-rounded'),
 *         }),
 *     },
 * ]
 * ```
 *
 * @category Models
 * @category Interface
 * @displayName Banner Provider Config
 * @order 11
 * @since 1.0.0
 * @related TBX_MAT_BANNER_PROVIDER_CONFIG
 * @related TbxMatBannerSeverityFontIconService
 * @related TbxMatBannerSeveritySvgIconService
 * @related TbxMatBannerCloseFontIconService
 *
 * @public
 */
export interface TbxMatBannerProviderConfig {
    /**
     * Severity icon resolver — maps severity levels to icon identifiers
     *
     * @public
     */
    readonly severityIconResolverService: TbxMatSeverityResolver &
        TbxMatIconResolver<TbxMatSeverityLevel> & {
            readonly iconType: TbxMatIconType;
        };

    /**
     * Close button icon resolver — resolves the close/dismiss button icon
     *
     * @remarks
     * Must implement `TbxMatIconResolver<string>` and expose `iconType`.
     * When omitted, the package provides a default font-based resolver
     * ({@link TbxMatBannerCloseFontIconService}) that registers the
     * `'close'` {@link https://fonts.google.com/icons | Material Symbols}
     * ligature. Consumers who want SVG close icons must provide a custom
     * resolver.
     *
     * @public
     */
    readonly closeIconResolverService?: TbxMatIconResolver<string> & {
        readonly iconType: TbxMatIconType;
    };

    /**
     * Default enter/exit animation mode for overlay banners
     *
     * @remarks
     * Applied when a per-banner {@link TbxMatBannerConfig.animation} is not
     * set. A per-banner value always wins over this default. When both are
     * omitted, animations are disabled
     * ({@link TbxMatBannerAnimation.None}).
     *
     * @public
     */
    readonly defaultAnimation?: TbxMatBannerAnimation;
}
