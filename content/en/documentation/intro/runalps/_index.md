
---
title: Running Simulations
toc: true
weight: 1
---

Every ALPS simulation goes through the same three phases — preparing the input, running the simulation, and evaluating the results — regardless of whether you drive it from the command line or from Python. This section explains the underlying job/task mechanism once, then covers each of the two workflows in detail.

## [Introduction](intro)

How the ALPS scheduler library organizes a simulation: the job file that lists one task per parameter set, the task files that hold the parameters and, later, the results, and the three phases (prepare, run, evaluate) common to both workflows below. Also explains why, for high-accuracy Monte Carlo work, you should rerun with more than one random number generator (via the `RNG` parameter) to rule out generator-specific bias.

## [Using the command line \(with limited evaluation tools\)](commandline)

How to drive ALPS without Python: converting a plain-text parameter file into job/task XML with `parameter2xml`, launching the simulation binary directly on a serial machine or under MPI on a parallel one (including the `--time-limit`, `--checkpoint-time`, `--mpi`, `--Nmin`/`--Nmax` options), and evaluating the results afterwards with `convert2xml` and the `*_evaluate` binaries (`spinmc_evaluate`, `worm_evaluate`, `dirloop_sse_evaluate`, and others). Ends with a C++ example of writing your own evaluate program for derived quantities such as the compressibility.

## [Using Python](usepython)

The recommended way to run and analyze ALPS simulations day-to-day. Walks through a complete example — importing `pyalps`, preparing input as a Python list of parameter dictionaries with `pyalps.writeInputFiles`, launching it serially or in parallel with `pyalps.runApplication`, then loading (`pyalps.loadMeasurements`), plotting (`pyalps.plot`, with export to Grace or Gnuplot), and evaluating derived quantities such as the Binder cumulant with correct jackknife error bars. Closes with pointers to the complete example scripts and their smaller, task-by-task variants in `tutorials/intro-01-basics`.
