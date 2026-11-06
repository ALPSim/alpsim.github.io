---
title: 随位置变化的耦合
math: true
toc: true
weight: 6
---

在普通的 ALPS 晶格上，模型中的每个耦合（`mu`、`t`、`J`、`h` 等）都只有一个值，用于所有格点，或同一类型的所有键。但很多问题需要随位置变化的耦合：化学势中的谐振子势阱或线性倾斜、梯度场，或者随机势。ALPS 用两部分来处理这类问题：

1. **非均匀晶格**：它让 ALPS 对每个格点（或每条键）分别计算格点项（或键项）；
2. **参数表达式**：它可以使用该格点或该键的坐标 `x`、`y`、`z`，或者随机数。

模型本身无需任何修改：`models.xml` 中的内置模型可以直接使用。

## 第一个例子

下面的参数文件把硬核玻色子放在一条 6 个格点的链上，并加上线性势 $\mu(x) = \mu_\text{left} - s\,x$：

```
LATTICE="inhomogeneous chain lattice"
L=6
MODEL="hardcore boson"
t=1
mu_left=1
slope=0.4
mu="mu_left - slope*x"
T=1
THERMALIZATION=5000
SWEEPS=20000
MEASURE[Local Density]=1
```

像平常一样运行即可，例如

```bash
parameter2xml parm_tilt
dirloop_sse parm_tilt.in.xml
```

`Local Density` 测量结果显示，密度从链的左端（$x=0$）向右端（$x=5$）逐渐降低。

`mu` 的值加了引号，因为它是一个表达式而不是一个数。它会对每个格点各计算一次，计算时 `x` 取该格点的坐标。表达式中可以引用其他参数，这里是 `mu_left` 和 `slope`。

{{< callout type="warning" >}}
辅助参数的名字要谨慎选择。大多数内置模型还会读取按类型区分的耦合，例如 `mu0`、`t0`、`V0` 或 `J1`（参见[哈密顿量描述](../hamiltonian)中的 `#` 通配符）。以这些名字命名的参数会在相应类型的格点或键上悄悄取代 `mu`、`t`、`V` 或 `J`。如果上面的例子用 `mu0` 和 `V0` 代替 `mu_left` 和 `slope`，那么 `mu0=1` 会在每个格点上覆盖倾斜的 `mu`，而 `V0=0.4` 会打开最近邻排斥相互作用，并且不会有任何错误或警告。
{{< /callout >}}

## 非均匀晶格

如果一个晶格的 `<LATTICEGRAPH>` 中包含 `<INHOMOGENEOUS>` 元素，它就是非均匀晶格。晶格库 `lattices.xml` 中已经有四个这样的晶格：

| `LATTICE` | 参数 | 非均匀的部分 |
| :-------- | :--- | :----------- |
| `inhomogeneous chain lattice` | `L` | 格点 |
| `inhomogeneous square lattice` | `L`、`W`（默认 `L`） | 格点 |
| `inhomogeneous simple cubic lattice` | `L`、`W`（默认 `L`）、`H`（默认 `W`） | 格点 |
| `inhomogeneous anisotropic square lattice` | `L`、`W`（默认 `L`） | 格点 |

这四个晶格都是开边界，并且只有格点项随位置变化。

要让自己定义的晶格成为非均匀晶格，在 `<UNITCELL>` 之后加上该元素：

```xml
<LATTICEGRAPH name = "inhomogeneous periodic chain lattice">
  <FINITELATTICE>
    <LATTICE ref="chain lattice"/>
    <EXTENT dimension="1" size="L"/>
    <BOUNDARY type="periodic"/>
  </FINITELATTICE>
  <UNITCELL ref="simple1d"/>
  <INHOMOGENEOUS><VERTEX/><EDGE/></INHOMOGENEOUS>
</LATTICEGRAPH>
```

`<VERTEX/>` 使格点项随位置变化，`<EDGE/>` 使键项随位置变化；可以只用其中一个，也可以两个都用。它们作用于所有格点或所有键：不支持用 `type` 属性把它们限制在某一种类型上。[玻色玻璃](../../../methods/qmc/boseglass)页面用同样的元素给正方晶格加上周期边界。

{{< callout type="info" >}}
用 `LATTICE_LIBRARY` 指定的文件会取代内置的 `lattices.xml`，而不是添加到其中。因此，像上面这样引用了 `chain lattice` 或 `simple1d` 的定义，需要把这些定义也放在同一个文件里。最简单的做法是复制一份 `lattices.xml`，再把你的晶格加到副本中。`printgraph`（参见[检查晶格图](../../latticehowtos/checklattice)）可以显示结果中的格点、键和坐标。
{{< /callout >}}

## 表达式中的坐标

在非均匀晶格上，表达式可以使用以下变量：

| 变量 | 在格点项中 | 在键项中 |
| :--- | :--------- | :------- |
| `x` | 格点的第一个坐标 | 键中点的第一个坐标 |
| `y` | 第二个坐标（二维和三维晶格） | 键中点的第二个坐标 |
| `z` | 第三个坐标（三维晶格） | 键中点的第三个坐标 |

这些坐标就是 `printgraph` 为该晶格打印出的坐标。对于链、正方晶格和简单立方晶格，它们是整数的晶胞位置，沿第一个方向从 0 到 `L-1`。因此，在 `L`$\times$`L` 正方晶格中心放一个势阱可以写成

```
LATTICE="inhomogeneous square lattice"
L=10
mu="4 - 0.2*((x-(L-1)/2)^2 + (y-(L-1)/2)^2)"
```

