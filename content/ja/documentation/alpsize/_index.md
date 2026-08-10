
---
title: Integrating Your Code with ALPS
description: "Documentation for ALPS"
toc: true
weight: 9
---
Many research groups already have a working simulation code — often years of accumulated C, C++, or Fortran — and would rather integrate it with ALPS than rewrite it from scratch. Linking against the ALPS library and packaging the build with CMake gives an existing program access to ALPS's **Parameters** file format, the **Alea** measurement and error-analysis library, and the **Parapack** scheduler, with only a modest amount of restructuring. In return, the program gains parameter-driven parallelization, checkpoint/restart support, automatic result aggregation, and the ability to run unmodified on anything from a laptop to a supercomputer. The tutorials below walk through that integration process end to end: a worked C/C++ example that migrates a small Monte Carlo program step by step, a closer look at the CMake build system that ties everything together, and a parallel pair of tutorials covering the same process for Fortran codes.

## [Integration-00: Introduction and Overview](alpsize00)

Introduces the ALPS scheduler and its benefits, then walks through a nine-step tutorial package (`00_cmake` through `08_scheduler`) that incrementally migrates a plain C implementation of the Wolff cluster Monte Carlo algorithm into a fully ALPS-integrated program. Each step is a self-contained, buildable directory: verifying the CMake + ALPS toolchain, converting the code to idiomatic C++, adopting STL containers and the Boost libraries, reading simulation parameters through `ALPS/parameters`, accumulating measurements with `ALPS/alea`, describing the simulation geometry with `ALPS/lattice`, and finally wrapping the whole program in a `Worker` class that runs under the ALPS/Parapack scheduler.

## [Integration-01: Packaging with CMake](alpsize01)

A closer look at the CMake build system used throughout the tutorial series. Explains the anatomy of a `CMakeLists.txt` for an ALPS project — importing `ALPSConfig.cmake` and `UseALPS.cmake`, declaring executable targets and their dependencies, and registering tests with CTest — and shows how to point CMake at an ALPS installation using `-DALPS_ROOT_DIR` or the `$ALPS_HOME` environment variable.

## [Integration-02: Fortran Introduction](alpsize02)

Covers installation and basic use of ALPS Fortran, the wrapper library that lets Fortran programs run under the ALPS scheduler. Describes the required build environment, how to apply the ALPS Fortran patch and build it alongside ALPS, and walks through compiling and running the bundled `hello` sample application under both thread-level and MPI parallelization.

## [Integration-03: Fortran Application Development](alpsize03)

Documents the full ALPS Fortran subroutine interface — the required callbacks (`alps_init`, `alps_run`, `alps_progress`, `alps_is_thermalized`, `alps_save`/`alps_load`, `alps_finalize`) and the subroutines ALPS Fortran provides for reading parameters and recording observables — then applies it in a complete worked example that ports a legacy Ising model program (`ising_original.f`) into the ALPS Fortran framework, including checkpoint/restart and multi-threading support.







