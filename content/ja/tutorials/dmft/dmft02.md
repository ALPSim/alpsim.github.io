
---
title: DMFT-02 Hybridization
math: true
toc: true
---

## ハイブリダイゼーション展開 CT-HYB

まず、連続時間量子モンテカルロコードであるハイブリダイゼーション展開アルゴリズム CT-HYB を実行します。例として、[Georges らによる DMFT のレビュー論文、Rev. Mod. Phys. 68, 13 (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) の図11を再現します。この6本の曲線は、相互作用 $U=3D/\sqrt{2}$ を持つベーテ格子上の半充填 Hubbard 模型が、冷却に伴って反強磁性相へと転移していく様子を示しています。チュートリアル03と07では、それぞれ相互作用展開の連続時間ソルバーと、離散時間の Hirsch-Fye 量子モンテカルロコードを用いて同じ結果を再現します。入力パラメータは、ソルバーに関連する一部のパラメータを除いて同じです。

### シミュレーションの実行

上記の図11にある6本の曲線すべてを再現する場合、CT-HYB シミュレーションは全体で約1時間かかります。このチュートリアルに必要なファイルはディレクトリ `tutorials/dmft-02-hybridization` にあります。

すべての DMFT チュートリアルは python スクリプトを用いて実行できます。このスクリプトはパラメータファイルを生成し、それらを実行し、結果をプロットします。短縮版のスクリプト [`tutorial2.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-02-hybridization/tutorial2.py) を実行すると、6本のうち2本の曲線のみを再現します（実行時間の目安：約20分）。あるいは完全版のスクリプト [`tutorial2_long.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-02-hybridization/tutorial2_long.py) を実行すると、図の6本すべての曲線を再現します（実行時間の目安：約1時間）。

python スクリプト `tutorial2.py` は、2つのシミュレーション用の入力ファイル `parm_beta_6.0` と `parm_beta_12.0` を自動的に準備し、それらを実行します（`/path-to-alps-installation/bin/dmft parm_beta_x`）。

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
             'CONVERGED'           : 0.003,
             'FLAVORS'             : 2,
             'H'                   : 0,
             'H_INIT'              : 0.03*b/8.,
             'MAX_IT'              : 6,
             'MAX_TIME'            : 300,
             'MU'                  : 0,
             'N'                   : 250,
             'NMATSUBARA'          : 250,
             'N_MEAS'              : 10000,
             'OMEGA_LOOP'          : 1,
             'SEED'                : 0,
             'SITES'               : 1,
             'SOLVER'              : 'hybridization',
             'SC_WRITE_DELTA'      : 1,
             'SYMMETRIZATION'      : 0,
             'U'                   : 3,
             't'                   : 0.707106781186547,
             'SWEEPS'              : int(10000*b/16.),
             'THERMALIZATION'      : 1000,
             'BETA'                : b
        }
    )


#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_beta_'+str(p['BETA']),p)
    res = pyalps.runDMFT(input_file)
```

### 入力パラメータの解説

上記のスクリプトによって生成される入力ファイル `parm_beta_6.0` に、パラメータの説明を加えたものです。

```
H_INIT = 0.0225   //  initial magnetic field in the direction of quantization axis, to produce the initial Weiss field
ANTIFERROMAGNET = 1   // allow antiferromagnetic ordering; in single site DMFT it is meaningfull only for bipartite lattices
SEED = 0   // Monte Carlo Random Number Seed 
CONVERGED = 0.003   // criterion for the convergency of the iterations
MAX_IT = 6   // upper limit on the number of iterations (the selfconsistency may be stopped before if criterion based on CONVERGED is reached)
SWEEPS = 3750   // Total number of sweeps to be computed (the solver may be stopped before reaching this limit on run-time limit set by MAX_TIME)
FLAVORS = 2   // flavors 0 and 1 correspond to spin up and down
SYMMETRIZATION = 0   // We are not enforcing a paramagnetic self consistency condition (symmetry in flavor 0 and 1)
NMATSUBARA = 250   // The cut-off for Matsubara frequencies 
H = 0   // Magnetic field in the direction of quantization axis
OMEGA_LOOP = 1   // the selfconsistency runs in Matsubara frequencies
SITES = 1   // number of sites of the impurity: for single site DMFT simulation it is 1
N = 250   // auxiliary discretization of the imaginary-time Green's function
BETA = 6.0   // Inverse temperature
U = 3   // Interaction strength
MAX_TIME = 300   // Upper time limit in seconds to run the impurity solver (per iteration)
SC_WRITE_DELTA = 1   // option for selfconsistency to write the hybridization function for the impurity solver
N_MEAS = 10000   // number of updates in between measurements
SOLVER = "hybridization"   // The Hybridization solver
THERMALIZATION = 1000   // Thermalization Sweeps 
MU = 0   // Chemical potential; for particle-hole symmetric models corresponds MU=0 to half-filled case
t = 0.707106781187   // hopping parameter; for the Bethe lattice considered here $W=2D=4t$
```

バンド構造や格子の種類を指定するパラメータが無いことに注意してください。デフォルトではベーテ格子が仮定されますが、これは変更可能です（[DMFT-08 格子](../dmft08) を参照してください）。

初期外斯場（Weiss field、変数 G0OMEGA_INPUT または G0TAU_INPUT で設定）の指定も省略されています。この場合、プログラムは初期化の際に非相互作用グリーン関数を計算します。初期磁場 H_INIT を用いることで、この例では2つの「フレーバー」（flavor 0 と 1、すなわち $\uparrow$ と $\downarrow$）の間にわずかな差を生じさせ、常磁性解から離れた状態から計算を開始します。これは、（このチュートリアルのように）非常に短いシミュレーションでは、常磁性の外斯場から出発すると、最初の数回の反復ではランダムノイズだけでは系を常磁性領域から十分に引き離すことができず、収束の悪い常磁性解がそのまま解として現れてしまう可能性があるためです。H_INIT を BETA に依存させているのは、実行を最適化し、必要な反復回数を減らすためです。

### 自己無撞着になるまでの反復計算

このコードは最大6回の自己無撞着反復を実行します。より精密なシミュレーションを行うにはこの回数を増やすことができます。その場合、パラメータ CONVERGED で指定された収束判定基準に達した時点で計算は早期に終了します。プログラムを実行したディレクトリには、グリーン関数ファイル `G_tau_i`、自己エネルギー（`selfenergy_i`）、そして松原表示（周波数空間）でのグリーン関数 `G_omega_i` が生成されます。これらの例における `G_tau` はスピンアップとスピンダウンの2列から成ります。$\tau=\beta^-$ における値は負の占有数（密度）であり、これから系の磁化を求めることができます。

誤差は、収束した系に対する連続した反復計算から見積もることができます。

シミュレーションを再実行するには、入力パラメータ G0OMEGA_INPUT を指定することで初期解を与えることができます。目的の `G0omega_output` を `filename_X` にコピーし、python スクリプト内で `'G0OMEGA_INPUT':'filename_X'` と指定するか（あるいは入力ファイル内で直接 `G0OMEGA_INPUT=filename_X` と指定し）、コードを再実行してください。

### 反強磁性転移のプロット

[Georges らによる DMFT のレビュー論文](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) の図11と同様に、虚時間表示でのグリーン関数をプロットすることで（`tutorial2.py` と `tutorial2_long.py` の一部）、反強磁性相への転移を観察できます。

```
listobs=['0', '1']   # we will plot both flavors 0 and 1

