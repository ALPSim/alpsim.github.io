
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
要使用 ALPS，我们需要加载ALPS包：
```
spack load alps
```

### 在超算集群中通过 Spack 安装
如果需要在超算集群中安装ALPS，我们建议通过提交批处理作业在计算节点上安装，而不是在登录节点上执行上述命令。由于安装过程有时耗时较长，在登录节点上安装可能会影响集群的其他用户。

我们已在以下超算集群中成功安装过 ALPS：[NCSA Delta（伊利诺伊）](https://docs.ncsa.illinois.edu/systems/delta/en/latest/index.html)、[PSC Bridges（匹兹堡）](https://www.psc.edu/resources/bridges-2/user-guide/)、[Purdue Anvil](https://www.rcac.purdue.edu/anvil#docs)、[SDSC Expanse（圣地亚哥）](https://www.sdsc.edu/systems/expanse/user_guide.html)、[TACC Stampede3（德克萨斯）](https://docs.tacc.utexas.edu/hpc/stampede3/)。请阅读相应集群的文档以了解如何提交批处理作业。下面是我们用于在 NCSA Delta 超算集群中安装 ALPS 的一个示例批处理脚本。
```
#!/bin/bash
#SBATCH --mem=16g
#SBATCH --nodes=1
#SBATCH --ntasks-per-node=1
#SBATCH --cpus-per-task=1    # <- 与 OMP_NUM_THREADS 保持一致
#SBATCH --partition=cpu      # <- 可选：gpuA100x4 gpuA40x4 gpuA100x8 gpuMI100x8
#SBATCH --account=bdhb-delta-cpu    # <- 替换为 "accounts" 命令返回的某个 "Project"
#SBATCH --job-name=installALPS
#SBATCH --time=05:00:00      # 作业运行时间 hh:mm:ss
#SBATCH --constraint="scratch"
#SBATCH -e slurm-%j.err
#SBATCH -o slurm-%j.out
### GPU 选项 ###
##SBATCH --gpus-per-node=2
##SBATCH --gpu-bind=none     # <- 或 closest
##SBATCH --mail-user=you@yourinstitution.edu
##SBATCH --mail-type="BEGIN,END" 更多邮件选项请参阅 sbatch 或 srun 手册

. spack/share/spack/setup-env.sh

spack install alps
```

## 安装视频指南

### 在 WSL 中 spack 安装 ALPS
<br>

{{< youtube id="TD7PuiJKq5U" >}}
