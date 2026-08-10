
---
title: DMFT-03 Interaction
math: true
toc: true
---

## 相互作用展開 CT-INT

[DMFT-02 Hybridization](../dmft02) と同じ計算を、別の連続時間量子モンテカルロ不純物ソルバーである相互作用展開アルゴリズム CT-INT を用いて繰り返します。（CT-HYB のように）不純物と浴のハイブリダイゼーションを展開する代わりに、CT-INT は相互作用 $U$ のべき級数として展開し、[Rubtsov, Savkin, Lichtenstein, Phys. Rev. B 72, 035122 (2005)](https://doi.org/10.1103/PhysRevB.72.035122) に従って補助イジング場を用いてダイアグラムを確率的にサンプリングします。非相互作用極限のまわりで展開するため、CT-INT は弱〜中程度の結合領域で最も効率が良く、チュートリアル02で用いた強結合向けの CT-HYB ソルバーと相補的な関係にあります。

チュートリアル02と同様に、[Georges, Kotliar, Krauth, Rozenberg によるDMFTレビュー論文、Rev. Mod. Phys. 68, 13 (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) の図11を再現します。これは、ベーテ格子上の半充填単バンド Hubbard 模型が、温度を下げるにつれて反強磁性相へ転移していく様子を示す一連の曲線です。

### 模型

DMFT が自己無撞着に解く格子模型は、単バンド Hubbard 模型

$$
\hat{H} = -t\sum_{\langle i,j\rangle,\sigma} \left(\hat{c}^\dagger_{i\sigma}\hat{c}_{j\sigma} + \text{h.c.}\right) + U\sum_i \hat{n}_{i\uparrow}\hat{n}_{i\downarrow} - \mu\sum_{i,\sigma}\hat{n}_{i\sigma}
$$

であり、最近接ホッピング $t$、オンサイト相互作用 $U$、化学ポテンシャル $\mu$（粒子・空孔対称性により半充填では $\mu=0$）を持ちます。この格子模型を自己無撞着な量子不純物問題へと写像する DMFT の導出については [Georges らのレビュー論文 (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) を、ここで用いる CT-INT アルゴリズムについては [Rubtsov, Savkin, Lichtenstein (2005)](https://doi.org/10.1103/PhysRevB.72.035122) を参照してください。

### パラメータ

| パラメータ | 意味 | 使用する値 |
| :-------- | :------ | :------------ |
| `U` | オンサイト相互作用 | $3$ |
| `t` | 最近接ホッピング（ベーテ格子の半バンド幅 $D=2t$） | $0.707106781186547 = 1/\sqrt{2}$、Georges らの図11と同様に $U=3D/\sqrt{2}$ となるように選ぶ |
| `BETA` | 逆温度 | $6, 8, 10, 12, 14, 16$（短縮版スクリプトでは $6, 12$ のみ） |
| `MU` | 化学ポテンシャル | $0$（半充填） |
| `H`, `H_INIT` | 量子化軸方向の磁場／初期外斯場を生成するための対称性破れの種となる磁場 | $0$ / $0.05$ |
| `FLAVORS` | スピンフレーバー数 | $2$ |
| `ANTIFERROMAGNET` | ネール型（2副格子）自己無撞着を有効化 | $1$ |
| `SYMMETRIZATION` | 常磁性解を強制するか | $0$（反強磁性秩序を許すため） |
| `N`, `NMATSUBARA` | $G$ と $G_0$ の虚時間／松原周波数離散化数 | $500$ |
| `OMEGA_LOOP` | 自己無撞着計算を松原周波数で行う | $1$ |
| `MAX_IT`, `CONVERGED` | 自己無撞着反復の最大回数／収束判定基準 | $10$、$0.005$（短縮版）；$18$、$0.003$（完全版） |
| `SOLVER` | 不純物ソルバー | `"Interaction Expansion"` |
| `ALPHA` | CT-INT で符号問題を制御するために用いる補助イジング場のシフト量。[Rubtsov et al. (2005)](https://doi.org/10.1103/PhysRevB.72.035122) 参照 | $-0.01$ |
| `HISTOGRAM_MEASUREMENT` | 展開次数のヒストグラムを記録する | $1$ |
| `SWEEPS`, `THERMALIZATION`, `MAX_TIME` | モンテカルロスイープ数の上限／熱化スイープ数／1反復あたりの実時間上限（秒） | $10^8$、$1000$、$10$ |

### シミュレーションの実行

このチュートリアルに必要なファイルはディレクトリ `tutorials/dmft-03-interaction` にあります。チュートリアル02と同様に、短縮版スクリプト [`tutorial3.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3.py) を実行すると、6本のうち2本の曲線のみを再現します（実行時間の目安：約10分）。あるいは完全版スクリプト [`tutorial3_long.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3_long.py) を実行すると、6本すべての曲線を再現します（実行時間の目安：約30分）。この弱結合領域では CT-INT が CT-HYB よりも短時間で同程度の統計精度に到達するため、`MAX_TIME` はチュートリアル02（1反復あたり300秒）よりもずっと短い、1反復あたり10秒に設定されています。

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
              'ANTIFERROMAGNET'         : 1,
              'CONVERGED'               : 0.005,
              'FLAVORS'                 : 2,
              'H'                       : 0,
              'H_INIT'                  : 0.05,
              'MAX_IT'                  : 10,
              'MAX_TIME'                : 10,
              'MU'                      : 0,
              'N'                       : 500,
              'NMATSUBARA'              : 500,
              'OMEGA_LOOP'              : 1,
              'SEED'                    : 0,
              'SITES'                   : 1,
              'SOLVER'                  : 'Interaction Expansion',
              'SYMMETRIZATION'          : 0,
              'U'                       : 3,
              't'                       : 0.707106781186547,
              'SWEEPS'                  : 100000000,
              'THERMALIZATION'          : 1000,
              'ALPHA'                   : -0.01,
              'HISTOGRAM_MEASUREMENT'   : 1,
              'BETA'                    : b
            }
        )

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_beta_'+str(p['BETA']),p)
    res = pyalps.runDMFT(input_file)
```

内部的には、`pyalps.runDMFT` は生成されたパラメータファイルに対して、反復ごとに `dmft` アプリケーションを直接呼び出します。

```
/path-to-alps-installation/bin/dmft parm_beta_6.0
/path-to-alps-installation/bin/dmft parm_beta_12.0
```

有限格子を扱う他の ALPS アプリケーションとは異なり、`dmft` コードはプレーンテキストのパラメータファイルを直接読み込みます（`parameter2xml` による前処理は不要です）。

### パラメータファイル

上記のスクリプトによって生成される入力ファイル `parm_beta_6.0` に、コメントを加えたものです。

```
H_INIT = 0.05                        // seed field for the initial Weiss field, breaks the up/down symmetry
ANTIFERROMAGNET = 1                  // allow Neel order; meaningful for bipartite lattices in single-site DMFT
SEED = 0                             // Monte Carlo random number seed
CONVERGED = 0.005                    // convergence criterion for the self-consistency iteration
MAX_IT = 10                          // maximum number of self-consistency iterations
SWEEPS = 100000000                   // upper bound on sweeps; in practice MAX_TIME stops the run first
FLAVORS = 2                          // flavors 0 and 1 correspond to spin up and down
SYMMETRIZATION = 0                   // paramagnetic self-consistency is NOT enforced (we want AFM order)
NMATSUBARA = 500                     // cutoff for Matsubara frequencies
H = 0                                // magnetic field along the quantization axis
OMEGA_LOOP = 1                       // self-consistency runs in Matsubara frequencies
SITES = 1                            // one impurity site, as in single-site DMFT
N = 500                              // discretization of the imaginary-time Green's function
BETA = 6.0                           // inverse temperature
U = 3                                // interaction strength
MAX_TIME = 10                        // wall-clock time limit per iteration (seconds)
ALPHA = -0.01                        // shift of the auxiliary Ising field (CT-INT sign-problem control)
HISTOGRAM_MEASUREMENT = 1            // record a histogram of the CT-INT perturbation order
SOLVER = "Interaction Expansion"     // the CT-INT solver
THERMALIZATION = 1000                // thermalization sweeps
MU = 0                               // chemical potential; MU=0 is half filling for particle-hole symmetric models
t = 0.707106781187                   // hopping; for the Bethe lattice considered here $W=2D=4t$
```

チュートリアル02と同様に、格子やバンド構造を指定するパラメータはありません。デフォルトではベーテ格子が仮定されます（他の選択肢については [DMFT-08 格子](../dmft08) を参照）。また `G0OMEGA_INPUT`/`G0TAU_INPUT` も指定されていないため、初期外斯場は `H_INIT` を用いて非相互作用グリーン関数から計算されます。

### 格子

単サイト DMFT では、格子模型は自己無撞着に決定される外斯場に結合した量子不純物問題へと写像され、有限クラスターを直接対角化することはありません。ここで自己無撞着計算に用いられる格子は、無限配位数 $z\to\infty$ の極限におけるベーテ格子であり、状態密度が有限に保たれるようホッピングは $t=t^*/\sqrt{z}$ とスケールされます。この極限は半バンド幅 $D=2t^*$ の半円形状態密度を与え、DMFT の自己無撞着計算はこれを解析的に評価します（`DOSFILE` を指定しない `OMEGA_LOOP=1`）。各サイトは同一のオンサイト相互作用 $U$ を、各ボンドは同一の（スケールされた）ホッピング $t$ を持ちます。

```
        o       o
         \     /
      t   \   /   t
           \ /
        o---o---o          o : 格子サイト、オンサイト相互作用 U
           / \              --- : ボンド、ホッピング振幅 t
          /   \
         /     \
        o       o
```

ベーテ格子が入門的な単サイト DMFT の標準的な選択とされているのは、その半円形状態密度が閉じた形の自己無撞着関係式を与え、他の格子で必要となる波数空間積分を回避できるためです（他の格子や、明示的な有限格子に基づくシミュレーションについては [DMFT-08 格子](../dmft08) と [ALPS 格子ライブラリ](../../../documentation/intro/latticehowtos) を参照してください）。

### 手法の選択

CT-INT と CT-HYB は同じ不純物問題を異なる図式展開で解いており、両者を比較することは、ソルバーに依存しない DMFT の物理を確認する良い手段になります。CT-HYB（チュートリアル02）はハイブリダイゼーションを展開するため強結合で有効に働き、$U$ が大きくても展開次数は比較的小さく保たれます。一方 CT-INT は $U$ を展開するため、平均的な展開次数はおおよそ $\beta U$ に比例して増大し、本チュートリアルで扱う弱〜中程度の結合領域（$U=3D/\sqrt{2}$）で最も効率が良くなります。不純物自体は厳密対角化が容易です（`FLAVORS=2` の単一サイトは、空、スピンアップ単占有、スピンダウン単占有、二重占有の $2^2=4$ 個の局所状態しか持ちません）。計算コストは厳密対角化ではなく、摂動級数の確率的サンプリングにすべて集約されます。このため、CT-HYB（1反復あたり300秒）よりもはるかに短い `MAX_TIME`（1反復あたり10秒）でも転移を捉えることができます。

### 出力データとプロット

結果の評価は [DMFT-02 Hybridization](../dmft02) とまったく同じ方法で、[`tutorial3eval.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3eval.py)（`tutorial2eval.py` と構造は同一）を用いて行えます。まず、`tutorial3.py` に続けて実行される、両フレーバーの虚時間グリーン関数のプロットです。

```
listobs=['0', '1']   # we will plot both flavors 0 and 1

data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_beta_*h5'), respath='/simulation/results/G_tau', what=listobs)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])+'; flavor='+str(d.props['observable'][len(d.props['observable'])-1])

plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor}(\tau)$')
plt.title('DMFT-03: Neel transition for the Hubbard model on the Bethe lattice\n(using the Interaction expansion impurity solver)')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

フレーバー0の占有数 $n_0=-G_0(\tau=\beta^-)$ を $\beta$ に対してプロットするコード（`tutorial3eval.py` の一部）です。

```
listobs=['0']
res_files = pyalps.getResultFiles(pattern='parm_*.h5')

data_G_tau = pyalps.loadMeasurements(res_files, respath='/simulation/results/G_tau', what=listobs, verbose=False)

print("Occupation in the last iteration at flavor=0")
for d in pyalps.flatten(data_G_tau):
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
```

同じスクリプトは、[DMFT-02 Hybridization](../dmft02#収束の確認) で詳しく説明した、反復ごとの収束プロットや松原周波数グリーン関数・自己エネルギーのプロットも再現します。コード自体は、基となる `.h5` ファイルを生成するソルバーが異なるだけで変更はありません。両ソルバーとも同じ ALPS 出力スキーマに結果を書き込むためです。

これは確率的なモンテカルロシミュレーションであるため、実際に得られる数値は `SEED`、`MAX_TIME`、計算機の速度に依存します。短縮版スクリプトを実行すると、図11の定性的な特徴、すなわち $\beta=6$ では2つのフレーバーの $G(\tau)$ がほぼ一致する（常磁性・金属的）のに対し、$\beta=12$ では明確に分裂する（反強磁性秩序が発生している）様子が再現され、チュートリアル02の CT-HYB ですでに見た傾向と一致するはずです。

### まとめと今後の課題

異なる不純物ソルバー──ここでの CT-INT とチュートリアル02の CT-HYB──で同じネール転移を再現できたことは、この転移が特定のモンテカルロアルゴリズムに固有の産物ではなく、DMFT の自己無撞着条件と格子模型そのものに由来する性質であることを裏付けています。

1. `MAX_TIME` を固定したとき、$\beta=12$ での $G(\tau)$ の誤差はCT-INTとCT-HYBのどちらが小さいでしょうか。$U$ を大きくして [DMFT-04 Mott](../dmft04) で扱うモット転移に近づけると、この答えはどう変わるでしょうか。
2. `HISTOGRAM_MEASUREMENT=1` によって出力される展開次数のヒストグラムをプロットし、その平均値が $\beta$ と $U$ に対してどのようにスケールするかを確認してみましょう。
3. `ALPHA` の値を変えてみましょう：$-0.01$ から $0$ に近づけると、低温での符号問題の深刻さは変化するでしょうか。
4. [DMFT-09 Néel Transition](../dmft09) では、この CT-INT の結果と CT-HYB（チュートリアル02）、Hirsch-Fye（チュートリアル07）の結果を一つの比較にまとめています。自分自身でこの比較を再現してみましょう。
