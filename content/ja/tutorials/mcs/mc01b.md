
---
title: MC-01b 平衡化
math: true
toc: true
weight: 3
---

モンテカルロシミュレーションはいずれも、平衡から遠く離れた何らかの初期配位——多くはランダムな状態か完全に秩序化した状態——から出発します。
実行の最初の段階では、マルコフ連鎖が平衡分布へと緩和していきます。この*熱化*期間中に行われた測定は、出発点の選び方によるバイアスを受けています。
平均を計算する前に、これらは破棄しなければなりません。
系が初期状態の記憶を失うのに必要なスイープ数は自己相関時間によって決まります（[MC-01a](../mc01a) を参照）。相関が長距離に及ぶ相転移点の近傍では、熱化に数千回ものスイープが必要になることがあります。

このチュートリアルでは、関連する 2 つの診断を扱います。

- **平衡化**：シミュレーションは初期状態を離れ、平衡分布に達したか。
- **収束**：測定された平均値の統計誤差が十分小さくなるまで、シミュレーションは長く実行されたか。

どちらも、測定した物理量の時系列を調べることで確認します。ここでは臨界温度における 2 次元イジング模型の磁化を用います。

## 平衡化

### コマンドラインでのシミュレーションの準備と実行

パラメータファイル <a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01b-equilibration-and-convergence/parm1a" data-filename="parm1a" target="_blank" rel="noopener">`parm1a`</a> は、臨界温度における $48 \times 48$ の正方格子上のイジング模型のシミュレーションを 1 つ設定します。

```
LATTICE="square lattice"
T=2.269186
J=1
THERMALIZATION=10000
SWEEPS=50000
UPDATE="local"
MODEL="Ising"
{L=48;}
```

パラメータファイルを XML に変換し、`spinmc` を実行します。

```
parameter2xml parm1a
spinmc --Tmin 10 --write-xml parm1a.in.xml
```

### Python でのシミュレーションの準備と実行

完全なスクリプトは <a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01b-equilibration-and-convergence/tutorial1a.py" data-filename="tutorial1a.py" target="_blank" rel="noopener">`tutorial1a.py`</a> として入手できます。
まず必要なモジュールをインポートし、シミュレーションのパラメータを定義します。

```Python
import pyalps
import matplotlib.pyplot as plt

parms = [{
    'LATTICE'         : "square lattice",
    'MODEL'           : "Ising",
    'L'               : 48,
    'J'               : 1.,
    'T'               : 2.269186,
    'THERMALIZATION'  : 10000,
    'SWEEPS'          : 50000,
    }]
```

パラメータを XML 入力ファイルに書き出し、`spinmc` を実行します。

```Python
input_file = pyalps.writeInputFiles('parm1a', parms)
pyalps.runApplication('spinmc', input_file, Tmin=10, writexml=True)
```

### 時系列の確認

平衡化を確認する最も直接的な方法は、測定した物理量の時系列をプロットすることです。
出力ファイルから磁化の時系列を読み込んでプロットします。

```Python
files = pyalps.getResultFiles(prefix='parm1a')
ts_M = pyalps.loadTimeSeries(files[0], '|Magnetization|')

plt.plot(ts_M)
plt.xlabel('Monte Carlo sweep')
plt.ylabel('|Magnetization|')
plt.title('Magnetization time series')
plt.show()
```

得られた図を確認してください。物理量は初期の過渡的な振る舞いのあと、ほぼ定常な値に落ち着くはずです。
実行の終わりになっても時系列がまだ漂動している場合、あるいは最初のスイープで明らかな傾向が見られ、それが測定段階まで続いている場合は、熱化期間（`THERMALIZATION`）が短すぎるので長くする必要があります。
上記のパラメータ（`THERMALIZATION=10000`）では、時系列はすでに安定した平均値のまわりで揺らいでおり、目立った漂動は見られません。熱化が十分であったことを示しています。

