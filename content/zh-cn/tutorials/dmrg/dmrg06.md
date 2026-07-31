
---
title: DMRG-06 Correlations
math: true
toc: true
---

## 关联函数

多体物理中最重要的关联函数是两点关联函数，即涉及两个格点 $i$ 和 $j$ 的关联函数，例如 $\langle S^+_i S^-_j \rangle$。短程关联函数决定能量（在关联物理学的典型短程哈密顿量中），长程关联函数决定关联长度。

### 再谈每键能量

如 [DMRG-02](../dmrg02) 中已提到的，自旋-1/2 和自旋-1 链的每键基态能量均由下式给出：

$$
e_0(i) = \frac{1}{2} (\langle S^+_i S^-_{i+1}\rangle  + \langle S^-_i S^+_{i+1}\rangle ) + \langle S^z_i S^z_{i+1} \rangle.
$$

这给出了每条键各自的能量，但我们感兴趣的是热力学极限，在那里所有键处于等同地位，因此除非存在某种物理上的平移对称性破缺，否则它们应具有相同的能量。显然，最接近这种渐近行为的键是链中心处的键，因此直接的方法是计算 $e_0(L/2)$，先对固定 $L$ 在 $D$ 方向外推，再固定 $D$ 后对 $L$ 外推。在此之前，对若干不太小的 $D$ 和 $L$ 值绘制 $e_0(i)$ 关于 $i$ 的图（作为检查程序的手段，你也可以先分别考虑三个贡献项，再求和）。

对于自旋-1/2 链，键能量在奇数键和偶数键之间强烈振荡。这是因为由于临界性，开放端的影响被感受得非常强烈，而且自旋-1/2 链处于二聚化的边缘，即基态平移对称性自发破缺至周期为 2 的边缘。因此，更有意义的做法是外推一条强键和一条弱键的平均能量：这样可以立即获得很高的精度。这再次说明，通过考虑各种局域（或在这里几乎是局域的）可观测量，仔细审视 DMRG 的实际输出是很有价值的。

### 自旋-自旋关联：自旋-1/2

取一条较长的链（例如 $L=192$），并对各个增大的 $D$ 值计算 $\langle S^z_i S^z_j \rangle$。

现在绘制 $C_l = \langle S^z_{L/2-l/2} S^z_{L/2+l/2} \rangle$，其中格点位置取整使其距离为 $l$。这样做的目的是将关联函数以链中心为中心，以尽量减小边界效应。还有其他方法，例如对相同格点距离（也大致以中心为基准）的多个关联函数取平均。由于我们预期幂律行为的临界指数 $\eta=1$（见 [DMRG-02](../dmrg02)），使用双对数图，其中应取绝对值或消去反铁磁因子 $(-1)^l$。

你应该看到，在短距离上是幂律行为，但在较大距离处出现更快（实际上是指数）的衰减。这有两个原因：（i）有限系统尺寸截断了幂律关联；但由于我们选取了较大的系统尺寸，这应该影响不大。（ii）DMRG 的算法结构实际上产生的关联函数是至多 $D^2$ 个纯指数衰减的叠加，因此只能通过这种叠加来模拟幂律行为——在大距离处，衰减最慢的指数将占主导地位，以指数衰减取代幂律衰减。$D$ 越大，这一交叉出现得越晚。

#### 使用参数文件

以下参数文件 [`spin_one_half`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-04-correlations/spin_one_half) 将为我们设置此次运行（同样，为便于说明，我们使用比上面实际数字更小的系统和态数目）。在本例中，我们考虑长度 $L=32$ 的链，设置具有不同态数目 $D$ 的多次运行。使用 6 次扫描。确保关联函数看起来是对称的：

    LATTICE="open chain lattice"
    MODEL="spin"
    CONSERVED_QUANTUMNUMBERS="N,Sz"
    Sz_total=0
    SWEEPS=6
    J=1
    NUMBER_EIGENVALUES=1
    MEASURE_AVERAGE[Magnetization]=Sz
    MEASURE_AVERAGE[Exchange]=exchange
    MEASURE_LOCAL[Local magnetization]=Sz
    MEASURE_CORRELATIONS[Diagonal spin correlations]=Sz
    MEASURE_CORRELATIONS[Offdiagonal spin correlations]="Splus:Sminus"
    L=32
    { MAXSTATES=20 }
    { MAXSTATES=40 }
    { MAXSTATES=60 }

    parameter2xml spin_one_half
    dmrg --write-xml spin_one_half.in.xml

