---
title: 构建最新开发版本（master）
description: "从 master 分支构建 ALPS"
weight: 4
toc: true
cascade:
    type: docs
---

本页面面向希望使用 `master` 分支上最新**未发布**代码的开发者和测试者，
例如为 ALPS 贡献代码，或在修复正式发布前先行试用。
`master` 变化频繁，选项、接口和依赖要求可能随提交而改变。

> **只是想使用 ALPS？** 请安装[二进制包](../binary)，或[从源码构建 v3.0.0 正式版](../source)。
> 正式版的步骤**不适用于** `master`，本页面的命令也不适用于正式版。

`master` 权威且始终最新的说明位于仓库的
[CONTRIBUTING.md](https://github.com/ALPSim/ALPS/blob/master/CONTRIBUTING.md#getting-started-with-the-code)。
如果下文与该文件不一致，请以该文件为准。本页面概述构建步骤，并列出与正式版的区别。

### 与正式版的区别

| | 正式版 v3.0.0（[源码安装](../source)） | `master` |
|---|---|---|
| Boost | CMake 自动下载并编译 Boost 1.87（离线时使用 `Boost_SRC_DIR`）；请勿自行安装 Boost | **请通过包管理器自行安装 Boost ≥ 1.76**。只需要头文件和 CMake 包配置文件。`Boost_SRC_DIR` 会被忽略 |
| 额外编译器标志 | `-DBOOST_NO_AUTO_PTR -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF` | 不需要 |
| CMake | ≥ 3.22 | ≥ 3.27 |
| Eigen | 不需要 | Eigen ≥ 3.3（应用程序中的 MaxEnt 需要） |
| MPI | 默认开启（找到时使用） | 默认关闭；使用 `-DALPS_ENABLE_MPI=ON` 开启 |
| Python（`pyalps`） | 与 C++ 代码一同构建（Boost.Python） | `python/pyalps` 中独立的 pip 包，基于已安装的 C++ SDK 构建 |
| 已移除的选项 | | `ALPS_USE_SYSTEM_BOOST`、`Boost_SRC_DIR`、`ALPS_BUILD_TESTS`、`ALPS_BUILD_LIBS_ONLY` 等会打印 “no longer supported” 警告；详见 [CHANGELOG](https://github.com/ALPSim/ALPS/blob/master/CHANGELOG.md) |

{{% steps %}}

### 安装依赖项

需要 C++17/C11 编译器（GCC 或 Clang）、CMake ≥ 3.27、Boost ≥ 1.76、HDF5 ≥ 1.10.5（C 库）、
BLAS/LAPACK、Eigen ≥ 3.3，以及用于测试和 `pyalps` 的 Python ≥ 3.10。例如：

**Ubuntu 24.04 / Debian**
```ShellSession
sudo apt-get update
sudo apt-get install build-essential cmake libboost-dev libhdf5-dev \
                     libblas-dev liblapack-dev libeigen3-dev python3-venv
```

**macOS（Homebrew）**
```ShellSession
brew install cmake boost hdf5 openblas eigen
export CMAKE_PREFIX_PATH="$(brew --prefix boost):$(brew --prefix hdf5):$(brew --prefix openblas):$(brew --prefix eigen)"
```

**macOS（MacPorts）**
```ShellSession
sudo port install cmake boost hdf5 OpenBLAS eigen3
ls /opt/local/libexec/boost/       # 记下版本目录，例如 1.87
```
然后在下面的 `cmake` 命令中加入 `-DBoost_ROOT=/opt/local/libexec/boost/<version>`。

> **较旧发行版自带的 CMake 版本过低。** Ubuntu 22.04（CMake 3.22）和 Rocky/RHEL 9（CMake 3.26）
> 均低于 3.27。请用 `python3 -m pip install "cmake>=3.27"` 在 Python 环境中安装较新的 CMake。
> Rocky/RHEL 9 自带的 Boost 为 1.75，低于 1.76，因此请另行安装较新的 Boost
> （例如通过 Spack 或从 [boost.org](https://www.boost.org/) 获取），并用 `-DBoost_ROOT` 指定。

> **CMake 报告 `Could not find a package configuration file provided by "Boost"`？**
> CMake 没有找到已安装的 Boost。请按上述方式安装，或传入
> `-DBoost_ROOT=<boost prefix>`（包含 `include/boost` 和 `lib/cmake/Boost-<version>` 的目录）。
> 仅解压的 Boost 源码包不包含 CMake 包配置文件，因此无法使用。

### 下载与编译

克隆 `master`（或您的分支），然后配置、编译、测试并安装 C++ SDK 和应用程序：

```ShellSession
git clone https://github.com/ALPSim/ALPS alps-src
cmake -S alps-src -B alps-build -DCMAKE_INSTALL_PREFIX=</path/to/install/dir>
cmake --build alps-build --parallel 4
ctest --test-dir alps-build
cmake --install alps-build
```

请使用全新的构建目录。正式版或旧版 `master` 留下的构建目录会保留过时的设置，应先删除。
DMFT 和 MaxEnt 的每个编译单元约需 1 GB 内存，内存较少的机器请调低 `--parallel`。

### 构建 `pyalps`（可选）

`pyalps` 通过 pip 基于刚安装的 SDK 构建。在 Python 虚拟环境中：

```ShellSession
python3 -m venv .venv && . .venv/bin/activate
python -m pip install "scikit-build-core>=1.0" "nanobind==2.15.0" \
                      "patchelf>=0.14; sys_platform == 'linux'"
export ALPS_DIR=</path/to/install/dir>/share/alps
python -m pip install --no-build-isolation -e alps-src/python/pyalps
python -c "import pyalps; print(pyalps.__file__)"
```

`nanobind` 的版本必须与
[`python/pyalps/pyproject.toml`](https://github.com/ALPSim/ALPS/blob/master/python/pyalps/pyproject.toml)
中固定的版本一致。CMake 预设、修改后的重新构建以及 Python 测试，请参阅
[CONTRIBUTING.md](https://github.com/ALPSim/ALPS/blob/master/CONTRIBUTING.md#getting-started-with-the-code)。

### 保持更新

```ShellSession
git -C alps-src pull
cmake --build alps-build --parallel 4 && cmake --install alps-build
```

如果 `git pull` 改变了依赖要求，请查看
[CHANGELOG](https://github.com/ALPSim/ALPS/blob/master/CHANGELOG.md)，若 CMake 报错，请在全新的构建目录中重新配置。

{{% /steps %}}
