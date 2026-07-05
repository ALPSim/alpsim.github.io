
---
title: DMFT-07 Hirsch-Fye
math: true
toc: true
---

## Hirsch Fye Code

我们首先运行一个离散时间蒙特卡罗代码：[Hirsch Fye 代码](https://link.aps.org/doi/10.1103/PhysRevLett.56.2521)。作为示例，我们重现 [Georges 等人的 DMFT 综述文章](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)中的图 11。这一系列共六条曲线展示了体系——一个相互作用为 $U=3D/\sqrt{2}$、处于半满情形、格子为贝特格子的 Hubbard 模型——在降温过程中如何进入反铁磁相。

Hirsch Fye 算法在[这里](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)有详细描述，该综述文章也提供了相应代码的开源实现。尽管已经出现了许多改进（例如可参见 Alvarez (2008) 或 [Nukala09](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.80.195111)），但这一算法已被能够消除系统性离散化误差的[连续时间算法](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.76.235123)所取代。

Hirsch Fye 模拟每次迭代大约需要 20 秒。运行此模拟的 python 脚本包括：只在 2 个温度点运行的简短版本 [`tutorial7.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-07-hirschfye/tutorial7.py)（耗时 5 分钟），以及重现全部 6 个温度点的版本 [`tutorial7_long.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-07-hirschfye/tutorial7_long.py)。用于结果分析，你可以像 [DMFT-02 Hybridization](../dmft02) 教程中描述的那样使用相同的脚本 `tutorial2eval.py`，也可以使用脚本 [`tutorial7eval.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-07-hirschfye/tutorial7eval.py)。

主要参数与 [DMFT-02 Hybridization](../dmft02) 教程中描述的相同。

作为一种离散时间方法，HF 会受到 $\Delta\tau$ 离散化误差的影响。请选取一组参数，并对逐渐增大的 $N$ 重复运行。
