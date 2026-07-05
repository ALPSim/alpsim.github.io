
---
title: Alpsize-03 Fortran 应用程序开发
math: true
toc: true
weight: 4
---

ALPS Fortran 是 ALPS 的 Fortran 接口模块。使用 ALPS Fortran，只需实现若干必要的子程序，即可在 ALPS 上轻松运行 Fortran 代码程序。本章介绍编写在 ALPS 上运行的 Fortran 代码的步骤。此外，本章还介绍如何修改 `CMakeList.txt` 文件的设置步骤，以及如何构建要移植到现有 ALPS Fortran 的 Fortran 代码。

## ALPS Fortran 简介

下图显示了 ALPS 系统、ALPS Fortran 与用户 Fortran 程序之间的关系图。

![ALPS Fortran 模块](../figs/fortranmodule.png)

ALPS Fortran 由 ALPS 调用，并在需要时调用用户程序的子程序。因此，ALPS 能够像控制 C++ 程序一样控制以 Fortran 实现的程序。另一方面，ALPS Fortran 提供了调用 ALPS 功能的子程序。因此，用户程序可以像调用普通 Fortran 子程序一样使用 ALPS 的功能。

## 子程序的调用流程

下图显示了 ALPS 系统与用户程序的流程图。关于以下各个子程序，请参见 [2.3.3]。

![调用流程](../figs/callflow.png)

## Fortran 源代码的准备

要使用 ALPS Fortran 实现程序，需要准备以下两种源代码。

- 实现 main 函数（程序入口点）的 C++ 源代码。
- 按照 ALPS Fortran 规则实现的 Fortran 源代码。

### 入口点　

本节介绍程序的设置，例如 main 函数（程序的入口点）和 worker 名称。main 函数只需描述固定内容，通常不需要更改。关于程序的设置，请参考以下代码。

- 程序版本号
- 程序版权信息
- Worker 名称
- Evaluator 名称

以下是 C++ 源代码的示例。

    1:    #include <alps/parapack/parapack.h>
    2:    #include "fortran_wrapper.h"
    3:    
    4:    // Version number setting
    5:    PARAPACK_SET_VERSION("my version");
    6:    
    7:    // Copywrite display setting
    8:    PARAPACK_SET_COPYRIGHT("my copyright");
    9:    
    10:    // Worker name setting
    11:    PARAPACK_REGISTER_WORKER(alps::fortran_wrapper, "worker name</span>");
    12:    
    13:    // Evaluator setting
    14:    PARAPACK_REGISTER_EVALUATOR(alps::parapack::simple_evaluator,"evaluator name");
    15:    
    16:    
    17:    /**
    18:     * Programのentry point
    19:     */
    20:    int main(int argc, char** argv)
    21:    {
    22:        return alps::parapack::start(argc, argv);
    23:    }

上例中需要更改的是红色部分的字符。

### Fortran 源代码

Fortran 源代码的主要内容是计算逻辑。但是，使用 ALPS Fortran 时始终需要实现若干子程序。在加载参数和保存计算结果时，需要通过 ALPS Fortran 提供的子程序来调用 ALPS 的功能。

#### 必需的子程序　

为了让用户程序控制 ALPS 的功能，Fortran 源代码中需要若干子程序。请阅读下面对各子程序的说明并进行适当实现；如果省略它们，将产生链接错误，无法构建。实现这些子程序时，请注意以下几点：

- 所有子程序都会以 `integer :: caller(2)` 作为参数传入。caller 是在内部用于调用 ALPS 功能的变量。因此，请勿改写 caller 的值。如果更改了 caller 的值，则行为无法保证。

- 在每个子程序中 include `alps/fortran/alps_fortran.h`。从 Fortran 代码调用 ALPS 功能时需要该文件。

因此，对于必需的子程序，需要在子程序签名的正下方加入以下三行。

    1:    subroutine alps_init(caller)
    2:    implicit none
    3:    include "alps/fortran/alps_fortran.h"
    4:    integer :: caller(2)
    5:    
    6:    ! --- snip --- !

**`alps_init(caller)`**

- 参数

| **类型**  |  **名称**  |  **输入/输出**  |  **含义** |
| :-------  |  :-------  |  :------  |  :---------- |
|integer  |  caller(2)  |  in  |  局部变量 |

- 说明

该子程序在执行计算之前被调用一次。在这里进行诸如分配数组等程序的初始化处理。

