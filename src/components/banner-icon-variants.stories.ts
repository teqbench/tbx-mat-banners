import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BannerOverlayHarnessComponent, DEFAULT_OVERLAY_ARGS, SHARED_OVERLAY_ARG_TYPES } from './banner-overlay.stories.common';

const meta: Meta<BannerOverlayHarnessComponent> = {
    title: 'Banners/Overlay Font Icon Variants',
    component: BannerOverlayHarnessComponent,
    decorators: [moduleMetadata({ imports: [BannerOverlayHarnessComponent] })],
    argTypes: SHARED_OVERLAY_ARG_TYPES,
};

export default meta;
type Story = StoryObj<BannerOverlayHarnessComponent>;

export const Default: Story = {
    name: 'Font Icon Variants',
    args: { ...DEFAULT_OVERLAY_ARGS },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates the Material Symbols font icon size and animation knobs. Use the **Icon Size** and **Icon Animation** controls to compare standard / medium / large with `none`, `state-transition` (fill on enter), and `pulse`. Effects target the snackbar overlay container and the `.tbx-mat-banner-icon` element.',
            },
        },
    },
};
