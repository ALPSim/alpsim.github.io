---
title: DMRG-07 简介
weight: 1
math: true
toc: true
---

在本系列教程中，我们将重新审视前面模块中见过的海森堡链，但这次从无自旋费米子的视角进行分析。这里我们关注 XXZ 海森堡模型，并通过 Jordan–Wigner 变换将其翻译成无自旋费米子的语言。在本系列中我们将看到，两种语言描述的是同一个系统，只是各自可用的对称性不同，因而根据研究对象的不同，其中一种语言会比另一种更为合适。

---

## XXZ 哈密顿量

出发点是具有最近邻耦合 $J$ 和各向异性 $\Delta$ 的各向异性海森堡（XXZ）链：

$$
\boxed{\;\hat H \;=\; J\sum_{j=1}^{L}\Big(\hat S^x_j \hat S^x_{j+1} \;+\; \hat S^y_j \hat S^y_{j+1} \;+\; \Delta\, \hat S^z_j \hat S^z_{j+1}\Big)\;}
$$

和以前一样，每个格点的局域希尔伯特空间是二维的，$\{\lvert\uparrow\rangle,\lvert\downarrow\rangle\}$，因此完整希尔伯特空间的维数为 $2^L$。有几个值得记住的特殊情形，可以用来进一步检验我们的 DMRG 算法：

| $\Delta$ | 名称 | 说明 |
|---|---|---|
| $0$ | XX 模型 | 后面将看到对应于*自由*费米子 |
| $1$ | 各向同性海森堡模型 | 具有 $SU(2)$ 对称性 |
| $\to\infty$ | Ising 极限 | 经典、有序 |

现在我们照例定义升降算符，把上述哈密顿量写成解析上更顺手的形式：

$$
\hat S^{\pm}_j \;=\; \hat S^x_j \pm i\,\hat S^y_j
\qquad\Longleftrightarrow\qquad
\hat S^x_j = \tfrac{1}{2}\big(\hat S^+_j + \hat S^-_j\big), \quad
\hat S^y_j = \tfrac{1}{2i}\big(\hat S^+_j - \hat S^-_j\big).
$$

注意 $(\hat S^+)^\dagger = \hat S^-$，也就是说升降算符与 $\hat S^z$ 不同，**不是**厄米算符。这是第一个提示：$\hat S^\pm$ 可以自然地映射为费米子的产生/湮灭算符，而 $\hat S^z_j$ 则是密度的天然候选（下文详述）。目前，我们只是把上述哈密顿量变换为通常的形式：

$$
\boxed{\;\hat H = J\sum_{j=1}^{L}\left[\tfrac{1}{2}\Big(\hat S^+_j \hat S^-_{j+1} + \hat S^-_j \hat S^+_{j+1}\Big) + \Delta\, \hat S^z_j \hat S^z_{j+1}\right]\;}
$$

从物理上解读：第一项把一个翻转的自旋从格点 $j+1$ **移动**到格点 $j$（以及反向移动）——这是一个*跳跃*项。第二项在 $S^z$ 基下是对角的——这是一个*相互作用*项。费米子化将把这一解读变为字面意义上的事实。

---

## 对易与反对易关系
为了充分论证上述类比，我们需要深入研究自旋算符的对易与反对易关系。众所周知，自旋代数由下式给出：

$$
\big[\hat S^a_n,\, \hat S^b_m\big] \;=\; i\,\delta_{nm}\,\sum_c \epsilon_{abc}\, \hat S^c_n .
$$

其中的 $\delta_{nm}$ 是至关重要的结构性事实：**不同格点上的自旋彼此对易。** 它们是*可区分的局域自由度*。

对于自旋-$\tfrac{1}{2}$，任意两个格点上的反对易子为：

$$
\big\{\hat S^a_n,\, \hat S^b_m\big\} \;=\; \tfrac{1}{2}\,\delta_{nm}\,\delta_{ab}\,\hat{\mathbb 1}
\;+\; 2\,\big(1-\delta_{nm}\big)\,\hat S^a_n \hat S^b_m ,
$$

特别地，$\big(\hat S^a_n\big)^2 = \tfrac{1}{4}\hat{\mathbb 1}$。

