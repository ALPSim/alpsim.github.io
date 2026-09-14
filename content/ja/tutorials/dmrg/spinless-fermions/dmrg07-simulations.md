---
title: DMRG-07 シミュレーション
weight: 2
math: true
toc: true
---

このチュートリアルでは、[DMRG-07 入門](../dmrg07) で構築した道具立てを実際に使い、ALPS の `dmrg` アプリケーションで一次元スピンレスフェルミオン鎖の基底状態エネルギーを計算します。ワークフローはスピン鎖に対する [DMRG-03](../../dmrg03) と同じです。

## 興味の対象となる現象

最近接斥力を持つスピンレスフェルミオン鎖——*$t$–$V$ 模型*——は、存在しうる最も単純な相互作用フェルミオン模型です。それにもかかわらず、一次元金属の本質的な物理を含んでいます：弱結合では Luttinger 液体、すなわち準粒子を持たない臨界的な金属状態であり、強い斥力（半充填で $V > 2t$）ではギャップを持つ電荷秩序絶縁体への転移を起こします。[入門](../dmrg07) で導出した Jordan–Wigner 変換を通じて、この模型はまさに XXZ スピン鎖の姿を変えたものなので、ここで得られるすべての結果はスピン鎖のチュートリアルと照合できます。[DMRG-03](../../dmrg03) と同様に、最も基本的なオブザーバブルである基底状態エネルギー $E_0$ から始め、厳密な参照値が存在する相図上の二つの点で計算します：自由フェルミオン点 $V=0$ と、[DMRG-03](../../dmrg03) の等方的ハイゼンベルク鎖に対応する相互作用強度 $V=2t$ です。

## 模型

$L$ サイトの開放鎖上の $t$–$V$ ハミルトニアンを研究します。

$$
\hat H \;=\; -t\sum_{j=1}^{L-1}\Big(\hat c^{\dagger}_j \hat c_{j+1} + \hat c^{\dagger}_{j+1}\hat c_j\Big)
\;+\; V \sum_{j=1}^{L-1} \hat n_j\, \hat n_{j+1}
\;-\; \sum_{j=1}^{L} \mu_j\, \hat n_j ,
$$

