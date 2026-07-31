
---
title: DMRG-05 Local Observables
math: true
toc: true
---

特定のサイトに関連するオブザーバブルを局所オブザーバブルと呼びます。スピン鎖の場合、意味のある局所オブザーバブルは局所磁化 $\langle S^z_i \rangle$ です。

## スピン-1 鎖における励起

長さ $L=96$、$D=200$ の鎖を取り、局所磁化 $\langle S^z_i \rangle$ を計算します。磁化セクター 0、1、2 の基底状態についてサイト $i$ の関数としてプロットします。

得られるのは、セクター 0 では本質的に平坦な曲線、セクター 1 では磁化が本質的に鎖端に集中、セクター 2 では磁化が鎖端とバルクの両方に存在するというものです。これは、開放鎖の第一励起が境界励起であり、閉じた系では存在しないことを意味します。そして開放鎖の第二励起は、境界励起プラスバルク励起であり、これが私たちの関心対象です。今のところ理由は不明ですが、したがって第一バルク励起エネルギーはセクター 1 と 2 を比較することで抽出しなければなりません。

この話の教訓は、この局所オブザーバブルを見ることで、スピン-1 鎖における境界励起とバルク励起を区別できるということです。

### パラメータファイルを使う場合

次のパラメータファイル [`spin_one`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-03-local-observables/spin_one) は三つの個別の実行を設定します。各スピンセクターに一つずつです（前と同様に、説明のため小さいシステムと状態数を使用します）：

    LATTICE_LIBRARY="my_lattices.xml"
    LATTICE="open chain lattice with special edges 32"
    MODEL="spin"
    local_S0=0.5
    local_S1=1
    CONSERVED_QUANTUMNUMBERS="N,Sz"
    J=1
    NUMBER_EIGENVALUES=1
    SWEEPS=4
    MEASURE_LOCAL[Local magnetization]=Sz
    MAXSTATES=40
    { Sz_total=0 }
    { Sz_total=1 }
    { Sz_total=2 }

通常のコマンド列を使って変換と実行を行います：

    parameter2xml spin_one
    dmrg --write-xml spin_one.in.xml

### Python を使う場合

スクリプト [`spin_one.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-03-local-observables/spin_one.py) は三つのスピンセクターそれぞれで一つのシミュレーションを実行します：

    import pyalps
    import numpy as np
    import matplotlib.pyplot as plt
    import pyalps.plot
    parms = []
    for sz in [0,1,2]:
        parms.append( { 
            'LATTICE_LIBRARY'           : 'my_lattices.xml',
            'LATTICE'                   : 'open chain lattice with special edges 32',
            'MODEL'                     : "spin",
            'local_S0'                  : '0.5',
            'local_S1'                  : '1',
            'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
            'Sz_total'                  : sz,
            'J'                         : 1,
            'SWEEPS'                    : 4,
            'NUMBER_EIGENVALUES'        : 1,
            'MAXSTATES'                 : 40,
            'MEASURE_LOCAL[Local magnetization]'   : 'Sz'
    } )
    
    input_file = pyalps.writeInputFiles('parm_spin_one',parms)
    res = pyalps.runApplication('dmrg',input_file,writexml=True)

データファイルを読み込んだ後、局所磁化の結果を抽出できます：

    data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one'))

    curves = []
    for run in data:
        for s in run:
            if s.props['observable'] == 'Local magnetization':
                sz = s.props['Sz_total']
                s.props['label'] = '$S_z = ' + str(sz) + '$'
                s.y = s.y.flatten()
                curves.append(s)

そしてプロットします：

    plt.figure()
    pyalps.plot.plot(curves)
    plt.legend()
    plt.title('Magnetization of antiferromagnetic Heisenberg chain (S=1)')
    plt.ylabel('local magnetization')
    plt.xlabel('site')
    plt.show()

## スピン-1/2 鎖における磁化

最低の磁化セクターでのスピン-1/2 鎖について同様の計算を繰り返します。

### パラメータファイルを使う場合

次のパラメータファイルでこのタスクを達成できます。[こちら](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-03-local-observables/spin_one_half)からダウンロードできます：

    LATTICE="open chain lattice"
    MODEL="spin"
    CONSERVED_QUANTUMNUMBERS="N,Sz"
    SWEEPS=4
    J=1
    NUMBER_EIGENVALUES=1
    MEASURE_LOCAL[Local magnetization]=Sz
    L=32
    MAXSTATES=40
    { Sz_total=0 }
    { Sz_total=1 }
    { Sz_total=2 }

    parameter2xml spin_one_half
    dmrg --write-xml spin_one_half.in.xml

### Python を使う場合

パラメータの変更を除いて、スクリプト [`spin_one_half.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-03-local-observables/spin_one_half.py) は上で説明した `spin_one` スクリプトと同じです。

## まとめ

局所磁化プロファイルは、開放スピン-1 鎖における境界励起とバルク励起をきれいに分離します。だからこそ [DMRG-04](../dmrg04) で研究した物理的に関連する（バルク）ギャップは、0 と 1 ではなく磁化セクター 1 と 2 の間から読み取らなければなりません。

## 問題

- 最低の磁化セクターにおけるスピン-1/2 鎖の局所磁化計算を繰り返すと、上のスピン-1 の場合と比較して何が観察されますか？
