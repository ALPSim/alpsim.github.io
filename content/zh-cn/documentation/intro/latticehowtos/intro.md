
---
title: "简介"
toc: true
weight: 1
---

## 在 ALPS 框架中指定晶格与图

本节说明如何在 ALPS 框架中指定晶格与图。把晶格作为输入文件的一部分来指定，而不是硬编码到模拟程序中，这样同一个应用程序就可以不加修改地在许多不同的晶格几何结构上复用。

本页涵盖以下主题：

- [如何用顶点和边指定一个简单图](../simplegraph)
- [如何指定晶格与晶胞](../unitcell)
- [如何指定与带晶胞的晶格相对应的图](../latticegraph)
- [如何创建晶格与图的库](../library)
- [如何检查由晶格定义生成的图](../checklattice)：使用 `printgraph` 工具，以与 ALPS 应用程序内部完全相同的方式，由晶格定义重新生成图，从而确认结果是否符合预期

## ALPS 晶格库中已有的晶格（图）

### 最常见晶格（图）一览

以下九种最常用的晶格已经内置在库中，无需自己编写任何 XML，直接通过 `LATTICE` 参数按名称选用即可：

| # | `LATTICE` | 参数 | 备注 |
| :- | :-------- | :--------- | :----- |
| 1 | `chain lattice` | `L`（长度） | 周期性、均匀 |
| 2 | `open chain lattice` | `L`（长度） | 开放、均匀 |
| 3 | `square lattice` | `L`（长度）、`W`（宽度，默认为 `L`） | 周期性、均匀 |
| 4 | `open square lattice` | `L`（长度）、`W`（宽度，默认为 `L`） | 开放、均匀 |
| 5 | `Kagome lattice` | `L`（长度）、`W`（宽度，默认为 `L`） | 周期性、均匀 |
| 6 | `honeycomb lattice` | `L`（长度）、`W`（宽度，默认为 `L`） | 周期性、均匀 |
| 7 | `inhomogeneous square lattice` | `L`（长度）、`W`（宽度，默认为 `L`） | 开放、非均匀 |
| 8 | `simple cubic lattice` | `L`（长度）、`W`（宽度，默认为 `L`）、`H`（高度，默认为 `W`） | 周期性、均匀 |
| 9 | `inhomogeneous simple cubic lattice` | `L`（长度）、`W`（宽度，默认为 `L`）、`H`（高度，默认为 `W`） | 开放、非均匀 |

![ALPS 中常用的晶格（图）](../figs/commonalpslattices.jpg)

### 晶格（图）的完整存档

晶格（图）的完整存档可以在 XML 文件 `$ALPSPATH/lib/xml/lattices.xml` 中找到。

---

关于在模拟中选择这些晶格所用的 `LATTICE`／`GRAPH` 输入参数，请参见[常用参数](../../parameters)。关于本节其余内容的概览，请参见[晶格的定义](..)。关于其他 ALPS 文档章节，请参见[简介](../..)。


