---
title: DMRG-07 入門
weight: 1
math: true
toc: true
---

このチュートリアルシリーズでは、これまでのモジュールで扱ったハイゼンベルク鎖を再び取り上げますが、今回はスピンレスフェルミオンの視点から解析を行います。ここでは XXZ ハイゼンベルク模型に注目し、Jordan–Wigner 変換を用いてそれをスピンレスフェルミオンの言葉に翻訳します。このシリーズを通じて、二つの言語が同じ系を記述していること、ただし利用できる対称性が異なるため、研究対象に応じて一方が他方より適していることを見ていきます。

---

## XXZ ハミルトニアン

出発点は、最近接結合 $J$ と異方性 $\Delta$ を持つ異方的ハイゼンベルク（XXZ）鎖です：

$$
\boxed{\;\hat H \;=\; J\sum_{j=1}^{L}\Big(\hat S^x_j \hat S^x_{j+1} \;+\; \hat S^y_j \hat S^y_{j+1} \;+\; \Delta\, \hat S^z_j \hat S^z_{j+1}\Big)\;}
$$

これまでと同様に、各サイトの局所ヒルベルト空間は二次元 $\{\lvert\uparrow\rangle,\lvert\downarrow\rangle\}$ であり、全ヒルベルト空間の次元は $2^L$ です。念頭に置いておくべき特別な場合がいくつかあり、DMRG アルゴリズムのさらなるベンチマークに利用できます：

| $\Delta$ | 名称 | コメント |
|---|---|---|
| $0$ | XX 模型 | *自由*フェルミオンであることが後で分かります |
| $1$ | 等方的ハイゼンベルク | $SU(2)$ 対称 |
| $\to\infty$ | イジング極限 | 古典的、秩序状態 |

それでは、いつものように昇降演算子を定義して、上のハミルトニアンをより扱いやすい解析的な形に書き換えましょう：

$$
\hat S^{\pm}_j \;=\; \hat S^x_j \pm i\,\hat S^y_j
\qquad\Longleftrightarrow\qquad
\hat S^x_j = \tfrac{1}{2}\big(\hat S^+_j + \hat S^-_j\big), \quad
\hat S^y_j = \tfrac{1}{2i}\big(\hat S^+_j - \hat S^-_j\big).
$$

$(\hat S^+)^\dagger = \hat S^-$ であることに注意してください。つまり、昇降演算子は $\hat S^z$ と異なり、エルミートでは**ありません**。これは、$\hat S^\pm$ がフェルミオンの生成・消滅演算子に自然に対応付けられる一方で、$\hat S^z_j$ が密度の自然な候補であることを示す最初のヒントです（詳しくは後述します）。ここではまず、上のハミルトニアンを通常の形に変換します：

$$
\boxed{\;\hat H = J\sum_{j=1}^{L}\left[\tfrac{1}{2}\Big(\hat S^+_j \hat S^-_{j+1} + \hat S^-_j \hat S^+_{j+1}\Big) + \Delta\, \hat S^z_j \hat S^z_{j+1}\right]\;}
$$

物理的に読み解くと、第一項は反転したスピンをサイト $j+1$ からサイト $j$ へ（およびその逆へ）**移動させる**——これは*ホッピング*項です。第二項は $S^z$ 基底で対角的——これは*相互作用*です。この読み方こそ、フェルミオン化によって文字通りの意味を持つことになります。

---

## 交換関係と反交換関係

上の類推を完全に正当化するには、スピン演算子の交換関係と反交換関係を詳しく調べる必要があります。よく知られているように、スピン代数は次で与えられます：

$$
\big[\hat S^a_n,\, \hat S^b_m\big] \;=\; i\,\delta_{nm}\,\sum_c \epsilon_{abc}\, \hat S^c_n .
$$

ここで $\delta_{nm}$ が決定的に重要な構造的事実です：**異なるサイト上のスピンは交換します。**すなわちスピンは*区別可能な局所自由度*です。

スピン-$\tfrac{1}{2}$ の場合、任意の二つのサイト上の反交換子は次のようになります：

$$
\big\{\hat S^a_n,\, \hat S^b_m\big\} \;=\; \tfrac{1}{2}\,\delta_{nm}\,\delta_{ab}\,\hat{\mathbb 1}
\;+\; 2\,\big(1-\delta_{nm}\big)\,\hat S^a_n \hat S^b_m ,
$$

したがって特に $\big(\hat S^a_n\big)^2 = \tfrac{1}{4}\hat{\mathbb 1}$ となります。

