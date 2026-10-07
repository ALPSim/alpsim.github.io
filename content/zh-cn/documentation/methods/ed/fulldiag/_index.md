
---
title: 完全对角化 
math: true
weight: 4
---

矩阵的完全对角化是理解小型量子体系的一种有力数值方法，尤其是在需要求量子体系激发态的时候。Lanczos 算法的最后一步也需要对迭代过程结束时形成的小矩阵做完全对角化。

我们将重点讨论两种数值方法：[Jacobi 旋转](jacobi)和[QR 分解](qrfactor)。不过，[ALPS 中的实际计算](implem)是用专门用于线性代数的 [LAPACK 软件包](https://www.netlib.org/lapack/)完成的。

