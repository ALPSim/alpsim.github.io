
---
title: 確率級数展開 (SSE)
math: true
weight: 4
---

確率級数展開 (SSE) 法は、量子系の分配関数 $Z$ をハミルトニアンのべき級数に展開する有限温度の QMC 手法です。もともとはハイゼンベルクモデルに適用されました [^Sandvik99] が、ボース・ハバードモデルなど他の量子モデルにも容易に拡張できます。

量子モデルの分配関数は次で与えられます。

$$
Z = \text{Tr}(e^{-\beta \mathcal{H}}),
$$

ここで $\beta = 1/(k_B T)$ は逆温度、$\mathcal{H}$ はハミルトニアンです。SSE の鍵となるアイデアは、指数演算子 $e^{-\beta \mathcal{H}}$ をテイラー級数として表すことです。

$$
e^{-\beta \mathcal{H}} = \sum_{n=0}^\infty \frac{(-\beta)^n}{n!} \mathcal{H}^n.
$$

基底状態の完全系 $\{|\alpha\rangle\}$ を挿入すると、分配関数は次のように書き直せます。

$$
Z = \sum_{\alpha} \sum_{n=0}^\infty \frac{(-\beta)^n}{n!} \langle \alpha | \mathcal{H}^n | \alpha \rangle.
$$

温度に応じて、シミュレーション中の SSE の展開次数はある有限の次数 $N$ を超えることはありません。そこで SSE 法では、この展開級数を次数 $N$ で打ち切り、各項を確率的にサンプリングします。ハミルトニアン $\mathcal{H}$ は通常、ハイゼンベルクモデルのボンド演算子のような、基本的な相互作用項 $H_{i,j}$ の和に分解されます。

$$
\mathcal{H} = -\sum_{i,j} H_{i,j}.
$$

各項 $H_{i,j}$ はサイトの対に作用し、適切な基底で表現できます。SSE アルゴリズムは、これらの演算子の列からなる配置をサンプリングします。

ハイゼンベルクモデルの場合、ボンド演算子 $H_{i,j}$ は次のように表せます。

$$
H_{i,j} = J \left( S_i^z S_j^z + \frac{1}{2} (S_i^+ S_j^- + S_i^- S_j^+) \right),
$$

ここで $S_i^z$ はスピン演算子の $z$ 成分、$S_i^+$ と $S_i^-$ はそれぞれスピンの上昇演算子と下降演算子です。第 1 項 $S_i^z S_j^z$ は相互作用の**対角部分**を、第 2 項 $\frac{1}{2} (S_i^+ S_j^- + S_i^- S_j^+)$ は**非対角部分**を表します。

### 対角行列要素と非対角行列要素

#### ハイゼンベルクモデル
SSE の枠組みでは、ハイゼンベルクハミルトニアンは対角演算子と非対角演算子で表されます。ある基底状態 $|\alpha\rangle$ に対して、ボンド演算子 $H_{i,j}$ の行列要素は次のようになります。

1. **対角行列要素**：
   これらは $S_i^z S_j^z$ 項に対応し、次で与えられます。
   $$
   \langle \alpha | S_i^z S_j^z | \alpha \rangle = S_i^z S_j^z,
   $$
   ここで $S_i^z$ と $S_j^z$ は状態 $|\alpha\rangle$ におけるスピンの $z$ 成分です。