#### 使用 Python

脚本 [`spin_one_half.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-04-correlations/spin_one_half.py) 设置了三次具有不同态数目 $D$ 的运行并加载结果：

    import pyalps
    import numpy as np
    import matplotlib.pyplot as plt
    import pyalps.plot
    parms = []
    for D in [20,40,60]:
        parms.append( { 
            'LATTICE'                               : 'open chain lattice', 
            'MODEL'                                 : 'spin',
            'CONSERVED_QUANTUMNUMBERS'              : 'N,Sz',
            'Sz_total'                              : 0,
            'J'                                     : 1,
            'SWEEPS'                                : 6,
            'NUMBER_EIGENVALUES'                    : 1,
            'L'                                     : 32,
            'MAXSTATES'                             : D,
            'MEASURE_AVERAGE[Magnetization]'        : 'Sz',
            'MEASURE_AVERAGE[Exchange]'             : 'exchange',
            'MEASURE_LOCAL[Local magnetization]'    : 'Sz',
            'MEASURE_CORRELATIONS[Diagonal spin correlations]'      : 'Sz',
            'MEASURE_CORRELATIONS[Offdiagonal spin correlations]'   : 'Splus:Sminus'
            } )
            
    input_file = pyalps.writeInputFiles('parm_spin_one_half',parms)
    res = pyalps.runApplication('dmrg',input_file,writexml=True)
    
    data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'))

现在我们可以提取例如 $\langle S^z_iS^z_j\rangle$ 关联：

    curves = []
    for run in data:
        for s in run:
            if s.props['observable'] == 'Diagonal spin correlations':
                d = pyalps.DataSet()
                d.props['observable'] = 'Sz correlations'
                d.props['label'] = 'D = '+str(s.props['MAXSTATES'])
                L = int(s.props['L'])
                d.x = np.arange(L)
           
                # sites with increasing distance l symmetric to the chain center
                site1 = np.array([int(-(l+1)/2.0) for l in range(0,L)]) + L/2
                site2 = np.array([int(  l   /2.0) for l in range(0,L)]) + L/2
                indices = L*site1 + site2
                d.y = abs(s.y[0][indices])
           
                curves.append(d)
并绘制其关于格点距离的图：

    plt.figure()
    pyalps.plot.plot(curves)
    plt.xscale('log')
    plt.yscale('log')
    plt.legend()
    plt.title('Spin correlations in antiferromagnetic Heisenberg chain (S=1/2)')
    plt.ylabel('correlations $| \\langle S^z_{L/2-l/2} S^z_{L/2+l/2} \\rangle |$')
    plt.xlabel('distance $l$')
    plt.show()

### 自旋-自旋关联：自旋-1

在自旋-1 链中，我们确实预期指数衰减（带有解析修正），因此 DMRG 关联函数的指数性质应该很好地吻合。同样，选择一条长链（例如 $L=192$），对各个增大的 $D$ 值计算 $\langle S^z_i S^z_j \rangle$。

现在绘制 $C_l = \langle S^z_{L/2-l/2} S^z_{L/2+l/2} \rangle$（与之前一样，取整使距离为 $l$）。由于我们预期指数衰减，使用半对数图，同样消去负号。

从半对数图中提取关联长度，并与 [DMRG-02](../dmrg02) 中给出的基准值 $\xi=6.02$ 进行比较。关联长度将随 $D$ 单调增大。

事实上，关联长度的收敛比局域量难得多。这是因为更深入的算法分析揭示，DMRG 是一种特别擅长最优表示局域量的算法，而对于长程关联函数这类非局域量则没有那么擅长。

#### 使用参数文件

参数文件 [`spin_one`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-04-correlations/spin_one) 与前一个例子的参数文件很相似，只是将格点和模型替换如下：

    LATTICE_LIBRARY="my_lattices.xml"
    LATTICE="open chain lattice with special edges 32"
    MODEL="spin"
    local_S0=0.5
    local_S1=1
    CONSERVED_QUANTUMNUMBERS="N,Sz"
    Sz_total=0
    SWEEPS=6
    J=1
    NUMBER_EIGENVALUES=1
    MEASURE_AVERAGE[Magnetization]=Sz
    MEASURE_AVERAGE[Exchange]=exchange
    MEASURE_LOCAL[Local magnetization]=Sz
    MEASURE_CORRELATIONS[Diagonal spin correlations]=Sz
    MEASURE_CORRELATIONS[Offdiagonal spin correlations]="Splus:Sminus"
    { MAXSTATES=20 }
    { MAXSTATES=40 }
    { MAXSTATES=60 }

    parameter2xml spin_one
    dmrg --write-xml spin_one.in.xml

#### 使用 Python

脚本 [`spin_one.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-04-correlations/spin_one.py) 与前一个的主要区别在于格点和模型的定义：

    parms = []
    L = 32
    for D in [20,40,60]:
        parms.append( { 
            'LATTICE_LIBRARY'                       : 'my_lattices.xml',
            'LATTICE'                               : 'open chain lattice with special edges '+str(L),
            'MODEL'                                 : 'spin',
            'local_S0'                              : 0.5,
            'local_S1'                              : 1,
            'CONSERVED_QUANTUMNUMBERS'              : 'N,Sz',
            'Sz_total'                              : 0,
            'J'                                     : 1,
            'SWEEPS'                                : 4,
            'NUMBER_EIGENVALUES'                    : 1,
            'MAXSTATES'                             : D,
            'MEASURE_AVERAGE[Magnetization]'        : 'Sz',
            'MEASURE_AVERAGE[Exchange]'             : 'exchange',
            'MEASURE_LOCAL[Local magnetization]'    : 'Sz',
            'MEASURE_CORRELATIONS[Diagonal spin correlations]'      : 'Sz',
            'MEASURE_CORRELATIONS[Offdiagonal spin correlations]'   : 'Splus:Sminus'
        } )