由上述代数可以得到升降算符的代数：

$$
\big[\hat S^+_i,\, \hat S^-_j\big] = 2\,\delta_{ij}\,\hat S^z_i ,
\qquad
\big[\hat S^z_i,\, \hat S^{\pm}_j\big] = \pm\,\delta_{ij}\,\hat S^{\pm}_i .
$$

第二个关系表明 $\hat S^{\pm}$ 使 $\hat S^z$ 的本征值恰好升高/降低 $1$——它把 $m = -\tfrac12 \to +\tfrac12$，这再一次看起来就像增加或减少一个粒子！

现在是真正弥合类比与定量映射之间鸿沟的关键观察。**单个格点**上的反对易关系揭示了以下事实：

$$
\big\{\hat S^+_i,\, \hat S^-_i\big\} = 2\big(\hat S^{x\,2}_i + \hat S^{y\,2}_i\big) = 2\left(\tfrac14 + \tfrac14\right) = \hat{\mathbb 1},
$$

$$
\big\{\hat S^{\pm}_i,\, \hat S^{\pm}_i\big\} = 2\big(\hat S^{\pm}_i\big)^2 = 0 .
$$

第二行是一个**硬核/排斥条件**：不能把一个自旋-$\tfrac12$ 升两次。将其与我们想要的费米子代数比较：

$$
\big\{\hat c_i,\, \hat c^{\dagger}_j\big\} = \delta_{ij},
\qquad
\big\{\hat c_i,\, \hat c_j\big\} = \big\{\hat c^{\dagger}_i,\, \hat c^{\dagger}_j\big\} = 0 .
$$

在单个格点上，恒等对应 $\hat S^+ \leftrightarrow \hat c^\dagger$、$\hat S^- \leftrightarrow \hat c$ 在**局域上**是完全正确的。注意*在不同格点之间*这个对应会失效：
$$
\big[\hat c^\dagger_i,\, \hat c_j\big] = \hat c^\dagger_i \hat c_j - \hat c_j \hat c^\dagger_i = 2\,\hat c^\dagger_i \hat c_j \;\neq\; 0 .
$$

也就是说，自旋彼此对易，而费米子彼此反对易。具体来讲：交换两个位于远处格点上的自旋翻转不付出任何代价，而交换两个费米子必须付出一个负号。纯粹*局域*的替换永远无法产生这个符号，因为它无从知道两个格点之间存在什么。

> 为了忠实地重现这些对易关系，我们需要通过 *Jordan–Wigner 变换*给产生和湮灭算符附加一个非局域的弦算符。

首先，为了完成我们的动机铺垫，让我们把态空间之间的映射说清楚。

---

## 态的映射：自旋位形 $\to$ 占据数

按照上面的分析，我们可以把两个局域态分别对应为空轨道和占据轨道：

$$
\lvert \downarrow \rangle_j \;\longmapsto\; \lvert 0 \rangle_j, \qquad
\lvert \uparrow \rangle_j \;\longmapsto\; \lvert 1 \rangle_j .
$$

也就是说，"下自旋" $=$ 空格点，"上自旋" $=$ 一个粒子。由于每个格点只能容纳 $0$ 或 $1$ 个粒子而绝不能容纳 $2$ 个，这些粒子自动服从泡利型排斥——这正是前面得到的 $(\hat S^+)^2 = 0$ 在态空间中的表现。如前所述，我们还可以看到：

$$
\boxed{\;\hat S^z_j \;=\; \hat n_j - \tfrac{1}{2} \;=\; \hat c^\dagger_j \hat c_j - \tfrac{1}{2}\;}
$$

注意它对总磁化的直接推论：

$$
\hat S^z_{\text{tot}} = \sum_j \hat S^z_j = \hat N - \frac{L}{2}, \qquad \hat N = \sum_j \hat n_j .
$$

零磁化 $\Leftrightarrow$ 半满填充。

---

## Jordan–Wigner 变换

现在我们介绍 Jordan–Wigner 变换，略去大部分代数细节。补全这些细节是很好的练习，但对我们的目标来说并不太重要。

首先定义格点 $l$ 上的局域宇称算符：

