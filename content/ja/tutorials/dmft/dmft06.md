
---
title: DMFT-06 Paramagnet
math: true
toc: true
---

## Paramagnetic metal and extrapolation errors

この例では、常磁性の自己無撞着計算を用いて、ベーテ格子上で相互作用 $U=3D/\sqrt{2}$、温度 $\beta =32 \sqrt{2}/D$ の Hubbard 模型をシミュレーションします。自己エネルギーを計算し、[Georges らによる DMFT のレビュー論文](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)の図15と比較します。この図には、同じ系についての Hirsch-Fye 法と厳密対角化の結果が示されています。Hirsch-Fye アルゴリズムとは異なり、2つの連続時間量子モンテカルロアルゴリズムである CT-HYB と CT-INT は離散化誤差を持たず、厳密対角化の結果を再現します。

### 模型

これまでのチュートリアルと同様に、単バンド Hubbard 模型

$$
\hat{H} = -t\sum_{\langle i,j\rangle,\sigma} \left(\hat{c}^\dagger_{i\sigma}\hat{c}_{j\sigma} + \text{h.c.}\right) + U\sum_i \hat{n}_{i\uparrow}\hat{n}_{i\downarrow} - \mu\sum_{i,\sigma}\hat{n}_{i\sigma}
$$

をベーテ格子上、半充填（$\mu=0$）で解きます。$t=0.707106781186547=1/\sqrt{2}$（半バンド幅 $D=2t=\sqrt{2}$）、$U=3$ とすることで、[Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) と同様に $U=3D/\sqrt{2}$ となります。チュートリアル02・03とは異なり、ここでは $\beta=32$ において*常磁性*自己無撞着（`ANTIFERROMAGNET=0`、`SYMMETRIZATION=1`）を強制します。これにより、金属的な自己エネルギーを、同じく常磁性相に対して計算された同レビュー論文の図15の Hirsch-Fye および厳密対角化のベンチマークと直接比較できます。

### パラメータ

両ソルバーとも同じ物理的な点で実行されます。

| パラメータ | 意味 | 値 |
| :-------- | :------ | :---- |
| `U` | オンサイト相互作用 | $3$ |
| `t` | 最近接ホッピング（半バンド幅 $D=2t=\sqrt{2}$） | $0.707106781186547 = 1/\sqrt{2}$ |
| `BETA` | 逆温度 | $32$ |
| `MU` | 化学ポテンシャル | $0$（半充填） |
| `H`, `H_INIT` | 量子化軸方向の磁場／初期外斯場の種となる磁場 | $0$ / $0$ |
| `FLAVORS` | スピンフレーバー数 | $2$ |
| `ANTIFERROMAGNET` | ネール自己無撞着を有効化 | $0$（無効──常磁性解を強制） |
| `SYMMETRIZATION` | 常磁性解を強制 | $1$ |
| `OMEGA_LOOP` | 自己無撞着計算を松原周波数で行う | $1$ |
| `SITES` | 不純物サイト数 | $1$ |
| `MAX_IT`, `CONVERGED` | 自己無撞着反復の最大回数／収束判定基準 | $12$、$0.0025$ |

2つのソルバーは、離散化やソルバー固有の設定において異なります。

| パラメータ | 意味 | CT-HYB（`hyb`） | CT-INT（`int`） |
| :-------- | :------ | :-------------- | :-------------- |
| `SOLVER` | 不純物ソルバー | `"hybridization"` | `"Interaction Expansion"` |
| `N`, `NMATSUBARA` | $G$、$G_0$ の虚時間／松原周波数離散化数 | $1000$ | $500$ |
| `SWEEPS`, `THERMALIZATION` | モンテカルロスイープ数の上限、熱化スイープ数 | $2500$、$500$ | $10^8$、$1000$ |
| `MAX_TIME` | 1反復あたりの実時間上限（秒） | $600$ | $120$ |
| `N_MEAS` | 測定間のモンテカルロ更新回数 | $10000$ | ─ |
| `N_ORDER` | ハイブリダイゼーション展開次数のヒストグラムサイズ | $50$ | ─ |
| `SC_WRITE_DELTA` | ソルバー用にハイブリダイゼーション関数を出力する | $1$ | ─ |
| `ALPHA` | CT-INT 補助イジング場のシフト量 | ─ | $-0.01$ |
| `HISTOGRAM_MEASUREMENT` | CT-INT 展開次数のヒストグラムを記録する | ─ | $1$ |
| `MEASUREMENT_PERIOD`, `RECALC_PERIOD` | CT-INT の測定／再計算の周期 | ─ | $10$、$3000$ |
| `NMATSUBARA_MEASUREMENTS`, `NSELF` | CT-INT 固有の松原／自己エネルギー格子サイズ | ─ | $18$、$5000$ |
| `CONVERGENCE_CHECK_PERIOD` | CT-INT 収束チェックの周期 | ─ | $500$ |
| `CHECKPOINT` | チェックポイント／再開用ファイルのファイル名接頭辞 | `dump_hyb` | `dump_int` |

