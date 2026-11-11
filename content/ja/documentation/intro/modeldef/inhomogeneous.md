---
title: 位置に依存する結合
math: true
toc: true
weight: 6
---

通常の ALPS の格子では、モデルの各結合（`mu`、`t`、`J`、`h` など）は 1 つの値しか持たず、すべてのサイト、または同じタイプのすべてのボンドで同じ値が使われます。しかし多くの問題では、場所によって変わる結合が必要になります。化学ポテンシャルの調和トラップや線形な傾き、勾配のある磁場、ランダムなポテンシャルなどです。ALPS はこれを 2 つの要素で扱います。

1. **非均質格子**：サイト項（またはボンド項）をサイトごと（またはボンドごと）に個別に評価するよう ALPS に指示します。
2. **パラメータの式**：そのサイトまたはボンドの座標 `x`、`y`、`z`、あるいは乱数を使って値を書きます。

モデル自体を変更する必要はありません。`models.xml` の組み込みモデルをそのまま使えます。

## 最初の例

次のパラメータファイルは、6 サイトの鎖上のハードコアボソンに線形ポテンシャル $\mu(x) = \mu_\text{left} - s\,x$ をかけます。

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

いつもどおりに実行します。例えば

```bash
parameter2xml parm_tilt
dirloop_sse parm_tilt.in.xml
```

`Local Density` の測定結果では、密度が鎖の左端（$x=0$）から右端（$x=5$）に向かって減少します。

`mu` の値を引用符で囲んでいるのは、数ではなく式だからです。この式はサイトごとに 1 回評価され、そのとき `x` にはそのサイトの座標が入ります。式からは他のパラメータ（ここでは `mu_left` と `slope`）を参照できます。

{{< callout type="warning" >}}
補助パラメータの名前は慎重に選んでください。ほとんどの組み込みモデルは、`mu0`、`t0`、`V0`、`J1` のようなタイプごとの結合も読み込みます（[ハミルトニアンの記述](../hamiltonian)の `#` ワイルドカードを参照）。これらの名前のパラメータは、該当するタイプのサイトまたはボンドで `mu`、`t`、`V`、`J` を黙って置き換えます。上の例で `mu_left` と `slope` の代わりに `mu0` と `V0` を使っていたら、`mu0=1` がすべてのサイトで傾いた `mu` を上書きし、`V0=0.4` が最近接斥力を有効にしてしまいます。エラーも警告も出ません。
{{< /callout >}}

## 非均質格子

`<LATTICEGRAPH>` が `<INHOMOGENEOUS>` 要素を含む格子は非均質格子です。格子ライブラリ `lattices.xml` には、すでに次の 4 つが含まれています。

| `LATTICE` | パラメータ | 非均質な部分 |
| :-------- | :--------- | :----------- |
| `inhomogeneous chain lattice` | `L` | サイト |
| `inhomogeneous square lattice` | `L`、`W`（デフォルト `L`） | サイト |
| `inhomogeneous simple cubic lattice` | `L`、`W`（デフォルト `L`）、`H`（デフォルト `W`） | サイト |
| `inhomogeneous anisotropic square lattice` | `L`、`W`（デフォルト `L`） | サイト |

4 つとも開放境界で、位置に依存するのはサイト項だけです。

自分で定義した格子を非均質にするには、`<UNITCELL>` の後にこの要素を加えます。

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

`<VERTEX/>` はサイト項を、`<EDGE/>` はボンド項を位置に依存させます。どちらか一方だけでも、両方でも使えます。これらはすべてのサイトまたはすべてのボンドに適用され、`type` 属性で特定のタイプに限定することはできません。[ボースグラス](../../../methods/qmc/boseglass)のページでは、同じ要素を使って正方格子に周期境界を与えています。

{{< callout type="info" >}}
`LATTICE_LIBRARY` で指定したファイルは、組み込みの `lattices.xml` に追加されるのではなく、それを置き換えます。そのため、上の例のように `chain lattice` や `simple1d` を参照する定義では、それらの定義も同じファイルに入れる必要があります。いちばん簡単なのは、`lattices.xml` をコピーして、そのコピーに自分の格子を追加する方法です。`printgraph`（[格子グラフの確認](../../latticehowtos/checklattice)を参照）を使うと、結果のサイト、ボンド、座標を表示できます。
{{< /callout >}}

## 式の中の座標

非均質格子では、式の中で次の変数を使えます。

| 変数 | サイト項の中 | ボンド項の中 |
| :--- | :----------- | :----------- |
| `x` | サイトの第 1 座標 | ボンドの中点の第 1 座標 |
| `y` | 第 2 座標（2 次元・3 次元格子） | ボンドの中点の第 2 座標 |
| `z` | 第 3 座標（3 次元格子） | ボンドの中点の第 3 座標 |

座標は、その格子に対して `printgraph` が出力するものと同じです。鎖、正方格子、単純立方格子では整数の単位胞の位置で、第 1 方向に 0 から `L-1` までの値をとります。したがって、`L`$\times$`L` 正方格子の中心に置いたトラップは次のように書けます。

