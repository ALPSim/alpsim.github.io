---
title: General Introduction
math: true
weight: 3
cascade:            
    type: docs
---

This section covers the mechanics shared by (almost) every ALPS application: how a simulation is prepared, launched, and evaluated; how the lattice, model, and any custom measurements are specified in the input file; and which parameters are common across applications regardless of the physics being simulated.

## [Running and evaluating simulations using ALPS](runalps)

How the ALPS scheduler library organizes a simulation into job and task files, and the three phases common to every run — preparing input files, running the simulation, and evaluating the results. Covers both supported workflows, using the command line or using Python, which produce identical output and can be mixed and matched, plus a note on validating results with more than one random number generator.

## [Definition of lattices](latticehowtos)

How lattices and graphs are specified in ALPS input files: starting from a simple graph of vertices and edges, building up to unit cells and lattices with translational symmetry, generating the graph belonging to a given lattice, assembling your own library of lattices and graphs, and checking that a generated graph matches what you intended. Also points to the built-in ALPS lattice library (`lib/xml/lattices.xml`) and a reference figure of the most commonly used lattices.

## [Definition of models](modeldef)

How quantum lattice models — their Hilbert space and Hamiltonian — are described in the ALPS model library format (`lib/xml/models.xml`). Explains how to define the basis of a single site and of the full lattice (including lattices with more than one site per unit cell), how to build simple and composite site/bond operators, and how to assemble these into `<SITETERM>` and `<BONDTERM>` Hamiltonian contributions, with worked examples for the spin, hardcore boson, and t-J models.

## [Definition of custom measurements](measuredef)

How to request measurements beyond an application's defaults directly from the parameter file, using `MEASURE_LOCAL`, `MEASURE_AVERAGE`, `MEASURE_CORRELATIONS`, and `MEASURE_STRUCTURE_FACTOR`. Also covers a common workaround for measuring off-diagonal or higher-moment quantities that aren't directly supported: extending a model's site basis with an extra operator (e.g. adding `n2` to measure $\langle n_i^2\rangle$).

## [Common parameters](parameters)

The reference list of input parameters shared by most ALPS applications: specifying the `LATTICE` and `MODEL` (or a custom `GRAPH`), setting the temperature via `T` or `BETA`, Monte Carlo controls such as `SEED`, `RNG`, `SWEEPS`, and `THERMALIZATION`, and exact-diagonalization-specific parameters like `CONSERVED_QUANTUMNUMBERS`, `TRANSLATION_SYMMETRY`, and `TOTAL_MOMENTUM`.
