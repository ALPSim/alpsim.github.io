---
title: 入门指南
description: "ALPS 简介及安装方法"
weight: 1
toc: true
---

ALPS 是一款用于模拟关联系统的软件包。它提供了经典蒙特卡洛、量子蒙特卡洛以及密度矩阵重整化群等模拟程序。

## 获取 ALPS

使用 `ALPS` 最简单的方式是安装预构建的 Python 包：

```ShellSession
$ pip install pyalps
```

如需更多安装选项（例如支持高性能计算环境），请选择以下安装方式：

<div class="btn-grid">
{{< cta-button text="二进制安装" link="/documentation/install/binary" icon="download" >}}
{{< cta-button text="源码安装" link="/documentation/install/source" icon="code" >}}
{{< cta-button text="Spack 安装" link="/documentation/install/spack" icon="inventory_2" >}}
</div>

## 快速入门教程

安装 ALPS 后，可尝试以下快速入门示例：

- [经典蒙特卡洛](mc) — 二维 Ising 模型相变
- [量子蒙特卡洛](qmc) — 使用杂化展开求解器模拟 Kondo 屏蔽
- [密度矩阵重整化群](dmrg) — Heisenberg 链的基态能量
- [精确对角化](ed) — 自旋链的三重态能隙
