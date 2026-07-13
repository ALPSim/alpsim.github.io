---
title: Integration-01 CMake
math: true
toc: true
weight: 2
---

## 使用 CMake 打包

ALPS 使用 CMake（3.18 或更高版本）作为构建系统。CMake 是一个跨平台的软件构建过程管理工具。您可以通过配置文件 **CMakeLists.txt** 来驱动 `cmake` 和 `make` 编译代码。编写 CMakeLists.txt 通常比手写 Makefile 简单得多。

`CMakeLists.txt` 由以下几部分组成：头部声明、导入 ALPS 环境、目标依赖描述，以及（可选的）测试定义。
ALPS 库在 `${ALPS_ROOT}/share/alps/ALPSConfig.cmake` 处提供了 CMake 配置文件（`${ALPS_ROOT}` 为 ALPS 的安装前缀，例如 `/opt/alps`）。引入该文件将设置构建 ALPS 所需的所有配置变量。引入 `${ALPS_ROOT}/share/alps/UseALPS.cmake` 则会自动配置使用 ALPS 所需的编译器和链接器选项。以下是一个 `CMakeLists.txt` 示例。完整的源文件可在 [ALPS 仓库](https://github.com/ALPSim/ALPS) 中获取：

```
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
    
注意：`find_package` 中的 `NO_SYSTEM_ENVIRONMENT_PATH` 选项是必须的，否则系统默认值（如编译器等变量）将覆盖 ALPS 的设置。

## 运行 CMake

运行 cmake 时，使用 `-DALPS_ROOT_DIR` 选项指定 ALPS 的安装路径：

    $ cmake -DALPS_ROOT_DIR=/path/to/alps /path/to/your/source
    
或者，通过设置 `$ALPS_HOME` 环境变量让 CMake 自动找到 ALPS：

    $ export ALPS_HOME=/path/to/alps
    $ cmake /path/to/your/source
    -- Found ALPS: ...
    [snip]
    -- Configuring done
    -- Generating done
    -- Build files have been written to: /home/alps/tutorial
    
CMake 将生成 Makefile。然后运行 `make` 构建程序：

    $ make
    [100%] Building CXX object CMakeFiles/hello.dir/hello.C.o
    Linking CXX executable hello
    [100%] Built target hello
    $ ./hello
    hello, world
    
使用 CTest 工具运行测试。CTest 将运行 hello 程序，并将其输出与 `hello.op` 的内容进行比较：

    $ ctest
    Test project /home/alps/tutorial
        Start 1: hello
    1/1 Test #1: hello ............................   Passed    0.07 sec

    100% tests passed, 0 tests failed out of 1

    Total Test time (real) =   0.07 sec
