
---
title: ALPS Installation on Mac/Linux from Sources
description: "ALPS Installation"
weight: 2
toc: true
cascade:
    type: docs
---

For most cases, it is preferred to [install ALPS from Binaries](./binary.md). However, for more user control and configuration, installing from Sources could be a better approach. 
{{% steps %}}

### Install Required Dependencies

ALPS relies on a handful of external libraries. 
Choose **one** MPI and **one** BLAS provider that fit your system:

| Dependency | Minimum version | Packages
|----------|--------------------|---------------------------|
| HDF5     | 1.10.0 | `libhdf5-dev`|
| CMake | 2.8 | `cmake`|
| C++ Compiler | GCC 10.5.0 & Clang 13.0.1 | `build-essential` |
| Boost | 1.76 <br>*(1.87 if NumPy >= 2.0 / Python >= 3.13)* | see below |
| MPI | OpenMPI 4.0 **or** MPICH 4.0 | `libopenmpi-dev` / `libmpich-dev`|
| BLAS | 0.3 | `libopenblas-dev`
| Python | 3.9 | [python.org](https://www.python.org/) |


<br>
      
<details>
<summary><strong> Ubuntu / Debian / WSL</strong> </summary>
 
 
  ```ShellSession
$ sudo apt update
$ sudo apt install build-essential cmake \
                   libhdf5-dev \
                   libopenblas-dev \
                   libopenmpi-dev openmpi-bin # or: libpich-dev mpich

# download and install Boost v1.81.0:
$ wget https://archives.boost.io/release/1.81.0/source/boost_1_81_0.tar.gz
$ tar -xzf boost_1_81_0.tar.gz

# install Python libs:
$ pip install numpy scipy # python libraries 
# or 
$ python3 -m pip install numpy scipy
```
</details>
<details>
<summary><strong> macOS (via Homebrew)</strong> </summary>

 ```ShellSession
$ brew update
$ brew install cmake hdf5 \
               openblas open-mpi # or: mpich

# download and install Boost:
$ brew install boost

# install Python libs:
$ pip3 install numpy scipy 
```
</details>

### Verify Dependencies

 ```ShellSession
$ gcc -v #  must be >= 10.5.0
$ cmake --version # must be >= 3.18
$ mpirun --version # OpenMPI 4.0 or MPICH 4
```

### Download and Build
We can now proceed to download and build the `ALPS` library. <br>
In the snippet below, please replace `/path/to/install/directory` with the actual directory on your system you want ALPS to be installed.

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

### Video Walkthrough
<br>

{{< youtube id="MDjmNiEZFT4" >}}


<details>
<summary><strong>Troubleshooting</strong></summary>

* **Need a different MPI or BLAS?**  <br> Substitute the package names above with your cluster's module (e.g. [Intel MKL/OneAPI](https://www.intel.com/content/www/us/en/developer/tools/oneapi/onemkl.html), [AMD AOCL](https://www.amd.com/en/developer/aocl.html), [IBM ESSL](https://www.ibm.com/docs/en/essl/6.2?topic=whats-new), etc). [Cmake](https://cmake.org/) is a build system that will find the locations of the above packages and generate compilation instructions in Makefiles.
* **Python errors** <br> Ensure you are using Python 3.9 at a minimum. Note: some installations (e.g. macOS) use `pip3` instead of pip. Refer to the [python website](https://www.python.org/) for support in installing the correct version.
* **MPI mismatch?**   <br> Ensure that CMake is using the same MPI version as `mpirun --version`
* **Boost errors** <br > We have tested building `ALPS` with `Boost` versions `1.76.0` through `1.81.0` (please refere to the [build notes](#build-notes) for the combination of supported `boost` versions with different compilers and Python version)

</details>

#### Build notes

{{% tabs items="Linux,Mac" %}}
{{% tab %}}
The following combinations of `Boost`, Python and the C++ compiler have been tested:
  - GCC 10.5.0, Python 3.9.19 and `Boost` 1.76.0
  - GCC 11.4.0, Python 3.10.14 and `Boost` 1.81.0, 1.86.0
  - GCC 12.3.0, Python 3.10.14 and `Boost` 1.81.0, 1.86.0
  - Clang 13.0.1, Python 3.10.14 and `Boost` 1.81.0, 1.86.0
  - Clang 14.0.0, Python 3.10.14 and `Boost` 1.81.0, 1.86.0
  - Clang 15.0.7, Python 3.10.14 and `Boost` 1.81.0, 1.86.0
{{% /tab %}}
{{% tab %}}
ALPS has been tested on ARM-based MacOS systems using both the default compiler and the `Homebrew` gcc compiler (with `Boost` 1.86.0).
On MacOS >=14.6 in order to succesfully build ALPS using Homebrew gcc compiler, the following environment variable have to be set:

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

After successfully building the code, you will need to install it. The install location is specified with `-DCMAKE_INSTALL_PREFIX=/path/to/install/directory` as a cmake command during configuration. Alternatively, it can be changed by explicitly providing a new installation path to the `--prefix` parameter during the installation phase (see [cmake manual](https://cmake.org/cmake/help/latest/manual/cmake.1.html#cmdoption-cmake--install-0)).
<br>
To install the code run:

  ```ShellSession
  $ cmake --install alps-build
  ```
Your install directory will be created; if everything was successful you can find ALPS executables such as `mc` or `fulldiag` under the bin directory of your installation path.

{{% /steps %}}


