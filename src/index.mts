import path from 'node:path';

import { Plugin } from 'rollup';

export interface RedirectoryOptions {
    /**
     * The project root directory.
     * @default process.cwd()
     */
    root?: string | undefined;

    /**
     * A record of key-value directory mappings; both keys and values are
     * relative to `root`
     */
    mappings?: Record<string, string> | undefined;
}

/**
 * OverlayFS-like resolver.
 */
export default async function redirectory(options: RedirectoryOptions = {}): Promise<Plugin> {
    let root = normalize(options.root ?? process.cwd());
    let config = configure(options.mappings ?? {});

    return {
        name: 'overlay',
        resolveId: {
            order: 'post',
            async handler(importee, importer, options) {
                let forward = async () => {
                    let res = await this.resolve(importee, importer, {
                        skipSelf: true,
                        ...options,
                    });

                    return res;
                };

                let fallback = async () => {
                    if (importer === undefined) return null;

                    let from = path.relative(root, importer);

                    for (let [k, v] of config) {
                        if (from.startsWith(k)) {
                            importer = path.join(root, v, basename(k, from));

                            let res = await forward();

                            if (res !== null) return res;
                        }
                    }

                    return null;
                };

                return (await forward()) || (await fallback());
            },
        },
    };
}

const configure = (mappings: Record<string, string>) => {
    let entries = Object.entries(mappings).map(([k, v]) => {
        return [normalize(k), normalize(v)] as const;
    });

    return new Map(entries);
};

const normalize = (name: string) => path.normalize(name).replace(TAIL_RE, '');

const basename = (k: string, from: string) => from.slice(k.length).replace(INIT_RE, '');

const SEP = '(?:' + [...path.sep].map(x => '\\u' + x.charCodeAt(0).toString(16).padStart(4, '0')).join('') + ')+';

const INIT_RE = RegExp('^' + SEP);
const TAIL_RE = RegExp(SEP + '$');
