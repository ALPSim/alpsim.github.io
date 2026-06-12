---
title: CT-HYB 不純物ソルバー
linkTitle: CT-HYB
description: "CT-HYB 量子不純物ソルバーを用いた磁性不純物の近藤スクリーニングシミュレーション。"
weight: 3
math: true
---

{{< callout type="info" >}}
このチュートリアルは pyalps がすでにインストールされていることを前提としています。まだセットアップしていない場合は、[入門ガイド](../)を参照してください。
{{< /callout >}}

このチュートリアルでは、**連続時間ハイブリダイゼーション展開（CT-HYB）**量子モンテカルロソルバーを紹介します。これは量子不純物モデルに対する厳密かつ数値的に無偏な手法で、Werner らによって最初に提案されました（[Phys. Rev. Lett. 97, 076405, 2006](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.97.076405)）。ここでは**近藤効果**をシミュレーションします。温度が低下するにつれて、伝導電子が磁性不純物をスクリーニングし、有効局在モーメントが減少していきます。無次元有効モーメントは $4T\chi_{dd}$（$\chi_{dd}$ は局所スピン感受率）で表されます。高温では自由スピン（$S = 1/2$）に対応して 1 に近づき、クーロン相互作用 $U > 0$ がある場合は低温で零に向かって減少し、完全な近藤スクリーニングを示します。ハイブリダイゼーション関数としては半楕円状態密度を使用します。これは Bethe 格子に対応する標準的な選択肢で、動的平均場理論（DMFT）計算でよく用いられます。

## インポート

```python
from pyalps.hdf5 import archive       # HDF5 アーカイブインターフェース
import pyalps.cthyb as cthyb          # CT-HYB 不純物ソルバー
import matplotlib.pyplot as plt       # プロット用
from numpy import exp, log, sqrt, pi  # 数学ユーティリティ
```

## 温度グリッド

高温の自由スピン領域と低温の近藤スクリーニング領域の両方をカバーするため、$T_{\min} = 0.05$ から $T_{\max} = 100.0$ まで、対数スケールで等間隔に並んだ 11 個の温度点（両端点を含む）を生成します：

```python
N_T  = 11     # 温度点数（両端点を含む）
Tmin = 0.05   # 最低温度
Tmax = 100.0  # 最高温度
Tdiv = exp(log(Tmax/Tmin)/(N_T - 1))
T = Tmax
Tvalues = []
for i in range(N_T):
    Tvalues.append(T)
    T /= Tdiv
```

## シミュレーションパラメータ

$U = 0$（非相互作用の参照系）と $U = 2$（相互作用あり、近藤領域）の 2 つのクーロン相互作用値を比較します。主なパラメータの説明：

- **`N_TAU`**：虚時間グリッド点数 $\tau \in [0, \beta]$。最低温度を分解するのに十分な大きさが必要です。目安として $N_\tau \geq 5\beta U$ を満たすことが推奨されます。
- **`runtime`**：各ソルバー呼び出しに割り当てる実時間（秒）。本番計算では統計精度を上げるために増やしてください。

```python
Uvalues = [0., 2.]  # オンサイトクーロン相互作用の値
N_TAU   = 1000      # 虚時間点数；最低温度で少なくとも 5*BETA*U を確保
runtime = 5         # 各温度点のソルバー実行時間（秒）
```

## パラメータリストの構築

$U$ と $T$ の各組み合わせに対してパラメータ辞書を構築します：

- **`SWEEPS`**：モンテカルロ移動回数の上限。実際には `MAX_TIME` に先に達してソルバーが停止します。
- **`THERMALIZATION`**：測定開始前に破棄する平衡化移動の回数。
- **`N_MEAS`**：`N_MEAS` 回のスイープごとに 1 回測定を記録します。
- **`N_ORBITALS`**：スピン軌道フレーバー数——ここではスピンアップとスピンダウンの 2 つ。
- **`MU`**：化学ポテンシャル。半充填で粒子-正孔対称性を保つため $U/2$ に設定します。
- **`BETA`**：逆温度 $\beta = 1/T$。

```python
values     = [[] for u in Uvalues]
errors     = [[] for u in Uvalues]
parameters = []
for un, u in enumerate(Uvalues):
    for t in Tvalues:
        parameters.append(
         {
           # ソルバーパラメータ
           'SWEEPS'             : 1000000000,                          # 総モンテカルロ移動回数（MAX_TIME で制限）
           'THERMALIZATION'     : 1000,                                # 平衡化移動回数（破棄）
           'SEED'               : 42,                                  # 乱数シード
           'N_MEAS'             : 10,                                  # 測定間隔スイープ数
           'N_ORBITALS'         : 2,                                   # スピン軌道フレーバー数（アップ・ダウン）
           'BASENAME'           : "hyb.param_U%.1f_BETA%.3f"%(u,1/t), # HDF5 出力ファイルのベース名
           'MAX_TIME'           : runtime,                             # ソルバー呼び出しごとの実時間制限（秒）
           'VERBOSE'            : 1,                                   # ソルバーの進捗を表示
           'TEXT_OUTPUT'        : 0,                                   # 人間可読テキスト出力を無効化
           # ファイル名
           'DELTA'              : "Delta_BETA%.3f.h5"%(1/t),           # ハイブリダイゼーション関数入力ファイル
           'DELTA_IN_HDF5'      : 1,                                   # HDF5 からハイブリダイゼーションを読み込み
           # 物理パラメータ
           'U'                  : u,                                   # オンサイトクーロン斥力
           'MU'                 : u/2.,                                # 化学ポテンシャル（半充填）
           'BETA'               : 1/t,                                 # 逆温度
           # 測定
           'MEASURE_nnw'        : 1,                                   # 松原周波数での密度-密度相関関数
           'MEASURE_time'       : 0,                                   # 虚時間測定を無効化
           # 離散化
           'N_HISTOGRAM_ORDERS' : 50,                                  # 摂動次数ヒストグラムの最大次数
           'N_TAU'              : N_TAU,                               # 虚時間点数（tau_0=0, tau_{N_TAU}=beta）
           'N_MATSUBARA'        : int(N_TAU/(2*pi)),                   # 松原周波数点数
           'N_W'                : 1,                                   # 局所感受率のボゾン松原周波数点数
           # 管理用
           't'                  : 1,                                   # ホッピング振幅（エネルギースケールを設定）
           'Un'                 : un,                                  # Uvalues のインデックス（後処理用）
         }
        )
```