$$
e^{i\pi \hat n_l} \;=\; \hat{\mathbb 1} - 2\hat n_l \;=\; -2\hat S^z_l .
$$

由此可以构造格点 $j$ 的**弦算符**，它就是严格位于 $j$ 左侧所有格点宇称的乘积：

$$
\boxed{\;\hat P_j \;=\; \prod_{l<j} e^{i\pi \hat n_l} \;=\; \prod_{l<j}\big(1 - 2\hat n_l\big) \;=\; \prod_{l<j}\big(-2\hat S^z_l\big)\;}
$$

$\hat P_j$ 测量的是 **$j$ 左侧费米子数目的宇称**：数目为偶时返回 $+1$，为奇时返回 $-1$。它显然是非局域的——依赖于链的整个左半部分——并且满足 $\hat P_j^\dagger = \hat P_j = \hat P_j^{-1}$。

我们所寻求的变换此时已唾手可得，其形式如下：
$$
\boxed{\;
\hat S^+_j = \hat P_j\, \hat c^\dagger_j = \hat c^\dagger_j\,\hat P_j ,
\qquad
\hat S^-_j = \hat P_j\, \hat c_j = \hat c_j \,\hat P_j ,
\qquad
\hat S^z_j = \hat n_j - \tfrac{1}{2}
\;}
$$

（两种排序结果一致，因为 $\hat P_j$ 只包含 $l<j$ 的格点，并且它在费米子算符中是*偶次*的，所以与 $\hat c^{(\dagger)}_j$ 对易。）

利用 $\hat P_j^2 = \hat{\mathbb 1}$ 以及用自旋表示的 $\hat P_j$，可以求出逆变换：

$$
\hat c^\dagger_j = \left[\prod_{l<j}\big(-2\hat S^z_l\big)\right] \hat S^+_j ,
\qquad
\hat c_j = \left[\prod_{l<j}\big(-2\hat S^z_l\big)\right] \hat S^-_j .
$$

因此 $\hat c_j$ *不*只是一个局域自旋翻转：它是"翻转格点 $j$ 上的自旋，并对 $j$ 左侧的每个上自旋乘上 $(-1)$"。注意 $\hat S^z_j$ 不需要弦——它是对角的，不交换任何东西。

### 弦为何能奏效

这里略去大部分代数推导，只指出若干关键事实。承担全部分量的那一个恒等式是：在单个格点上，宇称算符与自旋翻转**反对易**：

$$
\big\{\hat S^z_i,\, \hat S^{\pm}_i\big\} = 0
\qquad\Longleftrightarrow\qquad
\big\{ e^{i\pi\hat n_i},\, \hat S^{\pm}_i \big\} = 0 .
$$

物理上：翻转该格点会*改变*它的宇称，因此翻转与宇称反对易。设 $i<j$，可以看出 $\hat P_j$ 中的每个因子都与 $\hat S_i^-$ 对易，**唯独** $e^{i\pi\hat{n}_i}$ 与其反对易，从而给出：

$$
\big\{\hat c_i,\, \hat c^\dagger_j\big\} = 0 \qquad (i \neq j) . \quad\checkmark
$$

同样的论证给出 $\{\hat c_i,\hat c_j\} = 0$，而在同一格点上，单格点代数已经给出 $\{\hat c_i,\hat c^\dagger_i\} = \{\hat S^-_i,\hat S^+_i\} = \hat{\mathbb 1}$。因此总的来说：

$$
\big\{\hat c_i,\hat c^\dagger_j\big\} = \delta_{ij}, \qquad
\big\{\hat c_i,\hat c_j\big\} = \big\{\hat c^\dagger_i,\hat c^\dagger_j\big\} = 0 .
$$

**这个弦恰好是最小的修正。** 它提供了交换所需的 $(-1)$，并且——由于 $\hat P_j^2 = 1$——不带来任何其他影响。该映射是幺正的，希尔伯特空间保持不变（两种描述下都是 $2^L$ 个态）；我们只是给基重新贴了标签，并重新定义了哪些算符被称为基本算符。

> 代价是排序 $1,2,\dots,L$ 被赋予了物理意义。Jordan–Wigner 变换在一维中之所以自然，正是因为链上"位于其左侧"的含义是明确无歧义的。在更高维中，弦没有标准的路径可循，这就是该技巧无法直接推广的原因。