上の代数から、昇降演算子の代数を求めることができます：

$$
\big[\hat S^+_i,\, \hat S^-_j\big] = 2\,\delta_{ij}\,\hat S^z_i ,
\qquad
\big[\hat S^z_i,\, \hat S^{\pm}_j\big] = \pm\,\delta_{ij}\,\hat S^{\pm}_i .
$$

第二の関係式は、$\hat S^{\pm}$ が $\hat S^z$ の固有値をちょうど $1$ だけ上げ下げすることを表しています——つまり $m = -\tfrac12 \to +\tfrac12$ と変化させるのであり、これはまさに粒子の追加・除去のように見えます！

さて、この類推を実際の定量的な写像へと橋渡しする鍵となる観察に移りましょう。**単一サイト**上の反交換関係は次のことを明らかにします：

$$
\big\{\hat S^+_i,\, \hat S^-_i\big\} = 2\big(\hat S^{x\,2}_i + \hat S^{y\,2}_i\big) = 2\left(\tfrac14 + \tfrac14\right) = \hat{\mathbb 1},
$$

$$
\big\{\hat S^{\pm}_i,\, \hat S^{\pm}_i\big\} = 2\big(\hat S^{\pm}_i\big)^2 = 0 .
$$

二番目の式は**ハードコア／排他条件**です：スピン-$\tfrac12$ を二度上げることはできません。これを、我々が欲しいフェルミオンの代数と比較すると：

$$
\big\{\hat c_i,\, \hat c^{\dagger}_j\big\} = \delta_{ij},
\qquad
\big\{\hat c_i,\, \hat c_j\big\} = \big\{\hat c^{\dagger}_i,\, \hat c^{\dagger}_j\big\} = 0 .
$$

一つのサイト上では、同一視 $\hat S^+ \leftrightarrow \hat c^\dagger$、$\hat S^- \leftrightarrow \hat c$ は**局所的には**完全に正しいのです。しかし、*異なるサイト間*ではこの同一視が破綻することに注意してください：
$$
\big[\hat c^\dagger_i,\, \hat c_j\big] = \hat c^\dagger_i \hat c_j - \hat c_j \hat c^\dagger_i = 2\,\hat c^\dagger_i \hat c_j \;\neq\; 0 .
$$ 

つまり、スピンは交換し、フェルミオンは反交換するのです。具体的に言えば、離れたサイト上の二つのスピン反転を交換しても何も起こりませんが、二つのフェルミオンを交換すると必ずマイナス符号が付きます。純粋に*局所的*な置き換えではこの符号を決して生成できません。なぜなら、二つのサイトの間に何があるかを知る術がないからです。

> これらの交換関係を忠実に再現するには、*Jordan–Wigner 変換*を介して、生成・消滅演算子に非局所的なストリング演算子を付加する必要があります。

まずは動機付けを完結させるために、状態空間の間の写像を明確にしておきましょう。

---

## 状態の写像：スピン配置 $\to$ 占有数

上の解析に従って、二つの局所状態を空の軌道と占有された軌道に対応付けることができます：

$$
\lvert \downarrow \rangle_j \;\longmapsto\; \lvert 0 \rangle_j, \qquad
\lvert \uparrow \rangle_j \;\longmapsto\; \lvert 1 \rangle_j .
$$

すなわち、「下向きスピン」$=$ 空のサイト、「上向きスピン」$=$ 粒子一個です。一つのサイトが持てる粒子数は $0$ か $1$ であり決して $2$ にはならないため、粒子は自動的にパウリ型の排他律に従います——これは上で見つけた $(\hat S^+)^2 = 0$ の状態空間版です。上で述べたように、次のことも分かります：

$$
\boxed{\;\hat S^z_j \;=\; \hat n_j - \tfrac{1}{2} \;=\; \hat c^\dagger_j \hat c_j - \tfrac{1}{2}\;}
$$

全磁化に対する直接の帰結に注意してください：

$$
\hat S^z_{\text{tot}} = \sum_j \hat S^z_j = \hat N - \frac{L}{2}, \qquad \hat N = \sum_j \hat n_j .
$$

磁化ゼロ $\Leftrightarrow$ 半充填、というわけです。

---

## Jordan–Wigner 変換

ここからは Jordan–Wigner 変換を扱います。代数的な詳細の大部分は省略します。良い演習になりますが、我々の目的にとってはそれほど重要ではありません。

