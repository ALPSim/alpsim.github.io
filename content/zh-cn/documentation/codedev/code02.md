
---
title: Code-02 C++
math: true
toc: true
weight: 3
---

本教程展示如何使用 C++ 编写蒙特卡洛模拟，并使用 ALPS alea 库来评估观测量。第二步，我们将把测量结果写入标准的 HDF5 文件格式，这样就可以使用 ALPS 套件中的工具进行进一步的数据分析和绘图。

作为一个简单的示例，我们将编写一个带局域更新的经典二维伊辛模型模拟。文件 `ising-skeleton.cpp` 包含一个骨架代码，其中已经具备了我们所需的全部基础设施：首先包含所有需要的头文件，然后初始化一个随机数生成器和三个 `alps::RealObservable` 对象。接着它建立一个伊辛自旋的正方晶格。它还提供了一个可用于 Metropolis 更新的概率表。其接口与你在上一个[教程](../../codedev/code01)中实现的 python 脚本相同。

你的任务同样是完成 `step()` 和 `measure()` 方法：`step()` 应从晶格中随机选取一个自旋，并以 Metropolis 概率 $p_{accept} = min(1,e^{-\beta \Delta E})$ 将其翻转，其中 $\Delta E$ 是该自旋翻转所引起的能量变化。`measure()` 计算自旋构型的能量和磁化强度，并将该样本添加到观测量对象中。

将所有省略号替换为代码后，你可以使用这个 `Makefile` 编译模拟：将 `Makefile` 保存到与 `.cpp` 文件相同的目录中，编辑第二行使其指向你的 ALPS 安装路径（如果你尚未设置环境变量 ALPS_ROOT），然后输入 `make`。这将生成一个可执行文件 `ising`。运行它，你将看到对 $\beta = 1/k_B T$ 不同取值的扫描。

你可以以完全相同的方式复用上一个教程中计算 Binder 累积量的 python 脚本：

    data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='ising.L*'),['m^2', 'm^4'])
    m2=pyalps.collectXY(data,x='BETA',y='m^2',foreach=['L'])
    m4=pyalps.collectXY(data,x='BETA',y='m^4',foreach=['L'])

    u=[]
    for i in range(len(m2)):
        d = pyalps.DataSet()
        d.propsylabel='U4'
        d.props = m2[i].props
        d.x= m2[i].x
        d.y = m4[i].y/m2[i].y/m2[i].y
        u.append(d)

并使用以下命令绘制 Binder 累积量：

    plt.figure()
    pyalps.pyplot.plot(u)
    plt.xlabel('Inverse Temperature $\beta$')
    plt.ylabel('Binder Cumulant U4 $g$')
    plt.title('2D Ising model')
    plt.show()