## ハイブリダイゼーション関数

CT-HYB ソルバーは入力としてハイブリダイゼーション関数 $\Delta(\tau)$ を必要とします。これは伝導電子浴との結合を符号化します。半帯域幅 $D = 2t$ の半楕円状態密度を用い、非相互作用グリーン関数のフーリエ変換によって $\Delta(\tau) = t^2 G_0(\tau)$ を計算します。数値安定性のため、変換前に高周波テールを差し引き、その後解析的に加え戻します。

```python
for parms in parameters:
    ar = archive(parms['BASENAME']+'.out.h5', 'a')
    ar['/parameters'] = parms
    del ar
    print("ハイブリダイゼーション関数を生成中...")
    g  = []
    I  = complex(0., 1.)
    mu = 0.0
    for n in range(parms['N_MATSUBARA']):
        w = (2*n+1)*pi/parms['BETA']
        g.append(2.0/(I*w + mu + I*sqrt(4*parms['t']**2 - (I*w+mu)**2)))  # 半楕円状態密度のグリーン関数
    delta = []
    for i in range(parms['N_TAU']+1):
        tau   = i*parms['BETA']/parms['N_TAU']
        g0tau = 0.0
        for n in range(parms['N_MATSUBARA']):
            iw     = complex(0.0, (2*n+1)*pi/parms['BETA'])
            g0tau += ((g[n] - 1.0/iw)*exp(-iw*tau)).real  # テールを差し引いたフーリエ変換
        g0tau *= 2.0/parms['BETA']
        g0tau += -1.0/2.0                                  # テール寄与を加え戻す
        delta.append(parms['t']**2 * g0tau)                # Delta(tau) = t^2 * G0(tau)

    ar = archive(parms['DELTA'], 'w')
    for m in range(parms['N_ORBITALS']):
        ar['/Delta_%i'%m] = delta
    del ar
```

## ソルバーの実行

```python
for parms in parameters:
    cthyb.solve(parms)
```

## 後処理とプロット

ゼロボゾン松原周波数における密度-密度相関関数 $\langle n_\uparrow n_\uparrow \rangle$、$\langle n_\downarrow n_\downarrow \rangle$、$\langle n_\uparrow n_\downarrow \rangle$ を取り出し、局所スピン感受率 $\chi_{dd} = (\langle n_\uparrow n_\uparrow \rangle + \langle n_\downarrow n_\downarrow \rangle - 2\langle n_\uparrow n_\downarrow \rangle)/4$ を計算します。

```python
for parms in parameters:
    ar      = archive(parms['BASENAME']+'.out.h5', 'a')
    nn_0_0  = ar['simulation/results/nnw_re_0_0/mean/value']
    nn_1_1  = ar['simulation/results/nnw_re_1_1/mean/value']
    nn_1_0  = ar['simulation/results/nnw_re_1_0/mean/value']
    dnn_0_0 = ar['simulation/results/nnw_re_0_0/mean/error']
    dnn_1_1 = ar['simulation/results/nnw_re_1_1/mean/error']
    dnn_1_0 = ar['simulation/results/nnw_re_1_0/mean/error']

    nn  = nn_0_0 + nn_1_1 - 2*nn_1_0
    dnn = sqrt(dnn_0_0**2 + dnn_1_1**2 + (2*dnn_1_0)**2)

    ar['chi']  = nn/4.
    ar['dchi'] = dnn/4.
    del ar

    T = 1/parms['BETA']
    values[parms['Un']].append(T*nn[0])
    errors[parms['Un']].append(T*dnn[0])

plt.figure()
plt.xlabel(r'$T$')
plt.ylabel(r'$4T\chi_{dd}$')
plt.title('Kondo screening of a magnetic impurity\n(CT-HYB hybridization-expansion solver)')
for un in range(len(Uvalues)):
    plt.errorbar(Tvalues, values[un], yerr=errors[un], label="U=%.1f"%Uvalues[un])
plt.xscale('log')
plt.legend()
plt.show()
```

プロットは $4T\chi_{dd}$ の温度（対数スケール）依存性を示しています。$U = 0$ では有効モーメントはほぼ一定（非相互作用極限）です。$U = 2$ では低温で有効モーメントが零に向かって減少し、伝導電子による不純物スピンの近藤スクリーニングが確認できます。

![近藤スクリーニングを示す有効局在モーメントの温度依存性](/figs/Kondo.png)

## チュートリアルビデオ

<br>
{{< youtube id="uAMQTJmvvts" >}}