**`alps_init_observables(caller)`**

- 参数

| **类型**  |  **名称**  |  **输入/输出**  |  **含义** |
| :-------  |  :-------  |  :------  |  :---------- |
| integer  |  caller(2)  |  in  |  局部变量 |

- 说明

该子程序在调用 `alps_init` 之后仅被调用一次。在这里初始化 `alps::ObservableSet`。该子程序对每个输入参数调用一次。另外，关于 `alps::ObservableSet` 的详细信息，请参见 ALPS 主页。

**`alps_run(caller)`**

- 参数

| **类型**  |  **名称**  |  **输入/输出**  |  **含义** |
| :-------  |  :-------  |  :------  |  :---------- |
| integer  |  caller(2)  |  in  |  局部变量 |

- 说明

该子程序中实现计算逻辑。在 alps_progress 返回大于等于 1.0 的值之前，该子程序会被 ALPS 反复调用。因此，在该子程序内无需编写循环结构。此外，在线程级并行运行时，该子程序在多线程下工作，因此在线程级并行中使用时需要提供线程安全的实现。

**`alps_progress(prgrs, caller)`**

- 参数

| **类型**  |  **名称**  |  **输入/输出**  |  **含义** |
| :-------  |  :-------  |  :------  |  :---------- |
| real\*8  |  prgrs  |  out  |  程序的进度状态(0.0 ≦ prgrs) |
| integer  |  caller(2)  |  in   | 局部变量 |

- 说明

该子程序在 `alps_run` 之后由 ALPS 调用，将程序的进度状况返回给 ALPS。当 prgrs 的值小于 1.0 时，ALPS 会反复调用 `alps_run`。当为 `prgrs` 赋予大于等于 1.0 的值时，ALPS 判断计算已完成并结束程序。此外，在线程级并行运行时，该子程序在多线程下工作，因此在线程级并行中使用时需要提供线程安全的实现。

**`alps_is_thermalized(thrmlz, caller)`**

- 参数

| **类型**  |  **名称**  |  **输入/输出**  |  **含义** |
| :-------  |  :-------  |  :------  |  :---------- |
| real\*8  |  thrmlz   | out   | 热化结束标志(0:未完成 / 1:已完成) |
| integer  |  caller(2) |   in  |  局部变量 |

- 说明

该子程序在 alps_run 之后由 ALPS 调用，返回热化是否完成。当 thrmlz 的值为 0 时，程序判断计算仍处于热化阶段，不保存计算结果数据。另一方面，当值为 1 时，程序判断热化已完成，并开始保存计算结果。此外，在线程级并行运行时，该子程序在多线程下工作，因此在线程级并行中使用时需要提供线程安全的实现。

**`alps_finalize(caller)`**

- 参数

| **类型**  |  **名称**  |  **输入/输出**  |  **含义** |
| :-------  |  :-------  |  :------  |  :---------- |
| integer  |  caller(2)  |  in  |  局部变量 |

- 说明

该子程序在完成计算之后（从 alps_progress 返回大于等于 1.0 的值之后）仅被调用一次。在这里进行诸如释放已分配内存等结束处理。

**`alps_save(caller)`**

- 参数

| **类型**  |  **名称**  |  **输入/输出**  |  **含义** |
| :-------  |  :-------  |  :------  |  :---------- |
| integer  |  caller(2)  |  in   | 局部变量 |

- 说明

该子程序在 `alps_run` 之后由 ALPS 调用。使用 ALPS 的功能保存重启文件。此外，在线程级并行运行时，该子程序在多线程下工作，因此在线程级并行中使用时需要提供线程安全的实现。

**`alps_load(caller)`**

- 参数

| **类型**  |  **名称**  |  **输入/输出**  |  **含义** |
| :-------  |  :-------  |  :------  |  :---------- |
| integer  |  caller(2)  |  in  |  局部变量 |

- 说明

该子程序在程序重启时仅被调用一次。使用 ALPS 的功能加载已保存的重启文件。

#### ALPS Fortran 提供的子程序

从用户程序调用 ALPS 功能时，调用 ALPS Fortran 提供的子程序。这些子程序需要以 `integer :: caller(2)` 作为参数。caller 是从 ALPS Fortran 传入的局部变量，需要将传入 (2.2.3.1) 必需子程序参数中的变量原样传递给所提供的子程序。

**`alps_get_parameter(data, name, type, caller)`**

