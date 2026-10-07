
---
title: 动力学平均场理论与杂质求解器
math: true
weight: 9
---

## 参数列表

### 物理参数

| **名称** | **说明** |
| :------- | :-------------- |
| U | Hubbard 相互作用 U |
| BETA | 逆温度 |
| MU | 化学势 |
| H | 沿量子化轴（通常为 $z$）方向的磁场（但是：求解器会忽略该变量！） |
| SITES | 杂质格点数（对于 DMFT：1） |
| FLAVORS | 杂质的味/轨道数（通常为 2：自旋向上/向下） |
| t | 对于 Bethe 晶格，它给出跃迁（此时带宽为 $W=4t$，半带宽为 $D=2t$）；若打开选项 TWODBS，则它设定正方或六角晶格上的最近邻跃迁 |
| t0, t1, ... | （目前仅适用于虚时间中的自洽循环）设定多带情形下 Bethe 晶格的跃迁（味 2i 和 2i+1 共用同一参数 ti） |
| J | 多带问题中的耦合 |
| U' | （默认为 U-2J） |
| tprime | 仅在打开选项 TWODBS 且为正方晶格时适用，此时它设定次近邻跃迁 |
| TWODBS | （默认设为正方晶格）可以选择正方晶格或六角晶格 |

### 自洽循环参数 

| **名称** | **说明** |
| :------- | :-------------- |
| OMEGA_LOOP | 设为 1，除非你想使用半圆形态密度（对应于无穷维的 Bethe 晶格） |
| ANTIFERROMAGNET | 若为 1，则采用反铁磁自洽循环（A.Georges 等人 1996 年综述中的公式 97） |
|SYMMETRIZATION | 若为 1，则强制得到顺磁解（在 2.1 之前的版本中：有几处误拼为 SYMMATRIZATION，并且两者都被使用，因此需要把 SYMMETRIZATION 和它设为相同的值） |
| MAX_IT | 自洽循环的最大迭代次数（通常 10-20 次就足够了） |
| CONVERGED | 在达到 MAX_IT 之前停止自洽循环的判据——如果松原表示下格林函数的最大变化小于 CONVERGED，循环将停止 |
| TOLERANCE | （仅用于 hirschfyesim）同上 |
| RELAX_RATE | （默认为 1；目前仅在打开 OMEGA_LOOP 的自洽循环中实现）新的格林函数一般按 RELAX_RATE \* $G_{new}(i\omega_n)$ + (1-RELAX_RATE) \* $G_{old}(i\omega_n)$ 计算，在出现振荡时可能有帮助 |

### 通用参数

| **名称** | **说明** |
| :------- | :-------------- |
| GENERAL_FOURIER_TRANFORMER | 如果使用 OMEGA_LOOP 且晶格不是 Bethe 晶格，请打开此选项 |
| EPS_i (i=0,1,...,FLAVORS-1) | 味 i 的势能平移（GENERAL_FOURIER_TRANSFORMER 所必需） |
| EPSSQ_i (i=0,1,...,FLAVORS-1) | 味 i 的能带结构二阶矩（GENERAL_FOURIER_TRANSFORMER 所必需） |
| DOSFILE | 设定包含态密度的文件名（应有 2 列，分别为能量值和该能量处对应的态密度；要求能量等间距；由于采用 Simpson 积分，要求行数为奇数） |
| TWODBS | 打开二维体系的希尔伯特变换，目前支持正方晶格（含最近邻和次近邻跃迁）和六角晶格（含最近邻跃迁）\[注：可以很容易地添加其他二维晶格\] |
| L | 在 TWODBS 打开时可用的可选参数；定义自洽中积分的线性离散化点数的一半（默认：200） |
| SOLVER | 指定杂质求解器（"Hybridization" 或 "Interaction Expansion"；求解器 "Hirsch-Fye" 存在离散化误差，因此不推荐使用） |

### 初始/最终 Weiss 场参数

