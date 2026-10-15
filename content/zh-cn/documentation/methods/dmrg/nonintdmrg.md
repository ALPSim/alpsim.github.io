
---
title: 盒中粒子 
math: true
weight: 10
---

## ALPS 程序：无相互作用 DMRG

无相互作用 DMRG 程序包是 ALPS 项目中的程序之一。它基于 [^Preschel] 中给出的示例程序，为无相互作用量子体系提供了一个简化 DMRG 程序的通用实现。
该程序支持在任意晶格上模拟紧束缚体系和扩展紧束缚体系（例如含次近邻跃迁、外加局域势等）。它计算体系的基态能量和基态波函数。注意，该程序无法处理相互作用项。
该程序并不是真正用于严肃计算的工具——它的主要目的是通过一个简单的无相互作用问题来说明 DMRG 方法的工作原理。为此，源代码中的注释应该会有所帮助。


## 运行模拟

要运行模拟，需要创建一个参数文件，例如

    LATTICE_LIBRARY = "lattices.xml"
    LATTICE = "chain lattice"
    L = 20
    SWEEPS = 100
    OUTPUT_LEVEL = 1
    WAVEFUNCTION_FILE = "psi.dat"
    t = 1.2
    V = 0

这些参数描述的是一个单粒子紧束缚模型的计算，使用 `lattices.xml` 文件中定义的 "chain lattice"。"chain lattice" 定义了一个一维周期性晶格，其长度由参数 L 给出（本例中指定为 L=20）。跃迁参数 t 作用在晶格的键上，因此晶格实际上决定了边界条件（对于 "chain lattice" 是周期性的）。与 DMRG 的一般情况一样，开放边界条件比周期性边界效率更高，收敛所需的扫描次数也少得多。该模拟将执行 100 次完整的 DMRG 扫描。变量 OUTPUT_LEVEL 指定扫描过程中输出的调试信息量，数值越大信息越多。要开始计算，请确保晶格库 `lattices.xml` 位于当前目录中，然后直接执行 `simple_dmrg <  parameters`。所得波函数会写到标准输出，同时写入由 `WAVEFUNCTION_FILE` 指定的输出文件。

## 输入参数

模拟由以下可在参数文件中指定的输入参数控制：

| **名称** | **默认值** | **说明** |
| :------- | :---------- | :-------------- |
| LATTICE_LIBRARY | lattices.xml | 包含晶格描述的文件路径 |
| LATTICE | | 晶格名称 |
| t | 1 | 最近邻跃迁项的强度 |
| t# | 0 | 类型为 # 的键上的跃迁参数（#=0,1,...） |
| V | 0 | 施加在所有格点上的局域势 |
| V# | 0 | 类型为 # 的格点上的局域势（#=1,2,...） |
| SWEEPS | | 有限体系扫描的次数 |
| OUTPUT_LEVEL | 1 | 扫描过程中的输出信息量 |
| WAVEFUNCTION_FILE | | 输出文件 |
| PRECISION | 10 | 输出流的精度 |

### 体系性质：边界条件与尺寸

边界条件和尺寸（一维或更高维）在晶格库中描述。

### 次近邻跃迁项

在指定晶格时使用不同的元胞，就可以指定到最近邻以外格点的跃迁项。不同的跃迁项应对应于不同的键类型，其跃迁参数由参数文件中的 t# 控制。t0 默认为 t，所有其他 t# 默认为 0。

### 局域势

参数 V 指定一个用作外势的函数。均匀的附加势只需用一个表示其强度的数字来指定，但更有趣的情形是空间变化的势，此时 V 是格点坐标的函数。例如，下面的参数文件模拟一维谐振子势中的粒子：

    LATTICE_LIBRARY = "lattices.xml"
    LATTICE = "chain lattice"
    L = 200
    SWEEPS = 20
    V = 4 * (x/L - 0.5) * (x/L - 0.5)

周期势可以用其傅里叶级数展开来指定。例如，宽度为 N/L 的三角势可以近似地指定为

    K = 2*3.1415927*N/L
    V = cos(K*x) + cos(3*K*x) / 9 + cos(5*K*x) / 25 + cos(7*K*x) / 36

注意，V 指定的是施加在晶格每个格点上的外势。也可以只对某些类型的格点施加势，方法是指定函数 V#（其中 # 是晶格描述中指定的格点类型）。如果定义了 V# 势，它会在相应格点上叠加到全局势 V 上。
同样，对于周期体系或复杂的势，收敛可能相当慢；对于三角势，在 40 个格点、N=4 时，100 次扫描足以得到良好的收敛，但可以将其与 100 个格点、N=10 的情形进行比较。这在一定程度上是由于在第一次正式 DMRG 扫描之前构造波函数的方式过于简单。

### 输出

输出由参数 OUTPUT_LEVEL、WAVEFUNCTION_FILE 和 PRECISION 控制。
参数 OUTPUT_LEVEL 的取值范围为 0 到 4。取值越高，有限体系扫描过程中输出的信息越多。默认值为 1，即在每次扫描结束时显示能量。级别 4 会产生大量输出，仅在调试或非常细致地跟踪计算细节时有用。
输出文件由 WAVEFUNCTION_FILE 指定，参数 PRECISION 设定打印结果的精度。WAVEFUNCTION_FILE 的格式使其可以直接用 xmgrace 绘图，例如 "xmgrace psi.dat"。

## 测量

在这个简单的 dmrg 程序中，只计算基态能量和基态波函数。其他观测量可以在之后基于输出的波函数计算。

## 贡献者

以下人员对无相互作用 dmrg 程序做出了贡献：

- Salvatore Manmana
- Ian McCulloch
- Matthias Troyer
- Reinhard Noack


[^Preschel]: I. Peschel, X. Wang, M. Kaulke, and K. Hallberg, Chapter 3 of "Density Matrix Renormalization - A New Numerical Method in Physics" (Springer, Berlin, 1999).