---

## 映射哈密顿量

### 跳跃项：弦相互抵消

这里同样略去大部分代数步骤。我们关注最近邻键 $\hat S^+_j \hat S^-_{j+1}$ 并代入：

$$
\hat S^+_j \hat S^-_{j+1}
= \big(\hat c^\dagger_j \hat P_j\big)\big(\hat P_j e^{i\pi \hat n_j} \hat c_{j+1}\big)
= \hat c^\dagger_j\, e^{i\pi \hat n_j}\, \hat c_{j+1},
$$

其中 $\hat P_j^2 = \hat{\mathbb 1}$ 消去了来自格点 $l<j$ 的整条弦。仅存的那个宇称因子也随之消失，因为 $\hat c^\dagger_j \hat n_j = \hat c^\dagger_j \hat c^\dagger_j \hat c_j = 0$。于是：

$$
\boxed{\;\hat S^+_j \hat S^-_{j+1} = \hat c^\dagger_j \hat c_{j+1}\;}
\qquad\text{and h.c.}\qquad
\hat S^-_j \hat S^+_{j+1} = \hat c^\dagger_{j+1}\hat c_j .
$$

这正是 Jordan–Wigner 变换不仅正确、而且*有用*的原因：对于**最近邻**项，非局域的弦在两个格点之间相互抵消，一个显然非局域的变换却产生了一个显然局域的哈密顿量。（对于 $|i-j|>1$ 的更长程跳跃项 $\hat S^+_i\hat S^-_j$，弦**不会**抵消——会残留一个 $\prod_{i<l<j}e^{i\pi\hat n_l}$。）

### 相互作用项

由恒等式 $\hat S^z_j = \hat n_j - \tfrac{1}{2}$ 立即得到：

$$
\Delta\,\hat S^z_j \hat S^z_{j+1} = \Delta\left(\hat n_j - \tfrac{1}{2}\right)\left(\hat n_{j+1} - \tfrac{1}{2}\right).
$$

### 无自旋费米子哈密顿量

$$
\boxed{\;
\hat H \;=\; \frac{J}{2}\sum_{j}\Big(\hat c^\dagger_j \hat c_{j+1} + \hat c^\dagger_{j+1}\hat c_j\Big)
\;+\; J\Delta \sum_{j}\left(\hat n_j - \tfrac{1}{2}\right)\left(\hat n_{j+1} - \tfrac{1}{2}\right)
\;}
$$

展开第二项以读出标准格点模型参数：

$$
\hat H = -t\sum_j\Big(\hat c^\dagger_j \hat c_{j+1} + \text{h.c.}\Big) \;+\; V\sum_j \hat n_j \hat n_{j+1} \;-\; \mu \sum_j \hat n_j \;+\; \frac{J\Delta L}{4},
$$

$$
t = -\frac{J}{2}, \qquad V = J\Delta, \qquad \mu = J\Delta .
$$

因此，XXZ 链**就是**一条无自旋费米子链：跳跃振幅为 $J/2$，最近邻相互作用强度为 $J\Delta$。常数项 $J\Delta L/4$ 和化学势移动 $\mu$ 都是 $\hat S^z = \hat n - \tfrac12$ 中那个 $-\tfrac12$ 造成的产物——如果草率地改用泡利矩阵，消失的正是这两项。

**边界上的注意事项。** 对于*自旋*链的周期性边界条件，键 $L \to 1$ 上的弦并不会被抵消：$\hat P_L$ 环绕整个系统，留下一个全局宇称因子 $e^{i\pi \hat N}$。因此，费米子链是周期的还是反周期的，取决于总费米子数 $\hat N$ 是奇还是偶。开放边界条件下则没有这一微妙问题。

---

## $U(1)$ 对称性与粒子数扇区

原始哈密顿量守恒总磁化：

$$
\big[\hat H,\, \hat S^z_{\text{tot}}\big] = 0 ,
$$

因为跳跃项 $\hat S^+_j\hat S^-_{j+1}$ 升高一个自旋的同时降低另一个，使 $\sum_j S^z_j$ 保持不变。通过 $\hat S^z_{\text{tot}} = \hat N - L/2$，这变成了**粒子数**守恒：

