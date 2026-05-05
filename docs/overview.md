---
tagline: An opinionated [Angular ↗](https://angular.dev) banner component and service with severity-leveled display, an actions group supporting buttons and form controls, and both overlay and inline display modes.
---

## Overview

`@teqbench/tbx-mat-banners` provides persistent, attention-grabbing messages for [Angular ↗](https://angular.dev) applications. It fills the gap between small transient notifications and heavier modal dialogs: a wide, horizontally full banner that can carry a short message, a severity indicator, and a small group of action controls, and that stays on screen until the user — or application code — dismisses it.

Two display modes are supported from a single component surface. In **overlay mode**, `TbxMatBannerService` creates banners via [CDK Overlay ↗](https://material.angular.dev/cdk/overlay/api) on a FIFO queue, one at a time, with optional slide or fade animation and programmatic dismiss. In **inline mode**, `TbxMatBannerComponent` is placed directly in a template, controlled by the consumer via bindings, and emits dismiss events.

Severity (`default`, `success`, `error`, `warning`, `information`, `help`) drives both the icon and the color scheme. The six CSS custom-property pairs are aliased from the shared [`@teqbench/tbx-mat-severity-theme` ↗](https://github.com/teqbench/tbx-mat-severity-theme) tokens, so the five colored tiers stay independent of the active [M3 ↗](https://m3.material.io) theme palette while the `default` tier remains theme-responsive. Applications can opt into an inverted palette (white backgrounds with colored text) across every severity-aware `@teqbench` package by calling `provideTbxMatSeverityTheme({ invert: true, applyToRoot: true })` at bootstrap — the flag is app-global and affects notifications and dialogs simultaneously, not banners alone. An optional actions group accepts any mix of buttons, checkboxes, toggles, radio groups, and toggle groups; on dismiss, all collected values are returned alongside the dismiss reason and the action key that triggered it.

The library is designed for [Angular ↗](https://angular.dev) zoneless applications, uses [signal inputs ↗](https://angular.dev/guide/signals/inputs), honors `prefers-reduced-motion`, and exposes a pluggable icon resolver so consumers can use [Material Symbols ↗](https://fonts.google.com/icons) font icons or bundled SVG icons without changing component code.

## When to use

Banners are one of three message surfaces in the TeqBench component family. Choose based on the weight of the message and how much interaction it needs.

- [`@teqbench/tbx-mat-notifications` ↗](https://github.com/teqbench/tbx-mat-notifications) — small, transient messages with at most one action control. Ideally one line of text, two lines acceptable. Use notifications to acknowledge something without interrupting the user's flow.
- **`@teqbench/tbx-mat-banners`** (this package) — wide, persistent messages with multiple action controls. Ideally one line of message text, up to three lines still acceptable. Use a banner when the message needs the user's attention and may offer a few follow-up choices.
- [`@teqbench/tbx-mat-dialogs` ↗](https://github.com/teqbench/tbx-mat-dialogs) — heavier, focused interactions for arbitrary content. Use a dialog when the message is long, the choices are many, or the interaction is complex.

If the content you are putting in a banner is approaching the three-line limit, or if the actions group is growing beyond a handful of controls, that is a signal to escalate to a dialog instead. A banner that behaves like a miniature dialog loses the affordances of both.