まず、サイト $l$ 上の局所パリティ演算子を定義することから始めます：

$$
e^{i\pi \hat n_l} \;=\; \hat{\mathbb 1} - 2\hat n_l \;=\; -2\hat S^z_l .
$$

これから、サイト $j$ に対する**ストリング演算子**を構成できます。これは単に、$j$ の厳密に左側にあるすべてのサイトのパリティの積です：

$$
\boxed{\;\hat P_j \;=\; \prod_{l<j} e^{i\pi \hat n_l} \;=\; \prod_{l<j}\big(1 - 2\hat n_l\big) \;=\; \prod_{l<j}\big(-2\hat S^z_l\big)\;}
$$

$\hat P_j$ は**サイト $j$ の左側にあるフェルミオン数のパリティ**を測ります：その数が偶数なら $+1$、奇数なら $-1$ を返します。これは明らかに非局所的で——鎖の左半分全体に依存します——さらに $\hat P_j^\dagger = \hat P_j = \hat P_j^{-1}$ を満たします。

求めていた変換はもう手の届くところにあり、次の形を取ります：
$$
\boxed{\;
\hat S^+_j = \hat P_j\, \hat c^\dagger_j = \hat c^\dagger_j\,\hat P_j ,
\qquad
\hat S^-_j = \hat P_j\, \hat c_j = \hat c_j \,\hat P_j ,
\qquad
\hat S^z_j = \hat n_j - \tfrac{1}{2}
\;}
$$

（二つの順序が一致するのは、$\hat P_j$ がサイト $l<j$ のみを含み、しかもフェルミオン演算子について*偶*であるため、$\hat c^{(\dagger)}_j$ と交換するからです。）

$\hat P_j^2 = \hat{\mathbb 1}$ と、スピンで書いた $\hat P_j$ を用いて逆に解くと：

$$
\hat c^\dagger_j = \left[\prod_{l<j}\big(-2\hat S^z_l\big)\right] \hat S^+_j ,
\qquad
\hat c_j = \left[\prod_{l<j}\big(-2\hat S^z_l\big)\right] \hat S^-_j .
$$

つまり $\hat c_j$ は単なる局所的なスピン反転では*なく*、「サイト $j$ のスピンを反転し、$j$ の左側にある上向きスピン一つごとに $(-1)$ を掛ける」という操作です。$\hat S^z_j$ にはストリングが不要であることに注意してください——これは対角的であり、何も入れ替えないからです。

### なぜストリングでうまくいくのか

ここでも代数の大部分は省略し、代わりにいくつかの重要な事実を指摘します。すべての重みを担う一つの恒等式は、単一サイト上でパリティ演算子がスピン反転と**反交換**することです：

$$
\big\{\hat S^z_i,\, \hat S^{\pm}_i\big\} = 0
\qquad\Longleftrightarrow\qquad
\big\{ e^{i\pi\hat n_i},\, \hat S^{\pm}_i \big\} = 0 .
$$

物理的には、サイトを反転させるとそのパリティが*変わる*ため、反転とパリティは反交換します。$i<j$ と仮定すると、$\hat P_j$ の各因子のうち $e^{i\pi\hat{n}_i}$ **だけ**が $\hat S_i^-$ と反交換し、他はすべて交換することが分かり、次が得られます：

$$
\big\{\hat c_i,\, \hat c^\dagger_j\big\} = 0 \qquad (i \neq j) . \quad\checkmark
$$

同じ議論から $\{\hat c_i,\hat c_j\} = 0$ が得られ、同一サイト上では単一サイトの代数がすでに $\{\hat c_i,\hat c^\dagger_i\} = \{\hat S^-_i,\hat S^+_i\} = \hat{\mathbb 1}$ を与えていました。まとめると：

$$
\big\{\hat c_i,\hat c^\dagger_j\big\} = \delta_{ij}, \qquad
\big\{\hat c_i,\hat c_j\big\} = \big\{\hat c^\dagger_i,\hat c^\dagger_j\big\} = 0 .
$$

**このストリングこそが、まさに最小限の修正です。**交換に必要な $(-1)$ を供給し、そして——$\hat P_j^2 = 1$ であるため——それ以外には何も寄与しません。この写像はユニタリであり、ヒルベルト空間は変わりません（どちらも $2^L$ 状態です）。我々は基底のラベルを付け替え、どの演算子を基本的なものと呼ぶかを再定義しただけなのです。

