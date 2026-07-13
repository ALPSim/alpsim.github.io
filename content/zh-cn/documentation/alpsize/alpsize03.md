
---
title: Integration-03 Fortran 应用程序开发
math: true
toc: true
weight: 4
---

ALPS Fortran 为 ALPS 系统提供了 Fortran 接口模块。只需实现一小组固定的必需子程序，就可以让 Fortran 程序在 ALPS 调度器下运行，并利用其并行化、参数管理和结果汇总功能——这与 [Integration-00](../alpsize00) 中用 C++ 演示的好处完全相同，也是 [Integration-02](../alpsize02) 中构建 "hello" 示例所依赖的机制。本章完整介绍这套子程序接口，并通过一个完整、真实的例子加以说明：将一个已有的、未经修改的 Fortran 程序——一个写于 1993 年的二维 Ising 模型蒙特卡洛仿真程序——移植到 ALPS Fortran 框架中。

## ALPS Fortran 简介

下图展示了 ALPS 系统、ALPS Fortran 与用户 Fortran 程序之间的关系。

![ALPS Fortran 模块](../figs/fortranmodule.png)

ALPS Fortran 是一层薄薄的 C++ 代码，位于 C++ 编写的 ALPS 调度器与您的 Fortran 代码之间。ALPS 用普通的 C++ 调用 ALPS Fortran，ALPS Fortran 再以普通的 Fortran 子程序调用方式调用您程序中的子程序——这正是 ALPS 能够以控制 C++ `Worker` 类完全相同的方式（作业调度、检查点、进程控制）来控制 Fortran 程序的原因，参见 [Integration-00 第 9 步](../alpsize00#第-9-步--与-alpsparapack-调度器完全集成)。ALPS Fortran 还提供了反方向的通道：一组子程序（`alps_get_parameter`、`alps_accumulate_observable` 等），让您的 Fortran 代码可以像调用普通 Fortran 子程序一样回调 ALPS，因此您完全不需要编写或调用任何 C++ 代码。

## 调用流程

下图展示了 ALPS 系统与用户程序在一次运行的生命周期中的调用流程，分为三个阶段：**初始化**、**计算循环**和**结束处理**。

![调用流程](../figs/callflow.png)

在初始化阶段，ALPS 调用一次 `alps_init`，您的代码通常会在其中回调 `alps_get_parameter` 和 `alps_parameter_defined` 来读取参数；随后 ALPS 调用 `alps_init_observables`，您的代码在其中调用 `alps_init_observable` 注册每个测量量。接下来 ALPS 反复调用 `alps_run`——真正的计算部分——并穿插调用 `alps_is_thermalized` 和 `alps_progress`，直到进度达到 1.0；每次 `alps_run` 通常都会回调 `alps_accumulate_observable` 记录测量结果。最后，在结束阶段，ALPS 调用 `alps_save`（其中会调用 `alps_dump` 写出检查点数据）以及 `alps_finalize`。下面的子程序参考文档详细说明了这张图中的每一个环节。

学习过 [Integration-00](../alpsize00) 的读者会认出这正是同一个三阶段结构——它与第 9 步中 `wolff_worker` C++ 类的生命周期完全一致，只是分散到了 Fortran 子程序中，而不是 C++ 成员函数：

| ALPS Fortran 子程序 | 对应的 C++ `Worker` 方法（Integration-00 第 9 步） |
| :----------------------- | :------------------------------------------------------- |
| `alps_init`               | 构造函数 |
| `alps_init_observables`   | `init_observables` |
| `alps_run`                | `run` |
| `alps_progress`           | `progress` |
| `alps_is_thermalized`     | `is_thermalized` |
| `alps_save`               | `save` |
| `alps_load`               | `load` |
| `alps_finalize`           | 析构函数 |

## Fortran 源代码的准备

要使用 ALPS Fortran 实现一个程序，需要准备两个源文件：

- 一个 **C++ 源文件**，定义 `main` 函数（程序的入口点）。
- 一个 **Fortran 源文件**，实现 ALPS Fortran 所要求的子程序。

### 入口点

`main` 函数设置程序的元数据，例如版本号、版权声明、Worker 名称和 Evaluator 名称。大多数情况下 `main` 函数体本身无需改动——只需为您的程序更新这些元数据字符串。

以下是一个 C++ 入口点的示例——实际上，这正是 [Integration-02](../alpsize02) 中 `hello.C` 和 `ising.C` 的样子，只是把元数据字符串和 Worker 名称换成了占位符，而不是 `"hello"`/`"ising"`：

```cpp
#include <alps/parapack/parapack.h>
#include "alps/fortran/fortran_wrapper.h"

// Version number
PARAPACK_SET_VERSION("my version");

// Copyright notice
PARAPACK_SET_COPYRIGHT("my copyright");

// Worker name
PARAPACK_REGISTER_WORKER(alps::fortran_wrapper, "worker name");

// Evaluator
PARAPACK_REGISTER_EVALUATOR(alps::parapack::simple_evaluator, "evaluator name");

int main(int argc, char** argv)
{
    return alps::parapack::start(argc, argv);
}
```

将示例字符串（`"my version"`、`"my copyright"`、`"worker name"`、`"evaluator name"`）替换为适合您程序的值。`alps::fortran_wrapper` 正是让这一切得以运作的 ALPS 提供的 Worker 类：它是一个满足与 [Integration-00 第 9 步](../alpsize00#第-9-步--与-alpsparapack-调度器完全集成)中手写 Worker 相同接口的 C++ 类，但它不直接用 C++ 实现 `run`、`is_thermalized` 等方法，而是将每次调用转发给您下面实现的 Fortran 子程序。

### Fortran 源代码

Fortran 源代码的主要内容是计算逻辑。但是，您必须始终实现一组固定的必需子程序，以便 ALPS Fortran 能够控制您的程序。在加载参数或保存结果时，您需要调用 ALPS Fortran 提供的子程序，而不是自己处理 I/O。

#### 必需的子程序

以下子程序必须出现在 Fortran 源文件中。如果缺少任意一个，构建时将产生链接错误。

每个必需的子程序都会接收 `caller` 作为参数——这是一个整型数组，ALPS Fortran 在内部用它来调用 ALPS 的功能。**不要修改 `caller` 的值。** 如果更改了它的值，将导致未定义行为。

每个子程序都必须引入 `alps/fortran/alps_fortran.h`：

```fortran
subroutine alps_init(caller)
implicit none
include "alps/fortran/alps_fortran.h"
integer :: caller(2)

! --- your code here --- !
```

---

**`alps_init(caller)`**

| **类型** | **名称** | **输入/输出** | **含义** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | 内部 ALPS 句柄——请勿修改 |

在计算开始之前被调用一次。在这里进行初始化：分配数组、读取参数。

---

**`alps_init_observables(caller)`**

| **类型** | **名称** | **输入/输出** | **含义** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | 内部 ALPS 句柄 |

在 `alps_init` 之后被调用一次。在这里向 `alps::ObservableSet` 注册可观测量（测量量）。每组输入参数调用一次。关于 `alps::ObservableSet` 的详细信息请参见 [ALPS 文档](https://alps.comp-phys.org)。

---

**`alps_run(caller)`**

| **类型** | **名称** | **输入/输出** | **含义** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | 内部 ALPS 句柄 |

包含核心计算逻辑。ALPS 会反复调用该子程序，直到 `alps_progress` 返回的值 ≥ 1.0。由于循环由 ALPS 管理，**请勿在 `alps_run` 内部编写外层循环**。以线程级并行运行时，该子程序会在多个线程上同时执行，因此必须是线程安全的。

---

**`alps_progress(prgrs, caller)`**

| **类型** | **名称** | **输入/输出** | **含义** |
| :------- | :------- | :------ | :---------- |
| real\*8  | prgrs    | out | 进度指示（0.0 ≤ prgrs；当 prgrs ≥ 1.0 时计算结束） |
| integer  | caller(2) | in | 内部 ALPS 句柄 |

在每次调用 `alps_run` 之后由 ALPS 调用。当 `prgrs < 1.0` 时，ALPS 会继续调用 `alps_run`。当 `prgrs ≥ 1.0` 时，ALPS 认为计算已完成并停止。以线程级并行运行时必须是线程安全的。

---

**`alps_is_thermalized(thrmlz, caller)`**

| **类型** | **名称** | **输入/输出** | **含义** |
| :------- | :------- | :------ | :---------- |
| integer  | thrmlz   | out | 热化标志：0 = 尚未热化，1 = 已热化 |
| integer  | caller(2) | in | 内部 ALPS 句柄 |

在每次 `alps_run` 之后由 ALPS 调用。当 `thrmlz = 0` 时，ALPS 不保存测量结果（系统仍在热化中）。当 `thrmlz = 1` 时，ALPS 开始保存结果。以线程级并行运行时必须是线程安全的。

---

**`alps_finalize(caller)`**

| **类型** | **名称** | **输入/输出** | **含义** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | 内部 ALPS 句柄 |

在 `alps_progress` 返回的值 ≥ 1.0 之后被调用一次。在这里进行清理：释放数组和其他资源。

---

**`alps_save(caller)`**

| **类型** | **名称** | **输入/输出** | **含义** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | 内部 ALPS 句柄 |

在每次 `alps_run` 之后由 ALPS 调用。使用 `alps_dump` 将检查点数据写入重启文件。以线程级并行运行时必须是线程安全的。

---

**`alps_load(caller)`**

| **类型** | **名称** | **输入/输出** | **含义** |
| :------- | :------- | :------ | :---------- |
| integer  | caller(2) | in | 内部 ALPS 句柄 |

在程序重启时被调用一次。使用 `alps_restore` 从重启文件中加载检查点数据。

---

#### ALPS Fortran 提供的子程序

要从您的 Fortran 程序中调用 ALPS 的功能，请使用 ALPS Fortran 提供的子程序。每个子程序都以 `caller(2)` 作为参数；传入外层必需子程序所接收到的 `caller` 变量即可。

下表中引用的数据类型常量定义在 `alps_fortran.h` 中：`ALPS_CHAR`（字符串，例如用于读取 [Integration-02](../alpsize02) 中 `WORLD` 这样的文本型参数）、`ALPS_INT`、`ALPS_LONG`、`ALPS_REAL` 和 `ALPS_DOUBLE_PRECISION`。

---

**`alps_get_parameter(data, name, type, caller)`**

| **类型**  | **名称**   | **输入/输出** | **含义** |
| :-------- | :--------- | :------ | :---------- |
| —         | data       | out | 用于接收参数值的变量 |
| character | name(\*)   | in  | 参数名 |
| integer   | type       | in  | 数据类型常量（定义于 `alps_fortran.h`） |
| integer   | caller(2)  | in  | 内部 ALPS 句柄 |

从 ALPS 参数文件中读取一个指定名称的参数到 `data`。通常在 `alps_init` 中调用。可用的类型常量定义在 `alps_fortran.h` 中。

---

**`alps_parameter_defined(res, name, caller)`**

| **类型**  | **名称**   | **输入/输出** | **含义** |
| :-------- | :--------- | :------ | :---------- |
| integer   | res        | out | 参数已定义则为 1，否则为 0 |
| character | name(\*)   | in  | 参数名 |
| integer   | caller(2)  | in  | 内部 ALPS 句柄 |

返回指定名称的参数是否出现在参数文件中。通常在 `alps_init` 中用于处理可选参数。

---

**`alps_init_observable(count, type, name, caller)`**

| **类型**  | **名称**   | **输入/输出** | **含义** |
| :-------- | :--------- | :------ | :---------- |
| integer   | count      | in | 该可观测量的元素数 |
| integer   | type       | in | 数据类型常量 |
| character | name(\*)   | in | 注册该可观测量所用的名称 |
| integer   | caller(2)  | in | 内部 ALPS 句柄 |

在 `alps_init_observables` 内向 `alps::ObservableSet` 注册一个具名可观测量。可观测量的类型由 `type` 和 `count` 共同决定：

| **type** | **count** | **可观测量类型** |
| :------- | :-------- | :------------------ |
| ALPS_INT                | 1   | IntObservable |
| ALPS_INT                | > 1 | IntVectorObservable |
| ALPS_REAL               | 1   | RealObservable |
| ALPS_REAL               | > 1 | RealVectorObservable |
| ALPS_DOUBLE_PRECISION   | 1   | RealObservable |
| ALPS_DOUBLE_PRECISION   | > 1 | RealVectorObservable |

---

**`alps_accumulate_observable(data, count, type, name, caller)`**

| **类型**  | **名称**   | **输入/输出** | **含义** |
| :-------- | :--------- | :------ | :---------- |
| —         | data       | in  | 要记录的值 |
| integer   | count      | in  | 元素数 |
| integer   | type       | in  | 数据类型常量 |
| character | name(\*)   | in  | 要存入的可观测量名称 |
| integer   | caller(2)  | in  | 内部 ALPS 句柄 |

将一次测量结果记录到指定的可观测量中。在 `alps_run` 内调用。`count`、`type`、`name` 必须与 `alps_init_observable` 中使用的一致。

---

**`alps_dump(data, count, type, caller)`**

| **类型**  | **名称**  | **输入/输出** | **含义** |
| :-------- | :-------- | :------ | :---------- |
| —         | data      | in  | 要保存的数据 |
| integer   | count     | in  | 元素数 |
| integer   | type      | in  | 数据类型常量 |
| integer   | caller(2) | in  | 内部 ALPS 句柄 |

将数据写入重启文件。在 `alps_save` 内调用。用 `alps_dump` 保存的数据必须使用 `alps_restore` 按相同顺序恢复。

---

**`alps_restore(data, count, type, caller)`**

| **类型**  | **名称**  | **输入/输出** | **含义** |
| :-------- | :-------- | :------ | :---------- |
| —         | data      | out | 存放加载数据的位置 |
| integer   | count     | in  | 元素数 |
| integer   | type      | in  | 数据类型常量 |
| integer   | caller(2) | in  | 内部 ALPS 句柄 |

从重启文件中读取数据。在 `alps_load` 内调用。数据必须按照 `alps_dump` 保存时的相同顺序恢复。

---

### 编辑 CMakeLists.txt

用户程序与 ALPS 本身一样使用 CMake 构建——关于 ALPS 的 CMake 集成机制的一般说明，请参见 [Integration-01](../alpsize01)。下面是一个 `CMakeLists.txt` 示例，遵循 [Integration-00](../alpsize00) 和 [Integration-02](../alpsize02) 中使用的同一模式，并扩展了 `Fortran` 支持。请将 `myproject`、`main.C`、`myprogram_impl.f90` 替换为您项目的实际名称：

```cmake
cmake_minimum_required(VERSION 3.18 FATAL_ERROR)
project(myproject NONE)

# find ALPS Library
find_package(ALPS REQUIRED PATHS ${ALPS_ROOT_DIR} $ENV{ALPS_HOME} NO_SYSTEM_ENVIRONMENT_PATH)
message(STATUS "Found ALPS: ${ALPS_ROOT_DIR} (revision: ${ALPS_VERSION})")
include(${ALPS_USE_FILE})

# enable C, C++, and Fortran compilers
enable_language(C CXX Fortran)

# rule for generating the program
add_executable(myprogram main.C myprogram_impl.f90)
target_link_libraries(myprogram ${ALPS_LIBRARIES} ${ALPS_FORTRAN_LIBRARIES})
```

{{< callout type="warning" >}}
不要忘记 `enable_language(... Fortran)` 和 `PATHS ${ALPS_ROOT_DIR} $ENV{ALPS_HOME}`——如果缺少它们，CMake 要么根本不会启用 Fortran 编译器，要么（如果没有 `NO_SYSTEM_ENVIRONMENT_PATH` 搭配的 `PATHS` 参数）可能找不到 ALPS。关于这里每一行为什么重要，请参见 [Integration-01](../alpsize01#cmakeliststxt-的结构剖析)。
{{< /callout >}}

## 移植一个已有的 Fortran 程序

本节将演示如何把 Ising 模型程序 `ising_original.f` 移植到 ALPS Fortran。这里用到的所有文件都是 [ALPS 仓库](https://github.com/ALPSim/ALPS)中 `tutorials/alpsize-11-fortran-ising` 目录的一部分——与 [Integration-00](../alpsize00) 中 C++ 教程所在的同一个仓库。

### 移植前的准备

将以下文件从教程目录复制到您的工作目录：

- `ising_original.f` — 原始源代码
- `template.f90` — ALPS Fortran 程序模板
- `ising.C` — 入口点（结构上与 [Integration-02](../alpsize02) 中的 `hello.C` 入口点完全相同，只是把 `"ising"` 作为 Worker/Evaluator 名称）
- `CMakeLists.txt` — 构建配置模板

`template.f90` 包含所有必需子程序的桩（stub）定义。开发新程序时，建议从 `template.f90` 出发，而不是从零开始编写这些子程序。

原始代码的结构如下：

| 行号   | 处理内容 |
| :------ | :--------- |
| 5–9     | 变量声明与初始化 |
| 10–25   | 数组元素初始化 |
| 26–49   | 主循环 |
| 27–36   | 计算 |
| 38      | 热化检查 |
| 39–48   | 保存结果 |
| 50–60   | 结果输出 |

### 移植 Fortran 代码

`ising_original.f` 的每个代码块都被分配给对应的 ALPS Fortran 子程序。`ising_impl.f90` 就是移植完成后的版本。

#### 变量声明

`ising_original.f` 中声明的变量必须被移入一个 ALPS Fortran 模块，以便多个子程序都能访问它们。

- 移植前：

  ```fortran
  6    DIMENSION IS(20,20),IP(20),IM(20),P(-4:4),A(4)
  7    C PARAMETERS
  8          DATA TEMP/2.5/, L/10/, MCS/1000/, INT/1000/
  9          DATA IX/1234567/, V0/.465661288D-9/
  ```

- 移植后：

  ```fortran
  module ising_mod
    implicit none
    real, parameter :: V0 = .465661288D-9

    integer, allocatable, dimension(:) :: IP, IM
    integer, allocatable, dimension(:,:) :: IS
    real*8, allocatable, dimension(:) :: P
    integer :: K, MCS, INT, L, IX
    real :: TEMP
  end module ising_mod
  ```

`IP`、`IM`、`IS`、`P` 在 `alps_init` 中分配，因此这里不固定它们的大小。原来用于累加结果的数组 `A` 被 ALPS 的可观测量取代，不再需要。变量的值改为在运行时从参数文件读取。新增了 `K` 用来计数迭代次数；移植后的热化检查通过监视 `K` 的值来实现，而不再使用带 `GOTO` 的循环。（`!$omp threadprivate` 这一行是稍后在[多线程支持](#多线程支持)中加入的——教程中实际提供的 `ising_impl.f90` 已经包含这一行，因为它展示的是最终的、线程安全的完整程序。）

**注意：本例的 MPI 版本不需要线程安全，因此这里不考虑线程安全问题。**

#### 初始化

原始代码中的初始化代码块（数组设置）对应移植后的 `alps_init`。参数通过 `alps_get_parameter` 从参数文件中读取，用于存储结果的可观测量在 `alps_init_observables` 中注册。这些子程序由 ALPS 自动调用——您不需要自己调用它们。

- 移植前：

  ```fortran
  10   C TABLES
  11         DO 10 I=-4,4
  12         W=EXP(FLOAT(I)/TEMP)
  13    10   P(I)=W/(W+1/W)
  14         DO 11 I=1,L
  15         IP(I)=I+1
  16    11   IM(I)=I-1
  17         IP(L)=1
  18         IM(1)=L
  19   C INITIAL CONFIGURATION
  20         DO 20 I=1,L
  21         DO 20 J=1,L
  22    20   IS(I,J)=1
  23   C ACCUMULATION DATA RESET
  24         DO 21 I=1,4
  25    21   A(I)=0.0
  ```

- 移植后（`alps_init`）：

  ```fortran
  subroutine alps_init(caller)
    use ising_mod
    implicit none
    include "alps/fortran/alps_fortran.h"
    integer :: caller(2)
    integer :: i, j
    real*8 :: W

    call alps_get_parameter(TEMP, "TEMPERATURE", ALPS_REAL, caller)
    call alps_get_parameter(L, "L", ALPS_INT, caller)
    call alps_get_parameter(MCS, "MCS", ALPS_INT, caller)
    call alps_get_parameter(INT, "INT", ALPS_INT, caller)

    allocate( IP(L) )
    allocate( IM(L) )
    allocate( P(-4:4) )
    allocate( IS(L, L) )

    K = 0
    IX = 1234567

    do i = -4, 4
       W = exp(float(i)/TEMP)
       P(i) = W / (W + 1/W)
    end do

    do i = 1, L
       IP(i) = i + 1
       IM(i) = i - 1
    end do

    do i = 1, L
       do j = 1, L
          IS(i, j) = 1
       end do
    end do

    IP(L) = 1
    IM(1) = L

    return
  end subroutine alps_init
  ```

开头对 `alps_get_parameter` 的调用，读取的正是原本硬编码在 `DATA` 语句中的值，只不过现在改从 ALPS 参数文件中读取。后面的数组设置部分与原始代码完全相同。

{{< callout type="info" >}}
`ising_impl.f90` 中实际提供的 `alps_init` 版本还会调用 `omp_get_thread_num()`，并打印出线程 ID 和刚读取到的参数，例如 `----- alps_init( 2 ) -----`。这是一个小小的诊断辅助手段，用来确认——在读到下面的[多线程支持](#多线程支持)之后——各个克隆确实运行在不同的线程上；为了清晰起见这里省略了它，但把它加到您自己的代码中也无妨。
{{< /callout >}}

- 移植后（`alps_init_observables`）：

  ```fortran
  subroutine alps_init_observables(caller)
    implicit none
    include "alps/fortran/alps_fortran.h"
    integer :: caller(2)

    call alps_init_observable(1, ALPS_REAL, "Energy", caller)
    call alps_init_observable(1, ALPS_REAL, "Magnetization", caller)

    return
  end subroutine alps_init_observables
  ```

名为 `"Energy"` 和 `"Magnetization"` 的可观测量被注册为存储结果的缓冲区。在原始代码中，总和与平方和是手动累加到数组 `A` 中的；移植后，这一切由 `alps_accumulate_observable` 自动完成。

#### 计算与保存结果

原始代码用一个 `DO` 循环来迭代。移植后，`alps_run` 每次调用执行一次迭代——ALPS 通过反复调用 `alps_run`，直到 `alps_progress` 返回值 ≥ 1.0 来管理这个循环。

- 移植前：

  ```fortran
  26   C SIMULATION
  27         DO 30 K=1,MCS+INT
  28         KIJ=0
  29         DO 31 I=1,L
  30         DO 31 J=1,L
  31         M=IS(IP(I),J)+IS(I,IP(J))+IS(IM(I),J)+IS(I,IM(J))
  32         KIJ=KIJ+1
  33         IS(I,J)=-1
  34         IX=IAND(IX*5*11,2147483647)
  35         IF(P(M).GT.V0*IX) IS(I,J)=1
  36    31   CONTINUE
  37   C DATA
  38         IF(K.LE.INT) GOTO 30
  39         EN=0
  40         MG=0
  41         DO 40 I=1,L
  42         DO 40 J=1,L
  43         EN=EN+IS(I,J)*(IS(IP(I),J)+IS(I,IP(J)))
  44    40   MG=MG+IS(I,J)
  45         A(1)=A(1)+EN
  46         A(2)=A(2)+EN**2
  47         A(3)=A(3)+MG
  48         A(4)=A(4)+MG**2
  49    30   CONTINUE
  ```

- 移植后（`alps_run`）：

  ```fortran
  subroutine alps_run(caller)
    use ising_mod
    implicit none
    include "alps/fortran/alps_fortran.h"
    integer :: caller(2)
    integer :: i, j, M
    real*8 :: EN, MG

    do i = 1, L
       do j = 1, L
          M = IS(IP(i), j) + IS(i, IP(j)) + IS(IM(i), j) + IS(i, IM(j))
          IS(i, j) = -1

          IX = IAND(IX * 5 * 11, 2147483647)
          if(P(M).gt.V0*IX) IS(i, j) = 1
       end do
    end do

    EN = 0.0D0
    MG = 0.0D0
    do i = 1, L
       do j = 1, L
          EN = EN + IS(i, j) * (IS(IP(i), j) + IS(i, IP(j)))
          MG = MG + IS(i, j)
       end do
    end do

    call alps_accumulate_observable(EN, 1, &
         ALPS_DOUBLE_PRECISION, "Energy", caller)
    call alps_accumulate_observable(MG, 1, &
         ALPS_DOUBLE_PRECISION, "Magnetization", caller)
    K = K + 1

    return
  end subroutine alps_run
  ```

计算循环本身与原始代码完全相同。外层的 `DO 30 K=1,MCS+INT` 循环消失了——改由 ALPS 反复调用 `alps_run`，末尾的 `K = K + 1` 用来记录被调用的次数。对 `alps_accumulate_observable` 的调用直接记录结果；原来手动累加到 `A(1)`–`A(4)` 中的求和与平方运算，现在由可观测量自动完成。

- 移植后（`alps_progress`）：

  ```fortran
  subroutine alps_progress(prgrs, caller)
    use ising_mod
    implicit none
    include "alps/fortran/alps_fortran.h"
    integer :: caller(2)
    real*8 :: prgrs

    prgrs = K / (INT + MCS)

  end subroutine alps_progress
  ```

`alps_progress` 控制迭代何时停止。一旦 `prgrs ≥ 1.0`（即 `K ≥ INT + MCS`），ALPS 就会停止调用 `alps_run`。

#### 热化检查

在原始代码中，热化检查嵌入在主循环内。移植后它变成了一个独立的子程序。

- 移植前：

  ```fortran
  38         IF(K.LE.INT) GOTO 30
  ```

- 移植后（`alps_is_thermalized`）：

  ```fortran
  subroutine alps_is_thermalized(thrmlz, caller)
    use ising_mod
    implicit none
    include "alps/fortran/alps_fortran.h"
    integer :: caller(2)
    integer :: thrmlz

    if(K >= INT) then
       thrmlz = 1
    else
       thrmlz = 0
    end if

    return
  end subroutine alps_is_thermalized
  ```

与 `alps_progress` 一样，热化状态由迭代计数器 `K` 决定。当 `thrmlz = 1` 时，ALPS 开始保存测量结果。

#### 输出与后处理

使用 ALPS 时，输出和后处理都是自动完成的。原始程序中的输出代码在移植后不再需要。

- 移植前：

  ```fortran
  50   C STATISTICS
  51         DO 50 I=1,4
  52    50   A(I)=A(I)/MCS
  53         C=(A(2)-A(1)**2)/L**2/TEMP**2
  54         X=(A(4)-A(3)**2)/L**2/TEMP
  55         ENG=A(1)/L**2
  56         AMG=A(3)/L**2
  57         WRITE(6,100) TEMP,L,ENG,C,AMG,X
  58    100  FORMAT(' TEMP=',F10.5,' SIZE=',I5,
  59        * /' ENG =',F10.5,' C   =',F10.5,
  60        * /' MAG =',F10.5,' X   =',F10.5)
  ```

- 移植后：无需代码。调度器会自动收集 `Energy` 和 `Magnetization` 可观测量，并写出标准的 ALPS 结果文件——参见下文[运行移植后的程序](#运行移植后的程序)。

#### 结束处理

原始代码没有显式的清理代码，因为它使用的是静态数组。移植后，动态分配的数组必须在 `alps_finalize` 中释放。

- 移植前：无需代码。

- 移植后（`alps_finalize`）：

  ```fortran
  subroutine alps_finalize(caller)
    use ising_mod
    implicit none
    include "alps/fortran/alps_fortran.h"
    integer :: caller(2)

    deallocate(IP)
    deallocate(IM)
    deallocate(P)
    deallocate(IS)

    return
  end subroutine alps_finalize
  ```

#### 重启支持

实现 `alps_save` 和 `alps_load` 可以为程序添加检查点/重启能力。原始代码没有重启支持；下面的示例展示了如何添加它。

- 移植前：无需代码。

- 移植后（`alps_save`）：

  ```fortran
  subroutine alps_save(caller)
    use ising_mod
    implicit none
    include "alps/fortran/alps_fortran.h"
    integer caller(2)

    call alps_dump(K, 1, ALPS_INT, caller)
    call alps_dump(IX, 1, ALPS_INT, caller)
    call alps_dump(IS, L * L, ALPS_INT, caller)

    return
  end subroutine alps_save
  ```

只有恢复计算所需的变量（`K`、`IX`、`IS`）被保存。

- 移植后（`alps_load`）：

  ```fortran
  subroutine alps_load(caller)
    use ising_mod
    implicit none
    include "alps/fortran/alps_fortran.h"
    integer :: caller(2)

    call alps_restore(K, 1, ALPS_INT, caller)
    call alps_restore(IX, 1, ALPS_INT, caller)
    call alps_restore(IS, L * L, ALPS_INT, caller)

    return
  end subroutine alps_load
  ```

数据必须按照保存时的相同顺序恢复。注意，当 ALPS 程序重启时，`alps_init` 会在 `alps_load` 之前被调用，因此内存分配和变量初始化仍照常在 `alps_init` 中完成——`alps_load` 只需要恢复保存的值。

#### 多线程支持

要以线程级并行运行，所有被并行子程序访问的模块变量都必须声明为 `threadprivate`。在 `ising_mod` 中加入以下这一行：

- 移植后（多线程）：

  ```fortran
  module ising_mod
    implicit none
    real, parameter :: V0 = .465661288D-9

    integer, allocatable, dimension(:) :: IP, IM
    integer, allocatable, dimension(:,:) :: IS
    real*8, allocatable, dimension(:) :: P
    integer :: K, MCS, INT, L, IX
    real :: TEMP
    !$omp threadprivate (K, MCS, INT, TEMP, IP, IM, P, IS, IX, L)
  end module ising_mod
  ```

这正是[变量声明](#变量声明)中展示的那个 `ising_mod`——教程中实际提供的 `ising_impl.f90` 已经包含这一行，因为它展示的是最终的、线程安全的完整程序，而不是中间的单线程版本。

### 关于 `ising.C`

`ising.C` 文件提供程序入口点，与上文[入口点](#入口点)中所述完全一致。`main` 函数体本身无需改动；只需为您自己的程序更新元数据字符串。

### 关于 `CMakeLists.txt`

按照上文[编辑 CMakeLists.txt](#编辑-cmakeliststxt)中展示的相同模式，更新 `CMakeLists.txt` 以匹配您自己的源文件名——下面这份实际上就是用来构建本教程的真实 `CMakeLists.txt`：

```cmake
cmake_minimum_required(VERSION 3.18 FATAL_ERROR)
project(alpsize NONE)

# find ALPS Library
find_package(ALPS REQUIRED PATHS ${ALPS_ROOT_DIR} $ENV{ALPS_HOME} NO_SYSTEM_ENVIRONMENT_PATH)
message(STATUS "Found ALPS: ${ALPS_ROOT_DIR} (revision: ${ALPS_VERSION})")
include(${ALPS_USE_FILE})

# enable C, C++, and Fortran compilers
enable_language(C CXX Fortran)

# rule for generating ising program
add_executable(ising ising.C ising_impl.f90)
target_link_libraries(ising ${ALPS_LIBRARIES} ${ALPS_FORTRAN_LIBRARIES})
```

## 运行移植后的程序

按照与 [Integration-02](../alpsize02) 中 `hello` 示例相同的方式构建：

```bash
$ cmake -DALPS_ROOT_DIR=${ALPS_ROOT} .
$ make
```

教程目录中提供了一个现成的 `ising_params` 参数文件，包含四个克隆，分别对应不同的温度、晶格大小和扫描次数：

```
ALGORITHM = "ising"
{ TEMPERATURE = 2.5; MCS = 1000; INT = 1000; L=10; }
{ TEMPERATURE = 2.3; MCS = 900; INT = 1100; L=20; }
{ TEMPERATURE = 2.1; MCS = 800; INT = 1200; L=30; }
{ TEMPERATURE = 1.9; MCS = 700; INT = 1300; L=40; }
```

按照与 Integration-02 完全相同的方式，将其转换为 XML 并运行：

```bash
$ cp ${SAMPLES}/alpsize-11-fortran-ising/ising_params .
$ parameter2xml ising_params
$ ./ising ising_params.in.xml
```

由于教程提供的 `ising_impl.f90` 中，`alps_init` 和 `alps_finalize` 会打印一段简短的诊断信息（参见上文[初始化](#初始化)中的说明），每个克隆在开始和结束时都会做出提示，例如：

```
----- alps_init( 0 ) -----
   TEMP =  2.5000000000000000
   MCS =  1000
   INT =  1000
   L =  10
```

四个克隆全部完成后，ALPS 会将累积得到的 `Energy` 和 `Magnetization` 可观测量——附带自动计算的误差棒，正如 C++ 教程中 `alps::alea` 所提供的那样——写入标准的 ALPS 结果文件，您可以用 [ALPS 文档](https://alps.comp-phys.org)中提到的常规 ALPS/`pyalps` 工具查看这些文件。

## 接下来做什么？

至此，ALPS 集成教程系列就完成了。您已经看到同一个底层调度器——参数、可观测量、检查点、并行克隆——分别以纯 C（[Integration-00](../alpsize00)）驱动、在构建系统层面加以说明（[Integration-01](../alpsize01)），以及以 Fortran（[Integration-02](../alpsize02) 和本页）驱动的样子。返回[集成部分总览](../)查看完整的教程列表，或前往 [ALPS 晶格库](../../intro/latticehowtos)和[方法文档](../../methods)，了解在您自己的代码完成集成之后，ALPS 还能模拟哪些内容。
