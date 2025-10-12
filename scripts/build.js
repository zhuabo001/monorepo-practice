#!/usr/bin/env node

// 专门用于代码统一化管理的脚本(只针对公共库packages)
// 本工程使用rollup进行打包(后期尝试使用rspack来进行打包)

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { rollup } from 'rollup';
import { generateRollupConfigs, getPackages } from './buildBase.js';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);
const rootDir = path.resolve(__dirname, '..');

async function buildPackage(packageInfo) {
  const { name, path: packagePath, buildOptions } = packageInfo;
  
  console.log(`🔄 Building package: ${name}`);
  
  try {
    const configs = generateRollupConfigs(packagePath, buildOptions);
    
    for (const config of configs) {
      const bundle = await rollup(config);
      
      try {
        await bundle.write(config.output);
        console.log(`✅ Built ${config.output.format}: ${config.output.file}`);
      } finally {
        await bundle.close();
      }
    }
    
    console.log(`✨ Package ${name} built successfully!`);
  } catch (error) {
    console.error(`❌ Failed to build package ${name}:`, error.message);
    throw error;
  }
}

async function buildAll() {
  console.log('🚀 Starting build process...\n');
  
  try {
    const packages = getPackages(path.join(rootDir, 'packages'));
    
    if (packages.length === 0) {
      console.log('⚠️  No packages found with buildOptions');
      return;
    }
    
    console.log(`📦 Found ${packages.length} packages to build:\n`);
    packages.forEach(pkg => console.log(`   - ${pkg.name}`));
    console.log('');
    
    // 按顺序构建包（避免并行构建可能的问题）
    for (const packageInfo of packages) {
      await buildPackage(packageInfo);
      console.log('');
    }
    
    console.log('🎉 All packages built successfully!');
  } catch (error) {
    console.error('💥 Build process failed:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  buildAll();
}
