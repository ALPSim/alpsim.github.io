
---
title: 格子基
toc: true
weight: 3
---

格子模型的基是通过为格子中每一种格点（顶点）类型给出一个格点基来指定的。如果格子中只有一种格点类型，那么只需给出一个格点基，既可以引用之前定义好的[格点基](../sitebasis)，也可以直接内联声明：

    <BASIS name="spin">
    <SITEBASIS ref="spin"/>
    </BASIS>

    <BASIS name="spin-1">
    <SITEBASIS name="spin-1">
        <QUANTUMNUMBER name="S" min="1" max="1"/>
        <QUANTUMNUMBER name="Sz" min="-1" max="1"/>
    </SITEBASIS>
    </BASIS>

和 `<SITEBASIS>` 一样，`<BASIS>` 元素也有一个 name 属性，之后可以从 `<HAMILTONIAN>` 中引用它（参见[哈密顿量描述](../hamiltonian)）。它包含一个 `<SITEBASIS>` 元素，作为所有格点默认使用的基，既可以像第一个例子那样通过 ref 属性引用先前定义的格点基，也可以像第二个例子那样内联声明完整的格点基。（第一个例子中的 `ref="spin"` 指向[量子算符](../operators)中定义的参数化 `spin` 格点基，本页其余部分都会用到它。）

## 每个晶胞包含多个格点的格子

如果格子的晶胞包含多个格点，`<BASIS>` 命令中应该为晶胞的每个格点各包含一个 `<SITEBASIS>` 条目，每个条目应有不同的 type，与格子库文件中给出的定义相对应（参见[格子定义](../../latticehowtos)）。

下面的基是一个二分格子希尔伯特空间的有效示例：

    <BASIS name="Kondo lattice">
    <SITEBASIS type="0" ref="fermion"/>
    <SITEBASIS type="1" ref="spin-1/2"/>
    </BASIS>

在某些自旋模型中，我们可能希望不同格点类型使用相同的局域格点基，但自旋大小随格点类型而不同。例如，我们可以通过参数 `local_S0` 和 `local_S1` 分别设置类型 0 和类型 1 格点上的自旋值，同时仍然提供合理的默认值：

    <BASIS name="spin">
    <SITEBASIS type="0" ref="spin">
        <PARAMETER name="local_spin" value="local_S0"/>
        <PARAMETER name="local_S0" value="local_S"/>
        <PARAMETER name="local_S" value="1/2"/>
    </SITEBASIS>
    <SITEBASIS type="1" ref="spin">
        <PARAMETER name="local_spin" value="local_S1"/>
        <PARAMETER name="local_S1" value="local_S"/>
        <PARAMETER name="local_S" value="1/2"/>
    </SITEBASIS>
    </BASIS>

这里 `local_spin` 是 `spin` 格点基内部用来设置 `S` 的参数（参见[量子算符](../operators)）；这条默认值链条使得用户在每一层都能得到一个合理的回退值：如果什么都不设置，两种格点类型都会通过 `local_S` 得到自旋 1/2；设置 `local_S=1` 后两种类型都变为自旋 1；也可以直接覆盖 `local_S0`/`local_S1`，让两种格点类型拥有不同的自旋。

当格点类型增多时，这种写法会变得繁琐，为此 ALPS 格式提供了一种简写。如果没有指定 type，`<SITEBASIS>` 将匹配任意格点，并且参数名中的通配符 `#` 会被替换为该格点的类型。这样一来，上面的例子就可以扩展到任意多种格点类型，并更紧凑地写成：

    <BASIS name="spin">
    <SITEBASIS ref="spin">
        <PARAMETER name="local_spin" value="local_S#"/>
        <PARAMETER name="local_S#" value="local_S"/>
        <PARAMETER name="local_S" value="1/2"/>
    </SITEBASIS>
    </BASIS>

## 约束

最后，基还可以被限制在某个扇区中，在该扇区内某个对所有格点求和后的量子数取固定值。例如，要将自旋基限制在总 `Sz` 等于参数 `Sz_total` 的扇区，可以添加一个 `<CONSTRAINT>` 元素：

    <BASIS name="spin">
    <SITEBASIS ref="spin"/>
    <CONSTRAINT quantumnumber="Sz" value="Sz_total"/>
    </BASIS>

像这样限制到某个扇区可以缩小希尔伯特空间的规模，这对于直接在完整希尔伯特空间中工作的方法（例如精确对角化）尤其重要。

---

关于本节其余部分的概览，参见 [ALPS 模型定义](..)。关于这里组合所用的单格点基，参见[格点基](../sitebasis)。关于 ALPS 文档的其他章节，参见[总体介绍](../..)。
