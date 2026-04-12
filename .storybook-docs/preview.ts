import type { Preview } from '@storybook/angular';
import { basePreview } from '../.storybook-config/preview.base.ts';

/**
 * Documentation preview — extends the shared base with a narrative story sort
 * order (simple → complex → customization) and opens stories in `docs` view
 * mode so the published site renders the autodocs page by default.
 */
const preview: Preview = {
    ...basePreview,
    parameters: {
        ...basePreview.parameters,
        options: {
            storySort: (a, b) => {
                const ORDER = ['banners--inline', 'banners--overlays', 'banners--overlays-actions', 'banners--custom'];
                const aIdx = ORDER.indexOf(a.id);
                const bIdx = ORDER.indexOf(b.id);
                if (aIdx === -1 && bIdx === -1) return a.id.localeCompare(b.id);
                if (aIdx === -1) return 1;
                if (bIdx === -1) return -1;
                return aIdx - bIdx;
            },
        },
        viewMode: 'docs',
    },
};

export default preview;
