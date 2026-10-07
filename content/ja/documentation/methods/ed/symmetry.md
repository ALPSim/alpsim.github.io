---
title: 対称性
math: true
weight: 2
---
ハミルトニアンのヒルベルト空間のサイズは格子サイト数とともに指数関数的に増大するため、調べることのできる量子モデルのサイズは制限されます。しかし、格子とハミルトニアンの対称性を用いたブロック対角化によって、ハミルトニアン行列全体をいくつかのより小さな行列に分解することができます。

以下では、周期境界条件を課した 4 サイトのスピン $\frac{1}{2}$ 鎖を用いて、これらの対称性を利用してハミルトニアン行列全体をブロック対角化する方法を説明します。

## ヒルベルト空間

4 サイトのスピン $\frac{1}{2}$ 鎖のヒルベルト空間の次元は $2^4 = 16$ です。この空間の基底は次のように書けます。

$$
\{ |s_1, s_2, s_3, s_4\rangle \}, \quad s_i \in \{\uparrow, \downarrow\}
$$

## ハミルトニアンの対称性

ハミルトニアンはいくつかの対称性を持ち、それらを用いてブロック対角化することで計算量を削減できます。

- **全磁化 $S^z_{\text{total}}$ の保存**：
   全 $S^z$ 演算子 $S^z_{\text{total}} = \sum_{i=1}^4 S_i^z$ は $\mathcal{H}$ と交換します。したがって、ハミルトニアンは $S^z_{\text{total}}$ が一定のセクターごとにブロック対角になります。

- **並進対称性**：
   ハミルトニアンは並進 $T$ のもとで不変です。ここで $T|s_1, s_2, s_3, s_4\rangle = |s_4, s_1, s_2, s_3\rangle$ です。この対称性を用いて $\mathcal{H}$ をさらにブロック対角化できます。

- **スピン反転対称性**：
   ハミルトニアンはスピン反転 $P$ のもとで不変です。ここで $P|s_1, s_2, s_3, s_4\rangle = |-s_1, -s_2, -s_3, -s_4\rangle$ です。この対称性も利用できます。

- **鏡映対称性**：
   ハミルトニアンは鏡映 $R$ のもとで不変です。ここで $R|s_1, s_2, s_3, s_4\rangle = |s_4, s_3, s_2, s_1\rangle$ です。

## ブロック対角化

全磁化 $S^z_{\text{total}}$ と並進対称性を用いてヒルベルト空間を縮小します。

### ステップ 1：全磁化セクター

$S^z_{\text{total}}$ の取りうる値は $-2, -1, 0, 1, 2$ です。ヒルベルト空間をこれらのセクターに分割できます。

- $S^z_{\text{total}} = 2$：状態は $|\uparrow, \uparrow, \uparrow, \uparrow\rangle$ の 1 つのみです。
- $S^z_{\text{total}} = 1$：4 つの状態。例えば $|\downarrow, \uparrow, \uparrow, \uparrow\rangle$、$|\uparrow, \downarrow, \uparrow, \uparrow\rangle$ など。
- $S^z_{\text{total}} = 0$：6 つの状態。例えば $|\uparrow, \uparrow, \downarrow, \downarrow\rangle$、$|\uparrow, \downarrow, \uparrow, \downarrow\rangle$ など。
- $S^z_{\text{total}} = -1$：4 つの状態。例えば $|\downarrow, \downarrow, \downarrow, \uparrow\rangle$、$|\downarrow, \downarrow, \uparrow, \downarrow\rangle$ など。
- $S^z_{\text{total}} = -2$：状態は $|\downarrow, \downarrow, \downarrow, \downarrow\rangle$ の 1 つのみです。

### ステップ 2：並進対称性

各 $S^z_{\text{total}}$ セクターの中で、並進対称性を用いてさらにブロック対角化できます。並進演算子 $T$ の固有値は $e^{ik}$ であり、$k = 0, \pi/2, \pi, 3\pi/2$ です（$T^4 = 1$ であるため）。

例えば $S^z_{\text{total}} = 0$ セクターでは、状態を運動量固有状態に組み直すことができます。全運動量 $k$ を持つ状態の 1 つは次で与えられます。

