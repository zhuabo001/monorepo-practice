#!/bin/bash

# Rush 初始化脚本
# 这个脚本帮助设置 Rush 环境并验证配置

echo "🚀 开始 Rush 初始化..."

# 检查 Node.js 版本
node_version=$(node --version)
echo "📦 Node.js 版本: $node_version"

# 检查 Rush 是否已安装
if ! command -v rush &> /dev/null; then
    echo "❌ Rush 未安装，正在安装..."
    npm install -g @microsoft/rush
fi

echo "✅ Rush 版本: $(rush --version)"

# 验证 Rush 配置
echo "🔍 验证 Rush 配置..."
rush check

if [ $? -eq 0 ]; then
    echo "✅ Rush 配置验证通过"
else
    echo "❌ Rush 配置验证失败"
    exit 1
fi

# 安装依赖
echo "📥 安装项目依赖..."
rush update

if [ $? -eq 0 ]; then
    echo "✅ 依赖安装成功"
else
    echo "❌ 依赖安装失败"
    exit 1
fi

# 构建项目
echo "🔨 构建所有项目..."
rush build

if [ $? -eq 0 ]; then
    echo "✅ 项目构建成功"
else
    echo "❌ 项目构建失败"
    exit 1
fi

# 运行测试
echo "🧪 运行测试..."
rush test

if [ $? -eq 0 ]; then
    echo "✅ 测试通过"
else
    echo "❌ 测试失败"
    exit 1
fi

echo "🎉 Rush 初始化完成！"
echo ""
echo "📖 常用命令:"
echo "  rush change              # 创建变更文件"
echo "  rush version --bump      # 更新版本号"
echo "  rush publish             # 发布新版本"
echo "  rush build               # 构建所有项目"
echo "  rush test                # 运行所有测试"
echo ""
echo "📚 查看完整文档: docs/rush-guide.md"