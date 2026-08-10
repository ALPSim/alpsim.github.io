
---
title: DMFT-08 Lattices
math: true
toc: true
---

## Setting a particular lattice

これまでのすべてのチュートリアルでは、半円形の状態密度（DOS）を持つベーテ格子を扱ってきました。これにより自己無撞着ループは解析的に単純になります（$\Omega$ループで、k空間積分を必要としません）。しかし現実の物質は正方格子、立方格子、六角格子、あるいはさらに複雑な格子の上に存在し、それらの状態密度は滑らかな半円ではなく、ファン・ホーブ特異点や硬いバンド端を持ちます。これらの特徴はモット転移が起こる場所やその鋭さを変化させ得るため、ベーテ格子以外の格子に対して単サイト DMFT を実行する方法を知っておくことは有用です。このチュートリアルではその方法を示します。以下で導入する格子固有のパラメータを差し替えれば、これまでのチュートリアルのスクリプト（例えば [DMFT-04 Mott](../dmft04) のモット転移スキャン）をそのまま再利用できます。

### 模型

格子ハミルトニアンは、これまでと同じ単バンド Hubbard 模型

$$
\hat{H} = -\sum_{\langle i,j\rangle,\sigma} t_{ij}\left(\hat{c}^\dagger_{i\sigma}\hat{c}_{j\sigma} + \text{h.c.}\right) + U\sum_i \hat{n}_{i\uparrow}\hat{n}_{i\downarrow} - \mu\sum_{i,\sigma}\hat{n}_{i\sigma}
$$

ですが、今回は $t_{ij}$ が選んだ格子のボンド上を走り、ベーテ格子の $z\to\infty$ の木構造ではありません。しかし単サイト DMFT では、格子は不純物問題に直接は入ってきません。自己無撞着計算が必要とするのは、局所的な、k について積分された非相互作用状態密度 $\rho_0(\epsilon)=\sum_{\mathbf{k}}\delta(\epsilon-\epsilon_{\mathbf{k}})$（あるいは、Hilbert 変換を k 空間で直接行う場合には分散関係 $\epsilon_{\mathbf{k}}$ そのもの）だけです。これは、古典的な平均場理論が格子全体の幾何学的構造を単一の有効な（配位数に依存する）場で置き換えるのと同じ発想です。局所状態密度 $\rho_0(\epsilon)$ を用いた自己無撞着条件の一般的な導出については [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) を参照してください。

### パラメータ

以下の2つの方法に共通するパラメータです（`tutorial8a.py`／`tutorial8b.py` で用いられている値）。

| パラメータ | 意味 | 使用する値 |
| :-------- | :------ | :------------ |
| `U` | オンサイト相互作用 | $3$ |
| `BETA` | 逆温度 | $6$ |
| `MU` | 化学ポテンシャル | $0$（半充填） |
| `H`, `H_INIT` | 量子化軸方向の磁場／初期外斯場の種となる磁場 | $0$ / $0.05$ |
| `FLAVORS` | スピンフレーバー数 | $2$ |
| `SITES` | 不純物サイト数 | $1$ |
| `ANTIFERROMAGNET` | ネール自己無撞着を有効化 | $1$ |
| `SYMMETRIZATION` | 常磁性解を強制するか | $0$ |
| `N`, `NMATSUBARA` | $G$ と $G_0$ の虚時間／松原周波数離散化数 | $500$ |
| `OMEGA_LOOP` | 自己無撞着計算を松原周波数で行う | $1$ |
| `G0OMEGA_INPUT` | 空文字列を指定し、初期外斯場を非相互作用グリーン関数から強制的に計算させる | `""` |
| `MAX_IT`, `CONVERGED` | 自己無撞着反復の最大回数／収束判定基準 | $10$、$0.005$ |
| `SOLVER` | 不純物ソルバー | `"hybridization"`（CT-HYB） |
| `SC_WRITE_DELTA`, `N_MEAS`, `N_ORDER` | ハイブリダイゼーション関数の出力／測定間のモンテカルロ更新回数／展開次数のヒストグラムサイズ | $1$、$5000$、$50$ |
| `SWEEPS`, `THERMALIZATION`, `MAX_TIME` | モンテカルロスイープ数の上限／熱化スイープ数／1反復あたりの実時間上限（秒） | $10^4$、$500$、$60$ |

