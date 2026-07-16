
---
title: Integration-00 用户代码集成
math: true
toc: true
weight: 1
---

## 为什么要将现有程序与 ALPS 集成？

如果您已经有一个可运行的仿真代码——哪怕只是一个没有任何外部依赖的 C 或 C++ 文件——也无需重写它就能享受到 ALPS 带来的好处。通过使用 CMake 打包代码并将其与 ALPS 库链接，您可以逐步让现有程序使用 ALPS 的 **Parameters** 参数文件格式、**Alea** 测量与误差分析库，以及 **Parapack** 调度器，同时保持底层物理代码不变。每一部分都可以独立地、按自己的节奏引入。

使用 ALPS 调度器具有以下优点：

- 无需额外代码即可实现参数并行化：一个参数文件可以列出多组参数（例如多个温度），调度器会运行并管理所有这些任务。
- 同一个可执行文件可在笔记本电脑、集群服务器或超级计算机上运行。
- 内置结果汇总与后处理功能，包括自动统计误差估计。
- 对已并行化的代码进行多级并行化也很简单。
- 提供副本交换法等高级方法的现成适配器。

本教程将具体展示这一迁移过程在实践中的样子。我们从一个极简的 C 程序出发，逐步添加 ALPS 的各项功能——先是 CMake 打包，然后是 `ALPS/parameters`、`ALPS/alea`、`ALPS/lattice`，最后是 `ALPS/parapack` 调度器——这样您可以清楚地看到每一步具体改变了什么，以及原因何在。

## 示例：用 Wolff 算法模拟二维 Ising 模型

在整个教程中，我们始终使用同一个小型物理问题作为示例：具有周期性边界条件的 $L \times L$ 二维方格 Ising 模型，使用 Wolff 单团簇蒙特卡洛算法进行模拟。

Wolff 算法不是像 Metropolis 算法那样每次翻转一个自旋，而是从一个随机的种子格点开始，逐步生长一个由自旋方向相同的格点组成的“团簇”：每个与团簇相邻、自旋方向相同的格点，都以概率

$$
p = 1 - e^{-2/T}
$$

（这里耦合常数 $J$ 和玻尔兹曼常数 $k_B$ 均取为 1）被加入团簇，然后将整个团簇一次性翻转。与逐点翻转的更新方式相比，这种做法能大幅减少相变附近的*临界慢化*现象——[经典蒙特卡洛教程](../../../start/mc)中讨论的正是同样的优势。示例程序测量磁化强度及其二阶矩和四阶矩，并由此计算出 Binder 比 $\langle m^2\rangle^2/\langle m^4\rangle$——这是定位相变的一个标准工具。

由于整个教程中物理模型本身从未改变，因此您在各步骤之间看到的每一处差异，都来自与 ALPS 的集成，而非算法本身的变化。

## 准备工作

