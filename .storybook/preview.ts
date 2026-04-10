import type { Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
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
            storySort: {
                order: ['Banners', ['Overlay']],
            },
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
