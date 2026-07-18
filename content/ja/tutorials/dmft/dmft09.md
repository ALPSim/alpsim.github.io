
---
title: DMFT-09 Néel Transition
math: true
toc: true
---

## 単一格子 DMFT におけるネール転移

この例では、[Georges らによる DMFT のレビュー論文](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)の図11を再現します。この6本の曲線は、相互作用 $U=3D/\sqrt{2}$ を持つベーテ格子上の半充填 Hubbard 模型が、冷却に伴って反強磁性相へと転移していく様子を示しています。

このチュートリアルは [DMFT-02 Hybridization](../dmft02)、[DMFT-03 Interaction](../dmft03)、[DMFT-07 Hirsch-Fye](../dmft07) を統合したものです。同じ物理的な点を、アルゴリズム的に独立な3種類の不純物ソルバーで解き、その結果を1つのプロット上で直接比較します。

### 模型

チュートリアル02・03・07と同様に、単バンド Hubbard 模型

$$
\hat{H} = -t\sum_{\langle i,j\rangle,\sigma} \left(\hat{c}^\dagger_{i\sigma}\hat{c}_{j\sigma} + \text{h.c.}\right) + U\sum_i \hat{n}_{i\uparrow}\hat{n}_{i\downarrow} - \mu\sum_{i,\sigma}\hat{n}_{i\sigma}
$$

をベーテ格子上、半充填（$\mu=0$）で解きます。$t=0.707106781186547=1/\sqrt{2}$（半バンド幅 $D=2t=\sqrt{2}$）、$U=3$ とすることで、[Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) と同様に $U=3D/\sqrt{2}$ となります。`ANTIFERROMAGNET=1` によりネール自己無撞着が可能になっているため、この点を様々な $\beta$ にわたって冷却することで、どの不純物ソルバーを使っても同じ図11の金属-反強磁性絶縁体クロスオーバーが再現されます。

### パラメータ

各ソルバーの完全な注釈付きパラメータファイルは、対応するチュートリアルに記載されています。ここでは、共通点 $\beta=12$ において、ソルバーごとに異なる設定のみを再掲します。

