---
title: Integration-02 Fortran Introduction
math: true
toc: true
weight: 3
---

This chapter explains how to install and use ALPS Fortran. It assumes the reader has basic knowledge of Fortran programming.

## Operating Environment

ALPS Fortran is a wrapper library for running Fortran code on the ALPS system. The following are required:

|       |          |
| :---- | :------- |
| ALPS  | See the [ALPS installation page](https://alps.comp-phys.org/install/) for operating environment requirements and installation instructions. |
| CMake | Version 3.18 or later. Used to compile both ALPS Fortran and client code. |
| Fortran compiler (GNU/Intel/Fujitsu) | Must be the same compiler used to build ALPS. Refer to each compiler's manual for installation instructions. |

## Installation

ALPS Fortran is provided as a patch file applied to the ALPS source tree.

1. **Download the patch**

   Download the ALPS Fortran archive from the [ALPS repository](https://github.com/ALPSim/ALPS) and extract it:

        $ cd ~/
        $ wget http://xxx.xxx/alps_fortran.tar.gz
        $ tar -zxvf alps_fortran.tar.gz

   This creates the following files and directories:

        alps_fortran/
            + alps_fortran.patch
            + samples/
                + hello/
                + ising/
                + looper-2/
                + tutorial/

2. **Apply the patch**

   Change to the ALPS source directory (`${ALPS_SRC}`) and apply the patch:

        $ cd ${ALPS_SRC}
        $ patch -p0 < ~/alps_fortran/alps_fortran.patch

3. **Build and install ALPS**

   Build ALPS according to the [installation documentation](https://alps.comp-phys.org/install/). ALPS Fortran is installed alongside ALPS and produces the following files (where `${ALPS_ROOT}` is your ALPS installation prefix):

   - `${ALPS_ROOT}/lib/libalps_fortran.a`
   - `${ALPS_ROOT}/include/alps/fortran/alps_fortran.h`
   - `${ALPS_ROOT}/include/alps/fortran/fortran_wrapper.h`
   - `${ALPS_ROOT}/include/alps/fortran/fwrapper_impl.h`

## Sample Source Code

ALPS Fortran includes three sample applications:

- **"hello"** — Performs no calculation; simply prints the contents of the parameter file to standard output.
- **"ising"** — A sample application for Ising model calculations.
- **"looper-2"** — A sample application demonstrating the use of an external library.

The following sections explain how to build and run the `hello` application. The `ising` and `looper-2` applications follow the same procedure.

### "hello" Application

The hello application consists of the following files:

- `hello_impl.f90` — main program
- `hello.C` — sets the entry point
- `hello_params` — parameter file
- `CMakeLists.txt` — build configuration

### Compiling

1. **Create a build directory**

        $ mkdir -p ${HOME}/alps_fortran_build/hello
        $ cd ${HOME}/alps_fortran_build/hello

2. **Run CMake**

   Specify the source directory (`${SAMPLES}` is the samples folder extracted from the ALPS Fortran archive):

        $ cmake -DALPS_ROOT:PATH=${ALPS_ROOT} \
        >       ${SAMPLES}/hello

3. **Build**

        $ make

   After a successful build, the executable `hello` appears in the current directory.

### Thread-level Parallelization

1. **Go to the build directory**

        $ cd ${HOME}/alps_fortran_build/hello

   If any result files (`hello_param.out.*`) are present from a previous run, delete them before proceeding.

2. **Prepare the parameter file**

   Generate an XML input file from the parameter file:

        $ cp ${SAMPLES}/hello/hello_params .
        $ parameter2xml hello_params

   See the [ALPS documentation](https://alps.comp-phys.org) for details on the `parameter2xml` command.

3. **Run**

        $ ./hello hello_params.in.xml

   The parameters defined in `hello_params` are printed to standard output. Example output:

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

### MPI Parallelization

1. **Go to the build directory**

        $ cd ${HOME}/alps_fortran_build/hello

   As above, delete any existing result files (`hello_param.out.*`) before proceeding.

2. **Prepare the parameter file**

        $ cp ${SAMPLES}/hello/hello_params .
        $ parameter2xml hello_params

3. **Run with MPI**

        $ mpirun -np 4 -x OMP_NUM_THREADS=1 ./hello --mpi hello_params.in.xml

   The parameters defined in `hello_params` are printed to standard output, as in the thread-level example above.
