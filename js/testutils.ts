// jsdom does not implement matchMedia, stub it to report the given OS color scheme.
export function stubColorScheme(dark: boolean) {
    window.matchMedia = ((query: string) => ({ matches: dark, media: query })) as typeof window.matchMedia;
}
