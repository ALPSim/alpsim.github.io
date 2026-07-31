
---
title: DMRG-06 Correlations
math: true
toc: true
---

## 相関関数

多体物理で最も重要な相関関数は、$\langle S^+_i S^-_j \rangle$ のような二つのサイト $i$ と $j$ が関与する二点相関関数です。短距離のものはエネルギーを決定し（相関物理の典型的な短距離ハミルトニアンにおいて）、長距離のものは相関長を決定します。

### 結合あたりのエネルギーを再び

[DMRG-02](../dmrg02) ですでに述べたように、スピン-1/2 鎖とスピン-1 鎖の両方における結合あたりの基底状態エネルギーは次で与えられます：

$$
e_0(i) = \frac{1}{2} (\langle S^+_i S^-_{i+1}\rangle  + \langle S^-_i S^+_{i+1}\rangle ) + \langle S^z_i S^z_{i+1} \rangle.
$$

これは各結合のエネルギーを個別に与えますが、私たちが関心を持つのは熱力学極限であり、そこでは物理的な並進対称性の破れがない限りすべての結合は等価なはずです。明らかに、この漸近的な振る舞いに最も近い結合は鎖の中心のものです。したがって直接的なアプローチは $e_0(L/2)$ を計算し、固定 $L$ に対してまず $D$ について外挿し、次に $D$ を固定後に $L$ について外挿することです。これを行う前に、あまり小さくない $D$ と $L$ の値について $e_0(i)$ 対 $i$ をプロットしてください（プログラムの確認として、総和をとる前に三つの寄与を個別に考えることもできます）。

スピン-1/2 鎖では、結合エネルギーは奇数番号と偶数番号の結合の間で強く振動します。これは臨界性のために開放端の影響が非常に強く感じられるためで、スピン-1/2 鎖は二量体化、すなわち基底状態の並進対称性が周期 2 に自発的に破れることの瀬戸際にあります。したがって、強い結合と弱い結合の平均エネルギーを外挿する方がより意味があります：すぐに多くの精度が得られます。これは DMRG の実際の出力を、様々な局所または（ここでは）ほぼ局所のオブザーバブルを考慮して注意深く確認することが価値あることの、さらなる証明です。

### スピン-スピン相関：スピン-1/2

比較的長い鎖（例えば $L=192$）を取り、増加する各 $D$ 値について $\langle S^z_i S^z_j \rangle$ を計算します。

次に $C_l = \langle S^z_{L/2-l/2} S^z_{L/2+l/2} \rangle$ をプロットします。ここで位置は距離が $l$ になるように丸めます。この目的は相関関数を鎖の中心の周りに配置して境界効果をできるだけ小さくすることです。他の方法もあります（同じサイト距離のいくつかの相関関数を平均するなど、これも多かれ少なかれ中心を基準にしています）。臨界指数 $\eta=1$ のべき乗則を期待しているので（[DMRG-02](../dmrg02) 参照）、両対数プロットを使います。絶対値をとるか反強磁性因子 $(-1)^l$ を掛け出してください。

短距離ではべき乗則が、しかしより大きな距離では速い（実際には指数関数的な）減衰が見えるはずです。これには二つの理由があります：（i）有限のシステムサイズがべき乗則相関を切り詰めます。しかし大きなシステムサイズを選んだので、これはあまり問題にならないはずです。（ii）DMRG のアルゴリズム的な構造は事実上、最大 $D^2$ 個の純粋に指数関数的な減衰の重ね合わせとなる相関関数を生成するため、このような重ね合わせによってのみべき乗則を模倣できます——大きな距離では最も遅い指数関数的減衰が他のすべてを上回り、べき乗則を指数関数的な減衰に置き換えます。$D$ を大きくするほど、このクロスオーバーを遠ざけることができます。

#### パラメータファイルを使う場合

次のパラメータファイル [`spin_one_half`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-04-correlations/spin_one_half) でこの実行を設定します（ここでも説明のため、上で述べたより現実的な数より小さいシステムと状態数を使います）。この例では長さ $L=32$ の鎖を考え、異なる状態数 $D$ で複数の実行を設定します。6 回の掃引を使います。相関関数が対称に見えることを確認してください：

    LATTICE="open chain lattice"
    MODEL="spin"
    CONSERVED_QUANTUMNUMBERS="N,Sz"
    Sz_total=0
    SWEEPS=6
    J=1
    NUMBER_EIGENVALUES=1
    MEASURE_AVERAGE[Magnetization]=Sz
    MEASURE_AVERAGE[Exchange]=exchange
    MEASURE_LOCAL[Local magnetization]=Sz
    MEASURE_CORRELATIONS[Diagonal spin correlations]=Sz
    MEASURE_CORRELATIONS[Offdiagonal spin correlations]="Splus:Sminus"
    L=32
    { MAXSTATES=20 }
    { MAXSTATES=40 }
    { MAXSTATES=60 }

    parameter2xml spin_one_half
    dmrg --write-xml spin_one_half.in.xml