![](/figs/mcs01btimeseries.png)

### 自動チェック：`pyalps.checkSteadyState`

平衡化を目視で判断する代わりに、`pyalps.checkSteadyState` は統計的検定を適用して、時系列が定常分布に達したかどうかを判定します。
各物理量が検定に合格したかどうかを示すフラグを付けたデータを返します。
既定の信頼水準は 68.27%（1 シグマ）ですが、これを引き上げることもできます。

```Python
data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm1a'), '|Magnetization|')

# 既定：68.27% 信頼区間
data = pyalps.checkSteadyState(data)

# より厳しく：90% 信頼区間
data = pyalps.checkSteadyState(data, confidenceInterval=0.9)
```

pyalps 3.0.0 の `checkSteadyState` は `scipy.linspace` を呼び出しますが、新しい SciPy にはこの関数がもうないため、次のエラーで失敗します。

```
AttributeError: Module 'scipy' has no attribute 'linspace'
```

これは ALPS の master ブランチで修正済みです。修正がリリースされるまでは、pyalps を import する前に次のコードを実行してください。

```Python
# pyalps 3.0.0 のみ：新しい SciPy で削除された NumPy の別名を復元する
import scipy
import numpy as np

for name in dir(np):
    if not hasattr(scipy, name):
        setattr(scipy, name, getattr(np, name))
```

## 収束

収束は平衡化とは別の問題です。系が完全に平衡に達したあとでも、測定された平均値の統計誤差は独立な標本数 $N$ に対して $1/\sqrt{N}$ でしか減少しません。
収束チェックは、誤差評価が信頼でき安定したものになるだけの測定をシミュレーションが蓄積したかどうかを確認します。

`pyalps.checkConvergence` は、測定された平均値の誤差が安定したかどうかを検定します。
使い方は `checkSteadyState` と同じです。

```Python
data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm1a'), '|Magnetization|')
data = pyalps.checkConvergence(data)
```

チェックに通らない場合は、`SWEEPS` を増やしてシミュレーションを再実行してください。

## 問題

問題をクリックすると解答が表示され、もう一度クリックすると隠れます。

<details style="margin-bottom: 1rem">
<summary style="font-weight: 600; cursor: pointer">1. <code>THERMALIZATION</code> 期間を大幅に短くしてみてください（たとえば 100 スイープ）。時系列に初期の過渡的な振る舞いが見えますか。<code>checkSteadyState</code> はそれを検出しますか。</summary>
<div style="margin: 0.6rem 0 0 1.2rem; padding-left: 0.9rem; border-left: 3px solid rgba(128,128,128,0.35)">

上の Python のパラメータでは `UPDATE` を指定していません。指定がない場合、`spinmc` はこのモデルに対してクラスター更新を使います。
クラスター更新は数回の更新で熱化するため、100 ステップの熱化でも十分すぎるほどです。
問題を意味のあるものにするため、局所更新を使います。

```Python
# pyalps 3.0.0 のみ：checkSteadyState の節にある SciPy についての注意を参照
import scipy
import numpy as np
for name in dir(np):
    if not hasattr(scipy, name):
        setattr(scipy, name, getattr(np, name))

import matplotlib.pyplot as plt
import pyalps

parms = [{
    'LATTICE'         : "square lattice",
    'MODEL'           : "Ising",
    'L'               : 48,
    'J'               : 1.,
    'T'               : 2.269186,
    'THERMALIZATION'  : 100,
    'SWEEPS'          : 50000,
    'UPDATE'          : "local",
    }]

input_file = pyalps.writeInputFiles('mc01b_q1', parms)
pyalps.runApplication('spinmc', input_file, Tmin=1, writexml=True)

files = pyalps.getResultFiles(prefix='mc01b_q1')
data = pyalps.loadMeasurements(files, '|Magnetization|')
for dataset in pyalps.checkSteadyState(data):
    print('Steady state check:', dataset.props['checkSteadyState']['value'])

# 時系列の各要素は、1 つのビンにわたるサイトあたりの |M| の和
ts_M = np.array(pyalps.loadTimeSeries(files[0], '|Magnetization|'))
M = data[0][0].y[0].mean
binsize = 2 ** int(round(np.log2(ts_M.mean() / M)))
sweeps = (np.arange(len(ts_M)) + 0.5) * binsize

plt.figure()
plt.plot(sweeps, ts_M / binsize, 'o-')
plt.axhline(M, ls='--', color='gray', label='mean')
plt.ylim(0, 1)
plt.xlabel('Monte Carlo sweeps after thermalization')
plt.ylabel('|Magnetization| per site')
plt.title('T = T_c, THERMALIZATION = 100 (each point: mean over %d sweeps)' % binsize)
plt.legend()
plt.show()
```

