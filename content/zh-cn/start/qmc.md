---
title: CT-HYB 杂质求解器
linkTitle: CT-HYB
description: "使用 CT-HYB 量子杂质求解器模拟磁性杂质的近藤屏蔽效应。"
weight: 3
math: true
---

{{< callout type="info" >}}
本教程假设 pyalps 已完成安装。如果尚未安装，请参阅[入门指南](../)。
{{< /callout >}}

本教程演示**连续时间杂化展开（CT-HYB）**量子蒙特卡洛求解器——一种针对量子杂质模型的精确、无偏数值方法，由 Werner 等人最初提出（[Phys. Rev. Lett. 97, 076405, 2006](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.97.076405)）。我们模拟**近藤效应**：随着温度降低，传导电子逐渐屏蔽磁性杂质，有效局域磁矩不断减小。无量纲有效磁矩为 $4T\chi_{dd}$，其中 $\chi_{dd}$ 为局域自旋磁化率。在高温下其趋近于 1（自由自旋，$S = 1/2$）；当 Coulomb 相互作用 $U > 0$ 时，低温下它趋向于零，标志着完全近藤屏蔽的出现。我们使用半椭圆态密度作为杂化函数——这是对应 Bethe 格子的标准选择，在动力学平均场理论（DMFT）计算中十分常见。

## 导入模块

```python
from pyalps.hdf5 import archive       # HDF5 存档接口
import pyalps.cthyb as cthyb          # CT-HYB 杂质求解器
import matplotlib.pyplot as plt       # 用于绘制结果
from numpy import exp, log, sqrt, pi  # 数学工具函数
```

## 温度网格

我们生成 11 个温度点（包含两端点），范围从 $T_{\min} = 0.05$ 到 $T_{\max} = 100.0$，在对数尺度上均匀分布，以同时覆盖高温自由自旋区和低温近藤屏蔽区：

```python
N_T  = 11     # 温度点数（包含两端点）
Tmin = 0.05   # 最低温度
Tmax = 100.0  # 最高温度
Tdiv = exp(log(Tmax/Tmin)/(N_T - 1))
T = Tmax
Tvalues = []
for i in range(N_T):
    Tvalues.append(T)
    T /= Tdiv
```

## 模拟参数

我们对比两个 Coulomb 相互作用值：$U = 0$（非相互作用参考）和 $U = 2$（相互作用，近藤区）。关键参数说明：

- **`N_TAU`**：虚时网格点数 $\tau \in [0, \beta]$。必须足够大以分辨最低温度；经验法则为 $N_\tau \geq 5\beta U$。
- **`runtime`**：每次求解器调用的墙钟时间限制（秒）。生产计算中应适当增大以提高统计精度。

```python
Uvalues = [0., 2.]  # 在位 Coulomb 相互作用值
N_TAU   = 1000      # 虚时点数；对最低温度至少满足 5*BETA*U
runtime = 5         # 每个温度点的求解器运行时间（秒）
```

## 构建参数列表

对每组 $U$ 和 $T$ 的组合，我们构建参数字典：

- **`SWEEPS`**：蒙特卡洛移动次数上限。实际上 `MAX_TIME` 会先到达，提前停止求解器。
- **`THERMALIZATION`**：开始测量前丢弃的预热移动次数（平衡化）。
- **`N_MEAS`**：每隔 `N_MEAS` 次扫描记录一次测量。
- **`N_ORBITALS`**：自旋轨道味道数——此处为 2，对应自旋向上和向下。
- **`MU`**：化学势。设为 $U/2$ 以在半满条件下满足粒子-空穴对称性。
- **`BETA`**：逆温度 $\beta = 1/T$。

```python
values     = [[] for u in Uvalues]
errors     = [[] for u in Uvalues]
parameters = []
for un, u in enumerate(Uvalues):
    for t in Tvalues:
        parameters.append(
         {
           # 求解器参数
           'SWEEPS'             : 1000000000,                          # 蒙特卡洛总移动次数（受 MAX_TIME 限制）
           'THERMALIZATION'     : 1000,                                # 平衡化移动次数（丢弃）
           'SEED'               : 42,                                  # 随机数种子
           'N_MEAS'             : 10,                                  # 测量间隔扫描次数
           'N_ORBITALS'         : 2,                                   # 自旋轨道味道数（向上、向下）
           'BASENAME'           : "hyb.param_U%.1f_BETA%.3f"%(u,1/t), # HDF5 输出文件基础名
           'MAX_TIME'           : runtime,                             # 每次求解器调用的墙钟时间限制（秒）
           'VERBOSE'            : 1,                                   # 打印求解器进度
           'TEXT_OUTPUT'        : 0,                                   # 禁用人类可读文本输出
           # 文件名
           'DELTA'              : "Delta_BETA%.3f.h5"%(1/t),           # 杂化函数输入文件
           'DELTA_IN_HDF5'      : 1,                                   # 从 HDF5 读取杂化函数
           # 物理参数
           'U'                  : u,                                   # 在位 Coulomb 排斥
           'MU'                 : u/2.,                                # 化学势（半满）
           'BETA'               : 1/t,                                 # 逆温度
           # 测量
           'MEASURE_nnw'        : 1,                                   # 松原频率上的密度-密度关联函数
           'MEASURE_time'       : 0,                                   # 禁用虚时测量
           # 离散化
           'N_HISTOGRAM_ORDERS' : 50,                                  # 微扰阶直方图最大阶数
           'N_TAU'              : N_TAU,                               # 虚时点数（tau_0=0, tau_{N_TAU}=beta）
           'N_MATSUBARA'        : int(N_TAU/(2*pi)),                   # 松原频率点数
           'N_W'                : 1,                                   # 局域磁化率的玻色子松原频率点数
           # 簿记
           't'                  : 1,                                   # 跳跃振幅（设定能量尺度）
           'Un'                 : un,                                  # Uvalues 的索引（用于后处理）
         }
        )
```

