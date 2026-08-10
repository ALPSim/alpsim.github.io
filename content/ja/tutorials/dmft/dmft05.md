
---
title: DMFT-05 OSMT
math: true
toc: true
---

## Orbitally Selective Mott Transition

多軌道模型における興味深い現象の一つが、軌道選択的モット転移です。これは [Anisimov らによって、Eur. Phys. J. B 25, 191 (2002)](https://doi.org/10.1140/epjb/e20020021) で最初に調べられました。この変種である*運動量選択的*モット転移は、擬ギャップ物理のクラスター表示として、最近の[クラスター計算](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.80.045120)で議論されています。

軌道選択的モット転移では、ドーピングや相互作用の関数として、関与する軌道の一部がモット絶縁体になる一方で、残りは金属的なままです。

最小模型として、幅の広いバンドと幅の狭いバンドという2つのバンドを考えます。軌道内クーロン反発 $U$ に加えて、$U' = U-2J$ を満たす相互作用 $U'$ と $J$ を考えます。ここではイジング的な相互作用に限定します。これは実際の化合物にとってはしばしば問題となる単純化です。

### 模型

密度-密度（「イジング」）項に限定した、2軌道（2バンド）Hubbard-Kanamori 模型を考えます。

$$
\hat{H} = -\sum_{m=0,1}t_m\sum_{\langle i,j\rangle,\sigma} \left(\hat{c}^\dagger_{im\sigma}\hat{c}_{jm\sigma} + \text{h.c.}\right) + U\sum_{i,m} \hat{n}_{im\uparrow}\hat{n}_{im\downarrow} + \sum_{i,\sigma,\sigma'}\left[U' - J\,\delta_{\sigma\sigma'}\right]\hat{n}_{i0\sigma}\hat{n}_{i1\sigma'} - \mu\sum_{i,m,\sigma}\hat{n}_{im\sigma},
$$

軌道インデックス $m=0,1$、軌道内ホッピング $t_m$、軌道内（Hubbard）相互作用 $U$、軌道間相互作用 $U'=U-2J$、フント結合 $J$ を持ちます。完全な Kanamori 相互作用のうちスピンフリップ項とペアホッピング項を落とし、上記の密度-密度部分のみを残すのが、前述の「イジング的」な単純化です。この種の模型における軌道選択的モット転移（OSMT）の最初の議論については [Anisimov et al., Eur. Phys. J. B 25, 191 (2002)](https://doi.org/10.1140/epjb/e20020021) を、ここで再現するパラメータについては [de' Medici, Georges, Biermann, Phys. Rev. B 72, 081103(R) (2005)](https://doi.org/10.1103/PhysRevB.72.081103) を参照してください。

### パラメータ

| パラメータ | 意味 | 使用する値 |
| :-------- | :------ | :------------ |
| `U` | 軌道内相互作用 | $1.8, 2.2, 2.8$ |
| `J` | フント結合、各 $U$ に対して $U/4$ に設定 | $0.45, 0.55, 0.7$ |
| (`U'`) | 軌道間相互作用、明示的には指定しない──既定で $U-2J=U/2$ になる | $0.9, 1.1, 1.4$ |
| `t0` | 軌道0（狭いバンド）のホッピング（半バンド幅 $D_0=2t_0$） | $0.5$ |
| `t1` | 軌道1（広いバンド）のホッピング（半バンド幅 $D_1=2t_1$） | $1$ |
| `BETA` | 逆温度 | $30$ |
| `MU` | 化学ポテンシャル | $0$（半充填） |
| `H`, `H_INIT` | 量子化軸方向の磁場／初期外斯場の種となる磁場 | $0$ / $0$ |
| `FLAVORS` | フレーバー数：2軌道 $\times$ 2スピン | $4$（フレーバー0,1 = 狭いバンドの $\uparrow,\downarrow$；フレーバー2,3 = 広いバンドの $\uparrow,\downarrow$） |
| `SYMMETRIZATION` | 各軌道内でスピン対称な解を強制（フレーバー0$\leftrightarrow$1、2$\leftrightarrow$3） | $1$ |
| `N`, `NMATSUBARA` | $G$ と $G_0$ の虚時間／松原周波数離散化数 | $500$ |
| `MAX_IT`, `CONVERGED` | 自己無撞着反復の最大回数／収束判定基準 | $15$、$0.001$ |
| `SOLVER` | 不純物ソルバー | `"hybridization"`（CT-HYB、セグメント表示） |
| `N_ORDER` | ハイブリダイゼーション展開次数のヒストグラムサイズ | $50$ |
| `N_MEAS` | 測定間のモンテカルロ更新回数 | $2000$ |
| `SC_WRITE_DELTA` | ソルバー用にハイブリダイゼーション関数を出力する | $1$ |
| `CHECKPOINT` | チェックポイント／再開用ファイルのファイル名接頭辞 | `dump` |
| `SWEEPS`, `THERMALIZATION`, `MAX_TIME` | モンテカルロスイープ数の上限／熱化スイープ数／1反復あたりの実時間上限（秒） | $10000$、$500$、$600$ |

### シミュレーションの実行

ここでは、2つのバンド幅を $t_0=0.5$、$t_1=1$ とし、密度-密度型の相互作用を $U'=U/2$、$J=U/4$ とした場合を、$U$ を $1.8$ から $2.8$ の間で変化させて考えます。$U=1.8$ では両方の軌道でフェルミ液体的な振る舞いが見られ、$U=2.2$ では軌道選択的になり、$U=2.8$ では両方の軌道が絶縁的になります。

シミュレーションを実行するための python コマンドは [`tutorial5a.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-05-osmt/tutorial5a.py) にあります。

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot


#prepare the input parameters
parms=[]
for u,j in [[1.8,0.45],[2.2,0.55],[2.8,0.7]]:
    parms.append(
            { 
              'CONVERGED'           : 0.001,
              'FLAVORS'             : 4,
              'H'                   : 0,
              'H_INIT'              : 0.,
              'MAX_IT'              : 15,
              'MAX_TIME'            : 600,
              'MU'                  : 0,
              'N'                   : 500,
              'NMATSUBARA'          : 500,
              'N_MEAS'              : 2000,
              'N_ORDER'             : 50,
              'SEED'                : 0,
              'SOLVER'              : 'hybridization',
              'SC_WRITE_DELTA'      : 1,
              'SYMMETRIZATION'      : 1,
              'SWEEPS'              : 10000,
              'BETA'                : 30,
              'THERMALIZATION'      : 500,
              'U'                   : u,
              'J'                   : j,
              't0'                  : 0.5,
              't1'                  : 1,
              'CHECKPOINT'          : 'dump'
        }
        )

# For more precise calculations we propose to enhance the SWEEPS

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_u_'+str(p['U'])+'_j_'+str(p['J']),p)
    res = pyalps.runDMFT(input_file)
```

同じサンプルパラメータを用いた論文は [de' Medici, Georges, Biermann (2005)](https://doi.org/10.1103/PhysRevB.72.081103) にあります。これまでのチュートリアルと同様に、`pyalps.runDMFT` は生成された各パラメータファイルに対して、反復ごとに `dmft` アプリケーションを直接呼び出します。

```
/path-to-alps-installation/bin/dmft parm_u_1.8_j_0.45
/path-to-alps-installation/bin/dmft parm_u_2.2_j_0.55
/path-to-alps-installation/bin/dmft parm_u_2.8_j_0.7
```

### パラメータファイル

上記のスクリプトによって生成される入力ファイル `parm_u_1.8_j_0.45` に、コメントを加えたものです。

```
CONVERGED = 0.001                 // convergence criterion for the self-consistency iteration
FLAVORS = 4                       // 2 orbitals x 2 spins: flavors 0,1 = narrow-band up/down; flavors 2,3 = wide-band up/down
H = 0                             // magnetic field along the quantization axis
H_INIT = 0.                       // no symmetry-breaking seed field for the initial Weiss field
MAX_IT = 15                       // maximum number of self-consistency iterations
MAX_TIME = 600                    // wall-clock time limit per iteration (seconds)
MU = 0                             // chemical potential; MU=0 is half filling
N = 500                           // discretization of the imaginary-time Green's function
NMATSUBARA = 500                  // cutoff for Matsubara frequencies
N_MEAS = 2000                     // number of updates between measurements
N_ORDER = 50                      // histogram size for the hybridization expansion order
SEED = 0                          // Monte Carlo random number seed
SOLVER = "hybridization"          // the CT-HYB solver (segment representation, requires density-density interactions)
SC_WRITE_DELTA = 1                // write out the hybridization function for the solver
SYMMETRIZATION = 1                // enforce spin-symmetric solutions within each orbital (flavors 0<->1 and 2<->3)
SWEEPS = 10000                    // total sweeps
BETA = 30                         // inverse temperature
THERMALIZATION = 500              // thermalization sweeps
U = 1.8                           // intra-orbital (Hubbard) interaction
J = 0.45                          // Hund's coupling
t0 = 0.5                          // hopping of the narrow band (half-bandwidth D0=2t0=1)
t1 = 1                            // hopping of the wide band (half-bandwidth D1=2t1=2)
CHECKPOINT = dump                 // filename prefix for checkpoint/restart files
```

$U'$ は明示的には指定されていないことに注意してください。[DMFT パラメータリファレンス](../../../documentation/methods/dmft) に記載の通り、指定しない場合は既定で $U-2J$ になります。

### 格子

これも単サイト DMFT ですが、今回は2つの軌道を持ちます。各軌道は $z\to\infty$ 極限のベーテ格子上をそれぞれ独立にホッピングし（狭いバンドはホッピング $t_0$、広いバンドはホッピング $t_1$ で、それぞれ $t_m=t_m^*/\sqrt{z}$ とスケールされます）、2つの軌道はホッピングに関しては互いに独立です──両者は各サイトでの相互作用項 $U$、$U'$、$J$ を通じてのみ局所的に結合しています。

```
        o(1)      o(1)
         \        /
      t1  \      /  t1        orbital 1 (wide band), hopping t1
           \    /
            o--o--o
            |
            |  U, U', J   (on-site intra- and inter-orbital interactions)
            |
            o--o--o
           /    \
      t0  /      \  t0        orbital 0 (narrow band), hopping t0
         /        \
        o(0)      o(0)
```

他の格子で自己無撞着計算を行う方法については [DMFT-08 格子](../dmft08) を、明示的な有限格子に基づくシミュレーションについては [ALPS 格子ライブラリ](../../../documentation/intro/latticehowtos) を参照してください。

### 手法の選択

ここでも、セグメント表示によるハイブリダイゼーション展開ソルバー CT-HYB を用います。セグメントアルゴリズムは局所トレースを解析的に評価しますが、これが可能なのは密度-密度（イジング的）局所相互作用の場合に限られます──これはまさに「模型」の節で採用した制限です。完全な Kanamori 相互作用のスピンフリップ項とペアホッピング項を落とすのはこのためです：これらの項を残すと、モンテカルロの各更新において局所ヒルベルト空間全体（次元 $2^{\text{FLAVORS}}=16$）にわたる一般行列（非セグメント）の CT-HYB トレース評価が必要となり、計算コストが大幅に増加します。4フレーバー・$\beta=30$ という設定でも、セグメント表示のおかげで、両軌道がモット転移に近づく領域まで計算が現実的な範囲に収まります。

### 出力データとプロット

前のチュートリアル [DMFT-04 Mott](../dmft04) で述べたように、グリーン関数の金属性（あるいは非金属性）は対数スケールでデータをプロットすることで最もよく観察できます。フレーバー0（1と対称化）が狭いバンド、フレーバー2（3と対称化）が広いバンドです。

```
listobs = ['0', '2']   # flavor 0 is SYMMETRIZED with 1, flavor 2 is SYMMETRIZED with 3
    
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_u_*h5'), respath='/simulation/results/G_tau', what=listobs, verbose=True)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.y = -d.y
    d.props['label'] = r'$U=$'+str(d.props['U'])+'; flavor='+str(d.props['observable'][len(d.props['observable'])-1])
plt.figure()
plt.yscale('log')
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor}(\tau)$')
plt.title('DMFT-05: Orbitally Selective Mott Transition on the Bethe lattice')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

これは確率的なモンテカルロシミュレーションであるため、実際に得られる数値は `SEED`、`MAX_TIME`、計算機の速度に依存しますが、定性的には上述の3つの領域が再現されるはずです。$U=1.8$ では両方のフレーバーが対数スケール上でゆっくり減衰します（両バンドとも金属的）。$U=2.2$ では狭いバンドのフレーバー（0）が広いバンドのフレーバー（2）よりもずっと速く減衰します──この2つの軌道の間の非対称性こそが、軌道選択的モット転移そのものです。$U=2.8$ では両方のフレーバーが急速に減衰します（両バンドとも絶縁的）。

### 収束の確認

収束は [`tutorial5b.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-05-osmt/tutorial5b.py) で確認でき、フレーバー0とフレーバー2それぞれについて、$G_f^{it}(\tau)$ のすべての反復を対数スケールでプロットします。

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot


## Please run the tutorial5a.py before this one

listobs = ['0', '2']   # we look at convergence of a single flavor (=0) 

## load all results
data = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_u_*.h5'), measurements=listobs, verbose=True)

## create a figure for each BETA
grouped = pyalps.groupSets(pyalps.flatten(data), ['U', 'observable'])
for sim in grouped:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## rescale x-axis and set label
    for d in sim:
        d.x = d.x * d.props['BETA']/float(d.props['N'])
        d.y *= -1.
        d.props['label'] = 'it'+d.props['iteration']
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$\tau$')
    plt.ylabel(r'$-G_{flavor=%8s}(\tau)$' % common_props['observable'])
    plt.title('DMFT-05: Orbitally Selective Mott Transition on the Bethe lattice: ' + r'$U = %.4s$' % common_props['U'])
    pyalps.plot.plot(sim)
    plt.legend()
    plt.yscale("log")

plt.show()
```

### まとめと今後の課題

異なる帯域幅（$t_0=0.5$、$t_1=1$）を持つ2つのベーテ格子バンドを、局所的な密度-密度相互作用のみで結合させることで、軌道選択的モット転移を再現しました。中間的な $U$ では、両方の軌道が同じ $U$、$U'$、$J$ を共有しているにもかかわらず、狭いバンドはモット絶縁体になる一方で、広いバンドは金属的なままです。

1. $U=2.2$（軌道選択的な点）を固定し、$U'=U-2J$ を固定したまま $J$ を変化させてみましょう。選択的な相が現れるには、フント結合がどの程度大きい必要があるでしょうか。
2. バンド幅比 $t_1/t_0$ を変えてみましょう。バンドの非対称性を大きく（あるいは小さく）すると、軌道選択的な領域は $U$ に対して広がるでしょうか、それとも狭まるでしょうか。
3. 「手法の選択」の節では、相互作用を密度-密度部分に限定する理由を説明しました。実際の物質において、省略されたスピンフリップ項やペアホッピング項による補正がどの程度の大きさになると予想されるか調べてみましょう（[Anisimov et al. (2002)](https://doi.org/10.1140/epjb/e20020021) を参照）。完全な Kanamori 相互作用のもとでも、選択的な相は存続すると考えられるでしょうか。
4. [DMFT-06](../dmft06) では、チュートリアル02〜05で用いた手法を常磁性金属に適用します。そこでの収束の振る舞いが、ここで扱った多軌道の場合とどのように異なるか比較してみましょう。
