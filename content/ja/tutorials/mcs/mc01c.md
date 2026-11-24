---
title: MC-01c 定常状態の検定
math: true
toc: true
weight: 4
---

モンテカルロシミュレーションは配位のマルコフ連鎖を生成し、連鎖が初期状態を忘れてはじめて、その測定は平衡分布からのサンプリングになります。
[MC-01b](../mc01b) では、そのために物理量の時系列を確認する方法を示し、この確認を統計的検定で自動化する `pyalps.checkSteadyState` を紹介しました。
このチュートリアルでは、この検定を詳しく見ていきます。何を計算しているのか、カットオフ $z_0$ が標準正規分布 $\Phi$ からどのように決まるのか、何も問題がないときにどれくらいの割合で合格するのか、そしてどのような非平衡を検出でき、どのようなものを検出できないのかを調べます。

検定は 2 つのアプリケーションに適用します。`spinmc` による 2 次元イジング模型の古典モンテカルロと、有向ループの確率級数展開コード `dirloop_sse` によるスピン 1/2 ハイゼンベルク反強磁性体の量子モンテカルロです。
どちらでも主な結論は同じです。この検定は実行の大部分にわたって続くドリフトは検出しますが、開始直後の大きく短い過渡的な振る舞いには弱くしか反応せず、時系列に自己相関があると、信頼水準から予想されるよりも頻繁に誤検出を起こします。

## 定常状態の検定

### 検定統計量

ALPS は各物理量の時系列を、連続する測定をまとめた最大でおよそ 128 個のビンとして保存します（[MC-01b](../mc01b) の「時系列の保存方法」を参照）。
`checkSteadyState` はこれら $N$ 個のビンの値 $y_1, \dots, y_N$ を取り、点 $(t, y_t)$（$t = 1, \dots, N$）に最小二乗法で直線 $y \approx \beta_0 + \beta_1 t$ をあてはめます。
あてはめた傾きは

$$\beta_1 = \frac{\sum_t (t - \bar t)(y_t - \bar y)}{\sum_t (t - \bar t)^2}, \qquad \sum_{t=1}^{N} (t - \bar t)^2 = \frac{N(N^2-1)}{12}$$

です。
系列にドリフトがなく、$N$ 個の値が互いに独立で標準偏差 $\sigma_y$ をもつなら、傾きはゼロのまわりに標準誤差 $\sigma_y \big/ \sqrt{\sum_t (t - \bar t)^2}$ でばらつきます。
検定は $\sigma_y$ を系列の標本標準偏差 $s$ で見積もるので、傾きの誤差は

$$\sigma_{\beta_1} = s \sqrt{\frac{12}{N(N^2-1)}}$$

となり、検定統計量はその誤差を単位とした傾き

$$z = \frac{|\beta_1|}{\sigma_{\beta_1}}$$

です。
これらの仮定のもとでは、符号付きの比 $\beta_1 / \sigma_{\beta_1}$ は近似的に標準正規変数 $Z$（平均 0、標準偏差 1）になります。
選んだ信頼水準で決まるカットオフ $z_0$ に対して $z < z_0$ であれば、検定は合格です。

後で重要になる点が 2 つあります。
第一に、$s$ はあてはめた直線からの残差ではなく系列そのものの標準偏差なので、強いドリフトは $s$ も大きくし、$z$ はおよそ $\sqrt{N}$ で頭打ちになります。
第二に、傾きの誤差はビンが互いに独立であることを仮定しています。[MC-01a](../mc01a) で見たように連続する測定は独立ではなく、各ビンが自己相関時間よりずっと長くない限り、連続するビンも独立ではありません。

### 標準正規分布 $\Phi$

$\Phi$ は標準正規分布の累積分布関数で、$Z$ が $x$ 以下である確率です。

$$\Phi(x) = P(Z \le x) = \frac{1}{\sqrt{2\pi}} \int_{-\infty}^{x} e^{-u^2/2}\, du = \frac{1}{2}\left[1 + \operatorname{erf}\!\left(\frac{x}{\sqrt 2}\right)\right].$$

