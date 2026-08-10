
---
title: 格子基底
toc: true
weight: 3
---

格子モデルの基底は、格子中の各サイト（頂点）タイプごとにサイト基底を与えることで指定します。サイトのタイプが 1 種類しかない場合は、サイト基底を 1 つだけ与えればよく、以前定義した[サイト基底](../sitebasis)を参照することも、その場でインラインに宣言することもできます。

    <BASIS name="spin">
    <SITEBASIS ref="spin"/>
    </BASIS>

    <BASIS name="spin-1">
    <SITEBASIS name="spin-1">
        <QUANTUMNUMBER name="S" min="1" max="1"/>
        <QUANTUMNUMBER name="Sz" min="-1" max="1"/>
    </SITEBASIS>
    </BASIS>

`<SITEBASIS>` と同様、`<BASIS>` 要素も name 属性を持ち、後で `<HAMILTONIAN>` から参照できます（[ハミルトニアンの記述](../hamiltonian)を参照）。`<BASIS>` はすべてのサイトのデフォルトとして使われる `<SITEBASIS>` 要素を 1 つ含みます。これは、最初の例のように ref 属性で以前定義したサイト基底を参照することも、2 番目の例のようにサイト基底全体をインラインで宣言することもできます。（最初の例の `ref="spin"` は、[量子演算子](../operators)で定義されているパラメータ化された `spin` サイト基底を指しており、このページの残りの部分でもこれを使い続けます。）

## 単位胞に複数のサイトを持つ格子

格子の単位胞に複数のサイトが含まれる場合、`<BASIS>` コマンドには単位胞の各サイトに対応する `<SITEBASIS>` エントリを 1 つずつ含める必要があります。各エントリには、格子ライブラリファイル中の定義に対応する異なる type を指定します（[格子定義](../../latticehowtos)を参照）。

以下の基底は、二部格子のヒルベルト空間を表す有効な例です。

    <BASIS name="Kondo lattice">
    <SITEBASIS type="0" ref="fermion"/>
    <SITEBASIS type="1" ref="spin-1/2"/>
    </BASIS>

一部のスピンモデルでは、局所的なサイト基底自体は同じでも、スピンの大きさがサイトのタイプによって異なる場合があります。例えば、パラメータ `local_S0` と `local_S1` によってタイプ 0 とタイプ 1 のサイトのスピンの値を設定しつつ、適切なデフォルト値も用意することができます。

    <BASIS name="spin">
    <SITEBASIS type="0" ref="spin">
        <PARAMETER name="local_spin" value="local_S0"/>
        <PARAMETER name="local_S0" value="local_S"/>
        <PARAMETER name="local_S" value="1/2"/>
    </SITEBASIS>
    <SITEBASIS type="1" ref="spin">
        <PARAMETER name="local_spin" value="local_S1"/>
        <PARAMETER name="local_S1" value="local_S"/>
        <PARAMETER name="local_S" value="1/2"/>
    </SITEBASIS>
    </BASIS>

ここで `local_spin` は、`spin` サイト基底が内部で `S` を設定するために使っているパラメータです（[量子演算子](../operators)を参照）。このデフォルト値の連鎖により、どの段階でもユーザーに妥当なフォールバックが用意されます。何も設定しなければ、両方のサイトタイプは `local_S` によりスピン 1/2 になります。`local_S=1` と設定すれば両方のタイプがスピン 1 になります。あるいは `local_S0`/`local_S1` を直接上書きすれば、2 つのサイトタイプに異なるスピンを持たせることができます。

サイトタイプが増えるとこの書き方は煩雑になるため、ALPS の形式では簡略記法が用意されています。type を指定しなければ、`<SITEBASIS>` は任意のサイトにマッチし、パラメータ名中のワイルドカード文字 `#` はそのサイトのタイプに置き換えられます。これにより、上の例は無限個のサイトタイプに拡張しつつ、次のようにより簡潔に書くことができます。

    <BASIS name="spin">
    <SITEBASIS ref="spin">
        <PARAMETER name="local_spin" value="local_S#"/>
        <PARAMETER name="local_S#" value="local_S"/>
        <PARAMETER name="local_S" value="1/2"/>
    </SITEBASIS>
    </BASIS>

## 制約

最後に、基底はある量子数（全サイトについて和を取ったもの）が固定値を取るセクターに制限することもできます。例えば、スピン基底を全 `Sz` がパラメータ `Sz_total` に等しいセクターに制限するには、`<CONSTRAINT>` 要素を追加します。

    <BASIS name="spin">
    <SITEBASIS ref="spin"/>
    <CONSTRAINT quantumnumber="Sz" value="Sz_total"/>
    </BASIS>

このようにセクターに制限することでヒルベルト空間のサイズが縮小されます。これは、厳密対角化のようにヒルベルト空間全体を直接扱う手法にとって特に重要です。

---

本セクションの他のページの概要については [ALPS モデル定義](..) を参照してください。ここで組み合わされている単一サイトの基底については [サイト基底](../sitebasis) を参照してください。ALPS ドキュメントの他のセクションについては [総合案内](../..) を参照してください。
