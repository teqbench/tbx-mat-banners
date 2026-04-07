import { InjectionToken } from '@angular/core';
import type { BannerDataDto } from '../models/banner-data-dto.model';

/**
 * Internal injection token for passing banner data to the component in overlay mode
 *
 * @remarks
 * Not part of the public API. Used by {@link TbxMatBannerService} to inject
 * the resolved {@link BannerDataDto} into {@link TbxMatBannerComponent} when
 * the component is created via CDK Overlay.
 *
 * @internal
 */
export const TBX_MAT_BANNER_DATA = new InjectionToken<BannerDataDto>('TBX_MAT_BANNER_DATA');
