
---
title: Lattice and Unit Cells
toc: true
weight: 3
---

格点模型通常定义在一个无限格子上，或者定义在其中有限的一部分上。这里我们从晶胞及其基矢量出发，说明如何用 XML 格式指定这两种情形。

## 无限格子

格子是通过将晶胞沿格子基矢量的整数倍平移并复制而构建的，下面以二维情形为例：

![Infinite lattice with unit cell.](../figs/tutoriallatticehowtolattice1.gif)

这样的格子由一个（可选的）名称和维度来描述。此外，我们还可以指定格子基矢量的笛卡尔坐标。对于上面的格子，这可以写成：

    <LATTICE name="2D" dimension="2">
    <BASIS>
        <VECTOR>   1 0 </VECTOR>
        <VECTOR> 0.5 1 </VECTOR>
    </BASIS>
    </LATTICE>

基矢量也可以用符号化、参数化的方式指定，例如：

    <LATTICE name="2D" dimension="2">
    <PARAMETER name="a" default="1"/>
    <PARAMETER name="b" default="1"/>
    <PARAMETER name="phi" default="Pi/2"/>
    <BASIS>
        <VECTOR>   a 0 </VECTOR>
        <VECTOR> b*cos(phi) b*sin(phi) </VECTOR>
    </BASIS>
    </LATTICE>

在这里给出的默认值下，这与直接给出具体值 `phi=Pi/2` 得到的是同一个正方格子：第一个基矢量沿 x 轴方向，第二个基矢量长度为 `b`，与第一个基矢量夹角为 `phi`。

## 有限格子

### 有限延伸

（并非全部，但是）大多数计算模拟并不是在上面这种无限格子上进行的，而是在格子的一个有限部分上进行的。定义这样的有限格子有很多种方式：格子的任意有限子集本身就是一个有限格子，因此可能性是无穷的。首先，我们来定义最常见的具有有限延伸的格子，即晶胞在任一方向上最多被平移有限次——例如正方、矩形、立方或超立方格子——并在每个维度上指定其延伸范围。

![A finite lattice](../figs/tutoriallatticehowtolattice2.gif)

要创建一个有限格子，可以这样定义：

    <FINITELATTICE name="5x3">
    <LATTICE name="2D" dimension="2"/>
    <EXTENT dimension="1" size="5"/>
    <EXTENT dimension="2" size="3"/>
    </FINITELATTICE>

如果省略 dimension 属性，则假定该延伸适用于所有维度，例如线性尺寸为 4 的立方格子可以写成：

    <FINITELATTICE>
    <LATTICE dimension="3"/>
    <EXTENT size="4"/>
    </FINITELATTICE>

并不是所有维度都必须是有限的，宽度为 2 的无限长条带可以指定为：

![A mixed lattice with finite and infinite dimensions](../figs/tutoriallatticehowtolattice3.gif)

    <FINITELATTICE name="strip">
    <LATTICE name="2D" dimension="2"/>
    <EXTENT dimension="2" size="2"/>
    </FINITELATTICE>

在许多应用中，具体的延伸范围并不是固定的，而是由用户指定的输入参数。我们同样可以用 `<PARAMETER>` 元素来指定延伸范围。对于一个 L × 2 的条带，可以写成：

    <FINITELATTICE>
    <LATTICE name="2D" dimension="2"/>
    <PARAMETER name="L"/>
    <EXTENT dimension="1" size="L"/>
    <EXTENT dimension="2" size="2"/>
    </FINITELATTICE>

如果我们想要一个大小为 L × W 的条带，并且在未指定 W 时其默认宽度为 2，就需要同时给出 size 属性和 parameter 属性：

    <FINITELATTICE>
    <LATTICE name="2D" dimension="2"/>
    <PARAMETER name="L" />
    <PARAMETER name="W" default="2" />
    <EXTENT dimension="1" size="L" />
    <EXTENT dimension="2" size="W" />
    </FINITELATTICE>

