
---
title: ALPS using the command line
toc: true
weight: 2
---

## 输入的准备

由于日常操作中你可能并不想直接处理作业文件和任务文件的 XML 格式，`parameter2xml` 工具让你可以用纯文本文件来指定模拟参数，然后自动将其转换为 XML 格式。

`parameter2xml` 工具会把一个纯文本参数文件，转换成[简介](../intro)中所述的 XML 格式的作业文件以及所有必要的任务文件。参数文件由若干条如下形式的参数赋值组成：

    MODEL="Ising";
    SWEEPS=1000;
    THERMALIZATION=100; 
    WORK_FACTOR=L*SWEEPS;
    { L=10; T=0.1; }
    { L=20; T=0.05; }

花括号 {...} 中的每一组赋值表示一个任务的一组参数。花括号块之外的赋值，从其定义处开始，对之后所有任务全局有效。字符串用双引号给出，如 "Ising"。

有两个参数具有特殊含义：

| **参数** | **默认值** | **含义** |
| :------------ | :---------- | :---------- |
| SEED | 0 | 下一次创建的蒙特卡罗运行所使用的伪随机数生成器种子。每当一个种子被用于创建一次运行后，该值会自动加一。 |
| WORK_FACTOR | 1 | 负载均衡中，某次模拟所需工作量会被乘以的一个因子。 |

调用 `parameter2xml` 的语法是：

    parameter2xml [-f] parameterfile [xmlfileprefix]

它将参数文件转换为一组 XML 文件，文件名以可选的第二个参数给出的前缀开头。若省略该第二个参数，默认使用参数文件本身的名称。
`parameter2xml` 工具会检查是否已经存在同名的输出 XML 文件，并询问你是否确实要覆盖它们。你可以使用 `-f` 选项强制 `parameter2xml` 覆盖这些文件。

## 启动程序

### 在单机上运行模拟

运行模拟的方式是：先创建作业文件，然后将该 XML 作业文件的名称作为参数传给程序。在我们的例子中，程序名为 `my_program`，运行的步骤如下：

    parameter2xml parm job 
    my_program job.in.xml

结果将保存在文件 `job.out.xml` 中，该文件会引用 `job.task1.out.xml`、`job.task2.out.xml` 和 `job.task3.out.xml` 这三个文件，分别对应三次模拟的结果。

#### 命令行选项

该程序接受若干命令行选项，用于控制调度器的行为。这些选项在蒙特卡罗模拟中尤其有用。

| **选项** | **默认值** | **说明** |
| :--------- | :---------- | :-------------- |
| --time-limit timelimit | 无穷大 | 指定程序在写出最终检查点并退出之前应运行的时间（秒）。 |
| --checkpoint-time checkpointtime | 1800 | 指定程序写出检查点的时间间隔（秒）。 |
| --Tmin checkingtime | 60 | 指定调度器在再次检查某次模拟是否完成之前等待的最短时间（秒）。 |
| --Tmax checkingtime | 900 | 指定调度器在再次检查某次模拟是否完成之前等待的最长时间（秒）。 |
| --write-xml | | 使用该选项后，结果也会被写入 `.out.xml` 文件；否则结果只会被写入 HDF5 文件。 |

### 在并行机器上运行模拟

在并行机器上运行模拟，和在单机上运行一样简单。这里给出一个使用 Open MPI 的例子：不需要单独的步骤来启动 MPI 环境，直接用 `mpirun` 运行程序即可（若需跨多个节点运行，用 `--hostfile` 指定主机文件）。例如，要在四个进程上运行：

    parameter2xml parm job 
    mpirun -np 4 my_program --mpi job.in.xml

#### 命令行选项

除了串行程序的命令行选项之外，并行程序还多了两个选项：

| **选项** | **默认值** | **说明** |
| :--------- | :---------- | :-------------- |
| --mpi | | 指定程序应以 MPI 模式运行 |
| --Nmax numprocs | 无穷大 | 指定分配给某次模拟的最大进程数。 |
| --Nmin numprocs | 1 | 指定分配给某次模拟的最小进程数。 |

