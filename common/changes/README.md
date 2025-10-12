# 变更类型说明
# 
# 在运行 "rush change" 时，您需要为您的变更选择以下类型之一：
#
#  - major - 包含破坏性变更，会导致版本号的主版本号递增 (1.0.0 -> 2.0.0)
#  - minor - 包含新功能，会导致版本号的次版本号递增 (1.0.0 -> 1.1.0)  
#  - patch - 包含 bug 修复，会导致版本号的修订号递增 (1.0.0 -> 1.1.1)
#  - none - 不需要发布，不会导致版本号变更
#
# 重要提示：
#  - "rush publish" 命令会根据这些变更文件自动更新版本号
#  - 每次发布前都需要运行 "rush change" 创建变更文件
#  - 变更文件应该提交到 git 仓库中

## 示例工作流程：

### 1. 开发完成后创建变更文件
# rush change

### 2. 构建项目
# rush build

### 3. 运行测试
# rush test

### 4. 发布版本（自动递增版本号）
# rush publish --apply --publish --include-all --target-branch develop

### 5. 或者手动更新版本
# rush version --bump --target-branch develop