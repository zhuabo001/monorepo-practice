import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

/**
 * 生成Rollup配置
 * @param {string} packagePath - 包路径
 * @param {Object} buildOptions - 构建选项
 * @returns {Array} Rollup配置数组
 */
export function generateRollupConfigs(packagePath, buildOptions) {
  const packageJsonPath = path.join(packagePath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  const { name, formats = ['esm', 'cjs'], name: globalName } = buildOptions;
  const input = path.join(packagePath, 'src/index.ts');
  
  // 确保输入文件存在
  if (!fs.existsSync(input)) {
    throw new Error(`Entry file not found: ${input}`);
  }

  const configs = [];

  // 为每种格式生成配置
  formats.forEach(format => {
    const outputDir = path.join(packagePath, 'dist');
    let fileName, formatType, globals = {};

    switch (format) {
      case 'esm':
        fileName = 'index.esm.js';
        formatType = 'es';
        break;
      case 'cjs':
        fileName = 'index.cjs.js';
        formatType = 'cjs';
        break;
      case 'iife':
        fileName = 'index.iife.js';
        formatType = 'iife';
        globals = { [packageJson.name]: globalName };
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    const config = {
      input,
      output: {
        file: path.join(outputDir, fileName),
        format: formatType,
        name: format === 'iife' ? globalName : undefined,
        globals: format === 'iife' ? globals : undefined,
        sourcemap: true,
        exports: 'named'
      },
      plugins: [
        replace({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
          preventAssignment: true
        }),
        nodeResolve({
          preferBuiltins: true,
          extensions: ['.js', '.ts', '.json']
        }),
        commonjs(),
        typescript({
          tsconfig: (() => {
            // 查找最近的tsconfig.json
            if (fs.existsSync(path.join(packagePath, 'tsconfig.json'))) {
              return path.join(packagePath, 'tsconfig.json');
            }
            if (fs.existsSync(path.join(path.dirname(packagePath), 'tsconfig.json'))) {
              return path.join(path.dirname(packagePath), 'tsconfig.json');
            }
            if (fs.existsSync(path.join(path.dirname(path.dirname(packagePath)), 'tsconfig.json'))) {
              return path.join(path.dirname(path.dirname(packagePath)), 'tsconfig.json');
            }
            return undefined; // 让插件使用默认配置
          })(),
          declaration: format === 'esm',
          declarationDir: format === 'esm' ? outputDir : undefined,
          rootDir: path.join(packagePath, 'src'),
          exclude: ['node_modules', 'dist'],
          allowSyntheticDefaultImports: true,
          esModuleInterop: true
        }),
        postcss({
          extract: true,
          minimize: process.env.NODE_ENV === 'production'
        }),
        ...(process.env.NODE_ENV === 'production' ? [terser()] : [])
      ],
      external: format === 'iife' ? [] : Object.keys(packageJson.dependencies || {})
    };

    configs.push(config);
  });

  return configs;
}

/**
 * 获取所有需要构建的包
 * @param {string} packagesDir - packages目录路径
 * @returns {Array} 包信息数组
 */
export function getPackages(packagesDir) {
  const packages = [];
  const packagesPath = path.resolve(packagesDir);
  
  if (!fs.existsSync(packagesPath)) {
    throw new Error(`Packages directory not found: ${packagesPath}`);
  }

  const items = fs.readdirSync(packagesPath);
  
  items.forEach(item => {
    const packagePath = path.join(packagesPath, item);
    const stat = fs.statSync(packagePath);
    
    if (stat.isDirectory()) {
      const packageJsonPath = path.join(packagePath, 'package.json');
      
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        
        if (packageJson.buildOptions) {
          packages.push({
            name: item,
            path: packagePath,
            buildOptions: packageJson.buildOptions
          });
        }
      }
    }
  });

  return packages;
}
