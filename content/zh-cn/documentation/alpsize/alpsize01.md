
---
title: Integration-01 CMake
math: true
toc: true
weight: 2
---

## CMake 是什么？ALPS 为什么使用它？

CMake 是一个跨平台的构建配置工具。与其手写 Makefile——那很快就会变成一堆平台相关的编译器和链接器选项——不如用一个简短、可移植的文件 **CMakeLists.txt** 来描述*要构建什么*，由 CMake 为您所在的平台生成实际的构建文件（在 Linux/macOS 上生成 Makefile，在 Windows 上生成 Visual Studio 工程等）。然后您只需依次运行 `cmake` 和 `make` 进行编译。

ALPS 本身就是用 CMake 构建的，并且随附了一套 CMake 配置文件，描述了如何查找并链接到它。为您自己的程序使用 CMake，可以直接复用这套基础设施，而无需自己去摸索正确的编译器和链接器选项。ALPS 要求 **CMake 3.18 或更高版本**——如果您需要安装或升级 CMake，请参阅[安装指南](https://alps.comp-phys.org/install/)。

本页将逐行讲解 [Integration-00](../alpsize00) 中使用的 `CMakeLists.txt`。如果您只想复制一份可用的示例然后继续往下走，请直接看下面的代码块；如果想理解每一行的作用，请继续阅读。

## CMakeLists.txt 的结构剖析

`CMakeLists.txt` 由几个部分组成：头部声明、导入 ALPS 环境、目标（target）依赖描述，以及（可选的）测试定义。以下是 [Integration-00](../alpsize00) 第 1 步中使用的完整文件；完整的源文件可在 [ALPS 仓库](https://github.com/ALPSim/ALPS)中获取：

```cmake
cmake_minimum_required(VERSION 3.18 FATAL_ERROR)
project(alpsize NONE)

# find ALPS Library
find_package(ALPS REQUIRED PATHS ${ALPS_ROOT_DIR} $ENV{ALPS_HOME} NO_SYSTEM_ENVIRONMENT_PATH)
message(STATUS "Found ALPS: ${ALPS_ROOT_DIR} (revision: ${ALPS_VERSION})")
include(${ALPS_USE_FILE})

# enable C and C++ compilers
enable_language(C CXX)

# rule for generating 'hello world' program
add_executable(hello hello.C)
target_link_libraries(hello ${ALPS_LIBRARIES})
add_alps_test(hello)
```

- **`cmake_minimum_required` / `project(alpsize NONE)`** — 声明所需的最低 CMake 版本并命名项目。参数 `NONE` 告诉 CMake*不要*根据项目源文件自动检测语言；具体启用哪些语言由下一部分显式指定。

- **`find_package(ALPS REQUIRED PATHS ${ALPS_ROOT_DIR} $ENV{ALPS_HOME} NO_SYSTEM_ENVIRONMENT_PATH)`** — 定位您的 ALPS 安装。`PATHS` 为 CMake 提供了两种查找方式：命令行变量 `-DALPS_ROOT_DIR`，或者环境变量 `$ALPS_HOME`（见下文[运行 CMake](#运行-cmake)）。`REQUIRED` 会让配置在找不到 ALPS 时立即报错并给出清晰的提示，而不是等到编译或链接阶段才失败。

  {{< callout type="warning" >}}
  `NO_SYSTEM_ENVIRONMENT_PATH` 是必不可少的。如果没有它，`find_package` 还会搜索系统的标准位置，这可能会悄悄地选中与您实际链接时不同的编译器、Boost 安装或 ALPS 版本，从而在链接阶段——甚至更糟糕地，在运行时——导致令人困惑的 ABI 不匹配问题。
  {{< /callout >}}

- **`include(${ALPS_USE_FILE})`** — 应用 ALPS 所需的编译器和链接器设置。在内部，`find_package(ALPS ...)` 会加载一个配置文件，该文件由 ALPS 安装在 `${ALPS_ROOT}/share/alps/ALPSConfig.cmake`（`${ALPS_ROOT}` 为您的 ALPS 安装前缀，例如 `/opt/alps`），其中定义了诸如 `ALPS_INCLUDE_DIRS`、`ALPS_LIBRARIES`、`ALPS_USE_FILE` 等变量。最后这个变量指向 `${ALPS_ROOT}/share/alps/UseALPS.cmake`；引入它会自动为您设置编译器和链接器选项，因此您无需自己去查找正确的 `-I` 和 `-L` 路径。

- **`enable_language(C CXX)`** — 同时启用 C 和 C++ 编译器。`hello.C` 本身只需要 C++，但本教程系列后续步骤会加入一个 C 文件（`wolff.c`）以及一个 Fortran 文件，因此同一份 `CMakeLists.txt` 模板会预先启用两种语言。

- **`add_executable(hello hello.C)` / `target_link_libraries(hello ${ALPS_LIBRARIES})`** — 标准的 CMake 用法：从 `hello.C` 构建一个名为 `hello` 的可执行文件，并将其与上面找到的 ALPS 库链接。

- **`add_alps_test(hello)`** — 使用 ALPS 提供的宏，将 `hello` 注册为一个 CTest 测试。具体来说，它会：（1）运行 `hello` 可执行文件；（2）如果源码目录中存在名为 `hello.ip`（或 `hello.input`）的文件，就将其内容通过标准输入传给程序；（3）捕获程序输出到标准输出的内容；（4）如果存在名为 `hello.op`（或 `hello.output`）的文件，就将其与捕获到的输出逐字节比较，一旦不一致测试就失败。[Integration-00](../alpsize00) 中用来验证每一步示例是否仍然产生预期数值的，正是这一机制。

## 运行 CMake

运行 `cmake` 时，使用 `-DALPS_ROOT_DIR` 指定 ALPS 的安装路径：

```bash
$ cmake -DALPS_ROOT_DIR=/path/to/alps /path/to/your/source
```

或者，设置 `$ALPS_HOME` 环境变量，让 CMake 自动找到 ALPS——如果您在同一个 shell 会话中要构建多个基于 ALPS 的项目，这种方式会更方便：

```bash
$ export ALPS_HOME=/path/to/alps
$ cmake /path/to/your/source
-- Found ALPS: ...
[snip]
-- Configuring done
-- Generating done
-- Build files have been written to: /home/alps/tutorial
```

{{< callout type="info" >}}
本页的示例直接在源码目录中运行 `cmake`（即*源码内*构建，例如 `cmake .`），这样可以让教程保持简单。但对于任何您打算持续开发的项目，建议改用*源码外*构建——新建一个独立的构建目录，并在其中运行 `cmake /path/to/source`——这样生成的文件就不会与源文件混在一起。
{{< /callout >}}

## 构建与测试

CMake 会生成一个 Makefile；运行 `make` 来构建程序：

```bash
$ make
[100%] Building CXX object CMakeFiles/hello.dir/hello.C.o
Linking CXX executable hello
[100%] Built target hello
$ ./hello
hello, world
```

使用 `ctest` 工具运行由 `add_alps_test` 注册的测试：

```bash
$ ctest
Test project /home/alps/tutorial
    Start 1: hello
1/1 Test #1: hello ............................   Passed    0.07 sec

100% tests passed, 0 tests failed out of 1

Total Test time (real) =   0.07 sec
```

之所以能通过，是因为该教程目录中附带了一个 `hello.op` 文件，其内容恰好是 CTest 所期望的 `hello, world`。如果您以后修改了 `hello.C`，使其输出发生变化，这个测试就会失败，直到您更新 `hello.op` 使其匹配为止——这正是它的意义所在：捕捉意料之外的行为变化。

## 接下来做什么？

理解了 `CMakeLists.txt` 和 `add_alps_test` 的工作原理之后，请返回 [Integration-00：简介与概览](../alpsize00)，查看同样的 `cmake` / `make` / `ctest` 工作流是如何应用在从纯 C 代码到完全集成 ALPS 的 Wolff 团簇蒙特卡洛教程每一步中的。
