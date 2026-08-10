
---
title: ALPS カスタム測定
toc: true
weight: 6
---

## 独自の測定を定義する

お使いの ALPS アプリケーションが標準で行う測定だけでは不十分な場合、パラメータファイル内で独自の測定を直接定義できます。一般的な構文は次のとおりです。

    MEASURE_LOCAL[Name]=Op
    MEASURE_AVERAGE[Name]=Op

ここで `Name` は、その測定が XML 出力中に現れる際の名前であり、`Op` はサイト演算子またはボンド演算子で、あらかじめモデル側で定義されている必要があります —— モデルライブラリに組み込まれている演算子でも、自分で定義した演算子でも構いません（[量子演算子](../modeldef/operators) を参照）。`MEASURE_AVERAGE` は `Op` の量子力学的期待値（有限温度シミュレーションの場合は熱力学的期待値も含む）を測定します。`MEASURE_LOCAL` は格子の各サイトにおける `Op` の期待値を測定します。したがって `Op` は局所的な演算子、すなわちサイト項のみを持ちボンド項を持たない演算子でなければなりません。

    MEASURE_CORRELATIONS[Name]="Op1:Op2"
    MEASURE_CORRELATIONS[Name]=Op

`MEASURE_CORRELATIONS` は、格子上のすべての非等価なサイト対について、演算子 `Op1` と `Op2` の相関を測定します。上の 2 番目の形式 `MEASURE_CORRELATIONS[Name]=Op` は `MEASURE_CORRELATIONS[Name]="Op:Op"` と等価です。現時点では 2 点相関関数のみ計算できるため、`Op1` と `Op2` はどちらもサイト演算子でなければなりません。

    MEASURE_STRUCTURE_FACTOR[Name]=Op

これは演算子 `Op` の構造因子、すなわち対応する相関関数を、シミュレーション格子の運動量固有状態において評価した格子フーリエ変換を測定します。

## どの ALPS アプリケーションがこれをサポートしているか

上記の `MEASURE_LOCAL`/`MEASURE_AVERAGE`/`MEASURE_CORRELATIONS`/`MEASURE_STRUCTURE_FACTOR` という構文は、モデルや格子の XML 処理系そのものが解釈しているわけではありません —— これは各シミュレーションコードが個別に組み込む必要のあるオプション機能であり、実際にサポートしているのは ALPS アプリケーションの一部にすぎません。

| アプリケーション | サポート状況 |
| :---------- | :------ |
| `loop`（ループ / ディレクテッドループアルゴリズム） | 完全サポート |
| `worm`（[ワームアルゴリズム](../../methods/qmc/worm)） | 完全サポート |
| `sse`、`sse2`、`sse4`（[確率級数展開](../../methods/qmc/sse)） | 完全サポート |
| `dwa`（ディレクテッドワームアルゴリズム） | 完全サポート |
| `fulldiag`（完全対角化） | 完全サポート |
| `dmrg`（[従来の単一ブロック DMRG](../../methods/dmrg/dmrg)） | 完全サポート |
| `sparsediag`（[疎行列 / Lanczos 対角化](../../methods/ed/sparsediag)） | 非サポート —— モデル自体に組み込まれた物理量（エネルギー、量子数）のみ取得可能 |
| `qwl`（量子 Wang-Landau 法） | 非サポート —— 専用の `MEASURE_MAGNETIC_PROPERTIES` フラグを持つ |
| `checksign` | 非サポート |
| `mps_optim`/`mps_meas`（行列積状態 DMRG） | 独自に実装された、より豊富な構文を持つ —— 詳細は後述 |

上表で「完全サポート」と記載されているコード（`loop`、`worm`、`sse`/`sse2`/`sse4`、`dwa`、`fulldiag`、`dmrg`）については、指定した `Name` がそのコードに組み込みの観測量名（例: `Local Density`、`Spin Correlations`）と衝突する場合、独自の測定は黙って無視され、組み込みの測定が優先されます（標準エラー出力に注意メッセージが出力されます）。そのため、独自の測定には他と重複しない名前を付けてください。

行列積状態 DMRG コード（`mps_optim`/`mps_meas`）は、このページで説明した仕組みを一切使用していません。代わりに独自に実装されたバージョンを持ち、上記と同じ意味で `MEASURE_LOCAL`、`MEASURE_AVERAGE`、`MEASURE_CORRELATIONS` を受け付けるほか、ALPS の他のどこにも存在しないいくつかの拡張機能を備えています: `MEASURE_HALF_CORRELATIONS`（`MEASURE_CORRELATIONS` と同様ですが、演算子の順序を入れ替えません）、`MEASURE_LOCAL_AT`（明示的に指定した任意のサイトの組に対して演算子の列を作用させます）、そして `MEASURE[EnergyVariance]`、`MEASURE[Entropy]`、`MEASURE[Renyi2]` のような真偽値フラグです。

コードごとにサポート状況が大きく異なるため、これらの構文に頼る前には、必ず使用するアプリケーションのパラメータリファレンスやチュートリアルを確認してください。

## その他のテクニックと回避策

QMC コードで非対角量を測定することは一般に自明ではなく、汎用的な方法で実装するのは困難です。お使いの QMC プログラムが希望する測定を拒否する場合、ソースコードを修正する必要があるかもしれません。

しかし、場合によってはいくつかのテクニックを使うことができます。よく使われるテクニックの一つは、モデルのサイト基底を拡張することです。例を挙げましょう。不均一格子上で Bose-Hubbard モデルを worm コードでシミュレートしており、局所密度分布の 2 次モーメント $\langle n_i^2\rangle$ を測定したいとします。worm コードはサイト基底上で直接動作しないため、このような演算子に対する測定をそのままでは行えません。一つの解決策は、Bose-Hubbard ハミルトニアンが用いる `boson` サイト基底にパッチを当て、密度の二乗を表す演算子 `n2` を追加することです。

    <SITEBASIS name="boson">
    <PARAMETER name="Nmax" default="infinity"/>
    <QUANTUMNUMBER name="N" min="0" max="Nmax"/>
    <OPERATOR name="bdag" matrixelement="sqrt(N+1)">
        <CHANGE quantumnumber="N" change="1"/>
    </OPERATOR>
    <OPERATOR name="b" matrixelement="sqrt(N)">
        <CHANGE quantumnumber="N" change="-1"/>
    </OPERATOR>
    <OPERATOR name="n" matrixelement="N"/>
    <OPERATOR name="n2" matrixelement="N*N"/>   <!-- added -->
    </SITEBASIS>

このパッチを適用すれば、通常どおり対応する測定を定義できます。例えば:

    MEASURE_LOCAL[Local density squared]="n2"
    MEASURE_CORRELATIONS[Density squared, correlations]="n2:n2"

---

上で使用した演算子の定義方法については [量子演算子](../modeldef/operators) を参照してください。モデル定義全般の概要については [ALPS モデル定義](../modeldef) を参照してください。ALPS ドキュメントの他のセクションについては [総合案内](..) を参照してください。
