---
title: 量子ビットのエネルギースペクトル
description: "量子ビットエネルギー用の Jupyter md ファイル"
toc: true
math: true
weight: 61
cascade:
    type: docs
---

このチュートリアルでは、量子ビットを配置するための任意の格子構成を設定し、量子ビット間にさまざまな相互作用を割り当てて量子ビット操作をシミュレートする方法を探ります。エネルギースペクトルに関する結果は、量子計算理論・実験における初期量子ビット構成のベンチマークとなり得ます。

## 混合4サイト量子ビット

### 概要

まず、格子構成ファイル `lattices.xml` 内の4サイト混合グラフを使用します:
```
<GRAPH name="4-site mixed" vertices="4"> 
  <VERTEX id="1" type="0"/>
  <VERTEX id="2" type="1"/>
  <VERTEX id="3" type="0"/>
  <VERTEX id="4" type="1"/>
  <EDGE type="0" source="1" target="2"/>
  <EDGE type="0" source="2" target="3"/>
  <EDGE type="0" source="3" target="4"/>
  <EDGE type="0" source="4" target="1"/>
  <EDGE type="1" source="1" target="3"/>
  <EDGE type="1" source="2" target="4"/>
</GRAPH> 
```

この格子構成は次の図に示されています:
![mixed-4-site configuration](/figs/qbits/mixed4sitesconfig.png)

同じグラフに、各ボンドにハミルトニアンの結合定数を、各サイトに横磁場 $\Gamma$ を表示したもの:

```
Γ   1 ---J1--- 2   Γ
    |  \     / |
    J1  J2 J2  J1
    |  /     \ |
Γ   4 ---J1--- 3   Γ
```

この格子構成には2種類の頂点があり、サイト1と3は "0"、サイト2と4は "1" とラベル付けされています。各量子ビットサイトには強さ Gamma の横磁場が働きます。また2種類のボンドがあり、サイト (1,2)、(2,3)、(3,4)、(4,1) 間のボンドは "0"、サイト (1,3) と (2,4) 間のボンドは "1" とラベル付けされています。ボンドタイプ "0" には相互作用 J1 を、ボンドタイプ "1" には J2 を割り当てます。これらはすべてモデル構成ファイル `models.xml` の中で行われます:
```
<HAMILTONIAN name="qbit operation">
  <PARAMETER name="J1" default="1"/>
  <PARAMETER name="J2" default="0.5"/>
  <BASIS ref="spin"/>
  <SITETERM site="i">
    -Gamma*Sx(i)
  </SITETERM>
  <BONDTERM source="1" target="2">
    J1*Sz(1)*Sz(2)
  </BONDTERM>
  <BONDTERM source="2" target="3">
    J1*Sz(2)*Sz(3)
  </BONDTERM>
  <BONDTERM source="3" target="4">
    J1*Sz(3)*Sz(4)
  </BONDTERM>
  <BONDTERM source="4" target="1">
    J1*Sz(4)*Sz(1)
  </BONDTERM>
  <BONDTERM source="1" target="3">
    J2*Sz(1)*Sz(3)
  </BONDTERM>
  <BONDTERM source="2" target="4">
    J2*Sz(2)*Sz(4)
  </BONDTERM>
</HAMILTONIAN>
```
以上の設定により、4サイト量子ビットのハミルトニアンは次式で与えられます
$$
H=J_{1} \sum_{type 0} S^i_z S^j_z + J_{2} \sum_{type 1} S^i_z S^j_z - \Gamma \sum_i S^i_x.
$$

これは(特定の既発表の量子ビットデバイスに紐づくものではない)小規模で教育的なモデルであり、ALPS において内蔵の格子・モデルを使うのではなく、カスタムの格子グラフとハミルトニアンをゼロから定義する方法を示すために用いられています。

### パラメータ

