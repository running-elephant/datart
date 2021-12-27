/* eslint-disable import/no-anonymous-default-export */
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import path from 'path';
export default {
  input: 'src/task.ts', // 打包入口
  output: {
    // 打包出口
    name: 'getBoardQuery',
    file: path.resolve(__dirname, 'public/task/index.js'), // 最终打包出来的文件路径和文件名，这里是在package.json的browser: 'dist/index.js'字段中配置的
    format: 'iife', // umd是兼容amd/cjs/iife的通用打包格式，适合浏览器
  },
  plugins: [
    json(),
    // 打包插件
    typescript({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    }), // 解析TypeScript
    nodeResolve({
      extensions: ['.js', '.ts'],
    }),

    commonjs(), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      presets: [['env', { modules: false }]],
    }),
  ],
};
