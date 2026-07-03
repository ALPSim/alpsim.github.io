
---
title: Alpsize-01 CMake
math: true
toc: true
weight: 2
---

## Packaging with CMake

ALPS uses CMake (version 3.18 or later) as its build system. CMake is a cross-platform tool for managing the build process of software. You compile your code using `cmake` followed by `make`, driven by a configuration file called **CMakeLists.txt**. Writing a CMakeLists.txt is generally much simpler than writing a Makefile by hand.

`CMakeLists.txt` consists of several parts: a header, importing the ALPS environment, description of target dependencies, and (if necessary) test definitions.
The ALPS library provides a CMake configuration file at `${ALPS_ROOT}/share/alps/ALPSConfig.cmake` (where `${ALPS_ROOT}` is your ALPS installation prefix, e.g. `/opt/alps`). Including that file sets all configuration variables used when building ALPS. Including `${ALPS_ROOT}/share/alps/UseALPS.cmake` automatically sets the compiler and linker options to use ALPS. Here is an example `CMakeLists.txt`. A complete set of source files is available in the [ALPS repository](https://github.com/ALPSim/ALPS):

```
cmake_minimum_required(VERSION 3.18 FATAL_ERROR)
project(alpsize NONE)
 
# find ALPS Library
find_package(ALPS REQUIRED PATHS ${ALPS_ROOT_DIR} $ENV{ALPS_HOME} NO_SYSTEM_ENVIRONMENT_PATH)
message(STATUS "Found ALPS: ${ALPS_ROOT_DIR} (revision: ${ALPS_VERSION})")
include(${ALPS_USE_FILE})
 
# enable C and C++ compilers
enable_language(C CXX)
 
# rule for generating 'hello world' program
add_executable(hello hello.C)
target_link_libraries(hello ${ALPS_LIBRARIES})
add_alps_test(hello)
```
    
Note that NO_SYSTEM_ENVIRONMENT_PATH option in find_package is essential. Otherwise, the variables (compilers, etc) will be overwritten by the system default ones.

## Running CMake

When running cmake, specify the path to your ALPS installation with `-DALPS_ROOT_DIR`:

    $ cmake -DALPS_ROOT_DIR=/path/to/alps /path/to/your/source
    
Alternatively, set the `$ALPS_HOME` environment variable so CMake finds ALPS automatically:

    $ export ALPS_HOME=/path/to/alps
    $ cmake /path/to/your/source
    -- Found ALPS: ...
    [snip]
    -- Configuring done
    -- Generating done
    -- Build files have been written to: /home/alps/tutorial
    
CMake will generate Makefile. Then, run make to build program:

    $ make
    [100%] Building CXX object CMakeFiles/hello.dir/hello.C.o
    Linking CXX executable hello
    [100%] Built target hello
    $ ./hello
    hello, world
    
Run some tests by using CTest tool. CTest will runs hello, and compare its output with the contents of `hello.op`:

    $ ctest
    Test project /home/alps/tutorial
        Start 1: hello
    1/1 Test #1: hello ............................   Passed    0.07 sec

    100% tests passed, 0 tests failed out of 1

    Total Test time (real) =   0.07 sec
