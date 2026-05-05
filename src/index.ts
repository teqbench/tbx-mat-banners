/**
 * Severity-styled banners with inline and overlay display for {@link https://angular.dev | Angular}
 *
 * @remarks
 * An opinionated banner component and service providing severity-leveled methods,
 * inline or overlay display via {@link https://material.angular.dev/cdk/overlay/api | CDK Overlay},
 * FIFO queuing with signal-based state, indefinite duration by default, an actions group
 * supporting buttons and form controls, optional severity icon and close button,
 * and dismiss reason tracking with collected control values.
 *
 * Key exports:
 *
 * - {@link TbxMatBannerService} — inject and call success/error/warning/information/help/default for overlay banners.
 * - {@link TbxMatBannerComponent} — standalone component for inline or overlay display.
 * - {@link TbxMatBannerRef} — returned from service methods with config and result promise.
 * - {@link TbxMatBannerResult} — dismiss result with reason, action key, and collected form values.
 * - {@link TbxMatBannerDismissReason} — enum of dismiss reasons (Action, Close, Timeout, etc.).
 * - {@link TbxMatBannerAnimation} — enum of overlay animation modes (None, Slide, Fade).
 * - {@link TbxMatBannerConfig} — full config interface for show().
 * - {@link TbxMatBannerConfigArgs} — optional config for convenience methods.
 * - {@link TbxMatBannerActionsGroupControl} — discriminated union of all action control types.
 * - {@link TbxMatBannerActionButton} — button control in the actions group.
 * - {@link TbxMatBannerActionCheckbox} — checkbox control in the actions group.
 * - {@link TbxMatBannerActionToggle} — toggle control in the actions group.
 * - {@link TbxMatBannerActionRadioGroup} — radio group control in the actions group.
 * - {@link TbxMatBannerActionToggleGroup} — toggle group control in the actions group.
 * - {@link TbxMatBannerRadioOption} — option entry for radio group controls.
 * - {@link TbxMatBannerToggleOption} — option entry for toggle group controls.
 * - {@link TbxMatBannerProviderConfig} — icon provider config interface.
 * - {@link TBX_MAT_BANNER_PROVIDER_CONFIG} — injection token for provider configuration.
 * - {@link TbxMatBannerSeverityFontIconService} — default font-based severity icon service.
 * - {@link TbxMatBannerSeveritySvgIconService} — default SVG-based severity icon service.
 * - {@link TbxMatBannerCloseFontIconService} — default font-based close icon service.
 * - {@link TbxMatBannerActionButtonAppearance} — button appearance type.
 * - {@link TbxMatBannerIconResolver} — icon resolver shape combined with the resolved icon's type.
 *
 * @see {@link https://angular.dev | Angular}
 * @see {@link https://material.angular.dev | Angular Material}
 *
 * @packageDocumentation
 */

// Enums
export { TbxMatBannerAnimation } from './enums/banner-animation.enum';
export { TbxMatBannerDismissReason } from './enums/banner-dismiss-reason.enum';

// Types
export type { TbxMatBannerConfigArgs } from './types/banner-config-args.type';
export type { TbxMatBannerActionButtonAppearance } from './types/banner-action-button-appearance.type';
export type { TbxMatBannerActionsGroupControl } from './types/banner-actions-group-control.type';
export type { TbxMatBannerIconResolver } from './types/banner-icon-resolver.type';

// Models
export type { TbxMatBannerConfig } from './models/banner-config.model';
export type { TbxMatBannerProviderConfig } from './models/banner-provider-config.model';
export type { TbxMatBannerActionButton } from './models/banner-action-button.model';
export type { TbxMatBannerActionCheckbox } from './models/banner-action-checkbox.model';
export type { TbxMatBannerActionToggle } from './models/banner-action-toggle.model';
export type { TbxMatBannerActionRadioGroup, TbxMatBannerRadioOption } from './models/banner-action-radio-group.model';
export type { TbxMatBannerActionToggleGroup, TbxMatBannerToggleOption } from './models/banner-action-toggle-group.model';
export type { TbxMatBannerRef } from './models/banner-ref.model';
export type { TbxMatBannerResult } from './models/banner-result.model';

// Tokens
export { TBX_MAT_BANNER_PROVIDER_CONFIG } from './tokens/banner-provider-config.token';

// Components
export { TbxMatBannerComponent } from './components/banner.component';

// Services
export { TbxMatBannerService } from './services/banner.service';
export { TbxMatBannerSeverityFontIconService } from './services/banner-severity-font-icon.service';
export { TbxMatBannerSeveritySvgIconService } from './services/banner-severity-svg-icon.service';
export { TbxMatBannerCloseFontIconService } from './services/banner-close-font-icon.service';
