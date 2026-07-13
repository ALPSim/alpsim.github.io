
---
title: Integration-00 Usercode Integration
math: true
toc: true
weight: 1
---

## Why Integrate an Existing Program with ALPS?

If you already have a working simulation code — even just a single C or C++ file with no external dependencies — you do not need to rewrite it to benefit from ALPS. By packaging the code with CMake and linking it against the ALPS library, you can gradually give an existing program access to ALPS's **Parameters** file format, its **Alea** measurement and error-analysis library, and its **Parapack** scheduler, while keeping the underlying physics code intact. Each piece can be adopted independently and at its own pace.

Using the ALPS scheduler provides the following advantages:

- Parameter parallelization with no extra code: a single parameter file can list many parameter sets (e.g. several temperatures), and the scheduler runs and manages all of them.
- Runs on a laptop, a cluster server, or a supercomputer with the same binary.
- Built-in result aggregation and post-processing, including automatic statistical error estimation.
- Straightforward multi-level parallelization of already-parallelized code.
- Ready-made adapters for advanced methods such as replica exchange.

This tutorial shows exactly what that migration looks like in practice. Starting from a bare-bones C program, we add one ALPS feature at a time — CMake packaging, then `ALPS/parameters`, then `ALPS/alea`, then `ALPS/lattice`, and finally the `ALPS/parapack` scheduler — so you can see precisely what changes at each step and why.

## The Example: The Wolff Algorithm for the 2D Ising Model

Throughout the tutorial, the same small physics problem is used as a running example: the 2D Ising model on an $L \times L$ square lattice with periodic boundary conditions, simulated with the Wolff single-cluster Monte Carlo algorithm.

Instead of flipping one spin at a time (as in the Metropolis algorithm), the Wolff algorithm grows a *cluster* of aligned spins starting from a random seed site, adding each neighboring aligned spin to the cluster with probability

$$
p = 1 - e^{-2/T}
$$

(in units where the coupling $J$ and Boltzmann constant $k_B$ are both set to 1), and then flips the entire cluster at once. This dramatically reduces *critical slowing down* near the phase transition compared to single-spin-flip updates — the same benefit discussed in the [Classical Monte Carlo tutorial](../../../start/mc). The example program measures the magnetization and its second and fourth moments, from which the Binder ratio $\langle m^2\rangle^2/\langle m^4\rangle$ — a standard tool for locating phase transitions — is computed.

Because the physics never changes across the tutorial, every difference you see between one step and the next comes from integrating with ALPS, not from the algorithm itself.

## Before You Start