$$
|\phi\rangle = \frac{1}{\sqrt{M}} \sum_{n=0}^3 e^{ikn} T^n |\psi\rangle,
$$

ここで $|\psi\rangle$ は実空間における代表状態、$|\phi\rangle$ は運動量空間における状態であり、$T$ の作用のもとで不変です。規格化因子は、状態の巡回周期が 4 より小さい場合を除いて $M=4$ です。この場合については後で説明します。

### ステップ 3：ハミルトニアンのブロックの構築

各 $S^z_{\text{total}}$ と運動量 $k$ について、縮小された基底でハミルトニアン行列を構築します。行列要素は次のとおりです。

$$
\langle \phi^{\prime} | \mathcal{H} | \phi \rangle = J \sum_{i=1}^4 \langle \phi^{\prime} | \mathbf{S}_i \cdot \mathbf{S}_{i+1} | \phi \rangle
$$

### ステップ 4：対角化

最後に、ハミルトニアンの各ブロックを対角化して固有値と固有状態を求めます。

### 例：$S^z_{\text{total}} = 0$ セクター

$S^z_{\text{total}} = 0$ セクターは、ちょうど 2 つの上向きスピン（$\uparrow$）と 2 つの下向きスピン（$\downarrow$）を持つ状態からなります。4 サイト鎖では、このセクターに $\binom{4}{2} = 6$ 個の基底ベクトルがあります。

$$
|\psi_1\rangle = |\uparrow, \uparrow, \downarrow, \downarrow\rangle, \quad |\psi_2\rangle = |\uparrow, \downarrow, \uparrow, \downarrow\rangle, \quad |\psi_3\rangle = |\uparrow, \downarrow, \downarrow, \uparrow\rangle
$$
$$
|\psi_4\rangle = |\downarrow, \uparrow, \uparrow, \downarrow\rangle, \quad |\psi_5\rangle = |\downarrow, \uparrow, \downarrow, \uparrow\rangle, \quad |\psi_6\rangle = |\downarrow, \downarrow, \uparrow, \uparrow\rangle
$$

$S^z_{\text{total}}=0$ セクターのハミルトニアン行列全体は次で与えられます。
$$
\mathcal{H} = J\begin{pmatrix}
 0 & 0.5 & 0 & 0 & 0.5 & 0 \\
 0.5 & -1 & 0.5 & 0.5 & 0 & 0.5 \\
 0 & 0.5 & 0 & 0 & 0.5 & 0 \\
 0 & 0.5 & 0 & 0 & 0.5 & 0 \\
 0.5 & 0 & 0.5 & 0.5 & -1 & 0.5 \\
 0 & 0.5 & 0 & 0 & 0.5 & 0 \\
\end{pmatrix}.
$$
上の行列を厳密対角化すると、$E_1=-2J$、$E_2=-J$、$E_3=0$、$E_4=0$、$E_5=0$、$E_6=J$ が得られます。

#### 運動量セクター
運動量 $k$ は、上で述べたように $k = 0, \pi/2, \pi, 3\pi/2$ で与えられます。並進演算子 $T$ は状態 $|\psi_i\rangle$ に次のように作用します。

$$
T^n |\psi_i\rangle = e^{ikn} |\psi_j\rangle.
$$

$n=1$ のとき、各サイトのスピン配置は格子間隔 1 つ分だけ右にずれます。$n=4$ のとき、状態は $|\psi_j\rangle=|\psi_i\rangle$ となります。状態の巡回周期が $4$ より小さいこともあり得ます。例えば、$|\psi_2\rangle$ と $|\psi_5\rangle$ はどちらも周期 2 を持ちます。このとき、上の変換式における規格化因子は $M=2$ です。

以下では、各運動量セクターについて並進対称な状態を構築します。

#### $S^z_{\text{total}} = 0$ かつ $k = 0$ のセクター
運動量 $k = 0$ のセクターは並進対称な状態からなります。$S^z_{\text{total}} = 0$ では基底ベクトルは 2 つあります。

$$
|\phi_1\rangle = \frac{1}{2} \left( |\psi_1\rangle + |\psi_4\rangle + |\psi_6\rangle + |\psi_3\rangle \right).
$$

