
---
title: DMRG-05 Local Observables
math: true
toc: true
---

我们将与某个特定格点相关联的可观测量称为局域可观测量。对于自旋链，有意义的局域可观测量是局域磁化强度 $\langle S^z_i \rangle$。

## 自旋-1 链中的激发态

取长度 $L=96$、$D=200$ 的链，计算局域磁化强度 $\langle S^z_i \rangle$。将其对格点 $i$ 作图，分别对应磁化量子数扇区 0、1 和 2 的基态。

你应该得到：扇区 0 的磁化曲线基本平坦；扇区 1 的磁化基本集中在链的两端；而扇区 2 的磁化则同时存在于链端和链的体内。这意味着开放链的第一激发态是边界激发，在封闭系统中不存在；开放链的第二激发态是边界激发加体激发，而体激发才是我们感兴趣的。因此（原因目前尚不明朗），第一个体激发态的能量必须通过比较扇区 1 和 2 来提取。

这个故事的寓意是：通过观察这个局域可观测量，我们可以区分自旋-1 链中的边界激发与体激发。

### 使用参数文件

下面的参数文件 [`spin_one`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-03-local-observables/spin_one) 将设置三次独立运行，每个自旋扇区一次（与之前一样，为便于说明我们使用较小的系统和态数目）：

    LATTICE_LIBRARY="my_lattices.xml"
    LATTICE="open chain lattice with special edges 32"
    MODEL="spin"
    local_S0=0.5
    local_S1=1
    CONSERVED_QUANTUMNUMBERS="N,Sz"
    J=1
    NUMBER_EIGENVALUES=1
    SWEEPS=4
    MEASURE_LOCAL[Local magnetization]=Sz
    MAXSTATES=40
    { Sz_total=0 }
    { Sz_total=1 }
    { Sz_total=2 }

使用通常的命令序列进行转换和运行：

    parameter2xml spin_one
    dmrg --write-xml spin_one.in.xml

### 使用 Python

脚本 [`spin_one.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-03-local-observables/spin_one.py) 对三个自旋扇区各运行一次模拟：

    import pyalps
    import numpy as np
    import matplotlib.pyplot as plt
    import pyalps.plot
    parms = []
    for sz in [0,1,2]:
        parms.append( { 
            'LATTICE_LIBRARY'           : 'my_lattices.xml',
            'LATTICE'                   : 'open chain lattice with special edges 32',
            'MODEL'                     : "spin",
            'local_S0'                  : '0.5',
            'local_S1'                  : '1',
            'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
            'Sz_total'                  : sz,
            'J'                         : 1,
            'SWEEPS'                    : 4,
            'NUMBER_EIGENVALUES'        : 1,
            'MAXSTATES'                 : 40,
            'MEASURE_LOCAL[Local magnetization]'   : 'Sz'
    } )
    
    input_file = pyalps.writeInputFiles('parm_spin_one',parms)
    res = pyalps.runApplication('dmrg',input_file,writexml=True)

加载数据文件后，可以提取局域磁化强度的结果：

    data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one'))

    curves = []
    for run in data:
        for s in run:
            if s.props['observable'] == 'Local magnetization':
                sz = s.props['Sz_total']
                s.props['label'] = '$S_z = ' + str(sz) + '$'
                s.y = s.y.flatten()
                curves.append(s)

并将其绘图：

    plt.figure()
    pyalps.plot.plot(curves)
    plt.legend()
    plt.title('Magnetization of antiferromagnetic Heisenberg chain (S=1)')
    plt.ylabel('local magnetization')
    plt.xlabel('site')
    plt.show()

## 自旋-1/2 链中的磁化

对最低磁化量子数扇区中的自旋-1/2 链重复类似的计算。

### 使用参数文件

以下参数文件将完成此任务，可从[此处](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-03-local-observables/spin_one_half)下载：

    LATTICE="open chain lattice"
    MODEL="spin"
    CONSERVED_QUANTUMNUMBERS="N,Sz"
    SWEEPS=4
    J=1
    NUMBER_EIGENVALUES=1
    MEASURE_LOCAL[Local magnetization]=Sz
    L=32
    MAXSTATES=40
    { Sz_total=0 }
    { Sz_total=1 }
    { Sz_total=2 }

    parameter2xml spin_one_half
    dmrg --write-xml spin_one_half.in.xml

### 使用 Python

除明显的参数变化外，脚本 [`spin_one_half.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-03-local-observables/spin_one_half.py) 与上面解释的 `spin_one` 脚本相同。

## 小结

局域磁化轮廓清楚地区分了开放自旋-1 链中的边界激发与体激发，这就是为什么 [DMRG-04](../dmrg04) 中研究的物理上相关的（体）能隙必须取自磁化量子数扇区 1 和 2 之间，而非 0 和 1 之间。

## 思考题

- 对自旋-1/2 链的最低磁化量子数扇区重复局域磁化计算，与上面的自旋-1 情形相比，你观察到了什么？
