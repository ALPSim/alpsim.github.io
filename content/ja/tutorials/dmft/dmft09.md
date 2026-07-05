
---
title: DMFT-09 Néel Transition
math: true
toc: true
---

## 単一格子 DMFT におけるネール転移

この例では、[Georges らによる DMFT のレビュー論文](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)の図11を再現します。この6本の曲線は、相互作用 $U=3D/\sqrt{2}$ を持つベーテ格子上の半充填 Hubbard 模型が、冷却に伴って反強磁性相へと転移していく様子を示しています。

これらの例は、コマンドラインで直接コマンドを実行するか、python スクリプトを実行することで開始できます。DMFT パラメータの組の一つを手動で実行する場合、例えば `tutorials/dmft-02-hybridization` 内の `beta_14_U3_tsqrt2` ディレクトリに入り、dmft コード `/opt/alps/bin/dmft hybrid.param` を実行すると、同じ結果が得られます。

注：この例は、チュートリアル [DMFT-02 Hybridization](../dmft02)、[DMFT-03 Interaction](../dmft03)、[DMFT-07 Hirsch-Fye](../dmft07) を統合したものです。

### ハイブリダイゼーション展開 CT-HYB

まず、連続時間量子モンテカルロコードであるハイブリダイゼーション展開アルゴリズム CT-HYB を実行します。CT-HYB シミュレーションは、1反復あたり約1分かかります。このシミュレーションを実行するためのパラメータファイルは、ディレクトリ `tutorials/dmft-02-hybridization` にあります。

主なパラメータは以下の通りです。

```
SEED = 0;                    // Monte Carlo Random Number Seed
THERMALIZATION = 1000;       // Thermalization Sweeps
SWEEPS = 100000000;          // Total Sweeps to be computed
MAX_TIME = 60;               // Maximum time to run the simulation
BETA = 12.;                  // Inverse temperature
SITES = 1;                   // This is a single site DMFT simulation, so Sites is 1
N = 1000;                    // auxiliary discretization of the imaginary-time Green's function
NMATSUBARA = 1000;           // The number of Matsubara frequencies
U = 3;                       // Interaction energy
t = 0.707106781187;          // hopping parameter. For the Bethe lattice considered here $W=2D=4t$
MU = 0;                      // Chemical potential
H = 0;                       // Magnetic field
SYMMETRIZATION = 0;          // We are not enforcing a paramagnetic self consistency condition
SOLVER = Hybridization;      // The Hybridization solver
```

コマンドラインでシミュレーションを開始するには、次のように入力します。

```
dmft hybrid.param
```

このコードは最大10回の自己無撞着反復を実行します。プログラムを実行したディレクトリの出力先には、グリーン関数ファイル G_tau_i、自己エネルギー（selfenergy_i）、周波数空間でのグリーン関数 G_omega_i が見つかります。これらの例における G_tau はスピンアップとスピンダウンの2列から成ります。$\beta$ における値は負の密度であり、これが誤差の範囲を超えて異なる場合、系は反強磁性相にあります。python シェルで以下の行を実行することで、異なる $\beta$ に対するグリーン関数をプロットし、結果を [Georges ら](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)の図11と比較できます。以下の Hirsch-Fye の節では、離散時間量子モンテカルロコードである Hirsch Fye コードを用いて同じ結果を再現します。求解器に対するコマンドを除いて、パラメータは同じです。

例の中の `tutorials/dmft-02-hybridization` ディレクトリに、（\*tsqrt2 という名前の）パラメータファイルがあります。あるいは、python スクリプト `tutorial2a.py` を実行することもできます。

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.pyplot

#prepare the input parameters
parms=[]
for b in [6.,8.,10.,12.,14.,16.]:
    parms.append(
        {
            'ANTIFERROMAGNET'     : 1,
            'CONVERGED'           : 0.03,
            'F'                   : 10,
            'FLAVORS'             : 2,
            'H'                   : 0,
            'H_INIT'              : 0.2,
            'MAX_IT'              : 10,
            'MAX_TIME'            : 60,
            'MU'                  : 0,
            'N'                   : 1000,
            'NMATSUBARA'          : 1000,
            'N_FLIP'              : 0,
            'N_MEAS'              : 10000,
            'N_MOVE'              : 0,
            'N_ORDER'             : 50,
            'N_SHIFT'             : 0,
            'OMEGA_LOOP'          : 1,
            'OVERLAP'             : 0,
            'SEED'                : 0,
            'SITES'               : 1,
            'SOLVER'              : 'Hybridization',
            'SYMMETRIZATION'      : 0,
            'TOLERANCE'           : 0.01,
            'U'                   : 3,
            't'                   : 0.707106781186547,
            'SWEEPS'              : 100000000,
            'THERMALIZATION'      : 1000,
            'BETA'                : b,
            'CHECKPOINT'          : 'solverdump_beta_'+str(b)+'.task1.out.h5',
            'G0TAU_INPUT'         : 'G0_tau_input_beta_'+str(b)
        }
    )
