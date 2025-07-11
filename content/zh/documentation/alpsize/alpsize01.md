
---
title: Alpsize-01 CMake
math: true
toc: true
weight: 2
---

## Packaging with Cmake

To package the program is using CMake (version 2.8 or later). CMake is a cross-platform system for managing the build process of software. One can compile software using cmake & make with configure file **CMakeLists.txt**. It is generally much easier to write CMakeLists.txt than writing Makefile directly by hand. The following figure is an image of the flow of packaging. The packaging is done by editing CMakeList.txt.

Flow of packaging (missing picture)

CMakeList.txt consists of several parts: header, importing ALPS environment, description of target dependencies, and (if necessary) some tests.
The ALPS library provides an ALPS configuration file for CMake in `/opt/alps/share/alps/ALPSConfig.cmake`. Including that file will set all the configuration variables used when building ALPS. Additionally including the file `/opt/alps/share/alps/UseALPS.cmake` into your CMake file will automatically set the compiler and linker options to use ALPS. Here is an example `CMakeLists.txt`. A complete set of source codes will be found at [tutorials/alpsize-01-cmake/]().:

```
cmake_minimum_required(VERSION 2.8 FATAL_ERROR)
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

When running cmake, one should specify the path where ALPS may be found by using -DALPS_ROOT_DIR option:

    $ cmake -DALPS_ROOT_DIR=/opt/alps /somewhere/to/your/source/code
    
Or, one can tell the place of ALPS to cmake by using environmental variable $ALPS_HOME:

    $ export ALPS_HOME=/opt/alps
    $ cmake /somewhere/to/your/source/code
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