#### Python を使う場合

スクリプト [`spin_one_half.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-04-correlations/spin_one_half.py) は異なる状態数 $D$ での三つの実行を設定して結果を読み込みます：

    import pyalps
    import numpy as np
    import matplotlib.pyplot as plt
    import pyalps.plot
    parms = []
    for D in [20,40,60]:
        parms.append( { 
            'LATTICE'                               : 'open chain lattice', 
            'MODEL'                                 : 'spin',
            'CONSERVED_QUANTUMNUMBERS'              : 'N,Sz',
            'Sz_total'                              : 0,
            'J'                                     : 1,
            'SWEEPS'                                : 6,
            'NUMBER_EIGENVALUES'                    : 1,
            'L'                                     : 32,
            'MAXSTATES'                             : D,
            'MEASURE_AVERAGE[Magnetization]'        : 'Sz',
            'MEASURE_AVERAGE[Exchange]'             : 'exchange',
            'MEASURE_LOCAL[Local magnetization]'    : 'Sz',
            'MEASURE_CORRELATIONS[Diagonal spin correlations]'      : 'Sz',
            'MEASURE_CORRELATIONS[Offdiagonal spin correlations]'   : 'Splus:Sminus'
            } )
            
    input_file = pyalps.writeInputFiles('parm_spin_one_half',parms)
    res = pyalps.runApplication('dmrg',input_file,writexml=True)
    
    data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'))

例えば $\langle S^z_iS^z_j\rangle$ 相関を抽出できます：

    curves = []
    for run in data:
        for s in run:
            if s.props['observable'] == 'Diagonal spin correlations':
                d = pyalps.DataSet()
                d.props['observable'] = 'Sz correlations'
                d.props['label'] = 'D = '+str(s.props['MAXSTATES'])
                L = int(s.props['L'])
                d.x = np.arange(L)
           
                # sites with increasing distance l symmetric to the chain center
                site1 = np.array([int(-(l+1)/2.0) for l in range(0,L)]) + L/2
                site2 = np.array([int(  l   /2.0) for l in range(0,L)]) + L/2
                indices = L*site1 + site2
                d.y = abs(s.y[0][indices])
           
                curves.append(d)
そしてサイト距離に対してプロットします：

    plt.figure()
    pyalps.plot.plot(curves)
    plt.xscale('log')
    plt.yscale('log')
    plt.legend()
    plt.title('Spin correlations in antiferromagnetic Heisenberg chain (S=1/2)')
    plt.ylabel('correlations $| \\langle S^z_{L/2-l/2} S^z_{L/2+l/2} \\rangle |$')
    plt.xlabel('distance $l$')
    plt.show()

### スピン-スピン相関：スピン-1

スピン-1 鎖では指数関数的な減衰（解析的な修正付き）を期待しているので、DMRG の相関関数の指数関数的な性質がうまく合うはずです。再び長い鎖（例えば $L=192$）を選び、増加する各 $D$ 値について $\langle S^z_i S^z_j \rangle$ を計算します。

前と同様に $C_l = \langle S^z_{L/2-l/2} S^z_{L/2+l/2} \rangle$ をプロットします（距離が $l$ になるように丸めます）。指数関数則を期待しているので、片対数プロットを使い、負の符号を消去します。

片対数プロットから相関長を抽出し、[DMRG-02](../dmrg02) で示した基準値 $\xi=6.02$ と比較します。相関長は $D$ に対して単調に増加します。

実際、相関長の計算は局所量よりもはるかに収束が難しいです。これは、より深いアルゴリズム的な分析によって DMRG が特に局所量の最適表現に特化したアルゴリズムであり、長距離相関関数のような非局所量については必ずしもそうではないことが明らかになるためです。

#### パラメータファイルを使う場合

パラメータファイル [`spin_one`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-04-correlations/spin_one) は前の例のものとよく似ていますが、格子とモデルを次のように置き換えます：

    LATTICE_LIBRARY="my_lattices.xml"
    LATTICE="open chain lattice with special edges 32"
    MODEL="spin"
    local_S0=0.5
    local_S1=1
    CONSERVED_QUANTUMNUMBERS="N,Sz"
    Sz_total=0
    SWEEPS=6
    J=1
    NUMBER_EIGENVALUES=1
    MEASURE_AVERAGE[Magnetization]=Sz
    MEASURE_AVERAGE[Exchange]=exchange
    MEASURE_LOCAL[Local magnetization]=Sz
    MEASURE_CORRELATIONS[Diagonal spin correlations]=Sz
    MEASURE_CORRELATIONS[Offdiagonal spin correlations]="Splus:Sminus"
    { MAXSTATES=20 }
    { MAXSTATES=40 }
    { MAXSTATES=60 }

    parameter2xml spin_one
    dmrg --write-xml spin_one.in.xml

#### Python を使う場合

スクリプト [`spin_one.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-04-correlations/spin_one.py) の前のものとの主な違いは格子とモデルの定義です：

    parms = []
    L = 32
    for D in [20,40,60]:
        parms.append( { 
            'LATTICE_LIBRARY'                       : 'my_lattices.xml',
            'LATTICE'                               : 'open chain lattice with special edges '+str(L),
            'MODEL'                                 : 'spin',
            'local_S0'                              : 0.5,
            'local_S1'                              : 1,
            'CONSERVED_QUANTUMNUMBERS'              : 'N,Sz',
            'Sz_total'                              : 0,
            'J'                                     : 1,
            'SWEEPS'                                : 4,
            'NUMBER_EIGENVALUES'                    : 1,
            'MAXSTATES'                             : D,
            'MEASURE_AVERAGE[Magnetization]'        : 'Sz',
            'MEASURE_AVERAGE[Exchange]'             : 'exchange',
            'MEASURE_LOCAL[Local magnetization]'    : 'Sz',
            'MEASURE_CORRELATIONS[Diagonal spin correlations]'      : 'Sz',
            'MEASURE_CORRELATIONS[Offdiagonal spin correlations]'   : 'Splus:Sminus'
        } )