![](/figs/mc01b_q1_answergraph.png)

初期の過渡的な振る舞いは見えません。理由は 3 つあります。

- 測定は熱化期間が終わってから始まるため、最初の 100 スイープは時系列にまったく現れません。
- ALPS が保持するビンは最大でおよそ 128 個で、実行が進むにつれてビンの大きさを倍にしていきます。ここでは各点が 1024 スイープの平均なので、最初の 1000 スイープほどの間に起きたことはすべて最初の点に平均されてしまいます。
- `spinmc` はすべてのスピンが上向きの状態から始めます。$T_c$ では、磁化はこの状態からおよそ最初の 1000 スイープ以内に緩和します（問題 2 の図を参照）。これも最初の点の中に収まります。

深く落ち込んでいる部分も過渡的な振る舞いではなく、$T_c$ における局所更新のゆっくりとした臨界揺らぎです（臨界緩和、[MC-01a](../mc01a) を参照）。
過渡的な振る舞いそのものを見るには、問題 2 のように `THERMALIZATION` を 0 にし、`SWEEPS` を減らしてビンを短くしてください。

私たちの実行では `checkSteadyState` は `False` を出力しましたが、これは 100 スイープでは足りないことを意味しません。
このチェックは時系列に直線をあてはめ、傾きがゼロと矛盾しない場合にのみ合格とします。
pyalps 3.0.0 では既定の判定基準が $|\text{slope}| / \sigma_\text{slope} < 0.41$ なので、十分に平衡化した実行でもたいていは不合格になります（問題 4 で確かめられます）。
逆に、合格しても平衡化が証明されるわけではありません。検出できるのは線形のドリフトだけだからです。
必ず時系列も確認してください。
</div>
</details>

<details style="margin-bottom: 1rem">
<summary style="font-weight: 600; cursor: pointer">2. 臨界温度から離れると、必要な熱化の長さはどう変わるでしょうか。T = 1.5 と T = 3.5 を試してください。</summary>
<div style="margin: 0.6rem 0 0 1.2rem; padding-left: 0.9rem; border-left: 3px solid rgba(128,128,128,0.35)">

$T = 1.5$、$T_c$、$T = 3.5$ で熱化を一切行わずに実行し、磁化が落ち着くまでにどれだけかかるかを見ます。
実行を短くするとビンも短く保たれるので、緩和の始まりが見えるようになります。

