
---
title: A Library of Lattices and Graphs
toc: true
weight: 5
---

似たような格子・有限格子・グラフは多くの模型やシミュレーションで繰り返し登場するため、よく使うものを一度だけ「ライブラリ」として定義しておき、（例えばシミュレーションの入力パラメータとして）名前で参照できるようにしておくと便利です。最初のステップは、`<LATTICEGRAPH>` の定義を次の4つの部分に分けることです。

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
    
ここでは、以前に定義しておいた名前付きの格子と単位胞を利用し、それらを `<LATTICEGRAPH>` 要素の中で参照して組み合わせています。ここで、任意の数の `<LATTICE>`、`<FINITELATTICE>`、`<UNITCELL>`、`<GRAPH>`、`<LATTICEGRAPH>` 要素を含むことができる `<LATTICES>` 要素を定義できます。例えば：

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

`anisotropic2d` 単位胞は `simple2d` と同じ構造ですが、2つのボンド方向に異なる辺タイプ（`0` と `1`）を与えています。これにより、模型はそれぞれに異なる結合定数を割り当てることができます――例えば、格子の第1方向には `J0`、第2方向には `J1` というように。

---

このセクションの他の内容の概要については、[格子の定義](..) を参照してください。シミュレーションで格子やグラフを名前で選択するための `LATTICE`／`GRAPH` 入力パラメータについては、[共通パラメータ](../../parameters) を参照してください。他の ALPS ドキュメントのセクションについては、[はじめに](../..) を参照してください。
