
---
title: DMFT-08 Lattices
math: true
toc: true
---

## Setting a particular lattice

### Option DOSFILE

これまでのすべてのチュートリアルでは、半円形の状態密度を持つベーテ格子を扱ってきました。ここでは、特定の格子の状態密度を指定するために入力パラメータをどのように設定するかを示します。シミュレーションを実行するには、これまでのチュートリアルのスクリプトをそのまま使い、パラメータリストを置き換えるだけで同様のシミュレーションを行うことができます。例えば、[DMFT-04 Mott](../dmft04) で行ったように MIT を調べることができます。

一般の格子の場合、その格子の状態密度を与える必要があります。それに加えて、シミュレーションを実行するにはいくつかの変更が必要です。入力ファイルを設定してシミュレーションを実行する、実際に動作する python スクリプト [`tutorial8a.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/tutorial8a.py) を以下に示します。

```
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot


#prepare the input parameters
parms=[]
for u in [3.]: 
  for b in [6.]:
    parms.append(
            { 
                'BETA' : b,          # inverse temperature
                'MU' : 0.0,          # chemical potential corresponding to half-filling
                'U' : u,             # Hubbard interaction
                'FLAVORS' : 2,       # corresponds to spin up/down
                'SITES' : 1,         # number of sites in the impurity
                'H' : 0.0,           # there is no magnetic field
                'H_INIT' : 0.05,     #  we set initial field to split spin up/down in order to trigger AF phase
                'OMEGA_LOOP' : 1,        # the selfconsistency runs in Matsubara frequencies
                'ANTIFERROMAGNET' : 1,   # allow Neel order
                'SYMMETRIZATION' : 0,    # do not enforce paramagnetic solution
                'NMATSUBARA' : 500,      # number of Matsubara frequencies
                'N' : 500,               # bins in imaginary time
                'CONVERGED' : 0.005,     # criterion for convergency
                'MAX_TIME' : 60,         # max. time spent in solver in a single iteration in seconds
                'G0OMEGA_INPUT' : "",    # forces to start from the local non-interacting Green's function
                'MAX_IT' : 10,           # max. number of self-consistency iterations
                'SWEEPS' : 10000,    # max. number of sweeps in a single iteration
                'THERMALIZATION' : 500, # number of thermalization sweeps
                'SEED' : 0,              # random seed
                'SOLVER' : "hybridization",   # we take the hybridization impurity solver
                'SC_WRITE_DELTA' : 1,         # input for the hybridization impurity solver is the hybridization function Delta, which has to be written by the selfconsistency
                'N_MEAS' : 5000,              # number of Monte Carlo steps between measurements
                'N_ORDER' : 50,               # histogram size
                'DOSFILE' : "DOS/DOS_Square_GRID4000", # specification of the file with density of states
                'GENERAL_FOURIER_TRANSFORMER' : 1,  # Fourier transformer for a general bandstructure
                'EPS_0' : 0,                        # potential shift for the flavor 0
                'EPS_1' : 0,                        # potential shift for the flavor 1
                'EPSSQ_0' : 4,                      # the second moment of the bandstructure for the flavor 0
                'EPSSQ_1' : 4,                      # the second moment of the bandstructure for the flavor 1
            }
        )

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('hybrid_DOS_beta_'+str(p['BETA'])+'_U_'+str(p['U']),p)
    res = pyalps.runDMFT(input_file)
```

入力ファイルに現れる格子に固有のパラメータを以下に示します。

```
DOSFILE = DOS/DOS_Square_GRID4000; // specification of the file with density of states
GENERAL_FOURIER_TRANSFORMER = 1;  // Fourier transformer for a general bandstructure
EPS_0 = 0;                        // potential shift for the flavor 0
EPS_1 = 0;                        // potential shift for the flavor 1
EPSSQ_0 = 4;                      // the second moment of the bandstructure for the flavor 0
EPSSQ_1 = 4;                      // the second moment of the bandstructure for the flavor 1
```

注1：入力ファイル内でバンド構造パラメータ（EPS_i、EPSSQ_i）を指定しない場合、これらは与えられた DOS から（リビジョン6146以降）$EPS_{flavor=i} = \int \mathrm{d}\epsilon\ DOS_{band=i/2}(\epsilon)\ \epsilon$、$EPSSQ_{flavor=i} = \int \mathrm{d}\epsilon\ DOS_{band=i/2}(\epsilon)\ \epsilon^2$ として計算されます。

注2：反強磁性の自己無撞着ループはネール秩序を仮定しているため、二部格子（bipartite lattice）にのみ適用可能です。

注3：状態密度はユーザーが用意する必要があります。このチュートリアルでは以下の状態密度を提供しています。

- 正方格子 DOS_Square_GRID4000（GRID=4000 の設定で [`DOS_Square.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/DOS/DOS_Square.py) により生成）。対応するパラメータは EPSSQ_i=4
- 立方格子 DOS_Cubic_GRID360（GRID=360 の設定で [`DOS_Cubic.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/DOS/DOS_Cubic.py) により生成）。対応するパラメータは EPSSQ_i=6
- 六角格子 DOS_Hexagonal_GRID4000（GRID=4000 の設定で [`DOS_Hexagonal.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/DOS/DOS_Hexagonal.py) により生成）。対応するパラメータは EPSSQ_i=3
- ベーテ格子 DOS_Bethe（`DOS_Bethe.py` により生成）。対応するパラメータは EPSSQ_i=1（テスト用）