```Python
import numpy as np
import matplotlib.pyplot as plt
import pyalps

temperatures = [1.5, 2.269186, 3.5]
parms = []
for t in temperatures:
    parms.append({
        'LATTICE'         : "square lattice",
        'MODEL'           : "Ising",
        'L'               : 48,
        'J'               : 1.,
        'T'               : t,
        'THERMALIZATION'  : 0,
        'SWEEPS'          : 1000,
        'UPDATE'          : "local",
        })

input_file = pyalps.writeInputFiles('mc01b_q2', parms)
pyalps.runApplication('spinmc', input_file, Tmin=1, writexml=True)

plt.figure()
for f in pyalps.getResultFiles(prefix='mc01b_q2'):
    data = pyalps.loadMeasurements([f], '|Magnetization|')[0][0]
    ts_M = np.array(pyalps.loadTimeSeries(f, '|Magnetization|'))
    # 時系列の各要素は、1 つのビンにわたるサイトあたりの |M| の和
    binsize = 2 ** int(round(np.log2(ts_M.mean() / data.y[0].mean)))
    sweeps = (np.arange(len(ts_M)) + 0.5) * binsize
    # 各曲線のラベルはその実行自身のパラメータから付ける：結果ファイルは parms の順に並ぶとは限らない
    plt.plot(sweeps, ts_M / binsize, 'o-', markersize=3, label='T = %g' % data.props['T'])
plt.ylim(0, 1.05)
plt.xlabel('Monte Carlo sweeps (no thermalization)')
plt.ylabel('|Magnetization| per site')
plt.title('Relaxation from the initial state, local updates')
plt.legend(loc='center right')
plt.show()
```

`Tmin` のために、実行は 1000 スイープをはるかに超えて続きます（問題 3 を参照）。

![](/figs/mc01b_q2_relaxation.png)

どの実行も `spinmc` の初期状態、つまりすべてのスピンが上向きの状態（$|M| = 1$）から始まります。

- $T = 1.5$ では平衡磁化がおよそ 0.99 で初期状態に近いため、最初の点から平衡に達しています。
- $T = 3.5$ では、平衡値のおよそ 0.04 を上回っているのは最初の点（最初の 128 スイープ）だけなので、系は 128 スイープよりずっと短い時間で初期状態を忘れます。
- $T_c$ では、磁化がおよそ 0.4 から 0.8 の間をゆっくりと揺れ動き、一つ一つの振れが数百から数千スイープ続きます。系が初期状態を忘れるにも、それと同程度の時間が必要です。

したがって、必要な熱化は $T_c$ で最も長く、その両側ではずっと短くなります。局所更新の自己相関時間が臨界点で最大になるためです（臨界緩和）。
$T = 1.5$ と $T = 3.5$ では `THERMALIZATION = 10000` で十分すぎるほどです。

この結論は初期状態と更新方法に依存します。
ランダムな初期状態から始めると、$T = 1.5$ での局所更新ははるかに長い時間を要します。秩序だったドメインが格子全体の大きさまで成長しなければならないからです。
クラスター更新は、3 つの温度のいずれでも数回の更新で熱化します。

`checkSteadyState` ではこの問題に答えられません。系列全体に線形のドリフトがあるかどうかを検定するだけなので、過渡的な振る舞いがどれだけ続いたかはわかりません。また、pyalps 3.0.0 では結果が実行ごとに変わります（問題 1 を参照）。
</div>
</details>

<details style="margin-bottom: 1rem">
<summary style="font-weight: 600; cursor: pointer">3. <code>SWEEPS</code> を 10 倍に増やし、また 10 分の 1 に減らしてみてください。磁化の誤差棒はどう変わりますか。これは期待される 1/&radic;<i>N</i> のスケーリングと一致しますか。</summary>
<div style="margin: 0.6rem 0 0 1.2rem; padding-left: 0.9rem; border-left: 3px solid rgba(128,128,128,0.35)">

$T_c$ ではなく $T = 3.5$ を使ってください。$T_c$ では局所更新の相関が非常に強く、誤差棒そのものを見積もるのが難しいからです。
また、局所更新を使ってください。
既定のクラスター更新では `SWEEPS` は 1 回の Wolff クラスター反転を数えますが、$T = 3.5$ ではクラスターが非常に小さいため、連続する測定どうしの相関が強くなります。

