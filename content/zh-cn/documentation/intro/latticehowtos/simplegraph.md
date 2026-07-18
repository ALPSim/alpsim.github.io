
---
title: Simple Graphs
toc: true
weight: 2
---

这里介绍如何用 XML 格式来表示简单图：每个顶点和每条边都显式给出。

## 简单图

我们的第一个例子是下面这个具有五个顶点和五条边的简单图：

![The first simple graph.](../figs/tutoriallatticehowtograph1.gif)

这个图用 XML 表示如下，其中 `<GRAPH>` 元素的 edges 属性是可选的，因为边的数目可以通过统计 `<EDGE>` 元素的个数得到：

    <GRAPH vertices="5" edges="5">
    <EDGE source="1" target="2"/>
    <EDGE source="2" target="3"/>
    <EDGE source="1" target="4"/>
    <EDGE source="2" target="5"/>
    <EDGE source="4" target="5"/>
    </GRAPH>

请注意，`vertices` 和 `edges` 可省略的条件并不相同。`edges` 纯粹是提供信息，不需要与实际的 `<EDGE>` 元素数目一致。而 `vertices` 会在读取时立即确定顶点的数目，因此只有当每个顶点都通过显式的 `<VERTEX>` 元素引入时，才能省略它——上面这个图完全没有 `<VERTEX>` 元素，所以与 `edges="5"` 不同，其中的 `vertices="5"` 是必需的。更一般地说，在某个 `<EDGE>` 引用某个顶点之前，务必确保该顶点已经通过 `vertices` 或更早出现的 `<VERTEX>` 元素被识别。

## 带颜色的图

带颜色边和顶点的图也可以表示出来：

![A graph with colored edges and vertices.](../figs/tutoriallatticehowtograph2.jpg)

我们通过引入额外的 `<VERTEX>` 元素来描述顶点，并用 type 属性来指定顶点和边的类型（颜色），从而用 XML 表示这个图。在这个例子中，顶点类型 0、1、2 分别对应红色、绿色、蓝色的顶点，边类型 0 和 1 分别对应实线和虚线：

    <GRAPH vertices="5" edges="5">
    <VERTEX id="1" type="0"/>
    <VERTEX id="2" type="1"/>
    <VERTEX id="3" type="0"/>
    <VERTEX id="4" type="2"/>
    <VERTEX id="5" type="2"/>
    <EDGE source="1" target="2" type="0"/>
    <EDGE source="2" target="3" type="0"/>
    <EDGE source="1" target="4" type="1"/>
    <EDGE source="2" target="5" type="1"/>
    <EDGE source="4" target="5" type="0"/>
    </GRAPH>

在这个例子中，vertices 属性和 edges 属性都是可选的，因为二者都可以分别通过统计 `<VERTEX>` 元素和 `<EDGE>` 元素的个数得到。
`<VERTEX>` 元素的可选 id 属性指定顶点编号。如果省略该属性，则默认按顺序编号。type 属性的默认值为 0。因此，一个更简短但等价的写法是：

    <GRAPH>
    <VERTEX/>
    <VERTEX type="1"/>
    <VERTEX/>
    <VERTEX type="2"/>
    <VERTEX type="2"/>
    <EDGE source="1" target="2"/>
    <EDGE source="2" target="3"/>
    <EDGE source="1" target="4" type="1"/>
    <EDGE source="2" target="5" type="1"/>
    <EDGE source="4" target="5"/>
    </GRAPH>

## 坐标

使用 `<COORDINATE>` 元素为顶点指定空间坐标。以上面的第一个图为例，坐标可以这样指定：

    <GRAPH vertices="5" edges="5">
    <VERTEX id="1"> <COORDINATE> 1 1 </COORDINATE> </VERTEX>
    <VERTEX id="2"> <COORDINATE> 2 1 </COORDINATE> </VERTEX>
    <VERTEX id="3"> <COORDINATE> 3 1 </COORDINATE> </VERTEX>
    <VERTEX id="4"> <COORDINATE> 1 2 </COORDINATE> </VERTEX>
    <VERTEX id="5"> <COORDINATE> 2 2 </COORDINATE> </VERTEX>
    <EDGE source="1" target="2"/>
    <EDGE source="2" target="3"/>
    <EDGE source="1" target="4"/>
    <EDGE source="2" target="5"/>
    <EDGE source="4" target="5"/>
    </GRAPH>

在许多物理模拟中，体系所处的图对应于一个带有晶胞的规则格子。在 ALPS 框架中，可以不必像上面那样手动列出每一个顶点和边，而是通过底层的格子与晶胞来定义这样的图。具体方法将在下一篇 HOWTO——[格子与晶胞](../unitcell)——中介绍。

---

关于本节其余内容的概览，请参见[格子的定义](..)。关于在模拟中选择图所用的 `LATTICE`／`GRAPH` 输入参数，请参见[常用参数](../../parameters)。关于其他 ALPS 文档章节，请参见[简介](../..)。