### 格子

格子固有の仕組みは2種類あり、どちらも同じ自己無撞着ループに、k について積分された状態密度を与えます。

**DOSFILE**：状態密度の表を用意しさえすれば、どんな格子でも使用できます。このチュートリアルには、ホッピングを $t=1$ に規格化した4種類の格子について、あらかじめ生成された DOS 表（ヒストグラム）が同梱されています。

- **正方格子**（`DOS_Square_GRID4000`、配位数 $z=4$、二次モーメント `EPSSQ_i=4`）：
  ```
  o---o---o
  |   |   |
  o---o---o        o : lattice site, interaction U (on site)
  |   |   |        --- , | : bond, nearest-neighbor hopping t
  o---o---o
  ```
- **立方格子**（`DOS_Cubic_GRID360`、配位数 $z=6$、二次モーメント `EPSSQ_i=6`）：上の正方格子を3次元に拡張したもので、各方向に紙面から飛び出す方向のホッピング $t$ のボンドが1本追加されます。
- **六角（ハニカム）格子**（`DOS_Hexagonal_GRID4000`、配位数 $z=3$、二次モーメント `EPSSQ_i=3`）：
  ```
        o---o       o---o
       /     \     /     \
      o       o---o       o     o : lattice site, interaction U (on site)
       \     /     \     /      --- , / , \ : bond, nearest-neighbor hopping t
        o---o       o---o
  ```
- **ベーテ格子**（`DOS_Bethe`、二次モーメント `EPSSQ_i=1`、テスト用に同梱）：チュートリアル02〜07で用いたのと同じ格子で、参考として示します。
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

各 DOS 表は小さなヒストグラム生成スクリプト──[`DOS_Square.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/DOS/DOS_Square.py)（`GRID=4000`）、[`DOS_Cubic.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/DOS/DOS_Cubic.py)（`GRID=360`）、[`DOS_Hexagonal.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/DOS/DOS_Hexagonal.py)（`GRID=4000`）──によって、`GRID`$\times$`GRID` の k 点メッシュ上でタイトバインディング分散をブリルアンゾーン全体にわたって積分することで生成されています。他の格子についても同様の方法で自分で DOS 表を生成できますし、格子の幾何学的構造や配位数を調べる際の参考として [ALPS 格子ライブラリ](../../../documentation/intro/latticehowtos) を利用することもできます。

**TWODBS**：正方格子と六角格子については、事前に DOS 表を用意しなくても、自己無撞着計算の各ステップで Hilbert 変換を（$L\times L$ の k 点メッシュ上で離散化した）ライブな k 空間積分として直接評価することができます。

### 手法の選択

`DOSFILE` と `TWODBS` は、汎用性と利便性のトレードオフの関係にあります。`DOSFILE` は $\rho_0(\epsilon)$ の（上記の `DOS_Square.py` のようなスクリプトによる）一度限りのヒストグラム作成だけで済むため、*あらゆる*格子に使えますが、その精度はヒストグラムの `GRID` 解像度とビン数に制限され、ホッピングパラメータを変更した場合は再生成が必要です。`TWODBS` は k 空間離散化 `L` の範囲内で厳密であり、別途の前処理ステップも不要ですが、現在実装されているのは正方格子（最近接ホッピング `t` と次近接ホッピング `tprime`）と六角格子（最近接ホッピング `t` のみ）に限られます──詳細は [DMFT パラメータリファレンス](../../../documentation/methods/dmft) を参照してください。いずれの場合も、不純物ソルバーに到達する格子情報は $\rho_0(\epsilon)$（`DOSFILE` 経由）あるいは $\epsilon_{\mathbf k}$（`TWODBS` 経由）とその一次・二次モーメント `EPS_i`、`EPSSQ_i` だけです。これは、上の「模型」の節で述べた点、すなわち単サイト DMFT は格子を（積分された）非相互作用分散を通してしか見ていない、ということを裏付けています。

### Option DOSFILE

一般の格子の場合、その格子の状態密度を与える必要があります。それに加えて、シミュレーションを実行するにはいくつかの変更が必要です。入力ファイルを設定し、シミュレーションを実行し、結果をプロットする、実際に動作する python スクリプト [`tutorial8a.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/tutorial8a.py) を以下に示します。

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

