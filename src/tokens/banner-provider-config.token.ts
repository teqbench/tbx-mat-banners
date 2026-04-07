import { InjectionToken } from '@angular/core';
import type { TbxMatBannerProviderConfig } from '../models/banner-provider-config.model';

/**
 * Injection token for banner component icon configuration
 *
 * @remarks
 * **Required.** Provide in `app.config.ts` to configure the severity icon
 * resolver service and the close button icon. Use
 * {@link TbxMatBannerSeverityFontIconService} for font icons or
 * {@link TbxMatBannerSeveritySvgIconService} for SVG icons — both ship
 * with sensible defaults.
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
 * @example Font icons with MAT_ICON_DEFAULT_OPTIONS (no explicit fontSet):
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
 * @example With a custom close icon resolver:
 * ```typescript
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
 * @category Tokens
 * @displayName Banner Provider Config Token
 * @since 1.0.0
 * @related TbxMatBannerProviderConfig
 * @related TbxMatBannerSeverityFontIconService
 * @related TbxMatBannerSeveritySvgIconService
 *
 * @public
 */
export const TBX_MAT_BANNER_PROVIDER_CONFIG = new InjectionToken<TbxMatBannerProviderConfig>('TBX_MAT_BANNER_PROVIDER_CONFIG');
