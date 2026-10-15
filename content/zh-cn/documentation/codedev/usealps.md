
---
title: Code-00 在你的项目中使用 ALPS
math: true
toc: true
weight: 1
---

## 使用 CMake

ALPS 库还在 `/opt/alps/share/alps/ALPSConfig.cmake` 中为 CMake 提供了一个 ALPS 配置文件。包含该文件将设置构建 ALPS 时所用的全部配置变量。此外，在你的 CMake 文件中包含文件 `/opt/alps/share/alps/UseALPS.cmake`，将自动设置使用 ALPS 所需的编译器和链接器选项。下面是一个示例 `CMakeLists.txt`：
 
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

注意，find_package 中的 NO_SYSTEM_ENVIRONMENT_PATH 选项是必不可少的。否则，这些变量（编译器等）将被系统默认值覆盖。
运行 cmake 时，请指定可以找到 ALPS 的路径：

    cmake -DALPS_ROOT_DIR=/opt/alps /somewhere/to/your/source/code
    
或者，也可以通过环境变量 $ALPS_HOME 告诉 cmake ALPS 所在的位置：

    export ALPS_HOME=/opt/alps
    cmake /somewhere/to/your/source/code

## 使用 make

如果可以的话，请使用 cmake 而不是 make。ALPS 库附带了一个供你的 Makefile 使用的包含文件，它设置了使用 ALPS 所需的全部包含路径、链接路径以及需要链接的库。该包含文件位于 /opt/alps/share/alps/include.mk——如果你将 ALPS 安装在 /opt/alps 以外的路径，则位于类似的位置。C++ 伊辛模型教程中提供了一个使用该包含文件的示例 Makefile。
