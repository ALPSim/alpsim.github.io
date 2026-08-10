
---
title: DMFT-04 Mott
math: true
toc: true
---

## Mott Transition

モット転移は、多くの物質（例えば遷移金属化合物）において、圧力やドーピングの関数として生じる金属-絶縁体転移（MIT）です。[Imada, Fujimori, Tokura によるレビュー論文、Rev. Mod. Phys. 70, 1039 (1998)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.70.1039) はこのテーマへの優れた入門であり、代表例として $V_2O_3$ や有機物を挙げています。

関連する物理が本質的に局所的（あるいは波数 k に依存しない）であるため、MIT は DMFT によって容易に調べることができます。半充填の場合、MIT は $\omega=0$ に極を持つ自己エネルギーによってモデル化することができ、この極が非相互作用バンドを上部・下部の Hubbard バンドに分裂させます。この文脈では、反強磁性の長距離秩序を抑制し、DMFT シミュレーションにおいて常磁性解を強制することで、常磁性絶縁相を模擬するのが有益です。そのために、グリーン関数のスピンアップ成分とスピンダウン成分を対称化します（パラメータ `SYMMETRIZATION = 1;`）。

### 模型

チュートリアル02・03と同様に、DMFT はベーテ格子上の単バンド Hubbard 模型

$$
\hat{H} = -t\sum_{\langle i,j\rangle,\sigma} \left(\hat{c}^\dagger_{i\sigma}\hat{c}_{j\sigma} + \text{h.c.}\right) + U\sum_i \hat{n}_{i\uparrow}\hat{n}_{i\downarrow} - \mu\sum_{i,\sigma}\hat{n}_{i\sigma}
$$

に対して半充填（$\mu=0$）で適用されます。ここでは相互作用 $U$ を固定した逆温度 $\beta t=20$ のもとで走査します。この温度は、反強磁性秩序を抑制した後の常磁性解がほぼゼロ温度極限の形に達するのに十分低い温度です。物理的背景については [Imada, Fujimori, Tokura (1998)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.70.1039) を、DMFT への写像については [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) を参照してください。

### パラメータ

| パラメータ | 意味 | 使用する値 |
| :-------- | :------ | :------------ |
| `U` | 転移を横切るように走査するオンサイト相互作用 | $4, 5, 6, 8$ |
| `t` | 最近接ホッピング（ベーテ格子の半バンド幅 $D=2t$、バンド幅 $W=4t$） | $1$ |
| `BETA` | $U$ を変える間固定する逆温度 | $20$ |
| `MU` | 化学ポテンシャル | $0$（半充填） |
| `H`, `H_INIT` | 量子化軸方向の磁場／初期外斯場を生成する種となる磁場 | $0$ / $0$（対称性の破れなし──「手法の選択」参照） |
| `FLAVORS` | スピンフレーバー数 | $2$ |
| `ANTIFERROMAGNET` | ネール自己無撞着を有効化 | $0$（無効──「手法の選択」参照） |
| `SYMMETRIZATION` | 常磁性解を強制（フレーバー0と1を対称化） | $1$ |
| `N`, `NMATSUBARA` | $G$ と $G_0$ の虚時間／松原周波数離散化数 | $500$ |
| `OMEGA_LOOP` | 自己無撞着計算を松原周波数で行う | $1$ |
| `MAX_IT`, `CONVERGED` | 自己無撞着反復の最大回数／収束判定基準 | $20$、$0.001$ |
| `SOLVER` | 不純物ソルバー | `"hybridization"`（CT-HYB） |
| `N_ORDER` | ハイブリダイゼーション展開次数のヒストグラムサイズ | $50$ |
| `N_MEAS` | 測定間のモンテカルロ更新回数 | $1000$ |
| `SC_WRITE_DELTA` | ソルバー用にハイブリダイゼーション関数を出力する | $1$ |
| `CHECKPOINT` | チェックポイント／再開用ファイルのファイル名接頭辞 | `solverdump_U_`+`U` |
| `SWEEPS`, `THERMALIZATION`, `MAX_TIME` | モンテカルロスイープ数の上限（$U$ に応じてスケール）／熱化スイープ数／1反復あたりの実時間上限（秒） | $1500\,U$、$500$、$600$ |

### シミュレーションの実行

