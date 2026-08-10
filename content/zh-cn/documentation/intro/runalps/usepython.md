
---
title: ALPS using Python
toc: true
weight: 3
---

## Running ALPS programs using Python

为了演示如何从 Python 使用 ALPS，我们来看一个简单的经典蒙特卡罗模拟：用 `spinmc` 应用求解正方格子上的二维铁磁 Ising 模型。在接近临界温度时，局域自旋翻转更新会遭遇临界慢化——自关联时间发散，导致相继的组态在统计上远非独立——因此我们改用团簇算法（`'UPDATE': "cluster"`），一次性翻转整个由取向一致的自旋组成的团簇。我们将计算磁化强度 $|m|$ 随温度的变化，以及它的 Binder cumulant——这是精确定位临界温度的标准有限尺寸分析工具（关于这一分析的完整讨论，参见 [MC-07 Phase Transition](../../../../tutorials/mcs/mc07)）。

## Launching Python

Python 只允许某个扩展模块与编译它时所用的**完全相同**版本的 Python 一起使用。如果你从源码构建 ALPS（例如在 Linux 上就是必须的），可以在配置 ALPS 时指定要使用的 Python 解释器。之后 ALPS 会创建一个名为

    alpspython

的脚本，它会设置好查找 ALPS 扩展模块所需的路径，然后调用你指定的 Python 解释器。

## Detailed instructions

### Importing the ALPS modules

启动 Python 后，导入我们需要的模块：

    import pyalps
    import matplotlib.pyplot as plt
    import pyalps.plot

完整的 Python 脚本位于教程目录下的 [`tutorials/intro-01-basics/tutorial-full.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/intro-01-basics/tutorial-full.py)。

### Preparing the input

为了准备输入，我们创建一个包含模拟参数的 Python 字典列表：

    parms = []
    for t in [1.5,2,2.5]:
        parms.append(
            { 
                'LATTICE'        : "square lattice", 
                'T'              : t,
                'J'              : 1,
                'THERMALIZATION' : 1000,
                'SWEEPS'         : 100000,
                'UPDATE'         : "cluster",
                'MODEL'          : "Ising",
                'L'              : 8
            }
        )

接下来，我们为 ALPS 模拟写出输入文件：

    input_file = pyalps.writeInputFiles('parm1',parms)

参数 `'parm1'` 告诉该函数使用 `parm1` 作为所有模拟文件的前缀。该函数返回主模拟文件的名称（此处为 `parm1.in.xml`）。

### Running the simulation

#### Running the simulation on a serial machine

要运行模拟，只需调用 `runApplication` 函数：

    pyalps.runApplication('spinmc',input_file,Tmin=5,writexml=True)

参数 `writexml=True` 会告诉 ALPS 同时把所有结果也写入 XML 文件。这会拖慢 I/O 速度，但很方便，因为你只需在浏览器中打开输出的 XML 文件就能查看结果。不过，如果你测量的物理量很多，文件会变得非常大，写入也会耗时过长。

#### Running the simulation on a parallel machine

要在并行机器上使用 MPI 运行模拟，改为调用以下命令：

    pyalps.runApplication('spinmc',input_file,Tmin=5,writexml=True,MPI=4)

其中 `MPI` 参数指定要启动的进程数。

### Loading the simulation results

#### Getting the result files

在加载结果之前，我们需要先获取结果文件的列表。这里只关注我们刚刚创建的文件（即以前缀 `parm1` 开头的文件），从而得到文件列表：

    result_files = pyalps.getResultFiles(prefix='parm1')
    print(result_files)

#### Loading the results

接下来，我们可能想知道都测量了哪些物理量。为此可以加载观测量列表：

    print(pyalps.loadObservableList(result_files))

我们决定加载磁化强度的绝对值及其平方，并打印出所加载的内容：

    data = pyalps.loadMeasurements(result_files,['|Magnetization|','Magnetization^2'])
    print(data)

打印出的内容中，加载的数值保存在 `y` 中，所有模拟参数则保存在名为 `props` 的字典中。

### Plotting the results 

例如，要绘制 |Magnetization| 随温度变化的图像，我们通过调用 `collectXY`，把 |Magnetization| 的值收集到 `y`，把温度 `T` 收集到 `x`：

    plotdata = pyalps.collectXY(data,'T','|Magnetization|')

#### Plotting in Python using `matplotlib`

然后我们使用 `matplotlib` 和 `pyalps.plot` 模块来绘图：

    plt.figure()
    pyalps.plot.plot(plotdata)
    plt.xlim(0,3)
    plt.ylim(0,1)
    plt.title('Ising model')
    plt.show()

#### Converting to other formats

我们也可以调用相应函数，把数据集转换为其他绘图格式，例如纯文本、Grace 或 Gnuplot：

    print(pyalps.plot.convertToText(plotdata))
    print(pyalps.plot.makeGracePlot(plotdata))
    print(pyalps.plot.makeGnuplotPlot(plotdata))

### Evaluating data

我们可以很容易地对结果求值来计算一些函数，例如计算 Binder cumulant 比值 $\langle m^2 \rangle / \langle |m|\rangle ^2$。我们创建一个新的 `DataSet` 并填入数据：

    binder = pyalps.DataSet()
    binder.props = pyalps.dict_intersect([d[0].props for d in data])
    binder.x = [d[0].props['T'] for d in data]
    binder.y = [d[1].y[0]/(d[0].y[0]*d[0].y[0]) for d in data]
    print(binder)

表达式 `d[1].y[0]/(d[0].y[0]*d[0].y[0])` 使用 jackknife 分析来为存在关联的物理量计算正确的蒙特卡罗误差棒。

最后，我们再制作一张图：

    plt.figure()
    pyalps.plot.plot(binder)
    plt.xlabel('T')
    plt.ylabel('Binder cumulant')
    plt.show()

## Complete example scripts

完整的脚本位于文件 [`tutorials/intro-01-basics/tutorial-full.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/intro-01-basics/tutorial-full.py)。

