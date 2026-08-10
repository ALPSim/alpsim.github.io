
---
title: Lattice and Unit Cells
toc: true
weight: 3
---

格子模型は通常、無限格子あるいはその有限の一部分の上で定義されます。ここでは、単位胞とその基底ベクトルから出発して、両方を XML 形式でどのように指定するかを説明します。

## 無限格子

格子は、単位胞を格子の基底ベクトルの整数倍だけ並進させて複製することで作られます。2次元の場合を以下に示します。

![Infinite lattice with unit cell.](../figs/tutoriallatticehowtolattice1.gif)

このような格子は、（任意の）名前と次元数によって記述されます。さらに、格子の基底ベクトルの直交座標（Cartesian coordinates）を指定することもできます。上の格子の場合は次のようになります。

    <LATTICE name="2D" dimension="2">
    <BASIS>
        <VECTOR>   1 0 </VECTOR>
        <VECTOR> 0.5 1 </VECTOR>
    </BASIS>
    </LATTICE>

基底ベクトルは、次のように記号的・パラメータ化された形で指定することもできます。

    <LATTICE name="2D" dimension="2">
    <PARAMETER name="a" default="1"/>
    <PARAMETER name="b" default="1"/>
    <PARAMETER name="phi" default="Pi/2"/>
    <BASIS>
        <VECTOR>   a 0 </VECTOR>
        <VECTOR> b*cos(phi) b*sin(phi) </VECTOR>
    </BASIS>
    </LATTICE>

ここに示した既定値では、これは具体的な値（`phi=Pi/2`）を直接与えた場合と同じ正方格子になります：第1のベクトルは x 軸に沿っており、第2のベクトルは長さ `b`、第1のベクトルに対して角度 `phi` をなします。

## 有限格子

### 有限の広がり

（すべてではありませんが）ほとんどの計算機シミュレーションは、上で示した無限格子ではなく、格子の有限な部分の上で行われます。このような有限格子を定義する方法は数多くあります。格子の任意の有限部分集合はそれ自体が有限格子であるため、可能性は無限にあります。まず、最もよく使われる有限の広がりを持つ格子を定義しましょう。これは、セルが各方向に高々有限回だけ並進されるもので、例えば正方格子・長方形格子・立方格子・超立方格子などがあり、それぞれの次元について広がりを指定します。

![A finite lattice](../figs/tutoriallatticehowtolattice2.gif)

有限格子を作成するには、次のように定義します。

    <FINITELATTICE name="5x3">
    <LATTICE name="2D" dimension="2"/>
    <EXTENT dimension="1" size="5"/>
    <EXTENT dimension="2" size="3"/>
    </FINITELATTICE>

dimension 属性を省略した場合、その広がりはすべての次元に適用されると仮定されます。例えば、線形サイズ4の立方格子は次のようになります。

    <FINITELATTICE>
    <LATTICE dimension="3"/>
    <EXTENT size="4"/>
    </FINITELATTICE>

すべての次元が有限である必要はなく、幅2の無限に長いストリップは次のように指定できます。

![A mixed lattice with finite and infinite dimensions](../figs/tutoriallatticehowtolattice3.gif)

    <FINITELATTICE name="strip">
    <LATTICE name="2D" dimension="2"/>
    <EXTENT dimension="2" size="2"/>
    </FINITELATTICE>

多くのアプリケーションでは、広がりは一定ではなく、ユーザーが指定する入力パラメータです。ここでも `<PARAMETER>` 要素を使って広がりを指定できます。L × 2 のストリップの場合は次のようになります。

    <FINITELATTICE>
    <LATTICE name="2D" dimension="2"/>
    <PARAMETER name="L"/>
    <EXTENT dimension="1" size="L"/>
    <EXTENT dimension="2" size="2"/>
    </FINITELATTICE>

L × W のサイズのストリップで、W が指定されなかった場合の既定値を2としたい場合は、size 属性と parameter 属性の両方を指定します。

    <FINITELATTICE>
    <LATTICE name="2D" dimension="2"/>
    <PARAMETER name="L" />
    <PARAMETER name="W" default="2" />
    <EXTENT dimension="1" size="L" />
    <EXTENT dimension="2" size="W" />
    </FINITELATTICE>

