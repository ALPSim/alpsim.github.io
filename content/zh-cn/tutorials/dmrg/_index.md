
---
title: Density Matrix Renormalization Group
description: "Tutorials for ALPS"
toc: true
weight: 3
math: true
---

密度矩阵重正化群（DMRG）通过迭代地将希尔伯特空间截断到最相关的 $D$ 维子空间，来寻找一维量子格点模型基态（以及少数低激发态）的精确近似。这些教程使用 ALPS `dmrg` 应用程序，以自旋-1/2 和自旋-1 反铁磁海森堡链为例进行讲解。这两个模型表面上相似，但其低能物理性质却存在根本差异，因而是检验该方法的理想测试平台。

DMRG 由 Steven White 在两篇奠基性论文中提出：[Density matrix formulation for quantum renormalization groups](https://doi.org/10.1103/PhysRevLett.69.2863)（Phys. Rev. Lett. 69, 2863, 1992）和 [Density-matrix algorithms for quantum renormalization groups](https://doi.org/10.1103/PhysRevB.48.10345)（Phys. Rev. B 48, 10345, 1993），分别阐述了该方法及其有限系统改进算法，即 ALPS 当前所使用的算法。更多背景资料和参考文献请参见 [DMRG 参考页面](../../documentation/methods/dmrg/dmrg)。

## 简介

- [DMRG-01 简介](dmrg01) — 介绍 `dmrg` 可执行程序和 DMRG 算法（无限系统和有限系统扫描、截断误差）及其控制参数。

## 模型物理与基态能量

- [DMRG-02 海森堡自旋链](dmrg02) — 深入介绍两个模型的物理性质：可由 Bethe 拟设精确求解的临界无能隙自旋-1/2 链，以及有能隙的非临界自旋-1（Haldane）链，并给出本系列教程其余部分所使用的基准值。
- [DMRG-03 基态能量](dmrg03) — 进行首批 `dmrg` 计算，计算固定长度下自旋-1/2 和自旋-1 链的基态能量，并外推至热力学极限下的每格点（或每键）能量。

## 激发态与关联函数

- [DMRG-04 能隙](dmrg04) — 计算有限长度下自旋-1/2 链的单重态-三重态能隙和自旋-1 链的 Haldane 能隙，并将两者外推至热力学极限。
- [DMRG-05 局域可观测量](dmrg05) — 利用局域磁化轮廓区分自旋-1 链中的边界激发与体激发，这是 DMRG 偏好开放边界条件所带来的一个微妙之处。
- [DMRG-06 关联函数](dmrg06) — 计算自旋-自旋关联函数，提取自旋-1/2 链的临界幂律指数和自旋-1 链的关联长度。