- 参数

| **类型**  |  **名称**  |  **输入/输出**  |  **含义** |
| :-------  |  :-------  |  :------  |  :---------- |
| -  |  data  |  out  |   值的存储位置 |
| character   | name(\*)  |  in  |  要取出的参数名 |
| integer  |  type  |  in  |  数据类型 |
| integer  |  caller(2)  |  in  |  局部变量 |

- 说明

指定名称，从 ALPS 接收参数。参数名、类型、元素数分别由 **name**、**type**、count 指定。该子程序主要用于在 `alps_init` 中初始化数组和变量。另外，type 可取的值在 `alps_fortran.h` 中定义。

**`alps_parameter_defined(res, name, caller)`**

- 参数

| **类型**  |  **名称**  |  **输入/输出**  |  **含义** |
| :-------  |  :-------  |  :------  |  :---------- |
| integer  |  res   | out  |  参数定义的有无(1:无定义 / 0:有定义) |
| character  |  name(\*)  |  in  |  参数名 |
| integer  |  caller(2)  |  in  |  局部变量 |

- 说明

返回由 **name** 指定的参数是否在参数文件中定义。如果已定义，则向 res 赋值 *1*；如果未定义，则赋值 *0*。该子程序主要用于在 `alps_init` 中初始化数组和变量。

**`alps_init_observable(count, type, name, caller)`**

- 参数

| **类型**  |  **名称**  |  **输入/输出**  |  **含义** |
| :-------  |  :-------  |  :------  |  :---------- |
| integer  |  count  |  in   | 存储的计算结果的元素数 |
| integer  |  type  |  in  |  数据类型 |
| character  |  name(\*)  |  in  |  要存储的 Observable 的名称 |
| integer  |  caller(2)  |  in  |  局部变量 |

- 说明

该子程序用于将在 `alps_init_observable` 中为 Observable 指定的名称注册到 `alps::ObservableSet`。Observable 的类型由 **type** 和 **count** 按如下方式确定。

| **type** | **count** | **Observable** |
| :------- | :-------- | :------------- |
| ALPS_INT  |  1   | IntObservable |
| ALPS_INT  |  1\<  |  in |
| ALPS_REAL  |  1  |  RealObservable |
| ALPS_REAL  |  1\<  |  RealVectorObservable |
| ALPS_DOUBLE_PRECISION  |  1   | RealObservable |
| ALPS_DOUBLE_PRECISION  |  1\<  |  RealVectorObservable |


**`alps_accumulate_observable(data, count, type, name, caller)`**

- 参数

| **类型**  |  **名称**  |  **输入/输出**  |  **含义** |
| :-------  |  :-------  |  :------  |  :---------- |
| -   | data  |  in   | 要存储的计算结果 |
| integer  |  count   | in  |  存储的计算结果的元素数 |
| integer  |  type  |  in  |  数据类型 |
| character  |  name(\*)  |  in   | 要存储的 Observable 的名称 |
| integer  |  caller(2)  |  in  |  局部变量 |

- 说明

将结果数据保存到指定名称的 Observable。该子程序用于在 `alps_run` 中存储计算结果。count / name / type 必须与在 `init_observable` 中指定的一致。

**`alps_dump(data, count, type, caller)`**

- 参数
| **类型**  |  **名称**  |  **输入/输出**  |  **含义** |
| :-------  |  :-------  |  :------  |  :---------- |
| -  |  data  |  in  |  要存储的值 |
| integer  |  count  |  in  |  要存储的值的元素数 |
| integer  |  type  |  in  |  数据类型 |
| integer  |  call(2)  |  in  |  局部变量 |

- 说明

该子程序用于在 `alps_save` 中保存重启文件。使用 `alps_dump` 保存的中断数据将在重启时使用。

**`alps_restore(data, count, type, caller)`**

- 参数

| **类型**  |  **名称**  |  **输入/输出**  |  **含义** |
| :-------  |  :-------  |  :------  |  :---------- |
| -  |  data   | out  |  加载值的存储位置 |
| integer  |  count  |  in  |  要加载的值的元素数 |
| integer  |  type  |  in  |  数据类型 |
| integer  |  caller(2)  |  in  |  局部变量 |

- 说明

该子程序用于在 `alps_load` 中加载重启文件。重启文件的数据按照在 `alps_dump` 中保存的顺序存储。因此，使用 `alps_restore` 加载时，请按照保存时的相同顺序取出数据。

