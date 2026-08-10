
---
title: Integration-02 Fortran 入门
math: true
toc: true
weight: 3
---

本章介绍如何构建和使用 ALPS Fortran——ALPS 提供的功能，用于将现有的 Fortran 仿真代码与 ALPS Parapack 调度器集成。本章假设读者具备 Fortran 编程基础知识；不需要事先熟悉 ALPS 的 C++ 接口，不过如果您已经学习过 [Integration-00](../alpsize00)，会发现这里出现的正是相同的调度器概念（Worker 类、可观测量、检查点），只是换成了 Fortran 的形式。

具体来说，ALPS Fortran 的工作方式是提供一个小型的 C++「包装」Worker 类 `alps::fortran_wrapper`，它接入 ALPS Parapack 调度器的方式与 [Integration-00 第 9 步](../alpsize00#第-9-步--与-alpsparapack-调度器完全集成)中手写的 `wolff_worker` 类完全一样——只是它调用的不是 C++ 成员函数，而是您实现的一组固定的 Fortran 子例程（`alps_init`、`alps_run`、`alps_progress` 等）。这正是为什么您的 Fortran 程序无需编写任何 C++ 代码，就能获得 [Integration-00 简介](../alpsize00#为什么要将现有程序与-alps-集成)中所描述的同样好处——参数驱动的并行化、检查点/重启、结果自动汇总。

## 运行环境

使用前需要以下环境：

|       |          |
| :---- | :------- |
| ALPS  | 构建时需启用 `ALPS_BUILD_FORTRAN` 这一 CMake 选项（见下文[安装](#安装)）。一般的运行环境要求请参见 [ALPS 安装页面](https://alps.comp-phys.org/install/)。 |
| CMake | 3.18 或更高版本，用于编译 ALPS 本身以及您的 Fortran 客户端代码。 |
| Fortran 编译器（GNU/Intel/Fujitsu） | 需要与构建 ALPS 时使用的相同编译器，因为不同编译器之间 Fortran 的名称修饰（name mangling）和运行时库并不兼容。各编译器的安装方法请参阅其对应手册。 |

## 安装

ALPS Fortran 的支持已经直接内置在 ALPS 主源码树中（位于 `src/alps/fortran/`），无需单独下载或打补丁。它只是默认被禁用，需要在构建 ALPS 本身时通过一个 CMake 选项手动开启：

```bash
$ cmake -DALPS_BUILD_FORTRAN=ON ...
```

（将其与您[从源码构建 ALPS](https://alps.comp-phys.org/install/) 时已经使用的其他选项一起添加即可）。启用该选项构建 ALPS 后，会额外生成以下文件（`${ALPS_ROOT}` 为您的 ALPS 安装前缀，例如 `/opt/alps`）：

- `${ALPS_ROOT}/lib/libalps_fortran.a`
- `${ALPS_ROOT}/include/alps/fortran/alps_fortran.h`
- `${ALPS_ROOT}/include/alps/fortran/fortran_wrapper.h`
- `${ALPS_ROOT}/include/alps/fortran/fwrapper_impl.h`

并定义了一个额外的 CMake 变量 `ALPS_FORTRAN_LIBRARIES`，供您自己项目的 `CMakeLists.txt` 与通常的 `ALPS_LIBRARIES` 一起链接（见下文[编译](#编译)）。

## 示例源代码

ALPS 提供两个 Fortran 示例应用程序，作为 [ALPS 仓库](https://github.com/ALPSim/ALPS)中的完整教程目录：

- **`tutorials/alpsize-10-fortran-scheduler`**（"hello"）— 不执行任何实际计算，只是把参数文件的内容原样读回并打印出来，可用来确认参数确实被正确传递。
- **`tutorials/alpsize-11-fortran-ising`**（"ising"）— 一个完整的实例，展示如何将一个已有的 Fortran Ising 模型程序移植到 ALPS Fortran；详见 [Integration-03：Fortran 应用程序开发](../alpsize03)。

本页接下来讲解如何构建和运行 `hello` 应用程序。`ising` 应用程序的构建和运行方式与此相同；它的子例程具体做了什么，请参见 Integration-03。

### "hello" 应用程序

hello 应用程序由以下文件组成：

- `hello_impl.f90` — ALPS 会调用的 Fortran 子例程（`alps_init`、`alps_run` 等）
- `hello.C` — 一个简短的 C++ 文件，通过 `PARAPACK_REGISTER_WORKER` 将 `alps::fortran_wrapper` 注册到调度器并启动它；正如 [Integration-00 第 9 步](../alpsize00#第-9-步--与-alpsparapack-调度器完全集成)中对普通 C++ Worker 的说明一样，除了版本号/版权字符串之外，您不需要修改这个文件
- `hello_params` — 一个 ALPS 参数文件，格式与 [Integration-00](../alpsize00) 中使用的文本格式相同
- `CMakeLists.txt` — 构建配置

### 编译

1. **创建构建目录**

   ```bash
   $ mkdir -p ${HOME}/alps_fortran_build/hello
   $ cd ${HOME}/alps_fortran_build/hello
   ```

2. **运行 CMake**

   指定源代码目录（`${SAMPLES}` 是您检出或解压 ALPS `tutorials/` 目录的位置）：

   ```bash
   $ cmake -DALPS_ROOT_DIR=${ALPS_ROOT} \
   >       ${SAMPLES}/alpsize-10-fortran-scheduler
   ```

3. **构建**

   ```bash
   $ make
   ```

   构建成功后，当前目录下将生成可执行文件 `hello`。

### 快速检查

在设置线程或 MPI 并行化之前，先确认构建本身是否正常是值得的。由于 `hello.C` 启动的正是 [Integration-00 第 9 步](../alpsize00#第-9-步--与-alpsparapack-调度器完全集成)中使用的同一个 Parapack 调度器，您可以像那一步一样，直接通过标准输入把参数文件传给它：

```bash
$ ./hello <hello_params
```

如果这条命令为 `hello_params` 中的每组参数各打印出一段输出（对于下面展示的示例文件是五段），就说明您的构建是正确的，可以继续进行下面介绍的标准运行方式了。

### 线程级并行化

1. **进入构建目录**

   ```bash
   $ cd ${HOME}/alps_fortran_build/hello
   ```

   如果工作目录中存在上次运行的结果文件（`hello_param.out.*`），请在继续之前将其全部删除。

2. **准备参数文件**

   从参数文件生成 XML 输入文件：

   ```bash
   $ cp ${SAMPLES}/alpsize-10-fortran-scheduler/hello_params .
   $ parameter2xml hello_params
   ```

   关于 `parameter2xml` 命令的详细说明，请参阅 [ALPS 文档](https://alps.comp-phys.org)。像这样转换为 XML（而不是像上面的快速检查那样直接通过管道传入），正是调度器能够管理多个并行克隆、并写出结构化的、可续算的结果文件的原因。

   参数文件本身列出了五组参数，每个 `{ ... }` 块一组——调度器会将这五组参数各自作为一个独立的克隆来运行：

   ```
   ALGORITHM = "hello"
   { WORLD = "world"; X = 3.2; Y = 0; Z=defined }
   { WORLD = "alps"; X = -3.1; Y = 3*2 }
   { WORLD = "looper"; X = 0.001; Y = -100 }
   { WORLD = "japan"; X = 100.0; Y = 2 }
   { WORLD = "wistaria"; X = 3; Y = 0 }
   ```

3. **运行**

   ```bash
   $ ./hello hello_params.in.xml
   ```

   每个克隆都会调用 `alps_init`，读回属于自己的 `X`、`Y`、`WORLD` 参数，并报告该克隆是否定义了 `Z`（只有第一组定义了）。当有多个 CPU 核心可用时，调度器会把各个克隆分派到不同的「线程组」，使它们并发运行——这正是 [Integration-00 简介](../alpsize00#为什么要将现有程序与-alps-集成)中「无需额外代码即可实现参数并行化」这一优点的具体体现。以下是示例输出：

   ```
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
   ```

   注意，参数文件中的 `Y = 3*2` 会被 ALPS 参数解析器求值为 `6`，而 `X = 0.001` 会以 Fortran 的科学计数法形式打印为 `1.00000000000000002E-003`——这两者都是预期行为，不是错误。

### MPI 并行化

1. **进入构建目录**

   ```bash
   $ cd ${HOME}/alps_fortran_build/hello
   ```

   同上，运行前请确认不存在残留的结果文件（`hello_param.out.*`）。

2. **准备参数文件**

   ```bash
   $ cp ${SAMPLES}/alpsize-10-fortran-scheduler/hello_params .
   $ parameter2xml hello_params
   ```

3. **使用 MPI 运行**

   ```bash
   $ mpirun -np 4 -x OMP_NUM_THREADS=1 ./hello --mpi hello_params.in.xml
   ```

   `--mpi` 参数告诉调度器将这五个克隆分配到 4 个 MPI 进程上（而不仅仅是单个进程内的多个线程）——当单台机器的核心数不够用时，这会很有用。`hello_params` 中定义的参数会像线程级并行化示例那样输出到标准输出。

## 接下来做什么？

`hello` 示例构建并运行成功后，请继续阅读 [Integration-03：Fortran 应用程序开发](../alpsize03)，其中详细介绍了上面用到的完整 `alps_*` 子例程集合，并逐步演示如何将一个真实的、已有的 Fortran Ising 模型程序（`ising_original.f`，来自 `tutorials/alpsize-11-fortran-ising`）移植到这一框架中。