最后，我们经常会考虑这样一种正方（或立方）格子：除非明确给出其他维度（例如 W 表示宽度，H 表示高度），否则所有维度都取相同的延伸 L。这可以描述为：

    <FINITELATTICE>
    <LATTICE name="3D" dimension="3"/>
    <PARAMETER name="L" />
    <PARAMETER name="W" default="L" />    
    <PARAMETER name="H" default="W" />
    <EXTENT dimension="1" size="L" />
    <EXTENT dimension="2" size="W" />
    <EXTENT dimension="3" size="H" />
    </FINITELATTICE>

`L` 总是设定第一个维度的延伸，其余维度在未被覆盖时则回落到各自的默认值。因此，如果用户只指定了 `L`，得到的是 L×L×L 的立方体；如果指定了 `L` 和 `W`，得到的是 L×W×W 的长方体；如果指定了 `L` 和 `H`，得到的是 L×L×H 的长方体；如果 `L`、`W`、`H` 全部指定，则得到 L×W×H 的长方体。

## 边界条件

对于有限格子，除了延伸范围之外，还需要指定边界条件。常用的边界条件有：

- open（开放）：格子具有开放的边界，边界处的格点在一个或多个方向上没有相邻格点
- periodic（周期性）：格子被视为周期性的，即从一侧移出格子时，会从对面一侧重新进入格子。最右侧格点的右邻居就是最左侧的格点，最上方格点的上邻居就是最下方的格点。对于二维格子，这看起来就像一个环面（torus）。

针对这两种边界条件，我们定义了一个 `<BOUNDARY>` 元素，其 type 属性可以取这两个值之一。例如，对于一个周期性的 L × L 正方格子：

    <FINITELATTICE>
    <LATTICE name="2D" dimension="2"/>
    <EXTENT size="L" />
    <BOUNDARY type="periodic" />
    </FINITELATTICE>

再例如，对于一个长方向周期性、短方向开放的条带：

    <FINITELATTICE name="strip">
    <LATTICE name="strip" dimension="2"/>
    <PARAMETER name="W" default="2" />
    <EXTENT dimension="1" size="L" />
    <EXTENT dimension="2" size="W" />
    <BOUNDARY dimension="1" type="periodic" />
    <BOUNDARY dimension="2" type="open" />
    </FINITELATTICE>

或者，如果希望在运行时确定边界条件，同样可以用一个 `<PARAMETER>` 元素来指定决定边界条件的参数名称，并可选地给出默认值：

    <FINITELATTICE>
    <LATTICE name="cube" dimension="3"/>
    <PARAMETER name="BC" default="periodic" />
    <EXTENT size="L" />
    <BOUNDARY type="BC" />
    </FINITELATTICE>

这将指定一个立方格子，其边界条件由参数 `BC` 给出，默认取周期性边界条件。

## 引用格子

除了每次都重新定义一个格子之外，我们也可以引用之前定义过的格子。例如，与其这样定义：

    <FINITELATTICE name = "finite tilted 2D">
    <LATTICE name="tilted 2D" dimension="2">
        <BASIS>
        <VECTOR>   1 0 </VECTOR>
        <VECTOR> 0.5 1 </VECTOR>
        </BASIS>
    </LATTICE>
    <PARAMETER name="BC" default="periodic" />
    <EXTENT dimension="1" size="L" />
    <EXTENT dimension="2" size="W" />
    <BOUNDARY type="BC" />
    </FINITELATTICE>

我们可以先定义这个无限格子：

    <LATTICE name="tilted 2D" dimension="2">
    <BASIS>
        <VECTOR>   1  0 </VECTOR>
        <VECTOR> 0.5 1 </VECTOR>
    </BASIS>
    </LATTICE>

然后，每次定义有限子格子时，通过在 lattice 元素中使用 ref 属性来引用这个格子，而不必重复其定义：

    <FINITELATTICE name = "finite tilted 2D">
    <LATTICE ref="tilted 2D"/>
    <PARAMETER name="BC" default="periodic" />
    <EXTENT dimension="1" size="L" />
    <EXTENT dimension="2" size="W" />
    <BOUNDARY type="BC" />
    </FINITELATTICE>

---

关于本节其余内容的概览，请参见[格子的定义](..)。关于在模拟中选择格子所用的 `LATTICE`／`GRAPH` 输入参数，请参见[常用参数](../../parameters)。关于其他 ALPS 文档章节，请参见[简介](../..)。