### 编辑配置文件

用户程序与 ALPS 一样使用 CMake 构建。以下是用于在 CMake 中构建用户程序的配置文件(`CMakeLists.txt`)示例。

    1:    # CMakeList.txt
    2:    # editing configuration file for CMake
    3:    
    4:    cmake_minimum_required(VERSION 2.8.0 FATAL_ERROR)
    5:    
    6:    #Project name setting
    7:    project(**hello_sample**)
    8:    
    9:    # find ALPS Fortran setting
    10:    find_package(ALPS REQUIRED NO_SYSTEM_ENVIRONMENT_PATH)
    11:    message(STATUS "ALPS version: ${ALPS_VERSION}")
    12:    include(${ALPS_USE_FILE})
    13:    
    14:    # Source code required to create and run file name
    15:    add_executable(**hello main.C hello_impl.f**)
    16:    # External library file required to generate execution
    17:    target_link_libraries(**hello** ${ALPS_LIBRARIES} ${ALPS_FORTRAN_LIBRARIES})
    
上例中需要更改的是 \*\*...\*\* 内部的字符。

## 现有程序代码的移植

本节以下面所示的 Ising 模型程序为例，介绍使 ALPS 在现有 Fortran 程序上工作的步骤。

### 移植准备　

本节使用通过解压 `alps_fortran.tar.gz` 生成的 tutorial 目录中的文件。作为移植工作的准备，请将 tutorial 目录中的以下文件复制到工作目录。

- `ising_original.f`：原始源代码
- `template.f90`：ALPS Fortran 程序的模板源代码
- `main.C`：程序的入口点
- `CMakeList.txt`：`CMakeList.txt` 的模板

实现 ALPS 程序所需的所有子程序都已在 `template.f90` 中定义。因此，在开发新程序时，可以基于 `template.f90` 进行开发。

原始代码的大致结构如下。

|      | **处理内容** |
| :--- | :---------------------- |
| 4-7  |  变量声明与初始化 |
| 8-23  |  数组元素初始化 |
| 24-47 |   主循环 |
| 25-34  |  计算 |
| 36   | 热化检查 |
| 37-46  |  保存计算结果 |
| 48-58  |  结果输出 |


### 移植 Fortran 代码

在移植 Fortran 代码时，我们将 `ising_original.f` 各个代码块中进行的处理分配给子程序。本节以 `tutorial/alps_ising.f90` 为例，说明移植后的代码。

#### 变量声明

在 `ising_original.f` 中声明的各变量，在移植时被整合到 ALPS 模块中。由于移植到 ALPS 时需要为每个处理单元设置子程序，因此需修改为可从各子程序访问这些变量。

- 移植前

        4:    DIMENSION IS(20,20),IP(20),IM(20),P(-4:4),A(4)
        5:    C PARAMETERS
        6:          DATA TEMP/2.5/, L/10/, MCS/1000/, INT/1000/
        7:          DATA IX/1234567/, V0/.465661288D-9/


- 移植后

        1:    module ising_mod
        2:      implicit none
        3:      real, parameter :: V0 = .465661288D-9
        4:
        5:      integer, allocatable, dimension(:) :: IP, IM
        6:      integer, allocatable, dimension(:,:) :: IS
        7:      real*8, allocatable, dimension(:) :: P
        8:      integer :: K, MCS, INT, L, IX
        9:      real :: TEMP
        10:    end module ising_mod
        11:

IP、IM、IS、P 数组在 `alps_init` 中初始化，因此移植后不在此处指定其大小。此外，原始数组 A 用于存储结果，但移植后该数组将使用 ALPS 的机制。因此，移植后的代码中不需要数组 A。另外，移植后各变量的值从参数文件获取。此外，K 是移植后用于计数迭代次数的变量。移植后的热化检查负责用 K 的值进行控制和重复，而无需循环。
**本节假定以 MPI 并行运行，因此未考虑线程安全。**

#### 初始化处理

原始代码的初始化处理可能需要初始化数组的每个元素，而在移植后的代码中，初始化处理在子程序 `alps_init` 中进行。首先使用 `alps_get_parameter` 初始化数组变量，然后初始化数组元素。此外，移植后不准备用于存储结果的数组，而是在 `alps_init_observable` 子程序中准备用于保存结果的 Observable。另外，`alps_init` 和 `alps_init_observable` 由 ALPS 自动调用，因此无需在移植后的代码中调用它们。

