
---
title: 光格子中のボソン
math: true
---

## 一様な光格子のバンド構造

### 理論

まずは最も単純な場合、すなわち周期ポテンシャル $V(\vec{r})$ を感じる質量 $m$ の単一粒子を考えます。ここで

$$
V(\vec{r}) = \sum_{x_\alpha = x,y,z} V_0^{x_\alpha} \sin^2 (\pi x_\alpha)
$$

であり、反跳エネルギー $E_r^\alpha = \frac{\hbar^2}{2m} \left( \frac{2\pi}{\lambda_\alpha} \right)^2$ と格子間隔 $\frac{\lambda_\alpha}{2}$ を単位とします。

単一粒子の量子力学的な振る舞いは次の式に従います。

$$
\left[\frac{1}{\pi^2} \left( -i \nabla + 2\pi \vec{k} \right)^2 + \sum_{x_\alpha = x,y,z} V_0^{x_\alpha} \sin^2 (\pi x_\alpha)\right]  u_k (\vec{r}) = \epsilon_k u_k(\vec{r})
$$

これは明らかに変数分離でき、例えば $x$ 成分については

$$
\left[\frac{1}{\pi^2} \left( -i \partial_x + 2\pi k_x \right)^2 + V_0^{x} \sin^2 (\pi x)\right]  u_{k_x} (x) = \epsilon_{k_x} u_{k_x}(x),
$$

となります。ここで $k_x = 0, \frac{1}{L_x} ,\cdots \frac{L_x-1}{L_x}$ です。

平面波基底

$$
u_{k_x} (x) = \frac{1}{\sqrt{L_x}} \sum_{m \in \mathbf{Z}}  c_m^{(k_x)} e^{i2m\pi x} 
$$

を用いると、三重対角行列の対角化問題に帰着します。

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

#### 例

例えば次のようにします。

    import numpy;
    import pyalps.dwa;

    V0   = numpy.array([8. , 8. , 8.]);      # in recoil energies
    wlen = numpy.array([843., 843., 843.]);  # in nanometer
    a    = 114.8;                            # s-wave scattering length in bohr radius
    m    = 86.99;                            # mass in atomic mass unit
    L    = 200;                              # lattice size (along 1 direction)

    band = pyalps.dwa.bandstructure(V0, wlen, a, m, L);

バンド構造をざっと見てみます。

    >>> band

    Optical lattice: 
    ================
    V0    [Er] = 8    8    8    
    lamda [nm] = 843    843    843    
    Er2nK      = 154.89    154.89    154.89    
    L          = 200 
    g          = 5.68473

    Band structure:
    ===============
    t [nK] : 4.77051    4.77051    4.77051    
    U [nK] : 38.7018
    U/t    : 8.11272    8.11272    8.11272    
    
    wk2[0 ,0 ,0 ] : 5.81884e-08
    wk2[pi,pi,pi] : 1.39558e-08

$t(nK)$、$U(nK)$、$U/t$ の値は次のようにして取得できます。

    >>> numpy.array(band.t())
    array([ 4.77050984,  4.77050984,  4.77050984])
    >>>
    >>> numpy.array(band.U())
    array(38.7018197381118)
    >>>
    >>> numpy.array(band.Ut())
    array([ 8.11272192,  8.11272192,  8.11272192])

運動量（$\vec{q}$）空間において、ワニエ関数の（2 乗の）値 $|\tilde{w}(\vec{q})|^2$ は、$x$ 方向については次のようにして得られます。

    >>> numpy.array(band.q(0))
    array([-5.   , -4.995, -4.99 , ...,  5.985,  5.99 ,  5.995])
    >>> 
    >>> numpy.array(band.wk2(0))
    array([  7.57249518e-15,   7.88189086e-15,   8.20434507e-15, ...,
         1.62988573e-18,   1.56057426e-18,   1.49429285e-18])
         
$y$ 方向や $z$ 方向については、インデックス 0 をそれぞれ 1 と 2 に置き換えます。


## 光格子トラップ中のボソン

### ボース・ハバードモデル

#### ハミルトニアン

光格子トラップ中のボソンは、単一バンドのボース・ハバードモデル

$$
\hat{H} = -t \sum_{\langle i,j \rangle} \hat{b}_i^+ \hat{b}_j + \frac{U}{2} \sum_i \hat{n}_i (\hat{n}_i - 1) - \sum_i ( \mu - V_T ( \vec{r}_i) ) \hat{n}_i
$$

によって実効的に記述できます。ここで、ホッピングの強さ $t$、オンサイト相互作用の強さ $U$、化学ポテンシャル $\mu$ を持つ系を、有限温度 $T$ において、有向ワームアルゴリズムとして実装された量子モンテカルロ法で扱います。$\hat{b}$（$\hat{b}^+$）は消滅（生成）演算子、$\hat{n}_i$ はサイト $i$ における数演算子です。光格子中のボソンは、ガウシアンビームのウエストやその他のトラップ源によって、例えば 3 次元の放物型トラップポテンシャル

$$
V_T (\vec{r}_i) = K_x x_i^2 + K_y y_i^2 + K_z z_i^2,
$$

に閉じ込められています。

#### 有限温度

有限温度 $T$ では、物理は本質的に分配関数

$$
Z = \mathrm{Tr} \, \exp \left(-\beta \hat{H} \right)
$$

と、局所密度

$$
\langle n_i \rangle = \frac{1}{Z} \mathrm{Tr} \hat{n}_i \exp \left(-\beta \hat{H} \right)  = \frac{1}{Z} \sum_{\mathcal{C}} n_i (\mathcal{C}) Z(\mathcal{C})
$$

のような物理量によって捉えられます。ここで $\mathcal{C}$ は全配置空間中のある配置、$\beta = 1/T$ は逆温度です。単位については後ほど巧妙に規格化します。

## 貢献者

- Ping Nang Ma
- Matthias Troyer
