/**
 * Enter/exit animation mode for overlay banners
 *
 * @remarks
 * Controls the motion applied to an overlay banner as it appears and
 * disappears. Values map to CSS classes defined in
 * `src/styles/_tbx-mat-banners.scss` that drive keyframe animations
 * on the {@link https://material.angular.dev/cdk/overlay/api | CDK Overlay}
 * panel:
 *
 * - `None` — no animation. The banner appears and disappears instantly.
 * - `Slide` — slides in from the closest viewport edge based on
 *   {@link TbxMatBannerConfig.verticalPosition}, and slides out the
 *   same way on dismiss.
 * - `Fade` — fades in and out via opacity.
 *
 * Consumers can tune motion timing via four CSS custom properties:
 * `--tbx-mat-banner-anim-enter-duration`, `--tbx-mat-banner-anim-enter-easing`,
 * `--tbx-mat-banner-anim-exit-duration`, and `--tbx-mat-banner-anim-exit-easing`.
 * Animations are automatically disabled when the user has
 * `prefers-reduced-motion: reduce` set at the OS level.
 *
 * @usage
 * Set per banner via {@link TbxMatBannerConfig.animation}, or set an
 * application-wide default via
 * {@link TbxMatBannerProviderConfig.defaultAnimation}. A per-banner value
 * always wins over the provider default.
 *
 * @example
 * ```typescript
 * this.banner.success('Saved.', { animation: TbxMatBannerAnimation.Slide });
 * ```
 *
 * @category Enums
 * @displayName Banner Animation
 * @order 2
 * @since 1.0.0
 * @related TbxMatBannerConfig
 * @related TbxMatBannerProviderConfig
 *
 * @public
 */
export enum TbxMatBannerAnimation {
    /**
     * No animation — banner appears and disappears instantly
     *
     * @public
     */
    None = 'none',

    /**
     * Slide in from, and out to, the closest viewport edge
     *
     * @remarks
     * Direction is determined by {@link TbxMatBannerConfig.verticalPosition}.
     *
     * @public
     */
    Slide = 'slide',

    /**
     * Fade in and out via opacity
     *
     * @public
     */
    Fade = 'fade',
}