$$
|\phi_2\rangle = \frac{1}{\sqrt{2}}(|\psi_2\rangle + |\psi_5\rangle).
$$
上の運動量空間の基底ベクトルの構築では、2 つの**代表状態** $|\psi_1\rangle$ と $|\psi_2\rangle$ に並進演算子 $T$ を作用させて基底ベクトルを生成しています。これ以外に独立な状態は生成できません。したがって、$S^z_{\text{total}} = 0$ かつ $k = 0$ のセクターの次元は 2 です。

このセクターのハミルトニアン行列は次で与えられます。
$$
\mathcal{H} = J\begin{pmatrix}
0 & \sqrt{2} \\
\sqrt{2} & -1 \\
\end{pmatrix}.
$$
この行列を厳密対角化すると、$E_1=-2J$ と $E_2=J$ が得られます。

#### $S^z_{\text{total}} = 0$ かつ $k = 1$ のセクター
運動量 $k = 1$ のセクターは $k = \frac{\pi}{2}$ に対応します。$S^z_{\text{total}} = 0$ では基底ベクトルは 1 つだけです。

$$
|\phi_1\rangle = \frac{1}{2} \left( |\psi_1\rangle + i|\psi_4\rangle - |\psi_6\rangle - i|\psi_3\rangle \right).
$$

このセクターのハミルトニアン行列は次のとおりです。

$$
\mathcal{H} = \begin{pmatrix}
0
\end{pmatrix}.
$$
したがって、$S^z_{\text{total}} = 0$ かつ $k = 1$ のセクターの固有値は $E_3=0$ です。

#### $S^z_{\text{total}} = 0$ かつ $k = 2$ のセクター
運動量 $k = 2$ のセクターは $k = \pi$ に対応します。$S_z = 0$ では基底ベクトルは 2 つあります。

$$
|\phi_1\rangle = \frac{1}{2} \left( |\psi_1\rangle - |\psi_4\rangle + |\psi_6\rangle -|\psi_3\rangle \right),
$$
$$
|\phi_2\rangle = \frac{1}{\sqrt{2}} \left( |\psi_2\rangle - |\psi_5\rangle \right),
$$

このセクターのハミルトニアン行列は次のとおりです。

$$
\mathcal{H} = J \begin{pmatrix}
0 & 0 \\
0 & -1 \\
\end{pmatrix},
$$
これを厳密対角化すると、$E_4=-J$ と $E_5=0$ が得られます。

#### $S^z_{\text{total}} = 0$ かつ $k = 3$ のセクター
運動量 $k = 3$ のセクターは $k = \frac{3\pi}{2}$ に対応します。$S_z = 0$ では基底ベクトルは 1 つだけです。

$$
|\phi_1\rangle = \frac{1}{2} \left( |\psi_1\rangle - i|\psi_4\rangle - |\psi_6\rangle + i|\psi_3\rangle \right).
$$

このセクターのハミルトニアン行列は次のとおりです。

$$
\mathcal{H} = \begin{pmatrix}
0
\end{pmatrix}.
$$
したがって、最後の固有値は $E_6=0$ です。

#### まとめ
- **$k = 0$**：2 つの状態、エネルギーは $-2J$ と $J$。
- **$k = 1$**：1 つの状態、エネルギーは $0$。
- **$k = 2$**：2 つの状態、エネルギーは $-J$ と $0$。
- **$k = 3$**：1 つの状態、エネルギーは $0$。

これらのエネルギー準位は、並進対称性を用いずに $S^z_{\text{total}}=0$ セクターの $6\times 6$ ハミルトニアン行列を直接厳密対角化して得られたものと一致しています。

すべてのブロックを対角化すると、周期境界条件を課した 4 サイトのハイゼンベルク鎖の厳密な固有値と固有状態が得られます。対称性を用いることで、行列のサイズはおよそ $1/N$ 倍（$N$ は格子サイト数）に縮小されます。

この方法はより大きな系にも一般化できますが、厳密対角化のコードにおいてヒルベルト空間のすべての状態に番号を付けてアクセスするための効率的な方法を考える必要があります。それでも、計算コストは系のサイズとともに指数関数的に増大します。
