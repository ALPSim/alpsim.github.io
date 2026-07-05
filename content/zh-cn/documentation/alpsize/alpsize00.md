
---
title: Alpsize-00 用户代码 ALPSize
math: true
toc: true
weight: 1
---

## ALPSize 简介

通过使用 CMake 进行打包并与 ALPS 库链接，您可以以最少的配置使用 **Parameters** 和 **Alea** 等 ALPS 调度器功能。使用 ALPS 调度器具有以下优点：

- 无需额外代码即可实现参数并行化。
- 同一个可执行文件可在笔记本电脑、集群服务器或超级计算机上运行。
- 内置结果汇总与后处理功能。
- 对已并行化的代码进行多级并行化也很简单。
- 提供副本交换法等高级方法的现成适配器。

## 教程

以下各步骤对应 ALPSize 教程包中的一个子目录。
请按顺序完成，每个步骤都以前一步骤为基础构建。

### 使用 CMake 打包

00_cmake — 通过编译并运行一个最小的 "hello world" 程序，验证 CMake + ALPS 构建系统已正确配置。

    $ cmake .
    $ make
    $ ./hello

### 用 C 语言实现 Wolff 算法

01_original-c — Wolff 团簇算法的纯 C 实现，不使用任何 ALPS 或 C++ 特性，作为基准版本。

    $ cmake .
    $ make
    $ ./wolff

### 用 C++ 语言实现 Wolff 算法

02_basic-cpp — 将 C 代码转换为惯用 C++：将 `<math.h>` 替换为 `<cmath>`，使用 `std::` I/O，并采用 C++ 注释风格。

- 将 `<math.h>` 替换为 `<cmath>`（其他 C 头文件同理替换为对应的 C++ 版本）
- 使用 `std` 命名空间
- 将 `printf`/`fprintf` 替换为 `std::cout`/`std::cerr`
- 改用 C++ 风格注释

        $ cmake .
        $ make
        $ ./wolff

### 使用标准模板库（STL）

03_stl — 用 `std::vector` 和 `std::stack` 替换原始数组和手动内存管理，由标准库负责内存的分配与释放。

- `std::vector<>`：一维数组
    - 所需大小自动分配和释放
    - 元素类型（包括用户自定义类型）通过模板参数指定
- `std::stack<>`：具有同样自动内存管理的栈

            $ cmake .
            $ make
            $ ./wolff

### 使用 Boost C++ 库

04_boost — 使用 Boost 替换固定长度数组、引入更好的随机数生成器和计时器。

- `<boost/array.hpp>`：固定长度数组
- `<boost/random.hpp>`：随机数生成
    - Mersenne Twister、Lagged Fibonacci 等生成器
    - 均匀分布、正态分布、泊松分布、指数分布等
- `<boost/timer.hpp>`：用于测量执行时间的计时器

            $ cmake .
            $ make
            $ ./wolff

### 使用 ALPS/parameters

05_parameters — 通过 `ALPS/parameters` 从文件中读取仿真参数，消除硬编码常量。

    $ cmake .
    $ make
    $ ./wolff <wolff.ip

### 使用 ALPS/alea

06_alea — 使用 `ALPS/alea` 积累和分析可观测量数据，包括自动统计误差估计。

    $ cmake .
    $ make
    $ ./wolff wolff.ip

### 使用 ALPS/lattice

07_lattice — 通过 `ALPS/lattice` 定义仿真晶格，将几何结构与物理分离。

    $ cmake .
    $ make
    $ ./lattice <lattice.ip
    $ ./wolff <wolff.ip

### 使用 ALPS/Parapack 调度器的完整 ALPSize

08_scheduler — 将仿真逻辑封装在 Worker 类中，并将控制权交给 ALPS Parapack 调度器，从而实现透明的并行化。

- 仿真逻辑封装在 `Worker` 类中
- Worker 类必须实现以下函数：
    - 构造函数和 `init_observables` 成员函数
    - `run` 成员函数
    - `is_thermalized` 和 `progress` 成员函数
    - `save` 和 `load` 成员函数
- 使用 `PARAPACK_REGISTER_WORKER` 宏将 Worker 注册到调度器
- 调度器准备 `Parameters` 和 `ObservableSet`，并调用构造函数、`init_observables` 和 `run` 函数
- `lattice_mc_worker` 同时继承了 `lattice_helper` 和 `rng_helper`，因此可以直接使用它们的方法

        $ cmake .
        $ make
        $ ./hello < hello.ip
        $ ./wolff < wolff.ip
