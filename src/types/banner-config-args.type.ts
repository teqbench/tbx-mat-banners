import { type TbxMatBannerConfig } from '../models/banner-config.model';

/**
 * Optional configuration overrides for the convenience banner methods
 *
 * @remarks
 * Derived from {@link TbxMatBannerConfig} with `type` and `message`
 * omitted — those are set automatically by the convenience method and its
 * `message` argument respectively.
 *
 * The convenience methods on {@link TbxMatBannerService} (`success()`,
 * `error()`, `warning()`, `information()`, `help()`, `default()`) accept
 * this type as an optional second argument to override duration, actions
 * group, and visibility options.
 *
 * @example Override duration and add actions group:
 * ```typescript
 * this.banner.success('Item deleted.', {
 *     duration: 30_000,
 *     actionsGroup: [{ type: 'button', key: 'undo', label: 'Undo' }],
 * });
 * ```
 *
 * @example Hide severity icon:
 * ```typescript
 * this.banner.warning('Low disk space.', { showSeverityIcon: false });
 * ```
 *
 * @category Types
 * @displayName Banner Config Args
 * @order 3
 * @since 1.0.0
 * @related TbxMatBannerConfig
 * @related TbxMatBannerService
 *
 * @public
 */
export type TbxMatBannerConfigArgs = Omit<TbxMatBannerConfig, 'type' | 'message'>;