```
LATTICE="inhomogeneous square lattice"
L=10
mu="4 - 0.2*((x-(L-1)/2)^2 + (y-(L-1)/2)^2)"
```

ボンド項ではボンドの中点が使われます。鎖の上で $x=2$ と $x=3$ のサイトを結ぶボンドは `x=2.5` となるので、格子に `<EDGE/>` を加えたうえで

```
J="1 + 0.2*x"
```

とすると、そのボンドの $J$ は $1.5$ になります。

同じ変数はモデルの定義の中でも使えます。例えば次の `<HAMILTONIAN>` は傾きをモデルに組み込んでいるので、パラメータファイルでは `mu` と `slope` を設定するだけで済みます。

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

`LATTICE_LIBRARY` と同様に、`MODEL_LIBRARY` で指定したファイルは組み込みの `models.xml` を置き換えるので、新しいハミルトニアンは `models.xml` のコピーに追加してください。

よくあるエラーは次の 2 つです。

- `<INHOMOGENEOUS>` のない格子では座標が定義されておらず、プログラムは `Cannot evaluate expression ...` に続けて座標を使った式を出力して停止します。
- 非均質格子では `x`、`y`、`z` は予約されています。そのどれかをパラメータとして定義すると、プログラムは `x, y or z is predefined as parameter and used as coordinate` を出力して停止します。

## 関数と演算子

式では `+`、`-`、`*`、`/`、`^`（べき乗）と括弧、定数 `Pi`（`PI` や `pi` とも書けます）、および次の関数を使えます。

| 関数 | 意味 |
| :--- | :--- |
| `sqrt(a)`、`abs(a)` | 平方根、絶対値 |
| `exp(a)`、`log(a)` | 指数関数、自然対数 |
| `sin(a)`、`cos(a)`、`tan(a)` | 三角関数（ラジアン） |
| `asin(a)`、`acos(a)`、`atan(a)` | 逆三角関数 |
| `atan2(y, x)` | 点 $(x, y)$ の偏角 |
| `random()` | $[0, 1)$ の一様乱数 |
| `gaussian_random()` | 平均 0、標準偏差 1 の正規乱数 |
| `gaussian_random(m, s)` | 平均 `m`、標準偏差 `s` の正規乱数 |
| `integer_random(n)` | 0 から `n-1` までのランダムな整数 |

`normal_random` は `gaussian_random` の別名です。

## ランダムな乱れ

非均質格子では、乱数関数はサイトごと（またはボンドごと）に個別に評価されます。したがって

```
mu="delta*(2*random() - 1)"
```

とすると、各サイトが `-delta` から `delta` の間に一様に分布する独自の化学ポテンシャルを持ちます。

これらの乱数は専用の乱数生成器から作られ、そのシードは `DISORDERSEED`（デフォルト 0）です。このシードは、モンテカルロ更新のシード `SEED` とは独立しています。そのため、`DISORDERSEED` が同じ実行は、`SEED` が違っていても同じ乱れを見ます。乱れについて平均をとるには、各実現の `DISORDERSEED` を `{ }` ブロックで指定します。すると各実現が別々のタスクになります。

```
{ DISORDERSEED = 34275; }
{ DISORDERSEED = 49802; }
{ DISORDERSEED = 82529; }
```

その後、各タスクの結果を平均します。完全な例は[ボースグラス](../../../methods/qmc/boseglass)のページにあります。

## 対応しているプログラム

位置に依存する結合は、厳密対角化のプログラム（`sparsediag`、`fulldiag`）、`dmrg`、および量子モンテカルロのプログラム（`dirloop_sse`、`loop`、`worm`）で使えます。[光格子中のボソン](../../../methods/qmc/bhol)のページでは、`dirloop_sse` を使って 3 次元トラップ中のボソンをシミュレーションしています。

### `worm` にはグラフではなく格子が必要

格子ライブラリの `GRAPH`（単位胞を持たない、頂点と辺のリスト）は `dirloop_sse` や厳密対角化のプログラムでは使えますが、`worm` では使えません。`worm` は次のメッセージを出して停止します。

```
Cannot save a measurement of size 0.
```

1 つの三角形のような小さなクラスターで `worm` を実行するには、そのクラスターを開放境界の格子の単位胞として記述し、`L=1` とします。`lattices.xml` の `Kagome` 単位胞は 3 サイトの三角形なので、

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

に `LATTICE="open kagome lattice"` と `L=1` を組み合わせると、`worm` が受け付ける三角形になります。さらに `<INHOMOGENEOUS><VERTEX/></INHOMOGENEOUS>` を加えれば、結合も位置に依存させられます。

---

これらのパラメータが入るハミルトニアンの項については[ハミルトニアンの記述](../hamiltonian)を、格子と単位胞の定義については[格子の定義](../../latticehowtos)を、ALPS のプログラムに共通するその他のパラメータについては[共通パラメータ](../../parameters)を参照してください。
