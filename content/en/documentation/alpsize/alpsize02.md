
---
title: Integration-02 Fortran Introduction
math: true
toc: true
weight: 3
---

This chapter explains how to build and use ALPS Fortran, ALPS's support for integrating existing Fortran simulation codes with the ALPS Parapack scheduler. It assumes the reader has basic knowledge of Fortran programming; no prior familiarity with ALPS's C++ interface is required, though readers who have worked through [Integration-00](../alpsize00) will recognize the same scheduler concepts (Worker classes, observables, checkpointing) reappearing here in Fortran form.

Concretely, ALPS Fortran works by providing a small C++ "wrapper" Worker class, `alps::fortran_wrapper`, that plugs into the ALPS Parapack scheduler exactly like the hand-written `wolff_worker` class from [Integration-00, Step 9](../alpsize00#step-9--full-integration-with-the-alpsparapack-scheduler) — except that instead of C++ member functions, it calls a fixed set of Fortran subroutines (`alps_init`, `alps_run`, `alps_progress`, and so on) that you implement. This is why your Fortran program gets the same benefits described in the [Integration-00 overview](../alpsize00#why-integrate-an-existing-program-with-alps) — parameter-driven parallelization, checkpoint/restart, automatic result aggregation — without writing any C++ yourself.

## Operating Environment

The following are required:

|       |          |
| :---- | :------- |
| ALPS  | Built with the `ALPS_BUILD_FORTRAN` CMake option enabled (see [Installation](#installation) below). See the [ALPS installation page](https://alps.comp-phys.org/install/) for general operating environment requirements. |
| CMake | Version 3.18 or later. Used to compile both ALPS itself and your Fortran client code. |
| Fortran compiler (GNU/Intel/Fujitsu) | Must be the same compiler used to build ALPS, since Fortran name-mangling and runtime libraries are not compatible across compilers. Refer to each compiler's manual for installation instructions. |

## Installation

ALPS Fortran support is built directly into the main ALPS source tree (as `src/alps/fortran/`); there is no separate download or patch step. It is simply disabled by default and must be turned on with a CMake option when you build ALPS itself:

```bash
$ cmake -DALPS_BUILD_FORTRAN=ON ...
```

(add this alongside whatever other options you already pass when [building ALPS from source](https://alps.comp-phys.org/install/)). Building ALPS with this option enabled produces the following additional files (where `${ALPS_ROOT}` is your ALPS installation prefix, e.g. `/opt/alps`):

- `${ALPS_ROOT}/lib/libalps_fortran.a`
- `${ALPS_ROOT}/include/alps/fortran/alps_fortran.h`
- `${ALPS_ROOT}/include/alps/fortran/fortran_wrapper.h`
- `${ALPS_ROOT}/include/alps/fortran/fwrapper_impl.h`

and defines an additional `ALPS_FORTRAN_LIBRARIES` CMake variable that your own project's `CMakeLists.txt` links against, alongside the usual `ALPS_LIBRARIES` (see [Compiling](#compiling) below).

## Sample Source Code

ALPS ships two Fortran sample applications, as complete tutorial directories in the [ALPS repository](https://github.com/ALPSim/ALPS):

- **`tutorials/alpsize-10-fortran-scheduler`** ("hello") — performs no real calculation; it simply reads back and prints the contents of the parameter file, which is useful for confirming that parameters are being passed through correctly.
- **`tutorials/alpsize-11-fortran-ising`** ("ising") — a complete worked example that ports a legacy Fortran Ising model program to ALPS Fortran; this is covered in depth in [Integration-03: Fortran Application Development](../alpsize03).

The rest of this page explains how to build and run the `hello` application. The `ising` application follows the same build and run procedure; see Integration-03 for what its subroutines actually do.

### "hello" Application

The hello application consists of the following files:

- `hello_impl.f90` — the Fortran subroutines (`alps_init`, `alps_run`, …) that ALPS calls into
- `hello.C` — a short C++ file that registers `alps::fortran_wrapper` with the scheduler via `PARAPACK_REGISTER_WORKER` and starts it; you do not need to modify this file for your own programs beyond its version/copyright strings, exactly as described for plain C++ workers in [Integration-00, Step 9](../alpsize00#step-9--full-integration-with-the-alpsparapack-scheduler)
- `hello_params` — an ALPS parameter file, in the same text format used throughout [Integration-00](../alpsize00)
- `CMakeLists.txt` — build configuration

### Compiling

1. **Create a build directory**

   ```bash
   $ mkdir -p ${HOME}/alps_fortran_build/hello
   $ cd ${HOME}/alps_fortran_build/hello
   ```

2. **Run CMake**

   Specify the source directory (`${SAMPLES}` is wherever you checked out or extracted the ALPS `tutorials/` directory):

   ```bash
   $ cmake -DALPS_ROOT_DIR=${ALPS_ROOT} \
   >       ${SAMPLES}/alpsize-10-fortran-scheduler
   ```

3. **Build**

   ```bash
   $ make
   ```

   After a successful build, the executable `hello` appears in the current directory.

### Quick Sanity Check

Before setting up thread or MPI parallelization, it is worth confirming the build actually works. Because `hello.C` starts the same Parapack scheduler used in [Integration-00, Step 9](../alpsize00#step-9--full-integration-with-the-alpsparapack-scheduler), you can feed it the parameter file directly on standard input, exactly as in that step:

```bash
$ ./hello <hello_params
```

If this prints one block of output per parameter set in `hello_params` (five, for the sample file shown below), your build is working correctly and you can move on to running it the standard way, described next.

### Thread-level Parallelization

1. **Go to the build directory**

   ```bash
   $ cd ${HOME}/alps_fortran_build/hello
   ```

   If any result files (`hello_param.out.*`) are present from a previous run, delete them before proceeding.

2. **Prepare the parameter file**

   Generate an XML input file from the parameter file:

   ```bash
   $ cp ${SAMPLES}/alpsize-10-fortran-scheduler/hello_params .
   $ parameter2xml hello_params
   ```

   See the [ALPS documentation](https://alps.comp-phys.org) for details on the `parameter2xml` command. Converting to XML this way (rather than piping the file directly, as in the sanity check above) is what lets the scheduler manage multiple parallel clones and write structured, resumable result files.

   The parameter file itself lists five parameter sets, one per `{ ... }` block — the scheduler runs all five, each as an independent clone:

   ```
   ALGORITHM = "hello"
   { WORLD = "world"; X = 3.2; Y = 0; Z=defined }
   { WORLD = "alps"; X = -3.1; Y = 3*2 }
   { WORLD = "looper"; X = 0.001; Y = -100 }
   { WORLD = "japan"; X = 100.0; Y = 2 }
   { WORLD = "wistaria"; X = 3; Y = 0 }
   ```

3. **Run**

   ```bash
   $ ./hello hello_params.in.xml
   ```

   Each clone calls `alps_init`, which reads back its own `X`, `Y`, and `WORLD` parameters and reports whether `Z` was defined for that clone (only the first is). With multiple CPU cores available, the scheduler dispatches clones to separate "thread groups" so several run concurrently — this is the "parameter parallelization with no extra code" benefit from the [Integration-00 overview](../alpsize00#why-integrate-an-existing-program-with-alps) in action. Illustrative output:

   ```
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
   ```

   Note that `Y = 3*2` in the parameter file is evaluated by the ALPS parameter parser to `6`, and `X = 0.001` prints in Fortran's scientific notation as `1.00000000000000002E-003` — both are expected, not bugs.

### MPI Parallelization

1. **Go to the build directory**

   ```bash
   $ cd ${HOME}/alps_fortran_build/hello
   ```

   As above, delete any existing result files (`hello_param.out.*`) before proceeding.

2. **Prepare the parameter file**

   ```bash
   $ cp ${SAMPLES}/alpsize-10-fortran-scheduler/hello_params .
   $ parameter2xml hello_params
   ```

3. **Run with MPI**

   ```bash
   $ mpirun -np 4 -x OMP_NUM_THREADS=1 ./hello --mpi hello_params.in.xml
   ```

   The `--mpi` flag tells the scheduler to distribute the five clones across the 4 MPI processes instead of (or in addition to) threads within one process — useful once a single machine's core count is no longer enough. The parameters defined in `hello_params` are printed to standard output, as in the thread-level example above.

## What's Next?

Once the `hello` sample builds and runs, move on to [Integration-03: Fortran Application Development](../alpsize03), which documents the full set of `alps_*` subroutines used above and walks through porting a real, pre-existing Fortran Ising model program (`ising_original.f`, from `tutorials/alpsize-11-fortran-ising`) into this framework step by step.
