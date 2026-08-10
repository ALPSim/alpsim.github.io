
---
title: 格点基
toc: true
weight: 2
---

单个格点的基态由一个或多个量子数描述，例如：

    <SITEBASIS name="hardcore boson">
    <QUANTUMNUMBER name="N" min="0" max="1"/>
    </SITEBASIS>

    <SITEBASIS name="spin-1/2">
    <QUANTUMNUMBER name="S" min="1/2" max="1/2"/>
    <QUANTUMNUMBER name="Sz" min="-1/2" max="1/2"/>
    </SITEBASIS>

    <SITEBASIS name="fermion">
    <QUANTUMNUMBER name="Nup" min="0" max="1" type="fermionic"/>
    <QUANTUMNUMBER name="Ndown" min="0" max="1" type="fermionic"/>
    </SITEBASIS>

上面第一个例子描述了一个硬核玻色子（一个玻色模式，占据数被限制为 0 或 1），第二个描述了一个自旋 1/2，第三个描述了一个允许双占据的有自旋费米子（独立的 `Nup` 和 `Ndown`，各自取值 0 或 1）。

请注意，上面自旋 1/2 的例子同时声明了 `S` 和 `Sz`，尽管仅凭 `Sz` 就已经足以区分这两个态：之所以还需要单独给出总自旋 `S`，是因为它会出现在[量子算符](../operators)所定义的自旋算符的矩阵元中。

`<SITEBASIS>` 有一个 name 属性，之后可以通过它来引用该基。每个 `<QUANTUMNUMBER>` 元素都有一个 name 属性，并通过 min 和 max 属性给出取值的上下限。量子数可以取 min、min+1、min+2……直到 max 之间的值。此外还可以选择性地设置 type 属性为 bosonic（玻色型，默认值）或 fermionic（费米型）。当该量子数计数的是费米型自由度（例如费米子占据数）时，应将其设为 fermionic，这样由它构造出的算符才能与其他格点上的费米算符正确地反对易。

量子数的取值范围可以通过输入参数来参数化，并可以指定一个 `default` 默认值，例如：

    <SITEBASIS name="boson">
    <PARAMETER name="Nmax" default="infinity"/>
    <QUANTUMNUMBER name="N" min="0" max="Nmax"/>
    </SITEBASIS>

对于更复杂的模型，例如 t-J 模型，有时会存在若干等价的量子数选择。我们既可以用粒子数和自旋来标记态，也可以用向上自旋数和向下自旋数来标记：

    <SITEBASIS name="t-J">
    <QUANTUMNUMBER name="N" min="0" max="1" type="fermionic"/>
    <QUANTUMNUMBER name="S" min="N/2" max="N/2"/>
    <QUANTUMNUMBER name="Sz" min="-S" max="S"/>
    </SITEBASIS>

    <SITEBASIS name="alternative t-J">
    <QUANTUMNUMBER name="Nup" min="0" max="1" type="fermionic"/>
    <QUANTUMNUMBER name="Ndown" min="0" max="1-Nup" type="fermionic"/>
    </SITEBASIS>

在第一种写法中，`min="N/2" max="N/2"` 将 `S` 精确地固定为 `N/2`，而不是让它自由取值：空格点（`N=0`）被迫具有 `S=0`，单占据格点（`N=1`）被迫具有 `S=1/2`，这正好就是定义 t-J 模型所需的“禁止双占据”约束。这两种格点基描述的是同样的三个物理态（空、自旋向上、自旋向下），两者同样有效；具体用哪一种更方便取决于哈密顿量：当总自旋是一个有用的量子数时，`N`、`S` 基更自然；而在编写分别作用于向上、向下自旋费米子的算符时，例如[量子算符](../operators)中 `fermion_hop` 例子里的 `cdag_up`/`c_up` 算符，`Nup`、`Ndown` 基往往更简单。

---

关于本节其余部分的概览，参见 [ALPS 模型定义](..)。关于如何将单格点基组合成整个格子的基，参见[格子基](../latticebasis)。关于 ALPS 文档的其他章节，参见[总体介绍](../..)。