| **名称** | **说明** |
| :------- | :-------------- |
| H_INIT | 沿量子化轴（通常为 $z$）方向的磁场，用于计算无相互作用的初始 G0（若未加载） |
| G0OMEGA_INPUT | 指定松原频率 $i\omega_n$ 下 Weiss 场的文本文件名（应有 1+FLAVORS 列，共 NMATSUBARA 行，仅与 OMEGA_LOOP 一起使用） |
| G0TAU_INPUT | 指定虚时间表示下 Weiss 场的文本文件名（应有 1+FLAVORS 列，共 $N+1$ 行，仅在 OMEGA_LOOP 关闭时使用） |
| GOMEGA_input | 指定写入松原表示下初始 G0 的文本文件名（默认不写出，因为它与 G0_omega_1 相同） |
| G0TAU_input | 用于输出虚时间下初始 G0 的文本文件名（默认不写出，因为它与 G0_tau_1 相同） |
| G0OMEGA_output | 包含松原频率下最终 Weiss 场的输出文件名（默认为 G0omega_output）（与 OMEGA_LOOP 一起使用） |
| G0TAU_output | 包含松原频率下最终 Weiss 场的输出文件名（默认为 G0tau_output）（OMEGA_LOOP 关闭时） |
| INSULATING | 如果指定了此选项，初始 G0 将按绝缘极限设定 |

### 设定格林函数和 Weiss 场表示精度的参数

| **名称** | **说明** |
| :------- | :-------------- |
| NMATSUBARA | 用于表示格林函数和 Weiss 场的松原频率数目（通常等于 N） |
| N | 虚时间中格林函数和 Weiss 场的分格（bin）数（共用 N+1 个值表示）（推荐：对连续时间求解器取约 1000） |

### 杂化展开杂质求解器参数

| **名称** | **说明** |
| :------- | :-------------- |
| MAX_TIME | 设定求解杂质问题所用的最长时间，单位为秒（基本上就是设定单次迭代的时长） |
| SWEEPS | 计算中希望执行的扫描次数（建议：设得非常大，例如 $10^9$，求解器将在 MAX_TIME 给出的时间限制处停止） |
| THERMALIZATION | 在蒙特卡洛测量之前、为使构型接近平衡所进行的扫描次数（约为 1000 量级） |
| EPSSQAV | 能带结构的二阶矩（如果你指定了自己的 DOSFILE，则必须设置） |
| N_ORDER | 设定直方图大小（若杂化阶数更大，则不会存入直方图）（取 100 量级的值可能比较合理） |
| N_MEAS | 两次测量之间的蒙特卡洛步数（约为 10000 量级） |
| N_SHIFT | 单个蒙特卡洛步中链段平移的次数（似乎未被使用，因此设为 0） |
| MEASURE_FOURPOINT | 若打开，则测量四点关联函数 |
| N4point | （仅在 MEASURE_FOURPOINT 打开时使用）目前暂无说明 |
| CHECKPOINT | 检查点文件以及最终 h5 和 xml 输出的文件名前缀 |

### 相互作用展开1杂质求解器参数 

| **名称** | **说明** |
| :------- | :-------------- |
| MAX_TIME | 设定求解杂质问题所用的最长时间，单位为秒 |
| SWEEPS | 计算中希望执行的扫描次数（建议：设得非常大，例如 $10^9$，求解器将在 MAX_TIME 给出的时间限制处停止） |
| THERMALIZATION | 在蒙特卡洛测量之前、为使构型接近平衡所进行的扫描次数（约为 1000 量级） |
| SWEEP_MULTIPLICATOR | （默认：1） |
| NRUNS | （默认：1） |
| ALPHA | |
| RECALC_PERIOD | （默认：5000） |
| MEASUREMENT_PERIOD | （默认：200） |
| CONVERGENCE_CHECK_PERIOD | （有默认值） |
| ALMOSTZERO | （默认：$10^{-16}$） |
| NSELF | （默认：10N） |
| NMATSUBARA_MEASUREMENTS | （默认：NMATSUBARA） |
| HISTOGRAM_MEASUREMENT | （默认：false） |
| GET_COMPACTED_MEASUREMENTS | |
| ATOMIC | |
| TAU_DISCRETIZATION_FOR_EXP | |
| CHECKPOINT | 检查点文件以及最终 h5 和 xml 输出的文件名前缀 |

### 其他参数 

| **名称** | **说明** |
| :------- | :-------------- |
| SEED | 伪随机数生成器的随机种子 |
| RNG | 所使用的伪随机数生成器（默认为 "mt19937"），可以切换为 "lagged_fibonacci607" |

## 使用说明

