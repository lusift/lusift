import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { terser } from "rollup-plugin-terser";
import { DEFAULT_EXTENSIONS } from '@babel/core';
import { babel } from '@rollup/plugin-babel';
import alias from '@rollup/plugin-alias';

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

const configOptions = [
    {
        input: 'src/index.ts',
        outputFile: `${mode === 'development' ? 'dev/index.js' : 'dist/lusift.js'}`,
        name: 'Lusift',
        tsconfig: 'tsconfig.json',
    },
    {
        input: 'src/react/src/index.tsx',
        outputFile: `${mode === 'development' ? 'dev/lusift-react.js' : 'dist/lusift-react.js'}`,
        name: 'Lusift-react',
        tsconfig: 'tsconfig.react.json',
    }
];

function getConfig({ input, name, outputFile, tsconfig }) {

    let config = {
        input,
        output: {
            file: outputFile,
            name,
            format: 'umd',
            sourcemap: mode === 'development',
        },
        plugins: [
            /* alias({
                entries: {
                    common: '../src/common',
                    hospot: '../src/hospot',
                    tooltip: '../src/tooltip',
                    modal: '../src/modal',
                    lusift: '../src/lusift',
                }
            }), */
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
                __buildDate__: () => JSON.stringify(new Date()),
                __buildVersion: 15,
                preventAssignment: true,
            }),
            commonjs(),
            nodeResolve({
                browser: true,
            }),
            typescript({
                tsconfig,
                tsconfigOverride: {
                    compilerOptions: {
                        sourceMap: mode === 'development',
                        inlineSourceMap: false,
                        declaration: mode === 'production',
                    }
                }
            }),
            babel({
                extensions: [
                    ...DEFAULT_EXTENSIONS,
                    '.ts',
                    '.tsx'
                ],
                exclude: 'node_modules/**',
                babelrc: true,
                include: ["src", "**", "*.ts"],
                babelHelpers: 'runtime',
                inputSourceMap: mode === 'development',
            }),
            postcss({
                inject: false,
                sourceMap: (mode === 'production' ? false : 'inline'),
                minimize: mode === 'production',
            }),
        ]
    };
    if (mode === 'production') {
        config.plugins = [
            ...config.plugins,
            terser(),
        ];
    }
    return config;
}


export default configOptions.map(getConfig);
