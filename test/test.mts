import { rollup } from 'rollup';

import redirectory from '@anireact/rollup-plugin-redirectory';

let bundle = await rollup({
    input: './test/transpiled/index.mjs',

    plugins: [
        redirectory({
            root: './test/',
            mappings: {
                transpiled: 'src',
                src: 'generated',
            },
        }),
    ],
});

let build = await bundle.generate({ format: 'esm' });

let main = build.output[0].code.trim();

let expected = `
console.log('generated');

console.log('plain');

console.log('sub/a');

console.log('sub/b');

console.log('sub/c');

console.log('transpiled');
`.trim();

if (main !== expected) {
    console.log('The test was failed');
    console.log(main);
    process.exit(1);
}

console.log('All tests were passed');
