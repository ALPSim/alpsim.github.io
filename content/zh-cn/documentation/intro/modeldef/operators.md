
---
title: 量子算符
toc: true
weight: 4
---

## 简单格点算符

用于构造哈密顿量算符的基本量子算符由名称、矩阵元以及（可选的）该算符对量子数造成的改变来指定。这些算符是在格点基内部定义的。例如：

    <SITEBASIS name="spin">
    <PARAMETER name="local_spin" default="1/2"/>
    <QUANTUMNUMBER name="S" min="local_spin" max="local_spin"/>
    <QUANTUMNUMBER name="Sz" min="-S" max="S"/>

    <OPERATOR name="Splus" matrixelement="sqrt(S*(S+1)-Sz*(Sz+1))">
        <CHANGE quantumnumber="Sz" change="1"/>
    </OPERATOR>

    <OPERATOR name="Sminus" matrixelement="sqrt(S*(S+1)-Sz*(Sz-1))">
        <CHANGE quantumnumber="Sz" change="-1"/>
    </OPERATOR>

    <OPERATOR name="Sz" matrixelement="Sz"/>
    </SITEBASIS>

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
    </SITEBASIS>

    <SITEBASIS name="fermion">
    <QUANTUMNUMBER name="Nup" min="0" max="1" type="fermionic"/>
    <QUANTUMNUMBER name="Ndown" min="0" max="1" type="fermionic"/>

    <OPERATOR name="cdag_up" matrixelement="1">
        <CHANGE quantumnumber="Nup" change="1"/>
    </OPERATOR>

    <OPERATOR name="c_up" matrixelement="1">
        <CHANGE quantumnumber="Nup" change="-1"/>
    </OPERATOR>

    <OPERATOR name="cdag_down" matrixelement="1">
        <CHANGE quantumnumber="Ndown" change="1"/>
    </OPERATOR>

    <OPERATOR name="c_down" matrixelement="1">
        <CHANGE quantumnumber="Ndown" change="-1"/>
    </OPERATOR>
    </SITEBASIS>

与 `bdag`/`b` 不同，费米型的产生/湮灭算符 `cdag_up`/`c_up` 的矩阵元只是简单的 `1`，而不是平方根形式，这是因为 `Nup` 只能取 0 和 1 这两个值：`<QUANTUMNUMBER>` 本身的 `max="1"` 已经禁止了双占据，因此不需要依赖占据数的前置系数。将 `Nup`/`Ndown` 声明为 `type="fermionic"`（如[格点基](../sitebasis)中所述）正是使这些算符能与其他格点上的费米算符正确反对易的原因 —— 这也正是下面 `cdag_up`/`c_up` 能够被组合成 `fermion_hop` 键算符的原因。

可选的 `<CHANGE>` 元素说明施加该算符会使给定的量子数改变指定的量 —— `Splus` 使 `Sz` 增加 1，`Sminus` 使其减少 1，而 `bdag`/`b` 使 `N` 增加/减少 1。没有 `<CHANGE>` 元素的算符，例如上面的 `Sz` 或 `n`，是对角的：它不改变任何量子数。在矩阵元的表达式中，可以通过量子数的名称（本例中的 `S`、`Sz`、`N`）来引用其取值——这些取值总是按照*施加 `<CHANGE>` 之前*的初始态来求值。

## 复合格点算符

除了以唯一方式改变某个量子数的简单格点算符之外，我们还可以构造更复杂的格点算符，例如 `Sx` 自旋算符：

    <SITEOPERATOR name="Sx" site="i">
    1/2*(Splus(i)+Sminus(i))
    </SITEOPERATOR>

或者用于计数同一格点上玻色子对数目的算符，例如出现在 Bose-Hubbard 哈密顿量的在位相互作用项中：

    <SITEOPERATOR name="double_occupancy" site="x">
    n(x)*(n(x)-1)/2
    </SITEOPERATOR>

这些算符定义可以使用任何其他简单或复合的格点算符。给算符的括号中传入的参数是该格点的符号名，由 `<SITEOPERATOR>` 元素中的 site 属性指定。

## 复合键算符

与复合格点算符类似，我们也可以定义作用于两个格点的键算符。下面第一个例子是用 `Sz`、`Splus` 和 `Sminus` 写出的海森堡交换相互作用 `S(x)·S(y)`；第二个例子是用独立的向上、向下自旋算符写出的、保持自旋守恒的费米子跃迁项：

    <BONDOPERATOR name="exchange" source="x" target="y">
    Sz(x)*Sz(y)+1/2*(Splus(x)*Sminus(y)+Sminus(x)*Splus(y))
    </BONDOPERATOR>

    <BONDOPERATOR name="fermion_hop" source="x" target="y">
    cdag_up(x)*c_up(y)+cdag_up(y)*c_up(x)+cdag_down(x)*c_down(y)+cdag_down(y)*c_down(x)
    </BONDOPERATOR>

这里我们有两个格点，分别标记为 source 和 target。本页定义的所有算符——简单格点算符、复合格点算符和键算符——都可以在 `<HAMILTONIAN>` 的 `<SITETERM>`/`<BONDTERM>` 元素中按名称引用（参见[哈密顿量描述](../hamiltonian)），也可以在自定义测量的定义中使用（参见 [ALPS 自定义测量](../../measuredef)）。

---

关于本节其余部分的概览，参见 [ALPS 模型定义](..)。关于如何将这些算符组装成哈密顿量，参见[哈密顿量描述](../hamiltonian)。关于 ALPS 文档的其他章节，参见[总体介绍](../..)。
