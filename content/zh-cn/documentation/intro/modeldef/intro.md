
---
title: 简介
toc: true
weight: 1
---

作为 ALPS 项目的一部分，我们需要用一种与格点模型所在的格子相互独立的通用 XML 格式来描述量子格点模型。让模型定义独立于格子，意味着同一个哈密顿量（例如海森堡模型）可以在任意格子上模拟，而同一个模拟程序也可以运行任意模型，都无需修改任何代码。

本页涵盖以下内容：

- [如何指定单个格点的基](../sitebasis)
- [如何将单格点基组合成整个格子的基](../latticebasis)
- [如何定义构造哈密顿量所用的量子算符](../operators)
- [如何用参数、基以及格点/键项组装出哈密顿量](../hamiltonian)

## 默认模型库文件

模型库文件定义了问题的希尔伯特空间和哈密顿量。默认的模型库位于 `$ALPSPATH/lib/xml/models.xml`，其中包含许多常用模型：

| **模型名称** | **可用参数列表** | **备注** |
| :------------- | :-------------------------------- | :--------- |
| spin（自旋） | J Jz Jxy J0 Jz0 Jxy0 J1 Jz1 Jxy1 h Gamma D K K0 K1 | 各向异性（XXZ）交换耦合，可选带有外场、单离子各向异性和双二次项 |
| boson Hubbard（玻色子 Hubbard） | mu t V U t0 t1 V0 V1 | |
| hardcore boson（硬核玻色子） | 同上 | 格点占据数被限制为 0 或 1 的玻色子 Hubbard 模型，等价于 `U → ∞` 的极限 |
| fermion Hubbard（费米子 Hubbard） | 同上 | 有自旋的费米子；`U` 耦合同一格点上相反自旋的占据数 |
| spinless fermions（无自旋费米子） | mu t V t0 t1 V0 V1 | 没有 `U`，因为两个无自旋费米子不能占据同一格点 |
| Kondo lattice（Kondo 晶格） | mu t J | 巡游电子（`mu`、`t`）与局域自旋通过交换耦合（`J`）相互作用 |
| t-J | mu t J V t0 t1 t2 V0 V1 V2 J0 J1 J2 | Hubbard 模型在大 `U` 极限下的有效低能模型 |

以上参数对应以下物理量：

| **符号** | **含义** |
| :------------ | :---------- |
| `mu` | 化学势 |
| `t`、`t0`、`t1`、`t2` | 跃迁振幅（依赖格点或键的类型） |
| `U` | 同一格点上的相互作用 |
| `V`、`V0`、`V1`、`V2` | 最近邻（键）相互作用 |
| `J`、`J0`、`J1`、`J2` | 各向同性交换耦合，或 t-J 模型中的超交换 |
| `Jz`、`Jz0`、`Jz1` | 各向异性（XXZ）交换耦合中的伊辛（`Sz·Sz`）部分 |
| `Jxy`、`Jxy0`、`Jxy1` | 各向异性交换耦合中的 XY（横向）部分 |
| `h` | 均匀纵向场，与 `Sz` 耦合 |
| `Gamma` | 横向场，与 `Sx` 耦合 |
| `D` | 单离子各向异性，与 `(Sz)^2` 耦合 |
| `K`、`K0`、`K1` | 双二次交换，与 `(Si·Sj)^2` 耦合 |

这些模型最初分别在以下论文中被提出：海森堡交换模型由 [Heisenberg (1928)](https://doi.org/10.1007/BF01328601) 提出，Hubbard 模型由 [Hubbard (1963)](https://doi.org/10.1098/rspa.1963.0204) 提出，玻色子 Hubbard 模型由 [Fisher et al. (1989)](https://doi.org/10.1103/PhysRevB.40.546) 提出，Kondo 晶格模型由 [Doniach (1977)](https://doi.org/10.1016/0378-4363(77)90190-5) 提出，t-J 模型则由 [Anderson (1987)](https://doi.org/10.1126/science.235.4793.1196) 和 [Zhang and Rice (1988)](https://doi.org/10.1103/PhysRevB.37.3759) 提出。

## 模型库文件的一般结构

模型库文件的典型结构如下：

    <MODEL>
    <SITEBASIS name="..."> ... </SITEBASIS>
    <BASIS name="..."> ... </BASIS>
    <HAMILTONIAN name="..."> ... </HAMILTONIAN>
    </MODEL>

`<SITEBASIS>` 用于定义单个格点的希尔伯特空间（基），`<BASIS>` 用于定义整个格子的希尔伯特空间，`<HAMILTONIAN>` 用于定义哈密顿量。

---

关于本节其余部分的概览，参见 [ALPS 模型定义](..)。关于格子本身如何指定，参见[格子定义](../../latticehowtos)。关于 ALPS 文档的其他章节，参见[总体介绍](../..)。
