import type { StorybookConfig } from '@analogjs/storybook-angular';

/**
 * Shared Storybook main config fragments used by both the dev and docs
 * Storybook instances. Each instance spreads this into its own `StorybookConfig`
 * and adds its own `stories` glob and any instance-specific addons.
 */
export const baseConfig: Omit<StorybookConfig, 'stories'> & { features?: Record<string, boolean> } = {
    addons: [],
    features: {
        actions: false,
        interactions: false,
        measure: false,
        outline: false,
    },
    framework: {
        name: '@analogjs/storybook-angular',
        options: {},
    },
    core: {
        disableTelemetry: true,
        disableWhatsNewNotifications: true,
    },
};
