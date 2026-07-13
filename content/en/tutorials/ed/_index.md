---
title: Exact Diagonalization
description: "Tutorials for ALPS"
toc: true
weight: 2
math: true
---

The ALPS exact-diagonalization tutorials cover the `sparsediag` and `fulldiag` applications for finite quantum lattice models.
`sparsediag` uses the iterative Lanczos algorithm to compute the lowest eigenstates in each symmetry sector (total $S_z$, momentum, ...), while `fulldiag` diagonalizes the full Hamiltonian to obtain the complete spectrum and, from it, finite-temperature thermodynamics.
Because both methods work directly with the Hamiltonian matrix, the results are numerically exact — free of the statistical and sign-problem errors that limit quantum Monte Carlo — at the cost of an exponentially growing Hilbert space that restricts the accessible system sizes to a few tens of sites at most.
The tutorials progress from basic eigenstate measurements, through finite-size scaling of excitation gaps and full spectra, to the identification of quantum phase transitions and their conformal field theory description, and finally to full diagonalization for thermodynamic quantities of finite systems.

## Sparse Diagonalization (`sparsediag`)

The `sparsediag` code finds the lowest eigenstates of a quantum Hamiltonian by the Lanczos algorithm, working sector by sector in the conserved quantum numbers.
These tutorials introduce the custom measurements available on the computed eigenstates, then use them to extract excitation gaps and full low-energy spectra of one-dimensional spin chains and ladders.

- [ED-01 Sparse Diagonalization (Lanczos)](ed01) — sets up `sparsediag` for a small S=1 Heisenberg chain and shows how to define and read out custom measurements — correlation functions and the static structure factor — on the computed eigenstates, both from the command line and from Python.
- [ED-02 Spin gaps of 1D quantum systems](ed02) — computes the singlet-triplet gap of the S=1 Heisenberg chain by diagonalizing separate $S_z$ sectors, and studies how the gap extrapolates with chain length to reveal the Haldane gap in the thermodynamic limit.
- [ED-03 Spectra of 1D quantum systems](ed03) — calculates the momentum-resolved low-energy spectrum of the Heisenberg chain, a two-leg Heisenberg ladder, and a system of isolated dimers, illustrating how lattice geometry shapes the excitation spectrum.

## Conformal Field Theory and Quantum Criticality

At a quantum critical point, the finite-size spectrum of a 1D lattice model encodes the operator content of the underlying conformal field theory (CFT): energy gaps scale as $1/L$ with universal amplitudes set by the scaling dimensions of the CFT operators.
These tutorials use `sparsediag` to extract that operator content directly from finite-size spectra, and use it to locate and characterise a quantum phase transition.

- [ED-04 Conformal field theory description of 1D critical spectra](ed04) — computes the finite-size spectra of the critical transverse-field Ising chain and the critical Heisenberg chain, and matches the extracted scaling dimensions to the known CFT primary fields and their descendants.
- [ED-05 Phase transition in a frustrated spin chain](ed05) — adds a next-nearest-neighbour coupling $J_2$ to the Heisenberg chain and locates the critical point separating the gapless and dimerized (Majumdar-Ghosh) phases by tracking level crossings and gaps in different symmetry sectors, then revisits the CFT content exactly at criticality.

## Full Diagonalization (`fulldiag`)

The `fulldiag` code computes the entire spectrum of a finite Hamiltonian, from which exact finite-temperature thermodynamic quantities — energy, specific heat, susceptibility — follow directly by summing over all eigenstates, without any statistical uncertainty.

- [ED-06 Full Diagonalization](ed06) — computes the thermodynamics of spin-1 Heisenberg chains and ladders, of small magnetic molecules including coupled dimers and the $V_{15}$ molecular complex, and, as an additional exercise, of the Hubbard model on a small square lattice.
