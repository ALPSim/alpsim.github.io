
---
title: ALPS 自定义测量
toc: true
weight: 6
---

## 定义自定义测量

如果你所用的 ALPS 应用程序自带的默认测量无法满足需求，可以直接在参数文件中定义自定义测量。其一般语法如下：

    MEASURE_LOCAL[Name]=Op
    MEASURE_AVERAGE[Name]=Op

这里 `Name` 是该测量在 XML 输出中出现时使用的名称，`Op` 是一个格点算符或键算符，它必须已经在模型中定义 —— 既可以是模型库中内置的算符，也可以是你自己定义的算符（参见[量子算符](../modeldef/operators)）。`MEASURE_AVERAGE` 测量 `Op` 的量子力学期望值，对于有限温度模拟还包括热力学期望值。`MEASURE_LOCAL` 测量 `Op` 在格子每个格点上的期望值；因此 `Op` 必须是局域的，即只能含有格点项，不能含有键项。

    MEASURE_CORRELATIONS[Name]="Op1:Op2"
    MEASURE_CORRELATIONS[Name]=Op

`MEASURE_CORRELATIONS` 测量算符 `Op1` 和 `Op2` 在格子上所有不等价格点对之间的关联。上面第二种写法 `MEASURE_CORRELATIONS[Name]=Op` 等价于 `MEASURE_CORRELATIONS[Name]="Op:Op"`。目前只能计算两点关联函数，因此 `Op1` 和 `Op2` 都必须是格点算符。

    MEASURE_STRUCTURE_FACTOR[Name]=Op

这将测量算符 `Op` 的结构因子，即相应关联函数在模拟格子的动量本征态上求值得到的格子傅里叶变换。

## 哪些 ALPS 应用程序支持这一机制

上述 `MEASURE_LOCAL`/`MEASURE_AVERAGE`/`MEASURE_CORRELATIONS`/`MEASURE_STRUCTURE_FACTOR` 语法并不是由模型或格子的 XML 解析机制本身负责解释的 —— 它是一项可选功能，需要每个模拟程序单独接入；实际上只有部分 ALPS 应用程序支持它：

| 应用程序 | 支持情况 |
| :---------- | :------ |
| `loop`（loop / 有向环算法） | 完全支持 |
| `worm`（[Worm 算法](../../methods/qmc/worm)） | 完全支持 |
| `sse`、`sse2`、`sse4`（[随机级数展开](../../methods/qmc/sse)） | 完全支持 |
| `dwa`（有向蠕虫算法） | 完全支持 |
| `fulldiag`（完全对角化） | 完全支持 |
| `dmrg`（[传统的单块 DMRG](../../methods/dmrg/dmrg)） | 完全支持 |
| `sparsediag`（[稀疏 / Lanczos 对角化](../../methods/ed/sparsediag)） | 不支持 —— 只能得到模型本身内置的可观测量（能量、量子数） |
| `qwl`（量子 Wang-Landau） | 不支持 —— 它有自己专门的 `MEASURE_MAGNETIC_PROPERTIES` 开关 |
| `checksign` | 不支持 |
| `mps_optim`/`mps_meas`（矩阵乘积态 DMRG） | 有自己独立实现的、更丰富的语法 —— 见下文 |

对于上表中标注为“完全支持”的程序（`loop`、`worm`、`sse`/`sse2`/`sse4`、`dwa`、`fulldiag`、`dmrg`），如果自定义的 `Name` 与程序内置的可观测量名称（例如 `Local Density`、`Spin Correlations`）冲突，该自定义测量会被静默跳过，而使用内置的那个，同时会在标准错误输出中给出提示 —— 因此请为自定义测量取一个不会重名的名字。

矩阵乘积态 DMRG 程序（`mps_optim`/`mps_meas`）完全没有使用本页描述的这套机制；它有自己独立实现的版本，同样接受含义相同的 `MEASURE_LOCAL`、`MEASURE_AVERAGE` 和 `MEASURE_CORRELATIONS`，此外还有若干 ALPS 中其他程序都没有的扩展：`MEASURE_HALF_CORRELATIONS`（与 `MEASURE_CORRELATIONS` 类似，但不交换算符的顺序）、`MEASURE_LOCAL_AT`（将一串算符作用在一组显式指定的任意格点上），以及若干布尔开关，如 `MEASURE[EnergyVariance]`、`MEASURE[Entropy]` 和 `MEASURE[Renyi2]`。

由于不同程序的支持情况差异很大，在使用这些语句之前，请务必查阅你所使用的具体应用程序的参数参考或教程。

## 更多技巧与变通方法

在 QMC 程序中测量非对角量通常并不容易，也很难以通用的方式实现。如果你常用的 QMC 程序无法完成你想要的测量，你可能需要修改源代码。

不过在某些情况下，可以使用一些技巧。一个常用的技巧是扩大模型的格点基。举例来说：使用 worm 程序在非均匀格子上模拟 Bose-Hubbard 模型，我们希望测量局域粒子数分布的二阶矩 $\langle n_i^2\rangle$。由于 worm 程序并不直接在格点基下工作，它无法直接对这样的算符进行测量。一种可行的解决办法是修改 Bose-Hubbard 哈密顿量所使用的 `boson` 格点基，为其添加一个表示密度平方的算符 `n2`：

    <SITEBASIS name="boson">
    <PARAMETER name="Nmax" default="infinity"/>
    <QUANTUMNUMBER name="N" min="0" max="Nmax"/>
    <OPERATOR name="bdag" matrixelement="sqrt(N+1)">
        <CHANGE quantumnumber="N" change="1"/>
    </OPERATOR>
    <OPERATOR name="b" matrixelement="sqrt(N)">
        <CHANGE quantumnumber="N" change="-1"/>
    </OPERATOR>
    <OPERATOR name="n" matrixelement="N"/>
    <OPERATOR name="n2" matrixelement="N*N"/>   <!-- added -->
    </SITEBASIS>

有了这个补丁之后，就可以按通常方式定义相应的测量，例如：

    MEASURE_LOCAL[Local density squared]="n2"
    MEASURE_CORRELATIONS[Density squared, correlations]="n2:n2"

---

关于上文中使用的算符的定义方式，参见[量子算符](../modeldef/operators)。关于模型定义的总体介绍，参见 [ALPS 模型定义](../modeldef)。关于 ALPS 文档的其他章节，参见[总体介绍](..)。
