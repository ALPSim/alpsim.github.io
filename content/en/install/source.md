---
title: ALPS Installation on Mac/Linux from Sources
description: "ALPS Installation"
weight: 2
toc: true
cascade:
    type: docs
---

For most cases, it is preferred to [install ALPS from Binaries](../binary). However, for more user control and configuration, installing from Sources could be a better approach. An [agent install](#assisted-install) is below; the <a class="alps-download" href="/codes/install/no_root_guide.pdf" data-filename="no_root_guide.pdf" target="_blank" rel="noopener">`no_root_guide.pdf`</a> it uses also covers a local install without root — for when a local environment breaks the build (see [Common Errors](#common-errors)), or to keep `sudo` away from an agent.
{{% steps %}}

### Install Required Dependencies

ALPS relies on a handful of external libraries. 
Choose **one** MPI and **one** BLAS provider that fit your system:

| Dependency | Minimum version | Debian / Ubuntu (`apt`) | Rocky / RHEL (`dnf`) |
|----------|--------------------|---------------------------|---------------------------|
| HDF5     | 1.10.0 | `libhdf5-dev` | `hdf5-devel` |
| CMake    | 3.18 | `cmake` | `cmake` |
| C++ Compiler | GCC 10.5.0 & Clang 13.0.1 | `build-essential` | `gcc gcc-c++ make` |
| Fortran Compiler | *(any; needed for LAPACK detection)* | `gfortran` | `gcc-gfortran` |
| Boost | 1.76 <br>*(1.87 required to build ALPS Python bindings against NumPy ≥ 2.0)* | see below | see below |
| MPI | OpenMPI 4.0 **or** MPICH 4.0 | `libopenmpi-dev` / `libmpich-dev` | `openmpi-devel` / `mpich-devel` |
| BLAS | 0.3 | `libopenblas-dev` | `openblas-devel` |
| Python | 3.9 | [python.org](https://www.python.org/) | [python.org](https://www.python.org/) |

⚠ **Caution — virtual environments.** Any environment (a Python virtual environment,
`micromamba`, conda) changes which Python and libraries CMake finds. The `cmake` command in
[Download and Build](#download-and-build) then needs custom flags naming them — without those
the build picks up the wrong interpreter and fails. See
[the no-root guide](/codes/install/no_root_guide.pdf) for the flags each kind of environment
needs; a conda environment also has a known Boost/Python ABI problem — see
[Common Errors](#common-errors).


<details id="deps-linux" class="install-section">
<summary><strong>Install on Linux</strong></summary>

<details>
<summary><strong> Ubuntu / Debian / WSL</strong> </summary>

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

> **Do not install Boost via `apt`.** ALPS must compile Boost from source instead —
> see [Boost Error Details](#boost-error-details) in Troubleshooting for why, and how to build offline.
</details>

<details>
<summary><strong> Rocky Linux / RHEL / AlmaLinux</strong> </summary>

**Enable EPEL and CRB first.** Two dependencies live outside the default repositories:
`hdf5-devel` is in EPEL and `openblas-devel` is in CRB (called PowerTools on Rocky 8), and
neither repository is enabled on a stock install:

```ShellSession
sudo dnf install -y epel-release
sudo dnf install -y 'dnf-command(config-manager)'

sudo dnf config-manager --set-enabled crb        # Rocky/RHEL 9
# sudo dnf config-manager --set-enabled powertools # Rocky/RHEL 8

sudo dnf makecache
```

**Rocky Linux 9** — GCC 11.5, no extra toolchain needed:

```ShellSession
sudo dnf install -y \
    gcc gcc-c++ gcc-gfortran make cmake git \
    hdf5 hdf5-devel \
    openblas openblas-devel \
    openmpi openmpi-devel \
    environment-modules \
    python3.11 python3.11-devel python3.11-numpy python3.11-scipy
```

**Rocky Linux 8** — the default GCC is 8.5, below the 10.5.0 minimum, so add a toolset:

```ShellSession
sudo dnf install -y \
    gcc-toolset-14 gcc-toolset-14-gcc-c++ gcc-toolset-14-gcc-gfortran \
    make cmake git \
    hdf5 hdf5-devel \
    openblas openblas-devel \
    openmpi openmpi-devel \
    environment-modules \
    python3.11 python3.11-devel python3.11-numpy python3.11-scipy

source /opt/rh/gcc-toolset-14/enable   # per shell; add to ~/.bashrc and any job script
gcc --version                          # 14.x
```

**Put MPI on the `PATH`.** RHEL-family packages ship OpenMPI as an environment module rather
than in `/usr/bin`, so `mpicc` and `mpirun` do not exist until you load it:

```ShellSession
source /etc/profile.d/modules.sh
module load mpi/openmpi-x86_64         # per shell; add to ~/.bashrc and any job script
mpirun --version                       # Open MPI >= 4.1
```

> **Rocky 8: use `gcc-toolset-14`, not a lower number.** The `gcc-toolset-11` through `-13`
> packages are metapackage stubs that contain no working `gcc`/`g++`, and none of them ship
> `gfortran` — which OpenBLAS needs, since CMake detects LAPACK by compiling a Fortran probe.

> **Do not install `boost-devel`.** ALPS must compile Boost from source instead — if a system
> Boost is present CMake will find it and the build fails with `boost::filesystem` /
> `auto_ptr` errors. See [Boost Error Details](#boost-error-details) in Troubleshooting.
</details>

</details>

<details id="deps-macos" class="install-section">
<summary><strong>Install on macOS</strong></summary>

<details>
<summary><strong> Homebrew</strong> </summary>

```ShellSession
brew update
brew install cmake hdf5 \
               openblas open-mpi # or: mpich

# install Python libs:
pip3 install numpy scipy
```

> **Do not install Boost via Homebrew.** ALPS must compile Boost from source instead —
> see [Boost Error Details](#boost-error-details) in Troubleshooting for why, and how to build offline.
</details>

<details>
<summary><strong> MacPorts</strong> </summary>

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

> **Do not install `openmpi-clang20` without checking your compiler.** See
> [Other Error Details](#other-error-details) in Troubleshooting for how to pick the right OpenMPI variant.

> **Do not install Boost via MacPorts.** ALPS must compile Boost from source instead —
> see [Boost Error Details](#boost-error-details) in Troubleshooting for why, and how to build offline.
</details>
</details>

<details id="deps-cluster" class="install-section">
<summary><strong>Install on an HPC cluster (environment modules)</strong></summary>

The site provides the libraries as modules, so there is nothing to install.

Check what the site provides before installing anything:

```ShellSession
module avail
module load gcc/12 hdf5 openmpi openblas   # names vary by site
```

Confirm the loaded compiler meets the 10.5.0 minimum and that `mpicc`, `mpirun` and the HDF5
headers are on the path. If a module supplies HDF5 in a non-standard location, note the value
of `$HDF5_DIR`.

> **Prefer the site MPI over any other.** A cluster's OpenMPI module is built against its
> interconnect (InfiniBand/UCX). A generic MPI from an environment manager will fall back to
> TCP and lose most of the network performance, so even when using an environment manager for
> everything else, keep MPI on the site module.
</details>

<details id="assisted-install" class="install-section">
<summary><strong>Install with agent (optional)</strong></summary>

If you use a command-line coding agent, the two files linked here can drive the whole
install: they probe your system, ask whether you have root, and pick a route for you.
The agent is instructed to follow the directions in them. **Note: it is inherently safer to create an environment your agent can work in or to revoke its root access.**

**1. Download the instruction files.**
<a class="alps-download" href="/codes/install/alps-install-agent.md" data-filename="alps-install-agent.md" target="_blank" rel="noopener">`alps-install-agent.md`</a> is the procedure the agent follows;
<a class="alps-download" href="/codes/install/no_root_guide.pdf" data-filename="no_root_guide.pdf" target="_blank" rel="noopener">`no_root_guide.pdf`</a> is the per-system reference it uses when you have no root.
It is convenient to save them to the folder you'll be working in.

**2. Hand them to your agent.** Start the agent in the directory where you saved the files (or provide the paths) and
give it the files plus your intent:

```ShellSession
claude "Read alps-install-agent.md and no_root_guide.pdf and install ALPS following them."
```

The file tells the agent to stop and ask before anything that downloads, builds, or writes
outside a prefix you have approved, so you stay in control of each step.

**3. What it will do.**

<div class="roman-list">

1. **Ask whether you have `sudo`.** It will not test this by running `sudo` — that can prompt
   for a password or alert an administrator. If you are unsure, answer no. Consider trying an environment before allowing root access!
2. **Probe the system** — compiler and Python versions, whether the Python headers are
   present, HDF5 and MPI, `module avail`, free space in `$HOME`. It checks whether each tool
   is *usable*, not merely installed.
3. **Recommend a route** and show you the probe lines that decided it — your system's
   packages if you have root, otherwise one of the local routes in `no_root_guide.pdf`.
4. **Configure, build, verify** — ending with a 2-D Ising run whose result it checks. It
   asks first whether to keep the run in an `ising_results/` directory or just print the
   numbers, and offers to plot |M| vs T (asking before installing `matplotlib` if you do
   not have it).

</div>

> **The probe output is worth keeping.** If the build fails and you ask for help, it answers
> most of the questions anyone would ask you first.

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
  cmake -S alps-src -B alps-build                                       \
         -DCMAKE_INSTALL_PREFIX=</path/to/install/dir>                  \
         -DCMAKE_CXX_FLAGS="-DBOOST_NO_AUTO_PTR                         \
         -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF"
  # ^ Boost (~130 MB) is downloaded here; no output for 1-3 min is normal
  cmake --build alps-build -j$(nproc 2>/dev/null || sysctl -n hw.logicalcpu)
  cmake --build alps-build -t test
  ```

> **`-j` controls parallel compilation.** The expression above automatically uses all
> logical CPU cores on both Linux (`nproc`) and macOS (`sysctl -n hw.logicalcpu`).
> You can also set the number manually, e.g. `-j 8` for 8 cores. **On a machine with many
> cores but limited RAM, set it manually** — the DMFT and maxent translation units each need
> roughly 1 GB under `-O3`, so a full-core build can be killed by the out-of-memory killer.

> **Offline or slow-connection build:** By default CMake fetches Boost 1.87 at configure
> time. To avoid the download, extract the archive manually first and pass the path:
> ```ShellSession
> cmake -S alps-src -B alps-build                                       \
>        -DCMAKE_INSTALL_PREFIX=</path/to/install/dir>                  \
>        -DBoost_SRC_DIR=</path/to/boost_1_87_0>                        \
>        -DCMAKE_CXX_FLAGS="-DBOOST_NO_AUTO_PTR                         \
>        -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF"
> ```


### Troubleshooting

<details id="common-errors">
<summary><strong>Common Errors</strong></summary>

* **Boost/Python ABI mismatch** <br> To avoid an ABI issue, make sure the Python version your Boost was built against is similar to the Python version being used to build ALPS. Consider rebuilding a stale Boost library.
* **Check which Python is actually being used** <br> Confirm the path of the Python CMake selects matches the version you expect. Keep in mind there can be several Pythons on one machine — Homebrew, conda, the OS-provided one (Linux distro Python or Apple's bundled Python), etc. — and CMake may not pick the one you intended.
  * A virtual environment inserts another Python path ahead of the others in your `PATH`, which can silently corrupt the build if it's active without you noticing.
  * When in doubt, CMake should probably be pointed at the native Python that ships with your OS rather than one of these alternates.
* **Check `CMakeCache.txt`** <br> After configuring, grep the cache in your build directory to see exactly which Python CMake locked in:
  ```ShellSession
  grep -i python build/CMakeCache.txt
  ```
  Compare that against the Python you actually intend to build against:
  ```ShellSession
  which python3
  python3 -c "import sys; print(sys.executable)"
  ```
  If they don't match, delete the build directory and set explicitly by reconfiguring with: `-DPython3_EXECUTABLE=/path/to/python3`.

</details>

<details id="boost-error-details">
<summary><strong>Boost Error Details</strong></summary>

* **Version Compatibility** <br> Building ALPS' Python bindings against NumPy ≥ 2.0 requires Boost ≥ 1.87 (NumPy 2.0 introduced API changes that only Boost 1.87+ handles). Boost 1.76–1.86 work only with NumPy < 2.0. See the [build notes](#build-notes) for tested compiler/Boost/Python combinations.
* **Do not install Boost via `apt`, `dnf`, Homebrew, or MacPorts** <br> ALPS must compile Boost from source for two reasons:
  1. **Custom compiler flags** — ALPS requires `-DBOOST_NO_AUTO_PTR` and
     `-DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF` for C++17/20 compatibility; package-manager
     Boost builds do not set these, causing link errors.
  2. **Python-ABI match** — the `Boost.Python` component must be compiled against the
     exact Python interpreter that ALPS will use. Package-manager Boost builds target their
     own bundled Python and will silently mismatch any other interpreter.

  CMake handles both automatically: if `Boost_SRC_DIR` is not set, it downloads and
  compiles Boost 1.87 during configuration (requires internet access). To build offline
  or reuse a previously extracted archive, download it manually first:
  ```ShellSession
  curl -LO https://archives.boost.io/release/1.87.0/source/boost_1_87_0.tar.gz
  tar -xzf boost_1_87_0.tar.gz
  ```

</details>

<details id="other-error-details">
<summary><strong>Other Error Details</strong></summary>

* **Need a different MPI or BLAS?**  <br> Substitute the package names above with your cluster's module (e.g. [Intel MKL/OneAPI](https://www.intel.com/content/www/us/en/developer/tools/oneapi/onemkl.html), [AMD AOCL](https://www.amd.com/en/developer/aocl.html), etc). [CMake](https://cmake.org/) is a build system that will find the locations of the above packages and generate compilation instructions in Makefiles.
* **Python errors** <br> Ensure Python ≥ 3.9 is installed and that `numpy` and `scipy` are installed for the same Python that CMake selects. On macOS, CMake may pick the Xcode-bundled Python rather than your Homebrew/MacPorts Python — check the `Found Python:` line in the CMake output and pin the interpreter with `-DPython3_EXECUTABLE=/path/to/python3` if needed (see the [Verify Dependencies](#verify-dependencies) step).
* **MPI mismatch?**   <br> Ensure that CMake is using the same MPI version as `mpirun --version`
* **Choosing a MacPorts OpenMPI variant** <br> MacPorts ships a separate port for each compiler version, named `openmpi-<compiler><version>` (e.g. `openmpi-clang20`, `openmpi-gcc15`). The `clang20` variant matches the LLVM Clang 20 port and works alongside Apple's Xcode clang. If you use a different compiler, install the matching variant and adjust the `port select` command accordingly. The `port select` step is required: without it, the bare `mpirun`, `mpicc`, and `mpicxx` wrappers that CMake looks for will not exist.

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

This environment variable tells the compiler where to find macOS system headers and frameworks.
Apple's own Clang (the `cc`/`c++` you get after installing Xcode or Command Line Tools)
locates the SDK automatically.

**You do not need to set `SDKROOT` when using Apple Clang.**

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

**Homebrew (Apple Silicon):**
```ShellSession
cmake -S alps-src -B alps-build ... -DPython3_EXECUTABLE=/opt/homebrew/bin/python3
```

**Homebrew (Intel):**
```ShellSession
cmake -S alps-src -B alps-build ... -DPython3_EXECUTABLE=/usr/local/bin/python3
```

**MacPorts:**
```ShellSession
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
to your shell's startup file (`~/.bashrc`, `~/.zshrc`, or `~/.cshrc`). Batch job scripts
(Slurm/PBS) must source it too — a job that runs in a different environment than the build
will fail at load time on missing shared libraries.

> **If `import pyalps` fails with `ModuleNotFoundError`,** append the `site-packages`
> directory to `PYTHONPATH` as well. The generated `alpsvars.sh` sets
> `PYTHONPATH=$ALPS_HOME/lib`, but the package installs one level deeper:
> ```ShellSession
> export PYTHONPATH="</path/to/install/dir>/lib/python3.11/site-packages:$PYTHONPATH"
> ```
> Adjust `python3.11` to the Python version CMake built against.

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
