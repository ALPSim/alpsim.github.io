
---
title: DMRG-03 Ground State Energies
math: true
toc: true
---

このチュートリアルでは、[DMRG-01](../dmrg01) で紹介した `dmrg` コードと制御パラメータを、最も単純な目標である基底状態エネルギーに適用します。[DMRG-02](../dmrg02) で紹介した、長さ $L$、開放境界条件のスピン-1/2 およびスピン-1 反強磁性ハイゼンベルク鎖を考えます：

$$
H = J\sum_{i=1}^{L-1} \left[\frac{1}{2} (S^+_i S^-_{i+1} + S^-_i S^+_{i+1}) + S^z_i S^z_{i+1}\right] .
$$

## 基底状態エネルギー

模型ハミルトニアンを研究する際にまず問うのは、基底状態 $| \psi_0 \rangle$ とそのエネルギー $E_0$ は何かということです。長さ $L$ のハイゼンベルク鎖やそれに類する系では、熱力学極限における格子点あたり（または結合あたり）のエネルギーにより興味があるかもしれません。以下でこの両方を考えます。

### 固定長での基底状態エネルギー

長さ $L=32,64,96,128$ の鎖を考えます。スピン-1/2 とスピン-1 の両方について、状態数 $D=50,100,150,200,300$ での基底状態エネルギー計算を設定します。各長さについて、切り詰め誤差と基底状態エネルギーを $D$ の関数として表にまとめます。与えられた長さと状態数に対して結果が実際に収束していることを確認するために、掃引数を慎重に実験してください。

1. 各システムサイズとスピンの大きさについて、総エネルギーと切り詰め誤差の関係（総エネルギー対切り詰め誤差のプロット）によって、総エネルギーの精度と切り詰め誤差の関係を確立してみてください。

2. スピン-1/2 とスピン-1 において、システムサイズが大きくなるにつれて $D$ に関する収束がどのように悪化するかを観察し、長さの数倍のグローバルな因子を除いて、二つの場合の収束の振る舞いを比較してください。*ヒント：* 見るべきことは、グローバルな因子を除くと、スピン-1 鎖では大きなシステムサイズでの収束が長さにほとんど依存しないのに対し、スピン-1/2 鎖ではより強く依存するということです。これはスピン-1 鎖の物理が相関長の長さスケールのセグメントに支配されているのに対し、スピン-1/2 鎖では臨界性のために有限の長さスケールが存在しないためです。

3. 各鎖長の基底状態エネルギーを $D\rightarrow\infty$ の極限へ外挿してみてください。

#### 一次元 S=1/2 ハイゼンベルク鎖

##### 単一実行

最初の例は、32 サイト、開放境界条件、100 状態を保持するスピン-1/2 ハイゼンベルク鎖のシミュレーションを設定することです。

###### パラメータファイルを使う場合

パラメータファイル [`spin_one_half`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-01-dmrg/spin_one_half) は最も重要なパラメータを設定します：

```python
LATTICE="open chain lattice"
MODEL="spin" 
CONSERVED_QUANTUMNUMBERS="N,Sz" 
Sz_total=0
J=1
SWEEPS=4
NUMBER_EIGENVALUES=1
L=32 
{MAXSTATES=100}
```

次のコマンド列を使って、まず入力パラメータを XML に変換し、次に `dmrg` アプリケーションを実行できます：

```python
parameter2xml spin_one_half
dmrg --write-xml spin_one_half.in.xml
```

出力ファイル `spin_one_half.task1.out.xml` は計算されたすべての量を含み、標準のウェブブラウザで表示できます。

DMRG は四回の掃引を実行し（左から右への四回の半掃引と右から左への四回の半掃引）、宣言した MAXSTATES=100 に達するまで MAXSTATES/(2\*SWEEPS) のステップで基底を成長させます。これは便利なデフォルトオプションですが、以下のスピン S=1 の例で示すように、状態数はカスタマイズできます。

###### Python を使う場合

