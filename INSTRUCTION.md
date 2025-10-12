# monorepo 工程管理

### /apps

一般作为存放业务代码的目录

#### /apps/front-end

用来存放前端代码

##### /apps/front-end/mobile

##### /apps/front-end/web

文件夹可以任意组织任意编排， 看实际需要

#### /apps/back-end

用来存放后端代码

### /packages

一般作为存放公共代码的目录

#### /packages/cli

命令行工具函数，用来提供一些常用的命令行工具函数

#### /packages/core

核心函数库，用来提供一些常用的核心函数

#### /packages/components

组件库，用来提供一些常用的组件

### pnpm-workspace.yaml

用来配置 pnpm 工作空间的文件

```yaml
packages:
    - 'apps/*'
    - 'packages/*'
```

packages 的字段是告诉 pnpm 哪些是子包；

#### pnpm --workspace-root init

用来初始化工作空间的根目录, 执行完成后，会生成对应的 package.json 文件：

```json
{
    "name": "monorepo-practice",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "packageManager": "pnpm@10.6.1"
}
```

值得注意的是，使用了--workspace-root 初始化的根目录，是没有 package-lock.json 文件的， 因为根目录不是一个普通的 npm 包， 只是一个工作空间的根目录。并且可以在项目的任意一级目录执行，都会在根目录下生成 package.json 除非你不再使用--workspace-root 参数。

#### pnpm -C <子包目录> <命令>

用来在指定的子包目录下执行 pnpm 命令， 例如：

```bash
pnpm -C apps/front-end/web install
```

会在 apps/front-end/web 目录下执行 install 命令， 安装依赖。

### monorepo 解决什么问题

#### 1. 版本锁定

在传统的 npm 项目中，每个依赖包都有自己的 package.json 文件， 而每个 package.json 文件都有自己的依赖版本。 这就导致了一个问题， 就是当你在不同的项目中使用同一个依赖包时， 可能会因为依赖版本不同而导致问题。

而在 monorepo 中， 所有的依赖包都被放到了一个统一的目录下， 每个依赖包都有自己的 package.json 文件， 但是这些 package.json 文件都指向了同一个版本的依赖包。 这就解决了版本锁定的问题。
**凡是要对很多子包做统一管理的，都必须在根目录下的 package.json 文件中进行配置。** ，举例：

```json
{
    "engines": {
        "node": ">=18",
        "pnpm": ">=10.6.1",
        "npm": ">=9.4.0"
    }
}
```

在根目录中安装依赖包时可以使用`pnpm install -D -w <依赖包>` 来安装依赖包，这里的-w 表示在工作空间的根目录下安装依赖包是--workspace-root 的简写形式 ， 例如：

```bash
pnpm install -D -w typescript
pnpm install -Dw @types/node
```

以上两种都可以。如果想要严格进行版本控制，可以在根目录下的 .npmrc 文件中添加 engines-strict=true 来开启严格版本控制。

##### 以 typescript 为例

执行完上面的安装命令后，在根目录创建 tsconfig.json 文件, 对所有子包生效。 假如子包需要单独配置 tsconfig.json 文件， 可以在子包目录下创建 tsconfig.json 文件， 这样就可以对子包进行单独的配置。 例如：

```json
{
    "extends": "../../tsconfig.json",
    "compilerOptions": {
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "lib": ["ES2022"],
        "types": ["node"]
    }
}
```

#### 2. 代码风格与质量检查

##### prettier

根目录下的.prettierrc 也是所有子包共享，同 tsconfig.json 一样， 可以在根目录下创建.prettierrc 文件， 来对所有子包生效。

##### eslint

与 prettier 作用不同， eslint 主要用来检查代码质量， 而 prettier 主要用来格式化代码。 所以在 monorepo 中， 一般会在根目录下创建 .eslintrc.json 文件， 来对所有子包生效。(具体的 eslint 包请根据 packages.json 中的包去查看官方资料)

#### 3. 代码提交规范

##### commitizen

执行 `pnpm add -Dw @commitlint/cli @commitlint/config-conventional commitizen cz-git` , 在 package.json 中的 scripts 中添加：

```json
{
    "commit": "git-cz"
}
```

##### husky

主要是和 git hooks 相关， 用来在提交代码时进行检查。 例如： 检查代码是否符合 eslint 规范， 检查代码是否符合 prettier 规范等。

执行 `pnpm add -Dw husky` , 然后在根目录下执行 `pnpx husky init` 来初始化 husky。

##### lint-staged

lint-staged 是用来在 git 提交前对**暂存**的文件进行检查的工具。 例如： 检查暂存的文件是否符合 eslint 规范， 检查暂存的文件是否符合 prettier 规范等。

执行 `pnpm add -Dw lint-staged` , 然后在根目录下创建 .lintstagedrc.json 文件， 来配置 lint-staged 检查的规则。 例如：

```json
{
    "*.{js,ts,mjs,cjs,json,tsx,css,less,scss,vue,html,md}": ["eslint --fix", "prettier --write"]
}
```

