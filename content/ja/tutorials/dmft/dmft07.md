
---
title: DMFT-07 Hirsch-Fye
math: true
toc: true
---

## Hirsch Fye Code

まず、離散時間モンテカルロコードである [Hirsch-Fye コード](https://doi.org/10.1103/PhysRevLett.56.2521)を実行します。チュートリアル02・03と同様に、[Georges らによる DMFT のレビュー論文](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)の図11を再現します。この6本の曲線は、相互作用 $U=3D/\sqrt{2}$ を持つベーテ格子上の半充填 Hubbard 模型が、冷却に伴って反強磁性相へと転移していく様子を示しています。

Hirsch-Fye アルゴリズムとそのオープンソース実装は、[Georges らによる DMFT のレビュー論文 (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) に解説されています。これ以降も多くの改良が行われてきましたが（例えば Alvarez (2008) や [Nukala et al. (2009)](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.80.195111) を参照してください）、このアルゴリズムは、以下で説明する系統的な離散化誤差を排除する[連続時間アルゴリズム](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.76.235123)（CT-HYB・CT-INT、チュートリアル02・03）に、その多くの用途において取って代わられました。

### 模型

チュートリアル02・03・06と同様に、単バンド Hubbard 模型

$$
\hat{H} = -t\sum_{\langle i,j\rangle,\sigma} \left(\hat{c}^\dagger_{i\sigma}\hat{c}_{j\sigma} + \text{h.c.}\right) + U\sum_i \hat{n}_{i\uparrow}\hat{n}_{i\downarrow} - \mu\sum_{i,\sigma}\hat{n}_{i\sigma}
$$

をベーテ格子上、半充填（$\mu=0$）で解きます。$t=0.707106781186547=1/\sqrt{2}$（半バンド幅 $D=2t=\sqrt{2}$）、$U=3$ とすることで、[Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) と同様に $U=3D/\sqrt{2}$ となります。チュートリアル02と同様、`ANTIFERROMAGNET=1` によりネール自己無撞着を有効にしているため、同じ物理的な点を様々な $\beta$ にわたって冷却することで、同じ金属-反強磁性絶縁体クロスオーバーが再現されます──今回は連続時間ソルバーではなく、[Hirsch and Fye (1986)](https://doi.org/10.1103/PhysRevLett.56.2521) による離散時間の Hirsch-Fye ソルバーを用いています。

### パラメータ

| パラメータ | 意味 | 使用する値 |
| :-------- | :------ | :------------ |
| `U` | オンサイト相互作用 | $3$ |
| `t` | 最近接ホッピング（ベーテ格子の半バンド幅 $D=2t$） | $0.707106781186547 = 1/\sqrt{2}$、$U=3D/\sqrt{2}$ となるように選ぶ |
| `BETA` | 逆温度 | $6, 8, 10, 12, 14, 16$（短縮版スクリプトでは $6, 12$ のみ） |
| `MU` | 化学ポテンシャル | $0$（半充填） |
| `H`, `H_INIT` | 量子化軸方向の磁場／初期外斯場を生成するための種となる磁場 | $0$ / $0.05$ |
| `FLAVORS` | スピンフレーバー数 | $2$ |
| `ANTIFERROMAGNET` | ネール自己無撞着を有効化 | $1$ |
| `SYMMETRIZATION` | 常磁性解を強制するか | $0$（反強磁性秩序を許すため） |
| `N` | 虚時間スライス数、$\Delta\tau=\beta/N$ | $16$──意図的に小さく設定。「手法の選択」参照 |
| `NMATSUBARA` | 自己無撞着計算で用いる松原周波数の上限 | $500$ |
| `OMEGA_LOOP` | 自己無撞着計算を松原周波数で行う | $1$ |
| `MAX_IT`, `CONVERGED` | 自己無撞着反復の最大回数／収束判定基準 | $10$、$0.005$（短縮版）；$18$、$0.003$（完全版） |
| `SOLVER` | 不純物ソルバー | `"hirschfye"` |
| `TOLERANCE` | Hirsch-Fye ソルバー内部で用いられる収束許容誤差 | $0.001$ |
| `SWEEPS`, `THERMALIZATION`, `MAX_TIME` | モンテカルロスイープ数の上限／熱化スイープ数／1反復あたりの実時間上限（秒） | $10^6$、$10^4$、$20$ |

### シミュレーションの実行

Hirsch-Fye シミュレーションは、1反復あたり約20秒かかります。このチュートリアルに必要なファイルはディレクトリ `tutorials/dmft-07-hirschfye` にあります。チュートリアル02・03と同様に、短縮版スクリプト [`tutorial7.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-07-hirschfye/tutorial7.py) を実行すると、6本のうち2本の曲線のみを再現します（実行時間の目安：約5分）。あるいは完全版スクリプト [`tutorial7_long.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-07-hirschfye/tutorial7_long.py) を実行すると、6本すべての曲線を再現します。

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot


#prepare the input parameters
parms=[]
for b in [6., 12.]:
    parms.append(
            { 
              'ANTIFERROMAGNET'     : 1,
              'CONVERGED'           : 0.005,
              'FLAVORS'             : 2,
              'H'                   : 0,
              'H_INIT'              : 0.05,
              'MAX_IT'              : 10,
              'MAX_TIME'            : 20,
              'MU'                  : 0,
              'N'                   : 16,
              'NMATSUBARA'          : 500, 
              'OMEGA_LOOP'          : 1,
              'SEED'                : 0, 
              'SITES'               : 1,
              'SOLVER'              : 'hirschfye',
              'SYMMETRIZATION'      : 0,
              'TOLERANCE'           : 0.001,
              'U'                   : 3,
              't'                   : 0.707106781186547,
              'SWEEPS'              : 1000000,
              'THERMALIZATION'      : 10000,
              'BETA'                : b
            }
        )

# For more precise simulation we propose to you to:
#   lower CONVERGED (to 0.0003) and TOLERANCE (to 0.0001) and increase MAX_TIME

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_beta_'+str(p['BETA']),p)
    res = pyalps.runDMFT(input_file)

listobs=['0', '1']
    
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_beta_*h5'), respath='/simulation/results/G_tau', what=listobs)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])+'; flavor='+str(d.props['observable'][len(d.props['observable'])-1])
plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor}(\tau)$')
plt.title('DMFT-07: Neel transition for the Hubbard model on the Bethe lattice\n(using the Hirsch-Fye impurity solver)')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

内部的には、`pyalps.runDMFT` は生成されたパラメータファイルに対して、反復ごとに `dmft` アプリケーションを直接呼び出します。

```
/path-to-alps-installation/bin/dmft parm_beta_6.0
/path-to-alps-installation/bin/dmft parm_beta_12.0
```

### パラメータファイル

上記のスクリプトによって生成される入力ファイル `parm_beta_6.0` に、コメントを加えたものです。

```
ANTIFERROMAGNET = 1                  // allow Neel order; meaningful for bipartite lattices in single-site DMFT
CONVERGED = 0.005                    // convergence criterion for the self-consistency iteration
FLAVORS = 2                          // flavors 0 and 1 correspond to spin up and down
H = 0                                // magnetic field along the quantization axis
H_INIT = 0.05                        // seed field for the initial Weiss field, breaks the up/down symmetry
MAX_IT = 10                          // maximum number of self-consistency iterations
MAX_TIME = 20                        // wall-clock time limit per iteration (seconds)
MU = 0                                // chemical potential; MU=0 is half filling for particle-hole symmetric models
N = 16                                // number of imaginary-time slices (Delta_tau = BETA/N); deliberately small, see Method choice
NMATSUBARA = 500                      // Matsubara cutoff used for the self-consistency
OMEGA_LOOP = 1                        // self-consistency runs in Matsubara frequencies
SEED = 0                              // Monte Carlo random number seed
SITES = 1                             // one impurity site, as in single-site DMFT
SOLVER = "hirschfye"                  // the discrete-time Hirsch-Fye solver
SYMMETRIZATION = 0                    // paramagnetic self-consistency is NOT enforced (we want AFM order)
TOLERANCE = 0.001                     // internal convergence tolerance of the Hirsch-Fye solver
U = 3                                 // interaction strength
t = 0.707106781186547                 // hopping; for the Bethe lattice considered here $W=2D=4t$
SWEEPS = 1000000                      // total sweeps
THERMALIZATION = 10000                // thermalization sweeps
BETA = 6.0                            // inverse temperature
```

これまでのチュートリアルと同様、格子やバンド構造を指定するパラメータはないため、デフォルトではベーテ格子が仮定されます（他の選択肢については [DMFT-08 格子](../dmft08) を参照）。初期外斯場は `H_INIT` を用いて非相互作用グリーン関数から計算されます。

### 格子

チュートリアル02・03・06と同様に、これは $z\to\infty$ 極限のベーテ格子上の単サイト DMFT です。ホッピングは $t=t^*/\sqrt{z}$ とスケールされ、半円形状態密度（半バンド幅 $D=2t$）が自己無撞着ループで解析的に評価されます（`OMEGA_LOOP=1`、`DOSFILE` は指定なし）。各サイトは同一のオンサイト相互作用 $U$ を、各ボンドは同一のホッピング $t$ を持ちます。

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

Hirsch-Fye は CT-HYB や CT-INT とはまったく異なる方法で動作します。$e^{-\beta \hat H}$ を幅 $\Delta\tau=\beta/N$ の $N$ 個の虚時間スライスにトロッター分解し、Hubbard-Stratonovich 変換によって各スライスに補助イジング場を導入し、$N\times N$ のグリーン関数行列を Sherman-Morrison 型の高速更新で更新します。1回のモンテカルロ更新のコストが $O(N^2)$、1スイープ全体では $O(N^3)$ となるため、$N$ は小さく保つ必要があります──ここでは $N=16$ です。これはチュートリアル02・03の連続時間ソルバーとは対照的で、そちらの `N` は単なる保存／補間用のビン数（通常 $500$〜$1000$）であり、計算コストとは無関係です。$N$ が小さいことの代償は、観測量に生じる $(\Delta\tau)^2$ のオーダーの系統的なバイアスです。これはまさに [DMFT-06](../dmft06) がバイアスを持たない連続時間ソルバーと対比している離散化誤差であり、Hirsch-Fye の結果を CT-HYB・CT-INT・厳密対角化と定量的に比較する前に、$\Delta\tau\to0$（$N\to\infty$）へ外挿しなければならない理由です。

### 出力データとプロット

結果の評価には、[DMFT-02 Hybridization](../dmft02) で説明した `tutorial2eval.py` を応用するか、`tutorial2eval.py` と構造的に同一である [`tutorial7eval.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-07-hirschfye/tutorial7eval.py) を使用できます。このスクリプトは、反復ごとの $G(\tau)$、占有数 $n_0=-G_0(\tau=\beta^-)$ の $\beta$ 依存性、そして（Dyson 方程式による）松原周波数のグリーン関数と自己エネルギーを、両方のフレーバーについてプロットします。

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
from math import pi


listobs=['0']   # we look at a single flavor (=0) 
res_files = pyalps.getResultFiles(pattern='parm_*.h5')  # we look for result files

## load all iterations of G_{flavor=0}(tau)
data = pyalps.loadDMFTIterations(res_files, observable="G_tau", measurements=listobs, verbose=False)

## create a figure for each BETA
grouped = pyalps.groupSets(pyalps.flatten(data), ['BETA'])
for sim in grouped:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## rescale x-axis and set label
    for d in sim:
        d.x = d.x * d.props['BETA']/float(d.props['N'])
        d.props['label'] = 'it'+d.props['iteration']
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$\tau$')
    plt.ylabel(r'$G_{flavor=0}(\tau)$')
    plt.title('Simulation at ' + r'$\beta = {beta}$'.format(beta= common_props['BETA']))
    pyalps.plot.plot(sim)
    plt.legend()

plt.show()

## load the final iteration of G_{flavor=0}(tau)
data_G_tau = pyalps.loadMeasurements(res_files, respath='/simulation/results/G_tau', what=listobs, verbose=False)  

print("Occupation in the last iteration at flavor=0")
for d in pyalps.flatten(data_G_tau):
    # obtain occupation using relation: <n_{flavor=0}> = -<G_{flavor=0}(tau=beta)>
    d.y = np.array([-d.y[-1]])
    print("n_0(beta =",d.props['BETA'],") =",d.y[0])
    d.x = np.array([0])
    d.props['observable'] = 'occupation'

occupation = pyalps.collectXY(data_G_tau, 'BETA', 'occupation')
for d in occupation:
    d.props['line']="scatter"

plt.figure()
pyalps.plot.plot(occupation)
plt.xlabel(r'$\beta$')
plt.ylabel(r'$n_{flavor=0}$')
plt.title('Occupation versus BETA')

plt.show()

## load all iterations of G_{flavor=0}(i omega_n)
data = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_*.h5'), observable="G_omega", measurements=listobs, verbose=False)

## create a figure for each BETA
grouped = pyalps.groupSets(pyalps.flatten(data), ['BETA'])
for sim in grouped:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## rescale x-axis and set label
    for d in sim:
        d.x = np.array([(2.*n+1)*pi/common_props['BETA'] for n in d.x])
        d.y = np.array(d.y.imag)
        d.props['label'] = "it"+d.props['iteration']
        d.props['line']="scatter"
        d.props['fillmarkers'] = False
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$i\omega_n$')
    plt.ylabel(r'$Im\ G_{flavor=0}(i\omega_n)$')
    plt.title('Simulation at ' + r'$\beta = {beta}$'.format(beta=common_props['BETA']))
    pyalps.plot.plot(sim)
    plt.legend()

plt.show()

## load all iterations of G_{flavor=0}(i omega_n) and G0_{flavor=0}(i omega_n)
data_G = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_*.h5'), observable="G_omega", measurements=listobs, verbose=False)
data_G0 = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_*.h5'), observable="G0_omega", measurements=listobs, verbose=False)

## create a figure for each BETA
grouped_G = pyalps.groupSets(pyalps.flatten(data_G), ['BETA','observable'])
for sim in grouped_G:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## compute selfenergy using the Dyson equation, rescale x-axis and set label
    for d_G in sim:
        # find corresponding dataset from data_G0
        d_G0 = [s for s in pyalps.flatten(data_G0) if s.props['iteration']==d_G.props['iteration'] and s.props['BETA']==common_props['BETA']][0]
        d_G.x = np.array([(2.*n+1)*pi/common_props['BETA'] for n in d_G.x])
        # Dyson equation
        Sigma = np.array([1./d_G0.y[w] - 1./d_G.y[w] for w in range(len(d_G.y))])
        d_G.y = np.array(Sigma.imag)
        d_G.props['label'] = "it"+d_G.props['iteration']
        d_G.props['line']="scatter"
        d_G.props['fillmarkers'] = False
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$i\omega_n$')
    plt.ylabel(r'$Im\ \Sigma_{flavor=0}(i\omega_n)$')
    plt.title('Simulation at ' + r'$\beta = {beta}$'.format(beta=common_props['BETA']))
    pyalps.plot.plot(sim)
    plt.legend()

plt.show()
```

これは確率的なモンテカルロシミュレーションであるため、実際に得られる数値は `SEED`、`MAX_TIME`、計算機の速度に依存しますが、チュートリアル02・03と同様に、短縮版スクリプトを実行すると図11の定性的な特徴が再現されるはずです。$\beta=6$ では両方のフレーバーの $G(\tau)$ がほぼ一致し（常磁性・金属的）、$\beta=12$ では分裂します（反強磁性秩序）。$N=16$ は小さいため、同じ $\beta$ におけるチュートリアル02・03の連続時間の結果と比較して、目に見えるずれが生じることが予想されます──このずれが、上で説明した $\Delta\tau$ 離散化誤差です。

### まとめと今後の課題

離散時間法である Hirsch-Fye は、CT-HYB や CT-INT にはない $\Delta\tau$ 離散化誤差の影響を受けます。ここで同じネール転移を再現し、チュートリアル02・03と比較して目に見えるずれが生じたことは、連続時間アルゴリズムの多くの用途において Hirsch-Fye がほぼ置き換えられてきた理由を具体的に示しています。

1. 1つの $(U,\beta)$ の組を選び、$N$ を徐々に大きくしながら（例えば $8, 16, 32, 64$）再実行してみましょう。$N$ を増やすにつれて、収束した $G(\tau)$ は CT-HYB・CT-INT の結果に近づいていくでしょうか。データを $(\Delta\tau)^2=(\beta/N)^2$ に対して $N\to\infty$ へ外挿してみましょう。
2. [DMFT-06](../dmft06) では、CT-HYB と CT-INT を、[Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) の図15にある厳密対角化／Hirsch-Fye のベンチマークと直接比較しています。文献の曲線の代わりに、課題1で得た外挿済みの Hirsch-Fye の結果を用いて、この比較を自分で再現してみましょう。
3. 固定した実行時間のもとで、Hirsch-Fye の $G(\tau)$ の統計的ノイズは、同じ $\beta$ における CT-HYB（チュートリアル02）と比べてどうでしょうか。離散化誤差を減らすために $N$ を増やすと、ノイズや実行時間、あるいはその両方が増加するでしょうか。
4. [DMFT-09 Néel Transition](../dmft09) では、この Hirsch-Fye の計算を CT-HYB（チュートリアル02）と CT-INT（チュートリアル03）の結果と組み合わせて、1つの比較にまとめています。自分自身でこの比較を再現してみましょう。
