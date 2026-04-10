import type { TbxMatBannerActionButtonAppearance } from '../types/banner-action-button-appearance.type';

/**
 * Banner system constants.
 *
 * Centralizes timing and action defaults for banners.
 * These values are used internally by {@link TbxMatBannerService}
 * and are not exported from the public API. Consumers override per-call
 * via {@link TbxMatBannerConfig}.
 */

/**
 * Default duration when no duration is specified (milliseconds)
 *
 * @remarks
 * Used when {@link TbxMatBannerConfig.duration} is omitted.
 * Banners default to indefinite (0) — they remain visible until
 * dismissed by a user action or programmatically.
 *
 * @internal
 */
export const BANNER_DEFAULT_DURATION_MS = 0;

/**
 * Default action button appearance when not specified per-button
 *
 * @remarks
 * `'text'` is the lowest-emphasis button style, appropriate as a
 * default in contexts where the severity panel styling provides
 * the primary visual differentiation.
 *
 * @internal
 */
export const BANNER_DEFAULT_ACTION_BUTTON_APPEARANCE: TbxMatBannerActionButtonAppearance = 'text';
