
---
title: DMFT-03 Interaction
math: true
toc: true
---

## 相互作用展开 CT-INT

用 CT-INT 代码重复教程 02 中的计算是很有启发性的。该代码对相互作用做展开（而不是像 CT-HYB 那样对杂化做展开）。相应的 python 脚本与教程 02 中的非常相似，可以在目录 `tutorials/dmft-03-interaction` 中找到。与 DMFT-02 教程一样，你可以选择简短版脚本 [`tutorial3.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3.py)，它生成 2 个温度点的数据（运行时间约 10 分钟）；也可以选择重现全部 6 条曲线的完整版脚本 [`tutorial3_long.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3_long.py)（约 30 分钟）。结果的分析方式可以与 [DMFT-02 Hybridization](../dmft02) 教程完全相同，使用脚本 [`tutorial3eval.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3eval.py) 即可。