python でシミュレーションを実行するには、[`tutorial4a.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-04-mott/tutorial4a.py) を使用します。

```    
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot

#prepare the input parameters
parms=[]
for u in [4.,5.,6.,8.]: 
    parms.append(
            { 
              'ANTIFERROMAGNET'         : 0,
              'CHECKPOINT'              : 'solverdump_U_'+str(u),
              'CONVERGED'               : 0.001,
              'FLAVORS'                 : 2,
              'H'                       : 0,
              'H_INIT'                  : 0.,
              'MAX_IT'                  : 20,
              'MAX_TIME'                : 600,
              'MU'                      : 0,
              'N'                       : 500,
              'NMATSUBARA'              : 500, 
              'N_MEAS'                  : 1000,
              'N_ORDER'                 : 50,
              'OMEGA_LOOP'              : 1,
              'SEED'                    : 0, 
              'SITES'                   : 1,              
              'SOLVER'                  : 'hybridization',
              'SC_WRITE_DELTA'          : 1,
              'SYMMETRIZATION'          : 1,
              't'                       : 1,
              'SWEEPS'                  : 1500*u,
              'BETA'                    : 20.0,
              'THERMALIZATION'          : 500,
              'U'                       : u
            }
        )

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_u_'+str(p['U']),p)
    res = pyalps.runDMFT(input_file)
```

これまでのチュートリアルと同様に、`pyalps.runDMFT` は生成された各パラメータファイルに対して、反復ごとに `dmft` アプリケーションを直接呼び出します。

```
/path-to-alps-installation/bin/dmft parm_u_4.0
/path-to-alps-installation/bin/dmft parm_u_5.0
/path-to-alps-installation/bin/dmft parm_u_6.0
/path-to-alps-installation/bin/dmft parm_u_8.0
```

### パラメータファイル

上記のスクリプトによって生成される入力ファイル `parm_u_4.0` に、コメントを加えたものです。

```
ANTIFERROMAGNET = 0                  // suppress Neel order to access the paramagnetic Mott solution
CHECKPOINT = solverdump_U_4.0        // filename prefix for checkpoint/restart files
CONVERGED = 0.001                    // convergence criterion for the self-consistency iteration
FLAVORS = 2                          // flavors 0 and 1 correspond to spin up and down
H = 0                                // magnetic field along the quantization axis
H_INIT = 0.                          // no symmetry-breaking seed field for the initial Weiss field
MAX_IT = 20                          // maximum number of self-consistency iterations
MAX_TIME = 600                       // wall-clock time limit per iteration (seconds)
MU = 0                               // chemical potential; MU=0 is half filling
N = 500                              // discretization of the imaginary-time Green's function
NMATSUBARA = 500                     // cutoff for Matsubara frequencies
N_MEAS = 1000                        // number of updates between measurements
N_ORDER = 50                         // histogram size for the hybridization expansion order
OMEGA_LOOP = 1                       // self-consistency runs in Matsubara frequencies
SEED = 0                             // Monte Carlo random number seed
SITES = 1                            // one impurity site, as in single-site DMFT
SOLVER = "hybridization"             // the CT-HYB solver
SC_WRITE_DELTA = 1                   // write out the hybridization function for the solver
SYMMETRIZATION = 1                   // enforce a paramagnetic solution (flavors 0 and 1 symmetrized)
t = 1                                // hopping; for the Bethe lattice considered here $W=2D=4t$
SWEEPS = 6000                        // total sweeps (1500*U at U=4)
BETA = 20.0                          // inverse temperature
THERMALIZATION = 500                 // thermalization sweeps
U = 4                                // interaction strength
```

### 格子

チュートリアル02・03と同様に、ここでの単サイト DMFT は無限配位数 $z\to\infty$ の極限におけるベーテ格子を用います。ホッピングは $t=t^*/\sqrt{z}$ とスケールされ、半円形状態密度（半バンド幅 $D=2t$）が自己無撞着ループで解析的に評価できるようになっています（`OMEGA_LOOP=1`、`DOSFILE` は指定なし）。各サイトは同一のオンサイト相互作用 $U$ を、各ボンドは同一のホッピング $t$ を持ちます。

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

他の格子で自己無撞着計算を行う方法については [DMFT-08 格子](../dmft08) を、明示的な有限格子に基づくシミュレーションについては [ALPS 格子ライブラリ](../../../documentation/intro/latticehowtos) を参照してください。

### 手法の選択

ここでは（[DMFT-03 Interaction](../dmft03) の）相互作用展開ソルバー CT-INT ではなく、（[DMFT-02 Hybridization](../dmft02) と同じ）ハイブリダイゼーション展開ソルバー CT-HYB を用います。CT-INT の平均展開次数はおおよそ $\beta U$ に比例して増大するため、$\beta t=20$ かつ $U/t$ が最大 $8$ に及ぶこの計算では CT-INT のコストが大きくなってしまいます。一方 CT-HYB は浴とのハイブリダイゼーションを展開するため、絶縁相の深いところでは有効な低エネルギー結合が抑制され（不純物は原子極限に近づく）、$U$ が増大しても平均ハイブリダイゼーション次数は扱いやすい範囲に留まります──これは CT-INT とは逆のスケーリングです。このため、金属相からモット絶縁体へと解を追跡するには CT-HYB が自然な選択となります。

また、ここでは意図的に `ANTIFERROMAGNET = 0` と `SYMMETRIZATION = 1` を設定しています。（2部性を持つ）ベーテ格子上の半充填では、事実上あらゆる $U>0$ に対して低温では反強磁性秩序が勝ってしまい、ここで扱う常磁性モット転移が覆い隠されてしまいます。ネール自己無撞着を抑制し対称な（常磁性）解を強制することで、相互作用駆動の MIT を分離することができ、これは実際のモット物質において磁気秩序を抑制する幾何学的フラストレーションの効果を模したものになっています。

### 金属-絶縁体転移の特定

固定温度 $\beta t=20$ のもとで、相互作用の関数として単一格子 DMFT におけるモット転移を調べます（例えば[この論文](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.76.235123)の図2を参照してください）。非相互作用解から出発すると、虚時間グリーン関数において、$U/t \leq 4.5$ では金属的な解となり、$U/t\geq 5$ では絶縁的な解となることがわかります。絶縁的な（あるいは原子極限の）解から出発し、より小さな $U$ で収束させようとすることで、共存領域を見つけることができます。

虚時間グリーン関数は解釈が容易ではないため、多くの研究者は[解析接続法（例えば最大エントロピー法）](https://doi.org/10.1016/0370-1573%2895%2900074-7)を用います。しかし、はっきりとした特徴が2つあります。まず、$\tau=\beta$ における値は $-n$、すなわち（スピンあたりの）密度の負の値に対応します。もう一つの特徴は、温度を下げていくと（$\beta\rightarrow\infty$）、$-\beta G(\beta/2) \rightarrow \pi A(0)$ となることです。ここで $A(0)$ はフェルミエネルギーにおけるスペクトル関数です。したがって、虚時間グリーン関数の温度依存性から、系が金属的か絶縁的かをただちに見て取ることができます。グリーン関数の振る舞いをより詳しく見るために、対数スケールでデータをプロットします。

```
listobs=['0']   # we look at only one flavor, as they are SYMMETRIZED
    
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_u_*h5'), respath='/simulation/results/G_tau', what=listobs, verbose=True)

for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.y = -d.y
    d.props['label'] = r'$U=$'+str(d.props['U'])
plt.figure()
plt.yscale('log')
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor=0}(\tau)$')
plt.title('DMFT-04: Mott-insulator transition for the Hubbard model on the Bethe lattice')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

