
---
title: 数据评估
linkTitle: 评估
math: true
toc: true
weight: 3
---


### DataSet

`*class* pyalps.DataSet(x=None, y=None, props=None)`

- DataSet 类存储一组数据（通常为 XY 格式），以及描述这些数据的所有属性，例如模拟的输入参数等。

- 其成员包括：
   - x, y - 存放数据。许多作用于 DataSet 的函数都期望它们是 Numpy 数组的列表。不过，对于用户自定义的函数，也可以采用其他方式来表示数据。

   - props - 一个描述该数据集属性的字典。

### 工具

`pyalps.collectXY(sets, x, y, foreach=, []ignoreProperties=False)`
  从 DataSet 对象列表中收集指定的数据

- 该函数用于从 DataSet 对象列表中收集数据，以便准备绘图或进行评估。

- 参数为：

   - sets：数据集列表
   - x：用作所收集结果 x 值的属性或测量的名称
   - y：用作所收集结果 y 值的属性或测量的名称
   - foreach：可选的属性列表，用于对结果进行分组。对于指定参数的每一组不同取值，都会创建一个单独的 DataSet 对象。
   - ignoreProperties：设置 ignoreProperties=True 可使 collectXY() 不收集属性。
   
- 该函数返回一个 DataSet 对象列表。

`pyalps.groupSets(groups, for_each=[])`
  将 DataSet 对象列表分组为列表的列表

- 该函数根据 for_ech 参数中给出的属性的取值，将 DataSet 对象列表分组为列表的列表。for_each 中所给属性取值相同的 DataSet 对象会被归为一组。

- 参数为：
   - data：待分组的数据 for_each：对数据进行分组所依据的属性

`pyalps.select(inp, condition)`

`pyalps.select_by_property(data, proplist)`

`pyalps.mergeDataSets(dsets)`

`pyalps.mergeMeasurements(measurements)`


### 拟合封装

`pyalps.fit_wrapper.Parameter()`

`pyalps.fit_wrapper.fit(self, function, parameters, y, x=None)`

### 绘图

`pyalps.SetLabels(data, proplist)`

- 根据 ‘proplist’ 中给出的属性设置标签。

`pyalps.CycleColors(data, foreach, colors=['k', 'b', 'g', 'm', 'c', 'y'])`

- 根据 ‘foreach’ 中的属性，为用于显示各 DataSet 的线条/标记循环分配颜色。这意味着 ‘foreach’ 中属性取值相同的 DataSet 实例将获得相同的颜色。

`pyalps.CycleMarkers(data, foreach, markers=['s', 'o', '^', '>', 'v', '<', 'd', 'p', 'h', '+', 'x'])`

- 根据 ‘foreach’ 中的属性，为用于显示各 DataSet 的线条/标记循环分配标记符号。这意味着 ‘foreach’ 中属性取值相同的 DataSet 实例将获得相同的标记符号。