> その代償として、順序 $1,2,\dots,L$ に物理的な意味が与えられました。Jordan–Wigner が 1 次元で自然なのは、まさに鎖には曖昧さのない「〜の左側」が存在するからです。高次元ではストリングに正準的な経路が存在せず、この技巧が素直に一般化できないのはそのためです。

---

## ハミルトニアンの写像

### ホッピング項：ストリングの相殺

ここでも代数的なステップの大部分は省略します。最近接ボンド $\hat S^+_j \hat S^-_{j+1}$ に注目して代入すると：

$$
\hat S^+_j \hat S^-_{j+1}
= \big(\hat c^\dagger_j \hat P_j\big)\big(\hat P_j e^{i\pi \hat n_j} \hat c_{j+1}\big)
= \hat c^\dagger_j\, e^{i\pi \hat n_j}\, \hat c_{j+1},
$$

ここで $\hat P_j^2 = \hat{\mathbb 1}$ により、サイト $l<j$ にわたるストリング全体が消えました。唯一残ったパリティ因子も、$\hat c^\dagger_j \hat n_j = \hat c^\dagger_j \hat c^\dagger_j \hat c_j = 0$ により脱落します。したがって：

$$
\boxed{\;\hat S^+_j \hat S^-_{j+1} = \hat c^\dagger_j \hat c_{j+1}\;}
\qquad\text{and h.c.}\qquad
\hat S^-_j \hat S^+_{j+1} = \hat c^\dagger_{j+1}\hat c_j .
$$

これこそ、Jordan–Wigner が単に正しいだけでなく*有用*である理由です：**最近接**項では非局所ストリングが二つのサイトの間で相殺し、明らかに非局所的な変換が明らかに局所的なハミルトニアンを生み出すのです。（$|i-j|>1$ のより長距離のホッピング $\hat S^+_i\hat S^-_j$ ではストリングは相殺**せず**、残余の $\prod_{i<l<j}e^{i\pi\hat n_l}$ が生き残ります。）

### 相互作用項

こちらは同一視 $\hat S^z_j = \hat n_j - \tfrac{1}{2}$ から直ちに得られます：

$$
\Delta\,\hat S^z_j \hat S^z_{j+1} = \Delta\left(\hat n_j - \tfrac{1}{2}\right)\left(\hat n_{j+1} - \tfrac{1}{2}\right).
$$

### スピンレスフェルミオンのハミルトニアン

$$
\boxed{\;
\hat H \;=\; \frac{J}{2}\sum_{j}\Big(\hat c^\dagger_j \hat c_{j+1} + \hat c^\dagger_{j+1}\hat c_j\Big)
\;+\; J\Delta \sum_{j}\left(\hat n_j - \tfrac{1}{2}\right)\left(\hat n_{j+1} - \tfrac{1}{2}\right)
\;}
$$

第二項を展開して、標準的な格子模型のパラメータを読み取ると：

$$
\hat H = -t\sum_j\Big(\hat c^\dagger_j \hat c_{j+1} + \text{h.c.}\Big) \;+\; V\sum_j \hat n_j \hat n_{j+1} \;-\; \mu \sum_j \hat n_j \;+\; \frac{J\Delta L}{4},
$$

$$
t = -\frac{J}{2}, \qquad V = J\Delta, \qquad \mu = J\Delta .
$$

つまり XXZ 鎖は、振幅 $J/2$ でホッピングし、最近接強度 $J\Delta$ で相互作用するスピンレスフェルミオンの鎖**そのもの**なのです。定数 $J\Delta L/4$ と化学ポテンシャルのシフト $\mu$ は、どちらも $\hat S^z = \hat n - \tfrac12$ の $-\tfrac12$ に由来する副産物です——雑にパウリ行列を使うと消えてしまうのが、まさにこの部分です。

**境界に関する注意。***スピン*鎖に周期境界条件を課した場合、ボンド $L \to 1$ ではストリングが相殺されません：$\hat P_L$ は系全体を一周し、大域的なパリティ因子 $e^{i\pi \hat N}$ を残します。したがってフェルミオン鎖は、全フェルミオン数 $\hat N$ が奇数か偶数かに応じて、周期的または反周期的になります。開放境界ではこの微妙な問題は生じません。

---

## $U(1)$ 対称性と粒子数セクター

元のハミルトニアンは全磁化を保存します：

$$
\big[\hat H,\, \hat S^z_{\text{tot}}\big] = 0 ,
$$

