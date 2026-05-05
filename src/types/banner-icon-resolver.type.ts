import { type TbxMatIconResolver, type TbxMatIconType } from '@teqbench/tbx-mat-icons';

/**
 * Icon resolver that also exposes the resolved icon's type
 *
 * @remarks
 * Combines {@link https://github.com/teqbench/tbx-mat-icons | TbxMatIconResolver}
 * with the static `iconType` property the banner template needs to decide
 * whether to render a font ligature or an SVG element.
 *
 * @category Types
 * @displayName Banner Icon Resolver
 * @order 4
 * @since 1.0.0
 *
 * @public
 */
export type TbxMatBannerIconResolver = TbxMatIconResolver<string> & {
    readonly iconType: TbxMatIconType;
};
