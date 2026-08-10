
---
title: Running Simulations
toc: true
weight: 1
---

无论是从命令行还是从 Python 驱动，每一次 ALPS 模拟都会经历相同的三个阶段——准备输入、运行模拟、评估结果。本节先统一说明其背后的作业／任务机制，然后分别详细介绍这两种工作方式。

## [简介](intro)

ALPS 调度库如何组织一次模拟：作业文件为每组参数列出一个任务，任务文件保存参数、后续也保存结果，以及下文两种工作方式共有的三个阶段（准备、运行、评估）。同时说明了为什么在追求高精度的蒙特卡罗计算中，应当用不止一种随机数生成器（通过 `RNG` 参数）重新运行，以排除某个生成器特有的偏差。

## [使用命令行（评估工具有限）](commandline)

不借助 Python 来驱动 ALPS 的方法：使用 `parameter2xml` 将纯文本参数文件转换为作业／任务 XML，在单机上或在并行机器上通过 MPI 直接启动模拟程序（包括 `--time-limit`、`--checkpoint-time`、`--mpi`、`--Nmin`／`--Nmax` 等选项），以及之后如何用 `convert2xml` 和各种 `*_evaluate` 程序（`spinmc_evaluate`、`worm_evaluate`、`dirloop_sse_evaluate` 等）来评估结果。最后给出一个用 C++ 编写自定义评估程序、计算压缩率之类派生量的示例。

## [使用 Python](usepython)

日常运行和分析 ALPS 模拟时推荐使用的方式。通过一个完整示例，依次讲解：导入 `pyalps`，用 `pyalps.writeInputFiles` 将输入准备为参数字典构成的 Python 列表，用 `pyalps.runApplication` 串行或并行地运行模拟，然后加载结果（`pyalps.loadMeasurements`）、绘图（`pyalps.plot`，也支持导出为 Grace 或 Gnuplot 格式），以及计算诸如 Binder cumulant 之类的派生量并给出正确的 jackknife 误差棒。最后指向 `tutorials/intro-01-basics` 目录下完整的示例脚本，以及按任务拆分成的更小版本。
