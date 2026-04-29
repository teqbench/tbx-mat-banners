import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ACTIONS_ARG_TYPES, BannerActionsHarnessComponent, DEFAULT_ACTIONS_ARGS, type Severity } from './banner-actions-group.stories.common';

const meta: Meta<BannerActionsHarnessComponent> = {
    title: 'Banners/Overlay Actions Group',
    component: BannerActionsHarnessComponent,
    decorators: [moduleMetadata({ imports: [BannerActionsHarnessComponent] })],
    argTypes: ACTIONS_ARG_TYPES,
};

export default meta;
type Story = StoryObj<BannerActionsHarnessComponent>;

const SEVERITIES: { name: string; severity: Severity }[] = [
    { name: 'Default', severity: 'default' },
    { name: 'Success', severity: 'success' },
    { name: 'Error', severity: 'error' },
    { name: 'Warning', severity: 'warning' },
    { name: 'Information', severity: 'information' },
    { name: 'Help', severity: 'help' },
];

const stories = Object.fromEntries(
    SEVERITIES.map(({ name, severity }) => [
        name,
        {
            name,
            args: { ...DEFAULT_ACTIONS_ARGS, severity },
        } satisfies Story,
    ])
);

export const Default: Story = stories['Default']!;
export const Success: Story = stories['Success']!;
export const Error: Story = stories['Error']!;
export const Warning: Story = stories['Warning']!;
export const Information: Story = stories['Information']!;
export const Help: Story = stories['Help']!;