运行模拟后，关联函数可以用与之前相同的方式提取和绘图。

### 有时存在另一种方法

对于自旋-1 链的特殊情形，我们有一个计算关联长度的捷径，这与第一激发态不是体激发这一奇特观察有关。可以证明，自旋-1 链的一个良好玩具模型如下：在自旋-1 的每个格点放置两个自旋-1/2，并从每个格点上两个自旋-1/2 的三重态状态构造自旋-1 态。基态可以近似为将*相邻*格点上的两个自旋-1/2 用单重态连接起来的状态。

在这种构造中，对于开放边界条件（但非周期性边界条件），第一个和最后一个格点将各有两个孤立的、没有伙伴的自旋-1/2。这两个自旋-1/2 粒子在它们之间可以形成 4 个态，在玩具模型中基态是四重简并的。在真实的自旋-1 链中，当两个自旋完全分离时，这种四重简并（来自一个总自旋为 0 的态和三个总自旋为 1 的态）只在热力学极限下才能实现。这就是磁化量子数扇区 0 和 1 之间没有能隙的原因。第一个体激发需要磁化量子数 2。

为了解决这个问题，我们可以在格点的每一侧各连接一个自旋-1/2 算符，对这些新格点采用相同的键哈密顿量，将两个孤立的自旋用单重态连接起来。你可以验证，现在磁化量子数扇区 0 和 1 之间确实存在能隙！

为了计算关联长度，还可以使用以下技巧：只在一端连接一个自旋-1/2。这意味着基态现在将是二重简并的，对应磁化量子数 +1/2 或 -1/2 扇区。我们可以通过观察*没有*连接自旋-1/2 的那一端的格点来表征这一点，该端的格点携带有限磁化强度，并随着关联长度衰减到体内。

对于长度 $L=192$、$D=200$ 的链，计算基态磁化强度。在半对数图中（消去符号振荡后）将其对格点作图，并提取关联长度。

## 小结

关联函数直接揭示了两条链之间的本质差异——临界自旋-1/2 链的幂律衰减与有能隙自旋-1 链的指数衰减——同时也显示了 DMRG 本身最不精确的地方，因为长程关联函数在 $D$ 方向的收敛远比能量等局域量慢得多。

## 思考题

- 对若干不太小的 $L$，绘制 $e_0(i)$ 关于 $i$ 的图（各个 $D$ 值）：对于自旋-1 链和自旋-1/2 链，你分别观察到了什么？分别考虑 $e_0(i)$ 的三个贡献项再求和，它们之间应存在什么关系？
- 到 $D=300$ 时关联长度是否已经收敛？与相同 $D$ 下磁化强度或能量等局域/准局域可观测量的收敛情况相比如何？
- 对于长度 $L=192$、$D=200$ 的链，用这种方法从基态磁化轮廓提取关联长度：你得到了什么关联长度，与 [DMRG-02](../dmrg02) 中的 $\xi=6.02$ 相比如何？
