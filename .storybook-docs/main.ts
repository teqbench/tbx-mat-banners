import type { StorybookConfig } from '@analogjs/storybook-angular';
import { baseConfig } from '../.storybook-config/main.base.ts';

/**
 * Documentation Storybook — consumer-facing demos intended for publication
 * (GitHub Pages) and for embedding in the teqbench.website package pages.
 * Stories live under `src/stories/` and each one is a self-contained, narrated
 * harness with richer inline explanations.
 */
const config: StorybookConfig = {
    ...baseConfig,
    stories: ['../src/stories/**/*.stories.@(ts|mdx)'],
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
