
---
title: 运行应用程序
math: true
toc: true
weight: 1
---


`pyalps.writeParameterFile(fname, parms)`

- 该函数为 DMFT 等简单的 ALPS 应用程序写入文本输入文件

- 参数为：

  - filename：要写入的参数文件的名称
  - parms：参数字典

`pyalps.writeInputFiles(fname, parms, baseseed=None)`

 - 该函数为 ALPS 写入 XML 输入文件

 - 参数为：
     - fname：将要写入的 XML 文件的基本文件名
     - parms：包含模拟参数的字典列表
     - baseseed：可选参数，给出一个随机数种子，各个模拟的种子将据此计算。默认值取自当前时间。

 - 该函数返回主 XML 输入文件的名称


`pyalps.runApplication(appname, parmfiles, T=None, Tmin=None, Tmax=None, writexml=False, MPI=None, mpirun='mpirun')`
  运行一个 ALPS 应用程序

- 该函数运行一个 ALPS 应用程序。
- 参数为：

    - appname：应用程序的名称 parmfile：主 XML 输入文件的名称 writexml：可选参数，若希望除 HDF5 文件外还将所有结果写入 XML 文件，则设为 True
    - T：MC 模拟的时间限制
    - Tmin：可选参数，指定两次检查 MC 模拟是否完成之间的最短时间
    - Tmax：可选参数，指定两次检查 MC 模拟是否完成之间的最长时间
    - MPI：可选参数，指定 MPI 模拟中使用的进程数。若该参数保持默认值 None，则不使用 MPI。
    - mpirun：可选参数，给出用于启动 MPI 应用程序的可执行文件名称。默认为 ‘mpirun’

`pyalps.runDMFT(infiles, apppath='')`
  运行 ALPS DMFT 应用程序

- ALPS DMFT 应用程序（目前）尚未使用标准的 ALPS 输入文件和调度程序。因此需要一个单独的函数来调用它。该函数有一个必需参数：单个输入文件或输入文件列表。可选参数 apppath 用于设置二进制文件的路径。

`pyalps.evaluateLoop(infiles, appname='loop', write_xml=False)`
评估 looper QMC 应用程序的结果

- 该函数调用 looper 应用程序的评估工具。此外，评估得到的结果会被写回文件中。除结果文件列表外，它还接受一个可选参数：

    - write_xml：若将该可选参数设为 True，结果也将被写入 XML 文件

`pyalps.evaluateSpinMC(infiles, appname='spinmc_evaluate', write_xml=False)`
评估 `spinmc` 应用程序的结果

- 该函数调用 spinmc 应用程序的评估工具。此外，评估得到的结果会被写回文件中。除结果文件列表外，它还接受一个可选参数：

    - write_xml：若将该可选参数设为 True，结果也将被写入 XML 文件

`pyalps.evaluateQWL(infiles, appname='qwl_evaluate', DELTA_T=None, T_MIN=None, T_MAX=None)`
评估量子 Wang-Landau应用程序的结果

- 该函数调用量子 Wang-Landau应用程序的评估工具。除结果文件列表外，它还接受以下参数：
   - T_MIN：评估各物理量所用温度范围的下限
   - T_MAX：评估各物理量所用温度范围的上限
   - DELTA_T：在 T_MIN 和 T_MAX 之间使用的温度步长

- 该函数返回一个 DataSet 对象的列表的列表，对应于针对每个输入文件评估的各种属性。

`pyalps.evaluateFulldiagVersusT(infiles, appname='fulldiag_evaluate', DELTA_T=None, T_MIN=None, T_MAX=None, H=None)`
将 `fulldiag` 应用程序的结果作为温度的函数进行评估

- 该函数调用 `fulldiag` 应用程序的评估工具，并将若干物理量作为温度的函数进行评估。除结果文件列表外，它还接受以下参数：
   - T_MIN：评估各物理量所用温度范围的下限
   - T_MAX：评估各物理量所用温度范围的上限
   - DELTA_T：在 T_MIN 和 T_MAX 之间使用的温度步长
   - H：（可选）评估所有数据时所用的磁场

- 该函数返回一个 DataSet 对象的列表的列表，对应于针对每个输入文件评估的各种属性。

`pyalps.evaluateFulldiagVersusH(infiles, appname='fulldiag_evaluate', DELTA_H=None, H_MIN=None, H_MAX=None, T=None)`
将 `fulldiag` 应用程序的结果作为磁场 h 的函数进行评估

- 该函数调用 fulldiag 应用程序的评估工具，并将若干物理量作为磁场的函数进行评估。除结果文件列表外，它还接受以下参数：
   - H_MIN：评估各物理量所用磁场范围的下限
   - H_MAX：评估各物理量所用温度范围的上限
   - DELTA_H：在 H_MIN 和 H_MAX 之间使用的磁场步长
   - T：评估所有数据时所用的温度

- 该函数返回一个 DataSet 对象的列表的列表，对应于针对每个输入文件评估的各种属性。

