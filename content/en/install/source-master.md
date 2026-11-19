---
title: Build the Latest Development Version (master)
description: "Build ALPS from the master branch"
weight: 4
toc: true
cascade:
    type: docs
---

This page is for developers and testers who want the newest, **unreleased** code from the
`master` branch, for example to contribute to ALPS or to try a fix before it is released.
`master` changes often, and options, interfaces and requirements can change between commits.

> **Just want to use ALPS?** Install the [binary package](../binary), or build the
> [v3.0.0 release from source](../source). The release instructions do **not** work for
> `master`, and the commands on this page do not work for the release.

The authoritative, always-current instructions for `master` are in the repository's
[CONTRIBUTING.md](https://github.com/ALPSim/ALPS/blob/master/CONTRIBUTING.md#getting-started-with-the-code).
If anything below disagrees with that file, follow the file. This page summarizes the steps and
lists what differs from the release.

### What differs from the release

| | Release v3.0.0 ([source install](../source)) | `master` |
|---|---|---|
| Boost | CMake downloads and builds Boost 1.87 itself (`Boost_SRC_DIR` for offline builds); do not install Boost yourself | **Install Boost ≥ 1.76 yourself** from your package manager. Only its headers and CMake package files are needed. `Boost_SRC_DIR` is ignored |
| Extra compiler flags | `-DBOOST_NO_AUTO_PTR -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF` | None |
| CMake | ≥ 3.22 | ≥ 3.27 |
| Eigen | Not needed | Eigen ≥ 3.3, needed for the applications (MaxEnt) |
| MPI | On by default, used when found | Off by default; pass `-DALPS_ENABLE_MPI=ON` |
| Python (`pyalps`) | Built with the C++ code (Boost.Python) | A separate pip package in `python/pyalps`, built against the installed C++ SDK |
| Removed options | | `ALPS_USE_SYSTEM_BOOST`, `Boost_SRC_DIR`, `ALPS_BUILD_TESTS`, `ALPS_BUILD_LIBS_ONLY` and others print a "no longer supported" warning; see the [CHANGELOG](https://github.com/ALPSim/ALPS/blob/master/CHANGELOG.md) |

{{% steps %}}

### Install the dependencies

You need C++17/C11 compilers (GCC or Clang), CMake ≥ 3.27, Boost ≥ 1.76, HDF5 ≥ 1.10.5 (C library),
BLAS/LAPACK, Eigen ≥ 3.3, and Python ≥ 3.10 for the tests and `pyalps`. For example:

**Ubuntu 24.04 / Debian**
```ShellSession
sudo apt-get update
sudo apt-get install build-essential cmake libboost-dev libhdf5-dev \
                     libblas-dev liblapack-dev libeigen3-dev python3-venv
```

**macOS with Homebrew**
```ShellSession
brew install cmake boost hdf5 openblas eigen
export CMAKE_PREFIX_PATH="$(brew --prefix boost):$(brew --prefix hdf5):$(brew --prefix openblas):$(brew --prefix eigen)"
```

**macOS with MacPorts**
```ShellSession
sudo port install cmake boost hdf5 OpenBLAS eigen3
ls /opt/local/libexec/boost/       # note the version directory, e.g. 1.87
```
Then add `-DBoost_ROOT=/opt/local/libexec/boost/<version>` to the `cmake` command below.

> **Older distributions ship a CMake that is too old.** Ubuntu 22.04 (CMake 3.22) and Rocky/RHEL 9
> (CMake 3.26) are below 3.27. Install a newer CMake into a Python environment with
> `python3 -m pip install "cmake>=3.27"`. Rocky/RHEL 9 also ships Boost 1.75, which is below 1.76,
> so install a newer Boost there (for example with Spack or from [boost.org](https://www.boost.org/))
> and point `-DBoost_ROOT` at it.

> **CMake reports `Could not find a package configuration file provided by "Boost"`?**
> CMake did not find an installed Boost. Install one as above, or pass
> `-DBoost_ROOT=<boost prefix>`, the directory that contains `include/boost` and
> `lib/cmake/Boost-<version>`. An extracted Boost source archive does not work here, because it has
> no CMake package files.

### Download and build

Clone `master` (or your fork of it), then configure, build, test and install the C++ SDK and
applications:

```ShellSession
git clone https://github.com/ALPSim/ALPS alps-src
cmake -S alps-src -B alps-build -DCMAKE_INSTALL_PREFIX=</path/to/install/dir>
cmake --build alps-build --parallel 4
ctest --test-dir alps-build
cmake --install alps-build
```

Use a fresh build directory. A build directory left over from the release, or from an older
`master`, keeps stale settings and should be deleted first. Each DMFT and MaxEnt translation unit needs
about 1 GB of memory, so lower `--parallel` on machines with little RAM.

### Build `pyalps` (optional)

`pyalps` is built with pip against the SDK you just installed. In a Python virtual environment:

```ShellSession
python3 -m venv .venv && . .venv/bin/activate
python -m pip install "scikit-build-core>=1.0" "nanobind==2.15.0" \
                      "patchelf>=0.14; sys_platform == 'linux'"
export ALPS_DIR=</path/to/install/dir>/share/alps
python -m pip install --no-build-isolation -e alps-src/python/pyalps
python -c "import pyalps; print(pyalps.__file__)"
```

The `nanobind` version must match the one pinned in
[`python/pyalps/pyproject.toml`](https://github.com/ALPSim/ALPS/blob/master/python/pyalps/pyproject.toml).
See [CONTRIBUTING.md](https://github.com/ALPSim/ALPS/blob/master/CONTRIBUTING.md#getting-started-with-the-code)
for CMake presets, rebuilding after edits, and the Python tests.

### Keep up to date

```ShellSession
git -C alps-src pull
cmake --build alps-build --parallel 4 && cmake --install alps-build
```

After a `git pull` that changes requirements, check the
[CHANGELOG](https://github.com/ALPSim/ALPS/blob/master/CHANGELOG.md) and reconfigure in a fresh build
directory if CMake reports errors.

{{% /steps %}}