# load the imaginary-time Green's function in final iteration from all result files
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_beta_*h5'), respath='/simulation/results/G_tau', what=listobs)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])   # rescale horizontal axis
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])+'; flavor='+str(d.props['observable'][len(d.props['observable'])-1])

plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor}(\tau)$')
plt.title('DMFT-02: Neel transition for the Hubbard model on the Bethe lattice\n(using the Hybridization expansion impurity solver)')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

結果には比較的大きなノイズが見られることに気づくでしょう。これは、このような高温では展開次数が非常に小さくなり、測定手順の効率が下がるためです。統計精度は、総実行時間（MAX_TIME）や SWEEPS の数を増やすことで改善できます。なお、SOLVER パラメータを用いて求解器を直接 MPI 上で実行する方法（例えば `SOLVER = "mpirun -np procs /path-to-ALPS-installation/bin/hybridization"`）は、パスのプレフィックスに関する問題により、現時点では正しく動作しません。お使いのシステムで並列ジョブを正しく起動する方法については、MPI 環境のドキュメント（例えば `mpirun` の man ページ）を参照してください。

### 収束の確認

DMFT の自己無撞着計算の収束を確認したい場合は、[`tutorial2eval.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-02-hybridization/tutorial2eval.py) を使って各反復ステップのグリーン関数をプロットできます。そのコードは以下の通りです。

```
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
```

なお、反復ステップごとの結果は、最終結果を読み込む関数（`pyalps.loadMeasurements`）とは異なる関数（`pyalps.loadDMFTIterations`）で読み込まれます。これは、反復ステップごとのデータが、最終結果の保存に使われる ALPS のデフォルトのフォルダ構造（`/simulation/results/`）とは異なるフォルダ構造（`/simulation/iteration/number/results/`）で保存されているためです。

前述の通り、占有数 $n_f$ はフレーバー $f$ の虚時間グリーン関数の最後の値である $G_f(\tau=\beta^-)$ に等しくなります。最終的な占有数を出力し、それを $\beta$ に対してプロットするコードも `tutorial2eval.py` の一部です。

```
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
```

### 松原周波数グリーン関数と自己エネルギー

今回の自己無撞着計算は松原周波数で行われるため（パラメータ OMEGA_LOOP=1 を思い出してください）、収束判定基準は $\mathrm{max}|G_{f}^{it}(i\omega_n)-G_{f}^{it+1}(i\omega_n)|\lt$ CONVERGED となります。松原周波数グリーン関数の虚部（実部も同様）は次のようにプロットします。

```
from math import pi

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
```

収束の様子は、より変化に敏感な自己エネルギーで観察するのが最良です。より滑らかなグリーン関数や自己エネルギーを得るには、より長いシミュレーションが必要であることに注意してください。このシミュレーションでは、松原周波数の中間領域でのノイズが非常に強くなっています。自己エネルギーは Dyson 方程式 $\Sigma_f^{it}(i\omega_n)=G0_f^{it}(i\omega_n)^{-1}-G_f^{it}(i\omega_n)^{-1}$ によって得られ、その虚部は `tutorial2eval.py` の次のコード断片でプロットされます（実部も同様です）。

```
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
