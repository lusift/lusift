import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { terser } from "rollup-plugin-terser";
import { DEFAULT_EXTENSIONS } from '@babel/core';
import { babel } from '@rollup/plugin-babel';

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

export default {
    input: 'src/index.ts',
    output: {
        file: `${mode === 'development' ? 'dev' : 'dist'}/lusift.js`,
        name: 'Lusift',
        format: 'umd',
        sourcemap: mode === 'development',
    },
    plugins: [
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
            tsconfig: 'tsconfig.json',
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
        terser(),
    ]
};
