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
import strip from '@rollup/plugin-strip';

const path = require('path');

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

const functionsToRemove = mode === 'production' ? ['console.log', 'assert.*', 'debug', 'alert'] : [];


const bundleOutputDirName = `${mode === 'development' ? 'dev' : 'dist'}`;
const configOptions = [
    {
        input: 'src/index.ts',
        outputFile: `${bundleOutputDirName}/index.js`,
        name: 'Lusift',
        tsconfig: 'tsconfig.json',
        packageJsonPath: 'package.json',
    },
    {
        input: 'src/react/src/index.tsx',
        outputFile: `${bundleOutputDirName}/react/src/index.js`,
        name: 'Lusift-react',
        tsconfig: 'tsconfig.react.json',
        packageJsonPath: 'src/react/package.json',
    },
    {
        input: 'src/vue/src/index.ts',
        outputFile: `${bundleOutputDirName}/vue/src/index.js`,
        name: 'Lusift-vue',
        tsconfig: 'tsconfig.vue.json',
        packageJsonPath: 'src/vue/package.json',
    },
];

function getConfig({ input, name, outputFile, tsconfig, packageJsonPath }) {

    let config = {
        input,
        external: [
            'react',
            'react-dom',
            'tslib',
            'vue',
            'core-js',
            // '@vue/composition-api',
            'vue-demi'
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
                'core-js': 'coreJs',
                // '@vue/composition-api': 'VueCompositionAPI',
                'vue-demi': 'vueDemi'
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
                check: true,
                tsconfigOverride: {
                    compilerOptions: {
                        sourceMap: mode === 'development',
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
            strip({
                functions: functionsToRemove,
                include: ['**/*.(js|jsx|ts|tsx)'],
                exclude: ['node_modules/**'],
            }),
            ...mode === 'production' ? [
                terser(),
            ] : [],
        ]
    };
    return config;
}

export default configOptions.map(getConfig);