| パラメータ | 意味 | CT-HYB（[DMFT-02](../dmft02)） | CT-INT（[DMFT-03](../dmft03)） | Hirsch-Fye（[DMFT-07](../dmft07)） |
| :-------- | :------ | :----------------------------- | :----------------------------- | :---------------------------------- |
| `SOLVER` | 不純物ソルバー | `"hybridization"` | `"Interaction Expansion"` | `"hirschfye"` |
| `N` | 虚時間離散化数 | $250$ | $500$ | $16$（意図的に小さい。[DMFT-07](../dmft07#手法の選択) 参照） |
| ソルバー固有 | 追加パラメータ | `N_MEAS`、`N_ORDER`、`SC_WRITE_DELTA` | `ALPHA`、`HISTOGRAM_MEASUREMENT` | `TOLERANCE` |
| 共通 | `U`、`t`、`BETA`、`MU`、`H`、`FLAVORS`、`ANTIFERROMAGNET`、`SYMMETRIZATION`、`NMATSUBARA`、`OMEGA_LOOP`、`SITES`、`SEED` | 3つのソルバーすべてで共通（上の「模型」を参照） | | |

### シミュレーションの実行

各ソルバーの短縮版スクリプトは、それぞれ自分のチュートリアルディレクトリに `parm_beta_6.0` と `parm_beta_12.0` を書き出し、実行します。

```
cd tutorials/dmft-02-hybridization && python tutorial2.py    # CT-HYB
cd tutorials/dmft-03-interaction   && python tutorial3.py    # CT-INT
cd tutorials/dmft-07-hirschfye     && python tutorial7.py    # Hirsch-Fye
```

あるいは、パラメータファイルが生成された後であれば、コマンドラインで直接次のように実行することもできます。

```
/path-to-alps-installation/bin/dmft tutorials/dmft-02-hybridization/parm_beta_12.0
/path-to-alps-installation/bin/dmft tutorials/dmft-03-interaction/parm_beta_12.0
/path-to-alps-installation/bin/dmft tutorials/dmft-07-hirschfye/parm_beta_12.0
```

完全なスクリプトと注釈付きパラメータファイルについては、[DMFT-02](../dmft02#シミュレーションの実行)、[DMFT-03](../dmft03#シミュレーションの実行)、[DMFT-07](../dmft07#シミュレーションの実行) を参照してください。

### 格子

3つのソルバーはすべて、このシリーズ全体で使われている、無限配位数 $z\to\infty$ の極限のベーテ格子上で実行されます。ホッピングは $t=t^*/\sqrt{z}$ とスケールされ、半円形状態密度（半バンド幅 $D=2t$）が自己無撞着ループで解析的に評価されます。

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

異なる格子で同じ比較を行う方法については、[DMFT-08 格子](../dmft08) を参照してください。

### 手法の選択

CT-HYB、CT-INT、Hirsch-Fye は、互いに無関係な近似の上に構築されています。CT-HYB はハイブリダイゼーションを展開し、強結合で最も効率が良く、CT-INT は相互作用を展開し、弱〜中程度の結合で最も効率が良く、Hirsch-Fye は虚時間を $N$ 個のスライスに離散化し、外挿によって取り除く必要のある系統的な $(\Delta\tau)^2$ バイアスを持ちます（それぞれの詳細については [DMFT-02](../dmft02)、そして [DMFT-03](../dmft03#手法の選択) と [DMFT-07](../dmft07#手法の選択) の「手法の選択」の節を参照してください）。$U=3D/\sqrt{2}$ では、これら3つのアルゴリズムのいずれにとっても明らかに有利あるいは不利な領域で動作しているわけではないため、この点は互いを相互チェックするのに良い場所になります。3つのソルバーは共通の系統誤差を持たないため、収束した3つの結果すべてに現れる特徴──特に、冷却に伴う $G(\tau)$ の反強磁性的な分裂──は、特定のモンテカルロアルゴリズムの産物ではなく、物理模型と DMFT の自己無撞着性そのものの性質であるはずです。

### 出力データとプロット

（チュートリアル02・03・07のように）各ソルバーの結果を別々にプロットするのではなく、このチュートリアルの主眼は、3つすべてを同じ図の上に重ねて表示することにあります。

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot

listobs = ['0']  # flavor 0

files = {
    'CT-HYB'     : 'tutorials/dmft-02-hybridization/parm_beta_12.0.h5',
    'CT-INT'     : 'tutorials/dmft-03-interaction/parm_beta_12.0.h5',
    'Hirsch-Fye' : 'tutorials/dmft-07-hirschfye/parm_beta_12.0.h5',
}

alldata = []
for solver, fname in files.items():
    data = pyalps.loadMeasurements([fname], respath='/simulation/results/G_tau', what=listobs, verbose=False)
    for d in pyalps.flatten(data):
        d.x = d.x*d.props["BETA"]/float(d.props["N"])
        d.props['label'] = solver
        alldata.append(d)

plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor=0}(\tau)$')
plt.title('DMFT-09: Neel transition at BETA=12, solver comparison')
pyalps.plot.plot(alldata)
plt.legend()
plt.show()
```

これは3つの独立な確率的シミュレーションを比較するものであるため、実際に得られる数値はそれぞれの実行の `SEED`、`MAX_TIME`、計算機の速度に依存しますが、3本の曲線は、それぞれの誤差範囲内で一致するはずです──ただし、[DMFT-07](../dmft07#まとめと今後の課題) で提案されているように外挿しない限り、Hirsch-Fye の `N=16` による離散化バイアスは CT-HYB や CT-INT との比較で目に見える形で現れます。ソルバーを最初からではなく部分的に収束した解から再実行することもできます：目的の `G0omega_output` を新しいファイル名にコピーし、再実行する前にパラメータファイル（あるいは対応する python の辞書）で `G0OMEGA_INPUT` を指定してください。

### まとめと今後の課題

同じネール転移を CT-HYB、CT-INT、Hirsch-Fye で解き、3つすべてが一致することを確認することは、DMFT-02・DMFT-03・DMFT-07 がソルバー固有のアーティファクトではなく、同じ物理へと収束していることを直接確認する手段になります。

1. 上記の統合プロットを（`tutorial2_long.py`、`tutorial3_long.py`、`tutorial7_long.py` を用いて）$\beta$ の6つの値すべてに拡張し、各温度で3つのソルバーすべてを重ねた、図11との完全な比較を再現してみましょう。
2. 固定した実行時間のもとで、$\beta=12$ において3つのソルバーのうちどれが最も小さい誤差棒を与えるでしょうか。系がより常磁性側に近い $\beta=6$ では、その順位は変わるでしょうか。
3. Hirsch-Fye の結果を統合プロットに含める前に、$\Delta\tau\to0$ へ外挿してみましょう（[DMFT-07](../dmft07#まとめと今後の課題) 参照）。外挿した曲線は、CT-HYB や CT-INT に目に見えて近づくでしょうか。
4. [DMFT-06](../dmft06) では、常磁性金属相において、[Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) の図15にある厳密対角化／Hirsch-Fye のベンチマークと比較する、類似のソルバー間比較を行っています。この2つの比較を見比べてみましょう：ソルバー間の一致は、チュートリアル06の常磁性金属とここで扱った反強磁性相のどちらでより得やすいでしょうか。