如果可用的处理器数目多于模拟的数目，每次模拟会启动不止一个蒙特卡罗运行。

## 分析模拟结果

在模拟过程中，若干个物理量（由模拟代码指定并实现）的期望值会被测量并保存到各自的任务文件中。为了归档某次模拟产生的任务文件，以及从这些文件或归档中提取数据，下面介绍几个相关工具。

### `convert2xml`

模拟的输出文件中只包含来自所有运行的汇总测量结果。若要获得每次模拟中各个蒙特卡罗运行的详细信息，可以使用 `convert2xml` 工具将检查点文件转换为 XML，例如：

    convert2xml run-file

这会生成该任务的一个 XML 文件，其中包含从这次蒙特卡罗运行中提取出的信息。

### 物理量的评估

命令行下可用于评估的程序包括：`dirloop_sse_evaluate`、`spinmc_evaluate`、`worm_evaluate`、`fulldiag_evaluate` 和 `qwl_evaluate`。其中三个（`dirloop_sse_evaluate`、`spinmc_evaluate` 和 `worm_evaluate`）采用相同的语法：

    spinmc_evaluate [--write-xml] job.task1.out.xml [job.task2.out.xml ... ]

这将利用保存下来的蒙特卡罗数据，计算模拟过程本身未曾计算的其他物理量（例如比热、压缩率等）。使用 `--write-xml` 会将所有结果写回 `.out.xml` 文件；不使用该选项时，结果只会写入 HDF5 文件。
关于另外两个程序的语法，请分别参见使用 `qwl_evaluate` 的 [MC-06 QWL](../../../../tutorials/mcs/mc06) 教程和使用 `fulldiag_evaluate` 的 [ED-06 Full Diagonalization](../../../../tutorials/ed/ed06) 教程。
这些评估程序的结构相对简单，创建或修改这类评估程序也很直接。下面的例子读取某个玻色 Hubbard 模型模拟中粒子数算符 n 和 n2 的期望值，计算压缩率的期望值，并将其写回检查点。

    #include <alps/scheduler.h>
    #include <alps/alea.h>
 
    void evaluate(const boost::filesystem::path& p, std::ostream& out) {
        alps::ProcessList nowhere;
        alps::scheduler::MCSimulation sim(nowhere,p);
 
        // read in parameters
        alps::Parameters parms=sim.get_parameters();
        double beta=parms.defined("beta") ? static_cast<double>(parms["beta"]) : (1./static_cast<double>(parms["T"]));             
 
        // determine compressibility
        alps::RealObsevaluator n  = sim.get_measurements()["Particle number"];
        alps::RealObsevaluator n2 = sim.get_measurements()["Particle number^2"];
        alps::RealObsevaluator kappa= beta*(n2 - n*n);  
        kappa.rename("Compressibility");
 
        // write compressibility back to checkpoint  
        sim << kappa;
        sim.checkpoint(p);
    }
 
    int main(int argc, char** argv)
    {
        alps::scheduler::BasicFactory<alps::scheduler::MCSimulation,alps::scheduler::DummyMCRun> factory;
        alps::scheduler::init(factory);
        boost::filesystem::path p(argv[1]);
        evaluate(p,std::cout);
    }

请注意，ALPS 在 Python 中提供了容易得多的数据分析与评估方式（参见[使用 Python](../usepython)）；这个 C++ 示例仅供需要在 C++ 程序中完成分析的用户使用。

关于大多数 ALPS 应用共有的输入参数，请参见[常用参数](../../parameters)。本页所列的调度器选项（`--time-limit`、`--checkpoint-time`、`--Tmin`／`--Tmax`、`--mpi`、`--Nmin`／`--Nmax`、`--write-xml`）是直接传给调度器程序本身的命令行参数，而不是写在参数文件中的参数。关于本节其余内容的概览，请参见[运行模拟](../..)。



