import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ACTIONS_ARG_TYPES, BannerActionsHarnessComponent, DEFAULT_ACTIONS_ARGS } from '../../components/banner-actions-group.stories.common';

const INSTRUCTIONS = 'Overlay banners with an actions group. The actions group is an array of control descriptors on the actionsGroup config option: button (dismisses with a key), checkbox, toggle, radio-group, and toggle-group (form values collected into actionsGroupValues on the dismiss result). Use the trigger buttons to fire each example, and the Controls panel to tweak severity, position, animation, visibility flags, duration, and icon size/animation across all demos.';

const meta: Meta<BannerActionsHarnessComponent> = {
    title: 'Banners',
    tags: ['banners'],
    component: BannerActionsHarnessComponent,
    decorators: [moduleMetadata({ imports: [BannerActionsHarnessComponent] })],
    argTypes: ACTIONS_ARG_TYPES,
};

export default meta;
type Story = StoryObj<BannerActionsHarnessComponent>;

export const OverlaysActions: Story = {
    name: 'Overlays + Actions',
    args: { ...DEFAULT_ACTIONS_ARGS, description: INSTRUCTIONS },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates every actions-group variant on a single page. Severity, position, animation, visibility flags, duration, and icon controls are all live in the Controls panel.',
            },
        },
    },
};