- 移植前

        8:    C TABLES
        9:          DO 10 I=-4,4
        10:          W=EXP(FLOAT(I)/TEMP)
        11:     10   P(I)=W/(W+1/W)
        12:          DO 11 I=1,L
        13:          IP(I)=I+1
        14:     11   IM(I)=I-1
        15:          IP(L)=1
        16:          IM(1)=L
        17:    C INITIAL CONFIGURATION
        18:          DO 20 I=1,L
        19:          DO 20 J=1,L
        20:     20   IS(I,J)=1
        21:    C ACCUMULATION DATA RESET
        22:          DO 21 I=1,4
        23:     21   A(I)=0.0

- 移植后(`alps_init`)

        13:    subroutine alps_init(caller)
        14:      use ising_mod
        15:      implicit none
        16:      include "alps/fortran/alps_fortran.h"
        17:      integer :: caller(2)
        18:      integer :: i, j
        19:      real*8 :: W
        20:
        21:      call alps_get_parameter(TEMP, "TEMPERATURE", ALPS_REAL, caller)
        22:      call alps_get_parameter(L, "L", ALPS_INT, caller)
        23:      call alps_get_parameter(MCS, "MCS", ALPS_INT, caller)
        24:      call alps_get_parameter(INT, "INT", ALPS_INT, caller)
        25:
        26:      allocate( IP(L) )
        27:      allocate( IM(L) )
        28:      allocate( P(-4:4) )
        29:      allocate( IS(L, L) )
        30:
        31:      K = 0
        32:      IX = 1234567
        33:
        34:      do i = -4, 4
        35:         W = exp(float(i)/TEMP)
        36:         P(i) = W / (W + 1/W)
        37:      end do
        38:
        39:      do i = 1, L
        40:         IP(i) = i + 1
        41:         IM(i) = i - 1
        42:      end do
        43:
        44:      do i = 1, L
        45:         do j = 1, L
        46:            IS(i, j) = 1
        47:         end do
        48:      end do
        49:
        50:      IP(L) = 1
        51:      IM(1) = L
        52:
        53:      return
        54:    end subroutine alps_init

上述代码在第 21 至 24 行调用 `alps_get_parameter`，通过 ALPS 获取参数文件的内容。此外，第 34 至 51 行的处理与原始代码相同。

- 移植后(`alps_init_observables`)

        92:    subroutine alps_init_observables(caller)
        93:      implicit none
        94:      include "alps/fortran/alps_fortran.h"
        95:      integer :: caller(2)
        96:
        97:      call alps_init_observable(1, ALPS_REAL, "Energy", caller)
        98:      call alps_init_observable(1, ALPS_REAL, "Magnetization", caller)
        99:
        100:      return
        101:    end subroutine alps_init_observables
    
移植后，将准备名为 "Magnetization" 和 "Energy" 的 Observable 作为存储计算结果的缓冲区。在原始代码中，分别对 Magnetization 和 Energy 计算总和与平方和，但移植后这些计算由 Observable 自动完成。

#### 计算与结果保存

在原始代码中存在 do 循环迭代（原始代码第 25 行），而移植后不使用 do 循环，改用 `alps_progress` 子程序和 `alps_run`。

- 移植前

        24:    C SIMULATION
        25:          DO 30 K=1,MCS+INT
        26:          KIJ=0
        27:          DO 31 I=1,L
        28:          DO 31 J=1,L
        29:          M=IS(IP(I),J)+IS(I,IP(J))+IS(IM(I),J)+IS(I,IM(J))
        30:          KIJ=KIJ+1
        31:          IS(I,J)=-1
        32:          IX=IAND(IX*5*11,2147483647)
        33:          IF(P(M).GT.V0*IX) IS(I,J)=1
        34:     31   CONTINUE
        35:    C DATA
        36:          IF(K.LE.INT) GOTO 30
        37:          EN=0
        38:          MG=0
        39:          DO 40 I=1,L
        40:          DO 40 J=1,L
        41:          EN=EN+IS(I,J)*(IS(IP(I),J)+IS(I,IP(J)))
        42:     40   MG=MG+IS(I,J)
        43:          A(1)=A(1)+EN
        44:          A(2)=A(2)+EN**2
        45:          A(3)=A(3)+MG
        46:          A(4)=A(4)+MG**2
        47:     30   CONTINUE