#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_beta_'+str(p['BETA']),p)
    res = pyalps.runDMFT(input_file)
```

これらのシミュレーションを実行した後、出力結果を Hirsch Fye の節や DMFT のレビュー論文の Hirsch-Fye の結果、あるいは Interaction Expansion CT-INT の節の相互作用展開の結果と比較してください。シミュレーションを再実行するには、入力パラメータ G0OMEGA_INPUT を指定することで初期解を与えることができます。例えば G0omga_output を G0_omega_input にコピーし、パラメータファイルで G0OMEGA_INPUT = G0_omega_input と指定してから、コードを再実行してください。次のスクリプトを使ってグリーン関数をプロットすることで、反強磁性相への転移を観察できます。

```
flavors=parms[0]['FLAVORS']
listobs=[]   
for f in range(0,flavors):
    listobs.append('Green_'+str(f))

ll=pyalps.load.Hdf5Loader()
data = ll.ReadMeasurementFromFile(pyalps.getResultFiles(pattern='parm_beta_*h5'), respath='/simulation/results/G_tau', measurements=listobs, verbose=True)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])
plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G(\tau)$')
plt.title('Hubbard model on the Bethe lattice')
pyalps.pyplot.plot(data)
plt.legend()
plt.show()
```

結果には比較的大きなノイズが見られることに気づくでしょう。これは、このような高温では展開次数が非常に小さくなり、測定手順の効率が下がるためです。統計精度は、総実行時間（MAX_TIME）を増やすか、複数の CPU で実行することで改善できます。MPI で実行するには、`mpirun -np procs dmft parameter_file` を試すか、お使いの MPI 環境の man ページを参照してください。

DMFT の自己無撞着計算の収束を確認したい場合は、`tutorial2b.py` を使って各反復ステップのグリーン関数をプロットできます。

```
ll=pyalps.load.Hdf5Loader()
for p in parms:
    data = ll.ReadDMFTIterations(pyalps.getResultFiles(pattern='parm_beta_'+str(p['BETA'])+'.h5'), measurements=listobs, verbose=True)
    grouped = pyalps.groupSets(pyalps.flatten(data), ['iteration'])
    nd=[]
    for group in grouped:
        r = pyalps.DataSet()
        r.y = np.array(group[0].y)
        r.x = np.array([e*group[0].props['BETA']/float(group[0].props['N']) for e in group[0].x])
        r.props = group[0].props
        r.props['label'] = r.props['iteration']
        nd.append( r )
    plt.figure()
    plt.xlabel(r'$\tau$')
    plt.ylabel(r'$G(\tau)$')
    plt.title(r'\beta = %.4s' %nd[0].props['BETA'])
    pyalps.pyplot.plot(nd)
    plt.legend()
    plt.show()
