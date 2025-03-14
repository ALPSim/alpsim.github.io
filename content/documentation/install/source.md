
---
title: ALPS Installation on Mac/Linux from Sources
description: "ALPS Installation"
weight: 2
toc: true
cascade:
    type: docs
---

{{% steps %}}

### Prerequisites: HPC libraries and tools
Please make sure to have the following third-party software installed and available:

  * Third-Party Dependencies
    - MPI
    - HDF5 >= 1.10.0
    - BLAS
    - CMake >= 2.8
    - Python >= 3.9 (if Python bindings are enabled)
    - Boost sources >= 1.68
      - Boost 1.87.0 is needed if you have numpy 2.0 and newer or Python 3.13 and newer

  These packages are external to ALPS. Their installation will depend on your computer. MPI is the Message Passing Interface, several standard implementations exist, including [OpenMPI](https://www.open-mpi.org/) and [MPICH](https://www.mpich.org/).
  High performance computers will have proprietary MPI installations, and most clusters provide a version for all users. [HDF5](https://www.hdfgroup.org/solutions/hdf5/) is a library for binary data storage. 
  More information on BLAS, the Basic Linear Algebra System, can be found on [netlib.org](netlib.org). However, most computers provide highly optimized versions tuned for their respective hardware. 
  Do NOT install the reference BLAS from netlib but instead have a look at a generic high-performance implementation from [OpenBLAS](https://www.openblas.net/) and the hardware-specific vendor libraries 
  (among many others: [Apple](https://developer.apple.com/documentation/accelerate/blas/), [Intel MKL/OneAPI](https://www.intel.com/content/www/us/en/developer/tools/oneapi/onemkl.html), [AMD AOCL](https://www.amd.com/en/developer/aocl.html),
  [IBM ESSL](https://www.ibm.com/docs/en/essl/6.2?topic=whats-new)). [Cmake](https://cmake.org/) is a build system that will find the locations of the above packages and generate compilation instructions in Makefiles.

### Prerequisites: Python Libraries
Please make sure to have python and the following dependencies:

   * Third-Party Python Dependencies
     - numpy
     - scipy

  These are third-party packages that you can install using your favorite python package manager, such as pip:
  ```ShellSession
  $ pip install numpy scipy
  ```

  The minimal supported python version is 3.9 (any minor version up to 3.12.x should work). Note that some installations use pip3 instead of pip, for help on python package installation see https://pypi.org/project/pip/ .

### Prerequisites: Boost sources

Download and unpack boost library. The following will download and unpack Boost `v1.81.0`
  ```ShellSession
  $ wget https://archives.boost.io/release/1.81.0/source/boost_1_81_0.tar.gz
  $ tar -xzf boost_1_81_0.tar.gz
  ```

We have tested building `ALPS` with `Boost` versions `1.76.0` through `1.81.0` (please refere to the [build notes](#build-notes) for the combination of supported `boost` versions with different compilers and Python version)

### Download and Build
The following instructions will download and build `ALPS` (replace /path/to/install/directory with the directory where you'd like to install the code):

  ```ShellSession
  $ git clone https://github.com/alpsim/ALPS alps-src
  $ cmake -S alps-src -B alps-build                                     \
         -DCMAKE_INSTALL_PREFIX=</path/to/install/dir>                  \
         -DBoost_SRC_DIR=</directory/with/boost/sources>/boost_1_81_0  \
         -DCMAKE_CXX_FLAGS="-DBOOST_NO_AUTO_PTR                         \
         -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF"
  $ cmake --build alps-build -j 8
  $ cmake --build alps-build -t test
  ```

#### Build notes

{{% tabs items="Linux,Mac" %}}
{{% tab %}}
The following combinations of `Boost`, Python and c++ compiler have been tested:
  - GCC 10.5.0, Python 3.9.19 and `Boost` 1.76.0
  - GCC 11.4.0, Python 3.10.14 and `Boost` 1.81.0, 1.86.0
  - GCC 12.3.0, Python 3.10.14 and `Boost` 1.81.0, 1.86.0
  - Clang 13.0.1, Python 3.10.14 and `Boost` 1.81.0, 1.86.0
  - Clang 14.0.0, Python 3.10.14 and `Boost` 1.81.0, 1.86.0
  - Clang 15.0.7, Python 3.10.14 and `Boost` 1.81.0, 1.86.0
{{% /tab %}}
{{% tab %}}
`ALPS` has been tested on ARM-based MacOS using both default compiler and `Homebrew` gcc compiler with `Boost` 1.86.0.
On MacOS >=14.6 in order to succesfully build `ALPS` using Homebrew gcc compiler, the following environment variable have to be set:

```ShellSession
export SDKROOT=/Library/Developer/CommandLineTools/SDKs/MacOSX14.sdk/
```

{{% /tab %}}

{{% /tabs %}}

If you have a non-standard installation location of the dependent packages installed in step 1, cmake will fail to find the package. ALPS uses the standard cmake mechanism (FindXXX.cmake) to find packages. The following pointers may help:
  - For MPI: Follow the instructions on [cmake with mpi](https://cmake.org/cmake/help/latest/module/FindMPI.html)
  - For BLAS: Follow the instructions on [cmake with BLAS](https://cmake.org/cmake/help/latest/module/FindBLAS.html)
  - For HDF5: Follow the instructions on [cmake with HDF5](https://cmake.org/cmake/help/latest/module/FindHDF5.html)

***

After successfully building the code, you will need to install it. The install location is specified with `-DCMAKE_INSTALL_PREFIX=/path/to/install/directory` as a cmake command during configuration or can be 
changed by explicitly providing a new installation path to the `--prefix` parameter during the installation phase (see [cmake manual](https://cmake.org/cmake/help/latest/manual/cmake.1.html#cmdoption-cmake--install-0)).
To install the code run:

  ```ShellSession
  $ cmake --install alps-build
  ```
Your install directory will be created; if everything was successful you can find ALPS executables such as `mc' or `fulldiag' under the bin directory of your installation path.

{{% /steps %}}


