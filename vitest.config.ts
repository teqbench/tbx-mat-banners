import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
    plugins: [angular({ jit: true, tsconfig: 'tsconfig.spec.json' })],
    resolve: {
        // When using npm link, symlinked packages resolve @angular/* from their
        // own node_modules instead of the host's. This causes duplicate Angular
        // instances and breaks DI (inject() context errors). Deduplication forces
        // a single instance across the dependency graph. Safe to leave in place —
        // has no effect when packages are installed from the registry.
        dedupe: ['@angular/core', '@angular/material', '@angular/platform-browser'],
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['src/test-setup.ts'],
        passWithNoTests: false,
        coverage: {
            exclude: [
                // Interfaces — no runtime code
                'src/models/banner-config.model.ts',
                'src/models/banner-data-dto.model.ts',
                'src/models/banner-action-button.model.ts',
                'src/models/banner-action-checkbox.model.ts',
                'src/models/banner-action-toggle.model.ts',
                'src/models/banner-action-radio-group.model.ts',
                'src/models/banner-action-toggle-group.model.ts',
                'src/models/banner-provider-config.model.ts',
                'src/models/banner-result.model.ts',
                'src/models/banner-ref.model.ts',
                // Type aliases — no runtime code
                'src/types/banner-config-args.type.ts',
                'src/types/banner-action-button-appearance.type.ts',
                'src/types/banner-actions-group-control.type.ts',
                // Enums — no testable logic (pure value declarations)
                'src/enums/banner-dismiss-reason.enum.ts',
                // Constants — no testable logic
                'src/constants/banner.constants.ts',
                // Tokens (InjectionToken declarations — no testable logic)
                'src/tokens/banner-provider-config.token.ts',
            ],
            thresholds: {
                lines: 80,
                functions: 80,
                statements: 80,
                branches: 75,
                perFile: true,
            },
        },
    },
});
