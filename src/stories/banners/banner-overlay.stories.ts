import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideTbxMatSeverityTheme } from '@teqbench/tbx-mat-severity-theme';
import { BannerOverlayHarnessComponent, DEFAULT_OVERLAY_ARGS, SHARED_OVERLAY_ARG_TYPES, withSvgIcons } from '../../components/banner-overlay.stories.common';

const INSTRUCTIONS = 'Overlay banners display pinned at the top or bottom of the viewport via CDK Overlay. Lifecycle is managed by TbxMatBannerService — call banner.success(...) / banner.error(...) etc. Banners queue FIFO and one shows at a time. Use the Controls panel to tweak position, enter/exit animation, severity icon visibility, close button visibility, auto-dismiss duration, icon size, and icon animation.';

const meta: Meta<BannerOverlayHarnessComponent> = {
    title: 'Banners',
    tags: ['banners'],
    component: BannerOverlayHarnessComponent,
    decorators: [moduleMetadata({ imports: [BannerOverlayHarnessComponent] })],
    argTypes: SHARED_OVERLAY_ARG_TYPES,
};

export default meta;
type Story = StoryObj<BannerOverlayHarnessComponent>;

export const Overlays: Story = {
    args: { ...DEFAULT_OVERLAY_ARGS, description: INSTRUCTIONS },
    decorators: [
        applicationConfig({
            providers: [provideTbxMatSeverityTheme({ invert: false, applyToRoot: true })],
        }),
    ],
    parameters: {
        docs: {
            description: {
                story: 'Standard severity palette with the default Material Symbols font icons — colored backgrounds, white text.',
            },
        },
    },
};

export const OverlaysSvgIcons: Story = {
    name: 'Overlays (SVG Icons)',
    args: { ...DEFAULT_OVERLAY_ARGS, description: INSTRUCTIONS },
    argTypes: {
        ...SHARED_OVERLAY_ARG_TYPES,
        iconAnimation: { table: { disable: true }, control: false },
    },
    decorators: [
        applicationConfig({
            providers: [provideTbxMatSeverityTheme({ invert: false, applyToRoot: true })],
        }),
        withSvgIcons(),
    ],
    parameters: {
        docs: {
            description: {
                story: 'Standard severity palette with the default SVG icons shipped by `@teqbench/tbx-mat-severity-theme` (registered via `TbxMatBannerSeveritySvgIconService`). Icon animation is font-icon only and does not apply here.',
            },
        },
    },
};

export const Inverted: Story = {
    args: { ...DEFAULT_OVERLAY_ARGS, description: INSTRUCTIONS },
    decorators: [
        applicationConfig({
            providers: [provideTbxMatSeverityTheme({ invert: true, applyToRoot: true })],
        }),
    ],
    parameters: {
        docs: {
            description: {
                story: 'Inverted severity palette — white backgrounds with colored text. Wired via `provideTbxMatSeverityTheme({ invert: true })` at bootstrap. The inversion is app-global: notifications and dialogs consuming the same shared theme invert simultaneously.',
            },
        },
    },
};

export const InvertedSvgIcons: Story = {
    name: 'Inverted (SVG Icons)',
    args: { ...DEFAULT_OVERLAY_ARGS, description: INSTRUCTIONS },
    argTypes: {
        ...SHARED_OVERLAY_ARG_TYPES,
        iconAnimation: { table: { disable: true }, control: false },
    },
    decorators: [
        applicationConfig({
            providers: [provideTbxMatSeverityTheme({ invert: true, applyToRoot: true })],
        }),
        withSvgIcons(),
    ],
    parameters: {
        docs: {
            description: {
                story: 'Inverted severity palette with the default SVG icons from `@teqbench/tbx-mat-severity-theme`. Icon animation is font-icon only and does not apply here.',
            },
        },
    },
};
