
---
title: Code-01 Python
math: true
toc: true
weight: 2
---

## 使用 Python 开始使用 ALPS

在本教程中，我们将展示如何使用 python-ALPS 用寥寥几行代码编写一个模拟。我们将以物理模拟领域中的"hello world"示例为例，对带局域更新的经典二维伊辛模型进行蒙特卡洛模拟。文件 `ising-skeleton.py` 中提供了一个骨架代码，勾勒出蒙特卡洛模拟的典型结构，下面将逐步对其进行讨论：

首先导入所需的 python 模块

    import math
    import pyalps
    import pyalps.alea as alpsalea
    import pyalps.pytools as alpstools

我们首先实现一个 Simulation 类，它将包含初始化模拟、运行模拟以及将测量结果存入 HDF5 文件的方法。

    class Simulation:
    # Seed random number generator: self.rng() will give a random float from the interval [0,1)
    rng = alpstools.rng(42)
   
   def __init__(self,beta,L):
       self.L = L
       self.beta = beta
       
       # Init exponential map
       self.exp_table = dict()
       for E in range(-4,5,2): 
         self.exp_table[E] = math.exp(2*beta*E)
       
       # Init random spin configuration
       self.spins = [ [2*self.randint(2)-1 for j in range(L)] for i in range(L) ]
       
       # Init observables
       self.energy = alpsalea.RealObservable('E')
       self.magnetization = alpsalea.RealObservable('m')
       self.abs_magnetization = alpsalea.RealObservable('|m|')

`__init__` 方法定义了该 Simulation 类的对象如何被实例化。其参数为晶格尺寸 $L$ 和逆温度 \beta。根据这些参数，我们推导出可能的玻尔兹曼权重，并初始化一个处于随机构型的伊辛自旋正方晶格。此外，我们还初始化了将要测量的观测量。这里我们借助 python-ALPS 框架，让 ALPS alea 库替我们处理观测量的评估。在类中，我们还初始化了一个随机数生成器并为其设置了种子。我们使用的引擎是 Mersenne Twister MT19937，其长周期和良好的统计特性使其非常适合蒙特卡洛模拟。

    def save(self, filename):
       pyalps.save_parameters(filename, {'L':self.L, 'BETA':self.beta, 'SWEEPS':self.n, 'THERMALIZATION':self.ntherm})
       self.abs_magnetization.save(filename)
       self.energy.save(filename)
       self.magnetization.save(filename)
       
save 方法将模拟参数和结果存储到一个 HDF5 文件中。

    def run(self,ntherm,n):
       # Thermalize for ntherm steps
       self.n = n
       self.ntherm = ntherm
       while ntherm > 0:
           self.step()
           ntherm = ntherm-1
       # Run n steps
       while n > 0:
           self.step()
           self.measure()
           n = n-1
       # Print observables
       print '|m|:\t', self.abs_magnetization.mean, '+-', self.abs_magnetization.error, ',\t tau =', self.abs_magnetization.tau
       print 'E:\t', self.energy.mean, '+-', self.energy.error, ',\t tau =', self.energy.tau
       print 'm:\t', self.magnetization.mean, '+-', self.magnetization.error, ',\t tau =', self.magnetization.tau

`run` 方法负责管理 step 例程中定义的蒙特卡洛更新，以及 measure 函数中观测量的测量。在系统热化期间，我们不进行任何测量。所有步骤完成后，我们输出各观测量的平均值、误差和自相关时间。

    def step(self):
        for s in range(self.L*self.L):
            # Pick random site k=(i,j)
            ...
            # Measure local energy e = -s_k * sum_{l nn k} s_l
            ...        
            # Flip s_k with probability exp(2 beta e)
            ...

蒙特卡洛扫描在 `step` 方法中完成。在 Metropolis 算法中，随机选取一个自旋，并以概率 $p_{accept} = min(1,e^{-\beta \Delta E})$ 将其翻转，其中 $\Delta E$ 是初始构型与提议构型之间的能量差。该过程重复 $L^2$ 次。Metropolis 算法的实现留给你作为练习。你可以使用下面定义的 `randint` 函数：

    def randint(self,max):
       return int(max*self.rng())

所选观测量的测量将在 `measure` 方法中实现：

    def measure(self):
        E = 0.    # energy
        M = 0.    # magnetization
        for i in range(self.L):
            for j in range(self.L):
                E -= ...
                M += ...
        # Add sample to observables
        self.energy << E/(self.L*self.L)
        self.magnetization << M/(self.L*self.L)
        self.abs_magnetization << abs(M)/(self.L*self.L)

对于给定的自旋构型，计算出能量和磁化强度的值，并将其添加到 ALPS 观测量中。其实现同样留给你作为练习。

完成观测量测量和 Metropolis 更新的实现后，你就可以使用 `alpspython` python 解释器运行模拟。在本例中，我们将对 $\beta = 1/k_B T$ 的不同取值进行扫描。"主"程序如下所示：

    L = 4    # Linear lattice size
    N = 5000    # of simulation steps
    print '# L:', L, 'N:', N
    # Scan beta range [0,1] in steps of 0.1
    for beta in [0.,.1,.2,.3,.4,.5,.6,.7,.8,.9,1.]:
        print '-----------'
        print 'beta =', beta
        sim = Simulation(beta,L)
        sim.run(N/2,N)
        sim.save('ising.'+str(beta)+'.h5')

python-ALPS 的一个好处是：如果你评估复合观测量，例如形如 $U = \langle A \rangle/\langle B\rangle$ 的量，程序会进行 jackknife 分析，你将自动得到正确评估的平均值和误差。作为示例，我们将扩展伊辛模拟，加入 $m^2$ 和 $m^4$ 的测量，并由此确定 Binder 累积量 $U_4=\langle m^4\rangle /\langle m^2\rangle^2$。由于 Binder 累积量通常用于借助有限尺寸标度确定临界温度，我们还将额外模拟 $L=6,8$ 的情形。

假设你已经成功实现了这两个额外的观测量并运行了模拟，我们首先加载数据，并针对每个系统尺寸 $L$，将两个观测量 $m^2$ 和 $m^4$ 存储为逆温度 $\beta$ 的函数：

    data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='ising.L*'),['m^2', 'm^4'])
    m2=pyalps.collectXY(data,x='BETA',y='m^2',foreach=['L'])
    m4=pyalps.collectXY(data,x='BETA',y='m^4',foreach=['L'])

现在我们可以计算 Binder 累积量，并将其存储在一个数据集列表中：

    u=[]
    for i in range(len(m2)):
        d = pyalps.DataSet()
        d.propsylabel='U4'
        d.props = m2[i].props
        d.x= m2[i].x
        d.y = m4[i].y/m2[i].y/m2[i].y
        u.append(d)

你可以使用以下命令绘制 Binder 累积量：

    import pyalps.plot as plt 
    plt.figure()
    plt.plot(u)
    plt.xlabel('Inverse Temperature $\beta$')
    plt.ylabel('Binder Cumulant U4 $g$')
    plt.title('2D Ising model')
    plt.legend()
    plt.show()

你观察到了什么？如果你想进一步了解相变和有限尺寸标度方法，请参阅教程 [MC-07 伊辛模型中的相变](../../../tutorials/mcs/mc07)。

