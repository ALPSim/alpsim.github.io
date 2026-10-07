---
title: 量子 Wang-Landau 算法 
math: true
weight: 7
---

## 简介

`qwl` 程序提供了基于随机级数展开（SSE）量子蒙特卡洛方案的量子 Wang-Landau（QWL）方法的多团簇实现。QWL 方法由 ALPS 合作组成员 M. Troyer、S. Wessel 和 F. Alet 提出，是经典 Wang-Landau 算法在量子情形下的推广。其底层的 SSE 方法由 A. Sandvik 及其合作者发明。利用 QWL 方法，可以基于配分函数的高温级数展开，从扩展系综中的单次模拟中提取能量或熵等热力学量，展开系数在模拟过程中被计算到很高的阶数。

QWL 方法的当前实现基于对原始方案的一种扩展，即 C. Zhou 和 R. N. Bhatt 在经典情形下提出的方案。该算法首先执行若干步 Wang-Landau 精化步骤，使用 Zhou-Bhatt 判据代替直方图平坦度判据。得到最终的系综权重后，再在所得系综中进行额外的模拟，其中包括对观测量的测量。

**注意：** 该第一版仅支持在零磁场下、任意无阻挫晶格上模拟各向同性的自旋 1/2 海森堡铁磁和反铁磁模型。今后我们计划放宽这一限制，并提供 QWL 微扰展开的实现。

## 运行模拟

详见教程。使用 `qwl` 程序运行模拟后，脚本 `qwl_evaluate` 程序会生成热力学性质以及（在测量了的情况下）磁性性质的 XML 绘图文件，具体如下。

## 输入参数

除了此处讨论的通用输入参数之外，`qwl` 应用程序还接受以下输入参数：

| **名称** | **默认值** | **描述** |
| :------- | :---------- | :-------------- |
| CUTOFF | 500 | 模拟过程中保留的最大展开阶数 |
| T_MIN | 0.1 | `qwl_evaluate` 计算观测量的最低温度（会被其命令行选项 \[-T_MIN ...\] 覆盖） |
| T_MAX | 10 | `qwl_evaluate` 计算观测量的最高温度（会被其命令行选项 \[-T_MAX ...\] 覆盖） |
| DELTA_T | 0.1 | `qwl_evaluate` 使用的温度步长（会被其命令行选项 \[-DELTA_T ...\] 覆盖） |
| MEASURE_MAGNETIC_PROPERTIES | 1 | 开启（1）或关闭（0）对均匀磁性性质以及（若 LATTICE 为二分晶格）交错磁性性质（见下文）的测量 |

### 专家参数

此外，还可以为算法指定以下参数，特别是用于采用原始 QWL 精化方案进行模拟。

| **名称** | **默认值** | **描述** |
| :------- | :---------- | :-------------- |
| NUMBER_OF_WANG_LANDAU_STEPS | 16 | Wang-Landau 精化步骤的数目 |
| SWEEPS | 在 Wang-Landau 精化过程中确定 | 最终固定权重模拟中的蒙特卡洛步数 |
| USE_ZHOU_BHATT_METHOD | 1 | 开启（1）或关闭（0）Zhou-Bhatt 方法（若关闭（0），则 FLATNESS_TRESHOLD 和 BLOCK_SWEEPS 生效） |
| FLATNESS_TRESHOLD | 若 USE_ZHOU_BHATT_METHOD=1 则不适用；若 USE_ZHOU_BHATT_METHOD=0 则为 0.2 | 在减小增长因子之前，直方图最大值/最小值相对于平均值所需达到的最大偏差（仅当 USE_ZHOU_BHATT_METHOD=0 时适用） |
| BLOCK_SWEEPS | 若 USE_ZHOU_BHATT_METHOD=1 则不适用；若 USE_ZHOU_BHATT_METHOD=0 则为 10000 | 在一个 Wang-Landau 步骤内检查平坦度之前的扫描次数（仅当 USE_ZHOU_BHATT_METHOD=0 时适用） |
| INITIAL_MODIFICATION_FACTOR | 若 USE_ZHOU_BHATT_METHOD=1 则为 e；若 USE_ZHOU_BHATT_METHOD=0 则由其他参数确定 | 第一个 Wang-Landau 精化步骤中展开系数增长因子的初始值（在后续步骤中，通过取平方根来减小该因子） |
| EXPANSION_ORDER_MINIMUM | 0 | 所确定系数的最小展开阶数 |
| EXPANSION_ORDER_MAXIMUM | CUTOFF | 所确定系数的最大展开阶数，不得超过 CUTOFF |
| START_STORING | NUMBER_OF_WANG_LANDAU_STEPS | 开始存储展开系数时所处的 Wang-Landau 步骤数 |