### シミュレーションの実行

パラメータファイルと python スクリプトは、ALPS のインストールディレクトリ内の `tutorials/dmft-06-paramagnet` ディレクトリのサブディレクトリ `hyb` と `int` にあります。以下を実行することでシミュレーションを実行できます（ハイブリダイゼーション展開版の場合）。

```
python tutorial6a.py
```

および（相互作用展開版の場合）：

```
python tutorial6b.py
```

[`tutorial6a.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-06-paramagnet/hyb/tutorial6a.py)（CT-HYB）：

```
import pyalps

#prepare the input parameters
parms=[]
parms.append(
        {
          'ANTIFERROMAGNET'     : 0,
          'CHECKPOINT'          : 'dump_hyb',
          'CONVERGED'           : 0.0025,
          'FLAVORS'             : 2,
          'H'                   : 0,
          'H_INIT'              : 0.0,
          'MAX_IT'              : 12,
          'MAX_TIME'            : 600,
          'MU'                  : 0,
          'N'                   : 1000,
          'NMATSUBARA'          : 1000,
          'N_MEAS'              : 10000,
          'N_ORDER'             : 50,
          'OMEGA_LOOP'          : 1,
          'SEED'                : 0,
          'SITES'               : 1,
          'SOLVER'              : 'hybridization',
          'SC_WRITE_DELTA'      : 1,
          'SYMMETRIZATION'      : 1,
          'U'                   : 3,
          't'                   : 0.707106781186547,
          'SWEEPS'              : 2500,
          'THERMALIZATION'      : 500,
          'BETA'                : 32
        }
    )

# For more precise calculations we propose to you to:
#   enhance the MAX_TIME, MAX_IT and lower CONVERGED

#write the input file and run the simulation
input_file = pyalps.writeParameterFile('parm_hyb',parms[0])
res = pyalps.runDMFT(input_file)
```

[`tutorial6b.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-06-paramagnet/int/tutorial6b.py)（CT-INT）：

```
import pyalps

#prepare the input parameters
parms=[]
parms.append(
        { 
          'ANTIFERROMAGNET'         : 0,
          'CHECKPOINT'              : 'dump_int',
          'CONVERGED'               : 0.0025,
          'CONVERGENCE_CHECK_PERIOD': 500,
          'FLAVORS'                 : 2,
          'H'                       : 0,
          'H_INIT'                  : 0.,
          'MAX_IT'                  : 12,
          'MAX_TIME'                : 120,
          'MU'                      : 0,
          'N'                       : 500,
          'NMATSUBARA'              : 500,
          'NMATSUBARA_MEASUREMENTS' : 18, 
          'NSELF'                   : 5000,
          'MEASUREMENT_PERIOD'      : 10,
          'OMEGA_LOOP'              : 1,
          'SEED'                    : 0, 
          'SITES'                   : 1,
          'SOLVER'                  : 'Interaction Expansion',
          'SYMMETRIZATION'          : 1,
          'U'                       : 3,
          't'                       : 0.707106781186547,
          'RECALC_PERIOD'           : 3000,
          'SWEEPS'                  : 100000000,
          'THERMALIZATION'          : 1000,
          'ALPHA'                   : -0.01,
          'HISTOGRAM_MEASUREMENT'   : 1,
          'BETA'                    : 32
        }
    )
    
# For more precise calculations we propose to you to:
#   enhance the MAX_TIME, MAX_IT and lower CONVERGED

#write the input file and run the simulation
input_file = pyalps.writeParameterFile('parm_int',parms[0])
res = pyalps.runDMFT(input_file)
```

内部的には、`pyalps.runDMFT` は生成された各パラメータファイルに対して、反復ごとに `dmft` アプリケーションを直接呼び出します。

```
/path-to-alps-installation/bin/dmft parm_hyb
/path-to-alps-installation/bin/dmft parm_int
```

警告：1台のワークステーションで実行するとかなりの時間がかかります。非常に高い精度が不要な場合は、（`MAX_TIME` と `MAX_IT` を下げる、あるいは `CONVERGED` を上げることで）2回の実行の合計時間を約 $2\times 24$ 分に短縮することができます。

### パラメータファイル

`parm_hyb` ファイルにコメントを加えたものです。

