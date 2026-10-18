
---
title: 光格子中のボソン
math: true
---

## 一様な光格子のバンド構造

### 理論

まずは最も単純な場合、すなわち周期ポテンシャルを感じる質量 $m$ の単一粒子を考えます。

$$
V(\vec{r}) = \sum_{x_\alpha = x,y,z} V_0^{x_\alpha} \sin^2 (\pi x_\alpha),
$$

ここで $V_0^{x_\alpha}$ は反跳エネルギー $E_r^\alpha = \frac{\hbar^2}{2m} \left( \frac{2\pi}{\lambda_\alpha} \right)^2$ を単位とした格子の深さであり、長さは格子間隔 $\frac{\lambda_\alpha}{2}$ を単位とします。

単一粒子の量子力学的な振る舞いは次の式に従います。

$$
\left[\frac{1}{\pi^2} \left( -i \nabla + 2\pi \vec{k} \right)^2 + \sum_{x_\alpha = x,y,z} V_0^{x_\alpha} \sin^2 (\pi x_\alpha)\right]  u_k (\vec{r}) = \epsilon_k u_k(\vec{r}),
$$

これは明らかに変数分離でき、例えば $x$ 成分については

$$
\left[\frac{1}{\pi^2} \left( -i \partial_x + 2\pi k_x \right)^2 + V_0^{x} \sin^2 (\pi x)\right]  u_{k_x} (x) = \epsilon_{k_x} u_{k_x}(x),
$$

となります。ここで $k_x = 0, \frac{1}{L_x} ,\cdots \frac{L_x-1}{L_x}$ です。

平面波基底は次のとおりです。

$$
u_{k_x} (x) = \frac{1}{\sqrt{L_x}} \sum_{m \in \mathbf{Z}}  c_m^{(k_x)} e^{i2m\pi x}.
$$

これを用いると、三重対角行列の対角化問題に帰着します。

$$
\left[  4(m + k_x)^2 + \frac{V_0^x}{2} \right] c_m^{(k_x)} - \frac{V_0^x}{4} c_{m-1}^{(k_x)} - \frac{V_0^x}{4} c_{m+1}^{(k_x)}  = \epsilon_{k_x}  c_m^{(k_x)}.
$$

ワニエ関数は次のように定義されます。

$$
w(x) = \frac{1}{\sqrt{L_x}} \sum_{k_x} u_{k_x} (x) e^{i 2\pi k_x x} = \frac{1}{L_x} \sum_{k_x} \sum_{m \in \mathbf{Z}} c_m^{(k_x)} e^{i 2\pi (m+k_x) x},
$$

そこから、オンサイト相互作用を計算できます。

$$
U = g \int | w(x) |^4 dx = \frac{4 \pi a_s \hbar^2}{m}  \int | w(x) |^4 dx.
$$

少し計算すると、ホッピングの強さが得られます。

$$
t = -\frac{1}{L_x} \sum_{k_x} \epsilon_{k_x} e^{-i2\pi k_x}.
$$

最後に、ワニエ関数のフーリエ変換は次のようになります。

$$
\tilde{w}(q_x) = \frac{1}{\sqrt{L_x}} \int w(x) e^{-i2\pi q_x x} dx  = \frac{1}{\sqrt{L_x}} \sum_{k_x} \sum_{m \in \mathbf{Z}} c_m^{(k_x)} \delta_{q_x, k_x+m}.
$$

### Python による実装

