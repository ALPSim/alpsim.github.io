---
title: 获取 ALPS
description: "如何使用 ALPS"
weight: 2
---

使用 `ALPS` 最简单的方式是从 `pypi.org` 安装预构建的 `Python` 包：

```
pip install pyalps
```


这将安装可在 `Python` 脚本或 `Jupyter` 笔记本中导入的 `ALPS` Python 包。

或者，您也可以按照以下说明从源码构建 ALPS：

```
git clone https://github.com/alpsim/ALPS alps-src
cmake -S alps-src -B alps-build                      \
         -DCMAKE_INSTALL_PREFIX=</path/to/install/dir>   \
         -DCMAKE_CXX_FLAGS="-DBOOST_NO_AUTO_PTR          \
         -DBOOST_TIMER_ENABLE_DEPRECATED                 \
         -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF"
cmake --build alps-build -j 8
cmake --build alps-build -t test
cmake --install alps-build
```


此操作将完成 `ALPS` 的下载、构建、测试及安装到指定路径的全过程。 如需获取更详细的指导说明和故障排除方案，请访问[安装文档页面](/documentation/install)。
