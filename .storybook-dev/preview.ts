import type { Preview } from '@storybook/angular';
import { basePreview } from '../.storybook-config/preview.base.ts';
import { removeStoryOverrideStyleTag } from '../src/components/story-overrides';

/**
 * Development preview — extends the shared base and adds the
 * `removeStoryOverrideStyleTag` decorator that clears any story-specific
 * document-level style overrides between navigations. The dev stories inject
 * one-off overrides at document scope to pierce CDK overlay encapsulation;
 * this decorator prevents those overrides from leaking across stories.
 */
const preview: Preview = {
    ...basePreview,
    decorators: [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (story: () => any) => {
            removeStoryOverrideStyleTag();
            return story();
        },
        ...(basePreview.decorators ?? []),
    ],
    parameters: {
        ...basePreview.parameters,
        options: {
            storySort: {
                order: ['Banners', ['Overlay']],
            },
        },
    },
};

export default preview;
