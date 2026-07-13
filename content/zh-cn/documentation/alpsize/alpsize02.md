---
title: Integration-02 Fortran 入门
math: true
toc: true
weight: 3
---

本章介绍 ALPS Fortran 的安装方法和使用方式，假设读者具备 Fortran 编程基础知识。

## 运行环境

ALPS Fortran 是一个用于在 ALPS 系统上运行 Fortran 代码的封装库。使用前需要以下环境：

|       |          |
| :---- | :------- |
| ALPS  | 运行环境要求和安装流程请参见 [ALPS 安装页面](https://alps.comp-phys.org/install/)。 |
| CMake | 3.18 或更高版本，用于编译 ALPS Fortran 和客户端代码。 |
| Fortran 编译器（GNU/Intel/Fujitsu） | 需要与构建 ALPS 时使用的相同编译器，各编译器的安装方法请参阅其对应手册。 |

## 安装

ALPS Fortran 以补丁文件的形式提供，需将其应用到 ALPS 源码树中。

1. **下载补丁**

   从 [ALPS 仓库](https://github.com/ALPSim/ALPS) 下载 ALPS Fortran 归档文件并解压：

        $ cd ~/
        $ wget http://xxx.xxx/alps_fortran.tar.gz
        $ tar -zxvf alps_fortran.tar.gz

   解压后将创建以下文件和目录：

        alps_fortran/
            + alps_fortran.patch
            + samples/
                + hello/
                + ising/
                + looper-2/
                + tutorial/

2. **应用补丁**

   进入 ALPS 源码目录（`${ALPS_SRC}`）并应用补丁：

        $ cd ${ALPS_SRC}
        $ patch -p0 < ~/alps_fortran/alps_fortran.patch

3. **构建并安装 ALPS**

   按照[安装文档](https://alps.comp-phys.org/install/)构建 ALPS。ALPS Fortran 会随 ALPS 一同安装，生成以下文件（`${ALPS_ROOT}` 为 ALPS 的安装前缀）：

   - `${ALPS_ROOT}/lib/libalps_fortran.a`
   - `${ALPS_ROOT}/include/alps/fortran/alps_fortran.h`
   - `${ALPS_ROOT}/include/alps/fortran/fortran_wrapper.h`
   - `${ALPS_ROOT}/include/alps/fortran/fwrapper_impl.h`

## 示例源代码

ALPS Fortran 包含三个示例应用程序：

- **"hello"** — 不执行计算，仅将参数文件的内容输出到标准输出。
- **"ising"** — Ising 模型计算的示例应用程序。
- **"looper-2"** — 演示外部库使用方式的示例应用程序。

以下各节说明如何构建和运行 `hello` 应用程序。`ising` 和 `looper-2` 的步骤与此相同。

### "hello" 应用程序

hello 应用程序由以下文件组成：

- `hello_impl.f90` — 主程序
- `hello.C` — 设置入口点
- `hello_params` — 参数文件
- `CMakeLists.txt` — 构建配置

### 编译

1. **创建构建目录**

        $ mkdir -p ${HOME}/alps_fortran_build/hello
        $ cd ${HOME}/alps_fortran_build/hello

2. **运行 CMake**

   指定源代码目录并运行 cmake（`${SAMPLES}` 为解压 ALPS Fortran 归档后生成的示例文件夹）：

        $ cmake -DALPS_ROOT:PATH=${ALPS_ROOT} \
        >       ${SAMPLES}/hello

3. **构建**

        $ make

   构建成功后，当前目录下将生成可执行文件 `hello`。

### 线程级并行化

1. **进入构建目录**

        $ cd ${HOME}/alps_fortran_build/hello

   如果工作目录中存在上次运行的结果文件（`hello_param.out.*`），请在继续之前将其全部删除。

2. **准备参数文件**

   从参数文件生成 XML 输入文件：

        $ cp ${SAMPLES}/hello/hello_params .
        $ parameter2xml hello_params

   关于 `parameter2xml` 命令的详细说明，请参阅 [ALPS 文档](https://alps.comp-phys.org)。

3. **运行**

        $ ./hello hello_params.in.xml

   `hello_params` 中定义的参数将输出到标准输出。以下是执行结果示例：

        ##### alps_init() #####
        parameter X     =    3.2000000000000002
        parameter Y     =            0
        parameter WORLD = world
        defined parameter Z =            1
        
    [2011-May-13 11:45:42]: dispatching a new clone[1,1] on threadgroup[3]

        ##### alps_init() #####
        parameter X     =   -3.1000000000000001
        parameter Y     =            6
        parameter WORLD = alps
        defined parameter Z =            0
        
    [2011-May-13 11:45:42]: dispatching a new clone[2,1] on threadgroup[8]

        ##### alps_init() #####
        parameter X     =   1.00000000000000002E-003
        parameter Y     =         -100
        parameter WORLD = looper
        defined parameter Z =            0
        
    [2011-May-13 11:45:43]: dispatching a new clone[3,1] on threadgroup[7]
    [2011-May-13 11:45:43]: clone[3,1] finished on threadgroup[7]

        ##### alps_init() #####
        parameter X     =    100.00000000000000
        parameter Y     =            2
        parameter WORLD = japan
        defined parameter Z =            0
        
    [2011-May-13 11:45:43]: dispatching a new clone[4,1] on threadgroup[1]
    [2011-May-13 11:45:43]: clone[4,1] finished on threadgroup[1]

        ##### alps_init() #####
        parameter X     =    3.0000000000000000
        parameter Y     =            0
        parameter WORLD = wistaria
        defined parameter Z =            0

### MPI 并行化

1. **进入构建目录**

        $ cd ${HOME}/alps_fortran_build/hello

   同上，运行前请确认不存在残留的结果文件（`hello_param.out.*`）。

2. **准备参数文件**

        $ cp ${SAMPLES}/hello/hello_params .
        $ parameter2xml hello_params

3. **使用 MPI 运行**

        $ mpirun -np 4 -x OMP_NUM_THREADS=1 ./hello --mpi hello_params.in.xml

   `hello_params` 中定义的参数将输出到标准输出，与线程级并行化示例相同。
