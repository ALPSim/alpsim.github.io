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
> **Note (zsh):** If you paste the commands below into `zsh`, inline `# ...` comments require `setopt INTERACTIVE_COMMENTS` (or remove the comments before pasting).

  ```ShellSession
sudo apt update
sudo apt install build-essential cmake \
                   libhdf5-dev \
                   libopenblas-dev \
                   libopenmpi-dev openmpi-bin # or: libmpich-dev mpich

# install Python libs:
pip install numpy scipy # python libraries 
# or 
python3 -m pip install numpy scipy
```

> **Do not install Boost via `apt`.** ALPS must compile Boost from source for two reasons:
> 1. **Custom compiler flags** — ALPS requires `-DBOOST_NO_AUTO_PTR` and
>    `-DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF` for C++17/20 compatibility; the
>    `libboost-dev` packages do not set these, causing link errors.
> 2. **Python-ABI match** — the `Boost.Python` component must be compiled against the
>    exact Python interpreter that ALPS will use. Pre-built packages target the system
>    Python and will silently mismatch if you use a different one.
>
> CMake handles both automatically: it downloads and compiles Boost 1.87 during
> configuration (requires internet access). See the offline alternative in the build
> step below if needed.
</details>
<details>
<summary><strong> macOS (via Homebrew)</strong> </summary>

 ```ShellSession
brew update
brew install cmake hdf5 \
               openblas open-mpi # or: mpich

# install Python libs:
pip3 install numpy scipy
```

> **Do not install Boost via Homebrew.** ALPS must compile Boost from source for two reasons:
> 1. **Custom compiler flags** — ALPS requires `-DBOOST_NO_AUTO_PTR` and
>    `-DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF` for C++17/20 compatibility; the
>    Homebrew `boost` formula does not set these, causing link errors.
> 2. **Python-ABI match** — the `Boost.Python` component must be compiled against the
>    exact Python interpreter that ALPS will use. The Homebrew Boost targets Homebrew's
>    own Python and will silently mismatch any other interpreter.
>
> CMake handles both automatically: if `Boost_SRC_DIR` is not set, it downloads and
> compiles Boost 1.87 during configuration (requires internet access). To build offline
> or reuse a previously extracted archive, download it manually first:
> ```ShellSession
> curl -LO https://archives.boost.io/release/1.87.0/source/boost_1_87_0.tar.gz
> tar -xzf boost_1_87_0.tar.gz
> ```
</details>
<details>
<summary><strong> macOS (via MacPorts)</strong> </summary>

```ShellSession
sudo port selfupdate
sudo port install cmake \
                   hdf5 \
                   OpenBLAS \
                   openmpi-clang20   # see note below about choosing a variant
sudo port select --set mpi openmpi-clang20-fortran

# install Python libs:
pip3 install numpy scipy
```

> **Choosing an OpenMPI variant:** MacPorts ships a separate port for each compiler
> version, named `openmpi-<compiler><version>` (e.g. `openmpi-clang20`,
> `openmpi-gcc15`). The `clang20` variant shown above matches the LLVM Clang 20 port
> and works alongside Apple's Xcode clang. If you use a different compiler, install the
> matching variant and adjust the `port select` command accordingly.
>
> The `port select` step is required: without it, the bare `mpirun`, `mpicc`, and
> `mpicxx` wrappers that CMake looks for will not exist.

> **Do not install Boost via MacPorts.** ALPS must compile Boost from source for two reasons:
> 1. **Custom compiler flags** — ALPS requires `-DBOOST_NO_AUTO_PTR` and
>    `-DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF` for C++17/20 compatibility; the
>    MacPorts `boost` ports do not set these, causing link errors.
> 2. **Python-ABI match** — the `Boost.Python` component must be compiled against the
>    exact Python interpreter that ALPS will use. MacPorts Boost targets MacPorts' own
>    Python and will silently mismatch any other interpreter.
>
> CMake handles both automatically: if `Boost_SRC_DIR` is not set, it downloads and
> compiles Boost 1.87 during configuration (requires internet access). To build offline
> or reuse a previously extracted archive, download it manually first:
> ```ShellSession
> curl -LO https://archives.boost.io/release/1.87.0/source/boost_1_87_0.tar.gz
> tar -xzf boost_1_87_0.tar.gz
> ```
</details>

