
---
title: DMFT-02 Hybridization
math: true
toc: true
---

## 杂化展开 CT-HYB

我们首先运行一个连续时间量子蒙特卡罗代码：杂化展开算法 CT-HYB。作为示例，我们重现 [Georges 等人的 DMFT 综述文章，Rev. Mod. Phys. 68, 13 (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) 中的图 11。这一系列共六条曲线展示了体系——一个相互作用为 $U=3D/\sqrt{2}$、处于半满情形、格子为贝特格子的 Hubbard 模型——在降温过程中如何进入反铁磁相。在教程 03 和 07 中，我们将分别用相互作用展开连续时间求解器和离散时间 Hirsch-Fye 量子蒙特卡罗代码重现相同的结果。除少数与求解器相关的参数外，输入参数都是相同的。

### 运行模拟

如果你想重现上文图 11 中全部 6 条曲线，CT-HYB 模拟总共大约需要运行 1 小时。本教程所需的文件可以在目录 `tutorials/dmft-02-hybridization` 中找到。

所有 DMFT 教程都可以通过一个 python 脚本启动。该脚本会生成参数文件、运行模拟并绘制结果。你可以运行简短版脚本 [`tutorial2.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-02-hybridization/tutorial2.py)，它只重现 6 条曲线中的 2 条（运行时间：约 20 分钟）；也可以运行完整版脚本 [`tutorial2_long.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-02-hybridization/tutorial2_long.py)，它会重现图中全部 6 条曲线（运行时间：约 1 小时）。

python 脚本 `tutorial2.py` 会自动为两个模拟准备输入文件 `parm_beta_6.0` 和 `parm_beta_12.0`，并运行它们（`/path-to-alps-installation/bin/dmft parm_beta_x`）。

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot

#prepare the input parameters
parms=[]
for b in [6., 12.]:
    parms.append(
        {
             'ANTIFERROMAGNET'     : 1,
             'CONVERGED'           : 0.003,
             'FLAVORS'             : 2,
             'H'                   : 0,
             'H_INIT'              : 0.03*b/8.,
             'MAX_IT'              : 6,
             'MAX_TIME'            : 300,
             'MU'                  : 0,
             'N'                   : 250,
             'NMATSUBARA'          : 250,
             'N_MEAS'              : 10000,
             'OMEGA_LOOP'          : 1,
             'SEED'                : 0,
             'SITES'               : 1,
             'SOLVER'              : 'hybridization',
             'SC_WRITE_DELTA'      : 1,
             'SYMMETRIZATION'      : 0,
             'U'                   : 3,
             't'                   : 0.707106781186547,
             'SWEEPS'              : int(10000*b/16.),
             'THERMALIZATION'      : 1000,
             'BETA'                : b
        }
    )


#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_beta_'+str(p['BETA']),p)
    res = pyalps.runDMFT(input_file)
```

### 理解输入参数

上述脚本生成的输入文件 `parm_beta_6.0`，并附有参数说明：

```
H_INIT = 0.0225   //  initial magnetic field in the direction of quantization axis, to produce the initial Weiss field
ANTIFERROMAGNET = 1   // allow antiferromagnetic ordering; in single site DMFT it is meaningfull only for bipartite lattices
SEED = 0   // Monte Carlo Random Number Seed 
CONVERGED = 0.003   // criterion for the convergency of the iterations
MAX_IT = 6   // upper limit on the number of iterations (the selfconsistency may be stopped before if criterion based on CONVERGED is reached)
SWEEPS = 3750   // Total number of sweeps to be computed (the solver may be stopped before reaching this limit on run-time limit set by MAX_TIME)
FLAVORS = 2   // flavors 0 and 1 correspond to spin up and down
SYMMETRIZATION = 0   // We are not enforcing a paramagnetic self consistency condition (symmetry in flavor 0 and 1)
NMATSUBARA = 250   // The cut-off for Matsubara frequencies 
H = 0   // Magnetic field in the direction of quantization axis
OMEGA_LOOP = 1   // the selfconsistency runs in Matsubara frequencies
SITES = 1   // number of sites of the impurity: for single site DMFT simulation it is 1
N = 250   // auxiliary discretization of the imaginary-time Green's function
BETA = 6.0   // Inverse temperature
U = 3   // Interaction strength
MAX_TIME = 300   // Upper time limit in seconds to run the impurity solver (per iteration)
SC_WRITE_DELTA = 1   // option for selfconsistency to write the hybridization function for the impurity solver
N_MEAS = 10000   // number of updates in between measurements
SOLVER = "hybridization"   // The Hybridization solver
THERMALIZATION = 1000   // Thermalization Sweeps 
MU = 0   // Chemical potential; for particle-hole symmetric models corresponds MU=0 to half-filled case
t = 0.707106781187   // hopping parameter; for the Bethe lattice considered here $W=2D=4t$
```

请注意，这里没有指定能带结构或格子类型的参数：默认情况下假定为贝特格子，但也可以更改（参见 [DMFT-08 格子](../dmft08)）。

同样也没有指定初始外斯场（Weiss field，由变量 G0OMEGA_INPUT 或 G0TAU_INPUT 设置）：程序会在初始化时自动计算非相互作用格林函数。它会使用初始磁场 H_INIT，这在本例中会在两个“味”（flavor 0 和 1，即 $\uparrow$ 和 $\downarrow$）之间产生微小差异，使系统从顺磁解出发时就偏离顺磁态。之所以这样做，是因为在（如本教程这样的）非常短的模拟中，如果从顺磁外斯场出发，随机噪声可能不足以在最初几次迭代中让系统偏离顺磁区域，从而使一个收敛很差的顺磁解看起来像是最终结果。H_INIT 对 BETA 的依赖关系是为了优化运行、减少所需的迭代次数。

### 迭代至自洽

程序最多运行 6 次自洽迭代。若需要更精确的模拟，可以增大这一上限；一旦达到参数 CONVERGED 所设定的收敛判据，模拟就会提前停止。在运行程序的目录中，你会找到格林函数文件 `G_tau_i`、自能文件（`selfenergy_i`），以及松原表象（频率空间）下的格林函数 `G_omega_i`。这些例子中的 `G_tau` 包含两列：自旋向上和自旋向下。$\tau=\beta^-$ 处的取值即为负的占据数（密度）；由此我们可以得到体系的磁化强度。

误差棒可以通过对一个已收敛体系的连续多次迭代来估计。

要重新运行某次模拟，可以通过设定输入参数 G0OMEGA_INPUT 来指定一个初始解：将所需的 `G0omega_output` 复制为 `filename_X`，并在 python 脚本中设置 `'G0OMEGA_INPUT':'filename_X'`（或直接在输入文件中设置 `G0OMEGA_INPUT=filename_X`），然后重新运行代码。

### 绘制反铁磁转变图

如同 [Georges 等人的 DMFT 综述文章](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)中的图 11 所示，你可以通过绘制虚时间表象下的格林函数（`tutorial2.py` 和 `tutorial2_long.py` 中的一部分）来观察体系向反铁磁相的转变：

```
listobs=['0', '1']   # we will plot both flavors 0 and 1

# load the imaginary-time Green's function in final iteration from all result files
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_beta_*h5'), respath='/simulation/results/G_tau', what=listobs)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])   # rescale horizontal axis
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])+'; flavor='+str(d.props['observable'][len(d.props['observable'])-1])

plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor}(\tau)$')
plt.title('DMFT-02: Neel transition for the Hubbard model on the Bethe lattice\n(using the Hybridization expansion impurity solver)')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

你会注意到结果的噪声相对较大。这是因为在如此高的温度下展开阶数很小，使得测量过程效率较低。你可以通过增加总运行时间（MAX_TIME）和/或增加 SWEEPS 数量来改善统计性质。请注意，目前通过 SOLVER 参数直接在 MPI 下运行求解器（例如 `SOLVER = "mpirun -np procs /path-to-ALPS-installation/bin/hybridization"`）由于路径前缀方面的问题尚无法正常工作；关于如何在你的系统上正确启动并行任务，请查阅你所使用的 MPI 安装的文档（例如 `mpirun` 的 man 手册）。

### 检验收敛性

如果你想检查 DMFT 自洽过程的收敛情况，可以使用 [`tutorial2eval.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-02-hybridization/tutorial2eval.py) 绘制不同迭代步骤的格林函数，其代码如下：

```
listobs=['0']   # we look at a single flavor (=0) 
res_files = pyalps.getResultFiles(pattern='parm_*.h5')  # we look for result files

## load all iterations of G_{flavor=0}(tau)
data = pyalps.loadDMFTIterations(res_files, observable="G_tau", measurements=listobs, verbose=False)

## create a figure for each BETA
grouped = pyalps.groupSets(pyalps.flatten(data), ['BETA'])
for sim in grouped:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## rescale x-axis and set label
    for d in sim:
        d.x = d.x * d.props['BETA']/float(d.props['N'])
        d.props['label'] = 'it'+d.props['iteration']
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$\tau$')
    plt.ylabel(r'$G_{flavor=0}(\tau)$')
    plt.title('Simulation at ' + r'$\beta = {beta}$'.format(beta= common_props['BETA']))
    pyalps.plot.plot(sim)
    plt.legend()

plt.show()
```

请注意，迭代分辨结果是通过一个与最终结果不同的函数（`pyalps.loadDMFTIterations`）加载的，而最终结果使用的是 `pyalps.loadMeasurements`；这是因为迭代分辨数据存储所用的目录结构（`/simulation/iteration/number/results/`）与用于存储最终结果的 ALPS 默认结构（`/simulation/results/`）不同。

如前所述，占据数 $n_f$ 等于 $G_f(\tau=\beta^-)$，即味 $f$ 的虚时间格林函数的最后一个取值。用于输出最终占据数并绘制其随 $\beta$ 变化关系的代码，是 `tutorial2eval.py` 的一部分：

```
## load the final iteration of G_{flavor=0}(tau)
data_G_tau = pyalps.loadMeasurements(res_files, respath='/simulation/results/G_tau', what=listobs, verbose=False)  

print("Occupation in the last iteration at flavor=0")
for d in pyalps.flatten(data_G_tau):
    # obtain occupation using relation: <n_{flavor=0}> = -<G_{flavor=0}(tau=beta)>
    d.y = np.array([-d.y[-1]])
    print("n_0(beta =",d.props['BETA'],") =",d.y[0])
    d.x = np.array([0])
    d.props['observable'] = 'occupation'

occupation = pyalps.collectXY(data_G_tau, 'BETA', 'occupation')
for d in occupation:
    d.props['line']="scatter"

plt.figure()
pyalps.plot.plot(occupation)
plt.xlabel(r'$\beta$')
plt.ylabel(r'$n_{flavor=0}$')
plt.title('Occupation versus BETA')

plt.show()
```

### 松原频率格林函数与自能

由于我们的自洽过程是在松原频率下进行的（回忆参数 OMEGA_LOOP=1），收敛判据为 $\mathrm{max}|G_{f}^{it}(i\omega_n)-G_{f}^{it+1}(i\omega_n)|\lt$ CONVERGED。松原频率格林函数虚部（实部同理）的绘制方式如下：

```
from math import pi

## load all iterations of G_{flavor=0}(i omega_n)
data = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_*.h5'), observable="G_omega", measurements=listobs, verbose=False)

## create a figure for each BETA
grouped = pyalps.groupSets(pyalps.flatten(data), ['BETA'])
for sim in grouped:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## rescale x-axis and set label
    for d in sim:
        d.x = np.array([(2.*n+1)*pi/common_props['BETA'] for n in d.x])
        d.y = np.array(d.y.imag)
        d.props['label'] = "it"+d.props['iteration']
        d.props['line']="scatter"
        d.props['fillmarkers'] = False
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$i\omega_n$')
    plt.ylabel(r'$Im\ G_{flavor=0}(i\omega_n)$')
    plt.title('Simulation at ' + r'$\beta = {beta}$'.format(beta=common_props['BETA']))
    pyalps.plot.plot(sim)
    plt.legend()

plt.show()
```

最好通过观察自能的收敛情况来判断收敛性，因为自能对收敛更为敏感。请注意，要得到更平滑的格林函数和自能，需要更长时间的模拟；在本次模拟中，松原频率中间范围内的噪声非常强。自能通过 Dyson 方程 $\Sigma_f^{it}(i\omega_n)=G0_f^{it}(i\omega_n)^{-1}-G_f^{it}(i\omega_n)^{-1}$ 得到，其虚部由 `tutorial2eval.py` 中如下这段代码绘制（实部同理）：

```
## load all iterations of G_{flavor=0}(i omega_n) and G0_{flavor=0}(i omega_n)
data_G = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_*.h5'), observable="G_omega", measurements=listobs, verbose=False)
data_G0 = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_*.h5'), observable="G0_omega", measurements=listobs, verbose=False)

## create a figure for each BETA
grouped_G = pyalps.groupSets(pyalps.flatten(data_G), ['BETA','observable'])
for sim in grouped_G:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## compute selfenergy using the Dyson equation, rescale x-axis and set label
    for d_G in sim:
        # find corresponding dataset from data_G0
        d_G0 = [s for s in pyalps.flatten(data_G0) if s.props['iteration']==d_G.props['iteration'] and s.props['BETA']==common_props['BETA']][0]
        d_G.x = np.array([(2.*n+1)*pi/common_props['BETA'] for n in d_G.x])
        # Dyson equation
        Sigma = np.array([1./d_G0.y[w] - 1./d_G.y[w] for w in range(len(d_G.y))])
        d_G.y = np.array(Sigma.imag)
        d_G.props['label'] = "it"+d_G.props['iteration']
        d_G.props['line']="scatter"
        d_G.props['fillmarkers'] = False
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$i\omega_n$')
    plt.ylabel(r'$Im\ \Sigma_{flavor=0}(i\omega_n)$')
    plt.title('Simulation at ' + r'$\beta = {beta}$'.format(beta=common_props['BETA']))
    pyalps.plot.plot(sim)
    plt.legend()

plt.show()
```
