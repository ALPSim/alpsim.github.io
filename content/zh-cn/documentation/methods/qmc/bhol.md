---
title: 光晶格中的玻色子
math: true
---

## 均匀光晶格的能带结构

### 理论

首先，我们考虑最简单的情形，即一个质量为 $m$ 的单粒子处在周期势 $V(\vec{r})$ 中，其中

$$
V(\vec{r}) = \sum_{x_\alpha = x,y,z} V_0^{x_\alpha} \sin^2 (\pi x_\alpha)
$$

这里以反冲能 $E_r^\alpha = \frac{\hbar^2}{2m} \left( \frac{2\pi}{\lambda_\alpha} \right)^2$ 为能量单位，以 $\frac{\lambda_\alpha}{2}$ 为晶格间距。

该单粒子的量子力学行为满足

$$
\left[\frac{1}{\pi^2} \left( -i \nabla + 2\pi \vec{k} \right)^2 + \sum_{x_\alpha = x,y,z} V_0^{x_\alpha} \sin^2 (\pi x_\alpha)\right]  u_k (\vec{r}) = \epsilon_k u_k(\vec{r})
$$

它显然是可分离变量的，例如其 $x$ 分量为：

$$
\left[\frac{1}{\pi^2} \left( -i \partial_x + 2\pi k_x \right)^2 + V_0^{x} \sin^2 (\pi x)\right]  u_{k_x} (x) = \epsilon_{k_x} u_{k_x}(x),
$$

其中 $k_x = 0, \frac{1}{L_x} ,\cdots \frac{L_x-1}{L_x}$。

在平面波基下，

$$
u_{k_x} (x) = \frac{1}{\sqrt{L_x}} \sum_{m \in \mathbf{Z}}  c_m^{(k_x)} e^{i2m\pi x} 
$$

我们得到一个三对角矩阵的对角化问题：

$$
\left[  4(m + k_x)^2 + \frac{V_0^x}{2} \right] c_m^{(k_x)} - \frac{V_0^x}{4} c_{m-1}^{(k_x)} - \frac{V_0^x}{4} c_{m+1}^{(k_x)}  = \epsilon_{k_x}  c_m^{(k_x)}.
$$

Wannier 函数定义为：

$$
w(x) = \frac{1}{\sqrt{L_x}} \sum_{k_x} u_{k_x} (x) e^{i 2\pi k_x x} = \frac{1}{L_x} \sum_{k_x} \sum_{m \in \mathbf{Z}} c_m^{(k_x)} e^{i 2\pi (m+k_x) x}, 
$$

由此可以计算在位相互作用：

$$
U = g \int | w(x) |^4 dx = \frac{4 \pi a_s \hbar^2}{m}  \int | w(x) |^4 dx.
$$

经过简单的代数运算，得到跃迁强度：

$$
t = -\frac{1}{L_x} \sum_{k_x} \epsilon_{k_x} e^{-i2\pi k_x}.
$$

最后，Wannier 函数的傅里叶变换为：

$$
\tilde{w}(q_x) = \frac{1}{\sqrt{L_x}} \int w(x) e^{-i2\pi q_x x} dx  = \frac{1}{\sqrt{L_x}} \sum_{k_x} \sum_{m \in \mathbf{Z}} c_m^{(k_x)} \delta_{q_x, k_x+m}.
$$

### Python 实现

#### 一个例子

例如：

    import numpy;
    import pyalps.dwa;

    V0   = numpy.array([8. , 8. , 8.]);      # in recoil energies
    wlen = numpy.array([843., 843., 843.]);  # in nanometer
    a    = 114.8;                            # s-wave scattering length in bohr radius
    m    = 86.99;                            # mass in atomic mass unit
    L    = 200;                              # lattice size (along 1 direction)

    band = pyalps.dwa.bandstructure(V0, wlen, a, m, L);

先大致看一下能带结构：

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

$t(nK)$、$U(nK)$ 和 $U/t$ 的值可以通过以下方式获得：

    >>> numpy.array(band.t())
    array([ 4.77050984,  4.77050984,  4.77050984])
    >>>
    >>> numpy.array(band.U())
    array(38.7018197381118)
    >>>
    >>> numpy.array(band.Ut())
    array([ 8.11272192,  8.11272192,  8.11272192])

在动量（$\vec{q}$）空间中，$x$ 方向上（模平方的）Wannier 函数 $|\tilde{w}(\vec{q})|^2$ 可以通过以下方式获得：

    >>> numpy.array(band.q(0))
    array([-5.   , -4.995, -4.99 , ...,  5.985,  5.99 ,  5.995])
    >>> 
    >>> numpy.array(band.wk2(0))
    array([  7.57249518e-15,   7.88189086e-15,   8.20434507e-15, ...,
         1.62988573e-18,   1.56057426e-18,   1.49429285e-18])
         
将索引 0 分别替换为 1 和 2，即可得到 $y$ 或 $z$ 方向的结果。


## 光晶格势阱中的玻色子

### 玻色-Hubbard 模型

#### 哈密顿量

光晶格势阱中的玻色子可以用单能带玻色-Hubbard 模型有效描述

$$
\hat{H} = -t \sum_{\langle i,j \rangle} \hat{b}_i^+ \hat{b}_j + \frac{U}{2} \sum_i \hat{n}_i (\hat{n}_i - 1) - \sum_i ( \mu - V_T ( \vec{r}_i) ) \hat{n}_i
$$

其中跃迁强度为 $t$，在位相互作用强度为 $U$，化学势为 $\mu$，温度为有限温度 $T$，通过以有向蠕虫算法实现的量子蒙特卡洛进行模拟。这里 $\hat{b}$（$\hat{b}^+$）是湮灭（产生）算符，$\hat{n}_i$ 是格点 $i$ 上的粒子数算符。光晶格中的玻色子是被束缚的，例如处在三维抛物型势阱中，即

$$
V_T (\vec{r}_i) = K_x x_i^2 + K_y y_i^2 + K_z z_i^2,
$$

这来源于高斯光束的束腰以及其他束缚来源。

#### 有限温度

在有限温度 $T$ 下，物理本质上由配分函数

$$
Z = \mathrm{Tr} \, \exp \left(-\beta \hat{H} \right)
$$

所刻画，而诸如局域密度之类的物理量

$$
\langle n_i \rangle = \frac{1}{Z} \mathrm{Tr} \hat{n}_i \exp \left(-\beta \hat{H} \right)  = \frac{1}{Z} \sum_{\mathcal{C}} n_i (\mathcal{C}) Z(\mathcal{C})
$$

则对完整构型空间中的构型 $\mathcal{C}$ 求和得到，其中逆温度 $\beta = 1/T$。这里的单位稍后会巧妙地进行归一化。

## 贡献者

- Ping Nang Ma
- Matthias Troyer
