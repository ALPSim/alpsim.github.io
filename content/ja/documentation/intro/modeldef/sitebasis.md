
---
title: サイト基底
toc: true
weight: 2
---

単一サイトの基底状態は、1 つ以上の量子数によって記述されます。例えば次のとおりです。

    <SITEBASIS name="hardcore boson">
    <QUANTUMNUMBER name="N" min="0" max="1"/>
    </SITEBASIS>

    <SITEBASIS name="spin-1/2">
    <QUANTUMNUMBER name="S" min="1/2" max="1/2"/>
    <QUANTUMNUMBER name="Sz" min="-1/2" max="1/2"/>
    </SITEBASIS>

    <SITEBASIS name="fermion">
    <QUANTUMNUMBER name="Nup" min="0" max="1" type="fermionic"/>
    <QUANTUMNUMBER name="Ndown" min="0" max="1" type="fermionic"/>
    </SITEBASIS>

上の最初の例はハードコアボソン（占有数が 0 または 1 に制限された 1 つのボソンモード）を、2 番目はスピン 1/2 を、3 番目は二重占有を許すスピンを持つフェルミオン（独立な `Nup` と `Ndown` がそれぞれ 0 または 1 を取る）を表しています。

上のスピン 1/2 の例では、`Sz` だけですでに 2 つの状態を区別できるにもかかわらず、`S` と `Sz` の両方が宣言されている点に注意してください。全スピン `S` を別途必要とするのは、[量子演算子](../operators)で定義されるスピン演算子の行列要素の中にそれが現れるためです。

`<SITEBASIS>` には name 属性があり、後でこれを使って参照できます。各 `<QUANTUMNUMBER>` 要素には name 属性があり、min 属性と max 属性で最小値・最大値を指定します。量子数は min、min+1、min+2、…、max までの値を取ることができます。また、オプションとして type 属性に bosonic（ボソン的、デフォルト）または fermionic（フェルミオン的）を設定できます。この量子数がフェルミオン的自由度（例えばフェルミオンの占有数）を数えるものである場合には fermionic に設定すべきです。そうすることで、そこから作られる演算子が他のサイトのフェルミオン演算子と正しく反交換するようになります。

量子数の取りうる範囲は入力パラメータによってパラメータ化でき、次のように `default` を指定することもできます。

    <SITEBASIS name="boson">
    <PARAMETER name="Nmax" default="infinity"/>
    <QUANTUMNUMBER name="N" min="0" max="Nmax"/>
    </SITEBASIS>

t-J モデルのようなより複雑なモデルでは、複数の等価な量子数の選び方が存在することがあります。状態を粒子数とスピンでラベル付けすることも、アップスピンとダウンスピンの数でラベル付けすることもできます。

    <SITEBASIS name="t-J">
    <QUANTUMNUMBER name="N" min="0" max="1" type="fermionic"/>
    <QUANTUMNUMBER name="S" min="N/2" max="N/2"/>
    <QUANTUMNUMBER name="Sz" min="-S" max="S"/>
    </SITEBASIS>

    <SITEBASIS name="alternative t-J">
    <QUANTUMNUMBER name="Nup" min="0" max="1" type="fermionic"/>
    <QUANTUMNUMBER name="Ndown" min="0" max="1-Nup" type="fermionic"/>
    </SITEBASIS>

最初のバージョンでは、`min="N/2" max="N/2"` によって `S` が自由に取りうる値ではなく厳密に `N/2` に固定されます。空のサイト（`N=0`）は必ず `S=0` となり、単一占有のサイト（`N=1`）は必ず `S=1/2` となります。これはまさに t-J モデルを定義する「二重占有禁止」の制約そのものです。この 2 つのサイト基底は、同じ 3 つの物理的な状態（空、アップスピン、ダウンスピン）を記述しており、どちらも同様に有効です。どちらがより便利かはハミルトニアンによります。全スピンが有用な量子数である場合は `N`、`S` 基底が自然であり、[量子演算子](../operators)の `fermion_hop` の例にある `cdag_up`/`c_up` のように、アップスピンとダウンスピンのフェルミオンにそれぞれ作用する演算子を書く場合には `Nup`、`Ndown` 基底の方がしばしば簡単です。

---

本セクションの他のページの概要については [ALPS モデル定義](..) を参照してください。単一サイトの基底が格子全体の基底へどのように組み合わされるかについては [格子基底](../latticebasis) を参照してください。ALPS ドキュメントの他のセクションについては [総合案内](../..) を参照してください。