键项使用键的中点。在链上，连接 $x=2$ 和 $x=3$ 两个格点的键看到的是 `x=2.5`，所以在晶格中加上 `<EDGE/>` 之后，

```
J="1 + 0.2*x"
```

使这条键的 $J = 1.5$。

同样的变量也可以直接用在模型定义中。例如，下面这个 `<HAMILTONIAN>` 把倾斜势写进了模型里，参数文件只需要设置 `mu` 和 `slope`：

```xml
<HAMILTONIAN name="tilted hardcore boson">
  <PARAMETER name="mu" default="0"/>
  <PARAMETER name="slope" default="0"/>
  <PARAMETER name="t" default="1"/>
  <BASIS ref="hardcore boson"/>
  <SITETERM site="i">-(mu - slope*x)*n(i)</SITETERM>
  <BONDTERM source="i" target="j">-t*(bdag(i)*b(j)+bdag(j)*b(i))</BONDTERM>
</HAMILTONIAN>
```

与 `LATTICE_LIBRARY` 一样，用 `MODEL_LIBRARY` 指定的文件会取代内置的 `models.xml`，所以请把新的哈密顿量加到 `models.xml` 的副本中。

两种常见的错误：

- 在没有 `<INHOMOGENEOUS>` 的晶格上，坐标没有定义，程序会停止并输出 `Cannot evaluate expression ...`，后面跟着使用了坐标的那个表达式。
- 在非均匀晶格上，`x`、`y`、`z` 是保留名字。把其中某一个定义为参数，程序会停止并输出 `x, y or z is predefined as parameter and used as coordinate`。

## 函数和运算符

表达式可以使用 `+`、`-`、`*`、`/`、`^`（乘方）和括号，常数 `Pi`（也可以写成 `PI` 或 `pi`），以及下列函数：

| 函数 | 含义 |
| :--- | :--- |
| `sqrt(a)`、`abs(a)` | 平方根、绝对值 |
| `exp(a)`、`log(a)` | 指数函数、自然对数 |
| `sin(a)`、`cos(a)`、`tan(a)` | 三角函数（弧度制） |
| `asin(a)`、`acos(a)`、`atan(a)` | 反三角函数 |
| `atan2(y, x)` | 点 $(x, y)$ 的辐角 |
| `random()` | $[0, 1)$ 上均匀分布的随机数 |
| `gaussian_random()` | 均值为 0、标准差为 1 的正态分布随机数 |
| `gaussian_random(m, s)` | 均值为 `m`、标准差为 `s` 的正态分布随机数 |
| `integer_random(n)` | 从 0 到 `n-1` 的随机整数 |

`normal_random` 是 `gaussian_random` 的另一个名字。

## 随机无序

在非均匀晶格上，随机函数会在每个格点（或每条键）上分别计算，因此

```
mu="delta*(2*random() - 1)"
```

让每个格点都有自己的化学势，在 `-delta` 和 `delta` 之间均匀分布。

这些随机数来自一个单独的随机数发生器，其种子是 `DISORDERSEED`（默认为 0）。这个种子与蒙特卡罗更新的种子 `SEED` 相互独立。因此，`DISORDERSEED` 相同的模拟看到的无序是相同的，即使它们的 `SEED` 不同。要对无序取平均，给每个无序实现在一个 `{ }` 块中指定各自的 `DISORDERSEED`，这样每个实现就成为一个单独的任务：

```
{ DISORDERSEED = 34275; }
{ DISORDERSEED = 49802; }
{ DISORDERSEED = 82529; }
```

之后再对各任务的结果取平均。[玻色玻璃](../../../methods/qmc/boseglass)页面给出了一个完整的例子。

## 哪些程序支持

随位置变化的耦合适用于精确对角化程序（`sparsediag`、`fulldiag`）、`dmrg`，以及量子蒙特卡罗程序（`dirloop_sse`、`loop`、`worm`）。[光晶格中的玻色子](../../../methods/qmc/bhol)页面用 `dirloop_sse` 模拟了三维势阱中的玻色子。

### `worm` 需要晶格，而不是图

晶格库中的 `GRAPH`（一组顶点和边，没有晶胞）可以用于 `dirloop_sse` 和精确对角化程序，但不能用于 `worm`，后者会停止并输出

```
Cannot save a measurement of size 0.
```

要在单个三角形这样的小团簇上运行 `worm`，可以把这个团簇写成一个开边界晶格的晶胞，并设置 `L=1`。`lattices.xml` 中的 `Kagome` 晶胞就是一个 3 个格点的三角形，因此

```xml
<LATTICEGRAPH name = "open kagome lattice">
  <FINITELATTICE>
    <LATTICE ref="triangular lattice"/>
    <PARAMETER name="W" default="L"/>
    <EXTENT dimension="1" size="L"/>
    <EXTENT dimension="2" size="W"/>
    <BOUNDARY type="open"/>
  </FINITELATTICE>
  <UNITCELL ref="Kagome"/>
</LATTICEGRAPH>
```

配合 `LATTICE="open kagome lattice"` 和 `L=1`，就得到一个 `worm` 可以接受的三角形。再加上 `<INHOMOGENEOUS><VERTEX/></INHOMOGENEOUS>`，耦合也可以随位置变化。

---

关于这些参数所进入的哈密顿量各项，参见[哈密顿量描述](../hamiltonian)。关于晶格和晶胞如何定义，参见[晶格定义](../../latticehowtos)。关于 ALPS 程序共用的其他参数，参见[常用参数](../../parameters)。
