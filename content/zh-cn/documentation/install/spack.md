
---
title: 通过 Spack 包在 Mac/Linux 上安装 ALPS
description: "ALPS Spack 安装"
weight: 3
toc: true
cascade:
    type: docs
---

### Spack 安装
如果您计划使用 ALPS 的并行版本或在超级计算环境中运行 ALPS，除了[源码安装](../source)外，您也可以通过 [Spack 包管理工具](https://packages.spack.io) 进行安装。我们建议您查看 [Spack 中的 ALPS 包详情](https://packages.spack.io/package.html?name=alps) 以及 [Spack 文档](https://spack.readthedocs.io/en/latest/index.html)。

Spack 能够自动确定 ALPS 的依赖项，并安装 ALPS 所需的正确版本。该安装也是针对每个用户在各自的主目录中进行的，因此不会影响同一计算机集群中的其他用户。

### 安装步骤

首先，需要从 GitHub 仓库克隆 Spack： 
```
git clone --depth=2 https://github.com/spack/spack.git
```
这将创建一个名为 spack 的目录。您可以根据您的 shell 类型加载相应的脚本。 

对于 bash、zsh 和 sh 用户：
```
. spack/share/spack/setup-env.sh
```
对于 csh 和 tcsh 用户：
```
source spack/share/spack/setup-env.csh
```

接下来，Spack 需要找到您计算机中所有可用的编译器：
```
spack compiler find
```
此命令将让 Spack 检测系统中所有可用的编译器，并在您主目录下的隐藏目录 `.spack` 中创建一个 `packages.yaml` 文件。您可以使用以下命令查看或编辑它：
```
spack config edit packages
```
或者，您可以通过以下命令查看可用的编译器：
```
spack compilers
```
所需的最低编译器版本为 `gcc@10.5.0` 和 `clang@13.0.1`。

我们可以查看一下 Spack 中 ALPS 的信息页面：
```
spack info alps
```
它将显示 ALPS 的包依赖关系。所有相关包都将通过 Spack 的包管理系统自动安装。

最后，让我们安装 ALPS！
```
spack install alps
```

### 故障排除
<details>
<summary><strong> Boost 库问题 </strong> </summary>

在 Spack 的 Boost 包中，其变量 `cxxstd` 的默认值是 "11"，这与 ALPS 要求的 `C++14` 标准 不一致。您可以在以下位置的 `package.py` 文件中编辑此默认值：
```
~/.spack/package_repos/fncqgg4/repos/spack_repo/builtin/packages/boost/package.py
```
或者，如果不更改包的默认值，您可以在命令行中设置该变量的值：
```
spack install alps ^boost@1.87.0 cxxstd=14
```
这将以 `C++14` 标准编译 Boost 库。

</details>




