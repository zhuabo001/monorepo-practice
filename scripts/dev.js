#!/usr/bin/env node

// 开发模式脚本，使用watch模式监听文件变化并自动重新打包
// 本工程使用rollup进行打包(后期尝试使用rspack来进行打包)

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { rollup, watch } from 'rollup';
import { generateRollupConfigs, getPackages } from './buildBase.js';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);
const rootDir = path.resolve(__dirname, '..');

// 存储watch实例
const watchers = new Map();

/**
 * 创建包的watch配置
 */
function createWatchConfigs(packageInfo) {
  const { name, path: packagePath, buildOptions } = packageInfo;
  const rollupConfigs = generateRollupConfigs(packagePath, buildOptions);
  
  return rollupConfigs.map(config => ({
    ...config,
    output: {
      ...config.output,
      sourcemap: 'inline' // 开发模式使用内联sourcemap
    },
    plugins: [
      ...config.plugins.filter(plugin => plugin.name !== 'terser'), // 移除terser插件
      {
        name: 'watch-reporter',
        buildStart() {
          console.log(`👀 Watching ${name} for changes...`);
        },
        buildEnd() {
          console.log(`✅ ${name} rebuilt successfully`);
        }
      }
    ],
    watch: {
      include: path.join(packagePath, 'src/**'),
      exclude: ['node_modules/**', 'dist/**'],
      clearScreen: false
    }
  }));
}

/**
 * 启动单个包的watch模式
 */
async function watchPackage(packageInfo) {
  const { name } = packageInfo;
  
  console.log(`🔄 Setting up watch for package: ${name}`);
  
  try {
    const watchConfigs = createWatchConfigs(packageInfo);
    
    const watcher = watch(watchConfigs);
    
    watcher.on('event', (event) => {
      switch (event.code) {
        case 'START':
          console.log(`🔄 ${name} build started...`);
          break;
        case 'BUNDLE_START':
          console.log(`📦 ${name} bundling started...`);
          break;
        case 'BUNDLE_END':
          console.log(`✅ ${name} bundled in ${event.duration}ms`);
          break;
        case 'END':
          console.log(`🎉 ${name} build completed!`);
          break;
        case 'ERROR':
          console.error(`❌ ${name} build error:`, event.error);
          break;
        default:
          break;
      }
    });
    
    watchers.set(name, watcher);
    console.log(`👀 Watching ${name} for changes...`);
    
  } catch (error) {
    console.error(`❌ Failed to setup watch for package ${name}:`, error.message);
    throw error;
  }
}

/**
 * 清理函数
 */
function cleanup() {
  console.log('\n🛑 Shutting down watchers...');
  
  watchers.forEach((watcher, name) => {
    console.log(`Stopping watcher for ${name}...`);
    watcher.close();
  });
  
  watchers.clear();
  console.log('👋 All watchers stopped. Goodbye!');
  process.exit(0);
}

/**
 * 启动所有包的watch模式
 */
async function watchAll() {
  console.log('🚀 Starting development mode with watch...\n');
  
  try {
    const packages = getPackages(path.join(rootDir, 'packages'));
    
    if (packages.length === 0) {
      console.log('⚠️  No packages found with buildOptions');
      return;
    }
    
    console.log(`📦 Found ${packages.length} packages to watch:\n`);
    packages.forEach(pkg => console.log(`   - ${pkg.name}`));
    console.log('');
    
    // 设置进程退出处理
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('exit', cleanup);
    
    // 为每个包设置watch
    for (const packageInfo of packages) {
      await watchPackage(packageInfo);
      console.log('');
    }
    
    console.log('🎉 All packages are being watched for changes!');
    console.log('💡 Press Ctrl+C to stop watching\n');
    
  } catch (error) {
    console.error('💥 Failed to setup watch mode:', error.message);
    cleanup();
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  watchAll();
}