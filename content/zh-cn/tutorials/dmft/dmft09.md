
---
title: DMFT-09 Néel Transition
math: true
toc: true
---

## 单格点 DMFT 中的 Néel 转变

在本例中，我们重现 [Georges 等人的 DMFT 综述文章](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)中的图 11。这一系列共六条曲线展示了体系——一个相互作用为 $U=3D/\sqrt{2}$、处于半满情形、格子为贝特格子的 Hubbard 模型——在降温过程中如何进入反铁磁相。

这些示例既可以通过命令行直接调用命令来运行，也可以通过 python 脚本来运行。手动运行其中一组 DMFT 参数，例如进入 `tutorials/dmft-02-hybridization` 目录下的 `beta_14_U3_tsqrt2` 目录，并运行 dmft 代码 `/opt/alps/bin/dmft hybrid.param`，会得到相同的结果。

注：本示例综合了教程 [DMFT-02 Hybridization](../dmft02)、[DMFT-03 Interaction](../dmft03) 和 [DMFT-07 Hirsch-Fye](../dmft07) 的内容。

### 杂化展开 CT-HYB

我们首先运行一个连续时间量子蒙特卡罗代码：杂化展开算法 CT-HYB。CT-HYB 模拟每次迭代大约需要一分钟。运行此模拟所需的参数文件可以在目录 `tutorials/dmft-02-hybridization` 中找到。

主要参数如下：

```
SEED = 0;                    // Monte Carlo Random Number Seed
THERMALIZATION = 1000;       // Thermalization Sweeps
SWEEPS = 100000000;          // Total Sweeps to be computed
MAX_TIME = 60;               // Maximum time to run the simulation
BETA = 12.;                  // Inverse temperature
SITES = 1;                   // This is a single site DMFT simulation, so Sites is 1
N = 1000;                    // auxiliary discretization of the imaginary-time Green's function
NMATSUBARA = 1000;           // The number of Matsubara frequencies
U = 3;                       // Interaction energy
t = 0.707106781187;          // hopping parameter. For the Bethe lattice considered here $W=2D=4t$
MU = 0;                      // Chemical potential
H = 0;                       // Magnetic field
SYMMETRIZATION = 0;          // We are not enforcing a paramagnetic self consistency condition
SOLVER = Hybridization;      // The Hybridization solver
```

要通过命令行启动模拟，输入：

```
dmft hybrid.param
```

程序最多运行 10 次自洽迭代。在运行程序的目录中，你会找到格林函数文件 G_tau_i、自能文件（selfenergy_i）以及频率空间下的格林函数 G_omega_i，均位于输出目录中。这些例子中的 G_tau 包含两列：自旋向上和自旋向下。$\beta$ 处的取值即为负的密度；当该值在误差棒范围之外出现差异时，体系即处于反铁磁相。你可以在 python shell 中运行以下代码，绘制不同 $\beta$ 下的格林函数，并将结果与 [Georges 等人](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)图 11 的结果进行比较。在下面的 Hirsch-Fye 部分，我们将用离散时间量子蒙特卡罗代码——Hirsch Fye 代码——重现相同的结果。除求解器所用的命令外，其余参数都是相同的。

你可以在示例中的目录 `tutorials/dmft-02-hybridization` 里找到相应的参数文件（名为 \*tsqrt2）。你也可以运行 python 脚本 `tutorial2a.py`：

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.pyplot

#prepare the input parameters
parms=[]
for b in [6.,8.,10.,12.,14.,16.]:
    parms.append(
        {
            'ANTIFERROMAGNET'     : 1,
            'CONVERGED'           : 0.03,
            'F'                   : 10,
            'FLAVORS'             : 2,
            'H'                   : 0,
            'H_INIT'              : 0.2,
            'MAX_IT'              : 10,
            'MAX_TIME'            : 60,
            'MU'                  : 0,
            'N'                   : 1000,
            'NMATSUBARA'          : 1000,
            'N_FLIP'              : 0,
            'N_MEAS'              : 10000,
            'N_MOVE'              : 0,
            'N_ORDER'             : 50,
            'N_SHIFT'             : 0,
            'OMEGA_LOOP'          : 1,
            'OVERLAP'             : 0,
            'SEED'                : 0,
            'SITES'               : 1,
            'SOLVER'              : 'Hybridization',
            'SYMMETRIZATION'      : 0,
            'TOLERANCE'           : 0.01,
            'U'                   : 3,
            't'                   : 0.707106781186547,
            'SWEEPS'              : 100000000,
            'THERMALIZATION'      : 1000,
            'BETA'                : b,
            'CHECKPOINT'          : 'solverdump_beta_'+str(b)+'.task1.out.h5',
            'G0TAU_INPUT'         : 'G0_tau_input_beta_'+str(b)
        }
    )
