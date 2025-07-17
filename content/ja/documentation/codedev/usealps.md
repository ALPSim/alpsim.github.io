
---
title: Code-00 Using ALPS in your projects
math: true
toc: true
weight: 1
---

## Using CMake

The ALPS libraries also provide an ALPS configuration file for CMake in `/opt/alps/share/alps/ALPSConfig.cmake`. Including that file will set all the configuration variables used when building ALPS. Additionally including the file `/opt/alps/share/alps/UseALPS.cmake` into your CMake file will automatically set the compiler and linker options to use ALPS. Here is an example `CMakeLists.txt`:
 
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

Note that NO_SYSTEM_ENVIRONMENT_PATH option in find_package is essential. Otherwise, the variables (compilers, etc) will be overwritten by the system default ones.
When running cmake, please specify the path where ALPS may be found:

    cmake -DALPS_ROOT_DIR=/opt/alps /somewhere/to/your/source/code
    
Or, one can tell the place of ALPS to cmake by using environmental variable $ALPS_HOME:

    export ALPS_HOME=/opt/alps
    cmake /somewhere/to/your/source/code

## Using make

If you can, please use cmake instead of make. The ALPS libraries come with a an include file for your Makefile that sets all the required include paths, link paths, and libraries to be linked to use ALPS. This include file is located at /opt/alps/share/alps/include.mk - or a similar location if you have installed ALPS at a different path than /opt/alps. An example Makefile using this include file is provided here in the C++ Ising model tutorial.
