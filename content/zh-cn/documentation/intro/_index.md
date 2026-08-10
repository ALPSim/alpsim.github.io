---
title: General Introduction
math: true
weight: 3
cascade:            
    type: docs
---

本节涵盖了几乎所有 ALPS 应用共有的运行机制：如何准备、启动和评估一次模拟；如何在输入文件中指定格子、模型以及自定义测量；以及无论所模拟的物理问题为何，各应用之间共有哪些参数。

## [使用 ALPS 运行与评估模拟](runalps)

ALPS 调度库如何通过作业文件和任务文件来组织一次模拟，以及每次运行都会经历的三个阶段——准备输入文件、运行模拟、评估结果。涵盖两种受支持的工作方式：使用命令行和使用 Python，二者产生完全相同的输出，可以自由混用。此外还介绍了如何用不止一种随机数生成器来验证结果。

## [格子的定义](latticehowtos)

ALPS 输入文件中如何指定格子与图：从由顶点和边构成的简单图出发，逐步构建具有平移对称性的晶胞与格子，生成给定格子对应的图，建立你自己的格子与图库，并检验生成的图是否符合预期。同时还指向内置的 ALPS 格子库（`lib/xml/lattices.xml`）以及常用格子的参考图示。

## [模型的定义](modeldef)

量子格点模型的希尔伯特空间与哈密顿量，如何用 ALPS 模型库格式（`lib/xml/models.xml`）来描述。说明了如何定义单个格点以及整个格子（包括单元格内含多个格点的情形）的基组，如何构建简单的以及复合的格点算符与键算符，以及如何将它们组合成 `<SITETERM>` 和 `<BONDTERM>` 形式的哈密顿量项，并以自旋模型、硬核玻色子模型和 t-J 模型为例作了具体说明。

## [自定义测量的定义](measuredef)

当某个应用默认提供的测量不够用时，如何直接在参数文件中请求额外的测量：使用 `MEASURE_LOCAL`、`MEASURE_AVERAGE`、`MEASURE_CORRELATIONS` 和 `MEASURE_STRUCTURE_FACTOR`。同时也介绍了一个常见的变通方法，用于测量默认不直接支持的非对角量或高阶矩量：在模型的格点基组中添加额外的算符（例如添加 `n2` 以测量 $\langle n_i^2\rangle$）。

## [常用参数](parameters)

大多数 ALPS 应用共有的输入参数一览：如何指定 `LATTICE` 与 `MODEL`（或自定义的 `GRAPH`），如何通过 `T` 或 `BETA` 设置温度，`SEED`、`RNG`、`SWEEPS`、`THERMALIZATION` 等蒙特卡罗控制参数，以及 `CONSERVED_QUANTUMNUMBERS`、`TRANSLATION_SYMMETRY`、`TOTAL_MOMENTUM` 等精确对角化专属的参数。
