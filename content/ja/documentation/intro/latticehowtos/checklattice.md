
---
title: Check Lattice Graph
toc: true
weight: 6
---

新しい格子定義を書いたら、実際のシミュレーションを実行する前に、それが正しいかどうかを確認したいはずです。ALPS はこのための `printgraph` というツールを提供しています。このツールはパラメータファイルを読み込み、そこで指定された `LATTICE`（あるいは `GRAPH`）からグラフを構築します――これは ALPS アプリケーションが内部で行うのとまったく同じ方法です――そして得られたグラフを `<GRAPH>` XML として出力し、すべての `<VERTEX>` と `<EDGE>` を列挙します。この出力を意図したものと比較することで、範囲の誤り、ボンドの欠落、境界条件の誤りといったミスを素早く見つけることができます。

実行するには、次のように入力します。

    printgraph parameter_file

`parameter_file` は通常の ALPS パラメータファイルです――`parameter2xml` への入力と同じ形式なので、事前に変換する必要はありません。ファイル名を指定しない場合、`printgraph` は標準入力からパラメータファイルを読み込みます。ファイル名が `.xml` で終わる場合は、XML パラメータファイルとして読み込まれます。

例えば、次のパラメータファイル

    LATTICE = "square lattice"
    L = 2

は、組み込みの `square lattice`（[格子とグラフのライブラリ](../library) を参照）を、2 x 2 の周期的な広がりで選択します。これに対して `printgraph` を実行すると、次のような出力が得られます。

    <GRAPH dimension="2" vertices="4" edges="8">
      <VERTEX id="1" type="0"><COORDINATE>0 0</COORDINATE></VERTEX>
      <VERTEX id="2" type="0"><COORDINATE>0 1</COORDINATE></VERTEX>
      <VERTEX id="3" type="0"><COORDINATE>1 0</COORDINATE></VERTEX>
      <VERTEX id="4" type="0"><COORDINATE>1 1</COORDINATE></VERTEX>
      <EDGE source="1" target="2" id="1" type="0" vector="0 1"/>
      <EDGE source="1" target="3" id="2" type="0" vector="1 0"/>
      <EDGE source="2" target="1" id="3" type="0" vector="0 1"/>
      <EDGE source="2" target="4" id="4" type="0" vector="1 0"/>
      <EDGE source="3" target="4" id="5" type="0" vector="0 1"/>
      <EDGE source="3" target="1" id="6" type="0" vector="1 0"/>
      <EDGE source="4" target="3" id="7" type="0" vector="0 1"/>
      <EDGE source="4" target="2" id="8" type="0" vector="1 0"/>
    </GRAPH>

4つのサイトそれぞれが座標付きの `<VERTEX>` として、8本のボンドそれぞれが `<EDGE>` として1回ずつ現れます。周期境界条件により、「まっすぐな」ボンドに加えて、折り返しのボンド（例えば `source="2" target="1"`）も生成されています。大きな、あるいは見慣れない格子の場合は、出力をファイルにリダイレクトすると（`printgraph parameter_file > graph.xml`）確認しやすくなります。

---

このセクションの他の内容の概要については、[格子の定義](..) を参照してください。シミュレーションで格子やグラフを名前で選択するための `LATTICE`／`GRAPH` 入力パラメータについては、[共通パラメータ](../../parameters) を参照してください。他の ALPS ドキュメントのセクションについては、[はじめに](../..) を参照してください。
