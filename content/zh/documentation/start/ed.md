---
title: 精确对角化
linkTitle: 精确对角化
description: "如何使用 ALPS"
weight: 6
---

作为稀疏矩阵精确对角化方法的示例，我们将获得自旋链模型的三重态能隙作为系统大小的函数。

第一步是导入所需的包。

```Python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
import pyalps.fit_wrapper as fw
```

然后我们准备每组输入参数并将它们写入 `ALPS` 期望的格式。
```Python
parms = []
for l in [4, 6, 8, 10, 12, 14, 16]:
  for sz in [0, 1]:
      parms.append(
        {
          'LATTICE'                   : "chain lattice",
          'MODEL'                     : "spin",
          'local_S'                   : 1,
          'J'                         : 1,
          'L'                         : l,
          'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
          'Sz_total'                  : sz
        }
      )

#写入输入文件并运行模拟
input_file = pyalps.writeInputFiles('parm2a',parms)
```

然后我们对每组参数运行 sparsediag：
```Python
res = pyalps.runApplication('sparsediag',input_file)
```

我们随后加载所有状态的测量数据：
```Python
data = pyalps.loadSpectra(pyalps.getResultFiles(prefix='parm2a'))
```

并提取每个模拟中所有动量的基态能量。
```Python
lengths = []
min_energies = {}
for sim in data:
  l = int(sim[0].props['L'])
  if l not in lengths: lengths.append(l)
  sz = int(sim[0].props['Sz_total'])
  all_energies = []
  for sec in sim:
    all_energies += list(sec.y)
  min_energies[(l,sz)]= np.min(all_energies)
```

最后，我们绘制三重态能隙作为系统大小函数的图表。
```Python
gapplot = pyalps.DataSet()
gapplot.x = 1./np.sort(lengths)
gapplot.y = [min_energies[(l,1)] -min_energies[(l,0)] for l in np.sort(lengths)]
gapplot.props['xlabel']='$1/L$'
gapplot.props['ylabel']='三重态能隙 $\Delta/J$'
gapplot.props['label']='S=1'
gapplot.props['line']='.'

plt.figure()
pyalps.plot.plot(gapplot)
plt.legend()
plt.xlim(0,0.25)
plt.ylim(0,1.0)

pars = [fw.Parameter(0.411), fw.Parameter(1000), fw.Parameter(1)]
f = lambda self, x, p: p[0]()+p[1]()*np.exp(-x/p[2]())
# 我们只拟合从 8 到 16 的范围
fw.fit(None, f, pars, np.array(gapplot.y)[2:], np.sort(lengths)[2:])

x = np.linspace(0.0001, 1./min(lengths), 100)
plt.plot(x, f(None, 1/x, pars))

plt.show()
```

最终结果应该如下所示：
![ED](/figs/ED_spin.png)
