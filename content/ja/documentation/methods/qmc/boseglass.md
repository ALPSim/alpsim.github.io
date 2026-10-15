
---
title: ボースグラス
math: true
weight: 8
---

## ボースグラスモデル

次のパラメータファイルは、worm コードを用いて、正方格子上でサイトに依存するランダムな化学ポテンシャルを持つ量子ボース・ハバードモデルのモンテカルロシミュレーションを設定します。化学ポテンシャルは区間 [-5,+5] の一様分布から抽出されます。

    LATTICE="inhomogeneous square lattice";
    L=4;

    MODEL="boson Hubbard";
    NONLOCAL=0;
    U    = 1.0;
    Nmax = 2;
    t = 1.0;
    T = 0.1;
    delta = 5.0;
    SWEEPS=500000;
    THERMALIZATION=10000;

    { DISORDERSEED = 34275; mu=delta*2*(random()-0.5); }
    { DISORDERSEED = 49802; mu=delta*2*(random()-0.5); }
    { DISORDERSEED = 82529; mu=delta*2*(random()-0.5); }

周期境界条件を使うには、`lattice.xml` ファイル内の inhomogeneous square lattice の境界タイプを調整する必要があります。

    <LATTICEGRAPH name = "inhomogeneous square lattice">
    <FINITELATTICE>
        <LATTICE ref="square lattice"/>
        <PARAMETER name="W" default="L"/>
        <EXTENT dimension="1" size="L"/>
        <EXTENT dimension="2" size="W"/>
        <BOUNDARY type="periodic"/>
    </FINITELATTICE>
    <UNITCELL ref="simple2d"/>
    <INHOMOGENEOUS><VERTEX/></INHOMOGENEOUS>
    </LATTICEGRAPH>

シミュレーションは、ワームアルゴリズムのチュートリアルと同じ一連のコマンドを使って実行できます。