### Verify Dependencies

 ```ShellSession
gcc -v              # must be >= 10.5.0
cmake --version     # must be >= 3.18
mpirun --version    # OpenMPI 4.0 or MPICH 4
python3 --version   # must be >= 3.9
python3 -c "import numpy, scipy; print('numpy', numpy.__version__, 'scipy', scipy.__version__)"
```

> **macOS — which Python will CMake use?** CMake on macOS searches Apple's framework
> paths before `$PATH`, so it may silently select the Xcode-bundled Python 3.9 even if
> you have a newer Python installed via Homebrew or MacPorts. During `cmake` configuration,
> look for a line like:
> ```
> -- Found Python: /path/to/python (found version "X.Y.Z")
> ```
> If the path or version is not what you expect, pin it explicitly by adding
> `-DPython3_EXECUTABLE=/path/to/your/python3` to your `cmake` command.
> Typical paths are `/opt/homebrew/bin/python3` (Homebrew) or
> `/opt/local/bin/python3` (MacPorts). Make sure `numpy` and `scipy` are installed
> for whichever Python CMake will use.

### Download and Build
We can now proceed to download and build the `ALPS` library.
In the snippet below, replace `</path/to/install/dir>` with the directory where you want ALPS installed.

> **Before you run these commands, note two expected pauses:**
> 1. **`cmake` configuration (~1–3 min):** CMake silently downloads Boost 1.87 (~130 MB)
>    during configuration. The terminal will produce no output for a minute or two while
>    the download completes — this is normal, do not interrupt it.
> 2. **`cmake --build` (5–20 min):** Compiling ALPS and Boost from source takes several
>    minutes even with all CPU cores. The terminal will be busy printing compiler lines
>    throughout — also normal.

  ```ShellSession
  git clone https://github.com/alpsim/ALPS alps-src
  cmake -S alps-src -B alps-build                                     \
         -DCMAKE_INSTALL_PREFIX=</path/to/install/dir>                  \
         -DCMAKE_CXX_FLAGS="-DBOOST_NO_AUTO_PTR                         \
         -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF"
  # ^ Boost (~130 MB) is downloaded here; no output for 1-3 min is normal
  cmake --build alps-build -j$(nproc 2>/dev/null || sysctl -n hw.logicalcpu)
  cmake --build alps-build -t test
  ```

> **`-j` controls parallel compilation.** The expression above automatically uses all
> logical CPU cores on both Linux (`nproc`) and macOS (`sysctl -n hw.logicalcpu`).
> You can also set the number manually, e.g. `-j 8` for 8 cores.

> **Offline or slow-connection build:** By default CMake fetches Boost 1.87 at configure
> time. To avoid the download, extract the archive manually first and pass the path:
> ```ShellSession
> cmake -S alps-src -B alps-build                                     \
>        -DCMAKE_INSTALL_PREFIX=</path/to/install/dir>                  \
>        -DBoost_SRC_DIR=</path/to/boost_1_87_0>                        \
>        -DCMAKE_CXX_FLAGS="-DBOOST_NO_AUTO_PTR                         \
>        -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF"
> ```