```

収束の様子は、より変化に敏感な自己エネルギーで観察するのが最良です。より滑らかなグリーン関数や自己エネルギーを得るには、より長いシミュレーションが必要であることに注意してください。

### 相互作用展開 CT-INT

Hybridization Expansion CT-HYB の節と同じ計算を CT-INT コードで行ってみると勉強になります。このコードは（ハイブリダイゼーションではなく）相互作用を展開します。対応するパラメータファイルは非常によく似ており、ディレクトリ `tutorials/dmft-03-interaction` にあります。python でシミュレーションを実行したい場合は、`tutorial3a.py` および `tutorial3b.py` ファイルを使用できます。

### Hirsch Fye

離散時間モンテカルロコードである [Hirsch Fye コード](https://link.aps.org/doi/10.1103/PhysRevLett.56.2521)を実行し、連続時間の結果と比較します。Hirsch Fye アルゴリズムは[こちら](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)で解説されており、このレビュー論文はコードのオープンソース実装も提供しています。これまでに多くの改良が行われてきましたが（例えば Alvarez (2008) や [Nukala09](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.80.195111) を参照してください）、このアルゴリズムは[連続時間アルゴリズム](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.76.235123)に取って代わられました。

Hirsch Fye シミュレーションは、1反復あたり約1分かかります。このシミュレーションを実行するためのパラメータファイルは、[このチュートリアル](../dmft07)にあります。

主なパラメータは以下の通りです。

```
SEED = 0;                    // Monte Carlo Random Number Seed
THERMALIZATION = 10000;      // Thermalization Sweeps
SWEEPS = 1000000;            // Total Sweeps to be computed
MAX_TIME = 60;               // Maximum time to run the simulation
BETA = 12.;                  // Inverse temperature
SITES = 1;                   // This is a single site DMFT simulation, so Sites is 1
N = 16;                      // Number of time slices (you will see that this parameter is rather small)
NMATSUBARA = 500;            // The number of Matsubara frequencies
U = 3;                       // Interaction energy
t = 0.707106781187;          // hopping parameter. For the Bethe lattice considered here $W=2D=4t$
MU = 0;                      // Chemical potential
H = 0;                       // Magnetic field
SYMMETRIZATION = 0;          // We are not enforcing a paramagnetic self consistency condition
SOLVER = /opt/alps/bin/hirschfye;  // The path to the external Hirsch Fye solver
```

シミュレーションを開始するには、次のように入力します。

```
dmft hirschfye.param
```

あるいは、python スクリプト `tutorial7a.py` を実行します。

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.pyplot

#prepare the input parameters 
parms=[]
for b in [6.,8.,10.,12.,14.,16.]: 
    parms.append(
        { 
            'ANTIFERROMAGNET'     : 1,
            'CONVERGED'           : 0.03,
            'FLAVORS'             : 2,
            'H'                   : 0,
            'MAX_IT'              : 10,
            'MAX_TIME'            : 60,
            'MU'                  : 0,
            'N'                   : 16,
            'NMATSUBARA'          : 500, 
            'OMEGA_LOOP'          : 1,
            'SEED'                : 0, 
            'SITES'               : 1,
            'SOLVER'              : '/opt/alps/bin/hirschfye',
            'SYMMETRIZATION'      : 0,
            'TOLERANCE'           : 0.01,
            'U'                   : 3,
            't'                   : 0.707106781186547,
            'SWEEPS'              : 1000000,
            'THERMALIZATION'      : 10000,
            'BETA'                : b,
            'G0OMEGA_INPUT'       : 'G0_omega_input_beta_'+str(b),
            'BASENAME'            : 'hirschfye.param'
        }
    )

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_beta_'+str(p['BETA']),p)
    res = pyalps.runDMFT(input_file)
```

このコードは最大10回の自己無撞着反復を実行します。プログラムを実行したディレクトリの出力先には、グリーン関数ファイル G_tau_i、自己エネルギー（selfenergy_i）、周波数空間でのグリーン関数 G_omega_i が見つかります。これらの例における G_tau はスピンアップとスピンダウンの2列から成ります。$\beta$ における値は負の密度であり、これが誤差の範囲を超えて異なる場合、系は反強磁性相にあります。python シェルで以下の行を実行することで、異なる $\beta$ に対するグリーン関数をプロットし、結果を [Georges ら](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)の図11と比較できます。

```
flavors=parms[0]['FLAVORS']
listobs=[]   
for f in range(0,flavors):
    listobs.append('Green_'+str(f))

ll=pyalps.load.Hdf5Loader()
data = ll.ReadMeasurementFromFile(pyalps.getResultFiles(pattern='parm_beta_*h5'), respath='/simulation/results/G_tau', measurements=listobs, verbose=True)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])
plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G(\tau)$')
plt.title('Hubbard model on the Bethe lattice')
pyalps.pyplot.plot(data)
plt.legend()
plt.show()
```

離散時間法であるため、HF は $\Delta\tau$ による離散化誤差の影響を受けます。パラメータの組を一つ選び、$N$ を徐々に大きくしながら実行してみてください。また、ここでは（ほぼ）収束した入力バス関数を用いて DMFT シミュレーションを実行していることに注意してください。ファイル G0_omega_input を削除すると、自由解から計算を再開し、収束の様子を観察することができます。