listobs=['0']  # we look only at flavor=0
    
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='hybrid_DOS*h5'), respath='/simulation/results/G_tau', what=listobs, verbose=True)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])
plt.figure()

plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor=0}(\tau)$')
plt.title('DMFT-08, DOS-based approach: Hubbard model on the square lattice')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

内部的には、`pyalps.runDMFT` は生成されたパラメータファイルに対して `dmft` アプリケーションを直接呼び出します。

```
/path-to-alps-installation/bin/dmft hybrid_DOS_beta_6.0_U_3.0
```

上記のスクリプトによって生成される入力ファイル `hybrid_DOS_beta_6.0_U_3.0` には、格子固有のパラメータとして

```
DOSFILE = DOS/DOS_Square_GRID4000; // specification of the file with density of states
GENERAL_FOURIER_TRANSFORMER = 1;  // Fourier transformer for a general bandstructure
EPS_0 = 0;                        // potential shift for the flavor 0
EPS_1 = 0;                        // potential shift for the flavor 1
EPSSQ_0 = 4;                      // the second moment of the bandstructure for the flavor 0
EPSSQ_1 = 4;                      // the second moment of the bandstructure for the flavor 1
```

が含まれており、これに加えて上のパラメータ表にある物理／ソルバーパラメータも入っています。ここでは最近接ホッピングが明示的なパラメータとして現れていないことに注意してください──それは DOS 表そのものに組み込まれており、`DOS_Square.py` はホッピングを $t=1$ に固定して構築しています。

注1：入力ファイル内でバンド構造パラメータ（EPS_i、EPSSQ_i）を指定しない場合、これらは与えられた DOS から（リビジョン6146以降）$EPS_{flavor=i} = \int \mathrm{d}\epsilon\ DOS_{band=i/2}(\epsilon)\ \epsilon$、$EPSSQ_{flavor=i} = \int \mathrm{d}\epsilon\ DOS_{band=i/2}(\epsilon)\ \epsilon^2$ として計算されます。

注2：反強磁性の自己無撞着ループはネール秩序を仮定しているため、二部格子（bipartite lattice）にのみ適用可能です。

注3：状態密度はユーザーが用意する必要があります。このチュートリアルでは、上の「格子」の節に挙げた正方格子・立方格子・六角格子・ベーテ格子の状態密度を提供しています。

注4：既知の DOS を用いたマルチバンドシミュレーション [$n_{\text{bands}}=FLAVORS/2$] では、DOS ファイルは $2n_{\text{bands}}$ 列から構成されている必要があります。DOS のビン数（＝入力ファイルの行数）はすべてのバンドで同じでなければなりません。$i$ 行目の構造は以下の通りです。

$$
e_{1,i}\ \ \ DOS_{band1}(e_{1,i})\ \ \ e_{2,i}\ \ \ DOS_{band2}(e_{2,i})\ \ \ \ldots
$$

### Option TWODBS

2次元格子の場合には、k 空間での積分による Hilbert 変換が実装されています [パラメータ L は逆格子空間の各次元における離散化数を設定します]。現在、次の分散関係が実装されています。

- 正方格子 [TWODBS=square と設定]。最近接ホッピング [対応するパラメータ：t] と次近接ホッピング [対応するパラメータ：tprime] を持ち、二次モーメント EPSSQ_i は $4(t^2 + tprime^2)$ です。
- 六角格子 [TWODBS=hexagonal と設定]。最近接ホッピングのみを持ち [対応するパラメータ：t]、二次モーメント EPSSQ_i は $3t^2$ です。

