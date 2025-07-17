
---
title: Alpsize-00 Usercode ALPSize
math: true
toc: true
weight: 1
---

## ALPSize Introduction

ALPS scheduler functions and calculations, such as **Parameters** and **Alea** will be able to use easily by packaging with Cmake and setting the link with the ALPS library.There is the following advantage by using an ALPS scheduler.

- Easy parameter parallelization.
- To work on PC,Server,even supercomputer.
- Easy processing of the results.
- Multiple parallelization of the already parallelized code is also easy.
- That is aleady available,such as adapters for exchange method.

## Packaging with Cmake

To package the program is using CMake(2.8.0-).CMake is cross-platform system for managing the build process of software. it can compile using cmake&make with configure file `CMakeLists.txt`.
The following figure is an image of the flow of packaging. The packaging is done by editing the CMakeList.txt.

Flow of packaging (missing picture)

`CMakeList.txt` should be edited,setting headers,read of ALPS environment and dependencies to target, and if necessary,edit test setting.

    Headers
    cmake_minimum_required(VERSION 2.8.0 FATAL_ERROR)
    project(hello NONE)
    
    read ALPS environment
    find_package(ALPS REQUIRED PATHS ${ALPS_ROOT_DIR} $ENV{ALPS_HOME} NO_SYSTEM_ENVIRONMENT_PATH)
    message(STATUS "Found ALPS: ${ALPS_ROOT_DIR} (revision: ${ALPS_VERSION})")
    include(${ALPS_USE_FILE})

    Enable languages to be used
    enable_language(CXX)

    dependencies to target
    add_executable(hello hello.cpp)

    test setting

## Tutorial

The tutorial sample code can be found at http://todo.ap.t.u-tokyo.ac.jp/archive/alpsize-20120829-r2707.tar.gz .

### Packaging with Cmake

00\_cmake

    $ cmake .
    $ make 
    $ ./hello

### Implementation of the Wolff algorithm in C language

01\_original-c

    $ cmake .
    $ make 
    $ ./wolff

### Implementation of the Wolff algorithm in C++ language

02\_basic-cpp

- modify header file： \<math.h\> to \<cmath\>,etc..
- std name space
- modify "printf","fprintf" to "std::cout","std::cerr"
- format of comment

        $ cmake .
        $ make 
        $ ./wolff

### Using Standard Template Library

03\_stl

- std::vector<>:1D-array
- std::stack<>:stack
    - The required size will be allocate/deallocate automatically
    - The type of the elements of the stack and array (which may be user-defined types) specified in the template parameter

            $ cmake .
            $ make
            $ ./wolff

### Using Boost C++ Library

04\_boost

- <boost/array.hpp>
    - fixed-length array
- <boost/random.hpp>
    - random number generation
        - variety of random number generation method,Mersenne Twister,、Lagged Fibonacci,...
        - uniform distribution,normal distribution,Poisson distribution,exponential distribution...
- <boost/timer.hpp>
    - timer（execution time measurements）

            $ cmake .
            $ make
            $ ./wolff

### Using ALPS/parameters

05\_parameters

    $ cmake .
    $ make
    $ ./wolff <wolff.ip

### Using ALPS/alea

06\_alea

    $ cmake .
    $ make
    $ ./wolff wolff.ip

### Using ALPS/lattice

07\_lattice

    $ cmake .
    $ make
    $ ./lattice <lattice.ip
    $ ./wolff <wolff.ip

### Full ALPSize using ALPS/Parapack Scheduler

08\_scheduler

- encapsulated code: Worker class
- Function, must be implemented by Worker Class
    - constructor、init_obserbables member function
    - run member function
    - is_thermalized&progress member function
    - save&load member function
- Worker registration to the scheduler running the macro of PARAPACK_REGISTER_WORKER
- preparation of Parameters and ObservableSet by scheduler,and setting constructor、init_observables-function、run-function
- Because lattice_mc_workerはlattice\_helper has inherited rng_helper、that can activate the function of lattice_helper,rng_helper.

        $ cmake .
        $ make
        $ ./hello < hello.ip
        $ ./wolff < wolff.ip