固定した $\beta$ のもとで、$U$ が小さいときには金属的な解が、$U$ が大きいときには絶縁的な解が得られることが確認できるはずです。最大の $U$ の値は、絶縁相の深いところにあります。

### 収束の確認

収束は [`tutorial4b.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-04-mott/tutorial4b.py) で確認できます。

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot


## Please run the tutorial4a.py before this one

listobs = ['0']   # we look at convergence of a single flavor (=0) 

## load all results
data = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_u_*.h5'), measurements=listobs, verbose=True)

## create a figure for each BETA
grouped = pyalps.groupSets(pyalps.flatten(data), ['U','observable'])
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
    plt.title('DMFT-04: ' + r'$U = %.4s$' % common_props['U'])
    pyalps.plot.plot(sim)
    plt.legend()
    plt.yscale("log")

plt.show()
```

### まとめと今後の課題

反強磁性秩序を抑制し、固定した $\beta t=20$ のもとで $U$ を走査することで、ベーテ格子上の半充填 Hubbard 模型における常磁性モット転移が $U/t=4.5$ から $U/t=5$ の間に位置することを確認しました。これは [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) がまとめた DMFT の相図と一致します。

1. `ANTIFERROMAGNET = 1`（[DMFT-02 Hybridization](../dmft02) と同様）に設定し、同じ $U$ の値で再実行してみましょう。反強磁性不安定性は、ここで扱った常磁性解を覆い隠してしまうでしょうか。
2. モット転移は低温で1次転移であるため、金属解と絶縁解が共存し得ます。収束した絶縁解の `G0omega_output` を新しい `G0OMEGA_INPUT` にコピーし、絶縁体側からより小さな $U$ の点を収束させてみましょう。絶縁解は $U/t\approx4.5$ よりどこまで下まで存在し続けるでしょうか。
3. より高温（`BETA` を小さく）で同じ走査を繰り返してみましょう。見かけの転移はより滑らかになり、有限温度の臨界点で終わる1次転移線と整合するでしょうか。
4. $U=8$ における CT-HYB の計算を、同じ点での CT-INT（チュートリアル03のソルバー）の計算と比較してみましょう。上記「手法の選択」節で述べたスケーリングを踏まえると、どちらのソルバーがより速く収束するでしょうか。

