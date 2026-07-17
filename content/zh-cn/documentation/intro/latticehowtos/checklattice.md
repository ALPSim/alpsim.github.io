
---
title: Check Lattice Graph
toc: true
weight: 6
---

写好一个新的格子定义之后，在真正用它运行模拟之前，你会想先检查一下它是否正确。ALPS 为此提供了 `printgraph` 工具：它读取一个参数文件，根据其中指定的 `LATTICE`（或 `GRAPH`）来构建图——这与 ALPS 应用程序在内部构建图的方式完全相同——然后把得到的图以 `<GRAPH>` XML 的形式打印出来，列出其中的每一个 `<VERTEX>` 和 `<EDGE>`。将这个输出与你的预期进行比较，可以快速发现诸如延伸范围错误、缺少键、边界条件错误之类的问题。

要运行它，请输入：

    printgraph parameter_file

`parameter_file` 是一个普通的 ALPS 参数文件——与 `parameter2xml` 的输入格式相同，因此不需要事先做任何转换。如果不指定文件名，`printgraph` 会改为从标准输入读取参数文件；如果文件名以 `.xml` 结尾，则会作为 XML 参数文件读取。

例如，下面这个参数文件

    LATTICE = "square lattice"
    L = 2

选择了内置的 `square lattice`（参见[格子与图的库](../library)），延伸范围为 2 x 2，边界条件为周期性。对它运行 `printgraph` 会得到：

    <GRAPH dimension="2" vertices="4" edges="8">
      <VERTEX id="1" type="0"><COORDINATE>0 0</COORDINATE></VERTEX>
      <VERTEX id="2" type="0"><COORDINATE>0 1</COORDINATE></VERTEX>
      <VERTEX id="3" type="0"><COORDINATE>1 0</COORDINATE></VERTEX>
      <VERTEX id="4" type="0"><COORDINATE>1 1</COORDINATE></VERTEX>
      <EDGE source="1" target="2" id="1" type="0" vector="0 1"/>
      <EDGE source="1" target="3" id="2" type="0" vector="1 0"/>
      <EDGE source="2" target="1" id="3" type="0" vector="0 1"/>
      <EDGE source="2" target="4" id="4" type="0" vector="1 0"/>
      <EDGE source="3" target="4" id="5" type="0" vector="0 1"/>
      <EDGE source="3" target="1" id="6" type="0" vector="1 0"/>
      <EDGE source="4" target="3" id="7" type="0" vector="0 1"/>
      <EDGE source="4" target="2" id="8" type="0" vector="1 0"/>
    </GRAPH>

4 个格点各自作为一个带坐标的 `<VERTEX>` 出现一次，8 条键各自作为一个 `<EDGE>` 出现一次。由于周期边界条件，除了"直连"的键之外，还生成了环绕的键（例如 `source="2" target="1"`）。对于较大或不熟悉的格子，可以把输出重定向到文件中（`printgraph parameter_file > graph.xml`），这样更便于查看。

---

关于本节其余内容的概览，请参见[格子的定义](..)。关于在模拟中按名称选择格子或图所用的 `LATTICE`／`GRAPH` 输入参数，请参见[常用参数](../../parameters)。关于其他 ALPS 文档章节，请参见[简介](../..)。
