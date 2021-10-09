import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default [
  {
    input: 'src/index.ts',
    plugins: [esbuild(), nodeResolve(), commonjs()],
    output: [
      {
        file: `dist/index.js`,
        format: 'cjs',
        sourcemap: false
      },
      {
        file: `dist/index.mjs`,
        format: 'es',
        sourcemap: false
      },
    ],
  },{
    input: 'src/index.ts',
    plugins: [dts()],
    output: {
      file: `dist/index.d.ts`,
      format: 'es',
    },
  },
]
