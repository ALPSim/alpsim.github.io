
---
title: Lattices and Graphs
toc: true
weight: 4
---

これまでの HOWTO では、任意のグラフを直接記述する方法と、単位胞とその基底ベクトルを通じて格子の幾何学的構造を記述する方法を示しました。ここでは両者を組み合わせます：格子の単位胞の各コピーに小さなグラフを装飾し、実際にシミュレーションされるグラフを作り上げます。

## 単純なグラフ

多くの物理シミュレーションにおけるグラフは不規則なものではなく、格子のように規則的に組み立てられています。

![The first simple graph.](../figs/tutoriallatticehowtolatticegraph1.gif)

このグラフの規則性は、格子の上に配置することで捉えることができます。

![The graph on a lattice.](../figs/tutoriallatticehowtolatticegraph2.gif)

この格子は単位胞によって記述でき、単位胞の各コピーを同じ「単位胞グラフ」で装飾することで、グラフ全体が組み立てられます。

![Unit cell graph.](../figs/tutoriallatticehowtolatticegraph3.gif)

ここでの単位胞グラフは単一の頂点から成り、隣のセルにある同じ頂点への辺を持ちます。このような格子上のグラフは、`<LATTICE>` あるいは `<FINITELATTICE>` と、単位胞上のグラフを記述する `<UNITCELL>` 要素を組み合わせることで、XML で記述できます。この単位胞から全体のグラフが作られます。

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
  
単位胞内の辺は、セル内の頂点1から、右隣のセルの頂点1へと（オフセット +1 で）向かっています。これは `<EDGE>` 要素で記述されています。`<SOURCE>` 要素のオフセット 0 は省略されていますが、これはそれが既定値だからです。

無限鎖を記述するには、`<FINITELATTICE>` の代わりに `<LATTICE>` 要素を使います。

## 複雑な例

色付きの辺や頂点を記述したり、頂点に座標のような他の属性を追加したりすることも、これまでと同様に可能です。また、`<LATTICEGRAPH>` の格子部分では、[格子と単位胞](../unitcell) で説明した仕組み――有限の広がり、境界条件、既に定義済みの格子の参照など――をすべて利用できます。ここでは、L × W の長方形格子上の複雑な周期的グラフの例を示します。

![A complex periodic graph on a lattice.](../figs/tutoriallatticehowtolatticegraph4.jpg)

この格子上のグラフは、長方形格子を装飾する次のような複雑な単位胞グラフから作ることができます。

![A complex graph in a unit cell.](../figs/tutoriallatticehowtolatticegraph5.jpg)

XML による記述は次の通りです。

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
    
ここでは、（例えばライブラリの中で）以前に定義しておいた名前付きの格子と単位胞を利用し、それらを `<LATTICEGRAPH>` 要素の中で参照して組み合わせています。あるいは、すべてを `<LATTICEGRAPH>` 要素の中で定義することもできます。

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
  
単位胞内の頂点の座標と、格子の基底ベクトルの両方が与えられているため、すべての頂点の座標を計算することができます。

---

このセクションの他の内容の概要については、[格子の定義](..) を参照してください。シミュレーションでグラフを選択するための `LATTICE`／`GRAPH` 入力パラメータについては、[共通パラメータ](../../parameters) を参照してください。他の ALPS ドキュメントのセクションについては、[はじめに](../..) を参照してください。
