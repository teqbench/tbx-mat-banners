/**
 * Return a greeting message for the given name
 *
 * @remarks
 * Constructs a simple "Hello, {name}!" string. This is a placeholder
 * export included in the package template to demonstrate the
 * {@link https://tsdoc.org | TSDoc} convention and test pipeline. Replace it with real package exports.
 *
 * @param name - The name to greet.
 *
 * @returns The formatted greeting string.
 *
 * @example
 * ```typescript
 * greet('World'); // 'Hello, World!'
 * ```
 *
 * @category Utilities
 * @since 0.1.0
 *
 * @public
 */
export function greet(name: string): string {
    return `Hello, ${name}!`;
}