シミュレーションを実行した後、相関関数は前と同様の方法で抽出してプロットできます。

### 時として別の方法がある

スピン-1 鎖の特別な場合、相関長の計算に関する抜け道があります。これは第一励起がバルク励起でなかったという奇妙な観察に関連しています。スピン-1 鎖の良いトイモデルは次のように与えられることが示せます：スピン-1 の各サイトに二つのスピン-1/2 を配置し、各サイトの二つのスピン-1/2 の三重項状態からスピン-1 状態を構築します。基底状態は、*隣接する*サイトの二つのスピン-1/2 を一重項状態で結合する状態によって良く近似されます。

この構築では、開放境界条件（周期境界条件ではなく）に対して、最初と最後のサイトにはパートナーのない孤立した二つのスピン-1/2 が存在します。これら二つのスピン-1/2 粒子はそれらの間で 4 つの状態を形成できます。トイモデルでは基底状態は四重縮退しています。実際のスピン-1 鎖では、この四重縮退（全スピン 0 の一つの状態と全スピン 1 の三つの状態から）は熱力学極限でのみ実現され、その際に二つのスピンは完全に離れます。だからこそ磁化セクター 0 と 1 の間にギャップがなかったのです。第一バルク励起には磁化 2 が必要です。

これを解決するために、格子の各側に一つのスピン-1/2 演算子を付加し、これらの新しいサイトに同じ結合ハミルトニアンを取り、二つの孤立したスピンを一重項状態で結合することができます。これで磁化セクター 0 と 1 の間にギャップがあることを確認できます！

相関長を計算するために、次のトリックを使うこともできます：一方の端にのみ一つのスピン-1/2 を付加します。これは基底状態が磁化セクター +1/2 または -1/2 で二重縮退になることを意味します。スピン-1/2 が付加されていない端のサイトに有限の磁化が現れ、それが相関長で減衰してバルクに入ることでこれを特徴付けられます。

長さ $L=192$、$D=200$ の鎖について、基底状態の磁化を計算します。符号振動を消去したうえで、片対数プロットでサイトの関数としてプロットし、相関長を抽出します。

## まとめ

相関関数は二つの鎖の本質的な違いを直接明らかにします——臨界スピン-1/2 鎖のべき乗則減衰対ギャップのあるスピン-1 鎖の指数関数的減衰——一方で、DMRG 自体がどこで最も精度が低いかも示します。長距離相関関数は、エネルギーのような局所量と同じ $D$ で比べると収束がはるかに遅いです。

## 問題

- あまり小さくない $L$ について、各 $D$ 値で $e_0(i)$ 対 $i$ をプロットすると：スピン-1 鎖とスピン-1/2 鎖でそれぞれ何が観察されますか？$e_0(i)$ の三つの寄与を総和をとる前に個別に考えると、それらの間にどのような関係があるはずですか？
- $D=300$ の時点で相関長は収束しましたか？同じ $D$ での磁化やエネルギーのような局所・準局所オブザーバブルの収束と比べてどうですか？
- 長さ $L=192$、$D=200$ の鎖について、この方法で基底状態磁化プロファイルから相関長を抽出すると：どのような相関長が得られますか？[DMRG-02](../dmrg02) の $\xi=6.02$ と比較してどうですか？
