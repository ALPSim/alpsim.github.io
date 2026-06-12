---
linkTitle: 经典蒙特卡洛
title: 经典蒙特卡洛模拟
description: "二维伊辛模型的相变"
weight: 2
math: true
---

二维伊辛模型是统计力学中最重要的模型之一。它描述了正方格子上的自旋，每个自旋只能向上或向下，相邻自旋之间存在铁磁耦合 $J > 0$（采用 `spinmc` 默认的经典符号约定，其中正 $J$ 有利于平行自旋）。Onsager 于 1944 年证明该模型存在精确解，并在 $T_c = 2J / \ln(1 + \sqrt{2}) \approx 2.269\, J/k_B$ 处发生相变：低于 $T_c$ 时自旋自发有序，高于 $T_c$ 时热涨落破坏有序态。

本教程使用 ALPS 模拟这一相变。由于其物理图像已被充分理解，结果易于验证，因此是很好的入门示例。

{{< callout type="info" >}}
本教程假设 pyalps 已完成安装。如果尚未安装，请参阅[入门指南](../)。
{{< /callout >}}

## 导入包

`pyalps` 提供模拟框架和分析工具，`matplotlib` 与 `pyalps.plot` 用于可视化。

```python
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot
```

## 设置参数

我们模拟三种尺寸的正方格子——$4\times 4$、$8\times 8$ 和 $16\times 16$——覆盖一定的温度范围。运行多个系统尺寸可以观察到相变随系统增大而趋近热力学极限时的变化。

每次运行的参数以字典列表的形式收集：

```python
parms = []
for l in [4, 8, 16]:
    for t in [5.0, 4.5, 4.0, 3.5, 3.0, 2.9, 2.8, 2.7]:
        parms.append({
            'LATTICE'        : "square lattice",
            'T'              : t,
            'J'              : 1,
            'THERMALIZATION' : 1000,
            'SWEEPS'         : 400000,
            'UPDATE'         : "cluster",
            'MODEL'          : "Ising",
            'L'              : l,
        })
    for t in [2.6, 2.5, 2.4, 2.3, 2.2, 2.1, 2.0, 1.9, 1.8, 1.7, 1.6, 1.5, 1.2]:
        parms.append({
            'LATTICE'        : "square lattice",
            'T'              : t,
            'J'              : 1,
            'THERMALIZATION' : 1000,
            'SWEEPS'         : 40000,
            'UPDATE'         : "cluster",
            'MODEL'          : "Ising",
            'L'              : l,
        })
```

几个关键参数说明：

- **`THERMALIZATION`**：每次运行开始时丢弃的蒙特卡洛扫描步数，用于让系统在开始测量前达到热平衡。
- **`SWEEPS`**：热化后的测量扫描步数，步数越多统计误差越小。高温时使用较多步数（$400\,000$），临界温度附近及以下使用较少步数（$40\,000$）。
- **`UPDATE: "cluster"`**：选择 Wolff 团簇算法，而非单自旋翻转的 Metropolis 算法。在 $T_c$ 附近，单自旋翻转更新会遭遇*临界慢化*——由于自旋关联长度发散，模拟效率极低。团簇算法一次翻转整个关联自旋域，从而在很大程度上避免了这一问题。
- **`L`**：格子的线性尺寸，`L = 8` 表示 $8 \times 8 = 64$ 个自旋。

温度网格在远离 $T_c$ 处较稀疏，在相变发生的 $1.2$–$2.7$ 范围内较密集。

## 运行模拟

`writeInputFiles` 将参数列表转换为 ALPS 所需的 XML 输入格式并写入磁盘，`runApplication` 随后启动 `spinmc` 可执行程序。参数 `Tmin=5` 指定每次运行至少使用 5 秒的 CPU 时间。

```python
input_file = pyalps.writeInputFiles('parm7a', parms)
pyalps.runApplication('spinmc', input_file, Tmin=5)
```

## 评估与绘图

`evaluateSpinMC` 对原始模拟输出进行后处理，计算磁化率和 Binder 累积量等派生量。`loadMeasurements` 将结果读回 Python，`collectXY` 将其整理为以系统尺寸为参数的 $|m|$ 对 $T$ 的曲线。

```python
pyalps.evaluateSpinMC(pyalps.getResultFiles(prefix='parm7a'))

# 加载磁化强度作为温度的函数
data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm7a'), ['|Magnetization|'])
magnetization_abs = pyalps.collectXY(data, x='T', y='|Magnetization|', foreach=['L'])

# 绘图
plt.figure()
pyalps.plot.plot(magnetization_abs)
plt.xlabel('温度 $T$')
plt.ylabel('磁化强度 $|m|$')
plt.title('二维伊辛模型')
plt.show()
```

磁化强度从低温时的近似 1 下降至 $T_c \approx 2.269$ 以上的 0。对于小系统，相变受有限尺寸效应影响而变得平缓；随着 $L$ 增大，相变逐渐变陡并趋近精确的 $T_c$：

![二维伊辛模型的磁化强度与温度关系](/figs/Ising_2D_m.png)


## 演示视频

<br>

{{< youtube id="3_4WCeKDtKc" >}}
