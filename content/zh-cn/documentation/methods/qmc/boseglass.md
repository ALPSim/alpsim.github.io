---
title: 玻色玻璃 
math: true
weight: 8
---

## 玻色玻璃模型

下面的参数文件设置了一个蒙特卡洛模拟：使用蠕虫程序，在正方晶格上模拟带有随格点变化的随机化学势的量子玻色-Hubbard 模型。化学势取自区间 [-5,+5] 上的均匀分布。

    LATTICE="inhomogeneous square lattice";
    L=4;

    MODEL="boson Hubbard";
    NONLOCAL=0;
    U    = 1.0;
    Nmax = 2;
    t = 1.0;
    T = 0.1;
    delta = 5.0;
    SWEEPS=500000;
    THERMALIZATION=10000;

    { DISORDERSEED = 34275; mu=delta*2*(random()-0.5); }
    { DISORDERSEED = 49802; mu=delta*2*(random()-0.5); }
    { DISORDERSEED = 82529; mu=delta*2*(random()-0.5); }

为了使用周期性边界条件，需要在 `lattice.xml` 文件中修改 inhomogeneous square lattice 的边界类型：

    <LATTICEGRAPH name = "inhomogeneous square lattice">
    <FINITELATTICE>
        <LATTICE ref="square lattice"/>
        <PARAMETER name="W" default="L"/>
        <EXTENT dimension="1" size="L"/>
        <EXTENT dimension="2" size="W"/>
        <BOUNDARY type="periodic"/>
    </FINITELATTICE>
    <UNITCELL ref="simple2d"/>
    <INHOMOGENEOUS><VERTEX/></INHOMOGENEOUS>
    </LATTICEGRAPH>

运行模拟所用的命令序列与蠕虫算法教程中的相同。