誤差が測定回数 $N$ に対して $1/\sqrt{N}$ でスケールするなら、測定を 10 倍にすると誤差は $1/\sqrt{10} \approx 0.32$ 倍になり、積 $\text{error} \cdot \sqrt{N}$ は一定に保たれます。
次のスクリプトは、各誤差棒と並べて実際に行われた測定回数を出力します。

```Python
import numpy as np
import pyalps

parms = []
for sweeps in [5000, 50000, 500000]:
    parms.append({
        'LATTICE'         : "square lattice",
        'MODEL'           : "Ising",
        'L'               : 48,
        'J'               : 1.,
        'T'               : 3.5,
        'THERMALIZATION'  : 10000,
        'SWEEPS'          : sweeps,
        'UPDATE'          : "local",
        })

input_file = pyalps.writeInputFiles('mc01b_q3', parms)
pyalps.runApplication('spinmc', input_file, Tmin=1, writexml=True)

files = pyalps.getResultFiles(prefix='mc01b_q3')
data = pyalps.loadMeasurements(files, '|Magnetization|')
for run in sorted(pyalps.flatten(data), key=lambda run: run.props['SWEEPS']):
    # 実際に行われた測定回数。SWEEPS を超えることがある
    archive = pyalps.hdf5.archive(run.props['filename'])
    n = archive['/simulation/results/|Magnetization|/count']
    m = run.y[0]
    print('SWEEPS = %6d   measurements = %6d   |M| = %.5f +/- %.5f   error * sqrt(n) = %.3f'
          % (run.props['SWEEPS'], n, m.mean, m.error, m.error * np.sqrt(n)))
```

私たちの実行では次のように出力されました（値は実行ごとに異なります）。

```
SWEEPS =   5000   measurements =  25915   |M| = 0.04246 +/- 0.00049   error * sqrt(n) = 0.079
SWEEPS =  50000   measurements =  50189   |M| = 0.04091 +/- 0.00030   error * sqrt(n) = 0.068
SWEEPS = 500000   measurements = 509100   |M| = 0.04106 +/- 0.00010   error * sqrt(n) = 0.073
```

`SWEEPS` は測定回数ではありません。
`Tmin=1` のとき、スケジューラは実行が終わったかどうかを 1 秒ごとに確認し、実行は次の確認まで測定を続けます。そのため、5000 スイープの実行では実際にはおよそ 26000 回の測定が行われました。
`SWEEPS` で比べると、誤差棒にははっきりした規則が見えません。
実際の測定回数で比べると、3 つの実行すべてで $\text{error} \cdot \sqrt{N}$ がおよそ 0.07 となり、$1/\sqrt{N}$ のスケーリングが予言するとおりになります。

誤差棒が意味を持つのは、ビニング解析が収束している場合だけです。
ビニング解析は測定をしだいに大きなビンにまとめて誤差を見積もります。その見積もりはビンの長さが自己相関時間を超えるまで増え続け、その後は一定になります。

```Python
binning = pyalps.loadBinningAnalysis(files, '|Magnetization|')
for run in sorted(pyalps.flatten(binning), key=lambda run: run.props['SWEEPS']):
    print('%6d' % run.props['SWEEPS'], ' '.join('%.1e' % e for e in run.y))
```

```
  5000 2.0e-04 2.6e-04 3.2e-04 3.8e-04 4.3e-04 4.6e-04 4.9e-04 4.9e-04
 50000 1.4e-04 1.8e-04 2.2e-04 2.6e-04 2.9e-04 3.0e-04 3.0e-04 3.0e-04 3.0e-04
500000 4.3e-05 5.6e-05 7.0e-05 8.3e-05 9.1e-05 9.6e-05 9.8e-05 9.8e-05 9.8e-05 9.9e-05 1.0e-04 1.0e-04
```

3 つとも一定値に落ち着いているので、これらの誤差棒は信頼できます。
連続する測定の間の相関によって、各誤差棒は独立な標本の場合より大きくなりますが、$1/\sqrt{N}$ のスケーリングそのものは変わりません。
</div>
</details>

