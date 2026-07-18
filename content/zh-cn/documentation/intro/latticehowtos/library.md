
---
title: A Library of Lattices and Graphs
toc: true
weight: 5
---

由于相似的格子、有限格子和图会在许多模型和模拟中反复出现，把常用的那些定义一次，放进一个“库”里，然后通过名字来引用它们（例如作为模拟的输入参数），会更加方便。第一步是把 `<LATTICEGRAPH>` 的定义拆分成四个部分：

    <LATTICE name="square" dimension="2">
    <BASIS>
        <VECTOR> 1 0 </VECTOR>
        <VECTOR> 0 1 </VECTOR>
    </BASIS>
    </LATTICE>

    <FINITELATTICE name="rectangular periodic" dimension="2">
    <LATTICE ref="square"/>
    <PARAMETER name="L" />
    <PARAMETER name="W" default="L" />
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
    
这里我们利用了之前定义好的、带名字的格子和晶胞（例如来自某个库），然后通过在 `<LATTICEGRAPH>` 元素中引用它们，把它们组合起来。现在我们可以定义一个 `<LATTICES>` 元素，它可以包含任意数量的 `<LATTICE>`、`<FINITELATTICE>`、`<UNITCELL>`、`<GRAPH>` 和 `<LATTICEGRAPH>` 元素。例如：

    <LATTICES>
    <LATTICE name="chain lattice" dimension="1">
    <BASIS><VECTOR>1</VECTOR></BASIS>
    </LATTICE>
    <LATTICE name="square lattice" dimension="2">
    <PARAMETER name="a" default="1"/>
    <BASIS><VECTOR>a 0</VECTOR><VECTOR>0 a</VECTOR></BASIS>
    </LATTICE>
    <LATTICE name="simple cubic lattice" dimension="3">
    <PARAMETER name="a" default="1"/>
    <BASIS>
        <VECTOR>a 0 0</VECTOR>
        <VECTOR>0 a 0</VECTOR>
        <VECTOR>0 0 a</VECTOR>
    </BASIS>
    </LATTICE>
    <UNITCELL name="simple1d" dimension="1">
    <VERTEX/>
    <EDGE><SOURCE vertex="1" offset="0"/><TARGET vertex="1" offset="1"/></EDGE>
    </UNITCELL>
    <UNITCELL name="simple2d" dimension="2">
    <VERTEX/>
    <EDGE><SOURCE vertex="1" offset="0 0"/><TARGET vertex="1" offset="0 1"/></EDGE>
    <EDGE><SOURCE vertex="1" offset="0 0"/><TARGET vertex="1" offset="1 0"/></EDGE>
    </UNITCELL>
    <UNITCELL name="anisotropic2d" dimension="2">
    <VERTEX/>
    <EDGE type="0"><SOURCE vertex="1" offset="0 0"/><TARGET vertex="1" offset="1 0"/></EDGE>
    <EDGE type="1"><SOURCE vertex="1" offset="0 0"/><TARGET vertex="1" offset="0 1"/></EDGE>
    </UNITCELL>
    <UNITCELL name="simple3d" dimension="3" vertices="1">
    <VERTEX/>
    <EDGE><SOURCE vertex="1"/><TARGET vertex="1" offset="1 0 0"/></EDGE>
    <EDGE><SOURCE vertex="1"/><TARGET vertex="1" offset="0 1 0"/></EDGE>
    <EDGE><SOURCE vertex="1"/><TARGET vertex="1" offset="0 0 1"/></EDGE>
    </UNITCELL>
    <LATTICEGRAPH name = "square lattice 3x3">
    <FINITELATTICE>
        <LATTICE ref="square lattice"/>
        <EXTENT dimension="1" size="3"/>
        <EXTENT dimension="2" size="3"/>
        <BOUNDARY dimension="1" type="periodic"/>
        <BOUNDARY dimension="2" type="open"/>
    </FINITELATTICE>
    <UNITCELL ref="simple2d"/>
    </LATTICEGRAPH>
    <LATTICEGRAPH name = "dimer">
    <FINITELATTICE>
        <LATTICE ref="chain lattice"/>
        <EXTENT dimension="1" size="2"/>
        <BOUNDARY type="open"/>
    </FINITELATTICE>
    <UNITCELL ref="simple1d"/>
    </LATTICEGRAPH>
    <LATTICEGRAPH name = "simple cubic lattice">
    <FINITELATTICE>
        <LATTICE ref="simple cubic lattice"/>
        <PARAMETER name="W" default="L"/>
        <PARAMETER name="H" default="W"/>
        <EXTENT dimension="1" size="L"/>
        <EXTENT dimension="2" size="W"/>
        <EXTENT dimension="3" size="H"/>
        <BOUNDARY type="periodic"/>
    </FINITELATTICE>
    <UNITCELL ref="simple3d"/>
    </LATTICEGRAPH>
    <LATTICEGRAPH name = "chain lattice">
    <FINITELATTICE>
        <LATTICE ref="chain lattice"/>
        <EXTENT dimension="1" size ="L"/>
        <BOUNDARY type="periodic"/>
    </FINITELATTICE>
    <UNITCELL ref="simple1d"/>
    </LATTICEGRAPH>
    <LATTICEGRAPH name = "anisotropic square lattice">
    <FINITELATTICE>
        <LATTICE ref="square lattice"/>
        <PARAMETER name="W" default="L"/>
        <EXTENT dimension="1" size="L"/>
        <EXTENT dimension="2" size="W"/>
        <BOUNDARY type="periodic"/>
    </FINITELATTICE>
    <UNITCELL ref="anisotropic2d"/>
    </LATTICEGRAPH>
    </LATTICES>

`anisotropic2d` 晶胞的结构与 `simple2d` 相同，但为两个键方向赋予了不同的边类型（`0` 和 `1`），这样模型就可以为每个方向分配不同的耦合——例如，格子的第一个方向使用 `J0`，第二个方向使用 `J1`。

---

关于本节其余内容的概览，请参见[格子的定义](..)。关于在模拟中按名称选择格子或图所用的 `LATTICE`／`GRAPH` 输入参数，请参见[常用参数](../../parameters)。关于其他 ALPS 文档章节，请参见[简介](../..)。
