
---
title: Alpsize-01 CMake
math: true
toc: true
weight: 2
---

## 使用 CMake 打包

程序的打包使用 CMake（2.8 版本及以上）。CMake 是一个跨平台的软件构建过程管理系统。可以通过配置文件 **CMakeLists.txt** 使用 cmake & make 进行编译。编写 CMakeLists.txt 通常比直接手写 Makefile 简单得多。下图展示了打包流程的示意图，打包通过编辑 CMakeList.txt 来完成。

打包流程（图片缺失）

CMakeList.txt 由以下几部分组成：头部、导入 ALPS 环境、目标依赖关系的描述，以及（如有必要）一些测试设置。
ALPS 库在 `/opt/alps/share/alps/ALPSConfig.cmake` 中提供了用于 CMake 的 ALPS 配置文件。包含该文件将设置构建 ALPS 时使用的所有配置变量。此外，将 `/opt/alps/share/alps/UseALPS.cmake` 包含到您的 CMake 文件中，将自动设置使用 ALPS 的编译器和链接器选项。以下是一个 `CMakeLists.txt` 的示例，完整的源代码可在 [tutorials/alpsize-01-cmake/]() 中找到：

```
cmake_minimum_required(VERSION 2.8 FATAL_ERROR)
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

请注意，`find_package` 中的 `NO_SYSTEM_ENVIRONMENT_PATH` 选项是必不可少的，否则变量（编译器等）将被系统默认值覆盖。

## 运行 CMake

运行 cmake 时，应使用 `-DALPS_ROOT_DIR` 选项指定 ALPS 的安装路径：

    $ cmake -DALPS_ROOT_DIR=/opt/alps /somewhere/to/your/source/code

或者，可以通过环境变量 `$ALPS_HOME` 告知 cmake ALPS 的位置：

    $ export ALPS_HOME=/opt/alps
    $ cmake /somewhere/to/your/source/code
    -- Found ALPS: ...
    [snip]
    -- Configuring done
    -- Generating done
    -- Build files have been written to: /home/alps/tutorial

CMake 将生成 Makefile，然后运行 make 来构建程序：

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
