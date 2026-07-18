
---
title: Simple Graphs
toc: true
weight: 2
---

ここでは、単純なグラフを XML 形式でどのように表現するかを説明します。すべての頂点と辺を明示的に指定します。

## 単純グラフ

最初の例として、次の5個の頂点と5本の辺から成る単純なグラフを考えます。

![The first simple graph.](../figs/tutoriallatticehowtograph1.gif)

このグラフは次のように XML で指定します。`<GRAPH>` 要素の edges 属性は、`<EDGE>` 要素の数を数えることで辺の数がわかるため省略可能です。

    <GRAPH vertices="5" edges="5">
    <EDGE source="1" target="2"/>
    <EDGE source="2" target="3"/>
    <EDGE source="1" target="4"/>
    <EDGE source="2" target="5"/>
    <EDGE source="4" target="5"/>
    </GRAPH>

`vertices` と `edges` が省略可能になる条件は異なる点に注意してください。`edges` は単なる情報提供であり、実際の `<EDGE>` 要素の数と一致している必要はありません。一方 `vertices` は、その時点で頂点の数を確定させるため、すべての頂点が明示的な `<VERTEX>` 要素によって導入されている場合にしか省略できません。上のグラフには `<VERTEX>` 要素が一つもないため、`edges="5"` とは異なり `vertices="5"` は必須です。より一般に、`<EDGE>` がある頂点を参照する前に、その頂点が `vertices` あるいはそれ以前の `<VERTEX>` 要素によって既に認識されていることを確認してください。

## 色付きグラフ

辺や頂点に色を付けたグラフも表現できます。

![A graph with colored edges and vertices.](../figs/tutoriallatticehowtograph2.jpg)

このグラフを XML で表現するには、頂点を記述するための `<VERTEX>` 要素を追加し、頂点と辺の種類（色）を指定するための type 属性を用います。この例では、頂点タイプ 0、1、2 はそれぞれ赤・緑・青の頂点を表し、辺タイプ 0 と 1 はそれぞれ実線・破線を表します。

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

この例では、vertices 属性と edges 属性はどちらも、それぞれ `<VERTEX>` 要素と `<EDGE>` 要素の数を数えることでわかるため省略可能です。
`<VERTEX>` 要素の任意の id 属性は頂点番号を指定します。省略された場合は連番が仮定されます。type 属性の既定値は 0 です。したがって、より短いが等価な記述は次のようになります。

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

## 座標

頂点に空間座標を指定するには `<COORDINATE>` 要素を使います。上の最初のグラフを例にすると、座標は次のように指定できます。

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

多くの物理シミュレーションでは、系は単位胞を持つ規則的な格子に対応するグラフの上に存在します。ALPS フレームワークでは、上で行ったようにすべての頂点と辺を手で列挙する代わりに、その背後にある格子と単位胞の言葉でこのようなグラフを指定することができます。その方法は、次の HOWTO である [格子と単位胞](../unitcell) で説明します。

---

このセクションの他の内容の概要については、[格子の定義](..) を参照してください。シミュレーションでグラフを選択するための `LATTICE`／`GRAPH` 入力パラメータについては、[共通パラメータ](../../parameters) を参照してください。他の ALPS ドキュメントのセクションについては、[はじめに](../..) を参照してください。