入力ファイルを生成し、シミュレーションを実行し、結果をプロットする、実際に動作する python スクリプト [`tutorial8b.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/tutorial8b.py) を以下に示します。

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

listobs=['0']  # we look only at flavor=0
    
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='hybrid_TWODBS*h5'), respath='/simulation/results/G_tau', what=listobs, verbose=True)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])
plt.figure()

plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor=0}(\tau)$')
plt.title('DMFT-08, TWODBS option: Hubbard model on the square lattice')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

```
/path-to-alps-installation/bin/dmft hybrid_TWODBS_beta_6.0_U_3.0
```

生成される入力ファイル `hybrid_TWODBS_beta_6.0_U_3.0` の格子固有のパラメータは以下の通りです。

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

ここでは `t=1`、`tprime=0` が明示的なパラメータとして与えられているため（DOSFILE 方式ではホッピングは事前生成された DOS 表の中に固定されていました）、`EPSSQ_i=4(t^2+tprime^2)=4` が上記の公式から直接得られます。

### 出力データとプロット

`tutorial8a.py`（DOSFILE）と `tutorial8b.py`（TWODBS）はどちらも、これまでのチュートリアルと同じ種類のプロット──自己無撞着ループの最後における虚時間グリーン関数 $G_{\text{flavor}=0}(\tau)$──で終わります。ここでは $U=3$、$\beta=6$ における正方格子の結果です。両スクリプトとも同じ格子（正方格子、$t=1$）と同じ物理的な点を対象としているため、収束した $G(\tau)$ は統計誤差の範囲内で互いに一致するはずです。これは、DOSFILE のヒストグラムと TWODBS のライブな k 空間積分が同じ物理を記述していることを確認する良いチェックになります。

この結果を、同じ $U$、$\beta$ における [DMFT-02 Hybridization](../dmft02) や [DMFT-04 Mott](../dmft04) のベーテ格子の結果と比較すると、目に見える違いが予想されます。正方格子の状態密度はバンド中心に対数的なファン・ホーブ特異点を持ち、$\epsilon=\pm4t$ に硬いバンド端を持ちます。これはベーテ格子の滑らかな半円とは異なるため、金属-絶縁体クロスオーバーは異なる臨界 $U$ で起こり、金属相であってもグリーン関数の短時間側の振る舞いが異なります。

### まとめと今後の課題

単サイト DMFT が自己無撞着ループを閉じるために必要とするのは、格子の局所状態密度（あるいは分散関係）だけであり、実空間の完全な幾何学的構造ではありません──それが事前生成されたヒストグラム（`DOSFILE`）から来るか、ライブな k 空間 Hilbert 変換（`TWODBS`）から来るかを問いません。

1. DMFT の計算には、正確にはどのような格子の情報が入ってくるでしょうか。例えば Ising 模型に対する古典的な（Weiss）平均場理論には何が入ってくるかと比較してみてください。単サイト DMFT 自体が平均場理論であるとは、どのような意味においてでしょうか。
2. [DMFT-04 Mott](../dmft04) のモット転移スキャンを、ベーテ格子ではなく正方格子（`DOSFILE=DOS/DOS_Square_GRID4000` あるいは `TWODBS=1`）についてやり直してみましょう。臨界 $U$ やクロスオーバーの形に、何か顕著な変化はあるでしょうか。
3. さまざまな空間次元における Ising 模型の平均場理論の予言を思い出してみましょう（例えば平均場臨界温度は配位数 $z$ に比例してスケールします）。ここで比較した格子の配位数（六角格子・正方格子・立方格子でそれぞれ $z=3,4,6$）は、DMFT の結果にも同様の痕跡を残すでしょうか。
4. `tutorial8a.py`（DOSFILE）と `tutorial8b.py`（TWODBS）を同じ $U$、$\beta$ で実行し、収束した $G(\tau)$ の曲線を直接比較してみましょう。両者の一致の度合いは、DOS ヒストグラムの `GRID` 解像度と k 空間離散化 `L` にそれぞれどのように依存するでしょうか。
