import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import { DEFAULT_EXTENSIONS } from '@babel/core';
import { babel } from '@rollup/plugin-babel';
import alias from '@rollup/plugin-alias';
import vuePlugin from 'rollup-plugin-vue'
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { visualizer } from 'rollup-plugin-visualizer';

const path = require('path');

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

const configOptions = [
    /* {
        input: 'src/index.ts',
        outputFile: `${mode === 'development' ? 'dev/index.js' : 'dist/lusift.js'}`,
        name: 'Lusift',
        tsconfig: 'tsconfig.json',
        packageJsonPath: 'package.json',
    }, */
    {
        input: 'src/react/src/index.tsx',
        outputFile: `${mode === 'development' ? 'dev/lusift-react.js' : 'dist/lusift-react.js'}`,
        name: 'Lusift-react',
        tsconfig: 'tsconfig.react.json',
        packageJsonPath: 'src/react/package.json',
    },
    /* {
        input: 'src/vue/src/main.ts',
        outputFile: `${mode === 'development' ? 'dev/lusift-vue.js' : 'dist/lusift-vue.js'}`,
        name: 'Lusift-vue',
        tsconfig: 'tsconfig.vue.json',
        packageJsonPath: 'src/vue/package.json',
    } */
];

function getConfig({ input, name, outputFile, tsconfig, packageJsonPath }) {

    let config = {
        input,
        external: [
            'react',
            'react-dom',
            'tslib',
            'vue',
            'core-js'
        ],
        output: {
            file: outputFile,
            name,
            format: 'umd',
            sourcemap: mode === 'development',
            globals: {
                'react': 'React',
                'react-dom': 'ReactDOM',
                'tslib': 'tslib',
                'vue': 'Vue',
                'core-js': 'coreJs'
            }
        },
        plugins: [
            alias({
                entries: {
                    '@': path.resolve(__dirname, '../src'),
                    common: path.resolve(__dirname, '../src/common'),
                    hospot: path.resolve(__dirname, '../src/hospot'),
                    tooltip: path.resolve(__dirname, '../src/tooltip'),
                    modal: path.resolve(__dirname, '../src/modal'),
                    lusift: path.resolve(__dirname, '../src/lusift'),
                    // react: path.resolve('./node_modules/react'),
                    react: path.resolve(path.join(__dirname, './node_modules/react')),
                    'react-dom': path.resolve(path.join(__dirname, './node_modules/react-dom')),
                    // 'react-dom': path.resolve('./node_modules/react-dom'),
                }
            }),
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
                __buildDate__: () => JSON.stringify(new Date()),
                __buildVersion: 15,
                preventAssignment: true,
            }),
            peerDepsExternal({
                packageJsonPath,
            }),
            ...name === 'Lusift-vue' ? [
                resolve(),
            ] : [],
            commonjs(),
            nodeResolve({
                browser: true,
            }),
            typescript({
                tsconfig,
                // HACK: Can't build dist/lusift-react with check true
                check: !(name === 'Lusift-react' &&
                    mode === 'production'),
                tsconfigOverride: {
                    compilerOptions: {
                        sourceMap: mode === 'development',
                        inlineSourceMap: false,
                        declaration: mode === 'production',
                    }
                }
            }),
            ...name === 'Lusift-vue' ? [
                babel({
                    extensions: [
                        ...DEFAULT_EXTENSIONS,
                        '.ts',
                        '.tsx',
                    ],
                    exclude: 'node_modules/**',
                    babelrc: true,
                    include: ["src", "**", "*.ts"],
                    babelHelpers: 'runtime',
                    inputSourceMap: mode === 'development',
                }),
                vuePlugin(),
            ] : [],
            postcss({
                inject: false,
                sourceMap: (mode === 'production' ? false : 'inline'),
                minimize: mode === 'production',
            }),
            visualizer({
                filename: `.rollup-build-stats/${name.toLowerCase()}-${mode.toLowerCase()}.html`,
                title: 'Lusift Rollup Visualizer',
            }),
            ...mode === 'production' ? [
                terser()
            ] : [],
        ]
    };
    return config;
}

export default configOptions.map(getConfig);