### Troubleshooting
<details>
* **Need a different MPI or BLAS?**  <br> Substitute the package names above with your cluster's module (e.g. [Intel MKL/OneAPI](https://www.intel.com/content/www/us/en/developer/tools/oneapi/onemkl.html), [AMD AOCL](https://www.amd.com/en/developer/aocl.html), etc). [Cmake](https://cmake.org/) is a build system that will find the locations of the above packages and generate compilation instructions in Makefiles.
* **Python errors** <br> Ensure Python ≥ 3.9 is installed and that `numpy` and `scipy` are installed for the same Python that CMake selects. On macOS, CMake may pick the Xcode-bundled Python rather than your Homebrew/MacPorts Python — check the `Found Python:` line in the CMake output and pin the interpreter with `-DPython3_EXECUTABLE=/path/to/python3` if needed (see the [Verify Dependencies](#verify-dependencies) step).
* **MPI mismatch?**   <br> Ensure that CMake is using the same MPI version as `mpirun --version`
* **Boost errors** <br> Building ALPS' Python bindings against NumPy ≥ 2.0 requires Boost ≥ 1.87 (NumPy 2.0 introduced API changes that only Boost 1.87+ handles). Boost 1.76–1.86 work only with NumPy < 2.0. See the [build notes](#build-notes) for tested compiler/Boost/Python combinations.

</details>

#### Build notes

{{% tabs %}}
{{% tab name="Linux" %}}
The following combinations of `Boost`, Python and the C++ compiler have been tested:
  - GCC 10.5.0, Python 3.9.19 (NumPy < 2.0) and `Boost` 1.76.0
  - GCC 11.4.0, Python 3.10.14 (NumPy < 2.0) and `Boost` 1.81.0, 1.86.0
  - GCC 12.3.0, Python 3.10.14 (NumPy < 2.0) and `Boost` 1.81.0, 1.86.0
  - Clang 13.0.1, Python 3.10.14 (NumPy < 2.0) and `Boost` 1.81.0, 1.86.0
  - Clang 14.0.0, Python 3.10.14 (NumPy < 2.0) and `Boost` 1.81.0, 1.86.0
  - Clang 15.0.7, Python 3.10.14 (NumPy < 2.0) and `Boost` 1.81.0, 1.86.0

  For **NumPy ≥ 2.0**, `Boost` 1.87.0 or later is required for ALPS' Boost.Python bindings (CMake downloads this automatically).
{{% /tab %}}
{{% tab name="Mac" %}}
ALPS has been tested on ARM-based macOS systems using Apple's Xcode Clang and
third-party compilers (Homebrew GCC, MacPorts GCC/Clang) with `Boost` 1.86.0+.

**`SDKROOT` — when and how to set it**

`SDKROOT` tells the compiler where to find macOS system headers and frameworks.
Apple's own Clang (the `cc`/`c++` you get after installing Xcode or Command Line Tools)
locates the SDK automatically — **you do not need to set `SDKROOT` when using Apple Clang**.

Third-party compilers (Homebrew GCC, MacPorts GCC or LLVM Clang, etc.) do not know
where the SDK lives and will fail with errors about missing system headers. Before
running `cmake`, set:

```ShellSession
export SDKROOT=$(xcrun --show-sdk-path)
```

`xcrun --show-sdk-path` always returns the correct path for whichever Xcode or
Command Line Tools version you have installed, regardless of macOS version. Do not
hardcode a version-specific path such as `MacOSX14.sdk` — it will break whenever
Xcode is updated.

To check which compiler CMake will use, look for the `C compiler identification` line
at the start of the cmake output. If it says `AppleClang`, you do not need `SDKROOT`.
If it says `GNU` or `Clang` (without "Apple"), set it as shown above.

**Python selection:** On macOS, CMake searches Apple's framework paths before `$PATH`
and will often select the Xcode-bundled Python 3.9
(`/Applications/Xcode.app/.../python3.9`) even when a newer Python is installed via
Homebrew or MacPorts and appears first in your shell. Verify which Python CMake
found by looking for the `Found Python:` line printed during configuration. If it is not
the one you want, pin it explicitly — do not rely on `$(which python3)` as it may still
resolve to the wrong interpreter. Use the full path instead:

```ShellSession
# Homebrew (Apple Silicon):
cmake -S alps-src -B alps-build ... -DPython3_EXECUTABLE=/opt/homebrew/bin/python3

# Homebrew (Intel):
cmake -S alps-src -B alps-build ... -DPython3_EXECUTABLE=/usr/local/bin/python3

# MacPorts:
cmake -S alps-src -B alps-build ... -DPython3_EXECUTABLE=/opt/local/bin/python3
```

Whichever Python CMake uses, make sure `numpy` and `scipy` are installed for it
(`/path/to/that/python3 -m pip install numpy scipy`).

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
  cmake --install alps-build
  ```

### Set up your environment

The install directory is self-contained but your shell does not know about it yet.
ALPS provides a setup script that adds the right directories to `PATH`,
`LD_LIBRARY_PATH`, and `PYTHONPATH`. Source it once before using ALPS:

```ShellSession
# bash / zsh:
source </path/to/install/dir>/bin/alpsvars.sh

# csh / tcsh:
source </path/to/install/dir>/bin/alpsvars.csh
```

To avoid running this command in every new terminal session, add the `source` line
to your shell's startup file (`~/.bashrc`, `~/.zshrc`, or `~/.cshrc`).

**Verify the installation** by running one of the ALPS executables:

```ShellSession
spinmc --help
```

If the command is found and prints a help message, ALPS is installed and your
environment is set up correctly.

{{% /steps %}}

### Video Walkthrough
<br>

{{< youtube id="OHQGfDDaRMk" >}}
