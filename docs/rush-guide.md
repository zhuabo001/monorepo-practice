# Rush 版本管理使用指南

本项目使用 [Rush](https://rushjs.io/) 进行 monorepo 版本管理和发布控制。

## 🚀 快速开始

### 1. 安装 Rush
```bash
npm install -g @microsoft/rush
```

### 2. 初始化项目
```bash
# 安装所有依赖
rush update

# 构建所有项目
rush build

# 运行所有测试
rush test
```

## 📦 版本管理

### 版本策略
我们在 `rush.json` 中配置了以下版本策略：

- **backendPolicy**: 后端项目的版本策略
- **frontendPolicy**: 前端项目的版本策略  
- **componentsPolicy**: 组件库的版本策略
- **corePolicy**: 核心库的版本策略

每个策略都使用 `lockStepVersion` 模式，确保相关项目版本同步递增。

### 🔢 版本号自动递增

#### 1. 创建变更文件
在进行版本发布前，必须为每个变更创建变更文件：

```bash
rush change
```

此命令会：
- 询问每个变更的类型（major/minor/patch/none）
- 生成变更描述文件到 `common/changes/` 目录
- 这些文件将用于自动更新版本号

#### 2. 更新版本号
```bash
rush version --bump --target-branch develop
```

此命令会：
- 根据变更文件自动计算新版本号
- 更新所有相关项目的 package.json 文件
- 生成 CHANGELOG.md 文件
- 删除已处理的变更文件

#### 3. 发布版本
```bash
rush publish --apply --publish --include-all --target-branch develop
```

此命令会：
- 应用版本号变更
- 发布到 npm 仓库
- 创建 git 标签
- 推送到远程仓库

## 🔄 完整发布流程

### 标准发布流程
```bash
# 1. 确保代码是最新的
git checkout develop
git pull origin develop

# 2. 创建变更文件
rush change

# 3. 构建项目
rush build

# 4. 运行测试
rush test

# 5. 更新版本号
rush version --bump --target-branch develop

# 6. 发布到 npm
rush publish --apply --publish --include-all --target-branch develop

# 7. 提交变更
git add .
git commit -m "chore: release new versions"
git push origin develop
```

### 热修复流程
```bash
# 1. 从主分支创建热修复分支
git checkout main
git checkout -b hotfix/fix-critical-bug

# 2. 修复问题并提交
# ... 进行修复 ...
git commit -m "fix: critical bug fix"

# 3. 创建变更文件（选择 patch 类型）
rush change

# 4. 更新版本号（patch 递增）
rush version --bump --target-branch hotfix/fix-critical-bug

# 5. 发布热修复版本
rush publish --apply --publish --include-all --target-branch hotfix/fix-critical-bug

# 6. 合并回主分支和开发分支
git checkout main
git merge hotfix/fix-critical-bug
git checkout develop
git merge hotfix/fix-critical-bug

# 7. 推送所有变更
git push origin main develop
```

## 📋 常用命令

### 依赖管理
```bash
rush update              # 安装/更新所有依赖
rush check               # 检查依赖一致性
rush purge               # 清理所有依赖缓存
```

### 构建和测试
```bash
rush build               # 构建所有项目
rush rebuild             # 清理并重新构建所有项目
rush test                # 运行所有测试
rush test --coverage     # 运行测试并生成覆盖率报告
rush lint                # 运行代码检查
rush clean               # 清理所有构建产物
```

### 发布相关
```bash
rush change              # 创建变更文件
rush version --bump      # 更新版本号
rush publish             # 发布新版本
rush change --verify     # 验证变更文件
```

### 项目信息
```bash
rush list                # 列出所有项目
rush list --json         # 以 JSON 格式列出项目信息
rush inspect             # 检查项目依赖关系
```

## 🎯 版本策略详解

### Lock Step Version（同步版本）
所有使用相同策略的项目会保持版本号一致：

```json
{
  "versionPolicies": [
    {
      "policyName": "corePolicy",
      "definitionName": "lockStepVersion",
      "version": "1.0.0",
      "nextBump": "patch"
    }
  ]
}
```

### Individual Version（独立版本）
每个项目可以有自己的版本号：

```json
{
  "versionPolicies": [
    {
      "policyName": "individualPolicy",
      "definitionName": "individualVersion",
      "lockedMajor": 1
    }
  ]
}
```

## ⚠️ 注意事项

1. **变更文件必须创建** - 每次发布前都必须运行 `rush change`
2. **版本号自动管理** - 不要手动修改 package.json 中的版本号
3. **发布前测试** - 始终在发布前运行完整的构建和测试流程
4. **分支策略** - 确保在正确的分支上进行发布操作
5. **权限管理** - 确保有 npm 发布权限和 git 推送权限

## 🔧 故障排除

### 常见问题

1. **rush change 没有检测到变更**
   - 确保变更已提交到 git
   - 检查 git 状态是否干净

2. **版本号没有递增**
   - 确认变更文件已创建
   - 检查变更类型是否正确

3. **发布失败**
   - 检查 npm 权限
   - 验证网络连接
   - 确认版本号没有冲突

### 调试命令
```bash
rush --debug change           # 调试模式运行
rush --verbose publish        # 详细输出模式
rush list --json | jq .       # 查看项目结构
```

## 📚 相关文档

- [Rush 官方文档](https://rushjs.io/)
- [Rush 版本管理](https://rushjs.io/pages/maintainer/version_management/)
- [Rush 发布流程](https://rushjs.io/pages/maintainer/publishing/)
- [变更日志配置](https://rushjs.io/pages/configs/changelog_config_json/)