| パラメータ | 意味 | 値 |
|---|---|---|
| `GRAPH` | カスタム格子グラフ(上で定義) | `4-site mixed` |
| `MODEL` | カスタムハミルトニアン(上で定義) | `qbit operation` |
| `local_S` | サイトごとのスピン量子数 | `0.5` |
| `Gamma` | 横磁場の強さ $\Gamma$ | `0.5` |
| `J1` | タイプ "0" ボンド結合(正方形の辺) | `1`(モデルのデフォルト値) |
| `J2` | タイプ "1" ボンド結合(対角の辺) | `0.0` から `1.6` まで、刻み幅 `0.2` |
| `NUMBER_EIGENVALUES` | 保持する低励起固有状態の数 | `5` |

### 手法の選択

サイト数がわずか4であるため、ヒルベルト空間は $2^4=16$ 次元であり、どのような対角化手法でも瞬時に計算できます。ここで `sparsediag` のランチョス法を用いるのは、他の厳密対角化チュートリアルとの一貫性を保つため、そしてより大きな系にも拡張できるカスタム格子・カスタムモデルのワークフローを示すためです。

### シミュレーション

まずいくつかのモジュールをインポートします:


```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
```

次に、系のパラメータを設定し、2番目の結合定数 J2 についてループを行います。


```python
parms = []
# 2番目の結合定数についてループする
for J2 in [0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6]:
    parms.append({
        'GRAPH'      : "4-site mixed",
        'MODEL'      : "qbit operation",
        'local_S'    : 0.5,
        'Gamma'      : 0.5,
        'J2'         : J2,
        'NUMBER_EIGENVALUES' : 5
    })
```

続いて入力ファイルを設定し、シミュレーションを実行します。


```python
prefix = 'qbitenergy'
input_file = pyalps.writeInputFiles(prefix,parms)
res = pyalps.runApplication('sparsediag', input_file)
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=prefix))
```

次に、パラメータ J2 について反復処理を行い、各 J2 に対する最低エネルギー準位をプロットします。


```python
x = []
E0 = []
for Lsets in data:
    J2 = pyalps.flatten(Lsets)[0].props['J2']
    x.append(J2)
    lowestE = pyalps.flatten(Lsets)[0].y[0]
    E0.append(lowestE)
    
# 散布図のラベルを設定する
lbl="J1=1.0, Gamma=0.5"
plt.scatter(x,E0, label=lbl)
plt.legend()
plt.xlabel("J2")
plt.ylabel("E")
plt.title("4-site Mixed Graph")
plt.show()

```

さまざまな結合定数 J2 に対する最低エネルギーのエネルギースペクトルの結果を次の図に示します:
![Lowest energies vs. J2](/figs/qbits/sites4mixed.png)

### 結果

上記のコードを $J_1=1$、$\Gamma=0.5$ で実行して得られた、$J_2$ の関数としての基底状態エネルギー $E_0$:

| $J_2$ | $E_0$ |
|---|---|
| 0.0 | -1.00000 |
| 0.2 | -1.01245 |
| 0.4 | -1.04246 |
| 0.6 | -1.08341 |
| 0.8 | -1.13192 |
| 1.0 | -1.18614 |
| 1.2 | -1.24496 |
| 1.4 | -1.30764 |
| 1.6 | -1.37365 |

$J_2=0$ のとき(正方形の辺のボンドのみが有効)、$E_0=-1$ が厳密に成り立ち、これは弱い横磁場を持つ孤立4サイトリングと一致します。$J_2$ が大きくなるにつれて、対角ボンドがさらなる反強磁性フラストレーションを加え、基底状態エネルギーは単調に減少します。

### まとめと展望

このカスタムな4サイト混合グラフのハミルトニアンを対角化すると、対角結合 $J_2$ を導入するにつれて基底状態エネルギーが滑らかかつ単調に減少し、このパラメータ範囲では準位交差の兆候は見られないことがわかります。

1. $J_2$ を増加させると、基底状態と第一励起状態の間のギャップはどうなるでしょうか——どこかで閉じるでしょうか?
2. この `lattices.xml`/`models.xml` の組を、同じ混合グラフの8サイト版をシミュレートするようにどのように拡張しますか?
3. $J_2 \to 0$ と $J_2 = J_1$ という2つの極限における基底状態エネルギーはそれぞれいくつですか。ボンド構造だけからそれを説明できますか?