{{< callout type="info" >}}
本教程假设您已经安装好 ALPS，并且能够较为熟练地在命令行中编译 C/C++ 代码。如果尚未安装 ALPS，请参阅[安装指南](https://alps.comp-phys.org/install/)。从第 1 步开始，您还需要 CMake 3.18 或更高版本。
{{< /callout >}}

每一步所需的源文件都随 ALPS 一起发布，是一组独立的示例目录，名称从 `tutorials/alpsize-00-make` 到 `tutorials/alpsize-09-scheduler`，位于 [ALPS 代码仓库](https://github.com/ALPSim/ALPS)中。每个目录都可以独立编译——在运行下面的命令之前，请先 `cd` 进入相应步骤的目录。

## 教程：从纯 C 代码到完全集成 ALPS 的十个步骤

请按顺序完成以下步骤。每一步都基于前一步的代码，只改动引入下一个 ALPS 概念所需的部分。

### 第 0 步 — 使用普通 Makefile 编译

目录：`tutorials/alpsize-00-make`

在引入 CMake 之前，这一步先确认一个手写的普通 Makefile 能够找到并链接到您的 ALPS 安装。`hello.C` 尚未调用任何 ALPS 函数——它唯一的作用是确认编译器和链接器已正确配置。Makefile 本身很简短：

```make
include $(ALPS_HOME)/share/alps/include.mk

hello: hello.C
	$(CXX) $(CPPFLAGS) $(CXXFLAGS) $(LDFLAGS) -o hello hello.C $(LIBS)
```

引入 `$(ALPS_HOME)/share/alps/include.mk` 会带入编译与 ALPS 所需的编译器（`$(CXX)`）、预处理与编译选项（`$(CPPFLAGS)`、`$(CXXFLAGS)`）以及链接选项（`$(LDFLAGS)`、`$(LIBS)`），因此您无需自己摸索这些设置。

```bash
$ export ALPS_HOME=/path/to/alps
$ make
$ ./hello
hello, world
```

### 第 1 步 — 使用 CMake 打包

目录：`tutorials/alpsize-01-cmake`

从这一步开始，后续所有步骤都改用 CMake 而非手写 Makefile 进行构建。这一步构建的是与第 0 步相同的 `hello.C`，但通过一个能自动定位 ALPS 并注册测试的 `CMakeLists.txt` 完成。关于这个文件的详细说明，请参阅 [Integration-01：使用 CMake 打包](../alpsize01)。

```bash
$ cmake -DALPS_ROOT_DIR=/path/to/alps .
$ make
$ ./hello
hello, world
```

### 第 2 步 — 用纯 C 实现 Wolff 算法

目录：`tutorials/alpsize-02-original-c`

这是物理代码的起点：`wolff.c`，一个完全不依赖 ALPS 或 C++ 特性的自包含 C 语言实现。晶格大小（`L = 32`）、温度（`T = 2.2`）以及蒙特卡洛扫描次数都是硬编码的 `#define` 常量；近邻列表、团簇栈和自旋组态都是普通的 C 数组。这正是许多研究组最初拥有的那种代码——一个没有任何外部依赖、可正常运行的仿真程序。

```bash
$ cmake .
$ make
$ ./wolff
```

### 第 3 步 — 移植为惯用 C++

目录：`tutorials/alpsize-03-basic-cpp`

第 2 步中的 C 代码在行为不变的前提下转换为惯用的 C++ 写法：

- 将 `<math.h>` 替换为 `<cmath>`（其他 C 头文件同理替换为对应的 C++ 版本）
- 使用 `std` 命名空间
- 将 `printf`/`fprintf` 替换为 `std::cout`/`std::cerr`
- 改用 C++ 风格注释

```bash
$ cmake .
$ make
$ ./wolff
```

### 第 4 步 — 使用 C++ 标准模板库

目录：`tutorials/alpsize-04-stl`

原始 C 数组和手动管理的内存被替换为标准容器，由编译器而非手写的下标运算来管理内存：

- `std::vector<>` 替代了固定大小的近邻列表和自旋数组——其大小会自动分配和释放，元素类型（包括用户自定义类型）通过模板参数指定
- `std::stack<>` 替代了手写的团簇栈，同样具有自动内存管理

```bash
$ cmake .
$ make
$ ./wolff
```

### 第 5 步 — 使用 Boost C++ 库

目录：`tutorials/alpsize-05-boost`

前面步骤中的三处临时实现被 Boost 提供的对应组件取代：

- `<boost/array.hpp>`：固定长度数组，替代手写的 4 元素近邻结构体
- `<boost/random.hpp>`：正规的随机数生成器（Mersenne Twister），替代 C 标准库中的 `rand()`，并提供多种分布（均匀分布、正态分布、泊松分布、指数分布等）
- `<boost/timer.hpp>`：用于测量执行时间的计时器，替代手动调用 `clock()`

```bash
$ cmake .
$ make
$ ./wolff
Magnetization = -0.000368834
Magnetization^2 = 0.626016
Magnetization^4 = 0.408456
Binder Ratio of Magnetization = 0.959457
```

请记住这些数值——由于物理模型和随机数种子都没有改变，当 ALPS 在第 7 步开始接管测量之后，同样的中心值会再次出现。

### 第 6 步 — 使用 ALPS/parameters 读取参数

目录：`tutorials/alpsize-06-parameters`

第 2 步中的硬编码常量（`L`、`T`、扫描次数、热化步数、随机数种子）被替换为通过 `alps::Parameters` 从参数文件中读取的值：

```cpp
alps::Parameters params(std::cin);
const int L = params.value_or_default("L", 32);
const double T = params.value_or_default("T", 2.2);
```

如果参数文件中未提供某个参数，`value_or_default` 会回退到之前硬编码的值，因此即使参数文件不完整，程序仍能正常运行。参数文件本身是纯文本：

```
L = 32
T = 2.2
```

```bash
$ cmake .
$ make
$ ./wolff <wolff.ip
Magnetization = -0.000368834
Magnetization^2 = 0.626016
Magnetization^4 = 0.408456
Binder Ratio of Magnetization = 0.959457
```

由于 `wolff.ip` 指定的 `L` 和 `T` 与之前相同，结果与第 5 步完全一致——改变的只是参数*如何*传递给程序。

### 第 7 步 — 使用 ALPS/alea 测量可观测量

目录：`tutorials/alpsize-07-alea`

对 `m`、`m2`、`m4` 的手动累加被 `alps::ObservableSet` 取代，它在累加测量值的同时，还会自动估计其统计误差：

```cpp
alps::ObservableSet measurements;
measurements << alps::RealObservable("Magnetization")
             << alps::RealObservable("Magnetization^2")
             << alps::RealObservable("Magnetization^4");
...
measurements["Magnetization"] << dsz;
```

诸如 Binder 比这样的派生量，可以直接对 `alps::RealObsevaluator` 对象进行普通的算术运算得到——Alea 会自动将统计误差传播到计算结果中：

```cpp
alps::RealObsevaluator m2 = measurements["Magnetization^2"];
alps::RealObsevaluator m4 = measurements["Magnetization^4"];
alps::RealObsevaluator binder("Binder Ratio of Magnetization");
binder = m2 * m2 / m4;
```

```bash
$ cmake .
$ make
$ ./wolff wolff.ip
Binder Ratio of Magnetization: 0.959454 +/- 0.000919
Magnetization: -0.000368834 +/- 0.00213; tau = -0.381
    bin #1   : 32768    entries: error = 0.004371
    bin #2   : 16384    entries: error = 0.0027974
    ...
```

与第 5 步相比：中心值（`-0.000368834`、`0.959454` ≈ `0.959457`）相同，但 Alea 现在还给出了误差棒和自相关时间估计（`tau`），它们都是通过自动进行的分箱（binning）分析得到的——无需任何额外代码。

### 第 8 步 — 使用 ALPS/lattice 描述晶格

目录：`tutorials/alpsize-08-lattice`

前面步骤中手写的近邻表被 `alps::graph_helper<>` 取代，它根据 `LATTICE` 参数而不是代码来构建晶格几何结构：

```cpp
alps::graph_helper<> graph(params);
const int N = graph.num_sites();
...
BOOST_FOREACH(alps::graph_helper<>::site_descriptor const& sn, graph.neighbors(sc)) { ... }
```

这样就把“格点和键在哪里”（晶格）与“格点上发生了什么”（物理）分离开来——这正是 `ALPS/lattice` 库的意义所在：晶格几何结构变成了一个参数，而不是硬编码的逻辑，只需修改参数文件即可换用完全不同的晶格，而无需修改源代码。内置晶格的完整列表请参见 [ALPS 晶格库](../../intro/latticehowtos)。

这一步还附带了第二个独立的演示程序 `lattice.C`，它只是简单地打印出读取到的几何结构：

```
LATTICE = "square lattice"
L = 4
```

```bash
$ cmake .
$ make
$ ./lattice <lattice.ip
lattice name = square lattice
number of sites = 16
number of bonds = 32
...
$ ./wolff <wolff.ip
Binder Ratio of Magnetization: 0.959454 +/- 0.000919
...
```

一个 $4\times4$ 的周期性方格晶格有 16 个格点和 $16 \times 4 / 2 = 32$ 条键（每个格点有 4 个近邻，而每条键都由 2 个格点共享）——这与 `lattice.C` 报告的结果完全一致。

### 第 9 步 — 与 ALPS/Parapack 调度器完全集成

目录：`tutorials/alpsize-09-scheduler`

在最后一步中，仿真将控制权完全交给 ALPS Parapack 调度器。`main` 函数不再运行整个仿真，而只是启动调度器：

```cpp
#include <alps/parapack/parapack.h>
int main(int argc, char** argv) { return alps::parapack::start(argc, argv); }
```

所有的仿真逻辑都移到一个 `Worker` 类中，由调度器按需调用：

- 构造函数和 `init_observables` 负责设置仿真并注册可观测量
- `run` 执行一个单位的蒙特卡洛工作（这里是一次团簇更新）
- `is_thermalized` 和 `progress` 告诉调度器热化是否完成，以及仿真距离结束还有多远
- `save` 和 `load` 负责写入和读取检查点数据，从而免费获得重启支持

```cpp
class wolff_worker : public alps::parapack::lattice_mc_worker<> {
  ...
  void run(alps::ObservableSet& obs) { ... }
  bool is_thermalized() const { return mcs >= MCTHRM; }
  double progress() const { return 1.0 * mcs / (MCTHRM + MCSTEP); }
  void save(alps::ODump& dp) const { dp << mcs << spin << sz; }
  void load(alps::IDump& dp) { dp >> mcs >> spin >> sz; }
};
```

Worker 通过一个宏注册到调度器；由于 `lattice_mc_worker` 同时集成了 ALPS 的 `lattice_helper` 和 `rng_helper`，Worker 可以直接继承并使用晶格访问方法（`neighbors`、`num_sites`）和随机数生成方法（`random_01`）：

```cpp
PARAPACK_REGISTER_WORKER(wolff_worker, "wolff");
```

到这一步，本页开头列出的第一个优点就变得非常具体了：调度器的参数文件可以列出多组参数，调度器会在无需您编写任何额外代码的情况下运行并管理所有这些任务。例如，`wolff_params` 请求在三个不同温度下各运行 16 个独立并行的仿真副本（"clone"）：

```
ALGORITHM = "wolff"
LATTICE = "square lattice"
L = 32
NUM_CLONES = 16
{ T = 2.2 }
{ T = 2.4 }
{ T = 2.6 }
```

```bash
$ cmake .
$ make
$ ./hello <hello.ip
$ ./wolff <wolff.ip
```

## 接下来做什么？

如果您现有的代码是用 Fortran 而非 C 或 C++ 编写的，ALPS 提供了专门的包装库，而不是本页介绍的这种方式——请参阅 [Integration-02：Fortran 入门](../alpsize02)以开始使用，以及 [Integration-03：Fortran 应用程序开发](../alpsize03)获取将现有 Fortran 程序移植到 ALPS 的完整实例。如果您想深入了解本教程中使用的 CMake 构建系统，请参阅 [Integration-01：使用 CMake 打包](../alpsize01)。
