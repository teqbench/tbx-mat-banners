import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideTbxMatSeverityTheme } from '@teqbench/tbx-mat-severity-theme';
import { BannerOverlayHarnessComponent, DEFAULT_OVERLAY_ARGS, SHARED_OVERLAY_ARG_TYPES } from './banner-overlay.stories.common';

const meta: Meta<BannerOverlayHarnessComponent> = {
    title: 'Banners/Overlay',
    component: BannerOverlayHarnessComponent,
    decorators: [moduleMetadata({ imports: [BannerOverlayHarnessComponent] })],
    argTypes: SHARED_OVERLAY_ARG_TYPES,
};

export default meta;
type Story = StoryObj<BannerOverlayHarnessComponent>;

export const Default: Story = {
    args: { ...DEFAULT_OVERLAY_ARGS },
};

export const Inverted: Story = {
    args: { ...DEFAULT_OVERLAY_ARGS },
    decorators: [
        applicationConfig({
            providers: [provideTbxMatSeverityTheme({ invert: true, applyToRoot: true })],
        }),
    ],
    parameters: {
        docs: {
            description: {
                story: 'Inverted severity palette — white backgrounds with colored text. Wired via `provideTbxMatSeverityTheme({ invert: true, applyToRoot: true })` at bootstrap. The inversion is app-global: banners, notifications, and dialogs consuming the same shared theme invert simultaneously.',
            },
        },
    },
};
