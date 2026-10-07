
---
title: 实现 
math: true
weight: 3
---

## 简介

`fulldiag` 程序包使用 LAPACK 库对哈密顿量进行完全对角化。因此，它可用于计算任何能用 ALPS 库定义的模型的热力学性质。其主要限制在于体系尺寸：在其他更专门的程序仍能良好工作的尺寸下，它所需的内存和 CPU 时间可能已经变得无法接受。

1.3 版允许对具有 $-hS_z$ 或 $-\mu N$ 形式守恒量耦合的模型计算磁性或电荷性质，即 SITETERM 为 $-h S_z(i)$ 或 $-\mu n(i)$。事实上，只需修改源文件 fulldiag.h 中的几行，就可以相对直接地适配到其他与守恒量耦合的情形（只是目前尚不支持，因为这需要用户至少修改 5 个字符串）。如果不存在守恒量，则会少计算两个量（见下文）。

**警告：** 如果所假定的守恒量实际上并不与哈密顿量对易，可能会得到错误的结果。如果系数不是上述形式，并且通过 `fulldiag_evaluate` 改变了磁场 $h$ 或化学势 $\mu$，一般也会得到错误的结果。


## 运行计算

运行方法在 `fulldiag` 教程中讨论。使用 `fulldiag` 程序得到完整谱之后，可以用评估程序 `fulldiag_evaluate` 高效地生成下文所列热力学性质和磁性质的 XML 绘图文件。

### 输入参数

`fulldiag` 程序的参数均在通用输入参数中有描述（特别注意精确对角化的附加参数）。
以下参数仅由 `fulldiag_evaluate` 使用：

| **参数** | **默认值** | **含义** |
| :------------ | :---------- | :---------- |
| T_MIN |  | 计算观测量的最低温度 |
| T_MAX |  | 计算观测量的最高温度 |
| DELTA_T | | 温度步长 |
| couple | | couple mu 将耦合从默认的 $-h S_z$ 改为 $-\ mu N$。它还会改变其他一些参数和量的含义（见下文）。 |
| H_MIN (MU_MIN) | | 计算观测量的最低磁场（若指定 --couple mu，则为化学势） |
| H_MAX (MU_MAX) | | 计算观测量的最高磁场（若指定 --couple mu，则为化学势） |
| DELTA_H (DELTA_MU) | | 磁场步长（若指定 --couple mu，则为化学势步长） |
| versus | | versus h（若指定 --couple mu，则为 versus mu）将磁场（化学势）而不是温度作为 $x$ 轴 |
| MEASURE_MAGNETIC_PROPERTIES (MEASURE_CHARGE_PROPERTIES) | 1 | 打开 (1) 或关闭 (0) 磁性（或电荷）性质的计算（见下文）。注意，在当前版本的 `fulldiag` 中，只有总 $S_z$ 或 $N$ 守恒的模型才能进行此类测量。还必须在 `fulldiag` 的参数中指定相应的 CONSERVED_QUANTUMNUMBERS=...。 |
| DENSITIES | 1 | 指定按每个格点归一化 (1) 还是针对整个体系 (0) 输出各个量 |

所有这些参数都可以被同名的命令行参数覆盖。

## 热力学性质的计算

`fulldiag_evaluate` 程序读取 `fulldiag` 的 XML 输出文件，

    fulldiag_evaluate [--T_MIN ...] [--T_MAX ...] [--DELTA_T ...]
        [--H_MIN ...] [--H_MAX ... ] [--DELTA_H ... ] [--versus h]
        [--DENSITIES ...] inputfile [outputfileprefix]</tt>

或者

    fulldiag_evaluate --couple mu [--T_MIN ...] [--T_MAX ...] [--DELTA_T ...]
        [--MU_MIN ...] [--MU_MAX ... ] [--DELTA_MU ...] [--versus mu]
        [--DENSITIES ...] inputfile [outputfileprefix]</tt>

可以指定两个可选范围：温度范围（T_MIN, T_MAX, DELTA_T），以及磁场范围（H_MIN, H_MAX, DELTA_H）或化学势范围（MU_MIN, MU_MAX, DELTA_MU）。`fulldiag_evaluate` 会为以下各量生成随温度变化的 XML 绘图文件（`outputfileprefix.plot.energy.xml` 等，若未指定 outputfileprefix，则由 inputfile 的文件名导出）：

- 能量 [密度]
- 自由能 [密度]
- 熵 [密度]
- 比热 [密度]
- 磁化强度 [密度]（若 MEASURE_MAGNETIC_PROPERTIES=1，且未使用 couple mu）
- 均匀磁化率 [密度]（若 MEASURE_MAGNETIC_PROPERTIES=1，且未使用 couple mu）
- 粒子数 [密度]（若 MEASURE_CHARGE_PROPERTIES=1，且使用 couple mu）
- 压缩率 [密度]（若 MEASURE_CHARGE_PROPERTIES=1，且使用 couple mu）

注意，若参数 DENSITIES=1，各个量以密度形式输出，即按格点数归一化；若 DENSITIES=0，则输出整个体系的值。默认情况下，绘图以温度为 $x$ 轴。使用参数 --versus h（--versus mu）可以得到以磁场（化学势）为 $x$ 轴的图

`fulldiag` 会存储本征值以及可获得的物理量的结果（针对整个体系测量）等信息。这些信息主要供专业人士使用，我们希望在需要时它们是不言自明的。

## 贡献者

以下人员对 `fulldiag` 程序做出了贡献：

- Matthias Troyer
- Andreas Honecker 