最後に、W（幅）や H（高さ）などの他の次元を明示的に指定しない限り、すべての次元で同じ広がり L を持つ正方（あるいは立方）格子を考えることがよくあります。これは次のように記述できます。

    <FINITELATTICE>
    <LATTICE name="3D" dimension="3"/>
    <PARAMETER name="L" />
    <PARAMETER name="W" default="L" />    
    <PARAMETER name="H" default="W" />
    <EXTENT dimension="1" size="L" />
    <EXTENT dimension="2" size="W" />
    <EXTENT dimension="3" size="H" />
    </FINITELATTICE>

`L` は常に第1次元の広がりを設定し、それ以外は上書きされない限り既定値にフォールバックします。したがって、ユーザーが `L` のみを指定した場合は L×L×L の立方体、`L` と `W` を指定した場合は L×W×W の直方体になります。`L` と `H` を指定した場合は L×L×H の直方体、`L`、`W`、`H` をすべて指定した場合は L×W×H の直方体になります。

## 境界条件

有限格子では、広がりに加えて境界条件も指定する必要があります。広く使われる境界条件は次の通りです。

- open（開放）：格子は開いた端を持ち、境界のセルは一方あるいは複数の方向に隣接するセルを持ちません
- periodic（周期的）：格子は周期的であると仮定されます。すなわち、一方の端から格子の外に出ると、反対側の端から格子に再び入ります。最も右のセルの右隣は最も左のセルであり、最も上のセルの上隣は最も下のセルです。2次元格子の場合、これはトーラスのような形になります。

これら2種類の境界条件に対して、いずれかの値を取る type 属性を持つ `<BOUNDARY>` 要素を定義しています。例えば、周期的な L × L の正方格子の場合は次のようになります。

    <FINITELATTICE>
    <LATTICE name="2D" dimension="2"/>
    <EXTENT size="L" />
    <BOUNDARY type="periodic" />
    </FINITELATTICE>

あるいは、長い方向には周期的で、短い方向には開放的なストリップの場合は次のようになります。

    <FINITELATTICE name="strip">
    <LATTICE name="strip" dimension="2"/>
    <PARAMETER name="W" default="2" />
    <EXTENT dimension="1" size="L" />
    <EXTENT dimension="2" size="W" />
    <BOUNDARY dimension="1" type="periodic" />
    <BOUNDARY dimension="2" type="open" />
    </FINITELATTICE>

あるいは、境界条件を実行時に決めたい場合は、境界条件を決めるパラメータの名前を示す `<PARAMETER>` 要素を指定し、必要に応じて既定値を与えることもできます。

    <FINITELATTICE>
    <LATTICE name="cube" dimension="3"/>
    <PARAMETER name="BC" default="periodic" />
    <EXTENT size="L" />
    <BOUNDARY type="BC" />
    </FINITELATTICE>

これにより、パラメータ `BC` によって境界条件が与えられ、既定では周期的境界条件となる立方格子が指定されます。

## 格子の参照

毎回格子を定義する代わりに、以前に定義した格子を参照することもできます。例えば、次のように定義する代わりに：

    <FINITELATTICE name = "finite tilted 2D">
    <LATTICE name="tilted 2D" dimension="2">
        <BASIS>
        <VECTOR>   1 0 </VECTOR>
        <VECTOR> 0.5 1 </VECTOR>
        </BASIS>
    </LATTICE>
    <PARAMETER name="BC" default="periodic" />
    <EXTENT dimension="1" size="L" />
    <EXTENT dimension="2" size="W" />
    <BOUNDARY type="BC" />
    </FINITELATTICE>

まず無限格子を定義しておき：

    <LATTICE name="tilted 2D" dimension="2">
    <BASIS>
        <VECTOR>   1  0 </VECTOR>
        <VECTOR> 0.5 1 </VECTOR>
    </BASIS>
    </LATTICE>

そして、有限な部分格子を定義するたびに、定義を繰り返す代わりに lattice 要素の ref 属性を使ってこの格子を参照します。

    <FINITELATTICE name = "finite tilted 2D">
    <LATTICE ref="tilted 2D"/>
    <PARAMETER name="BC" default="periodic" />
    <EXTENT dimension="1" size="L" />
    <EXTENT dimension="2" size="W" />
    <BOUNDARY type="BC" />
    </FINITELATTICE>

---

このセクションの他の内容の概要については、[格子の定義](..) を参照してください。シミュレーションで格子を選択するための `LATTICE`／`GRAPH` 入力パラメータについては、[共通パラメータ](../../parameters) を参照してください。他の ALPS ドキュメントのセクションについては、[はじめに](../..) を参照してください。