## 测量 

`qwl_evaluate` 程序读取一次 qwl 模拟的 XML 输出文件，

    qwl_evaluate [-T_MIN ...] [-T_MAX ...] [-DELTA_T ...] prefix.out.xml

并为以下物理量随温度的变化生成 XML 绘图文件（`prefix.plot.energy.xml` 等）：

| **名称** | **描述** |
| :------- | :-------------- |
| Energy Density | 每格点能量 |
| Free Energy Density | 每格点自由能 |
| Entropy Density | 每格点熵 |
| Specific Heat per Site | 每格点比热 |
| Uniform Structure Factor per Site | 纵向均匀结构因子（若 MEASURE_MAGNETIC_PROPERTIES=1） |
| Uniform Susceptibility per Site | 均匀磁化率（若 MEASURE_MAGNETIC_PROPERTIES=1） |
| Staggered Structure Factor per Site | 纵向交错结构因子（若 MEASURE_MAGNETIC_PROPERTIES=1，且仅适用于二分晶格） |

以下物理量由 `qwl` 应用程序直接测量，主要从算法角度来看具有意义。

| **名称** | **描述** |
| :------- | :-------------- |
| Coefficients | 配分函数高温级数展开 $Z= \sum_n g(n)\beta_n$ 中系数 $g(n)$ 的对数 $\ln[g(n)]$ 的估计值，在 SWEEPS 次固定权重扫描之后得到，并考虑了最终直方图（这通常是最佳估计）|
| Coefficients # | 第 # 个 Wang-Landau 精化步骤之后 $\ln[g(n)]$ 的估计值（# ≥ START_STORING） |
| Histogram | 固定权重扫描期间所访问展开阶数的归一化直方图 |
| Fraction | 固定权重扫描期间，所访问展开阶数上向上行走者所占的比例 |
| Time Up | 固定权重扫描期间，从最低展开系数隧穿到最高展开系数所需的时间 |
| Time Down | 固定权重扫描期间，从最高展开系数隧穿到最低展开系数所需的时间 |
| Time Total | 固定权重扫描期间，从最低展开系数隧穿到最高展开系数再返回最低展开系数所需的时间 |
| Total Sweeps | 整个模拟（包括 Wang-Landau 精化）所用的扫描次数 |
| Total Sweeps # | 第 # 个 Wang-Landau 精化步骤所用的扫描次数（# ≥ START_STORING） |
| Uniform Structure Factor Coefficients | 均匀结构因子的展开系数（若 MEASURE_MAGNETIC_PROPERTIES=1） |
| Staggered Structure Factor Coefficients | 交错结构因子的展开系数（若 MEASURE_MAGNETIC_PROPERTIES=1，且仅适用于二分晶格） |

根据 qwl 应用程序的具体版本，还可能提供其他物理量。

## 参考文献

- M. Troyer, S. Wessel and F. Alet, Phys. Rev. Lett. 90, 120201 (2003)
- S. Wessel, N. Stoop, E. Gull, S. Trebst, and M. Troyer, J. Stat. Mech. P12005 (2007)
- S. Trebst, D. A. Huse, and M. Troyer, Phys. Rev. E 70, 046701 (2004)
- C. Zhou and R.N. Bhatt, Phys. Rev. E 72, 025701(R) (2005)
