---
title: 在 Mac/Linux 上从源码安装 ALPS
description: "ALPS 安装指南"
weight: 2
toc: true
cascade:
    type: docs
---

在大多数情况下，建议[通过二进制包安装 ALPS](../binary)。但若需更多用户控制和配置，从源码安装可能是更好的选择。
{{% steps %}}

### 安装必要依赖项

ALPS 依赖多个外部库。  
请根据系统选择 **一个** MPI 实现和 **一个** BLAS 提供方：

| 依赖项     | 最低版本       | 安装包                  |
|------------|----------------|-------------------------|
| HDF5       | 1.10.0         | `libhdf5-dev`           |
| CMake      | 3.18           | `cmake`                 |
| C++ 编译器 | GCC 10.5.0 或 Clang 13.0.1 | `build-essential`      |
| Boost      | 1.76 <br>*(若 NumPy ≥ 2.0 需 1.87)* | 见下文 |
| MPI        | OpenMPI 4.0 **或** MPICH 4.0 | `libopenmpi-dev` / `libmpich-dev` |
| BLAS       | 0.3            | `libopenblas-dev`       |
| Python     | 3.9            | [python.org](https://www.python.org/) |

<br>

<details>
<summary><strong> Ubuntu / Debian / WSL</strong> </summary>

```ShellSession
sudo apt update
sudo apt install build-essential cmake \
                   libhdf5-dev \
                   libopenblas-dev \
                   libopenmpi-dev openmpi-bin # 或: libmpich-dev mpich

# 安装 Python 库:
pip install numpy scipy
# 或
python3 -m pip install numpy scipy
```

> **请勿通过 `apt` 安装 Boost。** ALPS 必须从源码编译 Boost，原因有二：
> 1. **自定义编译器标志** — ALPS 需要 `-DBOOST_NO_AUTO_PTR` 和 `-DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF` 以兼容 C++17/20；`libboost-dev` 软件包不设置这些标志，会导致链接错误。
> 2. **Python ABI 匹配** — `Boost.Python` 组件必须针对 ALPS 使用的同一 Python 解释器进行编译。预构建软件包针对系统 Python，若使用其他解释器则会出现不匹配。
>
> CMake 会自动处理：若未设置 `Boost_SRC_DIR`，则在配置时下载并编译 Boost 1.87（需要网络连接）。如需离线构建，请参阅下方编译步骤中的替代方案。
</details>

<details>
<summary><strong> macOS (通过 Homebrew)</strong> </summary>

```ShellSession
brew update
brew install cmake hdf5 \
               openblas open-mpi # 或: mpich

# 安装 Python 库:
pip3 install numpy scipy
```

> **请勿通过 Homebrew 安装 Boost。** ALPS 必须从源码编译 Boost，原因有二：
> 1. **自定义编译器标志** — ALPS 需要 `-DBOOST_NO_AUTO_PTR` 和 `-DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF` 以兼容 C++17/20；Homebrew 的 `boost` formula 不设置这些标志，会导致链接错误。
> 2. **Python ABI 匹配** — `Boost.Python` 组件必须针对 ALPS 使用的同一 Python 解释器进行编译。Homebrew Boost 针对 Homebrew 自带的 Python，与其他解释器会出现不匹配。
>
> CMake 会自动处理：若未设置 `Boost_SRC_DIR`，则在配置时下载并编译 Boost 1.87（需要网络连接）。如需离线构建或复用已解压的存档，请先手动下载：
> ```ShellSession
> curl -LO https://archives.boost.io/release/1.87.0/source/boost_1_87_0.tar.gz
> tar -xzf boost_1_87_0.tar.gz
> ```
</details>

<details>
<summary><strong> macOS (通过 MacPorts)</strong> </summary>

```ShellSession
sudo port selfupdate
sudo port install cmake \
                   hdf5 \
                   OpenBLAS \
                   openmpi-clang20   # 请参阅下方关于选择变体的说明
sudo port select --set mpi openmpi-clang20-fortran

# 安装 Python 库:
pip3 install numpy scipy
```

> **选择 OpenMPI 变体：** MacPorts 为每个编译器版本提供独立的端口，命名为 `openmpi-<compiler><version>`（例如 `openmpi-clang20`、`openmpi-gcc15`）。上示的 `clang20` 变体对应 LLVM Clang 20 端口，可与 Xcode 的 Apple Clang 共存。若使用不同编译器，请安装对应变体并相应调整 `port select` 命令。
>
> `port select` 步骤是必须的：若不执行此步骤，CMake 搜索的裸 `mpirun`、`mpicc`、`mpicxx` 包装器将不存在。

> **请勿通过 MacPorts 安装 Boost。** ALPS 必须从源码编译 Boost，原因有二：
> 1. **自定义编译器标志** — ALPS 需要 `-DBOOST_NO_AUTO_PTR` 和 `-DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF` 以兼容 C++17/20；MacPorts 的 `boost` 端口不设置这些标志，会导致链接错误。
> 2. **Python ABI 匹配** — `Boost.Python` 组件必须针对 ALPS 使用的同一 Python 解释器进行编译。MacPorts Boost 针对 MacPorts 自带的 Python，与其他解释器会出现不匹配。
>
> CMake 会自动处理：若未设置 `Boost_SRC_DIR`，则在配置时下载并编译 Boost 1.87（需要网络连接）。如需离线构建或复用已解压的存档，请先手动下载：
> ```ShellSession
> curl -LO https://archives.boost.io/release/1.87.0/source/boost_1_87_0.tar.gz
> tar -xzf boost_1_87_0.tar.gz
> ```
</details>

### 验证依赖项

```ShellSession
gcc -v              # 必须 ≥ 10.5.0
cmake --version     # 必须 ≥ 3.18
mpirun --version    # 需为 OpenMPI 4.0 或 MPICH 4
python3 --version   # 必须 ≥ 3.9
python3 -c "import numpy, scipy; print('numpy', numpy.__version__, 'scipy', scipy.__version__)"
```

> **macOS — CMake 将使用哪个 Python？** macOS 上的 CMake 在搜索 `$PATH` 之前会先搜索 Apple 的框架路径，即使通过 Homebrew 或 MacPorts 安装了更新版本的 Python，也可能默认选择 Xcode 自带的 Python 3.9。在 `cmake` 配置时，请查找如下输出行：
> ```
> -- Found Python: /path/to/python (found version "X.Y.Z")
> ```
> 若路径或版本不符合预期，请在 `cmake` 命令中添加 `-DPython3_EXECUTABLE=/path/to/your/python3` 显式指定。典型路径为 `/opt/homebrew/bin/python3`（Homebrew）或 `/opt/local/bin/python3`（MacPorts）。请确保 CMake 使用的 Python 已安装 `numpy` 和 `scipy`。

### 下载与编译

现在可以下载并编译 ALPS 库。在以下命令中，请将 `</path/to/install/dir>` 替换为您系统的实际安装目录。

> **运行这些命令之前，请注意以下两个预期等待：**
> 1. **`cmake` 配置（约 1–3 分钟）：** CMake 在配置时会静默下载 Boost 1.87（约 130 MB）。下载完成前终端将无任何输出，等待一两分钟是正常的，请勿中断。
> 2. **`cmake --build`（5–20 分钟）：** 即使使用全部 CPU 核心，从源码编译 ALPS 和 Boost 也需要数分钟。终端将持续打印编译输出——这也是正常现象。

```ShellSession
git clone https://github.com/alpsim/ALPS alps-src
cmake -S alps-src -B alps-build                                     \
     -DCMAKE_INSTALL_PREFIX=</path/to/install/dir>                  \
     -DCMAKE_CXX_FLAGS="-DBOOST_NO_AUTO_PTR                         \
     -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF"
# ^ Boost（约 130 MB）在此处下载；1–3 分钟内无输出属正常
cmake --build alps-build -j$(nproc 2>/dev/null || sysctl -n hw.logicalcpu)
cmake --build alps-build -t test
```

> **`-j` 控制并行编译数。** 上述表达式在 Linux（`nproc`）和 macOS（`sysctl -n hw.logicalcpu`）上均可自动使用全部逻辑 CPU 核心。也可手动指定，如 8 核时使用 `-j 8`。

> **离线或低速连接构建：** 默认情况下 CMake 在配置时下载 Boost 1.87。如需避免下载，请先手动解压存档并指定路径：
> ```ShellSession
> cmake -S alps-src -B alps-build                                     \
>        -DCMAKE_INSTALL_PREFIX=</path/to/install/dir>                  \
>        -DBoost_SRC_DIR=</path/to/boost_1_87_0>                        \
>        -DCMAKE_CXX_FLAGS="-DBOOST_NO_AUTO_PTR                         \
>        -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF"
> ```

### 故障排除
<details>

* **需使用其他 MPI/BLAS？** <br> 将上述包名替换为您集群的模块（如 [Intel MKL/OneAPI](https://www.intel.com/content/www/us/en/developer/tools/oneapi/onemkl.html), [AMD AOCL](https://www.amd.com/en/developer/aocl.html) 等）。[CMake](https://cmake.org/) 会自动定位这些包并生成编译指令。
* **Python 错误** <br> 请确保 Python ≥ 3.9 已安装，且 `numpy` 和 `scipy` 安装在 CMake 所选的同一 Python 下。在 macOS 上，CMake 可能选择 Xcode 自带的 Python 而非 Homebrew/MacPorts 的 Python——请检查 CMake 输出中的 `Found Python:` 行，必要时使用 `-DPython3_EXECUTABLE=/path/to/python3` 指定解释器（参见[验证依赖项](#验证依赖项)步骤）。
* **MPI 版本不匹配？** <br> 确保 CMake 使用的 MPI 版本与 `mpirun --version` 一致。
* **Boost 错误** <br> 针对 NumPy ≥ 2.0 构建 ALPS Python 绑定需要 Boost ≥ 1.87（NumPy 2.0 引入的 API 变更仅 Boost 1.87+ 支持）。Boost 1.76–1.86 仅支持 NumPy < 2.0。已测试的编译器/Boost/Python 组合请参阅编译说明。

</details>

#### 编译说明

{{% tabs %}}
{{% tab name="Linux" %}}
以下 Boost、Python 和 C++ 编译器的组合已通过测试：
  - GCC 10.5.0, Python 3.9.19 (NumPy < 2.0), `Boost` 1.76.0
  - GCC 11.4.0, Python 3.10.14 (NumPy < 2.0), `Boost` 1.81.0, 1.86.0
  - GCC 12.3.0, Python 3.10.14 (NumPy < 2.0), `Boost` 1.81.0, 1.86.0
  - Clang 13.0.1, Python 3.10.14 (NumPy < 2.0), `Boost` 1.81.0, 1.86.0
  - Clang 14.0.0, Python 3.10.14 (NumPy < 2.0), `Boost` 1.81.0, 1.86.0
  - Clang 15.0.7, Python 3.10.14 (NumPy < 2.0), `Boost` 1.81.0, 1.86.0

  **NumPy ≥ 2.0** 时，ALPS 的 Boost.Python 绑定需要 Boost 1.87.0 或更高版本（CMake 自动下载）。
{{% /tab %}}
{{% tab name="Mac" %}}
ALPS 已在 ARM 架构的 macOS 系统上通过 Apple Xcode Clang 和第三方编译器（Homebrew GCC、MacPorts GCC/Clang）使用 Boost 1.86.0+ 完成测试。

**`SDKROOT` — 何时以及如何设置**

`SDKROOT` 告知编译器 macOS 系统头文件和框架的位置。Apple 的 Clang（安装 Xcode 或 Command Line Tools 后可用的 `cc`/`c++`）会自动定位 SDK——**使用 Apple Clang 时无需设置 `SDKROOT`**。

第三方编译器（Homebrew GCC、MacPorts GCC 或 LLVM Clang 等）无法自动找到 SDK，会因缺少系统头文件而构建失败。运行 `cmake` 之前，请设置：

```ShellSession
export SDKROOT=$(xcrun --show-sdk-path)
```

`xcrun --show-sdk-path` 无论安装了哪个版本的 Xcode 或 Command Line Tools，始终返回正确路径。请勿硬编码类似 `MacOSX14.sdk` 的版本特定路径——每次 Xcode 更新后都会失效。

要检查 CMake 将使用哪个编译器，请查看 cmake 输出开头的 `C compiler identification` 行。若显示 `AppleClang`，无需设置 `SDKROOT`；若显示 `GNU` 或 `Clang`（不含"Apple"），请按上述方式设置。

**Python 选择：** macOS 上的 CMake 在搜索 `$PATH` 之前会先搜索 Apple 框架路径，即使通过 Homebrew 或 MacPorts 安装了更新版本的 Python，也常会选择 Xcode 自带的 Python 3.9（`/Applications/Xcode.app/.../python3.9`）。请通过配置时输出的 `Found Python:` 行确认 CMake 找到的 Python。若不符合预期，请显式指定——不要依赖 `$(which python3)`，因为它仍可能指向错误的解释器。请使用完整路径：

```ShellSession
# Homebrew（Apple Silicon）:
cmake -S alps-src -B alps-build ... -DPython3_EXECUTABLE=/opt/homebrew/bin/python3

# Homebrew（Intel）:
cmake -S alps-src -B alps-build ... -DPython3_EXECUTABLE=/usr/local/bin/python3

# MacPorts:
cmake -S alps-src -B alps-build ... -DPython3_EXECUTABLE=/opt/local/bin/python3
```

无论 CMake 使用哪个 Python，请确保该 Python 已安装 `numpy` 和 `scipy`（`/path/to/that/python3 -m pip install numpy scipy`）。

{{% /tab %}}

{{% /tabs %}}

若依赖包安装在非标准路径，CMake 可能无法定位。ALPS 使用标准 CMake 机制（FindXXX.cmake）定位包，可参考：
  - MPI: 参考 [cmake with mpi](https://cmake.org/cmake/help/latest/module/FindMPI.html)
  - BLAS: 参考 [cmake with BLAS](https://cmake.org/cmake/help/latest/module/FindBLAS.html)
  - HDF5: 参考 [cmake with HDF5](https://cmake.org/cmake/help/latest/module/FindHDF5.html)

***

成功编译后需执行安装。安装路径由配置时的 `-DCMAKE_INSTALL_PREFIX=/path/to/install/directory` 参数指定，也可在安装阶段通过 `--prefix` 参数修改（参见 [cmake manual](https://cmake.org/cmake/help/latest/manual/cmake.1.html#cmdoption-cmake--install-0)）。
<br>
运行安装命令：

```ShellSession
cmake --install alps-build
```

### 配置环境

安装目录是自包含的，但您的 shell 尚不知晓其位置。ALPS 提供了一个设置脚本，可将正确目录添加到 `PATH`、`LD_LIBRARY_PATH` 和 `PYTHONPATH`。使用 ALPS 前请先加载该脚本：

```ShellSession
# bash / zsh:
source </path/to/install/dir>/bin/alpsvars.sh

# csh / tcsh:
source </path/to/install/dir>/bin/alpsvars.csh
```

为避免每次打开新终端都需执行此命令，请将 `source` 行添加到 shell 启动文件（`~/.bashrc`、`~/.zshrc` 或 `~/.cshrc`）中。

**验证安装** — 运行任一 ALPS 可执行文件：

```ShellSession
spinmc --help
```

若命令可找到并打印帮助信息，则 ALPS 安装和环境配置均已成功。

{{% /steps %}}
