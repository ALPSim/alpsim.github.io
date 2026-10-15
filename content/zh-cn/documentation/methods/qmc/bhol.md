---
title: 光晶格中的玻色子
math: true
---

## 均匀光晶格的能带结构

### 理论

首先，我们考虑最简单的情形，即一个质量为 $m$ 的单粒子处在周期势中：

$$
V(\vec{r}) = \sum_{x_\alpha = x,y,z} V_0^{x_\alpha} \sin^2 (\pi x_\alpha),
$$

其中 $V_0^{x_\alpha}$ 是以反冲能 $E_r^\alpha = \frac{\hbar^2}{2m} \left( \frac{2\pi}{\lambda_\alpha} \right)^2$ 为单位的晶格深度，长度以晶格间距 $\frac{\lambda_\alpha}{2}$ 为单位。

该单粒子的量子力学行为满足：

$$
\left[\frac{1}{\pi^2} \left( -i \nabla + 2\pi \vec{k} \right)^2 + \sum_{x_\alpha = x,y,z} V_0^{x_\alpha} \sin^2 (\pi x_\alpha)\right]  u_k (\vec{r}) = \epsilon_k u_k(\vec{r}),
$$

它显然是可分离变量的，例如其 $x$ 分量为：

$$
\left[\frac{1}{\pi^2} \left( -i \partial_x + 2\pi k_x \right)^2 + V_0^{x} \sin^2 (\pi x)\right]  u_{k_x} (x) = \epsilon_{k_x} u_{k_x}(x),
$$

其中 $k_x = 0, \frac{1}{L_x} ,\cdots \frac{L_x-1}{L_x}$。

在平面波基下：

$$
u_{k_x} (x) = \frac{1}{\sqrt{L_x}} \sum_{m \in \mathbf{Z}}  c_m^{(k_x)} e^{i2m\pi x}.
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

脚本 [`tutorials/optical-lattice-01-bandstructure/bandstructure.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/optical-lattice-01-bandstructure/bandstructure.py) 用于计算上述公式：对每个方向，它对所有 $k_x$ 求解上面的三对角问题，由能带能量 $\epsilon_{k_x}$ 得到 $t$，并对 $|w(x)|^4$ 积分得到 $U$。在该目录下运行以下代码：

```python
import numpy as np
import bandstructure

V0   = np.array([8., 8., 8.])        # 晶格深度（以反冲能为单位）
wlen = np.array([843., 843., 843.])  # 激光波长（以纳米为单位）
a    = 114.8                         # s 波散射长度（以玻尔半径为单位）
m    = 86.99                         # 质量（以原子质量单位为单位）
L    = 200                           # 晶格大小（沿一个方向）

t, U = bandstructure.hubbard_parameters(V0, wlen, a, m, L)

print(t)        # t（单位 nK）：[4.77051684 4.77051684 4.77051684]
print(U)        # U（单位 nK）：38.70187649673881
print(U / t)    # U/t：[8.11272191 8.11272191 8.11272191]
```


## 光晶格势阱中的玻色子

### 玻色-Hubbard 模型

#### 哈密顿量

光晶格势阱中的玻色子可以用单能带玻色-Hubbard 模型有效描述：

$$
\hat{H} = -t \sum_{\langle i,j \rangle} \hat{b}_i^+ \hat{b}_j + \frac{U}{2} \sum_i \hat{n}_i (\hat{n}_i - 1) - \sum_i ( \mu - V_T ( \vec{r}_i) ) \hat{n}_i,
$$

其中跃迁强度为 $t$，在位相互作用强度为 $U$，化学势为 $\mu$，温度为有限温度 $T$，通过有向环随机级数展开（SSE）量子蒙特卡洛程序 `dirloop_sse` 进行模拟。这里 $\hat{b}$（$\hat{b}^+$）是湮灭（产生）算符，$\hat{n}_i$ 是格点 $i$ 上的粒子数算符。光晶格中的玻色子被束缚在三维抛物型势阱中：

$$
V_T (\vec{r}_i) = K_x x_i^2 + K_y y_i^2 + K_z z_i^2,
$$

这来源于高斯光束的束腰以及其他束缚来源。

#### 有限温度

在有限温度 $T$ 下，物理本质上由配分函数所刻画：

$$
Z = \mathrm{Tr} \, \exp \left(-\beta \hat{H} \right),
$$

而诸如局域密度之类的物理量为：

$$
\langle n_i \rangle = \frac{1}{Z} \mathrm{Tr} \hat{n}_i \exp \left(-\beta \hat{H} \right)  = \frac{1}{Z} \sum_{\mathcal{C}} n_i (\mathcal{C}) Z(\mathcal{C}),
$$

其中 $\mathcal{C}$ 是完整构型空间中的某个构型，逆温度 $\beta = 1/T$。这里的单位稍后会巧妙地进行归一化。

### Python 实现

脚本 [`tutorials/optical-lattice-02-density-profile/density_profile.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/optical-lattice-02-density-profile/density_profile.py) 用 `dirloop_sse` 在 $9^3$ 晶格上模拟该模型，并绘制局域密度 $\langle n_i \rangle$。它采用上面能带结构例子中得到的 $U/t = 8.11$、温度 $T = t$，以及以晶格中心为中心的各向同性势阱 $K_x = K_y = K_z = 0.65\,t$。势阱通过 `inhomogeneous simple cubic lattice` 上随格点变化的化学势引入：

```python
import numpy as np
import pyalps

L = 9
K = 0.65                                        # 势阱曲率 V_T = K r^2（以 t 为单位）
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

完整脚本还会绘制穿过势阱中心的剖面以及中心层的密度：

![9^3 晶格上被势阱束缚的玻色子的局域密度](/figs/opticallattice_density_profile.png)

为了让示例在几分钟内运行完毕，晶格取得较小，因此它仍处在原子云内部：密度向边缘递减，但在边缘处并未完全降为零。使用更大的晶格可以使边缘处的密度更接近零。

## 贡献者

- Ping Nang Ma
- Matthias Troyer
