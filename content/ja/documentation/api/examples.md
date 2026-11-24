
---
title: 測定の例
linkTitle: 例
math: true
toc: true
weight: 4
---

このページでは、各 ALPS アプリケーションが測定する物理量を一覧にし、シミュレーションの実行からデータの読み込み、目的の物理量の抽出、プロットまでを行う完全なスクリプトを示します。
このページのスクリプトはすべて ALPS 3.0.0 で実行したもので、図はそれらのスクリプトの出力です。

どの例も同じ 4 つのステップに従います。

1. **実行**：[`pyalps.writeInputFiles`](../runapp) でパラメータを書き出し、[`pyalps.runApplication`](../runapp) でアプリケーションを起動します。
2. **読み込み**：[読み込み関数](../loadat)のいずれかで結果を読み込みます。どの関数を使うかは手法によります（下の表を参照）。
3. **抽出**：名前で観測量を選び、必要に応じて [`pyalps.collectXY`](../eval) で曲線にまとめるか、NumPy 配列に変換します。
4. **プロット**：[`pyalps.plot.plot`](../eval) または matplotlib を直接使います。

## 測定できる物理量

観測量の名前は厳密な文字列です。`Sz Correlations` という名前の観測量がなければ、`pyalps.loadMeasurements(files, 'Sz Correlations')` はエラーを出さずに空のリストを返します。
以下に示すのは、各アプリケーションが実際に書き出す名前です。

### 概要

