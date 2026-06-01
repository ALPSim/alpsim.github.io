
---
title: ALPS Installation on Mac/Linux from Sources
description: "ALPS Installation"
weight: 2
toc: true
cascade:
    type: docs
---

For most cases, it is preferred to [install ALPS from Binaries](../binary). However, for more user control and configuration, installing from Sources could be a better approach. 
{{% steps %}}

### Install Required Dependencies

ALPS relies on a handful of external libraries. 
Choose **one** MPI and **one** BLAS provider that fit your system:

| Dependency | Minimum version | Packages
|----------|--------------------|---------------------------|
| HDF5     | 1.10.0 | `libhdf5-dev`|
| CMake | 3.18 | `cmake`|
| C++ Compiler | GCC 10.5.0 & Clang 13.0.1 | `build-essential` |
| Boost | 1.76 <br>*(1.87 required to build ALPS Python bindings against NumPy ≥ 2.0)* | see below |
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
                   libopenmpi-dev openmpi-bin # or: libmpich-dev mpich

# install Python libs:
$ pip install numpy scipy # python libraries 
# or 
$ python3 -m pip install numpy scipy
```

> **Note:** Do not install Boost via `apt`. ALPS builds Boost from source to ensure
> ABI compatibility. CMake auto-downloads Boost 1.87 during configuration (requires
> internet access). See the offline alternative in the build step below if needed.
</details>
<details>
<summary><strong> macOS (via Homebrew)</strong> </summary>

 ```ShellSession
$ brew update
$ brew install cmake hdf5 \
               openblas open-mpi # or: mpich

# install Python libs:
$ pip3 install numpy scipy
```

> **Note:** Do not install Boost via Homebrew. ALPS builds Boost from source to ensure
> ABI compatibility. If `Boost_SRC_DIR` is not set, CMake auto-downloads Boost 1.87
> during configuration (requires internet access). Alternatively, download it manually:
> ```ShellSession
> $ curl -LO https://archives.boost.io/release/1.87.0/source/boost_1_87_0.tar.gz
> $ tar -xzf boost_1_87_0.tar.gz
> ```
</details>
<details>
<summary><strong> macOS (via MacPorts)</strong> </summary>

```ShellSession
$ sudo port selfupdate
$ sudo port install cmake \
                   hdf5 \
                   OpenBLAS \
                   openmpi-clang20   # see note below about choosing a variant
$ sudo port select --set mpi openmpi-clang20-fortran

# install Python libs:
$ pip3 install numpy scipy
```

> **Choosing an OpenMPI variant:** MacPorts ships a separate port for each compiler
> version, named `openmpi-<compiler><version>` (e.g. `openmpi-clang20`,
> `openmpi-gcc15`). The `clang20` variant shown above matches the LLVM Clang 20 port
> and works alongside Apple's Xcode clang. If you use a different compiler, install the
> matching variant and adjust the `port select` command accordingly.
>
> The `port select` step is required: without it, the bare `mpirun`, `mpicc`, and
> `mpicxx` wrappers that CMake looks for will not exist.

> **Note:** Do not install Boost via MacPorts. ALPS builds Boost from source to ensure
> ABI compatibility. If `Boost_SRC_DIR` is not set, CMake auto-downloads Boost 1.87
> during configuration (requires internet access). Alternatively, download it manually:
> ```ShellSession
> $ curl -LO https://archives.boost.io/release/1.87.0/source/boost_1_87_0.tar.gz
> $ tar -xzf boost_1_87_0.tar.gz
> ```
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
         -DCMAKE_CXX_FLAGS="-DBOOST_NO_AUTO_PTR                         \
         -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF"
  $ cmake --build alps-build -j 8
  $ cmake --build alps-build -t test
  ```

> **Boost is downloaded automatically.** If `Boost_SRC_DIR` is not set, CMake fetches
> Boost 1.87 during configuration (requires internet access). To build offline or reuse a
> previously extracted archive, pass the path explicitly:
> ```ShellSession
> $ cmake -S alps-src -B alps-build                                     \
>        -DCMAKE_INSTALL_PREFIX=</path/to/install/dir>                  \
>        -DBoost_SRC_DIR=</path/to/boost_1_87_0>                        \
>        -DCMAKE_CXX_FLAGS="-DBOOST_NO_AUTO_PTR                         \
>        -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF"
> ```


### Troubleshooting
<details>
* **Need a different MPI or BLAS?**  <br> Substitute the package names above with your cluster's module (e.g. [Intel MKL/OneAPI](https://www.intel.com/content/www/us/en/developer/tools/oneapi/onemkl.html), [AMD AOCL](https://www.amd.com/en/developer/aocl.html), etc). [Cmake](https://cmake.org/) is a build system that will find the locations of the above packages and generate compilation instructions in Makefiles.
* **Python errors** <br> Ensure you are using Python 3.9 at a minimum. Note: some installations (e.g. macOS) use `pip3` instead of pip. Refer to the [python website](https://www.python.org/) for support in installing the correct version.
* **MPI mismatch?**   <br> Ensure that CMake is using the same MPI version as `mpirun --version`
* **Boost errors** <br> Building ALPS' Python bindings against NumPy ≥ 2.0 requires Boost ≥ 1.87 (NumPy 2.0 introduced API changes that only Boost 1.87+ handles). Boost 1.76–1.86 work only with NumPy < 2.0. See the [build notes](#build-notes) for tested compiler/Boost/Python combinations.

</details>

#### Build notes

{{% tabs items="Linux,Mac" %}}
{{% tab %}}
The following combinations of `Boost`, Python and the C++ compiler have been tested:
  - GCC 10.5.0, Python 3.9.19 (NumPy < 2.0) and `Boost` 1.76.0
  - GCC 11.4.0, Python 3.10.14 (NumPy < 2.0) and `Boost` 1.81.0, 1.86.0
  - GCC 12.3.0, Python 3.10.14 (NumPy < 2.0) and `Boost` 1.81.0, 1.86.0
  - Clang 13.0.1, Python 3.10.14 (NumPy < 2.0) and `Boost` 1.81.0, 1.86.0
  - Clang 14.0.0, Python 3.10.14 (NumPy < 2.0) and `Boost` 1.81.0, 1.86.0
  - Clang 15.0.7, Python 3.10.14 (NumPy < 2.0) and `Boost` 1.81.0, 1.86.0

  For **NumPy ≥ 2.0**, `Boost` 1.87.0 or later is required for ALPS' Boost.Python bindings (CMake downloads this automatically).
{{% /tab %}}
{{% tab %}}
ALPS has been tested on ARM-based MacOS systems using both the default compiler and the `Homebrew` gcc compiler (with `Boost` 1.86.0, NumPy < 2.0).
On MacOS >=14.6 in order to successfully build ALPS using Homebrew gcc compiler, the following environment variable must be set:

```ShellSession
export SDKROOT=/Library/Developer/CommandLineTools/SDKs/MacOSX14.sdk/
```

**Python selection:** CMake may pick up the Xcode system Python (3.9) rather than your
Homebrew or MacPorts Python. If you see the wrong Python version during configuration,
pin it explicitly:

```ShellSession
$ cmake -S alps-src -B alps-build \
       ... \
       -DPython3_EXECUTABLE=$(which python3)
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
Your install directory will be created; if everything was successful you can find ALPS executables such as `spinmc` or `fulldiag` under the bin directory of your installation path.

{{% /steps %}}

### Video Walkthrough
<br>

{{< youtube id="OHQGfDDaRMk" >}}

