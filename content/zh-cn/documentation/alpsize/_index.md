
---
title: 将你的代码与 ALPS 集成
description: "ALPS 文档"
toc: true
weight: 9
---
许多研究组已经拥有可用的模拟代码——往往是多年积累下来的 C、C++ 或 Fortran 代码——他们更愿意将其与 ALPS 集成，而不是从头重写。只需对代码进行适度的重构，通过链接 ALPS 库并使用 CMake 打包构建，现有程序就能使用 ALPS 的 **Parameters** 文件格式、**Alea** 测量与误差分析库以及 **Parapack** 调度程序。作为回报，程序将获得由参数驱动的并行化、检查点/重启支持、结果自动汇总，以及无需修改即可在从笔记本电脑到超级计算机的任何平台上运行的能力。下面的教程完整地介绍了这一集成过程：一个逐步迁移小型蒙特卡洛程序的 C/C++ 实例，对贯穿始终的 CMake 构建系统的深入介绍，以及一对针对 Fortran 代码介绍相同过程的平行教程。

## [Integration-00：简介与概览](alpsize00)

介绍 ALPS 调度程序及其优势，然后逐步讲解一个包含九个步骤的教程包（从 `00_cmake` 到 `08_scheduler`），它将 Wolff 团簇蒙特卡洛算法的一个普通 C 实现逐步迁移为一个完全集成 ALPS 的程序。每一步都是一个独立的、可构建的目录：验证 CMake + ALPS 工具链，将代码转换为地道的 C++，采用 STL 容器和 Boost 库，通过 `ALPS/parameters` 读取模拟参数，用 `ALPS/alea` 累积测量结果，用 `ALPS/lattice` 描述模拟的几何结构，最后将整个程序封装进一个在 ALPS/Parapack 调度程序下运行的 `Worker` 类中。

## [Integration-01：使用 CMake 打包](alpsize01)

深入介绍整个教程系列中使用的 CMake 构建系统。讲解 ALPS 项目中 `CMakeLists.txt` 的结构——导入 `ALPSConfig.cmake` 和 `UseALPS.cmake`，声明可执行目标及其依赖，以及用 CTest 注册测试——并说明如何使用 `-DALPS_ROOT_DIR` 或 `$ALPS_HOME` 环境变量让 CMake 找到 ALPS 的安装位置。

## [Integration-02：Fortran 简介](alpsize02)

介绍 ALPS Fortran 的安装和基本用法。ALPS Fortran 是一个封装库，使 Fortran 程序能够在 ALPS 调度程序下运行。本节说明所需的构建环境，如何应用 ALPS Fortran 补丁并将其与 ALPS 一起构建，并逐步演示如何在线程级并行和 MPI 并行两种方式下编译和运行随附的 `hello` 示例应用程序。

## [Integration-03：Fortran 应用程序开发](alpsize03)

记录完整的 ALPS Fortran 子程序接口——必需的回调函数（`alps_init`、`alps_run`、`alps_progress`、`alps_is_thermalized`、`alps_save`/`alps_load`、`alps_finalize`）以及 ALPS Fortran 提供的用于读取参数和记录观测量的子程序——然后在一个完整的实例中加以应用：将一个遗留的伊辛模型程序（`ising_original.f`）移植到 ALPS Fortran 框架中，包括检查点/重启和多线程支持。