下面给出针对各种任务的一些更小的脚本：

### Running and plotting

- 使用 matplotlib 绘制磁化图：[`tutorials/intro-01-basics/tutorial-magnetization.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/intro-01-basics/tutorial-magnetization.py)
- 使用 Grace 绘制磁化图：[`tutorials/intro-01-basics/tutorial-graceplot.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/intro-01-basics/tutorial-graceplot.py)
- 使用 Gnuplot 绘制磁化图：[`tutorials/intro-01-basics/tutorial-gnuplot.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/intro-01-basics/tutorial-gnuplot.py)
- 以纯文本形式输出磁化：[`tutorials/intro-01-basics/tutorial-text.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/intro-01-basics/tutorial-text.py)

### More complex evaluation

- Binder cumulant 的计算见文件 [`tutorials/intro-01-basics/tutorial-binder.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/intro-01-basics/tutorial-binder.py)。

### Splitting into subtasks

准备、运行、评估这几项任务也可以拆分成子任务：

- 准备输入文件：[`tutorials/intro-01-basics/tutorial-prepareinput.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/intro-01-basics/tutorial-prepareinput.py)
- 运行模拟：[`tutorials/intro-01-basics/tutorial-runsimulation.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/intro-01-basics/tutorial-runsimulation.py)
- 评估结果：[`tutorials/intro-01-basics/tutorial-evaluate.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/intro-01-basics/tutorial-evaluate.py)

## More examples

关于各函数用法的更多示例，以及更高级的应用，可以在教程中找到。此外，别忘了可以通过函数的 `__doc__` 属性查看其文档，例如：

    print(pyalps.plot.plot.__doc__)

关于大多数 ALPS 应用共有的输入参数，请参见[常用参数](../../parameters)。关于能生成与本文所示 Python 方式相同输出文件的命令行流程，请参见[使用命令行](../commandline)。关于本节其余内容的概览，请参见[运行模拟](../..)。