スクリプト [`tutorials/optical-lattice-01-bandstructure/bandstructure.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/optical-lattice-01-bandstructure/bandstructure.py) はこれらの式を評価します。各方向について、すべての $k_x$ に対して上の三重対角問題を対角化し、バンドエネルギー $\epsilon_{k_x}$ から $t$ を求め、$|w(x)|^4$ を積分して $U$ を求めます。そのディレクトリで次を実行してください。

```python
import numpy as np
import bandstructure

V0   = np.array([8., 8., 8.])        # 格子の深さ（反跳エネルギー単位）
wlen = np.array([843., 843., 843.])  # レーザー波長（nm 単位）
a    = 114.8                         # s 波散乱長（ボーア半径単位）
m    = 86.99                         # 質量（原子質量単位）
L    = 200                           # 格子サイズ（1 方向あたり）

t, U = bandstructure.hubbard_parameters(V0, wlen, a, m, L)

print(t)        # t（nK 単位）: [4.77051684 4.77051684 4.77051684]
print(U)        # U（nK 単位）: 38.70187649673881
print(U / t)    # U/t: [8.11272191 8.11272191 8.11272191]
```


## 光格子トラップ中のボソン

### ボース・ハバードモデル

#### ハミルトニアン

光格子トラップ中のボソンは、単一バンドのボース・ハバードモデルによって実効的に記述できます。

$$
\hat{H} = -t \sum_{\langle i,j \rangle} \hat{b}_i^+ \hat{b}_j + \frac{U}{2} \sum_i \hat{n}_i (\hat{n}_i - 1) - \sum_i ( \mu - V_T ( \vec{r}_i) ) \hat{n}_i,
$$

ここで、ホッピングの強さ $t$、オンサイト相互作用の強さ $U$、化学ポテンシャル $\mu$ を持つ系を、有限温度 $T$ において、ディレクテッドループ確率級数展開（SSE）量子モンテカルロコード `dirloop_sse` で扱います。$\hat{b}$（$\hat{b}^+$）は消滅（生成）演算子、$\hat{n}_i$ はサイト $i$ における数演算子です。光格子中のボソンは、3 次元の放物型トラップポテンシャルに閉じ込められています。

$$
V_T (\vec{r}_i) = K_x x_i^2 + K_y y_i^2 + K_z z_i^2,
$$

このトラップは、ガウシアンビームのウエストやその他のトラップ源によるものです。

#### 有限温度

有限温度 $T$ では、物理は本質的に次の分配関数によって捉えられます。

$$
Z = \mathrm{Tr} \, \exp \left(-\beta \hat{H} \right),
$$

局所密度のような物理量は次のように与えられます。

$$
\langle n_i \rangle = \frac{1}{Z} \mathrm{Tr} \hat{n}_i \exp \left(-\beta \hat{H} \right)  = \frac{1}{Z} \sum_{\mathcal{C}} n_i (\mathcal{C}) Z(\mathcal{C}),
$$

ここで $\mathcal{C}$ は全配置空間中のある配置、$\beta = 1/T$ は逆温度です。単位については後ほど巧妙に規格化します。

### Python による実装

スクリプト [`tutorials/optical-lattice-02-density-profile/density_profile.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/optical-lattice-02-density-profile/density_profile.py) は、このモデルを $9^3$ の格子上で `dirloop_sse` によりシミュレーションし、局所密度 $\langle n_i \rangle$ をプロットします。上のバンド構造の例から得た $U/t = 8.11$、温度 $T = t$、格子の中心に置いた等方的なトラップ $K_x = K_y = K_z = 0.65\,t$ を用います。トラップは `inhomogeneous simple cubic lattice` 上のサイトに依存する化学ポテンシャルとして取り込まれます。

```python
import numpy as np
import pyalps

L = 9
K = 0.65                                        # トラップの曲率 V_T = K r^2（t 単位）
c = (L - 1) / 2.

parms = [{
    'LATTICE' : 'inhomogeneous simple cubic lattice',
    'L'       : L,
    'MODEL'   : 'boson Hubbard',
    'Nmax'    : 4,
    't'       : 1.,
    'U'       : 8.11,
    'mu'      : '4.05 - %g*((x-%g)*(x-%g) + (y-%g)*(y-%g) + (z-%g)*(z-%g))' % ((K,) + (c,) * 6),
    'T'       : 1.,
    'THERMALIZATION' : 1000,
    'SWEEPS'         : 5000,
    'MEASURE_LOCAL[Local Density]' : 'n',
}]

input_file = pyalps.writeInputFiles('parm_trap', parms)
pyalps.runApplication('dirloop_sse', input_file)

data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm_trap'), 'Local Density')[0][0]
n = np.asarray(data.y.mean).reshape(L, L, L)
print('Total number of bosons: %.2f' % n.sum())
print('Density at the trap center: %.3f' % n[L // 2, L // 2, L // 2])
```

完全なスクリプトでは、トラップ中心を通る断面と、中心層の密度もプロットします。

![9^3 格子上のトラップされたボソンの局所密度](/figs/opticallattice_density_profile.png)

例が数分で実行できるように格子を小さくしているため、格子はまだ原子雲の内側に収まっています。密度は端に向かって減少しますが、端で完全には消えません。より大きな格子を用いると、端での密度はゼロにより近づきます。

## 貢献者

- Ping Nang Ma
- Matthias Troyer