2. **非対角行列要素**：
   これらはスピン反転項 $S_i^+ S_j^-$ と $S_i^- S_j^+$ に対応します。状態 $|\alpha\rangle$ に対して、非対角行列要素は
   $$
   \langle \alpha | S_i^+ S_j^- | \alpha^{\prime} \rangle = \frac{1}{2} \delta_{\alpha, \alpha^{\prime} \text{ with } S_i^+ S_j^-},
   $$
   および
   $$
   \langle \alpha | S_i^- S_j^+ | \alpha^{\prime} \rangle = \frac{1}{2} \delta_{\alpha, \alpha' \text{ with } S_i^- S_j^+},
   $$
   となります。ここで $\alpha^{\prime}$ は、$\alpha$ においてサイト $i$ と $j$ のスピンを反転して得られる状態です。
   
#### ボース・ハバードモデル
ボース・ハバードモデルは、オンサイト相互作用と最近接ホッピングを持つ格子上のボソンを記述します。ハミルトニアンは次で与えられます。

$$
H = -t \sum_{\langle i,j \rangle} (b_i^\dagger b_j + \text{h.c.}) + \frac{U}{2} \sum_i n_i (n_i - 1) - \mu \sum_i n_i,
$$

ここで、
- $t$ はホッピング振幅、
- $U$ はオンサイト相互作用の強さ、
- $\mu$ は化学ポテンシャル、
- $b_i^\dagger$ と $b_i$ はサイト $i$ におけるボソンの生成・消滅演算子、
- $n_i = b_i^\dagger b_i$ は数演算子、
- $\langle i,j \rangle$ は最近接対を表します。

ボース・ハバードハミルトニアン $\mathcal{H}$ は、ボンド演算子 $H_{i,j}$（ホッピング）と $H_i$（オンサイト相互作用）の集合に分解されます。
$$
H = -\sum_b H_b,
$$
ここで $b$ はボンドまたはサイトのラベルです。ボース・ハバードモデルの場合は次のようになります。
- ホッピング項：$H_{i,j} = t (b_i^\dagger b_j + b_j^\dagger b_i)$、
- オンサイト項：$H_i = \frac{U}{2} n_i (n_i - 1) - \mu n_i$。

### 基底状態の挿入

SSE 法では、分配関数は基底状態 $|\alpha\rangle$ と演算子列によって展開されます。SSE 展開における典型的な配置は次のもので構成されます。

1. 基底状態 $|\alpha_0\rangle$（初期状態）。
2. その状態に作用する演算子 $H_{i,j}$ の列。

すると分配関数は次のように書けます。

$$
Z = \sum_{\alpha_0} \sum_{n=0}^N \frac{(-\beta)^n}{n!} \sum_{\{H_{i,j}\}} \langle \alpha_0 | H_{i_1,j_1} H_{i_2,j_2} \cdots H_{i_n,j_n} | \alpha_0 \rangle,
$$

ここで $N$ は展開次数のカットオフ、$\{H_{i,j}\}$ は $n$ 個の演算子の列を表します。演算子の行列要素は基底状態で評価され、演算子列は最終状態が初期状態 $|\alpha_0\rangle$ に一致するという条件を満たさなければなりません。

### SSE アルゴリズムの手順

1. **初期化**：初期状態 $|\alpha\rangle$ と空の演算子列から始めます。
2. **演算子の挿入**：対角演算子 $H_{i,j}$ を列に挿入または列から削除することを提案し、それに応じて状態 $|\alpha\rangle$ を更新します。
3. **対角更新**：演算子列がハミルトニアンおよび基底状態と整合していることを保証します。
4. **ループ更新**：サンプリング効率を向上させるために非局所的な更新を行います。多くの場合、スピンやその他のボソンモデルに合わせたクラスターアルゴリズムやループアルゴリズムが用いられます [^Syljuasen02] [^pollet04] [^Alet05]。
5. **測定**：サンプリングした配置について平均をとることで、エネルギー、磁化、相関関数などの物理量を計算します。

SSE 法は、特定の幾何構造（例えば二部格子）では符号問題を回避でき、低温領域と高温領域の両方で効率的なサンプリングが可能なため、ハイゼンベルクモデルに対して特に有利です。量子相転移、スピンダイナミクス、ボソン系など、幅広い現象の研究に適用され、成功を収めてきました。


[^Sandvik99]: Sandvik, A. W., "Stochastic Series Expansion Method with Operator-Loop Update", *Physical Review B*, 59, R14157-R14160 (1999).
[^Syljuasen02]: Syljuåsen, O. F. and Sandvik, A. W., "Quantum Monte Carlo with Directed Loops", *Physical Review E*, 66, 046701 (2002).
[^pollet04]: Pollet, L., et al., "Optimal Monte Carlo Updating", *Physical Review E*, 70, 056705 (2004).
[^Alet05]: Alet, F., et al., "Generalized Directed Loop Method for Quantum Monte Carlo Simulations", *Physical Review E*, 71, 036706 (2005).