```
ANTIFERROMAGNET = 0        // paramagnetic self-consistency (no Neel order)
CHECKPOINT = dump_hyb      // filename prefix for checkpoint/restart files
CONVERGED = 0.0025         // convergence criterion for the self-consistency iteration
FLAVORS = 2                // flavors 0 and 1 correspond to spin up and down
H = 0                      // magnetic field along the quantization axis
H_INIT = 0.0               // no symmetry-breaking seed field
MAX_IT = 12                // maximum number of self-consistency iterations
MAX_TIME = 600             // wall-clock time limit per iteration (seconds)
MU = 0                     // chemical potential; MU=0 is half filling
N = 1000                   // discretization of the imaginary-time Green's function
NMATSUBARA = 1000          // cutoff for Matsubara frequencies
N_MEAS = 10000             // number of updates between measurements
N_ORDER = 50               // histogram size for the hybridization expansion order
OMEGA_LOOP = 1             // self-consistency runs in Matsubara frequencies
SEED = 0                   // Monte Carlo random number seed
SITES = 1                  // one impurity site, as in single-site DMFT
SOLVER = "hybridization"   // the CT-HYB solver
SC_WRITE_DELTA = 1         // write out the hybridization function for the solver
SYMMETRIZATION = 1         // enforce a paramagnetic solution (flavors 0 and 1 symmetrized)
U = 3                      // interaction strength
t = 0.707106781186547      // hopping; for the Bethe lattice considered here $W=2D=4t$
SWEEPS = 2500               // total sweeps
THERMALIZATION = 500       // thermalization sweeps
BETA = 32                  // inverse temperature
```

`parm_int` ファイルにコメントを加えたものです。

```
ANTIFERROMAGNET = 0                  // paramagnetic self-consistency (no Neel order)
CHECKPOINT = dump_int                // filename prefix for checkpoint/restart files
CONVERGED = 0.0025                   // convergence criterion for the self-consistency iteration
CONVERGENCE_CHECK_PERIOD = 500       // how often (in sweeps) convergence is checked
FLAVORS = 2                          // flavors 0 and 1 correspond to spin up and down
H = 0                                // magnetic field along the quantization axis
H_INIT = 0.                          // no symmetry-breaking seed field
MAX_IT = 12                          // maximum number of self-consistency iterations
MAX_TIME = 120                       // wall-clock time limit per iteration (seconds)
MU = 0                               // chemical potential; MU=0 is half filling
N = 500                              // discretization of the imaginary-time Green's function
NMATSUBARA = 500                     // cutoff for Matsubara frequencies
NMATSUBARA_MEASUREMENTS = 18         // number of Matsubara points measured directly
NSELF = 5000                         // number of self-energy points
MEASUREMENT_PERIOD = 10              // sweeps between measurements
OMEGA_LOOP = 1                       // self-consistency runs in Matsubara frequencies
SEED = 0                             // Monte Carlo random number seed
SITES = 1                            // one impurity site, as in single-site DMFT
SOLVER = "Interaction Expansion"     // the CT-INT solver
SYMMETRIZATION = 1                   // enforce a paramagnetic solution (flavors 0 and 1 symmetrized)
U = 3                                // interaction strength
t = 0.707106781186547                // hopping; for the Bethe lattice considered here $W=2D=4t$
RECALC_PERIOD = 3000                 // sweeps between recomputation of the weight from scratch
SWEEPS = 100000000                   // upper bound on sweeps; in practice MAX_TIME stops the run first
THERMALIZATION = 1000                // thermalization sweeps
ALPHA = -0.01                        // shift of the auxiliary Ising field (CT-INT sign-problem control)
HISTOGRAM_MEASUREMENT = 1            // record a histogram of the CT-INT perturbation order
BETA = 32                            // inverse temperature
```

### 格子

これまでのチュートリアルと同様、これは $z\to\infty$ 極限のベーテ格子上の単サイト DMFT です。ホッピングは $t=t^*/\sqrt{z}$ とスケールされ、半円形状態密度（半バンド幅 $D=2t$）が自己無撞着ループで解析的に評価されます（`OMEGA_LOOP=1`、`DOSFILE` は指定なし）。各サイトは同一のオンサイト相互作用 $U$ を、各ボンドは同一のホッピング $t$ を持ちます。

```
        o       o
         \     /
      t   \   /   t
           \ /
        o---o---o          o : lattice site, interaction U (on site)
           / \              --- : bond, hopping amplitude t
          /   \
         /     \
        o       o
```

他の格子で自己無撞着計算を行う方法については [DMFT-08 格子](../dmft08) を、明示的な有限格子に基づくシミュレーションについては [ALPS 格子ライブラリ](../../../documentation/intro/latticehowtos) を参照してください。

