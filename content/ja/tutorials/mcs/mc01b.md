
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

- `THERMALIZATION` 期間を大幅に短くしてみてください（たとえば 100 スイープ）。時系列に初期の過渡的な振る舞いが見えますか。`checkSteadyState` はそれを検出しますか。
- 臨界温度から離れると、必要な熱化の長さはどう変わるでしょうか。$T=1.5$ と $T=3.5$ を試してください。
- `SWEEPS` を 10 倍に増やし、また 10 分の 1 に減らしてみてください。磁化の誤差棒はどう変わりますか。これは期待される $1/\sqrt{N}$ のスケーリングと一致しますか。
- 平衡化と収束の両方を確認することがなぜ重要なのでしょうか。一方のチェックに合格し、もう一方に不合格となることはありうるでしょうか。
