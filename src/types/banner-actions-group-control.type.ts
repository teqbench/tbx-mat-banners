import { type TbxMatBannerActionButton } from '../models/banner-action-button.model';
import { type TbxMatBannerActionCheckbox } from '../models/banner-action-checkbox.model';
import { type TbxMatBannerActionToggle } from '../models/banner-action-toggle.model';
import { type TbxMatBannerActionRadioGroup } from '../models/banner-action-radio-group.model';
import { type TbxMatBannerActionToggleGroup } from '../models/banner-action-toggle-group.model';

/**
 * Discriminated union of all banner actions group control types
 *
 * @remarks
 * Each control in a banner's `actionsGroup` array must be one of these types.
 * The `type` property serves as the discriminant for type narrowing in
 * `@switch` blocks and conditional logic.
 *
 * Controls are rendered in the slot between the banner's message and close
 * button, in array order.
 *
 * - `'button'` — {@link TbxMatBannerActionButton} — clickable button that dismisses the banner
 * - `'checkbox'` — {@link TbxMatBannerActionCheckbox} — boolean checkbox control
 * - `'toggle'` — {@link TbxMatBannerActionToggle} — slide toggle control
 * - `'radio-group'` — {@link TbxMatBannerActionRadioGroup} — single-select radio group
 * - `'toggle-group'` — {@link TbxMatBannerActionToggleGroup} — button toggle group (single or multi-select)
 *
 * @usage
 * Use this type when declaring the `actionsGroup` array on
 * {@link TbxMatBannerConfig} to ensure type safety across all control types.
 *
 * @example
 * ```typescript
 * const actionsGroup: TbxMatBannerActionsGroupControl[] = [
 *     { type: 'checkbox', key: 'dontShowAgain', label: "Don't show again" },
 *     { type: 'button', key: 'dismiss', label: 'Dismiss' },
 *     { type: 'button', key: 'retry', label: 'Retry', appearance: 'filled' },
 * ];
 * ```
 *
 * @category Types
 * @displayName Banner Actions Group Control
 * @order 2
 * @since 1.0.0
 * @related TbxMatBannerActionButton
 * @related TbxMatBannerActionCheckbox
 * @related TbxMatBannerActionToggle
 * @related TbxMatBannerActionRadioGroup
 * @related TbxMatBannerActionToggleGroup
 * @related TbxMatBannerConfig
 *
 * @public
 */
export type TbxMatBannerActionsGroupControl = TbxMatBannerActionButton | TbxMatBannerActionCheckbox | TbxMatBannerActionToggle | TbxMatBannerActionRadioGroup | TbxMatBannerActionToggleGroup;
