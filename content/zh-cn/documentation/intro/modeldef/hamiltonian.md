
---
title: 哈密顿量描述
toc: true
weight: 5
---

有了这些元素之后，我们现在就可以描述一个模型的哈密顿量了。一个简单的硬核玻色子模型可以写成：

    <HAMILTONIAN name="hardcore boson">
    <PARAMETER name="mu" default="0"/>
    <PARAMETER name="t" default="1"/>
    <PARAMETER name="t'" default="1"/>
    <BASIS ref="hardcore boson"/>
    <SITETERM type="0">
        -mu*n
    </SITETERM>
    <BONDTERM type="0" source="i" target="j">
        -t*(bdag(i)*b(j)+bdag(j)*b(i))
    </BONDTERM>
    <BONDTERM type="1" source="i" target="j">
        -t'*(bdag(i)*b(j)+bdag(j)*b(i))
    </BONDTERM>
    </HAMILTONIAN>

首先，可以用 `<PARAMETER>` 元素为耦合常数等参数指定默认值。接下来，一个 `<BASIS>` 元素指定该模型所使用的基，既可以完全内联给出，也可以通过引用（使用 ref 属性）给出。

哈密顿量的各项接下来由格点项和键项来指定：格点项与格子的格点相关联，键项与格子的键相关联。每个 `<SITETERM>` 和 `<BONDTERM>` 元素都可以选择性地带一个 type 属性，指定该项适用于哪种类型的格点（或键）——与格子描述中给出的类型相同。省略 type 属性会使该项应用于所有未被其他项显式指定的格点或键。

`<SITETERM>` 元素包含哈密顿量中与单个格点相关联的项。在上面的例子中，项 `mu` 指的是参数 `mu`，而项 `n` 指的是[量子算符](../operators)中描述的算符 `n`。在 `<BONDTERM>` 元素中，算符必须涉及两个不同的格点；这是通过在算符后面的括号中加入格点索引来实现的，例如用 `n(i)` 表示作用在格点 `i` 上。source 和 target 属性给出了用来指代这两个格点的变量名（在这个例子中是 `i` 和 `j`）。

为了简化哈密顿量的书写，可以直接重用之前定义好的格点算符和键算符，而不必重新写出矩阵元。对于一个横场自旋模型，我们可以使用[量子算符](../operators)中定义的 `Sx` 和 `exchange` 算符：

    <HAMILTONIAN name="spin">
    <PARAMETER name="J" default="1"/>
    <PARAMETER name="h" default="0"/>
    <PARAMETER name="Gamma" default="0"/>
    <BASIS ref="spin"/>
    <SITETERM site="i">
        -h*Sz(i)-Gamma*Sx(i)
    </SITETERM>
    <BONDTERM source="i" target="j">
        J*exchange(i,j)
    </BONDTERM>
    </HAMILTONIAN>

依赖格点/键类型的耦合项既可以像第一个例子那样，通过 type 属性限定格点项或键项的适用范围来指定，也可以在耦合常数名称中使用 `#` 通配符字符，该字符会被替换为格点或键的类型，例如：

    <HAMILTONIAN name="spin">
    <PARAMETER name="J" default="1"/>
    <PARAMETER name="h" default="0"/>
    <PARAMETER name="Gamma" default="0"/>
    <BASIS ref="spin"/>
    <SITETERM site="i">
        <PARAMETER name="h#" default="h"/>
        <PARAMETER name="Gamma#" default="Gamma"/>
        -h#*Sz(i)-Gamma#*Sx(i)
    </SITETERM>
    <BONDTERM source="i" target="j">
        <PARAMETER name="J#" default="J"/>
        J#*exchange(i,j)
    </BONDTERM>
    </HAMILTONIAN>

这样我们就可以为类型 0 的格点指定 `h0` 和 `Gamma0`、为类型 0 的键指定 `J0`，为类型 1 指定 `h1`、`Gamma1` 和 `J1`，依此类推——例如，`anisotropic2d` 晶胞（参见[格子与图库](../../latticehowtos/library)）正是通过这种方式，让模型可以为沿不同格子方向的键分别指定不同的耦合 `J0`/`J1`。这里的 `J`、`h` 和 `Gamma` 与 [ALPS 模型定义](..)中描述的是同一批参数。

更复杂项的扩展，例如三格点项和四格点项，目前正在开发中，一旦 ALPS 库支持此类项，就会在此处补充说明。

---

关于本节其余部分的概览，参见 [ALPS 模型定义](..)。关于这些哈密顿量项中使用的算符，参见[量子算符](../operators)。关于 ALPS 文档的其他章节，参见[总体介绍](../..)。