0 から 1 まで増加し、$\Phi(0) = 1/2$、$\Phi(1) \approx 0.8413$、$\Phi(1.96) \approx 0.975$ で、対称性 $\Phi(-x) = 1 - \Phi(x)$ をもちます。
その逆関数 $\Phi^{-1}$ は分位関数で、$\Phi$ が与えられた確率 $p$ に達する $x$ を返します。
SciPy では、$\Phi$ は `scipy.stats.norm.cdf`、$\Phi^{-1}$ は `scipy.stats.norm.ppf` です。

### カットオフ $z_0$

`checkSteadyState` の引数 `confidenceInterval`（$c$ と書きます）は、ドリフトのない系列が合格する確率です。
受容域 $-z_0 < Z < z_0$ は対称なので、

$$P(|Z| < z_0) = \Phi(z_0) - \Phi(-z_0) = 2\Phi(z_0) - 1 = c \quad\Longrightarrow\quad z_0 = \Phi^{-1}\!\left(\frac{1+c}{2}\right)$$

となります。
受容域の外の確率 $1 - c$ は両側の裾に $(1-c)/2$ ずつ等しく分けられ、これが $(1+c)/2$ の由来です。
既定値 $c = 0.6827$ では $z_0 = 1$ となり、傾きがゼロから標準誤差 1 つ分以内なら合格です。
$c$ を大きくすると受容域が広がるので、検定は厳しくなるのではなく*緩く*なります。

pyalps 3.0.0 以前は、カットオフを $\Phi^{-1}(1 - c/2)$ として計算していました。これは各裾に $c/2$ を置くもので、補完的な水準 $1 - c$ に対するカットオフです。
このため既定の検定ではドリフトのない系列が 32% しか合格せず、$c$ を大きくすると検定は厳しくなります。
ALPS の master ブランチでは $\Phi^{-1}((1+c)/2)$ を使っています。

スクリプト <a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01c-steady-state/tutorial1c_test.py" data-filename="tutorial1c_test.py" target="_blank" rel="noopener">`tutorial1c_test.py`</a> は、ALPS を使わずに検定を手で計算します。
その 2 つの関数は `checkSteadyState` を再現します。

```Python
import numpy as np
from scipy.signal import lfilter
from scipy.stats import norm

def steady_state_z(ts):
    """あてはめた傾き、その標準誤差、z = |slope| / error を返す。"""
    ts = np.asarray(ts, dtype=float)
    N = len(ts)
    t = np.arange(1, N + 1)
    slope = np.polyfit(t, ts, 1)[0]
    error = np.std(ts, ddof=1) * np.sqrt(12. / (N * (N**2 - 1)))
    if error == 0.:
        return slope, error, 0.  # 定数の系列。pyalps.checkSteadyState と同じ扱い
    return slope, error, abs(slope) / error

def cutoff(c):
    """標準正規変数 Z が P(|Z| < z0) = c を満たす z0。"""
    return norm.ppf((1. + c) / 2.)
```

続いてスクリプトは、よく使う信頼水準での $z_0$ と、ドリフトのない系列が合格する割合 $2\Phi(z_0) - 1$ を出力します。

```
     c      z0   pass rate   z0 (3.0.0)   pass rate (3.0.0)
0.6827   1.000       0.683        0.409               0.317
0.9000   1.645       0.900        0.126               0.100
0.9500   1.960       0.950        0.063               0.050
0.9900   2.576       0.990        0.013               0.010
```

さらに、標準正規分布の密度の上に受容域を描きます。

![](/figs/mc01c_acceptance.png)

### 自己相関のある系列

合格率が $c$ になるのは、$N$ 個の点が互いに独立な場合だけです。
自己相関の影響を見るため、`tutorial1c_test.py` は $x_i = a\, x_{i-1} + \text{noise}$ で生成した、ドリフトのまったくない $N = 128$ 点の合成系列 10000 本に検定を適用します。
このような系列の積分自己相関時間は、点を単位として $\tau = (1+a)/(2(1-a))$ で、[MC-01a](../mc01a) で定義した量です。

