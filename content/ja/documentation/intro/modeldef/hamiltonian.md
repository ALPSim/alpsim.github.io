
---
title: ハミルトニアンの記述
toc: true
weight: 5
---

これらの要素がそろえば、モデルのハミルトニアンを記述できるようになります。単純なハードコアボソンモデルは次のように書けます。

    <HAMILTONIAN name="hardcore boson">
    <PARAMETER name="mu" default="0"/>
    <PARAMETER name="t" default="1"/>
    <PARAMETER name="t'" default="1"/>
    <BASIS ref="hardcore boson"/>
    <SITETERM type="0">
        -mu*n
    </SITETERM>
    <BONDTERM type="0" source="i" target="j">
        -t*(bdag(i)*b(j)+bdag(j)*b(i))
    </BONDTERM>
    <BONDTERM type="1" source="i" target="j">
        -t'*(bdag(i)*b(j)+bdag(j)*b(i))
    </BONDTERM>
    </HAMILTONIAN>

まず、`<PARAMETER>` 要素を使って、結合定数などのパラメータにデフォルト値を指定できます。次に、1 つの `<BASIS>` 要素がそのモデルで使われる基底を指定します。基底はその場で完全に指定することも、ref 属性による参照として指定することもできます。

続いてハミルトニアンの各項を、格子のサイトに対応するサイト項と、ボンドに対応するボンド項によって指定します。`<SITETERM>` および `<BONDTERM>` の各要素は、オプションで type 属性を取ることができ、その項がどのタイプのサイト（またはボンド）に適用されるかを指定します——これは格子の記述で指定されているのと同じタイプです。type 属性を省略すると、その項は他に明示的に項が指定されていないすべてのサイトまたはボンドに適用されます。

`<SITETERM>` 要素には、単一サイトに関連するハミルトニアンの項が含まれます。上の例では、項 `mu` はパラメータ `mu` を指し、項 `n` は[量子演算子](../operators)で説明した演算子 `n` を指します。`<BONDTERM>` 要素では、演算子は 2 つの異なるサイトを参照しなければなりません。これは演算子の後に括弧でサイトのインデックスを付けることで行い、例えば `n(i)` はサイト `i` に作用することを表します。source 属性と target 属性は、2 つのサイトを指すために使う変数名（この例では `i` と `j`）を指定します。

ハミルトニアンの記述を簡単にするため、行列要素を改めて書き出す代わりに、以前定義したサイト演算子やボンド演算子を再利用できます。横磁場スピンモデルでは、[量子演算子](../operators)で定義した `Sx` と `exchange` の演算子を使うことができます。

    <HAMILTONIAN name="spin">
    <PARAMETER name="J" default="1"/>
    <PARAMETER name="h" default="0"/>
    <PARAMETER name="Gamma" default="0"/>
    <BASIS ref="spin"/>
    <SITETERM site="i">
        -h*Sz(i)-Gamma*Sx(i)
    </SITETERM>
    <BONDTERM source="i" target="j">
        J*exchange(i,j)
    </BONDTERM>
    </HAMILTONIAN>

サイト（またはボンド）のタイプに依存する結合項は、最初の例のように type 属性でサイト項・ボンド項の適用範囲を制限して指定することもできますし、結合定数の名前の中でワイルドカード文字 `#` を使うこともできます。`#` はサイトまたはボンドのタイプに置き換えられます。例えば次のとおりです。

    <HAMILTONIAN name="spin">
    <PARAMETER name="J" default="1"/>
    <PARAMETER name="h" default="0"/>
    <PARAMETER name="Gamma" default="0"/>
    <BASIS ref="spin"/>
    <SITETERM site="i">
        <PARAMETER name="h#" default="h"/>
        <PARAMETER name="Gamma#" default="Gamma"/>
        -h#*Sz(i)-Gamma#*Sx(i)
    </SITETERM>
    <BONDTERM source="i" target="j">
        <PARAMETER name="J#" default="J"/>
        J#*exchange(i,j)
    </BONDTERM>
    </HAMILTONIAN>

こうすることで、タイプ 0 のサイトには `h0` と `Gamma0` を、タイプ 0 のボンドには `J0` を、タイプ 1 には `h1`、`Gamma1`、`J1` を、というように指定できます——実際、例えば `anisotropic2d` 単位胞（[格子とグラフのライブラリ](../../latticehowtos/library)を参照）では、まさにこの仕組みによって、格子の各方向のボンドに異なる結合 `J0`/`J1` を割り当てることができます。ここでの `J`、`h`、`Gamma` は、[ALPS モデル定義](..)で説明されているものと同じパラメータです。

3 サイト項や 4 サイト項のような、より複雑な項への拡張は現在準備中であり、ALPS ライブラリがそのような項をサポートし次第、ここに追記される予定です。

---

本セクションの他のページの概要については [ALPS モデル定義](..) を参照してください。これらのハミルトニアン項で使われている演算子については [量子演算子](../operators) を参照してください。ALPS ドキュメントの他のセクションについては [総合案内](../..) を参照してください。
