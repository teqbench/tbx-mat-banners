import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BannerOverlayHarnessComponent, DEFAULT_OVERLAY_ARGS, SHARED_OVERLAY_ARG_TYPES, withSvgIcons } from './banner-overlay.stories.common';

const meta: Meta<BannerOverlayHarnessComponent> = {
    title: 'Banners/Overlay SVG Icons',
    component: BannerOverlayHarnessComponent,
    decorators: [moduleMetadata({ imports: [BannerOverlayHarnessComponent] }), withSvgIcons()],
    argTypes: {
        ...SHARED_OVERLAY_ARG_TYPES,
        // Icon animation uses the Material Symbols FILL axis (font-only),
        // so it doesn't apply to the SVG variant.
        iconAnimation: { table: { disable: true }, control: false },
    },
};

export default meta;
type Story = StoryObj<BannerOverlayHarnessComponent>;

export const Default: Story = {
    name: 'SVG Icons',
    args: { ...DEFAULT_OVERLAY_ARGS },
    parameters: {
        docs: {
            description: {
                story: 'Standard severity palette with the default SVG icons shipped by `@teqbench/tbx-mat-severity-theme` (registered via `TbxMatBannerSeveritySvgIconService`). Use the **Icon Size** control to compare scaling against the font variant.',
            },
        },
    },
};