```Python
rng = np.random.default_rng(2026)
N, samples = 128, 10000
z0 = cutoff(0.6827)
for a in [0., 0.5, 0.8, 0.95]:
    noise = rng.normal(size=(samples, N))
    noise[:, 0] /= np.sqrt(1 - a**2)
    series = lfilter([1.], [1., -a], noise, axis=1)
    z = np.array([steady_state_z(s)[2] for s in series])
    tau = (1 + a) / (2 * (1 - a))
    print('%7.1f   %.3f' % (tau, np.mean(z < z0)))
```

```
    tau   fraction passing at c = 0.6827 (N = 128 points)
    0.5   0.685
    1.5   0.441
    4.5   0.250
   19.5   0.124
```

独立な点（$\tau = 1/2$）は名目どおりの割合で合格します。
相関のある点では、傾きは $\sigma_{\beta_1}$ が仮定するより大きくばらつき、$z$ はおよそ $\sqrt{2\tau}$ 倍に膨らみ、ドリフトのまったくない系列でもたいていは不合格になります。
ALPS の時系列では、ここでの $\tau$ はビンを単位とした自己相関時間です。各ビンが測定の自己相関時間よりずっと長ければ小さく、そうでなければ 1 程度かそれ以上になります。

## 模型

古典モンテカルロは、正方格子上の強磁性イジング模型

$$H = -J \sum_{\langle i,j \rangle} \sigma_i \sigma_j, \qquad \sigma_i = \pm 1$$

