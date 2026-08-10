
---
title: Lattices and Graphs
toc: true
weight: 4
---

前面几篇 HOWTO 展示了如何直接描述任意的图，以及如何通过晶胞及其基矢量来描述格子的几何结构。这里我们把二者结合起来：给格子的每一个晶胞副本都装饰上一个小图，从而构建出实际用于模拟的图。

## 一个简单的图

大多数物理模拟中的图并不是不规则的，而是像格子一样有规律地构建起来的：

![The first simple graph.](../figs/tutoriallatticehowtolatticegraph1.gif)

我们可以通过把这个图放置在一个格子上，来体现它的规律性：

![The graph on a lattice.](../figs/tutoriallatticehowtolatticegraph2.gif)

这个格子可以用一个晶胞来描述，整个图则是通过给该晶胞的每一个副本都装饰上同一个“晶胞图”而构建出来的：

![Unit cell graph.](../figs/tutoriallatticehowtolatticegraph3.gif)

这里的晶胞图由一个顶点构成，它与相邻晶胞中的同一个顶点之间有一条边。这样一个定义在格子上的图，可以通过把 `<LATTICE>` 或 `<FINITELATTICE>` 与描述晶胞上图形的 `<UNITCELL>` 元素结合起来，用 XML 表示，整个图就是由这个晶胞构建出来的：

    <LATTICEGRAPH>
        <FINITELATTICE>
        <LATTICE dimension="1"/>
            <EXTENT size="6"/>
            <BOUNDARY type="open"/>
        </FINITELATTICE>
        <UNITCELL dimension="1" vertices="1">
        <VERTEX/>
        <EDGE>
            <SOURCE vertex="1"/>
            <TARGET vertex="1" offset="1"/>
        </EDGE>
        </UNITCELL>
    </LATTICEGRAPH>
  
晶胞中的这条边从本晶胞中的顶点 1，连接到右侧相邻晶胞中的顶点 1（偏移量为 +1），如 `<EDGE>` 元素所描述的那样。`<SOURCE>` 元素中省略了偏移量 0，因为 0 是它的默认值。

要描述一条无限长的链，我们会使用 `<LATTICE>` 元素，而不是 `<FINITELATTICE>` 元素。

## 一个复杂的例子

我们同样可以描述带颜色的边和顶点，或者给顶点添加坐标之类的其他属性。此外，`<LATTICEGRAPH>` 中格子部分可以使用[格子与晶胞](../unitcell)中介绍的全部机制，包括有限延伸、边界条件，以及引用先前定义过的格子。下面我们给出一个例子：在 L × W 的矩形格子上构建一个复杂的周期性图：

![A complex periodic graph on a lattice.](../figs/tutoriallatticehowtolatticegraph4.jpg)

这个格子上的图，可以由如下这个装饰矩形格子的复杂晶胞图构建出来：

![A complex graph in a unit cell.](../figs/tutoriallatticehowtolatticegraph5.jpg)

对应的 XML 描述如下：

    <LATTICE name="square" dimension="2">
        <BASIS>
        <VECTOR> 1 0 </VECTOR>
        <VECTOR> 0 1 </VECTOR>
        </BASIS>
    </LATTICE>
    <FINITELATTICE name="rectangular periodic" dimension="2">
        <LATTICE ref="square"/>
        <PARAMETER name="L"/>
        <PARAMETER name="W" default="L"/>
        <EXTENT dimension="1" size="L"/>
        <EXTENT dimension="2" size="W"/>
        <BOUNDARY type="periodic"/>
    </FINITELATTICE>
    <UNITCELL name="complex example" dimension="2" vertices="2">
        <VERTEX id="1" type="0"><COORDINATE> 0.3 0.7 </COORDINATE></VERTEX>
        <VERTEX id="2" type="1"><COORDINATE> 0.6 0.3 </COORDINATE></VERTEX>
        <EDGE><SOURCE vertex="1"/><TARGET vertex="1" offset="1 0"/></EDGE>
        <EDGE><SOURCE vertex="1"/><TARGET vertex="1" offset="0 1"/></EDGE>
        <EDGE><SOURCE vertex="1"/><TARGET vertex="2"/></EDGE>
    </UNITCELL>
    <LATTICEGRAPH>
        <FINITELATTICE ref="rectangular periodic"/>
        <UNITCELL ref="complex example"/>
    </LATTICEGRAPH>
    
这里我们利用了之前定义好的、带名字的格子和晶胞（例如来自某个库），然后通过在 `<LATTICEGRAPH>` 元素中引用它们，把它们组合起来。另一种做法是把所有内容都直接定义在 `<LATTICEGRAPH>` 元素中：

    <LATTICEGRAPH>
        <FINITELATTICE dimension="2">
        <LATTICE dimension="2">
            <BASIS>
            <VECTOR> 1 0 </VECTOR>
            <VECTOR> 0 1 </VECTOR>
            </BASIS>
        </LATTICE>
        <PARAMETER name="L"/>
        <PARAMETER name="W" default="L"/>
        <EXTENT dimension="1" size="L"/>
        <EXTENT dimension="2" size="W"/>
        <BOUNDARY type="periodic"/>
        </FINITELATTICE>
        <UNITCELL dimension="2" vertices="2">
        <VERTEX id="1" type="0"><COORDINATE> 0.3 0.7 </COORDINATE></VERTEX>
        <VERTEX id="2" type="1"><COORDINATE> 0.6 0.3 </COORDINATE></VERTEX>
        <EDGE><SOURCE vertex="1"/><TARGET vertex="1" offset="1 0"/></EDGE>
        <EDGE><SOURCE vertex="1"/><TARGET vertex="1" offset="0 1"/></EDGE>
        <EDGE><SOURCE vertex="1"/><TARGET vertex="2"/></EDGE>
        </UNITCELL>
    </LATTICEGRAPH>
  
由于晶胞中顶点的坐标和格子的基矢量都已经给出，所以可以计算出所有顶点的坐标。

---

关于本节其余内容的概览，请参见[格子的定义](..)。关于在模拟中选择图所用的 `LATTICE`／`GRAPH` 输入参数，请参见[常用参数](../../parameters)。关于其他 ALPS 文档章节，请参见[简介](../..)。