これは、ホッピング項 $\hat S^+_j\hat S^-_{j+1}$ が一つのスピンを上げ、もう一つを下げるため、$\sum_j S^z_j$ が変化しないからです。$\hat S^z_{\text{tot}} = \hat N - L/2$ を通じて、これは**粒子数**の保存になります：

$$
\boxed{\;\big[\hat H,\, \hat N\big] = 0, \qquad \hat N = \sum_{j} \hat c^\dagger_j \hat c_j \;}
$$

これに付随する対称性は、大域的な $U(1)$ 位相回転です：

$$
\hat c_j \;\longmapsto\; e^{i\theta}\, \hat c_j , \qquad
\hat c^\dagger_j \;\longmapsto\; e^{-i\theta}\, \hat c^\dagger_j ,
$$

この変換のもとで $\hat H$ の各項（$\hat c$ 一つにつき $\hat c^\dagger$ 一つ）は不変です。生成子は $\hat N$ で、$\hat U(\theta) = e^{i\theta \hat N}$ です。

**帰結。**$\hat H$ は $\hat N$ の固有基底でブロック対角になります。$2^L$ 次元のヒルベルト空間は粒子数固定のセクターに分解されます：

$$
\mathcal{H} = \bigoplus_{N=0}^{L} \mathcal{H}_N , \qquad \dim \mathcal{H}_N = \binom{L}{N}, \qquad \sum_{N=0}^{L}\binom{L}{N} = 2^L ,
$$

そしてすべての固有状態は $\lvert E, N\rangle$ とラベル付けできます。実用上、これは大きな節約になります：$2^L \times 2^L$ の行列を対角化する代わりに、各 $\binom{L}{N}\times\binom{L}{N}$ ブロックを個別に対角化すればよいのです。二つの言語の間の対応表は次の通りです：

| スピンの言語 | フェルミオンの言語 |
|---|---|
| 全磁化 $S^z_{\text{tot}}$ | 粒子数 $N - L/2$ |
| 磁化ゼロ | 半充填、$N = L/2$ |
| 完全偏極 $\lvert\downarrow\downarrow\cdots\rangle$ | 真空、$N = 0$ |
| 単一マグノン | 一粒子セクター、$N=1$ |
| マグノン分散 | 一粒子バンド $\varepsilon_k$ |

（さらに離散的な $\mathbb{Z}_2$ 対称性、すなわちスピン反転 $\leftrightarrow$ 粒子・正孔変換 $\hat c_j \to \hat c^\dagger_j$ が存在します。これはセクター $N$ を $L-N$ に写し、半充填では $\hat H$ の対称性になります。）

---

## まとめ

$$
\hat H_{\text{XXZ}} = J\sum_j\big(\hat S^x_j\hat S^x_{j+1} + \hat S^y_j\hat S^y_{j+1} + \Delta \hat S^z_j \hat S^z_{j+1}\big)
$$

1. **昇降演算子の形：**$\hat S^{\pm} = \hat S^x \pm i\hat S^y$ により、横方向の結合は $\tfrac12(\hat S^+_j\hat S^-_{j+1} + \text{h.c.})$——ホッピング項——になります。
2. **単一サイトの代数：**$\{\hat S^+_i,\hat S^-_i\} = 1$ と $(\hat S^\pm_i)^2 = 0$ はすでにフェルミオン的であり、異なるサイト間の関係（$[\hat S^+_i,\hat S^-_j] = 0$ 対 $\{\hat c^\dagger_i,\hat c_j\}=0$）だけが食い違います。
3. **状態の写像：**$\lvert\downarrow\rangle \to \lvert 0\rangle$、$\lvert\uparrow\rangle\to\lvert1\rangle$ により、$\hat S^z_j = \hat n_j - \tfrac12$ が得られます。
4. **Jordan–Wigner：**左側のフェルミオンパリティを数える非局所ストリング $\hat P_j = \prod_{l<j}(-2\hat S^z_l)$ を付加します。これは、局所的な写像では供給できない交換の符号をちょうど与えます。
5. **結果：**相互作用するスピンレスフェルミオンが得られ、最近接ボンドではストリングが相殺します。
6. **$U(1)$：**磁化の保存は粒子数の保存になり、固有状態は $N$ でラベル付けされ、$\hat H$ はブロック対角化されます。

$$
\hat H = \frac{J}{2}\sum_j \big(\hat c^\dagger_j \hat c_{j+1} + \text{h.c.}\big) + J\Delta\sum_j\big(\hat n_j - \tfrac12\big)\big(\hat n_{j+1}-\tfrac12\big)
$$
