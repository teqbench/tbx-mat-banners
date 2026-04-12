import type { Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { TBX_MAT_BANNER_PROVIDER_CONFIG } from '../src/tokens/banner-provider-config.token';
import { TbxMatBannerSeverityFontIconService } from '../src/services/banner-severity-font-icon.service';

// M3 prebuilt theme — provides typography, shape, and state-layer tokens.
import '@angular/material/prebuilt-themes/azure-blue.css';

// Banner component styles, imported directly from source so both dev and docs
// Storybooks pick up in-repo changes without requiring a package rebuild.
import '../src/styles/_tbx-mat-banners.scss';

/**
 * Shared preview configuration used by both Storybook instances. Each
 * instance spreads this into its own `Preview` and adds any instance-specific
 * decorators, parameters, or story-sort rules on top.
 */
export const basePreview: Preview = {
    decorators: [
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
        backgrounds: { disable: true },
        controls: {
            disableSaveFromUI: true,
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        actions: { disable: true },
        interactions: { disable: true },
        measure: { disable: true },
        outline: { disable: true },
        grid: { disable: true },
    },
};
