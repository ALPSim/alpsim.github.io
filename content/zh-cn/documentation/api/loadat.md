
---
title: 加载数据
math: true
toc: true
weight: 2
---


`pyalps.getResultFiles(dirname='.', pattern=None, prefix=None, format=None)`
获取所有与给定模式或前缀匹配的结果文件

- 该函数从给定目录开始递归查找，返回所有与给定模式匹配的 ALPS 结果文件列表。可以通过给出文件的前缀来指定模式，此时会自动在其后加上 ALPS 默认的文件名后缀。或者，也可以指定一个完整的自定义正则表达式模式。

- 参数为：

   - dirname：开始递归搜索的目录，默认为当前工作目录。
   - pattern：限定待匹配文件的正则表达式模式
   - prefix：文件名开头必须匹配的模式。它会加上标准的 ALPS 文件名结尾 ‘.task.out.xml’ 或 ‘\*.h5’ 以构成完整的模式。

- 该函数返回一个文件名列表


`pyalps.loadMeasurements(files, what=None, verbose=False, respath='/simulation/results')`
从 ALPS HDF5 结果文件中加载 ALPS 测量结果

- 该函数从 ALPS HDF5 结果文件中加载 ALPS 模拟的结果

- 参数：
   - files (list) – ALPS 结果文件，可以是 XML 文件或 HDF5 文件。XML 文件名会被替换为对应的 HDF5 文件名。
   - what (list) – 可选参数，为一个字符串或字符串列表，指定需要加载的观测量的名称
   - verbose (bool) – 可选参数，若设为 True，则在加载数据时输出更多信息
- 返回值：
  DataSet 对象的列表的列表 – 加载的测量结果。外层列表的每个元素分别对应输入中指定的各个文件名。内层列表的每个元素分别对应不同的观测量。DataSet 对象的 y 值为测量值，x 值（可选）为数组型测量的标签（索引）

`pyalps.loadBinningAnalysis(files, what=None, verbose=False)`
从 ALPS HDF5 结果文件中加载 MC 分箱分析结果

- 该函数从 ALPS HDF5 结果文件中加载 MC 分箱分析的结果

- 参数：
   - files (list) – ALPS 结果文件，可以是 XML 文件或 HDF5 文件。XML 文件名会被替换为对应的 HDF5 文件名。
   - what (list) – 可选参数，为一个字符串或字符串列表，指定需要加载其分箱分析结果的观测量的名称
   - verbose (bool) – 可选参数，若设为 True，则在加载数据时输出更多信息
   
- 返回值：
  DataSet 对象的列表的列表 – 加载的分箱分析结果。外层列表的每个元素分别对应输入中指定的各个文件名。内层列表的每个元素分别对应不同的观测量。DataSet 对象的 x 值为对数分箱层级，y 值为该分箱层级下的误差估计。

`pyalps.loadEigenstateMeasurements(files, what=None, verbose=False)`
从 ALPS HDF5 结果文件中加载 ALPS 本征态测量结果

- 该函数从 HDF5 文件中加载 ALPS 对角化或 DMRG 模拟的结果

- 参数：
   - files (list) – ALPS 结果文件，可以是 XML 文件或 HDF5 文件。XML 文件名会被替换为对应的 HDF5 文件名。
   - what (list) – 可选参数，为一个字符串或字符串列表，指定需要加载的观测量的名称
   - verbose (bool) – 可选参数，若设为 True，则在加载数据时输出更多信息

- 返回值：
   DataSet 对象的列表的列表（的列表） – 加载的测量结果。外层列表的每个元素分别对应输入中指定的各个文件名。下一层列表的元素对应不同的量子数扇区（如果存在的话）。最内层列表的每个元素分别对应不同的观测量。DataSet 对象的 y 值是在该扇区中计算的所有本征态的测量值组成的数组，x 值（可选）为数组型测量的标签（索引）

`pyalps.loadSpectra(files, verbose=False)`
从 ALPS HDF5 结果文件中加载 ALPS 能谱

- 该函数从 HDF5 文件中加载 ALPS 对角化或 DMRG 模拟中计算得到的能谱。

- 参数：
   - files (list) – ALPS 结果文件，可以是 XML 文件或 HDF5 文件。XML 文件名会被替换为对应的 HDF5 文件名。
   - verbose (bool) – 可选参数，若设为 True，则在加载数据时输出更多信息。
- 返回值：
   DataSet 对象的列表（的列表） – 加载的能谱。外层列表的每个元素分别对应输入中指定的各个文件名。下一层列表的元素对应不同的量子数扇区（如果存在的话）。DataSet 对象的 y 值为该量子数扇区中的能量。

`pyalps.loadDMFTIterations(files, observable='G_tau', measurements='0', verbose=False)`
从 ALPS HDF5 结果文件中加载 ALPS 测量结果

- 该函数从 ALPS HDF5 结果文件中加载 ALPS 模拟的结果

- 参数：
   - files (list) – ALPS HDF5 结果文件。
   - observable (str) – 可选参数，指定需要加载的观测量的名称
   - measurements (list) – 可选参数，为一个字符串或字符串列表，指定需要加载的测量的名称
   - verbose (bool) – 可选参数，若设为 True，则在加载数据时输出更多信息
- 返回值：
   DataSet 对象的列表的列表的列表 – 加载的各次迭代的测量结果。外层列表的每个元素分别对应输入中指定的各个文件名。下一层列表的元素对应不同的迭代。内层列表对每个测量各包含一个 DataSet。DataSet 对象的 y 值为测量值，x 值（可选）为数组型测量的标签（索引）

`pyalps.loadProperties(files, proppath='/parameters', respath='/simulation/results', verbose=False)`
 从 ALPS HDF5 结果文件中加载模拟的属性（参数）

- 该函数从 ALPS HDF5 结果文件中加载 ALPS 模拟的属性（参数）

- 参数：
   - files (list) – ALPS 结果文件，可以是 XML 文件或 HDF5 文件。XML 文件名会被替换为对应的 HDF5 文件名。
   - verbose (bool) – 可选参数，若设为 True，则在加载数据时输出更多信息
- 返回值：
   字典列表 – 每个文件中包含的属性。

`pyalps.loadObservableList(files, proppath='/parameters', respath='/simulation/results', verbose=False)`
从 ALPS HDF5 结果文件中加载已有测量的列表

- 该函数返回一个列表的列表，其中包含存储在结果文件中的测量的名称

- 参数：
   - files (list) – ALPS 结果文件，可以是 XML 文件或 HDF5 文件。XML 文件名会被替换为对应的 HDF5 文件名。
   - verbose (bool) – 可选参数，若设为 True，则在加载数据时输出更多信息
