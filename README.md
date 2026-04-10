# @teqbench/tbx-mat-banners

![Build Status](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-banners-main-build-status.json) ![Tests](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-banners-main-tests.json) ![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-banners-main-coverage.json) ![Version](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-banners-main-version.json) ![Build Number](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-banners-main-build-number.json)

> An opinionated [Angular ↗](https://angular.dev) banner component and service. Provides `TbxMatBannerService` for overlay display via [CDK Overlay ↗](https://material.angular.dev/cdk/overlay/api) and `TbxMatBannerComponent` for inline display. Features severity-leveled methods (`success()`, `error()`, `warning()`, `information()`, `help()`), an actions group supporting buttons and form controls (checkbox, toggle, radio group, toggle group), FIFO queuing with signal-based state, indefinite duration by default, and dismiss reason tracking with collected control values.

## When to use

Banners are one of three message surfaces in the TeqBench component family. Choose based on the weight of the message and how much interaction it needs:

- [`@teqbench/tbx-mat-notifications`](https://github.com/teqbench/tbx-mat-notifications) — small, transient messages with at most one action control. Ideally one line of text, two lines acceptable. Use notifications to acknowledge something without interrupting the user's flow.
- **`@teqbench/tbx-mat-banners`** (this package) — wide, persistent messages with multiple action controls. Ideally one line of message text, up to three lines still acceptable. Use a banner when the message needs the user's attention and may offer a few follow-up choices.
- [`@teqbench/tbx-mat-dialogs`](https://github.com/teqbench/tbx-mat-dialogs) — heavier, focused interactions for arbitrary content. Use a dialog when the message is long, the choices are many, or the interaction is complex.

If the content you are putting in a banner is approaching the three-line limit, or if the actions group is growing beyond a handful of controls, that is a signal to escalate to a dialog instead. A banner that behaves like a miniature dialog loses the affordances of both.

## Installation

Configure [npm ↗](https://www.npmjs.com) to use [GitHub Packages ↗](https://github.com/orgs/teqbench/packages) for the `@teqbench` scope:

```bash
echo "@teqbench:registry=https://npm.pkg.github.com" >> .npmrc
```

Install the package:

```bash
npm install @teqbench/tbx-mat-banners
```

### Prerequisites

This package uses [Angular CDK Overlay ↗](https://material.angular.dev/cdk/overlay/api) for overlay banners and [Angular Material ↗](https://material.angular.dev) components for buttons, checkboxes, toggles, and other controls. An active [M3 ↗](https://m3.material.io) theme is required for typography, shape, and interactive states.

Banner severity colors (success = green, error = red, etc.) are **not** tied to the theme palette — they use dedicated CSS custom properties and remain consistent regardless of which theme is active.

Import the global banner styles in your application's stylesheet:

```scss
@use '@teqbench/tbx-mat-banners/styles/tbx-mat-banners';
```

## Usage

### Overlay — fire-and-forget

```typescript
import { TbxMatBannerService } from '@teqbench/tbx-mat-banners';

private readonly banner = inject(TbxMatBannerService);

// Convenience methods — prefix with void when not awaiting the result
void this.banner.success('Item saved successfully.');
void this.banner.error('Failed to load data. Please try again.');
void this.banner.warning('Your session will expire in 5 minutes.');
void this.banner.information('New version available.');
void this.banner.help('Click the + button to add a new item.');
```

### Overlay — with actions group

```typescript
import { TbxMatBannerService } from '@teqbench/tbx-mat-banners';

const ref = this.banner.warning('Update available.', {
    actionsGroup: [
        { type: 'checkbox', key: 'autoUpdate', label: 'Auto-update', defaultValue: false },
        { type: 'button', key: 'later', label: 'Later' },
        { type: 'button', key: 'update', label: 'Update Now', appearance: 'filled' },
    ],
});

const result = await ref.result;
if (result.actionKey === 'update') {
    const autoUpdate = result.actionsGroupValues['autoUpdate'] as boolean;
    this.performUpdate(autoUpdate);
}
```

### Overlay — with animation

```typescript
import { TbxMatBannerAnimation } from '@teqbench/tbx-mat-banners';

void this.banner.success('Item saved.', { animation: TbxMatBannerAnimation.Slide });
void this.banner.error('Connection lost.', { animation: TbxMatBannerAnimation.Fade });
```

Animation is optional and defaults to `None` (instant show/hide). Set an app-wide default via the provider config:

```typescript
{
    provide: TBX_MAT_BANNER_PROVIDER_CONFIG,
    useFactory: () => ({
        severityIconResolverService: new TbxMatBannerSeverityFontIconService(),
        defaultAnimation: TbxMatBannerAnimation.Slide,
    }),
},
```

Animations are automatically disabled when the user has `prefers-reduced-motion: reduce` set.

### Overlay — full control via show()

```typescript
import { TbxMatSeverityLevel, TbxMatBannerAnimation } from '@teqbench/tbx-mat-banners';

this.banner.show({
    type: TbxMatSeverityLevel.Warning,
    message: 'Unsaved changes will be lost.',
    actionsGroup: [
        { type: 'button', key: 'discard', label: 'Discard' },
        { type: 'button', key: 'save', label: 'Save', appearance: 'filled' },
    ],
    verticalPosition: 'top',
    animation: TbxMatBannerAnimation.Slide,
});
```

### Inline

Place the component directly in your template. No service needed. The component uses [Angular signal inputs ↗](https://angular.dev/guide/signals/inputs) — template binding syntax is unchanged.

```html
<tbx-mat-banner
    [type]="severityLevel"
    message="This is an inline banner."
    [showSeverityIcon]="true"
    [showCloseButton]="true"
    [actionsGroup]="controls"
    (dismissed)="onDismiss($event)"
/>
```

Available inputs: `type`, `message`, `duration`, `showSeverityIcon`, `showCloseButton`, `actionsGroup`. All are optional except `type`. The `(dismissed)` output emits a `TbxMatBannerResult` on dismiss. Animations are overlay-only — inline banners do not animate.

### Queue state (reactive signals)

```typescript
this.banner.isActive(); // whether a banner is visible
this.banner.pendingCount(); // banners waiting in the queue
```

### Dismiss

```typescript
this.banner.dismiss(); // dismiss current (resolves with ProgrammaticDismissCurrent)
this.banner.dismissAll(); // clear current + all queued (resolves with ProgrammaticDismissAll)
```

### Duration

- **Not set or zero** — indefinite (no auto-dismiss). The banner remains visible until dismissed by a user action or programmatically.
- **Positive** — used as-is, no clamping. The banner auto-dismisses after this duration.
- **Negative** — treated as indefinite (0).

### Icon Configuration

Icons are configured via the `TBX_MAT_BANNER_PROVIDER_CONFIG` injection token, which is required.

#### Font icons with `MAT_ICON_DEFAULT_OPTIONS`

```typescript
// app.config.ts
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { TBX_MAT_BANNER_PROVIDER_CONFIG, TbxMatBannerSeverityFontIconService } from '@teqbench/tbx-mat-banners';

providers: [
    { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-rounded' } },
    {
        provide: TBX_MAT_BANNER_PROVIDER_CONFIG,
        useFactory: () => ({
            severityIconResolverService: new TbxMatBannerSeverityFontIconService(),
        }),
    },
];
```

#### Font icons with explicit fontSet

```typescript
providers: [
    {
        provide: TBX_MAT_BANNER_PROVIDER_CONFIG,
        useFactory: () => ({
            severityIconResolverService: new TbxMatBannerSeverityFontIconService('material-symbols-rounded'),
        }),
    },
];
```

#### SVG icons

```typescript
providers: [
    {
        provide: TBX_MAT_BANNER_PROVIDER_CONFIG,
        useFactory: () => ({
            severityIconResolverService: new TbxMatBannerSeveritySvgIconService(),
        }),
    },
];
```

### CSS Custom Properties

Banner appearance is customizable via CSS custom properties. Set them globally on `html` or scope them to a panel class for per-severity overrides.

#### Layout

| Property                           | Default       | Description                                   |
| ---------------------------------- | ------------- | --------------------------------------------- |
| `--tbx-mat-banner-padding`         | `0.5rem 1rem` | Host element padding                          |
| `--tbx-mat-banner-font-size`       | `inherit`     | Message text size                             |
| `--tbx-mat-banner-icon-size`       | `1.5rem`      | Severity icon size                            |
| `--tbx-mat-banner-label-gap`       | `1rem`        | Gap between icon and message                  |
| `--tbx-mat-banner-actions-gap`     | `0.5rem`      | Gap between controls in actions group         |
| `--tbx-mat-banner-actions-padding` | `1rem`        | Padding before actions area                   |
| `--tbx-mat-banner-close-gap`       | `0.5rem`      | Gap between actions and close button          |
| `--tbx-mat-banner-controls-gap`    | `0.75rem`     | Gap between input controls                    |
| `--tbx-mat-banner-buttons-gap`     | `0.5rem`      | Gap between action buttons                    |
| `--tbx-mat-banner-actions-row-gap` | `0.5rem`      | Gap between rows in narrow layout             |
| `--tbx-mat-banner-overlay-shadow`  | M3 level 3    | Overlay panel drop shadow (consumer override) |
| `--tbx-mat-banner-overlay-z-index` | `1000`        | Z-index of the overlay panel                  |

#### Animation

Effective only when `animation` is `Slide` or `Fade`. Ignored when `None`.

| Property                               | Default                            | Description            |
| -------------------------------------- | ---------------------------------- | ---------------------- |
| `--tbx-mat-banner-anim-enter-duration` | `300ms`                            | Enter animation length |
| `--tbx-mat-banner-anim-enter-easing`   | `cubic-bezier(0.25, 0.8, 0.25, 1)` | Enter easing curve     |
| `--tbx-mat-banner-anim-exit-duration`  | `250ms`                            | Exit animation length  |
| `--tbx-mat-banner-anim-exit-easing`    | `cubic-bezier(0.4, 0, 0.6, 1)`     | Exit easing curve      |

#### Colors

| Property                                  | Default                                                            | Description                 |
| ----------------------------------------- | ------------------------------------------------------------------ | --------------------------- |
| `--tbx-mat-banner-success-background`     | ![#2E7D32](https://placehold.co/15x15/2E7D32/2E7D32.png) `#2E7D32` | Success background          |
| `--tbx-mat-banner-success-text`           | ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `#FFFFFF` | Success text/icon color     |
| `--tbx-mat-banner-error-background`       | ![#C62828](https://placehold.co/15x15/C62828/C62828.png) `#C62828` | Error background            |
| `--tbx-mat-banner-error-text`             | ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `#FFFFFF` | Error text/icon color       |
| `--tbx-mat-banner-warning-background`     | ![#F9A825](https://placehold.co/15x15/F9A825/F9A825.png) `#F9A825` | Warning background          |
| `--tbx-mat-banner-warning-text`           | ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `#FFFFFF` | Warning text/icon color     |
| `--tbx-mat-banner-information-background` | ![#1565C0](https://placehold.co/15x15/1565C0/1565C0.png) `#1565C0` | Information background      |
| `--tbx-mat-banner-information-text`       | ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `#FFFFFF` | Information text/icon color |
| `--tbx-mat-banner-help-background`        | ![#1976D2](https://placehold.co/15x15/1976D2/1976D2.png) `#1976D2` | Help background             |
| `--tbx-mat-banner-help-text`              | ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `#FFFFFF` | Help text/icon color        |

### Styling Font Icons

[Material Symbols ↗](https://fonts.google.com/icons) are variable fonts that expose four CSS axes via `font-variation-settings`. Target the overlay panel class to scope changes to banners.

#### State transition (outlined to filled)

```css
@keyframes tbx-banner-icon-fill {
    from {
        font-variation-settings:
            'FILL' 0,
            'wght' 400,
            'GRAD' 0,
            'opsz' 24;
    }
    to {
        font-variation-settings:
            'FILL' 1,
            'wght' 400,
            'GRAD' 0,
            'opsz' 24;
    }
}
.tbx-mat-banner-overlay-panel .material-symbols-rounded {
    animation: tbx-banner-icon-fill 0.3s ease-in-out 0.15s forwards;
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
}
```

#### Pulse (continuous loop)

```css
@keyframes tbx-banner-icon-pulse {
    from {
        font-variation-settings:
            'FILL' 0,
            'wght' 400,
            'GRAD' 0,
            'opsz' 24;
    }
    to {
        font-variation-settings:
            'FILL' 1,
            'wght' 400,
            'GRAD' 0,
            'opsz' 24;
    }
}
.tbx-mat-banner-overlay-panel .tbx-mat-banner-icon {
    animation: tbx-banner-icon-pulse 1s ease-in-out infinite alternate;
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
}
```

## API Reference

### TbxMatBannerService

| Method                          | Returns           | Description                                                                                                |
| ------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------- |
| `success(message, config?)`     | `TbxMatBannerRef` | Show a success banner                                                                                      |
| `error(message, config?)`       | `TbxMatBannerRef` | Show an error banner                                                                                       |
| `warning(message, config?)`     | `TbxMatBannerRef` | Show a warning banner                                                                                      |
| `information(message, config?)` | `TbxMatBannerRef` | Show an information banner                                                                                 |
| `help(message, config?)`        | `TbxMatBannerRef` | Show a help banner                                                                                         |
| `default(message, config?)`     | `TbxMatBannerRef` | Show a default banner (no severity styling)                                                                |
| `show(config)`                  | `TbxMatBannerRef` | Show a banner with full config                                                                             |
| `dismiss()`                     | `void`            | Dismiss the current banner; its `result` promise resolves with `ProgrammaticDismissCurrent`                |
| `dismissAll()`                  | `void`            | Dismiss current and clear the queue; each banner's `result` promise resolves with `ProgrammaticDismissAll` |
| `isActive()`                    | `Signal<boolean>` | Whether a banner is visible                                                                                |
| `pendingCount()`                | `Signal<number>`  | Count of queued banners                                                                                    |

### TbxMatBannerRef

Returned synchronously from all service methods.

| Property | Type                          | Description                                              |
| -------- | ----------------------------- | -------------------------------------------------------- |
| `config` | `TbxMatBannerConfig`          | Consumer's config, available immediately                 |
| `result` | `Promise<TbxMatBannerResult>` | Resolves on dismissal with reason, actionKey, and values |

### TbxMatBannerResult

| Property             | Type                        | Description                                      |
| -------------------- | --------------------------- | ------------------------------------------------ |
| `dismissReason`      | `TbxMatBannerDismissReason` | Why the banner was dismissed                     |
| `actionKey`          | `string \| undefined`       | Key of the button that triggered dismissal       |
| `actionsGroupValues` | `Record<string, unknown>`   | Collected form control values at time of dismiss |

### TbxMatBannerDismissReason

| Value                        | Trigger                       |
| ---------------------------- | ----------------------------- |
| `Action`                     | User clicked an action button |
| `Close`                      | User clicked the close button |
| `Timeout`                    | Auto-dismissed after duration |
| `ProgrammaticDismissAll`     | `dismissAll()` called         |
| `ProgrammaticDismissCurrent` | `dismiss()` called            |

### TbxMatBannerAnimation

| Value   | Description                                                              |
| ------- | ------------------------------------------------------------------------ |
| `None`  | No animation — instant show/hide (default)                               |
| `Slide` | Slides in/out from the closest viewport edge based on `verticalPosition` |
| `Fade`  | Fades in/out via opacity                                                 |

### TbxMatBannerConfig

| Property           | Type                                | Default | Description                                    |
| ------------------ | ----------------------------------- | ------- | ---------------------------------------------- |
| `type`             | `TbxMatSeverityLevel`               | -       | Severity level (required)                      |
| `message`          | `string`                            | -       | Message text (required)                        |
| `duration`         | `number`                            | `0`     | Duration in ms. Zero or negative = indefinite. |
| `showSeverityIcon` | `boolean`                           | `true`  | Show severity icon                             |
| `showCloseButton`  | `boolean`                           | `true`  | Show close/dismiss button                      |
| `actionsGroup`     | `TbxMatBannerActionsGroupControl[]` | -       | Array of buttons and form controls             |
| `panelClass`       | `string \| string[]`                | -       | Additional CSS classes for the overlay panel   |
| `verticalPosition` | `'top' \| 'bottom'`                 | `'top'` | Overlay position (overlay mode only)           |
| `animation`        | `TbxMatBannerAnimation`             | `None`  | Enter/exit animation (overlay mode only)       |

### TbxMatBannerProviderConfig

| Property                      | Type                                                                     | Default      | Description                                                         |
| ----------------------------- | ------------------------------------------------------------------------ | ------------ | ------------------------------------------------------------------- |
| `severityIconResolverService` | `TbxMatSeverityResolver & TbxMatIconResolver<TbxMatSeverityLevel> & ...` | -            | Severity icon resolver (required)                                   |
| `closeIconResolverService`    | `TbxMatIconResolver<string> & { iconType }`                              | Default font | Close button icon resolver                                          |
| `defaultAnimation`            | `TbxMatBannerAnimation`                                                  | `None`       | App-wide default animation; per-banner `animation` takes precedence |

## Compatibility

| Dependency                                                                             | Version  |
| -------------------------------------------------------------------------------------- | -------- |
| [Angular ↗](https://angular.dev)                                                       | >=21.0.0 |
| [Angular CDK ↗](https://material.angular.dev/cdk)                                      | >=21.0.0 |
| [Angular Material ↗](https://material.angular.dev)                                     | >=21.0.0 |
| [@teqbench/tbx-mat-icons](https://github.com/teqbench/tbx-mat-icons)                   | >=4.0.0  |
| [@teqbench/tbx-mat-severity-icons](https://github.com/teqbench/tbx-mat-severity-icons) | >=7.0.0  |
| [TypeScript ↗](https://www.typescriptlang.org)                                         | ~5.9.0   |
| [Node.js ↗](https://nodejs.org)                                                        | >=24.0.0 |

## Feedback

- [Report a bug ↗](https://github.com/teqbench/tbx-mat-banners/issues/new?template=bug_report.md)
- [Request a feature ↗](https://github.com/teqbench/tbx-mat-banners/issues/new?template=feature_request.md)

## License

[AGPL-3.0](LICENSE) -- Copyright 2026 TeqBench