- 移植后(`alps_run`)

        56:    ! subroutine alps_run
        57:    subroutine alps_run(caller)
        58:      use ising_mod
        59:      implicit none
        60:      include "alps/fortran/alps_fortran.h"
        61:      integer :: caller(2)
        62:      integer :: i, j, M
        63:      real*8 :: EN, MG
        64:
        65:      do i = 1, L
        66:         do j = 1, L
        67:            M = IS(IP(i), j) + IS(i, IP(j)) + IS(IM(i), j) + IS(i, IM(j))
        68:            IS(i, j) = -1
        69:
        70:            IX = IAND(IX * 5 * 11, 2147483647)
        71:            if(P(M).gt.V0*IX) IS(i, j) = 1
        72:         end do
        73:      end do
        74:
        75:      EN = 0.0D0
        76:      MG = 0.0D0
        77:      do i = 1, L
        78:         do j = 1, L
        79:            EN = EN + IS(i, j) * (IS(IP(i), j) + IS(i, IP(j)))
        80:            MG = MG + IS(i, j)
        81:         end do
        82:      end do
        83:
        84:      call alps_accumulate_observable(EN, 1, &
                ALPS_DOUBLE_PRECISION, "Energy", caller)
        85:      call alps_accumulate_observable(MG, 1, &
                                                                                                                                                                                                                                                                                                                                            ALPS_DOUBLE_PRECISION, "Magnetization", caller)
        86:      K = K + 1
        87:
        88:      return
        89:    end subroutine alps_run

计算处理本身（第 65 至 82 行）与原始代码相同。移植后 alps_run 会被自动反复调用，因此不编写原始代码第 25 行的循环。取而代之，在第 86 行对迭代次数进行计数。此外，使用 ALPS 的功能（第 84 行和第 85 行）保存计算结果。在原始代码（原始代码第 43 至 46 行）中进行了诸如累加和平方等计算，但这些在移植后由 `alps_accumulate_observable` 自动完成。

- 移植后(alps_progress)

        103:    ! alps_progerss
        104:    subroutine alps_progress(prgrs, caller)
        105:      use ising_mod
        106:      implicit none
        107:      include "alps/fortran/alps_fortran.h"
        108:      integer :: caller(2)
        109:      real*8 :: prgrs
        110:
        111:      prgrs = K / (INT + MCS)
        112:
        113:    end subroutine alps_progress
    
移植后，由 alps_progress 进行迭代计算的控制。当 prgrs 的值大于等于 1 时，`alps_run` 将不再被调用。因此，通过监视表示运行次数的计数器 (K) 的值来实现，使 prgrs 的值大于等于 1。

#### 热化检查

在原始代码中，热化检查在主循环内（第 36 行）执行。但移植后，改在子程序 `alps_is_thermalized` 中执行。

- 移植前

        36:          IF(K.LE.INT) GOTO 30

- 移植后(`alps_is_thermalized`)：

        115:    ! alps_is_thermalized
        116:    subroutine alps_is_thermalized(thrmlz, caller)
        117:      use ising_mod
        118:      implicit none
        119:      include "alps/fortran/alps_fortran.h"
        120:      integer :: caller(2)
        121:      integer :: thrmlz
        122:
        123:      if(K >= INT) then
        124:         thrmlz = 1
        125:      else
        126:         thrmlz = 0
        127:      end if
        128:
        129:      return
        130:    end subroutine alps_is_thermalized
    
与 `alps_progress` 类似，根据计数器 (K) 的值判断热化。当认为热化已完成时，thrmlz 的值变为 1。

#### 结果输出

使用 ALPS 时，结果的后处理和输出会自动完成。因此，不需要用于输出计算结果和后处理的代码。

- 移植前

        48:    C STATISTICS
        49:          DO 50 I=1,4
        50:     50   A(I)=A(I)/MCS
        51:          C=(A(2)-A(1)**2)/L**2/TEMP**2
        52:          X=(A(4)-A(3)**2)/L**2/TEMP
        53:          ENG=A(1)/L**2
        54:          AMG=A(3)/L**2
        55:          WRITE(6,100) TEMP,L,ENG,C,AMG,X
        56:     100  FORMAT(' TEMP=',F10.5,' SIZE=',I5,
        57:         * /' ENG =',F10.5,' C   =',F10.5,
        58:         * /' MAG =',F10.5,' X   =',F10.5)

- 移植后：无相应代码