| 手法（アプリケーション） | 熱力学量 | 相関関数、構造因子、グリーン関数 | 読み込み関数 |
|---|---|---|---|
| 古典モンテカルロ（`spinmc`） | エネルギー、磁化、帯磁率。`pyalps.evaluateSpinMC` の後は比熱と Binder キュムラントも | — | `loadMeasurements` |
| 量子モンテカルロ、ループアルゴリズム（`loop`） | エネルギー、比熱、（スタッガード）磁化と帯磁率、Binder 比、スティッフネス | スピン相関、構造因子、グリーン関数（3.0.0 では失敗する。[既知の問題](#alps-300-の既知の問題)を参照） | `loadMeasurements` |
| 量子モンテカルロ、有向ループ（`dirloop_sse`） | エネルギー、運動エネルギー、（スタッガード）磁化、帯磁率、スティッフネス。粒子模型では密度も | スピンまたは密度の相関、構造因子、グリーン関数（注意点あり。[既知の問題](#alps-300-の既知の問題)を参照） | `loadMeasurements` |
| 量子モンテカルロ、ワームアルゴリズム（`worm`） | エネルギー、密度、スティッフネス、巻き付き数、電荷秩序 | 密度相関、構造因子、グリーン関数 | `loadMeasurements` |
| 量子 Wang–Landau（`qwl`） | エネルギー、自由エネルギー、エントロピー、比熱、帯磁率を $T$ の連続関数として | 一様およびスタッガード構造因子 | `evaluateQWL` |
| 完全対角化（`fulldiag`） | エネルギー、自由エネルギー、エントロピー、比熱、帯磁率、磁化を $T$ または $h$ の関数として | 固有状態ごとのカスタム `MEASURE_*` | `evaluateFulldiagVersusT`、`evaluateFulldiagVersusH`、`loadSpectra`、`loadEigenstateMeasurements` |
| 疎行列対角化（`sparsediag`） | 低エネルギー状態のエネルギー | 固有状態ごとのカスタム `MEASURE_*` | `loadEigenstateMeasurements`、`loadSpectra` |
| DMRG（`dmrg`） | 基底状態と励起状態のエネルギー、打ち切り誤差 | 固有状態ごとのカスタム `MEASURE_*` | `loadEigenstateMeasurements` |

量子モンテカルロのプログラムでは、相関関数、構造因子、グリーン関数はそれぞれ `MEASURE[Correlations]`、`MEASURE[Structure Factor]`、`MEASURE[Green Function]` で有効にします。

### モンテカルロ・アプリケーション

スカラー観測量は常に測定されます。
ベクトル観測量（格点、距離、または波数ごとに 1 つの値）は、対応するフラグを `true` にしたときだけ測定されます。

| アプリケーション | スカラー観測量 | ベクトル観測量（フラグ） |
|---|---|---|
| `spinmc`（模型 `Ising`、`XY`、`Heisenberg`） | `Energy`、`Energy Density`、`Energy^2`、`\|Magnetization\|`、`Magnetization^2`、`Magnetization^4`、`\|Staggered Magnetization\|`、`Staggered Magnetization^2`、`Susceptibility`、`Magnetization along Field`、`Bond-type Energy`、`Cluster size`。`pyalps.evaluateSpinMC` の後：`Specific Heat`、`Binder Cumulant`、`Binder Cumulant U2`、`Connected Susceptibility` | なし |
| `loop` | `Energy`、`Energy Density`、`Specific Heat`、`Magnetization`、`\|Magnetization\|`、`Magnetization^2`、`Magnetization^4`（と `... Density` 版）、`Susceptibility`、それぞれの `Staggered` 版、`Binder Ratio of Magnetization`、`Binder Ratio of Staggered Magnetization`、`Stiffness`、および `Generalized ...` 版 | `Spin Correlations`、`Staggered Spin Correlations`、`Generalized Spin Correlations`、`Generalized Staggered Spin Correlations`（`MEASURE[Correlations]`）、`Spin Structure Factor`（`MEASURE[Structure Factor]`）、`Green's Function`（`MEASURE[Green Function]`） |
| `dirloop_sse`、スピン模型 | `Energy`、`Energy Density`、`Kinetic Energy`、`Magnetization`、`\|Magnetization\|`、`Magnetization^2`、`Magnetization^4`（と `... Density` 版）、それぞれの `Staggered` 版、`Susceptibility`、`Stiffness`、`n`、`n^2`、`n^3`（SSE の展開次数） | `Spin Correlations`（`MEASURE[Correlations]`）、`Spin Structure Factor`（`MEASURE[Structure Factor]`）、`Green's Function`（`MEASURE[Green Function]`） |
| `dirloop_sse`、粒子模型 | `Energy`、`Kinetic Energy`、`Density`、`Density^2`、`Checkerboard Charge Order`（と `^2`、`^4`）、`Stiffness`、`n`、`n^2`、`n^3` | `Density Correlations`（`MEASURE[Correlations]`）、`Density Structure Factor`（`MEASURE[Structure Factor]`）、`Green's Function`（`MEASURE[Green Function]`） |
| `worm`（ボソン模型） | `Energy`、`Energy Density`、`Density`、`Density^2`、`Stiffness`、`Winding number^2`、`Checkerboard Charge Order`（と `^2`、`^4`） | `Density Correlations`（`MEASURE[Correlations]`）、`Density Structure Factor`（`MEASURE[Structure Factor]`）、`Green's Function`（`MEASURE[Green Function]`） |

ベクトル観測量の中身：

- `Spin Correlations`：$\langle S^z_0 S^z_{\mathbf{r}} \rangle$。x の値は格点 0 からの変位 $\mathbf{r}$（格子定数単位）で、例えば `[1 0]` です。
- `Spin Structure Factor`：$S(\mathbf{q}) = \sum_{\mathbf{r}} e^{i\mathbf{q}\cdot\mathbf{r}} \langle S^z_0 S^z_{\mathbf{r}} \rangle$。x の値は格子で許される波数ベクトル $\mathbf{q}$ で、例えば `[3.14159 3.14159]` です。
- `Green's Function`：同時刻の非対角相関 $\langle S^+_0 S^-_{\mathbf{r}} \rangle$（ボソンでは $\langle b^\dagger_0 b_{\mathbf{r}} \rangle$）で、x の値は変位 $\mathbf{r}$ です。これは距離の関数であり、虚時間の関数ではありません。
- `Density Correlations` と `Density Structure Factor`：粒子密度についての同様の量です。

モンテカルロの結果ファイルに何が含まれているかを見るには、観測量の名前を表示します。

```Python
import pyalps
files = pyalps.getResultFiles(prefix='parm')
print(sorted(pyalps.loadObservableList(files)[0]))
```

### 評価ツール：qwl と fulldiag

`qwl` は高温展開の係数を、`fulldiag` は全スペクトルを保存します。
それぞれの評価関数は、これらを温度グリッド（`T_MIN`、`T_MAX`、`DELTA_T`）上の熱力学量に変換し、物理量ごとに 1 つの DataSet を返します。

| 関数 | 返される物理量 |
|---|---|
| `pyalps.evaluateQWL` | `Energy Density`、`Free Energy Density`、`Entropy Density`、`Specific Heat per Site`、`Uniform Susceptibility per Site`、`Uniform Structure Factor per Site`、`Staggered Structure Factor per Site` |
| `pyalps.evaluateFulldiagVersusT` | `Energy Density`、`Free Energy Density`、`Entropy Density`、`Specific Heat per Site`、`Uniform Susceptibility per Site`、`Magnetization per Site` |
| `pyalps.evaluateFulldiagVersusH` | 固定した `T` での、上と同じ物理量の磁場依存性 |

`pyalps.loadSpectra` は、`fulldiag` または `sparsediag` の計算における各対称性セクターの固有値を返します。

### カスタム測定：sparsediag、fulldiag、dmrg

対角化と DMRG のプログラムは、指定した演算子を測定します。演算子は模型の格点演算子（スピン模型では `Sz`、`Splus`、`Sminus`）や `exchange` などのボンド演算子から作ります。
角括弧内の観測量名は自由に決められます。

| パラメータ | 測定する量 | 例 |
|---|---|---|
| `MEASURE_AVERAGE[name]=op` | $\langle \sum_i \mathrm{op}_i \rangle$ | `MEASURE_AVERAGE[Magnetization]=Sz` |
| `MEASURE_LOCAL[name]=op` | 各格点 $i$ での $\langle \mathrm{op}_i \rangle$ | `MEASURE_LOCAL[Local magnetization]=Sz` |
| `MEASURE_CORRELATIONS[name]=op` または `"op1:op2"` | すべての格点の組についての $\langle \mathrm{op1}_i\, \mathrm{op2}_j \rangle$ | `MEASURE_CORRELATIONS[Offdiagonal spin correlations]="Splus:Sminus"` |
| `MEASURE_STRUCTURE_FACTOR[name]=op` | `op` の相関のフーリエ変換 | `MEASURE_STRUCTURE_FACTOR[Structure Factor S]=Sz` |

結果は `pyalps.loadEigenstateMeasurements` で読み込み、固有状態ごとに 1 つの値が返ります。
`Energy` は常に含まれ、`dmrg` は `Truncation error` も書き出します。
`dmrg` は `MEASURE_STRUCTURE_FACTOR` の結果を書き出さないので、構造因子は相関関数から計算してください。

## 例 1：古典モンテカルロ、観測量の温度依存性

この例では、2 つのシステムサイズについて 2 次元 Ising 模型の温度をスキャンし、$\langle|M|\rangle$、Binder キュムラント $\langle M^4\rangle/\langle M^2\rangle^2$、比熱をプロットします。
`pyalps.collectXY` は、多数の計算のスカラー観測量をシステムサイズごとに 1 本の曲線にまとめます。

```Python
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot

# 1. 実行：2 次元 Ising 模型、2 つのシステムサイズ、T_c = 2.269 付近の温度
parms = []
for L in [8, 16]:
    for T in [2.0, 2.1, 2.2, 2.25, 2.3, 2.35, 2.4, 2.5, 2.6]:
        parms.append({
            'LATTICE'        : "square lattice",
            'MODEL'          : "Ising",
            'J'              : 1.,
            'L'              : L,
            'T'              : T,
            'THERMALIZATION' : 5000,
            'SWEEPS'         : 50000,
        })
input_file = pyalps.writeInputFiles('ising', parms)
pyalps.runApplication('spinmc', input_file, Tmin=5)

# spinmc_evaluate が導出量（Binder キュムラント、比熱など）を追加する
files = pyalps.getResultFiles(prefix='ising')
pyalps.evaluateSpinMC(files)

# 2. 読み込み：ファイルの内容を一覧表示し、必要な観測量を読み込む
print(sorted(pyalps.loadObservableList(files)[0]))
data = pyalps.loadMeasurements(files, ['|Magnetization|', 'Binder Cumulant', 'Specific Heat'])

# 3. 抽出：システムサイズごとに 1 本の曲線、観測量を T の関数として
for obs in ['|Magnetization|', 'Binder Cumulant', 'Specific Heat']:
    curves = pyalps.collectXY(data, x='T', y=obs, foreach=['L'])
    for c in curves:
        c.props['label'] = 'L = %d' % c.props['L']
    # 4. エラーバー付きでプロット
    plt.figure()
    pyalps.plot.plot(curves)
    plt.xlabel('Temperature $T$')
    plt.ylabel(obs)
    plt.legend()
plt.show()
```

このスクリプトは約 30 秒で終わります。
2 つのサイズの Binder キュムラントは $T_c = 2.269$ の近くで交差します。

![](/figs/api_examples_ising.png)

## 例 2：量子モンテカルロ、相関関数と構造因子

ベクトル観測量は 1 つの DataSet として読み込まれ、`x` に格子ベクトル、`y` に誤差付きの値が入ります。
この例では、$8\times8$ 格子上の $S=1/2$ Heisenberg 反強磁性体を `dirloop_sse` で計算し、相関関数を距離に対してプロットし、構造因子をブリルアンゾーン上に表示します。

```Python
import numpy as np
import pyalps
import matplotlib.pyplot as plt

# 1. 実行：8x8 正方格子上の S=1/2 Heisenberg 反強磁性体
L = 8
parms = [{
    'LATTICE'                   : "square lattice",
    'MODEL'                     : "spin",
    'local_S'                   : 0.5,
    'J'                         : 1,
    'L'                         : L,
    'T'                         : 0.3,
    'THERMALIZATION'            : 10000,
    'SWEEPS'                    : 100000,
    'MEASURE[Correlations]'     : True,
    'MEASURE[Structure Factor]' : True,
    'MEASURE[Green Function]'   : True,
}]
input_file = pyalps.writeInputFiles('heis', parms)
pyalps.runApplication('dirloop_sse', input_file, Tmin=5)
files = pyalps.getResultFiles(prefix='heis')

# 2. 読み込み：ベクトル観測量はそれぞれ 1 つの DataSet として返る。
#    x の各要素は格子ベクトル、y は誤差付きの値
corr = pyalps.loadMeasurements(files, 'Spin Correlations')[0][0]
sq   = pyalps.loadMeasurements(files, 'Spin Structure Factor')[0][0]
gf   = pyalps.loadMeasurements(files, "Green's Function")[0][0]

# 3. 抽出：x は格点 0 からの変位 (dx, dy)（格子定数単位）。
#    周期境界条件では距離に最近接イメージを使う
d = np.minimum(corr.x, L - corr.x)
r = np.hypot(d[:, 0], d[:, 1])
C     = np.array([y.mean for y in corr.y])
C_err = np.array([y.error for y in corr.y])
G     = np.array([y.mean for y in gf.y])
G_err = np.array([y.error for y in gf.y])

# 構造因子では x は波数ベクトル (qx, qy)
S = np.array([y.mean for y in sq.y])
i = np.argmax(S)
print('S(q) is largest at q = %s: %s' % (sq.x[i], sq.y[i]))

# 4. プロット。2 部格子では相関の符号が交互に変わる。
#    (-1)^(dx+dy) を掛けると正になる。h = 0 の等方的な
#    Heisenberg 模型では、r > 0 で |<S+_0 S-_r>| = 2 |<Sz_0 Sz_r>|
stagger = (-1) ** (corr.x[:, 0] + corr.x[:, 1])
plt.figure()
plt.errorbar(r, stagger * C, C_err, fmt='o', label=r'$(-1)^{d_x+d_y} \langle S^z_0 S^z_r \rangle$')
plt.errorbar(r, np.abs(G) / 2, G_err / 2, fmt='s', mfc='none', label="|Green's Function| / 2")
plt.yscale('log')
plt.xlabel('distance $r$')
plt.ylabel('correlation')
plt.legend()
plt.tight_layout()

plt.figure(figsize=(4.8, 4))
qx, qy = sq.x[:, 0], sq.x[:, 1]
plt.scatter(qx / np.pi, qy / np.pi, c=S, s=250, marker='s', cmap='viridis')
plt.colorbar(label=r'$S(\mathbf{q})$')
plt.xlabel(r'$q_x/\pi$')
plt.ylabel(r'$q_y/\pi$')
plt.gca().set_aspect('equal')
plt.tight_layout()
plt.show()
```

構造因子は $\mathbf{q} = (\pi, \pi)$ で最大となり、その値は約 3.7 です。これは反強磁性（Néel）相関の特徴です。
相関関数の符号は距離とともに交互に変わり、スピン回転対称性から要求されるとおり $|\langle S^+_0 S^-_r\rangle| = 2|\langle S^z_0 S^z_r\rangle|$ が成り立ちます。

![](/figs/api_examples_qmc.png)

同じ模型の 8 格点の鎖では、`Spin Correlations` と `Green's Function` の絶対値は誤差の範囲で厳密対角化と一致します。
絶対値だけを比べるのは、3.0.0 では反強磁性体での `Green's Function` の符号が誤っているためです（[既知の問題](#alps-300-の既知の問題)を参照）。

## 例 3：fulldiag と QWL による熱力学量

`fulldiag` と `qwl` は 1 回の計算で温度曲線全体を与えます。
この例では、10 格点の Heisenberg 鎖の比熱と一様帯磁率を両方の手法で計算します。

```Python
import pyalps
import matplotlib.pyplot as plt

# 1. 実行：10 格点の S=1/2 Heisenberg 鎖を、完全対角化と
#    量子 Wang-Landau（QWL）でそれぞれ計算する
model = {
    'LATTICE' : "chain lattice",
    'MODEL'   : "spin",
    'local_S' : 0.5,
    'J'       : 1,
    'L'       : 10,
}
ed_input = pyalps.writeInputFiles('chain_ed', [dict(model, CONSERVED_QUANTUMNUMBERS='Sz')])
pyalps.runApplication('fulldiag', ed_input)
# QWL：CUTOFF は展開次数の上限（ここでは T >= 0.05 に十分）。
# 状態密度を収束させるには Wang-Landau の段階を増やす必要がある
qwl_input = pyalps.writeInputFiles('chain_qwl', [dict(model, CUTOFF=200,
                                                      NUMBER_OF_WANG_LANDAU_STEPS=24)])
pyalps.runApplication('qwl', qwl_input, Tmin=5)

# 2. 読み込み：どちらの評価ツールも温度グリッド上で熱力学量を、
#    保存されたスペクトル（fulldiag）または状態密度（QWL）から計算し、
#    物理量ごとに T の関数としての DataSet を 1 つ返す
ed  = pyalps.evaluateFulldiagVersusT(pyalps.getResultFiles(prefix='chain_ed'),
                                     DELTA_T=0.05, T_MIN=0.05, T_MAX=3.0)
qwl = pyalps.evaluateQWL(pyalps.getResultFiles(prefix='chain_qwl'),
                         DELTA_T=0.05, T_MIN=0.05, T_MAX=3.0)

# 3. 抽出：名前で物理量を選ぶ
def select(data, name):
    return [s for s in pyalps.flatten(data) if s.props['observable'] == name]

# 4. 2 つの手法の結果を重ねてプロット
for name in ['Specific Heat per Site', 'Uniform Susceptibility per Site']:
    plt.figure()
    for data, label, style in [(ed, 'fulldiag', '-'), (qwl, 'QWL', 'o')]:
        for s in select(data, name):
            plt.plot(s.x, s.y, style, mfc='none', label=label)
    plt.xlabel('Temperature $T$')
    plt.ylabel(name)
    plt.legend()
plt.show()
```

QWL の計算には約 3 分かかります。
2 つの手法の結果は約 1% 以内で一致します。

![](/figs/api_examples_thermo.png)

ここでは `NUMBER_OF_WANG_LANDAU_STEPS=24` が重要です。
私たちのテストでは、`CUTOFF=500` だけを設定した場合、$T \approx 1$ 以上での QWL のエネルギーは最大 40% ずれました。
小さな系で `fulldiag` と比較するのは、QWL の設定を確かめるよい方法です。

## 例 4：DMRG、相関関数と局所観測量

この例では、32 格点の開放端 Heisenberg 鎖について、$S^z_{\mathrm{total}} = 0$ と $1$ のセクターの基底状態を計算します。
2 つのエネルギーからスピンギャップを、1 つの参照格点からの相関関数を、そして $S^z_{\mathrm{total}} = 1$ の状態での磁化分布を求めます。

```Python
import numpy as np
import pyalps
import matplotlib.pyplot as plt

# 1. 実行：開放端の S=1/2 Heisenberg 鎖で、Sz_total = 0 と
#    Sz_total = 1 のセクターの基底状態を求める。DMRG と ED のプログラムは
#    MEASURE_* パラメータで指定した演算子を測定する
L = 32
parms = []
for sz in [0, 1]:
    parms.append({
        'LATTICE'                  : "open chain lattice",
        'MODEL'                    : "spin",
        'local_S'                  : 0.5,
        'J'                        : 1,
        'L'                        : L,
        'CONSERVED_QUANTUMNUMBERS' : 'N,Sz',
        'Sz_total'                 : sz,
        'SWEEPS'                   : 4,
        'MAXSTATES'                : 100,
        'NUMBER_EIGENVALUES'       : 1,
        'MEASURE_AVERAGE[Magnetization]'                      : 'Sz',
        'MEASURE_LOCAL[Local magnetization]'                  : 'Sz',
        'MEASURE_CORRELATIONS[Diagonal spin correlations]'    : 'Sz',
        'MEASURE_CORRELATIONS[Offdiagonal spin correlations]' : 'Splus:Sminus',
    })
input_file = pyalps.writeInputFiles('chain_dmrg', parms)
pyalps.runApplication('dmrg', input_file, writexml=True)

# 2. 読み込み：セクターごとに DataSet のリスト。y[0] が基底状態
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='chain_dmrg'))
sector = {}
for task in data:
    sz = int(task[0].props['Sz_total'])
    sector[sz] = {s.props['observable']: s for s in task}
    print('Sz_total = %d: E = %.6f' % (sz, sector[sz]['Energy'].y[0]))
print('spin gap E(1) - E(0) = %.4f' % (sector[1]['Energy'].y[0] - sector[0]['Energy'].y[0]))

# 3. 抽出：相関では x は格点の組 (i, j)。
#    開放端から離れた参照格点から始まる組を取る
zz = sector[0]['Diagonal spin correlations']
pm = sector[0]['Offdiagonal spin correlations']
i0 = L // 4
def from_site(obs):
    pairs = np.array(obs.x)
    values = np.array(obs.y[0])
    keep = (pairs[:, 0] == i0) & (pairs[:, 1] > i0)
    return pairs[keep, 1] - i0, values[keep]
r, C_zz = from_site(zz)
r, C_pm = from_site(pm)

# 局所観測量：x は格点の番号
mloc = sector[1]['Local magnetization']

# 4. プロット
plt.figure()
plt.loglog(r, np.abs(C_zz), 'o', label=r'$|\langle S^z_{i_0} S^z_{i_0+r} \rangle|$')
plt.loglog(r, np.abs(C_pm) / 2, 's', mfc='none', label=r'$|\langle S^+_{i_0} S^-_{i_0+r} \rangle| / 2$')
plt.xlabel('distance $r$')
plt.ylabel('correlation')
plt.legend()

plt.figure()
plt.plot(mloc.x, mloc.y[0], 'o-')
plt.xlabel('site $i$')
plt.ylabel(r'$\langle S^z_i \rangle$ ($S^z_{\mathrm{total}} = 1$)')
plt.show()
```

スクリプトは $L = 32$ でのスピンギャップ $E(S^z{=}1) - E(S^z{=}0) = 0.118$ を表示します。
2 つの相関関数はスピン回転対称性から要求されるとおり一致し、べき的に減衰します。
$S^z_{\mathrm{total}} = 1$ の状態では磁化が交互に変わり、開放端の近くで最大になります。

![](/figs/api_examples_dmrg.png)

8 格点の開放端鎖では、DMRG の相関関数は `sparsediag` の結果と完全に一致します。

## ALPS 3.0.0 の既知の問題

以下の問題は、このページの測定に影響します。各項目には修正版が出るまでの対処法を記しています。修正の状況はリンク先の issue で追跡され、修正はリリースノートに記載されます。

- `loop` で `MEASURE[Green Function]=true` とした場合：計算終了時の評価が `scalar - vector conflict in path: .../Green's Function/labels` というエラーで失敗し、結果ファイルが書き出されません。グリーン関数は代わりに `dirloop_sse` で測定してください（[ALPS #420](https://github.com/ALPSim/ALPS/issues/420)）。
- `dirloop_sse` の `Green's Function` は、設定によっては誤った値になります（[ALPS #390](https://github.com/ALPSim/ALPS/issues/390)）。反強磁性体では符号 $(-1)^{r}$ が欠けているので、例 2 のように絶対値を使ってください。`SKIP` を指定すると値が `SKIP` 倍大きくなり、`RESTRICT_MEASUREMENTS` や、ソフトコアボソンでの `NO_WORMWEIGHT=1` でも誤った値になります。グリーン関数を測定するときは、これらのパラメータを指定しないでください。
- `worm`：観測量名を指定せずに `pyalps.loadMeasurements(files)` を呼ぶと、内部の観測量（`Time interval`）が読めないため空のリストが返ります。必要な名前を渡してください。例：`pyalps.loadMeasurements(files, ['Density', 'Stiffness'])`（[ALPS #421](https://github.com/ALPSim/ALPS/issues/421)）。
- `fulldiag` で `MEASURE_CORRELATIONS` または `MEASURE_STRUCTURE_FACTOR` を使った場合：`fulldiag_evaluate`（`evaluateFulldiagVersusT` から呼ばれる）がクラッシュします。`MEASURE_AVERAGE` と `MEASURE_LOCAL` は問題ありません。熱力学量と相関関数は別々のジョブで計算してください（[ALPS #422](https://github.com/ALPSim/ALPS/issues/422)）。
- 周期格子やラダーでは、`dmrg` の `MEASURE_CORRELATIONS` が誤った値を返します（[ALPS #390](https://github.com/ALPSim/ALPS/issues/390)）。例 4 のような開放端鎖では、結果は厳密対角化と一致します。
- 評価関数（`evaluateSpinMC`、`evaluateQWL`、`evaluateFulldiagVersusT` など）は、同じ Python セッションで先に `runApplication` を呼んでいる場合にしか補助プログラムを見つけられません。別の解析スクリプトでは、`pyalps` パッケージの `bin` ディレクトリを `PATH` に追加してください。これは 3.0.0 以降、[ALPS #158](https://github.com/ALPSim/ALPS/pull/158) で修正されています。
