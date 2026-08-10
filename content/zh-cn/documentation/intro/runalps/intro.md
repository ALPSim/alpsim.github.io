
---
title: Introduction
toc: true
weight: 1
---

## Overview

ALPS 的模拟建立在调度库之上，调度库让你可以指定一次模拟的参数，包括一次性指定多组参数（例如，如果你想在若干个不同的温度下模拟同一个物理系统）。调度库随后会为每一组参数在单机或并行机器上启动一个作业，并定期写出检查点——运行当前状态的快照——以确保当一次运行被中断或超出机器的运行时间限制时不会丢失数据；重新启动的运行会从最近的检查点继续，而不是从头开始。调度库从作业文件中读取输入，作业文件为每一组需要运行模拟的参数列出一个对应的任务文件。作业文件和任务文件都以 XML 格式给出：调度库从任务文件中读取输入参数，并将测得的物理量写回任务文件。一个作业文件的示例可能是这样的：

    <JOB>
    <OUTPUT file="parm.xml"/>
    <TASK status="new">
    <INPUT file="parm.task1.in.xml"/>
    <OUTPUT file="parm.task1.xml"/>
    </TASK>
    <TASK status="new">
    <INPUT file="parm.task2.in.xml"/>
    <OUTPUT file="parm.task2.xml"/>
    </TASK>
    <TASK status="new">
    <INPUT file="parm.task3.in.xml"/>
    <OUTPUT file="parm.task3.xml"/>
    </TASK> 
    </JOB>

`<JOB>` 自身的 `<OUTPUT>` 元素给出了作业级汇总文件的名称，调度库会在每次写检查点时——随着各任务的推进和完成——更新这个文件。每个 `<TASK>` 对应一组参数：其 `status` 属性跟踪进度（`new` 表示尚未开始的任务，`running` 表示调度库已经开始处理的任务，`finished` 表示已完成的任务），其 `<INPUT>` 给出保存该任务参数的任务文件名称，其 `<OUTPUT>` 给出结果将被写入的文件名称。一个任务文件（这里是 `parm.task1.in.xml`）的示例可能是这样的：

    <SIMULATION>
    <PARAMETERS>
    <PARAMETER name="L">100</PARAMETER>
    <PARAMETER name="SWEEPS">10000</PARAMETER>
    <PARAMETER name="T">0.5</PARAMETER>
    <PARAMETER name="THERMALIZATION">100</PARAMETER>
    </PARAMETERS> 
    </SIMULATION>

每一条 `<PARAMETER>` 都是一个 `name`／值对，与你在纯文本参数文件或 Python 参数字典中设置的参数本质上相同——只是语法不同。实际使用中，你几乎不需要手写作业文件和任务文件的 XML：下面两种工作方式都会自动为你生成这些文件，或是通过命令行工具 `parameter2xml`，或是通过 Python 中的 `pyalps.writeInputFiles`／`pyalps.writeParameterFile`。这里展示 XML 格式，主要是为了在你需要直接查看或调试它时，能够认出其结构。

本节将讨论如何准备、运行和评估 ALPS 模拟。ALPS 支持两种方式：

- [使用命令行（评估工具有限）](../commandline)
- [使用 Python](../usepython)

两种方式产生完全相同的输出文件，你可以根据需要自由混用。无论采用哪种方式，一次模拟都会经历相同的三个阶段：

- 准备输入文件
- 运行模拟
- 评估结果

## 关于随机数生成器的说明

每当运行蒙特卡罗模拟时，都要记住你所使用的是伪随机数。总有极小的概率，你的特定应用恰好是暴露出某个此前一直表现良好的伪随机数生成器缺陷的那一个。因此，作为高精度蒙特卡罗计算的标准做法，你应当用另一个生成器——通过 [`RNG` 参数](../../parameters#additional-parameters-for-monte-carlo-simulations) 设置——重新运行模拟，并检查结果是否保持不变。

关于大多数 ALPS 应用共有的完整参数列表（包括 `RNG`），请参见[常用参数](../../parameters)。关于 ALPS 文档其余部分的概览，请参见[简介](../..)。



