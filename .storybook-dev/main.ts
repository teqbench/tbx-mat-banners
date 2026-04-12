import type { StorybookConfig } from '@analogjs/storybook-angular';
import { baseConfig } from '../.storybook-config/main.base.ts';

/**
 * Development Storybook — development-facing harnesses colocated with the
 * components they exercise under `src/components/`. Includes component-level
 * stories that are useful while implementing the library but are not intended
 * for end-consumer documentation.
 */
const config: StorybookConfig = {
    ...baseConfig,
    stories: ['../src/components/**/*.stories.@(ts|mdx)'],
    core: {
        ...baseConfig.core,
        builder: {
            name: '@storybook/builder-vite',
            options: {
                viteConfigPath: '.storybook-config/vite.config.ts',
            },
        },
    },
};

export default config;