#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_beta_'+str(p['BETA']),p)
    res = pyalps.runDMFT(input_file)
```

运行这些模拟后，将输出结果与 Hirsch Fye 部分或 DMFT 综述文章中的 Hirsch-Fye 结果进行比较，或与 Interaction Expansion CT-INT 部分的相互作用展开结果进行比较。若要重新运行某次模拟，可以通过设定输入参数 G0OMEGA_INPUT 来指定一个初始解：例如将 G0omga_output 复制为 G0_omega_input，在参数文件中设置 G0OMEGA_INPUT = G0_omega_input，然后重新运行代码。你可以通过以下脚本绘制格林函数，观察体系向反铁磁相的转变：

```
flavors=parms[0]['FLAVORS']
listobs=[]   
for f in range(0,flavors):
    listobs.append('Green_'+str(f))

ll=pyalps.load.Hdf5Loader()
data = ll.ReadMeasurementFromFile(pyalps.getResultFiles(pattern='parm_beta_*h5'), respath='/simulation/results/G_tau', measurements=listobs, verbose=True)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])
plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G(\tau)$')
plt.title('Hubbard model on the Bethe lattice')
pyalps.pyplot.plot(data)
plt.legend()
plt.show()
```

你会注意到结果的噪声相对较大。这是因为在如此高的温度下展开阶数很小，使得测量过程效率较低。你可以通过增加总运行时间（MAX_TIME）或在多个 CPU 上运行来改善统计性质。若要使用 MPI 运行，可以尝试 `mpirun -np procs dmft parameter_file`，或查阅你所使用的 MPI 安装的 man 手册。

如果你想检查 DMFT 自洽过程的收敛情况，可以使用 `tutorial2b.py` 绘制不同迭代步骤的格林函数：

```
ll=pyalps.load.Hdf5Loader()
for p in parms:
    data = ll.ReadDMFTIterations(pyalps.getResultFiles(pattern='parm_beta_'+str(p['BETA'])+'.h5'), measurements=listobs, verbose=True)
    grouped = pyalps.groupSets(pyalps.flatten(data), ['iteration'])
    nd=[]
    for group in grouped:
        r = pyalps.DataSet()
        r.y = np.array(group[0].y)
        r.x = np.array([e*group[0].props['BETA']/float(group[0].props['N']) for e in group[0].x])
        r.props = group[0].props
        r.props['label'] = r.props['iteration']
        nd.append( r )
    plt.figure()
    plt.xlabel(r'$\tau$')
    plt.ylabel(r'$G(\tau)$')
    plt.title(r'\beta = %.4s' %nd[0].props['BETA'])
    pyalps.pyplot.plot(nd)
    plt.legend()
    plt.show()