$$
\boxed{\;\big[\hat H,\, \hat N\big] = 0, \qquad \hat N = \sum_{j} \hat c^\dagger_j \hat c_j \;}
$$

与之相应的对称性是全局 $U(1)$ 相位转动：

$$
\hat c_j \;\longmapsto\; e^{i\theta}\, \hat c_j , \qquad
\hat c^\dagger_j \;\longmapsto\; e^{-i\theta}\, \hat c^\dagger_j ,
$$

在此变换下 $\hat H$ 的每一项（每个 $\hat c$ 配一个 $\hat c^\dagger$）都保持不变。它由 $\hat N$ 生成：$\hat U(\theta) = e^{i\theta \hat N}$。

**推论。** $\hat H$ 在 $\hat N$ 的本征基下是块对角的。$2^L$ 维希尔伯特空间分解为粒子数固定的各个扇区：

$$
\mathcal{H} = \bigoplus_{N=0}^{L} \mathcal{H}_N , \qquad \dim \mathcal{H}_N = \binom{L}{N}, \qquad \sum_{N=0}^{L}\binom{L}{N} = 2^L ,
$$

并且每个本征态都可以标记为 $\lvert E, N\rangle$。在实践中这带来了巨大的节省：不必对角化一个 $2^L \times 2^L$ 的矩阵，而是分别对角化每个 $\binom{L}{N}\times\binom{L}{N}$ 的块。两种语言之间的对照表如下：

| 自旋语言 | 费米子语言 |
|---|---|
| 总磁化 $S^z_{\text{tot}}$ | 粒子数 $N - L/2$ |
| 零磁化 | 半满填充，$N = L/2$ |
| 完全极化 $\lvert\downarrow\downarrow\cdots\rangle$ | 真空，$N = 0$ |
| 单个磁振子 | 单粒子扇区，$N=1$ |
| 磁振子色散 | 单粒子能带 $\varepsilon_k$ |

（此外还有一个离散的 $\mathbb{Z}_2$ 对称性，即自旋翻转 $\leftrightarrow$ 粒子–空穴变换 $\hat c_j \to \hat c^\dagger_j$，它把扇区 $N$ 映射到 $L-N$，并在半满填充时是 $\hat H$ 的对称性。）

---

## 小结

$$
\hat H_{\text{XXZ}} = J\sum_j\big(\hat S^x_j\hat S^x_{j+1} + \hat S^y_j\hat S^y_{j+1} + \Delta \hat S^z_j \hat S^z_{j+1}\big)
$$

1. **升降算符形式：** $\hat S^{\pm} = \hat S^x \pm i\hat S^y$ 把横向耦合变为 $\tfrac12(\hat S^+_j\hat S^-_{j+1} + \text{h.c.})$——一个跳跃项。
2. **单格点代数：** $\{\hat S^+_i,\hat S^-_i\} = 1$ 和 $(\hat S^\pm_i)^2 = 0$ 已经是费米子式的；只有跨格点的关系（$[\hat S^+_i,\hat S^-_j] = 0$ 与 $\{\hat c^\dagger_i,\hat c_j\}=0$）不一致。
3. **态的映射：** $\lvert\downarrow\rangle \to \lvert 0\rangle$，$\lvert\uparrow\rangle\to\lvert1\rangle$，从而 $\hat S^z_j = \hat n_j - \tfrac12$。
4. **Jordan–Wigner 变换：** 附加非局域弦 $\hat P_j = \prod_{l<j}(-2\hat S^z_l)$，它计数左侧的费米子宇称，恰好提供了局域映射无法产生的交换符号。
5. **结果：** 相互作用的无自旋费米子，弦在最近邻键上相互抵消。
6. **$U(1)$：** 磁化守恒变为粒子数守恒，因此本征态由 $N$ 标记，且 $\hat H$ 块对角化。

$$
\hat H = \frac{J}{2}\sum_j \big(\hat c^\dagger_j \hat c_{j+1} + \text{h.c.}\big) + J\Delta\sum_j\big(\hat n_j - \tfrac12\big)\big(\hat n_{j+1}-\tfrac12\big)
$$