### 公共包打包

在 monorepo 中， 可以将一些公共的包放到 packages 目录下， 这些包可以被其他子包间依赖。 例如： 可以将一些常用的工具函数、 组件、 样式等放到 packages 目录下， 其他子包间可以依赖这些包。

### 子包间依赖

在 monorepo 中， 可以在子包间依赖公共包。 例如： 可以在 apps/front-end/web 目录下的 package.json 文件中添加：

```json
{
    "dependencies": {
        "shared-utils": "workspace:*"
    }
}
```

这里的 workspace:\* 表示依赖的是根目录下的 packages/shared-utils 包。

### 单元测试

### 发布

#### notes

##### 如何建立包依赖

1. package.json文件中除了官方定义的字段，你还可以写一些自定义的字段
   当前components目录下的package.json文件中添加了buildOptions字段，其中的name字段是用来针对iife格式的打包，因为iife格式的打包会将代码包裹在一个立即执行函数中，所以需要指定一个全局变量名，来避免与其他代码冲突。
2. 发布时需要注意的是， 发布的包必须是已经构建过的， 否则会发布失败。 所以在发布前需要先执行构建命令。
3. 建立包依赖： 假设components依赖core包，请在components的packages.json中添加：

```json
"dependencies": {
        "monorepo-practice/core": "workspace:*"
}
```

‘\*’的意思是随便是什么版本，你core包的package.json文件中定义的版本，都可以安装。执行完pnpm install后，components包会自动安装core包的最新版本，nodemodules目录下会有core包的最新版本。
但是，这种写法在本地开发的时候没问题，后续要发布到npm仓库时，会报错，因为npm仓库不支持workspace:\*的写法。所以，**在发布前，需要将components包的dependencies中的monorepo-practice/core的版本号，手动指定为core包的最新版本**， 但是这一块操作pnpm会帮你完成。

在使用的时候，当你按照`import {xxx} from 'monorepo-practice/core'`时，可能会找不到入口文件，这就需要你在core包的package.json文件中添加module字段，指定core包的入口文件。例如：

```json
{
    "main": "index.js",

    "type": "module",
    "module": "./dist/index.esm.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "buildOptions": {
        "name": "MonorepoPracticeCore",
        "formats": ["esm", "cjs", "iife"]
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "packageManager": "pnpm@10.6.1"
}
```

光有module的入口文件声明还不够，还需要你进行类型声明：

```json
{
    "types": "./dist/index.d.ts"
}
```

完成这些配置后，你就可以在components包中使用core包的代码了。

##### 如何统一测试

使用vitest来进行测试， 可以在根目录下的vitest.config.js文件中配置测试的相关选项。
首先执行`pnpm add -Dw vitest @vitest/browser vitest-browser-vue vue` 来安装vitest包。
安装完毕后需要在package.json文件中添加scripts字段，来配置测试命令。例如：

```json
{
    "scripts": {
        "test": "vitest"
    }
}
```

回去找到名为“**test**”的目录， 里面包含了所有的测试文件。
在项目根目录下新建vitest.config.js文件， 来配置vitest的相关选项。例如：

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        setupFiles: './__test__/setup.js'
    }
});
```

以单文件组件.vue举例，最好在里面给元素加上‘data-testid’属性， 用来在测试中定位元素。测试文件往往通过getByTestId来定位元素。 例如：

```vue
<template>
    <div data-testid="test-div">
        <p data-testid="test-p">Hello World</p>
    </div>
</template>
```

在打包的时候需要通过vue插件将data-testid属性移除， 因为在生产环境中， 这些属性是没有用的， 会增加页面的体积。

##### 如何发布

###### 业务代码发布

###### 公共库发布

以发布到npm仓库为例，假设你要发布的公共库是core包， 你需要在core包的package.json文件中添加publishConfig字段， 来指定发布到npm仓库的相关选项。例如：

```json
{
    "publishConfig": {
        "registry": "https://registry.npmjs.org/"
    }
}
```

在scripts字段中添加`"publish: core": "pnpm --filter monorepo-practice/core publish"`, 来发布core包。(ps: --filter 是pnpm的一个命令， 用来过滤出指定的包; 发布的时候会遇到git checks的问题， 可以通过添加--no-git-checks参数来解决)
这里的registry字段指定了发布到npm仓库的地址。
前往core包目录下做一些配置：进入package.json文件，添加files字段，指定要发布的文件。例如：

```json
{
    "files": ["dist"],
    "publishConfig": {
        "access": "public"
    }
}
```

添加publishConfig字段，指定发布的访问权限为public, 这样就不用付费了
接下来就是发布流程：

1. 执行npm login， 登录npm仓库。
2. 执行npm whoami， 确认登录成功。
3. 执行pnpm publish:core， 发布core包。

使用**RUSH**来进行版本管理， 可以在根目录下的rush.json文件中配置版本管理的相关选项。
