
---
title: 量子演算子
toc: true
weight: 4
---

## 単純なサイト演算子

ハミルトニアンの演算子を組み立てる基本的な量子演算子は、名前、行列要素、そして（オプションで）その演算子が量子数に引き起こす変化によって指定されます。これらの演算子はサイト基底の中で定義されます。例えば次のとおりです。

    <SITEBASIS name="spin">
    <PARAMETER name="local_spin" default="1/2"/>
    <QUANTUMNUMBER name="S" min="local_spin" max="local_spin"/>
    <QUANTUMNUMBER name="Sz" min="-S" max="S"/>

    <OPERATOR name="Splus" matrixelement="sqrt(S*(S+1)-Sz*(Sz+1))">
        <CHANGE quantumnumber="Sz" change="1"/>
    </OPERATOR>

    <OPERATOR name="Sminus" matrixelement="sqrt(S*(S+1)-Sz*(Sz-1))">
        <CHANGE quantumnumber="Sz" change="-1"/>
    </OPERATOR>

    <OPERATOR name="Sz" matrixelement="Sz"/>
    </SITEBASIS>

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
    </SITEBASIS>

    <SITEBASIS name="fermion">
    <QUANTUMNUMBER name="Nup" min="0" max="1" type="fermionic"/>
    <QUANTUMNUMBER name="Ndown" min="0" max="1" type="fermionic"/>

    <OPERATOR name="cdag_up" matrixelement="1">
        <CHANGE quantumnumber="Nup" change="1"/>
    </OPERATOR>

    <OPERATOR name="c_up" matrixelement="1">
        <CHANGE quantumnumber="Nup" change="-1"/>
    </OPERATOR>

    <OPERATOR name="cdag_down" matrixelement="1">
        <CHANGE quantumnumber="Ndown" change="1"/>
    </OPERATOR>

    <OPERATOR name="c_down" matrixelement="1">
        <CHANGE quantumnumber="Ndown" change="-1"/>
    </OPERATOR>
    </SITEBASIS>

`bdag`/`b` とは異なり、フェルミオン的な生成・消滅演算子 `cdag_up`/`c_up` の行列要素は平方根ではなく単なる `1` です。これは `Nup` が 0 と 1 の 2 つの値しか取らないためです。`<QUANTUMNUMBER>` 自身の `max="1"` によってすでに二重占有が禁止されているため、占有数に依存する係数は不要です。`Nup`/`Ndown` を `type="fermionic"` として宣言すること（[サイト基底](../sitebasis)で説明済み）が、これらの演算子を他のサイトのフェルミオン演算子と正しく反交換させる理由であり、まさにこれによって下記の `fermion_hop` ボンド演算子で `cdag_up`/`c_up` を組み合わせることができます。

オプションの `<CHANGE>` 要素は、その演算子を作用させると指定された量子数が指定量だけ変化することを表します —— `Splus` は `Sz` を 1 だけ増やし、`Sminus` は 1 だけ減らし、`bdag`/`b` は `N` を 1 だけ増減させます。上の `Sz` や `n` のように `<CHANGE>` 要素を持たない演算子は対角的であり、すべての量子数を変化させません。行列要素の表記の中では、量子数の名前（この例では `S`、`Sz`、`N`）を使ってその値を参照できます —— これは常に `<CHANGE>` が適用される前の*初期*状態の値で評価されます。

## 複合サイト演算子

量子数を一意に変化させる単純なサイト演算子に加えて、例えば `Sx` スピン演算子のような、より複雑なサイト演算子を組み立てることもできます。

    <SITEOPERATOR name="Sx" site="i">
    1/2*(Splus(i)+Sminus(i))
    </SITEOPERATOR>

あるいは、ボーズ・ハバードハミルトニアンのオンサイト相互作用項などで使われる、オンサイトのボソン対を数える演算子もあります。

    <SITEOPERATOR name="double_occupancy" site="x">
    n(x)*(n(x)-1)/2
    </SITEOPERATOR>

これらの演算子の定義では、他の任意の単純または複合サイト演算子を使用できます。演算子に括弧付きで渡される引数は、そのサイトを表す記号名であり、`<SITEOPERATOR>` 要素の site 属性で指定されます。

## 複合ボンド演算子

複合サイト演算子と同様に、2 サイトにまたがる演算子、すなわちボンド演算子も定義できます。以下の最初の例は、`Sz`、`Splus`、`Sminus` を用いて書かれたハイゼンベルク交換相互作用 `S(x)·S(y)` です。2 番目の例は、独立なアップスピンおよびダウンスピン演算子を用いて書かれた、スピンを保存するフェルミオンのホッピング項です。

    <BONDOPERATOR name="exchange" source="x" target="y">
    Sz(x)*Sz(y)+1/2*(Splus(x)*Sminus(y)+Sminus(x)*Splus(y))
    </BONDOPERATOR>

    <BONDOPERATOR name="fermion_hop" source="x" target="y">
    cdag_up(x)*c_up(y)+cdag_up(y)*c_up(x)+cdag_down(x)*c_down(y)+cdag_down(y)*c_down(x)
    </BONDOPERATOR>

ここでは 2 つのサイトがあり、それぞれ source と target というラベルが付いています。このページで定義したすべての演算子 —— 単純なサイト演算子、複合サイト演算子、ボンド演算子 —— は、`<HAMILTONIAN>` の `<SITETERM>`/`<BONDTERM>` 要素の中で名前によって参照できるほか（[ハミルトニアンの記述](../hamiltonian)を参照）、カスタム測定の定義の中でも使用できます（[ALPS カスタム測定](../../measuredef)を参照）。

---

本セクションの他のページの概要については [ALPS モデル定義](..) を参照してください。これらの演算子がどのようにハミルトニアンへと組み立てられるかについては [ハミルトニアンの記述](../hamiltonian) を参照してください。ALPS ドキュメントの他のセクションについては [総合案内](../..) を参照してください。