Python でシミュレーションを設定・実行するには、スクリプト [`spin_one_half.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one_half.py) を使います。このスクリプトの最初の部分は必要なモジュールをインポートし、入力ファイルを Python 辞書のリストとして準備し、入力ファイルを書き込んでアプリケーションを実行します：

```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot

parms = [ { 
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : 0,
        'J'                         : 1,
        'SWEEPS'                    : 4,
        'NUMBER_EIGENVALUES'        : 1,
        'L'                         : 32,
        'MAXSTATES'                 : 100
       } ]

input_file = pyalps.writeInputFiles('parm_spin_one_half',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

これを実行するには、端末で次のように入力します：
```python 
python spin_one_half.py
```
これでコマンドライン版と同じ出力ファイルが得られます。

次に、DMRG コードが測定した基底状態の物理量を読み込みます：

```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'))
```
そして端末に出力します：

```python
for s in data[0]:
    print(s.props['observable'], ':', s.y[0])
```

さらに、各反復ステップの詳細データを読み込むことができます：

```python
iter = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'),
                          what=['Iteration Energy','Iteration Truncation Error'])
```

これにより、DMRG アルゴリズムが最終的な結果に収束する様子を確認できます。

最後に、反復数の関数として各量の収束をプロットします：
```python
plt.figure()
pyalps.plot.plot(iter[0][0])
plt.title('Iteration history of ground state energy (S=1/2)')
plt.ylim(-15,0)
plt.ylabel('$E_0$')
plt.xlabel('iteration')

plt.figure()
pyalps.plot.plot(iter[0][1])
plt.title('Iteration history of truncation error (S=1/2)')
plt.yscale('log')
plt.ylabel('error')
plt.xlabel('iteration')

plt.show()
```

上記の単一実行（L=32、MAXSTATES=100）では、基底状態エネルギーは無限系成長中にウォームアップし、約 50 回の反復以内に収束値に落ち着きます——[DMRG-02](../dmrg02) で示された厳密な熱力学極限の格子点あたりエネルギーと比較してください——一方、切り詰め誤差は各半掃引の終わりに機械精度（$\sim 10^{-16}$）付近まで下がり、次の半掃引が始まると再び上昇するのこぎり歯状のパターンで低下します：

![](/figs/dmrg/dmrg_energy_truncation.png)

##### 複数回の実行

###### パラメータファイルを使う場合

単一のパラメータファイル [`spin_one_half_multiple`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one_half_multiple) に複数の実行を設定する方法を示します。チュートリアルで提案された例を使い、長さ L=32 の鎖をシミュレートし、DMRG 状態数を変えます（説明のために少ない状態数を使います）：

```python
LATTICE="open chain lattice"
SWEEPS=4
CONSERVED_QUANTUMNUMBERS="N,Sz"
MODEL="spin", Sz_total=0
J=1
NUMBER_EIGENVALUES=1
L=32
{ MAXSTATES=20 }
{ MAXSTATES=40 }
{ MAXSTATES=60 }
```

前の例との主な違いは括弧内のパラメータにあります。前と同様に実行します：

```python
parameter2xml spin_one_half_multiple
dmrg --write-xml spin_one_half_multiple.in.xml
```

この場合、結果を含む三つの出力ファイル `spin_one_half_multiple.task#.out.xml` が得られます。

###### Python を使う場合

スクリプト [`spin_one_half_multiple.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one_half_multiple.py) は異なる MAXSTATES を持つ三つの Python パラメータ辞書を設定します：

```python
parms= []
for m in [20,40,60]:
    parms.append({ 
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : 0,
        'J'                         : 1,
        'SWEEPS'                    : 4,
        'NUMBER_EIGENVALUES'        : 1,
        'L'                         : 32,
        'MAXSTATES'                 : m
       })

```

単一実行と同様にパラメータファイルを書き込み、dmrg アプリケーションを実行し、結果を読み込んだ後、すべての実行の測定値を出力できます：

```python
for run in data:
    for s in run:
        print(s.props['observable'], ':', s.y[0])
```

#### 一次元 S=1 ハイゼンベルク鎖

S=1 ハイゼンベルク鎖は開放境界条件のために特別な扱いが必要です。[DMRG-01](../dmrg01) で説明したように、鎖の両端にスピン S=1/2 を持つ二つのサイトを含める必要があります。これにはシミュレーションのための新しい格子ファイルを定義する必要があります。これを直接行う簡単な方法はないため、手作業で行わなければなりません。処理を簡単にするために、格子を自動生成する単純な Python スクリプト [`build_lattice.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/build_lattice.py) を用意しました。唯一の入力は格子のサイト数です。例えば、次のように入力すると：

```python
python build_lattice.py 6
```

次の出力が得られます：

```python
<LATTICES>
<GRAPH name = "open chain lattice with special edges" dimension="1" vertices="6" edges="5">
<VERTEX id="1" type="0"><COORDINATE>0</COORDINATE></VERTEX>
<VERTEX id="2" type="1"><COORDINATE>2</COORDINATE></VERTEX>
<VERTEX id="3" type="1"><COORDINATE>3</COORDINATE></VERTEX>
<VERTEX id="4" type="1"><COORDINATE>4</COORDINATE></VERTEX>
<VERTEX id="5" type="1"><COORDINATE>5</COORDINATE></VERTEX>
<VERTEX id="6" type="0"><COORDINATE>6</COORDINATE></VERTEX>
<EDGE source="1" target="2" id="1" type="0" vector="1"/>
<EDGE source="2" target="3" id="2" type="0" vector="1"/>
<EDGE source="3" target="4" id="3" type="0" vector="1"/>
<EDGE source="4" target="5" id="4" type="0" vector="1"/>
<EDGE source="5" target="6" id="5" type="0" vector="1"/>
</GRAPH>
</LATTICES>
```

格子は六つの頂点を持つ一次元グラフとして定義され、最近接のみを結ぶ辺を持ちます。最初と最後の頂点はタイプ「0」であり、他はタイプ「1」です。この定義を使って格子上に模型を実装しますが、格子ファイルはこれらの頂点上に住む自由度の情報を含む必要があります。

これを行う方法はパラメータを指定することです：

```python
local_S0=0.5
local_S1=1
```

32 サイトの格子を実行するには次のように入力します：

```python
python build_lattice.py 32 > my_lattice.xml
```

##### パラメータファイルを使う場合

最終的なパラメータファイル [`spin_one`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one) がどのようなものかを見てみましょう：

```python
LATTICE_LIBRARY="my_lattice.xml"
LATTICE="open chain lattice with special edges"
MODEL="spin"
local_S0=0.5
local_S1=1
CONSERVED_QUANTUMNUMBERS="N,Sz"
Sz_total=0
J=1
SWEEPS=4
NUMBER_EIGENVALUES=1
{MAXSTATES=100}
```

各システムサイズについてこの処理を繰り返すのは煩雑です。さらに簡単にする一つの方法は、必要なすべての格子を格子ライブラリで定義することです。$L=32,64,96,128,192$ のサイズの格子を含む [`my_lattices.xml`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/my_lattices.xml) ファイルを用意しました。前のパラメータファイルを次のように格子定義を置き換えるだけです：

```python
LATTICE_LIBRARY="my_lattices.xml"
LATTICE="open chain lattice with special edges 32"
```
格子サイズを名前に含めています。

##### Python を使う場合

スクリプト [`spin_one.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one.py) は Python 辞書でパラメータを定義します：

```python
parms = [ { 
        'LATTICE_LIBRARY'           : 'my_lattice.xml',
        'LATTICE'                   : 'open chain lattice with special edges',
        'MODEL'                     : 'spin',
        'local_S0'                  : '0.5',
        'local_S1'                  : '1',
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : 0,
        'J'                         : 1,
        'SWEEPS'                    : 4,
        'NUMBER_EIGENVALUES'        : 1,
        'MAXSTATES'                 : 100
       } ]
```

パラメータとファイル名の変更を除いて、上で説明した `spin_one_half.py` スクリプトと同じです。

##### 複数回の実行

###### パラメータファイルを使う場合

スピン S=1/2 の場合と同様に、[`spin_one_multiple`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one_multiple) という名前の単一のパラメータファイルで複数の実行を設定できます：

```python
LATTICE_LIBRARY="my_lattices.xml"
LATTICE="open chain lattice with special edges 32"
MODEL="spin"
local_S0=0.5
local_S1=1
CONSERVED_QUANTUMNUMBERS="N,Sz"
Sz_total=0
J=1 
NUMBER_EIGENVALUES=1 
SWEEPS=4
{ MAXSTATES=20 } 
{ MAXSTATES=40 }
{ MAXSTATES=60 }
```

###### Python を使う場合

同じ実行はスクリプト [`spin_one_multiple.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one_multiple.py) で設定できます。これは対応するスピン-1/2 スクリプトのパラメータを置き換えることで得られます。

### 格子点あたり（結合あたり）の基底状態エネルギー

ハミルトニアンをよく見ると、長さ $L$ の鎖のエネルギーは $L$ 個の格子点ではなく $L-1$ 本の結合に乗っています。したがって、最初の（素朴な）試みは、前のシミュレーションの結果を用いて次を計算することです：

$$
e_0/J = \frac{E_0(L)}{L-1}.
$$

正しいアプローチは、鎖の中心の一本の結合のエネルギーを考慮して開放境界条件の影響を取り除くことです。これには二つの方法があります。

1. 長さ $L$ と $L+2$ の二本の鎖の基底状態エネルギーを、上記の長さについて再び計算し、$e_0/J = (E_0(L+2) - E_0 (L))/2$ を結合あたりエネルギーとして計算します。

2. より少ない計算コストで通常用いられる方法は、（[DMRG-06](../dmrg06) で議論する）隣接サイト間の相関関数を使うことです：
$$
e_0/J = \frac{1}{2} (\langle S^+_i S^-_{i+1}\rangle  + \langle S^-_i S^+_{i+1}\rangle ) + \langle S^z_i S^z_{i+1} \rangle 
$$

鎖の中心のサイト $i$ と $i+1$ について計算します。

## まとめ

DMRG はスピン-1/2 およびスピン-1 開放鎖の基底状態エネルギーを数十回の反復で高精度に収束させますが、素朴な格子点あたりエネルギー推定 $E_0(L)/(L-1)$ は熱力学極限の結合あたりエネルギーの代わりとしては不十分です。開放境界条件の効果を補正していないためであり、中心結合の推定が必要です。

## 問題

- 鎖の長さで決まるグローバルな因子を除いて、スピン-1/2 鎖とスピン-1 鎖でシステムサイズが大きくなるにつれた $D$ に関する収束の悪化の違いが見られますか？
- $e_0/J=E_0(L)/(L-1)$ を [DMRG-02](../dmrg02) で示された正確な熱力学極限の格子点あたりエネルギーと比較して、本当に近い値が得られますか？根底にある仮定の何が問題ですか？
- 代わりに $e_0/J=(E_0(L+2)-E_0(L))/2$ を使った場合、同じ鎖長での結果はどのようになりますか？