ここで $t$ はホッピング振幅、$V$ は最近接斥力、$\mu_j$ は（サイトに依存しうる）化学ポテンシャルです。この模型は可積分です：[Jordan–Wigner 変換](https://doi.org/10.1007/BF01331938)を介して、[Yang と Yang](https://doi.org/10.1103/PhysRev.150.321) によって厳密に解かれた XXZ 鎖と等価であり、その臨界相は [Luttinger 液体](https://doi.org/10.1088/0022-3719/14/19/010)の標準的な格子上の実現です。

[入門](../dmrg07) の対応表を開放鎖にボンドごとに適用すると、次のようになります。

$$
t = \frac{J}{2}, \qquad V = J\Delta,
$$

$$
J\Delta\sum_{j}\Big(\hat n_j - \tfrac12\Big)\Big(\hat n_{j+1} - \tfrac12\Big)
= V\sum_{j} \hat n_j \hat n_{j+1} - \frac{V}{2}\sum_{j} z_j\, \hat n_j + \frac{V(L-1)}{4},
$$

ここで $z_j$ はサイト $j$ の配位数です（バルクで $z=2$、両端で $z=1$）。したがって XXZ 鎖は、サイト依存の化学ポテンシャル $\mu_j = \tfrac{V}{2} z_j$ を持つ $t$–$V$ 模型に、定数 $V(L-1)/4$ を除いて等しくなります——この帳簿上の細部は、以下で [DMRG-03](../../dmrg03) に対するベンチマークに利用します。

### ボソン基底でフェルミオンを走らせる

{{< callout type="info" >}}
開放鎖では、最近接項において Jordan–Wigner ストリングがすべて相殺するため、フェルミオンの $t$–$V$ 鎖、XXZ スピン鎖、そして**ハードコアボソン**の $t$–$V$ 鎖は、粒子数 $N$ のセクターごとに*同一の*エネルギースペクトルを持ちます。ALPS の模型ライブラリは、`spinless fermions` とまったく同じパラメータ（`t`、`V`、`mu#`）と同じ保存量子数 `N` を持つ `hardcore boson` を定義しています。シミュレーションは `MODEL="hardcore boson"` で実行します：古典的な `dmrg` アプリケーションは `MODEL="spinless fermions"` のフェルミオン符号の処理を確実には扱えず（掃引が変分的に収束しません）、Jordan–Wigner の等価性により、ボソン基底で計算しても一般性がまったく失われないことが保証されます。`sparsediag` のような厳密対角化アプリケーションは `MODEL="spinless fermions"` を直接扱えるため、小さな鎖でこの等価性を検証するのに使えます（末尾の問題を参照）。
{{< /callout >}}

## 手法の選択

半充填では、関係するヒルベルト空間のセクターの次元は

$$
\dim \mathcal{H}_{N=L/2} = \binom{L}{L/2} \;\xrightarrow{\;L=32\;}\; \binom{32}{16} \approx 6.0\times 10^{8},
$$

であり、完全対角化や疎行列対角化の手の届く範囲をはるかに超えています。一次元の基底状態に対しては DMRG が最適な手法です：以下の各実行（32 サイトの鎖、保持状態数最大 $D=100$、掃引 4 回）は、ラップトップ上で 1 分もかからずに完了し、$E_0$ を 10 桁以上の有効数字まで収束させます。

## 自由フェルミオン（$V=0$）

$V=0$ では、この模型は自由フェルミオンバンド $\varepsilon(k) = -2t\cos k$ です。*開放*鎖の場合、一粒子固有状態はエネルギー

$$
\varepsilon_n = -2t\,\cos\!\left(\frac{n\pi}{L+1}\right), \qquad n = 1,\dots,L ,
$$

を持つ定在波であり、充填数 $N$ での厳密な基底状態エネルギーは、最も低い $N$ 個の $\varepsilon_n$ の和になります。$L=32$、$N=16$（半充填）では：

$$
E_0^{\text{exact}} = \sum_{n=1}^{16} \varepsilon_n = -20.0163879005\, t .
$$

これは稀な贅沢を与えてくれます：厳密な有限サイズ参照値を持つ、相互作用コードのベンチマークです。

### パラメータ

| パラメータ | 意味 | 値 |
|---|---|---|
| `LATTICE` | 組み込みの開放鎖、格子ファイル不要（[ALPS 格子ライブラリ](../../../documentation/intro/latticehowtos)を参照） | `open chain lattice` |
| `MODEL` | ハードコアボソン $t$–$V$ 模型、スピンレスフェルミオン鎖の Jordan–Wigner 等価物 | `hardcore boson` |
| `CONSERVED_QUANTUMNUMBERS` | 固定する量子数、$H$ のブロック対角化に使用 | `N` |
| `N_total` | 目標とする粒子数セクター（半充填） | 16 |
| `t` | 最近接ホッピング振幅 | 1 |
| `V` | 最近接斥力 | 0 |
| `L` | 鎖の長さ | 32 |
| `SWEEPS` | DMRG 有限系掃引の回数 | 4 |
| `NUMBER_EIGENVALUES` | 要求する固有状態の数 | 1 |
| `MAXSTATES` | 切り詰め後に保持するボンド次元 $D$ | 100（単一実行）；20, 40, 60（複数回の実行） |

スピンのチュートリアルとの構造上の違いは一点だけです：保存量子数は粒子数 `N` のみであり、セクターは `Sz_total` ではなく `N_total` で選択します——これは[入門](../dmrg07)の対応表 $S^z_{\text{tot}} = N - L/2$ のフェルミオン側です。半充填 $N_{\text{total}} = 16$ は、[DMRG-03](../../dmrg03) で使用した $S^z_{\text{tot}}=0$ セクターに対応します。

### 格子

[ALPS 格子ライブラリ](../../../documentation/intro/latticehowtos)の組み込み `open chain lattice` だけで十分です：すべてのサイトは等価（$\mu_j = 0$）で、すべてのボンドは同じホッピング $t$ を持ちます：

```
      t       t       t                   t       t
  o-------o-------o-------o  . . .  o-------o-------o
  1       2       3       4         30      31      32

  every bond:  hopping t, interaction V=0
  every site:  chemical potential mu=0
```

開放境界条件は DMRG にとって自然な選択であり（[DMRG-01](../../dmrg01) を参照）、ここではさらに、Jordan–Wigner 写像が境界のパリティ因子なしで厳密になるという利点もあります（[入門](../dmrg07)の境界に関する注意を参照）。

### パラメータファイル

単一実行のパラメータファイル `spinless_free`：

```python
LATTICE="open chain lattice"
MODEL="hardcore boson"
CONSERVED_QUANTUMNUMBERS="N"
N_total=16
t=1
V=0
SWEEPS=4
NUMBER_EIGENVALUES=1
L=32
{MAXSTATES=100}
```

そして、保持状態数に対する収束を調べる複数回実行用ファイル `spinless_free_multiple`：

```python
LATTICE="open chain lattice"
MODEL="hardcore boson"
CONSERVED_QUANTUMNUMBERS="N"
N_total=16
t=1
V=0
SWEEPS=4
NUMBER_EIGENVALUES=1
L=32
{ MAXSTATES=20 }
{ MAXSTATES=40 }
{ MAXSTATES=60 }
```

### シミュレーションの実行

ALPS のバイナリを `PATH` に通した上で、パラメータファイルを XML に変換し、`dmrg` アプリケーションを実行します：

```bash
parameter2xml spinless_free
dmrg --write-xml spinless_free.in.xml

parameter2xml spinless_free_multiple
dmrg --write-xml spinless_free_multiple.in.xml
```

最初の一組のコマンドは `spinless_free.task1.out.xml` を生成し、二組目は `MAXSTATES` の値ごとに一つ、計三つの出力ファイル `spinless_free_multiple.task#.out.xml` を生成します。

## ハイゼンベルク点での相互作用フェルミオン（$V=2t$）

次に相互作用を入れ、$t=\tfrac12$、$V=1$、すなわち $J = 2t = 1$ かつ $\Delta = V/J = 1$ を選びます：フェルミオンの言葉で書いた [DMRG-03](../../dmrg03) の等方的ハイゼンベルク鎖です。この対応を漸近的なものではなく*厳密に*するには、上で導出したサイト依存の化学ポテンシャル $\mu_j = \tfrac{V}{2} z_j$ を含める必要があります：バルクのサイトでは $\mu = V$ ですが、隣接サイトを一つしか持たない両端のサイトでは $\mu = V/2$ です。予測される基底状態エネルギーは、[DMRG-03](../../dmrg03) で計算した $L=32$ のハイゼンベルクエネルギーを用いて

$$
E_0^{tV} \;=\; E_0^{\text{Heis}}(L=32) - \frac{V(L-1)}{4}
\;=\; -13.9973156 - \frac{31}{4} \;=\; -21.7473156 ,
$$

となります。

### パラメータ

| パラメータ | 意味 | 値 |
|---|---|---|
| `LATTICE_LIBRARY` | カスタム格子ファイル（下に示します） | `my_lattice.xml` |
| `LATTICE` | 両端の頂点が別のタイプを持つ開放鎖 | `open chain lattice with special edges` |
| `MODEL` | ハードコアボソン $t$–$V$ 模型、スピンレスフェルミオン鎖の Jordan–Wigner 等価物 | `hardcore boson` |
| `CONSERVED_QUANTUMNUMBERS` | 固定する量子数 | `N` |
| `N_total` | 目標とする粒子数セクター（半充填） | 16 |
| `t` | 最近接ホッピング振幅（$J/2$） | 0.5 |
| `V` | 最近接斥力（$J\Delta$） | 1 |
| `mu0` | 両端サイトの化学ポテンシャル（$z=1$ での $Vz/2$） | 0.5 |
| `mu1` | バルクサイトの化学ポテンシャル（$z=2$ での $Vz/2$） | 1 |
| `SWEEPS` | DMRG 有限系掃引の回数 | 4 |
| `NUMBER_EIGENVALUES` | 要求する固有状態の数 | 1 |
| `MAXSTATES` | 切り詰め後に保持するボンド次元 $D$ | 100（単一実行）；20, 40, 60（複数回の実行） |

### 格子

組み込みの開放鎖ではすべての頂点が同じタイプ、したがって同じ化学ポテンシャルを持ちます。両端のサイトに独自の $\mu$ を与えるために、[DMRG-03](../../dmrg03) のスピン-1 鎖の技巧を再利用します：端の頂点をタイプ 0、バルクの頂点をタイプ 1 とするカスタム格子です。ALPS の模型ライブラリは、タイプごとのパラメータ `mu0` と `mu1` を公開します：

```
   t,V     t,V     t,V                 t,V     t,V
  o-------o-------o------  . . .  ------o-------o
  1       2       3                     31      32

  site 1, 32   (type 0):  mu0 = V/2   (z = 1, one neighbor)
  sites 2..31  (type 1):  mu1 = V     (z = 2, two neighbors)
  every bond   (type 0):  hopping t, interaction V
```

サイトグラフの論理は [DMRG-03](../../dmrg03) と同じで、異なるのはその*理由*だけです：あちらでは特別な端が異なるスピンを担っていたのに対し、こちらでは異なる化学ポテンシャルを担っています。完全な格子ファイル `my_lattice.xml`（省略版——省略した頂点と辺のパターンは自明です）：

```python
<LATTICES>
<GRAPH name = "open chain lattice with special edges" dimension="1" vertices="32" edges="31">
<VERTEX id="1" type="0"><COORDINATE>1</COORDINATE></VERTEX>
<VERTEX id="2" type="1"><COORDINATE>2</COORDINATE></VERTEX>
<VERTEX id="3" type="1"><COORDINATE>3</COORDINATE></VERTEX>
<!-- ... vertices 4 to 30, all type="1" ... -->
<VERTEX id="31" type="1"><COORDINATE>31</COORDINATE></VERTEX>
<VERTEX id="32" type="0"><COORDINATE>32</COORDINATE></VERTEX>
<EDGE source="1" target="2" id="1" type="0" vector="1"/>
<EDGE source="2" target="3" id="2" type="0" vector="1"/>
<!-- ... edges 3 to 30 ... -->
<EDGE source="31" target="32" id="31" type="0" vector="1"/>
</GRAPH>
</LATTICES>
```

任意の $L$ に対して、数行の Python で生成できます：

```python
L = 32
print('<LATTICES>')
print(f'<GRAPH name = "open chain lattice with special edges" dimension="1" vertices="{L}" edges="{L-1}">')
for i in range(1, L+1):
    vtype = 0 if i in (1, L) else 1
    print(f'<VERTEX id="{i}" type="{vtype}"><COORDINATE>{i}</COORDINATE></VERTEX>')
for i in range(1, L):
    print(f'<EDGE source="{i}" target="{i+1}" id="{i}" type="0" vector="1"/>')
print('</GRAPH>')
print('</LATTICES>')
```

### パラメータファイル

単一実行のパラメータファイル `spinless_tV`：

```python
LATTICE_LIBRARY="my_lattice.xml"
LATTICE="open chain lattice with special edges"
MODEL="hardcore boson"
CONSERVED_QUANTUMNUMBERS="N"
N_total=16
t=0.5
V=1
mu0=0.5
mu1=1
SWEEPS=4
NUMBER_EIGENVALUES=1
{MAXSTATES=100}
```

そして複数回実行用ファイル `spinless_tV_multiple`：

```python
LATTICE_LIBRARY="my_lattice.xml"
LATTICE="open chain lattice with special edges"
MODEL="hardcore boson"
CONSERVED_QUANTUMNUMBERS="N"
N_total=16
t=0.5
V=1
mu0=0.5
mu1=1
SWEEPS=4
NUMBER_EIGENVALUES=1
{ MAXSTATES=20 }
{ MAXSTATES=40 }
{ MAXSTATES=60 }
```

### シミュレーションの実行

```bash
parameter2xml spinless_tV
dmrg --write-xml spinless_tV.in.xml

parameter2xml spinless_tV_multiple
dmrg --write-xml spinless_tV_multiple.in.xml
```

## 結果の評価

次の Python スクリプト（`alpspython` で実行します）は、すべての実行の収束した固有状態測定値と二つの単一実行の反復履歴を読み込み、エネルギーと切り詰め誤差を出力して、収束の様子をプロットします：

```python
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot

# converged measurements of all runs
for prefix in ['spinless_free', 'spinless_free_multiple',
               'spinless_tV', 'spinless_tV_multiple']:
    data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=prefix))
    for run in data:
        print(prefix, '| MAXSTATES =', run[0].props['MAXSTATES'])
        for s in run:
            print('   ', s.props['observable'], ':', s.y[0])

# iteration history of the two single runs
iter = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='spinless_free'),
                          what=['Iteration Energy','Iteration Truncation Error'])

plt.figure()
pyalps.plot.plot(iter[0][0])
plt.title('Iteration history of ground state energy (V=0)')
plt.ylabel('$E_0$')
plt.xlabel('iteration')
plt.show()
```

### 自由フェルミオン

| `MAXSTATES` $D$ | 切り詰め誤差 $\epsilon$ | $E_0/t$ | $E_0 - E_0^{\text{exact}}$ |
|---|---|---|---|
| 20 | $5.2\times10^{-7}$ | $-20.0163691706$ | $1.9\times10^{-5}$ |
| 40 | $1.7\times10^{-9}$ | $-20.0163878550$ | $4.6\times10^{-8}$ |
| 60 | $1.3\times10^{-11}$ | $-20.0163879001$ | $4.1\times10^{-10}$ |
| 100 | $3.2\times10^{-14}$ | $-20.0163879005$ | $1.4\times10^{-12}$ |

$D=100$ での DMRG エネルギー $E_0 = -20.0163879005\,t$ は、厳密な自由フェルミオンの値 $-20.0163879005\,t$ を 12 桁まで再現します——模型が自由であることを知らずに走っている相互作用コードとしては見事な結果です。反復履歴は [DMRG-03](../../dmrg03) でおなじみのパターンを示します：エネルギーは無限系ウォームアップの間に急降下し、最初の掃引のうちに収束値に落ち着きます：

![](/figs/dmrg/dmrg07_free_energy_iteration.png)

### $V=2t$ での相互作用フェルミオン

| `MAXSTATES` $D$ | 切り詰め誤差 $\epsilon$ | $E_0$ | $E_0(D) - E_0(D{=}100)$ |
|---|---|---|---|
| 20 | $1.6\times10^{-7}$ | $-21.7473088794$ | $6.7\times10^{-6}$ |
| 40 | $5.7\times10^{-10}$ | $-21.7473155951$ | $2.3\times10^{-8}$ |
| 60 | $1.3\times10^{-11}$ | $-21.7473156177$ | $4.9\times10^{-10}$ |
| 100 | $4.4\times10^{-14}$ | $-21.7473156182$ | — |

$D=100$ の結果 $E_0 = -21.7473156$ は、Jordan–Wigner の予測値 $E_0^{\text{Heis}} - V(L-1)/4 = -21.7473156$ と、[DMRG-03](../../dmrg03) の参照エネルギーのすべての桁で一致します——[入門](../dmrg07)で導出した演算子の対応表の直接的な数値検証です：

![](/figs/dmrg/dmrg07_tV_energy_iteration.png)

どちらの場合も、エネルギー誤差はよい近似で*切り詰め誤差に比例*します——これは $D\to\infty$ への外挿に使われる標準的な経験則であり、複数回の実行によって定量的に確認できます：

![](/figs/dmrg/dmrg07_energy_vs_truncation.png)

## まとめ

粒子数を保存する基底での DMRG は、$L=32$ の半充填スピンレスフェルミオン鎖の基底状態エネルギーを、$D=100$ 状態で実質的に機械精度まで収束させます：自由な点では厳密な定在波エネルギー $-20.0163879005\,t$ を 12 桁まで再現し、相互作用点 $V=2t$ では Jordan–Wigner シフト $-V(L-1)/4$ を通じて [DMRG-03](../../dmrg03) のハイゼンベルクエネルギーを報告されたすべての桁で再現します。そして、どちらの場合もエネルギー誤差は切り詰め誤差に対して線形にスケールします。

## 問題

1. $E_0(D)$ を切り詰め誤差 $\epsilon(D)$ に対してフィットし、$\epsilon \to 0$ へ外挿してみてください。外挿した自由フェルミオンのエネルギーは、生の $D=20$ の結果と比べて、厳密値にどれだけ近づきますか？
2. `N_total=8`（四分の一充填）と設定して半充填から離れてみてください。自由フェルミオンのベンチマーク $E_0 = \sum_{n=1}^{8}\varepsilon_n$ は依然として厳密です——$D$ に関する DMRG の収束は易しくなりますか、難しくなりますか？それはなぜでしょうか？
3. 臨界点をまたいで相互作用を走査してみてください：$t=\tfrac12$ を固定し、$V = 0.5, 1, 1.5, 2, 3$ で $E_0(V)$ を計算します。$V=2t$（$\Delta>1$）を超えると半充填の鎖には電荷秩序が現れます——収束の振る舞いや局所密度からこの転移を検出できますか？
4. 小さな鎖で Jordan–Wigner の等価性を端から端まで検証してみてください：$L=8$、$N_{\text{total}}=4$ で `MODEL="spinless fermions"` と `MODEL="hardcore boson"` の両方で `sparsediag` を実行し、スペクトルがセクターごとに一致することを確認します。
5. 特別な端の化学ポテンシャル*なし*で $V=2t$ の実行を繰り返してみてください（組み込みの `open chain lattice`、一様な `mu=1`）。結果はもはやハイゼンベルクの予測と一致しません——$V(\hat n_j-\tfrac12)(\hat n_{j+1}-\tfrac12)$ のボンドごとの帳簿計算のうち、どの項がこの違いの原因でしょうか？
