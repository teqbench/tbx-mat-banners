import type { Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { provideTbxMatSeverityTheme } from '@teqbench/tbx-mat-severity-theme';
import { TBX_MAT_BANNER_PROVIDER_CONFIG } from '../src/tokens/banner-provider-config.token';
import { TbxMatBannerSeverityFontIconService } from '../src/services/banner-severity-font-icon.service';
import { removeStoryOverrideStyleTag } from '../src/components/story-overrides';

// M3 prebuilt theme — provides typography, shape, and state-layer tokens.
import '@angular/material/prebuilt-themes/azure-blue.css';

import '../src/styles/_tbx-mat-banners.scss';

const preview: Preview = {
    decorators: [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (story: () => any) => {
            removeStoryOverrideStyleTag();
            return story();
        },
        applicationConfig({
            providers: [
                provideAnimationsAsync(),
                provideTbxMatSeverityTheme({ invert: false, applyToRoot: true }),
                {
                    provide: MAT_ICON_DEFAULT_OPTIONS,
                    useValue: { fontSet: 'material-symbols-rounded' },
                },
                {
                    provide: TBX_MAT_BANNER_PROVIDER_CONFIG,
                    useFactory: () => ({
                        severityIconResolverService: new TbxMatBannerSeverityFontIconService('material-symbols-rounded'),
                    }),
                },
            ],
        }),
    ],
    parameters: {
        options: {
            // Custom sort so stories within the Banners group appear in the
            // intended narrative order (simple → complex → customization)
            // rather than the default alphabetical order. Mirrors the sort
            // used by teqbench.website's embedded Storybook.
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
        controls: {
            disableSaveFromUI: true,
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
