---
title: Obtaining ALPS
description: "How to use ALPS"
weight: 2
---


The simplest way to start using `ALPS` is to install a prebuilt `Python` package from `pypi.org`:

  ```ShellSession
  $ pip install pyalps
  ```
This will install the `ALPS` python package that can be imported in either `Python` script or a `Jupyter` notebook.


---
Alternatively, you can build ALPS from sources by following the instruction below:

  ```ShellSession
  $ git clone https://github.com/alpsim/ALPS alps-src
  $ cmake -S alps-src -B alps-build                      \
         -DCMAKE_INSTALL_PREFIX=</path/to/install/dir>   \
         -DCMAKE_CXX_FLAGS="-DBOOST_NO_AUTO_PTR          \
         -DBOOST_TIMER_ENABLE_DEPRECATED                 \
         -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF"
  $ cmake --build alps-build -j 8
  $ cmake --build alps-build -t test
  $ cmake --install alps-build
  ```

This will download, build, test and install `ALPS` into a specified path.
For more detailed instructions and troubleshootings, please check out the [installation page](/documentation/install).