注4：既知の DOS を用いたマルチバンドシミュレーション [$n_{\text{bands}}=FLAVORS/2$] では、DOS ファイルは $2n_{\text{bands}}$ 列から構成されている必要があります。DOS のビン数（＝入力ファイルの行数）はすべてのバンドで同じでなければなりません。$i$ 行目の構造は以下の通りです。

$$
e_{1,i}\ \ \ DOS_{band1}(e_{1,i})\ \ \ e_{2,i}\ \ \ DOS_{band2}(e_{2,i})\ \ \ \ldots
$$

### Option TWODBS

2次元格子の場合には、k 空間での積分による Hilbert 変換が実装されています [パラメータ L は逆格子空間の各次元における離散化数を設定します]。現在、次の分散関係が実装されています。

- 正方格子 [TWODBS=square と設定]。最近接ホッピング [対応するパラメータ：t] と次近接ホッピング [対応するパラメータ：tprime] を持ち、二次モーメント EPSSQ_i は $4(t^2 + tprime^2)$ です。
- 六角格子 [TWODBS=hexagonal と設定]。最近接ホッピングのみを持ち [対応するパラメータ：t]、二次モーメント EPSSQ_i は $3t^2$ です。

入力ファイルを生成してシミュレーションを実行する、実際に動作する python スクリプト [`tutorial8b.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/tutorial8b.py) を以下に示します。

```
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot


#prepare the input parameters
parms=[]
for u in [3.]: 
  for b in [6.]:
    parms.append(
            { 
                'BETA' : b,          # inverse temperature
                'MU' : 0.0,          # chemical potential corresponding to half-filling
                'U' : u,             # Hubbard interaction
                'FLAVORS' : 2,       # corresponds to spin up/down
                'SITES' : 1,         # number of sites in the impurity
                'H' : 0.0,           # there is no magnetic field
                'H_INIT' : 0.05,     #  we set initial field to split spin up/down in order to trigger AF phase
                'OMEGA_LOOP' : 1,        # the selfconsistency runs in Matsubara frequencies
                'ANTIFERROMAGNET' : 1,   # allow Neel order
                'SYMMETRIZATION' : 0,    # do not enforce paramagnetic solution
                'NMATSUBARA' : 500,      # number of Matsubara frequencies
                'N' : 500,               # bins in imaginary time
                'CONVERGED' : 0.005,     # criterion for convergency
                'MAX_TIME' : 60,         # max. time spent in solver in a single iteration in seconds
                'G0OMEGA_INPUT' : "",    # forces to start from the local non-interacting Green's function
                'MAX_IT' : 10,           # max. number of self-consistency iterations
                'SWEEPS' : 10000,    # max. number of sweeps in a single iteration
                'THERMALIZATION' : 500, # number of thermalization sweeps
                'SEED' : 0,              # random seed
                'SOLVER' : "hybridization",   # we take the hybridization impurity solver
                'SC_WRITE_DELTA' : 1,         # input for the hybridization impurity solver is the hybridization function Delta, which has to be written by the selfconsistency
                'N_MEAS' : 5000,              # number of Monte Carlo steps between measurements
                'N_ORDER' : 50,               # histogram size
                'TWODBS' : 1,     # the Hilbert transformation integral runs in k-space, sets square lattice
                't' : 1,          # the nearest-neighbor hopping
                'tprime' : 0,     # the second nearest-neighbor hopping
                'L' : 64,         # discretization in k-space in the Hilbert transformation
                'GENERAL_FOURIER_TRANSFORMER' : 1,  # Fourier transformer for a general bandstructure
                'EPS_0' : 0,                        # potential shift for the flavor 0
                'EPS_1' : 0,                        # potential shift for the flavor 1
                'EPSSQ_0' : 4,                      # the second moment of the bandstructure for the flavor 0
                'EPSSQ_1' : 4,                      # the second moment of the bandstructure for the flavor 1
            }
        )

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('hybrid_TWODBS_beta_'+str(p['BETA'])+'_U_'+str(p['U']),p)
    res = pyalps.runDMFT(input_file)
```

格子に固有のパラメータを以下に示します。

```
TWODBS = 1;     // the Hilbert transformation integral runs in k-space; sets square lattice
t = 1;          // the nearest-neighbor hopping
tprime = 0;     // the second nearest-neighbor hopping
L = 64;         // discretization in k-space in the Hilbert transformation
GENERAL_FOURIER_TRANSFORMER = 1;  // Fourier transformer for a general bandstructure
EPS_0 = 0;                        // potential shift for the flavor 0
EPS_1 = 0;                        // potential shift for the flavor 1
EPSSQ_0 = 4;                   // the second moment of the bandstructure for the flavor 0
EPSSQ_1 = 4;                   // the second moment of the bandstructure for the flavor 1
```

### Final remarks

問題：DMFT の計算にはどのような格子の情報が入ってくるでしょうか。古典的な平均場理論と比較してください。

課題：（ベーテ格子以外の）別の格子について [DMFT-04 Mott](../dmft04) をやり直し、MIT を調べてみてください。何か顕著な変化はあるでしょうか。

Ising 模型に対する（さまざまな次元での）平均場理論の予言を思い出してください。