- 关于二分晶格的说明：ANTIFERROMAGNET 选项假定存在类 Neel 序，因此需要二分晶格。注意，在二分晶格上态密度是对称的（除非施加了全局势能平移）。
- 自修订版 6217 起，如果提供了 DOSFILE 或使用了 TWODBS，并且参数 EPS_i、EPSSQ_i、EPSSQAV 均未设置，那么 EPS_i 将被设为归一化 DOS 的一阶矩（对于 TWODBS：0），EPSSQ_i 和 EPSSQAV 将利用所提供的态密度被设为归一化 DOS 的二阶矩（对于 TWODBS：使用硬编码的值）。
- 自修订版 6217 起，可以使用 TWODBS="hexagonal" 来模拟二维六角晶格（仅含最近邻跃迁）。如果 TWODBS 取其他值，则假定为正方晶格。

## 输入/输出文件 

### 以 BASENAME 为前缀的文件：（其中 BASENAME 是参数输入文件的名称）

- BASENAME：由程序 `dmft` 加载的输入文件
- BASENAME.h5：包含按迭代分辨的杂质格林函数 $G(\tau)$ 和虚时间表示下的 Weiss 场 $G^0(\tau)$；如果自洽循环是在松原表示下进行的（即 OMEGA_LOOP 打开），那么还会存储 $G(i\omega_n)$ 和 $G^0(i\omega_n)$。自能并不直接存储在其中，但可以很容易地通过 Dyson 方程得到（参见 DMFT-01 An introduction to DMFT）

### 松原表示下的输出/输入文件：（由 NMATSUBARA 行组成的文本文件，每行对应一个松原频率） 

- G_omega_i (G0_omega_i)：包含第 i 次迭代后松原频率下格林函数（Weiss 场）的虚部；每行先是 $\omega_n$，接着是每个味的格林函数（Weiss 场）虚部；因此文件共有 1+FLAVORS 列
- G_omegareal_i (G0_omegareal_i)：与上面相同，但为实部
- selfenergy_i：包含第 i 次迭代后的自能；每行先是 $\omega_n$，接着是每个味的自能实部和虚部；因此文件共有 1+2FLAVORS 列
- G0omega_output（除非通过变量 G0OMEGA_output 另行指定）：包含 n（对应于 $\omega_n=\frac{(2n+1)\pi}{\beta})$，接着是每个味的复数 Weiss 场；因此先是一列整数，接着是 FLAVORS 列复数，每个复数由括号中的实部和虚部给出
- G0OMEGA_INPUT：指定松原表示下初始 Weiss 场输入文件的变量；要求格式与上述输出文件相同；因此可以复制该输出文件并以此开始一次模拟

### 虚时间表示下的输出/输入文件：（由 $N+1$ 行组成的文本文件，每行对应一个虚时间 $\in\langle 0,\beta\rangle$）

- G_tau_i (G0_tau_i)：包含第 i 次迭代后的（实）格林函数（Weiss 场）；每行先是 $\tau_n$，接着是每个味的格林函数（Weiss 场）；因此文件共有 1+FLAVORS 列 
- G0tau_output（除非通过变量 G0TAU_output 另行指定）：包含 n（对应于 $\tau_n=\frac{n}{N}\beta$），接着是每个味的复数 Weiss 场；因此先是一列整数，接着是 FLAVORS 列复数，每个复数由括号中的实部和虚部给出；共 $N+1$ 行
- G0OMEGA_INPUT：指定虚时间表示下初始 Weiss 场输入文件的变量；要求格式与上述输出文件相同；因此可以复制该输出文件并以此开始一次模拟

### 以可选变量 CHECKPOINT 为前缀的输出文件：

- CHECKPOINT.h5：包含每次迭代的测量结果
- CHECKPOINT.xml：包含输入参数和运行信息
- CHECKPOINT.run\*：包含重新运行模拟所需的信息（这些才是真正的检查点）；每个进程各一个

### 杂化展开杂质求解器的输出文件：（文本文件） 

- overlap：第 i 行包含第 i 次迭代中的 $\langle n_\downarrow n_\uparrow\rangle$ 
- matrix_size：


## 参考文献

- DMFT 综述：A. Georges, G. Kotliar, W. Krauth, and M. J. Rozenberg, Dynamical mean-field theory of strongly correlated fermion systems and the limit of infinite dimensions, Rev. Mod. Phys. 68, 13 (1996).
- 关于杂化展开杂质求解器：P. Werner and A. J. Millis, Hybridization expansion impurity solver: General formulation and application to Kondo lattice and two-orbital models, Phys. Rev. B 74, 155107 (2006).
