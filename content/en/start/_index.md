---
title: Getting Started
description: "Introduction to ALPS and how to install it"
weight: 2
toc: true
cascade:
    type: docs
aliases:
  - /documentation/start/intro/
  - /documentation/start/obtain/
  - /documentation/start/path/
---

ALPS is a software package for simulating correlated systems. It provides programs for Classical Monte Carlo, Quantum Monte Carlo, and Density Matrix Renormalization Group simulations.

## Obtaining ALPS

The simplest way to start using `ALPS` is to install the prebuilt Python package:

```ShellSession
pip install pyalps
```

For more control over the installation — or to build with HPC support — choose one of the methods below:

<div class="btn-grid">
{{< cta-button text="Binary" link="../install/binary" icon="download" >}}
{{< cta-button text="Source" link="../install/source" icon="code" >}}
{{< cta-button text="Spack" link="../install/spack" icon="inventory_2" >}}
</div>

## Quickstart Tutorials

Once ALPS is installed, try one of the quickstart examples:

- [Classical Monte Carlo](mc) — 2D Ising model phase transition
- [Quantum Monte Carlo](qmc) — Kondo screening with the hybridization expansion solver
- [Density Matrix Renormalization Group](dmrg) — ground state energy of a Heisenberg chain
- [Exact Diagonalization](ed) — triplet gap of a spin chain
