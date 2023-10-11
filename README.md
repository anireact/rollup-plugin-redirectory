# Rollup Plugin Redirectory

> OverlayFS-like resolver for Rollup.

## Usage

```bash
yarn add -D @anireact/rollup-plugin-rediretory
```

```bash
npm install --save-dev @anireact/rollup-plugin-rediretory
```

```javascript
import rediretory from '@anireact/rollup-plugin-rediretory';

export default {
    plugins: [
        rediretory({
            root: process.cwd(),
            mappings: {
                // When a file in `<root>/transpiled` imports something,
                // and resolution fails, fall back to `<root>/src`:
                transpiled: 'src',

                // When a file in `<root>/src` imports something,
                // and resolution fails, fall back to `<root>/generated`:
                src: 'generated',
            },
        }),
    ],
};
```

## Options

-   `root` (default: `process.cwd()`) — the project root directory.
-   `mappings` — a record of key-value directory mappings; both keys and values
    are relative to `root`.

## Why

Let’s consider a project, that has:

1. JS and CSS files in `/src`.
2. TS files from `/src`, transpiled with `tsc` to `/tmp`.

We don’t want to copy _everything_ from `/src` to `/tmp`, so if `/src/main.mts`
transpiled to `/tmp/main.mts` imports `./styles.css`, the resolution will fail,
because `./styles.css` cannot be resolved in `/tmp`. To solve this, we could
just tell Rollup to check `/src` when resolving files from `/tmp` _— if the
original resolution fails_.

## Support

If you have any issues, feel free to fork this plugin, or contact me on Telegram
https://t.me/miyaokamarina.

## License

MIT © 2023 Yuri Zemskov