## 杂化函数

CT-HYB 求解器需要杂化函数 $\Delta(\tau)$ 作为输入，它编码了与传导电子浴的耦合。我们使用半带宽 $D = 2t$ 的半椭圆态密度，通过非相互作用格林函数的傅里叶变换计算 $\Delta(\tau) = t^2 G_0(\tau)$。变换前先减去高频尾部以保证数值稳定性，再将其解析地加回。

```python
for parms in parameters:
    ar = archive(parms['BASENAME']+'.out.h5', 'a')
    ar['/parameters'] = parms
    del ar
    print("创建杂化函数...")
    g  = []
    I  = complex(0., 1.)
    mu = 0.0
    for n in range(parms['N_MATSUBARA']):
        w = (2*n+1)*pi/parms['BETA']
        g.append(2.0/(I*w + mu + I*sqrt(4*parms['t']**2 - (I*w+mu)**2)))  # 半椭圆态密度的格林函数
    delta = []
    for i in range(parms['N_TAU']+1):
        tau   = i*parms['BETA']/parms['N_TAU']
        g0tau = 0.0
        for n in range(parms['N_MATSUBARA']):
            iw     = complex(0.0, (2*n+1)*pi/parms['BETA'])
            g0tau += ((g[n] - 1.0/iw)*exp(-iw*tau)).real  # 减去尾部的傅里叶变换
        g0tau *= 2.0/parms['BETA']
        g0tau += -1.0/2.0                                  # 加回尾部贡献
        delta.append(parms['t']**2 * g0tau)                # Delta(tau) = t^2 * G0(tau)

    ar = archive(parms['DELTA'], 'w')
    for m in range(parms['N_ORBITALS']):
        ar['/Delta_%i'%m] = delta
    del ar
```

## 运行求解器

```python
for parms in parameters:
    cthyb.solve(parms)
```

## 后处理与绘图

我们从密度-密度关联函数中提取在零玻色子松原频率处的 $\langle n_\uparrow n_\uparrow \rangle$、$\langle n_\downarrow n_\downarrow \rangle$ 和 $\langle n_\uparrow n_\downarrow \rangle$，计算局域自旋磁化率 $\chi_{dd} = (\langle n_\uparrow n_\uparrow \rangle + \langle n_\downarrow n_\downarrow \rangle - 2\langle n_\uparrow n_\downarrow \rangle)/4$。

```python
for parms in parameters:
    ar      = archive(parms['BASENAME']+'.out.h5', 'a')
    nn_0_0  = ar['simulation/results/nnw_re_0_0/mean/value']
    nn_1_1  = ar['simulation/results/nnw_re_1_1/mean/value']
    nn_1_0  = ar['simulation/results/nnw_re_1_0/mean/value']
    dnn_0_0 = ar['simulation/results/nnw_re_0_0/mean/error']
    dnn_1_1 = ar['simulation/results/nnw_re_1_1/mean/error']
    dnn_1_0 = ar['simulation/results/nnw_re_1_0/mean/error']

    nn  = nn_0_0 + nn_1_1 - 2*nn_1_0
    dnn = sqrt(dnn_0_0**2 + dnn_1_1**2 + (2*dnn_1_0)**2)

    ar['chi']  = nn/4.
    ar['dchi'] = dnn/4.
    del ar

    T = 1/parms['BETA']
    values[parms['Un']].append(T*nn[0])
    errors[parms['Un']].append(T*dnn[0])

plt.figure()
plt.xlabel(r'$T$')
plt.ylabel(r'$4T\chi_{dd}$')
plt.title('Kondo screening of a magnetic impurity\n(CT-HYB hybridization-expansion solver)')
for un in range(len(Uvalues)):
    plt.errorbar(Tvalues, values[un], yerr=errors[un], label="U=%.1f"%Uvalues[un])
plt.xscale('log')
plt.legend()
plt.show()
```

图表显示了 $4T\chi_{dd}$ 随温度（对数坐标）的变化。$U = 0$ 时有效磁矩近似恒定（非相互作用极限）；$U = 2$ 时，有效磁矩在低温下趋向零，证明了传导电子对杂质自旋的近藤屏蔽效应。

![有效局域磁矩随温度变化图，展示近藤屏蔽效应](/figs/Kondo.png)

## 演示视频

<br>
{{< youtube id="uAMQTJmvvts" >}}