#### 结束处理

在原始代码中，未对 allocate 进行结束处理。但移植后，必须 deallocate 在 `alps_init` 中 allocate 的数组。

- 移植前：无相应代码

- 移植后(`alps_finalize`)

        160:    ! alps_finalize
        161:    subroutine alps_finalize(caller)
        162:      use ising_mod
        163:      implicit none
        164:      include "alps/fortran/alps_fortran.h"
        165:      integer :: caller(2)
        166:
        167:      deallocate(IP)
        168:      deallocate(IM)
        169:      deallocate(P)
        170:      deallocate(IS)
        171:
        172:      return
        173:    end subroutine alps_finalize

#### 重启功能

只需实现 (`alps_save` / `alps_load`)，即可利用使用 ALPS 时的重启文件输入/输出功能，为程序添加重启功能。原始代码不具备重启功能，以下说明按照 ALPS 实现重启文件输入/输出功能的示例。

- 移植前：无相应代码
- 移植后(`alps_save`)

        132:    ! alps_save
        133:    subroutine alps_save(caller)
        134:      use ising_mod
        135:      implicit none
        136:      include "alps/fortran/alps_fortran.h"
        137:      integer caller(2)
        138:
        139:      call alps_dump(K, 1, ALPS_INT, caller)
        140:      call alps_dump(IX, 1, ALPS_INT, caller)
        141:      call alps_dump(IS, L * L, ALPS_INT, caller)
        142:
        143:      return
        144:    end subroutine alps_save

`alps_save` 仅将重启所需的变量用 `alps_dump` 写出。这里展示如何写出计数器 (K) 和计算数据 (IX, IS)。

- 移植后(`alps_load`)

        146:    ! alps_load
        147:    subroutine alps_load(caller)
        148:      use ising_mod
        149:      implicit none
        150:      include "alps/fortran/alps_fortran.h"
        151:      integer :: caller(2)
        152:
        153:      call alps_restore(K, 1, ALPS_INT, caller)
        154:      call alps_restore(IX, 1, ALPS_INT, caller)
        155:      call alps_restore(IS, L * L, ALPS_INT, caller)
        156:
        157:      return
        158:    end subroutine alps_load

在 `alps_load` 中，必须按照 `alps_save` 用 (`alps_dump`) 写出的顺序使用 (`alps_restore`) 进行加载。另外，重启 ALPS 程序时，会在调用 `alps_load` 之前调用 `alps_init`。也就是说，K、IX、IS 等变量的内存分配和初始化在 `alps_init` 中完成，因此无需在 `alps_load` 内进行初始化等操作。

#### 关于多线程支持

如果希望以多线程运行 ALPS 程序，必须以线程安全的方式实现 Fortran 代码。对于本节所述的 `tutorial.f90`，可以通过在 2.4.2 中准备的线程局部变量来支持多线程。

- 移植后(多线程)

        1:    module ising_mod
        2:      implicit none
        3:      real, parameter :: V0 = .465661288D-9
        4:
        5:      integer, allocatable, dimension(:) :: IP, IM
        6:      integer, allocatable, dimension(:,:) :: IS
        7:      real*8, allocatable, dimension(:) :: P
        8:      integer :: K, MCS, INT, L, IX
        9:      real :: TEMP
        10:    !$omp threadprivate (K, MCS, INT, TEMP, IP, IM, P, IS, IX, L)
        11:    end module ising_mod
        12:

### 关于 main.C　

`main.C` 文件是成为程序入口点所必需的。但无需更改 main 函数的内容。`main.C` 的配置请根据需要进行更改。请参见 2.2.2。

### 关于 `CMakeLists.txt`

更改 `CMakeLists.txt`（参见正文 2.3）。以下是 `CMakeLists.txt` 的示例。

    1:    cmake_minimum_required(VERSION 2.8.0 FATAL_ERROR)
    2:    
    3:    project(tutorial)
    4:    
    5:    find_package(ALPS REQUIRED NO_SYSTEM_ENVIRONMENT_PATH)
    6:    message(STATUS "ALPS version: ${ALPS_VERSION}")
    7:    include(${ALPS_USE_FILE})
    8:    
    9:    # Source code required to create and run file name
    10:    add_executable(tutorial main.C tutorial.f90)
    11:    target_link_libraries(tutorial ${ALPS_LIBRARIES} ${ALPS_FORTRAN_LIBRARIES})