{{< callout type="info" >}}
This tutorial assumes ALPS is already installed and that you are reasonably comfortable compiling C/C++ code from the command line. If you have not installed ALPS yet, see the [installation guide](https://alps.comp-phys.org/install/). From Step 1 onward you will also need CMake 3.18 or later.
{{< /callout >}}

The source files for every step are distributed with ALPS itself, as a set of self-contained example directories named `tutorials/alpsize-00-make` through `tutorials/alpsize-09-scheduler` in the [ALPS repository](https://github.com/ALPSim/ALPS). Each directory builds independently — `cd` into a step's directory before running the commands shown below.

## Tutorial: Ten Steps from Plain C to a Fully Integrated ALPS Program

Work through the steps below in order. Each one starts from the previous step's code and changes only what is needed to introduce the next ALPS concept.

### Step 0 — Compiling with a Plain Makefile

Directory: `tutorials/alpsize-00-make`

Before introducing CMake, this step checks that a plain, hand-written Makefile can find and link against your ALPS installation. `hello.C` does not call any ALPS function yet — its only job is to confirm that the compiler and linker are configured correctly. The Makefile itself is short:

```make
include $(ALPS_HOME)/share/alps/include.mk

hello: hello.C
	$(CXX) $(CPPFLAGS) $(CXXFLAGS) $(LDFLAGS) -o hello hello.C $(LIBS)
```

Including `$(ALPS_HOME)/share/alps/include.mk` pulls in the compiler (`$(CXX)`), preprocessor and compiler flags (`$(CPPFLAGS)`, `$(CXXFLAGS)`), and linker settings (`$(LDFLAGS)`, `$(LIBS)`) needed to build against ALPS, so you do not have to work them out by hand.

```bash
$ export ALPS_HOME=/path/to/alps
$ make
$ ./hello
hello, world
```

### Step 1 — Packaging with CMake

Directory: `tutorials/alpsize-01-cmake`

From here on, every step is built with CMake instead of a hand-written Makefile. This step builds the same `hello.C` as Step 0, but through a `CMakeLists.txt` that locates ALPS automatically and registers a test. See [Integration-01: Packaging with CMake](../alpsize01) for a full explanation of how this file works.

```bash
$ cmake -DALPS_ROOT_DIR=/path/to/alps .
$ make
$ ./hello
hello, world
```

### Step 2 — A Plain C Implementation of the Wolff Algorithm

Directory: `tutorials/alpsize-02-original-c`

This is the starting point for the physics code: `wolff.c`, a self-contained C implementation of the Wolff algorithm with no ALPS or C++ features at all. The lattice size (`L = 32`), temperature (`T = 2.2`), and number of Monte Carlo sweeps are hard-coded `#define` constants; neighbor lists, the cluster stack, and the spin configuration are all plain C arrays. This is representative of the kind of legacy code many research groups start from — a working simulation with zero external dependencies.

```bash
$ cmake .
$ make
$ ./wolff
```

### Step 3 — Porting to Idiomatic C++

Directory: `tutorials/alpsize-03-basic-cpp`

The C code from Step 2 is converted to idiomatic C++ with no change in behavior:

- Replace `<math.h>` with `<cmath>` (and other C headers with their C++ equivalents)
- Use the `std` namespace
- Replace `printf`/`fprintf` with `std::cout`/`std::cerr`
- Adopt C++-style comments

```bash
$ cmake .
$ make
$ ./wolff
```

### Step 4 — Using the C++ Standard Template Library

Directory: `tutorials/alpsize-04-stl`

Raw C arrays and manual bookkeeping are replaced with standard containers, so the compiler manages memory instead of hand-written index arithmetic:

- `std::vector<>` replaces the fixed-size neighbor-list and spin arrays — its size is allocated and freed automatically, and its element type (including user-defined types) is a template parameter
- `std::stack<>` replaces the hand-rolled cluster stack, with the same automatic memory management

```bash
$ cmake .
$ make
$ ./wolff
```

### Step 5 — Using the Boost C++ Library

Directory: `tutorials/alpsize-05-boost`

Three components from Boost replace their ad hoc equivalents from the earlier steps:

- `<boost/array.hpp>`: a fixed-length array type, replacing the hand-written 4-element neighbor struct
- `<boost/random.hpp>`: a proper random-number generator (Mersenne Twister) replacing the C library's `rand()`, together with distributions (uniform, normal, Poisson, exponential, …)
- `<boost/timer.hpp>`: a timer for measuring execution time, replacing manual calls to `clock()`

```bash
$ cmake .
$ make
$ ./wolff
Magnetization = -0.000368834
Magnetization^2 = 0.626016
Magnetization^4 = 0.408456
Binder Ratio of Magnetization = 0.959457
```

Keep these numbers in mind — because the physics and the random seed do not change, the same central values reappear once ALPS starts managing the measurements in Step 7.

### Step 6 — Reading Parameters with ALPS/parameters

Directory: `tutorials/alpsize-06-parameters`

The hard-coded constants from Step 2 (`L`, `T`, number of sweeps, thermalization steps, random seed) are replaced with values read from an ALPS parameter file via `alps::Parameters`:

```cpp
alps::Parameters params(std::cin);
const int L = params.value_or_default("L", 32);
const double T = params.value_or_default("T", 2.2);
```

`value_or_default` falls back to the old hard-coded value if the parameter is not supplied, so the program keeps working even with an incomplete parameter file. The parameter file itself is plain text:

```
L = 32
T = 2.2
```

```bash
$ cmake .
$ make
$ ./wolff <wolff.ip
Magnetization = -0.000368834
Magnetization^2 = 0.626016
Magnetization^4 = 0.408456
Binder Ratio of Magnetization = 0.959457
```

Because `wolff.ip` specifies the same `L` and `T` used before, the results match Step 5 exactly — only *how* the parameters reach the program has changed.

### Step 7 — Measuring Observables with ALPS/alea

Directory: `tutorials/alpsize-07-alea`

The manual accumulation of `m`, `m2`, and `m4` is replaced with `alps::ObservableSet`, which accumulates measurements *and* automatically estimates their statistical error:

```cpp
alps::ObservableSet measurements;
measurements << alps::RealObservable("Magnetization")
             << alps::RealObservable("Magnetization^2")
             << alps::RealObservable("Magnetization^4");
...
measurements["Magnetization"] << dsz;
```

Derived quantities, such as the Binder ratio, are computed directly from the accumulated observables using ordinary arithmetic on `alps::RealObsevaluator` objects — Alea propagates the statistical error through the calculation automatically:

```cpp
alps::RealObsevaluator m2 = measurements["Magnetization^2"];
alps::RealObsevaluator m4 = measurements["Magnetization^4"];
alps::RealObsevaluator binder("Binder Ratio of Magnetization");
binder = m2 * m2 / m4;
```

```bash
$ cmake .
$ make
$ ./wolff wolff.ip
Binder Ratio of Magnetization: 0.959454 +/- 0.000919
Magnetization: -0.000368834 +/- 0.00213; tau = -0.381
    bin #1   : 32768    entries: error = 0.004371
    bin #2   : 16384    entries: error = 0.0027974
    ...
```

Compare this to Step 5: the central values (`-0.000368834`, `0.959454` ≈ `0.959457`) are the same, but Alea now also reports an error bar and an autocorrelation-time estimate (`tau`), computed from a binning analysis performed automatically — no extra code was needed to get it.

### Step 8 — Describing the Lattice with ALPS/lattice

Directory: `tutorials/alpsize-08-lattice`

The hand-written nearest-neighbor table from the earlier steps is replaced by `alps::graph_helper<>`, which builds the lattice geometry from a `LATTICE` parameter instead of code:

```cpp
alps::graph_helper<> graph(params);
const int N = graph.num_sites();
...
BOOST_FOREACH(alps::graph_helper<>::site_descriptor const& sn, graph.neighbors(sc)) { ... }
```

This separates *where the sites and bonds are* (the lattice) from *what happens on them* (the physics), which is the point of the `ALPS/lattice` library: the lattice geometry becomes a parameter instead of hard-coded logic, and a completely different lattice can be used by editing a parameter file rather than the source code. See the [ALPS lattice library](../../intro/latticehowtos) for the full list of built-in lattices.

This step ships a second, standalone demo program, `lattice.C`, that simply prints out the geometry it reads:

```
LATTICE = "square lattice"
L = 4
```

```bash
$ cmake .
$ make
$ ./lattice <lattice.ip
lattice name = square lattice
number of sites = 16
number of bonds = 32
...
$ ./wolff <wolff.ip
Binder Ratio of Magnetization: 0.959454 +/- 0.000919
...
```

A $4\times4$ periodic square lattice has 16 sites and $16 \times 4 / 2 = 32$ bonds (each site has 4 neighbors, and each bond is shared by 2 sites) — exactly what `lattice.C` reports.

### Step 9 — Full Integration with the ALPS/Parapack Scheduler

Directory: `tutorials/alpsize-09-scheduler`

In the final step, the simulation hands control over entirely to the ALPS Parapack scheduler. Instead of a `main` function that runs the whole simulation, `main` now just starts the scheduler:

```cpp
#include <alps/parapack/parapack.h>
int main(int argc, char** argv) { return alps::parapack::start(argc, argv); }
```

All the simulation logic moves into a `Worker` class that the scheduler calls into as needed:

- The constructor and `init_observables` set up the simulation and register observables
- `run` performs one unit of Monte Carlo work (here, one cluster update)
- `is_thermalized` and `progress` tell the scheduler when thermalization is complete and how close the run is to finishing
- `save` and `load` write and read checkpoint data, giving the program restart support for free

```cpp
class wolff_worker : public alps::parapack::lattice_mc_worker<> {
  ...
  void run(alps::ObservableSet& obs) { ... }
  bool is_thermalized() const { return mcs >= MCTHRM; }
  double progress() const { return 1.0 * mcs / (MCTHRM + MCSTEP); }
  void save(alps::ODump& dp) const { dp << mcs << spin << sz; }
  void load(alps::IDump& dp) { dp >> mcs >> spin >> sz; }
};
```

The Worker is registered with the scheduler using a macro, and inherits both lattice access (`neighbors`, `num_sites`) and random-number generation (`random_01`) directly from `lattice_mc_worker`, since that class combines ALPS's `lattice_helper` and `rng_helper`:

```cpp
PARAPACK_REGISTER_WORKER(wolff_worker, "wolff");
```

This is where the first advantage listed at the top of this page becomes concrete: the scheduler parameter file can list several parameter sets, and the scheduler runs and manages all of them without any extra code from you. For example, `wolff_params` requests 16 independent parallel replicas ("clones") of the simulation at three different temperatures:

```
ALGORITHM = "wolff"
LATTICE = "square lattice"
L = 32
NUM_CLONES = 16
{ T = 2.2 }
{ T = 2.4 }
{ T = 2.6 }
```

```bash
$ cmake .
$ make
$ ./hello <hello.ip
$ ./wolff <wolff.ip
```

## What's Next?

If your existing code is written in Fortran rather than C or C++, ALPS provides a dedicated wrapper library instead of the approach shown here — see [Integration-02: Fortran Introduction](../alpsize02) to get started, and [Integration-03: Fortran Application Development](../alpsize03) for a complete worked example of porting a legacy Fortran program to ALPS. If you would like a deeper look at the CMake build system used throughout this tutorial, see [Integration-01: Packaging with CMake](../alpsize01).
