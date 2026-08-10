
---
title: Integration-01 CMake
math: true
toc: true
weight: 2
---

## What Is CMake, and Why Does ALPS Use It?

CMake is a cross-platform build-configuration tool. Rather than writing a Makefile by hand — which quickly becomes a tangle of platform-specific compiler and linker flags — you describe *what* to build in a short, portable file called **CMakeLists.txt**, and CMake generates the actual build files for your platform (a Makefile on Linux/macOS, a Visual Studio project on Windows, and so on). You then compile with `cmake` followed by `make`.

ALPS itself is built with CMake, and it ships a set of CMake configuration files that describe how to find and link against it. Using CMake for your own program lets you reuse that infrastructure directly, instead of working out the correct compiler and linker flags yourself. ALPS requires **CMake 3.18 or later** — see the [installation guide](https://alps.comp-phys.org/install/) if you need to install or upgrade it.

This page walks through the `CMakeLists.txt` used in [Integration-00](../alpsize00) line by line. If you just want to copy a working example and move on, see the code block below; if you want to understand what each line does, read on.

## Anatomy of a CMakeLists.txt

`CMakeLists.txt` consists of several parts: a header, importing the ALPS environment, a description of the targets to build, and (optionally) test definitions. Here is the complete file used in Step 1 of [Integration-00](../alpsize00); a full set of source files is available in the [ALPS repository](https://github.com/ALPSim/ALPS):

```cmake
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

- **`cmake_minimum_required` / `project(alpsize NONE)`** — declares the minimum CMake version and names the project. The `NONE` argument tells CMake *not* to auto-detect a language from the project's source files; instead, the next block enables exactly the languages this project needs.

- **`find_package(ALPS REQUIRED PATHS ${ALPS_ROOT_DIR} $ENV{ALPS_HOME} NO_SYSTEM_ENVIRONMENT_PATH)`** — locates your ALPS installation. `PATHS` gives CMake two ways to find it: the `-DALPS_ROOT_DIR` command-line variable, or the `$ALPS_HOME` environment variable (see [Running CMake](#running-cmake) below). `REQUIRED` makes configuration fail immediately with a clear error if ALPS cannot be found, rather than failing later at compile or link time.

  {{< callout type="warning" >}}
  `NO_SYSTEM_ENVIRONMENT_PATH` is essential. Without it, `find_package` also searches standard system locations, which can silently pick up a different compiler, Boost installation, or ALPS version than the one you actually built against — leading to confusing ABI mismatches at link time or, worse, at runtime.
  {{< /callout >}}

- **`include(${ALPS_USE_FILE})`** — applies the compiler and linker settings ALPS needs. Internally, `find_package(ALPS ...)` loads a configuration file that ALPS installs at `${ALPS_ROOT}/share/alps/ALPSConfig.cmake` (where `${ALPS_ROOT}` is your ALPS installation prefix, e.g. `/opt/alps`), which defines variables such as `ALPS_INCLUDE_DIRS`, `ALPS_LIBRARIES`, and `ALPS_USE_FILE`. That last variable points at `${ALPS_ROOT}/share/alps/UseALPS.cmake`; including it sets the compiler and linker flags for you automatically, so you never need to hunt down the right `-I` and `-L` paths by hand.

- **`enable_language(C CXX)`** — turns on both the C and C++ compilers. `hello.C` only needs C++, but later steps in the same tutorial series add a C file (`wolff.c`) and a Fortran file, so the same `CMakeLists.txt` template enables both languages up front.

- **`add_executable(hello hello.C)` / `target_link_libraries(hello ${ALPS_LIBRARIES})`** — ordinary CMake: build an executable named `hello` from `hello.C`, and link it against the ALPS libraries found above.

- **`add_alps_test(hello)`** — registers `hello` as a CTest test using an ALPS-provided macro. Concretely, it: (1) runs the `hello` executable; (2) if a file named `hello.ip` (or `hello.input`) exists next to the source, feeds its contents to the program on standard input; (3) captures whatever the program prints to standard output; and (4) if a file named `hello.op` (or `hello.output`) exists, compares it byte-for-byte against that captured output, failing the test on any difference. This is exactly the mechanism used throughout [Integration-00](../alpsize00) to verify that each step's example still produces the expected numbers.

## Running CMake

When running `cmake`, specify the path to your ALPS installation with `-DALPS_ROOT_DIR`:

```bash
$ cmake -DALPS_ROOT_DIR=/path/to/alps /path/to/your/source
```

Alternatively, set the `$ALPS_HOME` environment variable so CMake finds ALPS automatically, which is convenient if you are building several ALPS-based projects in the same shell session:

```bash
$ export ALPS_HOME=/path/to/alps
$ cmake /path/to/your/source
-- Found ALPS: ...
[snip]
-- Configuring done
-- Generating done
-- Build files have been written to: /home/alps/tutorial
```

{{< callout type="info" >}}
The examples on this page run `cmake` directly in the source directory (an *in-source* build, e.g. `cmake .`), which keeps the tutorial simple. For any project you plan to keep working on, prefer an *out-of-source* build instead — create a separate build directory and run `cmake /path/to/source` from inside it — so generated files never mix with your source files.
{{< /callout >}}

## Building and Testing

CMake generates a Makefile; run `make` to build the program:

```bash
$ make
[100%] Building CXX object CMakeFiles/hello.dir/hello.C.o
Linking CXX executable hello
[100%] Built target hello
$ ./hello
hello, world
```

Run the tests registered by `add_alps_test` using the `ctest` tool:

```bash
$ ctest
Test project /home/alps/tutorial
    Start 1: hello
1/1 Test #1: hello ............................   Passed    0.07 sec

100% tests passed, 0 tests failed out of 1

Total Test time (real) =   0.07 sec
```

This passes because the tutorial directory ships a `hello.op` file containing exactly `hello, world` — the output CTest expects. If you ever modify `hello.C` so that it prints something different, this test will fail until you update `hello.op` to match, which is precisely the point: it catches unintended changes in behavior.

## What's Next?

With the mechanics of `CMakeLists.txt` and `add_alps_test` explained, return to [Integration-00: Introduction and Overview](../alpsize00) to see the same `cmake` / `make` / `ctest` workflow applied at every step of building the Wolff cluster Monte Carlo tutorial from plain C up to a fully ALPS-integrated program.
