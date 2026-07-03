
---
title: Alpsize-02 Fortran 入门
math: true
toc: true
weight: 3
---

本章是 ALPS Fortran 的入门教程，介绍如何安装和使用 ALPS Fortran。请注意，本教程假设读者具备 Fortran 编程基础知识。

## 运行环境

ALPS Fortran 是一个用于在 ALPS 系统上运行 Fortran 代码的封装库。因此，使用 ALPS Fortran 需要以下环境：

|       |          |
| :---- | :------- |
| ALPS  | 关于 ALPS 的运行环境和安装流程，请参见相关页面 |
| CMake | 编译客户端代码和 ALPS Fortran 均使用 CMake（CMake 2.8.0 及以上版本） |
| Fortran 编译器（Gnu/Intel/Fujitsu） | 需要与构建 ALPS 时所用的相同编译器。各编译器的安装流程请参阅各自的手册 |

## 安装

ALPS Fortran 以补丁文件的形式提供，通过对 ALPS 系统打补丁即可使用。ALPS Fortran 的补丁应用步骤如下：

1. 下载补丁

从以下 URL 下载：

    $ cd ~/
    $ wget http://xxx.xxx/alps_fortran.tar.gz
    $ tar –zxvf alps_fortran.tar.gz

执行上述步骤后，将创建以下文件和目录：

    alps_fortran/
        + alps_fortran.patch
        +samples/
            +hello/
            +ising/
            +looper-2/
            +tutorial/

2. 应用补丁

进入 ALPS 源代码目录（${ALPS_SRC}），应用补丁：

    $ cd ${ALPS_SRC}
    $ patch –p0 < ~/alps_fortran/alps_fortran.patch

3. 构建并安装 ALPS 系统

按照官方手册构建 ALPS 系统时，ALPS Fortran 也会一同安装。

- ${ALPS_ROOT}/lib/libalps_fortran.a
- ${ALPS_ROOT}/include/alps/fortran/alps_fortran.h
- ${ALPS_ROOT}/include/alps/fortran/fortran_wrapper.h
- ${ALPS_ROOT}/include/alps/fortran/fwrapper_impl.h
- ${ALPS_ROOT} 表示 ALPS 的安装目录

## 示例源代码

ALPS Fortran 包含以下示例代码：

"hello" 应用程序

- 不执行任何计算，仅将参数文件的内容输出到标准输出。

"ising" 应用程序
- Ising 模型计算的示例应用程序。

"looper-2" 应用程序
- 使用外部库的应用程序示例。

从下一节开始，将介绍如何构建和运行 hello 应用程序。ising 和 looper-2 应用程序也可按照与 hello 相同的步骤进行构建和运行。

### "hello" 应用程序

hello 应用程序由以下文件组成：
- `hello_impl.f90`：主程序
- `hello.C`：设置入口点
- `hello_params`：参数文件
- `CMakeLists.txt`：配置文件

### 编译

编译步骤如下：

1. 创建构建工作目录

创建用于存放 "hello" 应用程序构建结果的工作目录：

    $ mkdir –p ${HOME}/alps_fortran_build/hello
    $ cd ${HOME}/alps_fortran_build/hello

2. 运行 cmake

指定源代码目录并运行 cmake（${SAMPLES} 是解压 ALPS Fortran 后生成的示例文件夹）：

    $ cmake –DALPS_ROOT:PATH=${ALPS_ROOT} \
    >       ${SAMPLES}/hello

3. 构建 "hello" 应用程序

运行 cmake 命令后将生成 Makefile 等构建所需文件，然后运行 make：

    $ make

构建完成后，当前目录下将生成可执行文件 "hello"。

### 线程级并行化

线程级并行化步骤如下：

1. 进入工作目录

进入构建 "hello" 应用程序时创建的工作目录：

    $ cd ${HOME}/alpls_fortran_build/hello

请注意，如果工作目录中存在执行结果文件（`hello_param.out.*`），应用程序将无法运行。若存在此类文件，请在进行下一步之前将其全部删除。

2. 准备参数文件

从 {SAMPLES}/hello 中的参数文件生成 XML 文件：

    $ cp ${SAMPLES}/hello/hello_params .
    $ parameter2xml hello_params

关于 `parameter2xml` 命令，请参阅 ALPS 官网。

3. 运行 "hello"

按如下方式运行应用程序：

    $ ./hello hello_params.in.xml

运行 hello 应用程序后，`hello_params` 中定义的参数将输出到标准输出。以下是执行结果的节选：

    ##### alps_init() #####
    parameter X     =    3.2000000000000002
    parameter Y     =            0
    parameter WORLD = world
    defined parameter Z =            1
    
[2011-May-13 11:45:42]: dispatching a new clone[1,1] on threadgroup[3]

    ##### alps_init() #####
    parameter X     =   -3.1000000000000001
    parameter Y     =            6
    parameter WORLD = alps
    defined parameter Z =            0
    
[2011-May-13 11:45:42]: dispatching a new clone[2,1] on threadgroup[8]

    ##### alps_init() #####
    parameter X     =   1.00000000000000002E-003
    parameter Y     =         -100
    parameter WORLD = looper
    defined parameter Z =            0
    
[2011-May-13 11:45:43]: dispatching a new clone[3,1] on threadgroup[7]
[2011-May-13 11:45:43]: clone[3,1] finished on threadgroup[7]

    ##### alps_init() #####
    parameter X     =    100.00000000000000
    parameter Y     =            2
    parameter WORLD = japan
    defined parameter Z =            0
    
[2011-May-13 11:45:43]: dispatching a new clone[4,1] on threadgroup[1]
[2011-May-13 11:45:43]: clone[4,1] finished on threadgroup[1]

    ##### alps_init() #####
    parameter X     =    3.0000000000000000
    parameter Y     =            0
    parameter WORLD = wistaria
    defined parameter Z =            0

### MPI 并行化

MPI 并行化步骤如下：

1. 进入工作目录

进入构建 "hello" 应用程序时创建的工作目录：

    $ cd ${HOME}/alpls_fortran_build/hello

请注意，如果工作目录中存在执行结果文件（`hello_param.out.*`），应用程序将无法运行。若存在此类文件，请在进行下一步之前将其全部删除。

2. 准备参数文件

从 {SAMPLES}/hello 中的参数文件生成 XML 文件：

    $ cp ${SAMPLES}/hello/hello_params .
    $ parameter2xml hello_params

3. 运行应用程序

按如下方式运行应用程序：

    $ mpirun -np 4 -x OMP_NUM_THREADS=1 ./hello --mpi hello_params.in.xml

与上述相同，`hello_params` 中定义的参数将输出到标准输出。