```

最好通过观察自能的收敛情况来判断收敛性，因为自能对收敛更为敏感。请注意，要得到更平滑的格林函数和自能，需要更长时间的模拟。

### 相互作用展开 CT-INT

用 CT-INT 代码重复 Hybridization Expansion CT-HYB 部分中的计算是很有启发性的。该代码对相互作用（而非杂化）做展开。相应的参数文件与之非常相似，可以在目录 `tutorials/dmft-03-interaction` 中找到。如果你更喜欢用 python 运行模拟，可以使用 `tutorial3a.py` 和 `tutorial3b.py` 文件。

### Hirsch Fye

我们通过运行一个离散时间蒙特卡罗代码——[Hirsch Fye 代码](https://link.aps.org/doi/10.1103/PhysRevLett.56.2521)——将其结果与连续时间的结果进行比较。Hirsch Fye 算法在[这里](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)有详细描述，该综述文章也提供了相应代码的开源实现。尽管已经出现了许多改进（例如可参见 Alvarez (2008) 或 [Nukala09](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.80.195111)），但这一算法已被[连续时间算法](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.76.235123)所取代。

Hirsch Fye 模拟每次迭代大约需要一分钟。运行此模拟所需的参数文件可以在[本教程](../dmft07)中找到。

主要参数如下：

```
SEED = 0;                    // Monte Carlo Random Number Seed
THERMALIZATION = 10000;      // Thermalization Sweeps
SWEEPS = 1000000;            // Total Sweeps to be computed
MAX_TIME = 60;               // Maximum time to run the simulation
BETA = 12.;                  // Inverse temperature
SITES = 1;                   // This is a single site DMFT simulation, so Sites is 1
N = 16;                      // Number of time slices (you will see that this parameter is rather small)
NMATSUBARA = 500;            // The number of Matsubara frequencies
U = 3;                       // Interaction energy
t = 0.707106781187;          // hopping parameter. For the Bethe lattice considered here $W=2D=4t$
MU = 0;                      // Chemical potential
H = 0;                       // Magnetic field
SYMMETRIZATION = 0;          // We are not enforcing a paramagnetic self consistency condition
SOLVER = /opt/alps/bin/hirschfye;  // The path to the external Hirsch Fye solver
```

要启动模拟，输入：

```
dmft hirschfye.param
```

或运行 python 脚本 `tutorial7a.py`：

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.pyplot

#prepare the input parameters 
parms=[]
for b in [6.,8.,10.,12.,14.,16.]: 
    parms.append(
        { 
            'ANTIFERROMAGNET'     : 1,
            'CONVERGED'           : 0.03,
            'FLAVORS'             : 2,
            'H'                   : 0,
            'MAX_IT'              : 10,
            'MAX_TIME'            : 60,
            'MU'                  : 0,
            'N'                   : 16,
            'NMATSUBARA'          : 500, 
            'OMEGA_LOOP'          : 1,
            'SEED'                : 0, 
            'SITES'               : 1,
            'SOLVER'              : '/opt/alps/bin/hirschfye',
            'SYMMETRIZATION'      : 0,
            'TOLERANCE'           : 0.01,
            'U'                   : 3,
            't'                   : 0.707106781186547,
            'SWEEPS'              : 1000000,
            'THERMALIZATION'      : 10000,
            'BETA'                : b,
            'G0OMEGA_INPUT'       : 'G0_omega_input_beta_'+str(b),
            'BASENAME'            : 'hirschfye.param'
        }
    )

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_beta_'+str(p['BETA']),p)
    res = pyalps.runDMFT(input_file)
```

程序最多运行 10 次自洽迭代。在运行程序的目录中，你会找到格林函数文件 G_tau_i、自能文件（selfenergy_i）以及频率空间下的格林函数 G_omega_i，均位于输出目录中。这些例子中的 G_tau 包含两列：自旋向上和自旋向下。$\beta$ 处的取值即为负的密度；当该值在误差棒范围之外出现差异时，体系即处于反铁磁相。你可以在 python shell 中运行以下代码，绘制不同 $\beta$ 下的格林函数，并将结果与 [Georges 等人](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)图 11 的结果进行比较。

```
flavors=parms[0]['FLAVORS']
listobs=[]   
for f in range(0,flavors):
    listobs.append('Green_'+str(f))

ll=pyalps.load.Hdf5Loader()
data = ll.ReadMeasurementFromFile(pyalps.getResultFiles(pattern='parm_beta_*h5'), respath='/simulation/results/G_tau', measurements=listobs, verbose=True)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])
plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G(\tau)$')
plt.title('Hubbard model on the Bethe lattice')
pyalps.pyplot.plot(data)
plt.legend()
plt.show()
```

作为一种离散时间方法，HF 会受到 $\Delta\tau$ 离散化误差的影响。请选取一组参数，并对逐渐增大的 $N$ 重复运行！另外需要注意：你正在使用一个（几乎）已收敛的输入浴函数来运行 DMFT 模拟。删除文件 G0_omega_input 后，你可以从自由解重新开始计算，并观察其收敛过程。