<details style="margin-bottom: 1rem">
<summary style="font-weight: 600; cursor: pointer">4. 平衡化と収束の両方を確認することがなぜ重要なのでしょうか。一方のチェックに合格し、もう一方に不合格となることはありうるでしょうか。</summary>
<div style="margin: 0.6rem 0 0 1.2rem; padding-left: 0.9rem; border-left: 3px solid rgba(128,128,128,0.35)">

平衡化は、平均値が初期状態によって偏っていないことを保証します。
収束は、その平均値の誤差棒が信頼できることを保証します。
実行はどちらか一方だけに不合格となりえます。熱化が足りない実行は、偏った平均値のまわりに小さく安定した誤差棒を与えることがあり、十分に熱化していても自己相関時間に比べて短すぎる実行では、誤差棒が信頼できません。

2 つのチェックが調べている内容も異なります。
`checkSteadyState` は時系列の線形ドリフトを探し、`checkConvergence` は誤差のビニング解析が一定値に落ち着いたかどうかを調べます（問題 3 を参照）。
私たちの実行では、$T_c$ での局所更新は、先に熱化したかどうかにかかわらず、最大 50000 スイープでは一度も `checkConvergence` に合格しませんでした。そこでの自己相関時間がこの長さの実行には長すぎるからです。

どちらのチェックも統計的検定なので、同一の十分に熱化した実行どうしでも、結果は必ずしも一致しません。
次のスクリプトは、同じ平衡化済みのクラスター更新の実行を 5 回繰り返します。

```Python
# pyalps 3.0.0 のみ：checkSteadyState の節にある SciPy についての注意を参照
import scipy
import numpy as np
for name in dir(np):
    if not hasattr(scipy, name):
        setattr(scipy, name, getattr(np, name))

import pyalps

parms = []
for run in range(5):
    parms.append({
        'LATTICE'         : "square lattice",
        'MODEL'           : "Ising",
        'L'               : 48,
        'J'               : 1.,
        'T'               : 2.269186,
        'THERMALIZATION'  : 10000,
        'SWEEPS'          : 50000,
        'UPDATE'          : "cluster",
        })

input_file = pyalps.writeInputFiles('mc01b_q4', parms)
pyalps.runApplication('spinmc', input_file, Tmin=1, writexml=True)

data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='mc01b_q4'), '|Magnetization|')
steady = pyalps.checkSteadyState(data)
converged = pyalps.checkConvergence(data)

for run, (s, c) in enumerate(zip(steady, converged)):
    print('run %d   |M| = %.4f +/- %.4f   steady state: %s   converged: %s'
          % (run + 1, s.y[0].mean, s.y[0].error, s.props['checkSteadyState']['value'], c.props['checkConvergence']))
```

私たちの実行では次のように出力されました（フラグは実行ごとに異なります）。

```
run 1   |M| = 0.6205 +/- 0.0016   steady state: False   converged: True
run 2   |M| = 0.6237 +/- 0.0019   steady state: True   converged: True
run 3   |M| = 0.6226 +/- 0.0018   steady state: False   converged: True
run 4   |M| = 0.6239 +/- 0.0014   steady state: False   converged: True
run 5   |M| = 0.6216 +/- 0.0021   steady state: False   converged: False
```

5 つの平均値は誤差の範囲で一致していますが、フラグはまちまちです。両方に合格した実行が 1 つ、定常状態のチェックだけに不合格の実行が 3 つ、両方に不合格の実行が 1 つです。
ここでの定常状態チェックの不合格は、問題 1 で述べた pyalps 3.0.0 の厳しい判定基準による誤検出です。
したがって、一方のチェックに合格し、もう一方に不合格となることは実際にありえます。
2 つのチェックは、どこを確認すべきかを教えてくれる警告として扱い、時系列とビニング解析で確かめてください。
</div>
</details>
