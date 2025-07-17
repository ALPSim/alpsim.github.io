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
| CMake      | 2.8            | `cmake`                 |
| C++ 编译器 | GCC 10.5.0 或 Clang 13.0.1 | `build-essential`      |
| Boost      | 1.76 <br>*(若 NumPy ≥ 2.0 / Python ≥ 3.13 需 1.87)* | 见下文 |
| MPI        | OpenMPI 4.0 **或** MPICH 4.0 | `libopenmpi-dev` / `libmpich-dev` |
| BLAS       | 0.3            | `libopenblas-dev`       |
| Python     | 3.9            | [python.org](https://www.python.org/) |

<br>
      
<details>
<summary><strong> Ubuntu / Debian / WSL</strong> </summary>
 
```ShellSession
$ sudo apt update
$ sudo apt install build-essential cmake \
                   libhdf5-dev \
                   libopenblas-dev \
                   libopenmpi-dev openmpi-bin # 或: libmpich-dev mpich

# 下载并安装 Boost v1.81.0:

$ wget https://archives.boost.io/release/1.81.0/source/boost_1_81_0.tar.gz
$ tar -xzf boost_1_81_0.tar.gz

# 安装 Python 库:
$ pip install numpy scipy # python 库

# 或
$ python3 -m pip install numpy scipy
```
</details> 

<details> 
<summary><strong> macOS (通过 Homebrew)</strong> </summary>

```ShellSession
$ brew update
$ brew install cmake hdf5 \
               openblas open-mpi # 或: mpich

# 安装 Boost:
$ brew install boost

# 安装 Python 库:
$ pip3 install numpy scipy 
```
</details>

### 验证依赖项
```
$ gcc -v # 必须 ≥ 10.5.0
$ cmake --version # 必须 ≥ 3.18
$ mpirun --version # 需为 OpenMPI 4.0 或 MPICH 4
```

### 下载与编译
现在可以下载并编译 ALPS 库：

在以下命令中，请将 `/path/to/install/directory` 替换为您系统的实际安装目录。
```
$ git clone https://github.com/alpsim/ALPS alps-src
$ cmake -S alps-src -B alps-build \
         -DCMAKE_INSTALL_PREFIX=</path/to/install/dir> \
         -DBoost_SRC_DIR=</directory/with/boost/sources>/boost_1_81_0 \
         -DCMAKE_CXX_FLAGS="-DBOOST_NO_AUTO_PTR \
         -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF"
$ cmake --build alps-build -j 8
$ cmake --build alps-build -t test
```

<details> 
<summary><strong>故障排除</strong></summary>

* **需使用其他 MPI/BLAS?**
将上述包名替换为您集群的模块 (如 Intel MKL/OneAPI, AMD AOCL, IBM ESSL 等)。CMake 会自动定位这些包并生成编译指令。

* **Python 错误**
确保使用 Python 3.9 或更高版本。注意：部分系统 (如 macOS) 使用 pip3 而非 pip。请参考 Python 官网 获取安装支持。

* **MPI 版本不匹配?**
确保 CMake 使用的 MPI 版本与 mpirun --version 一致。

* **Boost 错误**
我们已测试 ALPS 在 Boost 版本 1.76.0 至 1.81.0 的构建 (不同编译器与 Python 版本的支持组合请参考 构建说明)

</details>

#### 编译说明
{{% tabs items="Linux,Mac" %}}
{{% tab %}}
以下 Boost、Python 和 C++ 编译器的组合已通过测试：
  - GCC 10.5.0, Python 3.9.19 and `Boost` 1.76.0
  - GCC 11.4.0, Python 3.10.14 and `Boost` 1.81.0, 1.86.0
  - GCC 12.3.0, Python 3.10.14 and `Boost` 1.81.0, 1.86.0
  - Clang 13.0.1, Python 3.10.14 and `Boost` 1.81.0, 1.86.0
  - Clang 14.0.0, Python 3.10.14 and `Boost` 1.81.0, 1.86.0
  - Clang 15.0.7, Python 3.10.14 and `Boost` 1.81.0, 1.86.0
{{% /tab %}}
{{% tab %}}
ALPS 已在 ARM 架构的 MacOS 系统上通过默认编译器和 Homebrew 的 gcc 编译器 (使用 Boost 1.86.0) 完成测试。
在 MacOS ≥14.6 系统中，若要通过 Homebrew gcc 成功构建 ALPS，需设置以下环境变量：
```ShellSession
export SDKROOT=/Library/Developer/CommandLineTools/SDKs/MacOSX14.sdk/
```

{{% /tab %}}

{{% /tabs %}}

若依赖包安装在非标准路径，CMake 可能无法定位。ALPS 使用标准 CMake 机制 (FindXXX.cmake) 定位包，可参考：
  - For MPI: 参考[cmake with mpi](https://cmake.org/cmake/help/latest/module/FindMPI.html)
  - For BLAS: 参考 [cmake with BLAS](https://cmake.org/cmake/help/latest/module/FindBLAS.html)
  - For HDF5: 参考 [cmake with HDF5](https://cmake.org/cmake/help/latest/module/FindHDF5.html)

***

成功编译后需执行安装。安装路径由配置时的 -DCMAKE_INSTALL_PREFIX=/path/to/install/directory 参数指定，也可在安装阶段通过 --prefix 参数修改 (参见 [cmake manual](https://cmake.org/cmake/help/latest/manual/cmake.1.html#cmdoption-cmake--install-0)).
<br>
运行安装命令：
  ```ShellSession
  $ cmake --install alps-build
  ```
安装目录将被创建。若一切顺利，您可在安装路径的 bin 目录下找到 ALPS 可执行文件 (如 mc 或 fulldiag)。

{{% /steps %}}