に適用します。この模型は [E. Ising, Z. Phys. 31, 253 (1925)](https://doi.org/10.1007/BF02980577) で導入されました。
その臨界温度 $T_c = 2J / \ln(1+\sqrt{2}) \approx 2.269186\, J$ は [L. Onsager, Phys. Rev. 65, 117 (1944)](https://doi.org/10.1103/PhysRev.65.117) によって厳密に知られています。
$T_c$ では局所更新の自己相関時間が長く、どのような平衡化の検定にとっても厳しい場合になります。

量子モンテカルロは、正方格子上のスピン 1/2 ハイゼンベルク反強磁性体

$$H = J \sum_{\langle i,j \rangle} \mathbf{S}_i \cdot \mathbf{S}_j, \qquad J > 0$$

（[W. Heisenberg, Z. Phys. 49, 619 (1928)](https://doi.org/10.1007/BF01328601)）に適用し、[O. F. Syljuåsen and A. W. Sandvik, Phys. Rev. E 66, 046701 (2002)](https://doi.org/10.1103/PhysRevE.66.046701) の確率級数展開における有向ループアルゴリズムでシミュレーションします。
調べる物理量はエネルギーです。

## パラメータ

| パラメータ | 意味 | `spinmc` ドリフトの実行 | `spinmc` 平衡化済みの実行 | `dirloop_sse` 熱化なしの実行 | `dirloop_sse` 平衡化済みの実行 |
|---|---|---|---|---|---|
| `LATTICE` | 格子 | `square lattice` | `square lattice` | `square lattice` | `square lattice` |
| `MODEL` | ハミルトニアン | `Ising` | `Ising` | `spin` | `spin` |
| `local_S` | 格子点あたりのスピン | – | – | `1/2` | `1/2` |
| `L` | 格子の一辺の長さ（$L \times L$ 格子点、周期境界） | `128` | `48` | `32` | `32` |
| `J` | 結合 | `1`（強磁性） | `1` | `1`（反強磁性） | `1` |
| `T` | 温度 | `2.269186`（$T_c$） | `2.269186` | `0.25` | `0.25` |
| `UPDATE` | 局所更新またはクラスター更新 | `local` | `local` と `cluster` | – | – |
| `THERMALIZATION` | 測定前に捨てるステップ数 | `0` | `10000` | `0` | `1000` |
| `INITIAL_CUTOFF` | 演算子列の初期長（SSE） | – | – | `40000` | – |
| `SWEEPS` | 測定ステップ数 | `2000` | `20000` | `2000` | `4000` |
| 実行回数 | これらのパラメータでの独立な実行の回数 | 1 | 更新方法ごとに 100 | 10 | 100 |

局所更新では 1 ステップはすべての格子点を一巡するスイープで、クラスター更新では `SWEEPS` は 1 回の Wolff クラスター反転を数えます（[MC-01b](../mc01b) を参照）。

## パラメータファイル

コマンドラインでの実行には 2 つのパラメータファイルを使います。
<a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01c-steady-state/parm1c_drift" data-filename="parm1c_drift" target="_blank" rel="noopener">`parm1c_drift`</a> は、大きなイジング格子を $T_c$ で熱化なしに開始します。

```
LATTICE="square lattice"
MODEL="Ising"
T=2.269186
J=1
UPDATE="local"
THERMALIZATION=0
SWEEPS=2000
{L=128;}
```

<a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01c-steady-state/parm1c_sse" data-filename="parm1c_sse" target="_blank" rel="noopener">`parm1c_sse`</a> は、ハイゼンベルク反強磁性体を熱化なしに開始します。

```
LATTICE="square lattice"
MODEL="spin"
local_S=1/2
T=0.25
J=1
THERMALIZATION=0
INITIAL_CUTOFF=40000
SWEEPS=2000
{L=32;}
```

繰り返しの実行は以下の Python スクリプトで設定し、同じパラメータをループで組み立てます。

## 格子

どちらの模型も周期的な正方格子上にあり、すべての最近接ボンドに結合 $J$ があります。

```
  :       :       :       :
--o---J---o---J---o---J---o---J--
  |       |       |       |
  J       J       J       J
  |       |       |       |
--o---J---o---J---o---J---o---J--      L x L sites, periodic in both directions
  |       |       |       |
  J       J       J       J
  |       |       |       |
--o---J---o---J---o---J---o---J--
  :       :       :       :
```

正方格子では、イジング模型が厳密に知られた $T_c$ で有限温度の相転移を起こします。また二部格子なので、ハイゼンベルク反強磁性体は量子モンテカルロで負符号問題を起こしません。
これは [ALPS 格子ライブラリ](../../../documentation/intro/latticehowtos) に組み込まれた `square lattice` です。

## 手法の選択

`spinmc` には局所的なメトロポリス更新と Wolff クラスター更新があります。
$T_c$ では、局所更新の自己相関時間は系のサイズとともにおよそ $L^{2.17}$ で増大します（臨界緩和）が、クラスター更新は数回のクラスター反転で相関を失います（[MC-01a](../mc01a) を参照）。
両者を比べると、時系列の自己相関が検定にどう影響するかがわかります。
$48 \times 48$ で 30000 ステップの実行には 1、2 秒かかります。

量子模型では、$32 \times 32$ スピンのヒルベルト空間は $2^{1024}$ 個の状態をもち、厳密対角化の能力をはるかに超えますが、`dirloop_sse` は $T = 0.25$ で 1 回の実行あたり数秒でこれをサンプリングします。
有向ループのコードには比較できる局所版とクラスター版はありませんが、エネルギーはすぐに相関を失います。また演算子列は空から始まり、平衡での長さまで成長しなければなりません。
熱化の間、コードは演算子列のカットオフも調整します。熱化なしでは、`INITIAL_CUTOFF` を十分大きく設定しない限り、"nnonzero reached the maximum value" で停止します。

## シミュレーションの実行

コマンドラインで、パラメータファイルを XML に変換し、2 つのアプリケーションを実行します。

```
parameter2xml parm1c_drift
spinmc --Tmin 1 --write-xml parm1c_drift.in.xml

parameter2xml parm1c_sse
dirloop_sse --Tmin 1 --write-xml parm1c_sse.in.xml
```

続いて、Python で結果に検定を適用します（pyalps 3.0.0 を使う場合は、先に最後の注意を読んでください）。

```Python
import pyalps

for prefix, observable in [('parm1c_drift', '|Magnetization|'), ('parm1c_sse', 'Energy')]:
    data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix=prefix), observable)
    for d in pyalps.checkSteadyState(data):
        print(prefix, d.props['checkSteadyState'])
```

3 つのスクリプトは、繰り返しの実行を含めてすべてを実行し、以下に示す数値と図を出力します。

```
python tutorial1c_test.py
python tutorial1c_spinmc.py
python tutorial1c_sse.py
```

<a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01c-steady-state/tutorial1c_spinmc.py" data-filename="tutorial1c_spinmc.py" target="_blank" rel="noopener">`tutorial1c_spinmc.py`</a> と <a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01c-steady-state/tutorial1c_sse.py" data-filename="tutorial1c_sse.py" target="_blank" rel="noopener">`tutorial1c_sse.py`</a> を `tutorial1c_test.py` と同じ場所にダウンロードしてください。
どのスクリプトも上と同じように `steady_state_z` と `cutoff` を定義しているので、数値は pyalps のバージョンに依存しません（最後の注意を参照）。
繰り返しの実行には、スクリプトごとに数分かかります。

## 結果：古典モンテカルロ

### まだドリフトしている実行

`tutorial1c_spinmc.py` はまず `parm1c_drift` を実行し、検定を手で、また `pyalps.checkSteadyState` で計算します。

```Python
files = pyalps.getResultFiles(prefix='parm1c_drift')
ts = np.array(pyalps.loadTimeSeries(files[0], '|Magnetization|'))
slope, error, z = steady_state_z(ts)
print('drift run: %d bins, z = %.2f, cutoff z0 = %.2f, passes: %s'
      % (len(ts), z, cutoff(0.6827), z < cutoff(0.6827)))

data = pyalps.loadMeasurements(files, '|Magnetization|')
try:
    for d in pyalps.checkSteadyState(data):
        s = d.props['checkSteadyState']
        print('pyalps.checkSteadyState: z = %.2f, z0 = %.2f, passes: %s'
              % (s['statistics']['z'], s['statistics']['z0'], s['value']))
except AttributeError as error:
    # pyalps 3.0.0 は現在の SciPy にない scipy.linspace を呼び出す
    print('pyalps.checkSteadyState failed with this pyalps and SciPy:', error)
```

私たちの実行では次のように出力されました。

```
drift run: 124 bins, z = 8.45, cutoff z0 = 1.00, passes: False
pyalps.checkSteadyState: z = 8.45, z0 = 1.00, passes: False
```

手で計算した $z$ と $z_0$ はライブラリの値と一致します。
pyalps 3.0.0 ではライブラリは代わりに $z_0 = 0.41$ を出力しますが（最後の注意を参照）、この実行はやはり不合格です。

![](/figs/mc01c_spinmc_drift.png)

`spinmc` はすべてのスピンが上向きの状態から始め、磁化はまず数百スイープのうちに 1 からおよそ 0.6 まで緩和します。
その後もおよそ 0.35 から 0.75 の間をゆっくりとさまよい続けます。$T_c$ では、$128 \times 128$ 格子での局所更新の自己相関時間はこの実行よりはるかに長いのです。
検定が不合格となるのは正しいことです。このゆっくりとしたさまよいを初期緩和の終わりと呼ぶにせよ臨界緩和と呼ぶにせよ、この実行の時間スケールでは磁化は定常状態にありません。

### 平衡化済みの多数の実行

次にスクリプトは、10000 ステップ熱化した平衡化済みの実行を、局所更新とクラスター更新でそれぞれ 100 回繰り返し、検定に合格する頻度を記録します。

```Python
NRUNS = 100
c = 0.6827
for update in ['local', 'cluster']:
    parms = [{
        'LATTICE'        : "square lattice",
        'MODEL'          : "Ising",
        'L'              : 48,
        'J'              : 1.,
        'T'              : 2.269186,
        'UPDATE'         : update,
        'THERMALIZATION' : 10000,
        'SWEEPS'         : 20000,
    } for run in range(NRUNS)]
    prefix = 'parm1c_' + update
    input_file = pyalps.writeInputFiles(prefix, parms)
    pyalps.runApplication('spinmc', input_file, Tmin=1, writexml=True)

    z = np.array([steady_state_z(pyalps.loadTimeSeries(f, '|Magnetization|'))[2]
                  for f in pyalps.getResultFiles(prefix=prefix)])
    print('%-7s updates: %d runs, fraction passing at c = %g: %.2f (expected %.2f)'
          % (update, len(z), c, np.mean(z < cutoff(c)), c))
```

```
local   updates: 100 runs, fraction passing at c = 0.6827: 0.41 (expected 0.68)
cluster updates: 100 runs, fraction passing at c = 0.6827: 0.72 (expected 0.68)
```

| 更新方法 | 実行回数 | $c = 0.6827$ での合格割合 | ビンが独立な場合の期待値 |
|---|---|---|---|
| 局所 | 100 | 0.41 | 0.68 |
| クラスター | 100 | 0.72 | 0.68 |

100 回の実行では、これらの割合には約 $\pm 0.05$ の統計的不確かさがあります。
クラスター更新の実行は名目どおりの割合で合格し、その $z$ の値は標準正規変数 $Z$ の $|Z|$ の分布に従います。
局所更新の実行は、どれも平衡化済みであるにもかかわらず半分以上が不合格になります。その $z$ の分布は 2 を超えたところに長い裾をもっています。

![](/figs/mc01c_spinmc_z.png)

原因はビンの間の自己相関です。
局所更新の実行の各ビンは 256 スイープの平均で、$T_c$ ではこれは自己相関時間よりそれほど長くありません。そのため連続するビンは相関し、検定はゆっくりとした揺らぎをドリフトとみなします。
クラスター更新は各ビンの中で相関を失い、ビンは独立な標本のように振る舞います。

## 結果：量子モンテカルロ

### 開始直後の短い過渡的な振る舞い

`tutorial1c_sse.py` はまず `parm1c_sse` を 10 回繰り返し、各時系列について最初のビンを含めた場合と除いた場合で検定を計算します。

```Python
NSTART = 10
parms = [{
    'LATTICE'        : "square lattice",
    'MODEL'          : "spin",
    'local_S'        : 0.5,
    'L'              : 32,
    'J'              : 1.,
    'T'              : 0.25,
    'THERMALIZATION' : 0,
    'INITIAL_CUTOFF' : 40000,
    'SWEEPS'         : 2000,
} for run in range(NSTART)]
input_file = pyalps.writeInputFiles('parm1c_start_sse', parms)
pyalps.runApplication('dirloop_sse', input_file, Tmin=1, writexml=True)

files = pyalps.getResultFiles(prefix='parm1c_start_sse')
series = [np.array(pyalps.loadTimeSeries(f, 'Energy')) for f in files]
z = np.array([steady_state_z(ts)[2] for ts in series])
z_rest = np.array([steady_state_z(ts[1:])[2] for ts in series])
```

私たちの実行では次のように出力されました。

```
runs without thermalization: z = 1.6 2.1 1.8 2.5 1.2 2.1 1.8 1.8 2.1 1.4
the same runs without the first bin: z = 0.3 1.4 0.3 3.1 1.6 1.8 0.4 0.4 1.5 0.6
fraction passing at c = 0.6827 (z0 = 1.00): 0.0 with the first bin, 0.5 without
fraction passing at c = 0.95 (z0 = 1.96): 0.6 with the first bin, 0.9 without
```

![](/figs/mc01c_sse_transient.png)

エネルギーは 16 スイープからなる最初のビンの中で緩和し、その間に演算子列は空の初期状態から成長します。
最初のビンは平衡エネルギーよりおよそ 300 高く、後のビンのばらつきの 40 倍ほどですが、図に示した実行の $z$ は 1.6 にすぎません。$z_0 = 1$ の既定の検定には不合格ですが、$c = 0.95$ では合格します。
開始時の外れた点が 1 つだけでは、傾きはそれほど有意になりません。しかもその点は、傾きを割る標準偏差 $s$ も大きくします。
$c = 0.6827$ では 10 回すべてが不合格で、既定の水準では検定は過渡的な振る舞いを捉えています。ただし $z$ は 1.2 から 2.5 にとどまってドリフトする実行のような大きな値にはならず、$c = 0.95$ では 10 回のうち 6 回が合格します。
この検定は系列全体にわたる線形な傾向を検出するためのものです。最初のいくつかのビンに限られた過渡的な振る舞いは、時系列を見て見つけるか、単に数百スイープ熱化して避けるのがよいでしょう。

### 平衡化済みの多数の実行

1000 スイープ熱化して 100 回繰り返すと、次の結果が得られます。

```
100 equilibrated runs, fraction passing at c = 0.6827: 0.70 (expected 0.68)
```

![](/figs/mc01c_sse_z.png)

ここでは各ビンが 32 スイープの平均で、これはすでに SSE のエネルギーの自己相関時間より長いので、ビンはほぼ独立であり、クラスター更新のイジング模型の実行と同じく、検定は名目どおりの割合で合格します。

## pyalps 3.0.0

{{< callout type="warning" >}}
**pyalps 3.0.0 以前。** `checkSteadyState` はカットオフ $\Phi^{-1}(1 - c/2)$ を使います。これは既定値で約 0.41 なので、ドリフトのない系列のおよそ 3 分の 2 が不合格になり、`confidenceInterval` を大きくすると検定は厳しくなります。
また `scipy.linspace` を呼び出しますが、新しい SciPy にはこの関数がもうないため、`AttributeError: Module 'scipy' has no attribute 'linspace'` で停止します。
どちらも ALPS の master ブランチで修正済みです。
このチュートリアルのスクリプトは $z$ と $z_0$ を自分で計算します。`tutorial1c_spinmc.py` で 1 回だけ呼び出す `checkSteadyState` が失敗した場合は、メッセージを表示して先に進みます。pyalps 3.0.0 で `checkSteadyState` を呼び出すには、pyalps を import する前に次のコードを実行してください。

```Python
# pyalps 3.0.0 のみ：新しい SciPy で削除された NumPy の別名を復元する
import scipy
import numpy as np

for name in dir(np):
    if not hasattr(scipy, name):
        setattr(scipy, name, getattr(np, name))
```

このページの結果は ALPS の master ブランチで得たもので、実行はちょうど `SWEEPS` 回の測定を行います。pyalps 3.0.0 では、実行はスケジューラの次の確認まで測定を続けるため（[MC-01b](../mc01b) の `Tmin` を参照）、それより多くの測定を行うことがあります。
これで変わるのはビンの数であって、検定の振る舞いではありません。
{{< /callout >}}

## まとめと展望

`checkSteadyState` は、ビンにまとめた時系列のあてはめの傾きを、ビンが独立だと仮定した標準誤差で割り、その比が $z_0 = \Phi^{-1}((1+c)/2)$ より小さければ合格とします。
実行の大部分にわたって続くドリフトは検出しますが、最初のいくつかのビンに限られた過渡的な振る舞いには、それがどれほど大きくても弱くしか反応せず、連続するビンが相関しているとき（たとえば $T_c$ での局所更新）には、平衡化済みの実行を $1 - c$ よりはるかに高い頻度で不合格にします。
平衡化の証明としてではなく、時系列そのものや [MC-01a](../mc01a) のビニング解析と組み合わせた警告として使ってください。

1. `tutorial1c_spinmc.py` の第 2 部を $c = 0.95$ で実行し直してください。局所更新とクラスター更新の合格割合は 0.95 にどれくらい近いでしょうか。
2. ドリフトの実行に 50000 スイープの熱化を加えてください。今度は合格しますか。その答えは $L$ にどう依存するでしょうか。
3. 局所更新の実行について、$z$ を計算する前に連続する 2 つのビンを足し合わせてください（ビンの数が奇数なら最後のビンは捨てます）。合格割合はどう変わりますか。それはなぜでしょうか。
4. $T_c$ で $L = 16$、32、48 について局所更新の実験を行ってください。誤検出の頻度は $L$ にどう依存し、それは MC-01a の自己相関時間とどう関係するでしょうか。
5. `tutorial1c_test.py` で、ドリフトのない合成系列の最初の点に外れ値を 1 つ加えてください。$c = 0.95$ で検定が不合格になるには、ノイズを単位としてどれくらいの大きさが必要でしょうか。
6. 実行開始時の過渡的な振る舞いに対するよりよい検定を考えてください。たとえば時系列の最初の 4 分の 1 と最後の 4 分の 1 の平均を比べます。それは SSE の実行の過渡的な振る舞いを検出できるでしょうか。