### 手法の選択

このチュートリアルの目的は、どちらかのソルバーを選ぶことではなく、CT-HYB と CT-INT の*両方*を同じ物理的な点で実行し、両者が一致すること、そして [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) の図15にある厳密なベンチマークと一致することを確認することです。この図はもともと厳密対角化（厳密だが浴サイト数が少数に限られる）と、離散時間の Hirsch-Fye アルゴリズム（[DMFT-07 Hirsch-Fye](../dmft07) 参照）を用いて作成されました。Hirsch-Fye は時間刻み幅 $\Delta\tau=\beta/N$ に制御される系統誤差を持つため、定量的に信頼するには $\Delta\tau\to0$（すなわち $N\to\infty$）への外挿が必要です──これがこのチュートリアルのタイトルにある「外挿誤差」です。CT-HYB と CT-INT はそれぞれ異なる量（ハイブリダイゼーションと相互作用）を展開しますが、いずれも連続虚時間で直接定式化されているため、外挿すべき $\Delta\tau$ バイアスを持ちません。収束した両者の結果の違いは、純粋に統計的なものです。

### 出力データとプロット

各 DMFT 反復 $i$ において、自己エネルギーはファイル `selfenergy_i` に書き出されます。収束した自己エネルギーをプロットし、[Georges ら](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)の図15と結果を比較してください。あるいは、[DMFT-02 Hybridization](../dmft02#松原周波数グリーン関数と自己エネルギー) の松原周波数自己エネルギーのコードを応用して、python スクリプトでこの作業を行うこともできます。

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
from math import pi

listobs=['0']   # SYMMETRIZATION=1, so flavor 0 already represents both spins

## load the converged (final) G and G0 in Matsubara representation for both solvers
data_G = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_*.h5'), respath='/simulation/results/G_omega', what=listobs, verbose=False)
data_G0 = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_*.h5'), respath='/simulation/results/G0_omega', what=listobs, verbose=False)

for d_G, d_G0 in zip(pyalps.flatten(data_G), pyalps.flatten(data_G0)):
    d_G.x = np.array([(2.*n+1)*pi/d_G.props['BETA'] for n in d_G.x])
    Sigma = 1./d_G0.y - 1./d_G.y   # Dyson equation
    d_G.y = np.array(Sigma.imag)
    d_G.props['label'] = d_G.props['SOLVER']

plt.figure()
plt.xlabel(r'$i\omega_n$')
plt.ylabel(r'$Im\ \Sigma(i\omega_n)$')
plt.title('DMFT-06: paramagnetic self-energy, CT-HYB vs. CT-INT')
pyalps.plot.plot(list(pyalps.flatten(data_G)))
plt.legend()
plt.show()
```

これは確率的なモンテカルロシミュレーションであるため、実際に得られる数値は `SEED`、`MAX_TIME`、計算機の速度に依存しますが、`parm_hyb` と `parm_int` から得られる収束後の自己エネルギーは誤差の範囲内で互いに一致し、いずれも [Georges ら](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)の図15にある ED/Hirsch-Fye 曲線の低周波数側の振る舞いを、$\Delta\tau$ 外挿なしに再現するはずです。

### まとめと今後の課題

同じ常磁性金属の点で CT-HYB と CT-INT を実行し、両方を [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) の図15と比較することで、連続時間ソルバーが、離散時間手法に必要な $\Delta\tau\to0$ 外挿なしに、厳密なベンチマークを再現することが確認できました。

1. [DMFT-07 Hirsch-Fye](../dmft07) では同じ物理的な点を離散時間ソルバーで実行します。異なる `N`（時間スライス数）の値でこの実行を再現し、$\Delta\tau=\beta/N\to0$ に外挿してみましょう。外挿した結果は、ここで得られた CT-HYB／CT-INT の曲線とどのように比較されるでしょうか。
2. 固定した総実時間のもとで、収束した2つの自己エネルギーの誤差棒を比較してみましょう。この特定の $U$ と $\beta$ において、どちらのソルバーがより速く一定の統計精度に到達するでしょうか。
3. $\mathrm{Im}\,\Sigma(i\omega_n)$ の低周波数側の傾きは、準粒子の重み $Z$ に関係しています。収束した自己エネルギーから $Z$ を抽出し、この $U/D$ に対して [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) に記載されている値と比較してみましょう。
4. [DMFT-09 Néel Transition](../dmft09) では、同じ格子とソルバーを用いつつ `ANTIFERROMAGNET=1` として再検討します。磁気秩序を許した場合に、自己無撞着や収束の振る舞いがどのように変わるか比較してみましょう。
