# @teqbench/tbx-mat-banners

![Build Status](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-banners-main-build-status.json) ![Tests](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-banners-main-tests.json) ![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-banners-main-coverage.json) ![Version](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-banners-main-version.json) ![Build Number](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-banners-main-build-number.json)

> An opinionated [Angular ↗](https://angular.dev) banner component and service with severity-leveled display, an actions group supporting buttons and form controls, and both overlay and inline display modes.

<details>
<summary><strong>Table of contents</strong></summary>

- [Overview](#overview)
- [At a glance](#at-a-glance)
- [When to use](#when-to-use)
- [Installation](#installation)
- [Usage](#usage)
- [Concepts](#concepts)
- [API Reference](#api-reference)
- [Styling](#styling)
- [Accessibility](#accessibility)
- [Compatibility](#compatibility)
- [Related packages](#related-packages)
- [Versioning & releases](#versioning--releases)
- [Contributing](#contributing)
- [Security](#security)
- [Feedback](#feedback)
- [License](#license)

</details>

## Overview

`@teqbench/tbx-mat-banners` provides persistent, attention-grabbing messages for [Angular ↗](https://angular.dev) applications. It fills the gap between small transient notifications and heavier modal dialogs: a wide, horizontally full banner that can carry a short message, a severity indicator, and a small group of action controls, and that stays on screen until the user — or application code — dismisses it.

Two display modes are supported from a single component surface. In **overlay mode**, `TbxMatBannerService` creates banners via [CDK Overlay ↗](https://material.angular.dev/cdk/overlay/api) on a FIFO queue, one at a time, with optional slide or fade animation and programmatic dismiss. In **inline mode**, `TbxMatBannerComponent` is placed directly in a template, controlled by the consumer via bindings, and emits dismiss events.

Severity (`default`, `success`, `error`, `warning`, `information`, `help`) drives both the icon and the color scheme. The six CSS custom-property pairs are aliased from the shared [`@teqbench/tbx-mat-severity-theme` ↗](https://github.com/teqbench/tbx-mat-severity-theme) tokens, so the five colored tiers stay independent of the active [M3 ↗](https://m3.material.io) theme palette while the `default` tier remains theme-responsive. Applications can opt into an inverted palette (white backgrounds with colored text) across every severity-aware `@teqbench` package by calling `provideTbxMatSeverityTheme({ invert: true, applyToRoot: true })` at bootstrap — the flag applies app-wide across every `@teqbench` severity-aware package, not banners alone. An optional actions group accepts any mix of buttons, checkboxes, toggles, radio groups, and toggle groups; on dismiss, all collected values are returned alongside the dismiss reason and the action key that triggered it.

The library is designed for [Angular ↗](https://angular.dev) 21+ zoneless applications, uses [signal inputs ↗](https://angular.dev/guide/signals/inputs), honors `prefers-reduced-motion`, and exposes a pluggable icon resolver so consumers can use [Material Symbols ↗](https://fonts.google.com/icons) font icons or bundled SVG icons without changing component code.

## At a glance

- **Two display modes** — overlay service for fire-and-forget messages and inline component for template-driven use.
- **Severity-leveled API** — convenience methods for default, success, error, warning, information, and help with matching icons and colors.
- **Actions group** — buttons and form controls (checkbox, toggle, radio group, toggle group) in a single message.
- **FIFO queue** — one banner at a time, with signal-based `isActive` and `pendingCount` state.
- **Dismiss tracking** — promise resolves with dismiss reason, action key, and collected form control values.
- **Indefinite by default** — banners persist until dismissed; positive duration auto-dismisses, negative is treated as indefinite.
- **Animations** — optional slide or fade on overlay banners; automatically disabled under `prefers-reduced-motion`.
- **Theming via CSS custom properties** — per-severity colors, gaps, padding, shadow, and z-index exposed as CSS variables.
- **Pluggable icons** — [Material Symbols ↗](https://fonts.google.com/icons) font icons or SVG icon resolver service via DI token.
- **Responsive layout** — CSS container queries reflow the actions group onto a second row on narrow viewports.
- **Zoneless ready** — built for [Angular ↗](https://angular.dev) 21+ zoneless applications using [signal inputs ↗](https://angular.dev/guide/signals/inputs).

## When to use

Banners are one of three message surfaces in the TeqBench component family. Choose based on the weight of the message and how much interaction it needs:

- [`@teqbench/tbx-mat-notifications` ↗](https://github.com/teqbench/tbx-mat-notifications) — small, transient messages with at most one action control. Ideally one line of text, two lines acceptable. Use notifications to acknowledge something without interrupting the user's flow.
- **`@teqbench/tbx-mat-banners`** (this package) — wide, persistent messages with multiple action controls. Ideally one line of message text, up to three lines still acceptable. Use a banner when the message needs the user's attention and may offer a few follow-up choices.
- [`@teqbench/tbx-mat-dialogs` ↗](https://github.com/teqbench/tbx-mat-dialogs) — heavier, focused interactions for arbitrary content. Use a dialog when the message is long, the choices are many, or the interaction is complex.

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

## Concepts

- **Severity level** — a classification (default, success, error, warning, information, help) that selects the icon and color scheme applied to a banner.
- **Actions group** — an ordered list of action controls, buttons and form controls, rendered inside the banner and whose values are returned on dismiss.
- **Dismiss reason** — the cause of a banner closing: user action, close button, timeout, or one of two programmatic paths (single or all).
- **Queue** — a FIFO list of pending banners. One banner is visible at a time in overlay mode; queued banners render in order as each resolves.
- **Provider config** — the DI-provided configuration (`TBX_MAT_BANNER_PROVIDER_CONFIG`) that supplies the severity icon resolver, optional close icon resolver, and default animation.
- **Inline mode** — using `TbxMatBannerComponent` directly in a consumer template, with visibility and state controlled by the consumer rather than the service.
- **Overlay mode** — using `TbxMatBannerService` to render a banner in a CDK Overlay above the application, positioned at the top or bottom of the viewport.

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

## Styling

Banner appearance is customizable via CSS custom properties. Set them globally on `html` or scope them to a panel class for per-severity overrides.

### Layout

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

### Animation

Effective only when `animation` is `Slide` or `Fade`. Ignored when `None`.

| Property                               | Default                            | Description            |
| -------------------------------------- | ---------------------------------- | ---------------------- |
| `--tbx-mat-banner-anim-enter-duration` | `300ms`                            | Enter animation length |
| `--tbx-mat-banner-anim-enter-easing`   | `cubic-bezier(0.25, 0.8, 0.25, 1)` | Enter easing curve     |
| `--tbx-mat-banner-anim-exit-duration`  | `250ms`                            | Exit animation length  |
| `--tbx-mat-banner-anim-exit-easing`    | `cubic-bezier(0.4, 0, 0.6, 1)`     | Exit easing curve      |

### Colors

| Property                                  | Default   | Description                 |
| ----------------------------------------- | --------- | --------------------------- |
| `--tbx-mat-banner-success-background`     | `#2E7D32` | Success background          |
| `--tbx-mat-banner-success-text`           | `#FFFFFF` | Success text/icon color     |
| `--tbx-mat-banner-error-background`       | `#C62828` | Error background            |
| `--tbx-mat-banner-error-text`             | `#FFFFFF` | Error text/icon color       |
| `--tbx-mat-banner-warning-background`     | `#F9A825` | Warning background          |
| `--tbx-mat-banner-warning-text`           | `#FFFFFF` | Warning text/icon color     |
| `--tbx-mat-banner-information-background` | `#1565C0` | Information background      |
| `--tbx-mat-banner-information-text`       | `#FFFFFF` | Information text/icon color |
| `--tbx-mat-banner-help-background`        | `#1976D2` | Help background             |
| `--tbx-mat-banner-help-text`              | `#FFFFFF` | Help text/icon color        |

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

## Accessibility

- **Overlay container.** Overlay banners render inside a [CDK Overlay ↗](https://material.angular.dev/cdk/overlay/api) pane positioned at the top or bottom of the viewport. The overlay is non-blocking and does not trap focus. Consumers that need screen-reader announcement of new banners should wrap the banner message in a container with `aria-live="polite"` in their application shell, or use the [LiveAnnouncer ↗](https://material.angular.dev/cdk/a11y/api#LiveAnnouncer) service to announce the message text alongside the banner call.
- **Keyboard.** The close button and every control in the actions group are focusable in DOM order. `Enter` and `Space` activate buttons; form controls use their native [Angular Material ↗](https://material.angular.dev) keyboard behavior.
- **Focus.** Focus is not moved into the banner automatically — banners are non-blocking. Consumers that need to direct attention to a banner action should call `focus()` on the control explicitly, or escalate to a dialog.
- **Reduced motion.** When `prefers-reduced-motion: reduce` is set, the `Slide` and `Fade` animations are bypassed and banners show/hide instantly regardless of the configured animation.
- **Color contrast.** The default severity palette meets [WCAG ↗](https://www.w3.org/WAI/standards-guidelines/wcag/) AA contrast for body text on each background. Overriding the severity CSS custom properties is the consumer's responsibility to re-verify.
- **Icons.** Severity icons are decorative and marked `aria-hidden`; the severity meaning is carried by the message text itself, not by the icon alone.

## Compatibility

| Dependency                                                                               | Version  |
| ---------------------------------------------------------------------------------------- | -------- |
| [Angular ↗](https://angular.dev)                                                         | >=21.0.0 |
| [Angular CDK ↗](https://material.angular.dev/cdk)                                        | >=21.0.0 |
| [Angular Material ↗](https://material.angular.dev)                                       | >=21.0.0 |
| [@teqbench/tbx-mat-icons ↗](https://github.com/teqbench/tbx-mat-icons)                   | >=4.0.0  |
| [@teqbench/tbx-mat-severity-theme ↗](https://github.com/teqbench/tbx-mat-severity-theme) | >=8.0.0  |
| [TypeScript ↗](https://www.typescriptlang.org)                                           | ~5.9.0   |
| [Node.js ↗](https://nodejs.org)                                                          | >=24.0.0 |

## Related packages

- [`@teqbench/tbx-mat-notifications` ↗](https://github.com/teqbench/tbx-mat-notifications) — transient, single-action messages for lightweight acknowledgements.
- [`@teqbench/tbx-mat-dialogs` ↗](https://github.com/teqbench/tbx-mat-dialogs) — modal dialogs for heavier, focused interactions.
- [`@teqbench/tbx-mat-severity-theme` ↗](https://github.com/teqbench/tbx-mat-severity-theme) — severity enum, abstract icon-service bases, default icon sets, shared SCSS color tokens, and the inverted-palette provider helper consumed by this package.
- [`@teqbench/tbx-mat-icons` ↗](https://github.com/teqbench/tbx-mat-icons) — shared icon resolver contracts and base services.

## Versioning & releases

This package follows [Semantic Versioning ↗](https://semver.org). Versions and changelog entries are produced automatically by [Release Please ↗](https://github.com/googleapis/release-please) from [Conventional Commits ↗](https://www.conventionalcommits.org) on `main`. See [CHANGELOG.md](CHANGELOG.md) for the full release history.

## Contributing

Contributions are welcome. See the [contributing guide ↗](https://github.com/teqbench/.github/blob/main/CONTRIBUTING.md) for local setup, [GitHub Packages ↗](https://github.com/orgs/teqbench/packages) authentication, branch conventions, commit format, and the PR workflow.

## Security

See the [security policy ↗](https://github.com/teqbench/.github/blob/main/SECURITY.md) for the supported-version policy and how to report a vulnerability privately.

## Feedback

- [Report a bug ↗](https://github.com/teqbench/tbx-mat-banners/issues/new?template=bug_report.md)
- [Request a feature ↗](https://github.com/teqbench/tbx-mat-banners/issues/new?template=feature_request.md)

## License

[AGPL-3.0](LICENSE) — Copyright 2026 TeqBench
