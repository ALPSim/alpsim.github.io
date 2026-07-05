
---
title: DMFT-06 Paramagnet
math: true
toc: true
---

## Paramagnetic metal and extrapolation errors

在本例中，我们使用顺磁自洽方式，模拟贝特格子上相互作用为 $U=3D/\sqrt{2}$、温度为 $\beta =32 \sqrt{2}/D$ 的 Hubbard 模型。我们将计算自能，并将其与 [Georges 等人的 DMFT 综述文章](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)中图 15 的结果进行比较，该图给出了同一体系的 Hirsch-Fye 与精确对角化结果。与 Hirsch-Fye 算法不同，CT-HYB 和 CT-INT 这两种连续时间量子蒙特卡罗算法不存在离散化误差，能够重现精确对角化的结果。

参数文件和 python 脚本位于 ALPS 安装目录下 `tutorials/dmft-06-paramagnet` 目录的子目录 `hyb` 和 `int` 中。你可以通过执行以下命令来运行模拟（杂化展开版本）：

```
python tutorial6a.py
```

以及（相互作用展开版本）：

```
python tutorial6b.py
```

在每次 DMFT 迭代 i 中，自能都会被写入文件 `selfenergy_i`。绘制收敛后的自能，并将结果与 [Georges 等人](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)图 15 的结果进行比较。你也可以像 [DMFT-02 Hybridization](../dmft02) 教程中那样，使用相应的 python 脚本完成这项任务。

警告：在单台工作站上运行这需要很长时间；如果不需要非常高的精度，可以将两次运行的总时间缩短到大约 $2\times 24$ 分钟。
