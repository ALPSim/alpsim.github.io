
---
title: Alpsize-00 Usercode ALPSize
math: true
toc: true
weight: 1
---

## ALPSize Introduction

By packaging your code with CMake and linking against the ALPS library, you can use ALPS
scheduler infrastructure — including **Parameters** and **Alea** — with minimal setup.
Using the ALPS scheduler provides the following advantages:

- Parameter parallelization with no extra code.
- Runs on a laptop, a cluster server, or a supercomputer with the same binary.
- Built-in result aggregation and post-processing.
- Straightforward multi-level parallelization of already-parallelized code.
- Ready-made adapters for advanced methods such as replica exchange.

## Tutorial

Each step below corresponds to a subdirectory in the ALPSize tutorial package.
Work through them in order; each one builds on the previous.

### Packaging with CMake

00_cmake — Verifies that the CMake + ALPS build system is set up correctly by compiling and running a minimal "hello world" program.

    $ cmake .
    $ make
    $ ./hello

### Implementation of the Wolff algorithm in C

01_original-c — A direct C implementation of the Wolff cluster algorithm with no ALPS or C++ features; establishes the baseline.

    $ cmake .
    $ make
    $ ./wolff

### Implementation of the Wolff algorithm in C++

02_basic-cpp — Converts the C code to idiomatic C++: replaces `<math.h>` with `<cmath>`, uses `std::` I/O, and adopts C++ comment style.

- Replace `<math.h>` with `<cmath>` (and other C headers with their C++ equivalents)
- Use `std` namespace
- Replace `printf`/`fprintf` with `std::cout`/`std::cerr`
- C++-style comments

        $ cmake .
        $ make
        $ ./wolff

### Using the Standard Template Library

03_stl — Replaces raw arrays and manual memory management with `std::vector` and `std::stack`, letting the standard library handle allocation.

- `std::vector<>`: one-dimensional array
    - Size is allocated and freed automatically
    - Element type (including user-defined types) is specified as a template parameter
- `std::stack<>`: stack with the same automatic memory management

            $ cmake .
            $ make
            $ ./wolff

### Using the Boost C++ Library

04_boost — Swaps in Boost for fixed-length arrays, a better random-number generator, and a timer.

- `<boost/array.hpp>`: fixed-length array
- `<boost/random.hpp>`: random number generation
    - Mersenne Twister, Lagged Fibonacci, and other generators
    - Uniform, normal, Poisson, exponential distributions
- `<boost/timer.hpp>`: timer for measuring execution time

            $ cmake .
            $ make
            $ ./wolff

### Using ALPS/parameters

05_parameters — Reads simulation parameters from a file via `ALPS/parameters`, eliminating hard-coded constants.

    $ cmake .
    $ make
    $ ./wolff <wolff.ip

### Using ALPS/alea

06_alea — Accumulates and analyses observable data using `ALPS/alea`, including automatic statistical error estimation.

    $ cmake .
    $ make
    $ ./wolff wolff.ip

### Using ALPS/lattice

07_lattice — Defines the simulation lattice through `ALPS/lattice`, separating geometry from physics.

    $ cmake .
    $ make
    $ ./lattice <lattice.ip
    $ ./wolff <wolff.ip

### Full ALPSize with the ALPS/Parapack Scheduler

08_scheduler — Wraps the simulation in a Worker class and hands control to the ALPS Parapack scheduler, enabling transparent parallelization.

- Simulation logic is encapsulated in a `Worker` class
- The Worker class must implement:
    - Constructor and `init_observables` member function
    - `run` member function
    - `is_thermalized` and `progress` member functions
    - `save` and `load` member functions
- Register the Worker with the scheduler using the `PARAPACK_REGISTER_WORKER` macro
- The scheduler prepares `Parameters` and `ObservableSet` and calls the constructor, `init_observables`, and `run` functions
- `lattice_mc_worker` inherits both `lattice_helper` and `rng_helper`, so their methods are available directly

        $ cmake .
        $ make
        $ ./hello < hello.ip
        $ ./wolff < wolff.ip
