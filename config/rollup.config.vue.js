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

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

const configOptions = [
    /* {
        input: 'src/index.ts',
        outputFile: `${mode === 'development' ? 'dev/index.js' : 'dist/lusift.js'}`,
        name: 'Lusift',
        tsconfig: 'tsconfig.json',
        packageJsonPath: 'package.json',
    }, */
    /* {
        input: 'src/react/src/index.tsx',
        outputFile: `${mode === 'development' ? 'dev/lusift-react.js' : 'dist/lusift-react.js'}`,
        name: 'Lusift-react',
        tsconfig: 'tsconfig.react.json',
        packageJsonPath: 'src/react/package.json',
    }, */
    {
        input: 'src/lusift-vue/src/main.ts',
        outputFile: `${mode === 'development' ? 'dev/lusift-vue.js' : 'dist/lusift-vue.js'}`,
        name: 'Lusift-vue',
        tsconfig: 'tsconfig.vue.json',
        packageJsonPath: 'src/lusift-vue/package.json',
    }
];

function getConfig({ input, name, outputFile, tsconfig, packageJsonPath }) {

    let config = {
        input,
        external: [
            'react',
            'react-dom',
            'tslib',
            'vue',
            'global',
            'lodash.isequal',
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
                'vue': 'Vue'
            }
        },
        plugins: [
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
                __buildDate__: () => JSON.stringify(new Date()),
                __buildVersion: 15,
                preventAssignment: true,
            }),
            peerDepsExternal({
                packageJsonPath,
            }),
            resolve(),
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
                    '.tsx',
                ],
                exclude: 'node_modules/**',
                babelrc: true,
                include: ["src", "**", "*.ts"],
                babelHelpers: 'runtime',
                inputSourceMap: mode === 'development',
            }),
            vuePlugin(),
            postcss({
                inject: false,
                sourceMap: (mode === 'production' ? false : 'inline'),
                minimize: mode === 'production',
            }),
            ...mode === 'production' ? [
                terser()
            ] : [],
        ]
    };
    return config;
}

export default configOptions.map(getConfig);
