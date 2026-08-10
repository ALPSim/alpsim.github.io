
---
title: ALPS Custom Measurement
toc: true
weight: 6
---

## Defining your custom measurements

If the default measurements performed by your ALPS application do not cover what you need, you can define custom measurements directly in the parameter file. The general syntax is as follows:

    MEASURE_LOCAL[Name]=Op
    MEASURE_AVERAGE[Name]=Op

Here `Name` is the name under which the measurement appears in the XML output, and `Op` is a site or bond operator, which must already be defined for the model — either a built-in operator from the model library or one you defined yourself (see [Quantum Operators](../modeldef/operators)). `MEASURE_AVERAGE` measures the quantum-mechanical, and (for finite-temperature simulations) thermodynamic, expectation value of `Op`. `MEASURE_LOCAL` measures the expectation value of `Op` at each site of the lattice; `Op` must therefore be local, i.e. it can only have site terms, not bond terms.

    MEASURE_CORRELATIONS[Name]="Op1:Op2"
    MEASURE_CORRELATIONS[Name]=Op

`MEASURE_CORRELATIONS` measures the correlations of the operators `Op1` and `Op2` for all inequivalent pairs of sites of the lattice. The second form above, `MEASURE_CORRELATIONS[Name]=Op`, is equivalent to `MEASURE_CORRELATIONS[Name]="Op:Op"`. At present, only two-site correlation functions can be computed, so both `Op1` and `Op2` must be site operators.

    MEASURE_STRUCTURE_FACTOR[Name]=Op

This measures the structure factor for the operator `Op`, i.e. the lattice Fourier transform of the corresponding correlation function, evaluated at the momentum eigenstates of the simulation lattice.

## Which ALPS applications support this

The `MEASURE_LOCAL`/`MEASURE_AVERAGE`/`MEASURE_CORRELATIONS`/`MEASURE_STRUCTURE_FACTOR` syntax above is not interpreted by the model or lattice XML machinery itself — it is optional functionality that each simulation code has to wire in separately, and in practice only a subset of ALPS applications do:

| Application | Support |
| :---------- | :------ |
| `loop` (loop/directed-loop algorithm) | Full support |
| `worm` ([Worm Algorithm](../../methods/qmc/worm)) | Full support |
| `sse`, `sse2`, `sse4` ([Stochastic Series Expansion](../../methods/qmc/sse)) | Full support |
| `dwa` (directed worm algorithm) | Full support |
| `fulldiag` (full diagonalization) | Full support |
| `dmrg` ([legacy single-block DMRG](../../methods/dmrg/dmrg)) | Full support |
| `sparsediag` ([sparse/Lanczos diagonalization](../../methods/ed/sparsediag)) | Not supported — only the observables built into the model itself (energies, quantum numbers) are available |
| `qwl` (quantum Wang-Landau) | Not supported — has its own dedicated `MEASURE_MAGNETIC_PROPERTIES` flag instead |
| `checksign` | Not supported |
| `mps_optim`/`mps_meas` (matrix-product-state DMRG) | Has its own, independently implemented and richer syntax — see below |

For the codes marked "full support" above (`loop`, `worm`, `sse`/`sse2`/`sse4`, `dwa`, `fulldiag`, `dmrg`), a custom `Name` that collides with one of the code's built-in observable names (e.g. `Local Density`, `Spin Correlations`) is silently skipped in favor of the built-in one, with a note to standard error — so give your custom measurements distinctive names.

The matrix-product-state DMRG code (`mps_optim`/`mps_meas`) does not use the mechanism described on this page at all; it has its own reimplementation that accepts `MEASURE_LOCAL`, `MEASURE_AVERAGE`, and `MEASURE_CORRELATIONS` with the same meaning as above, plus several extensions with no equivalent elsewhere in ALPS: `MEASURE_HALF_CORRELATIONS` (like `MEASURE_CORRELATIONS`, but without exchanging the order of operators), `MEASURE_LOCAL_AT` (apply a sequence of operators to an explicit, arbitrary tuple of sites), and boolean flags such as `MEASURE[EnergyVariance]`, `MEASURE[Entropy]`, and `MEASURE[Renyi2]`.

Since support varies so much from code to code, always check the parameter reference or tutorial for the specific application you are using before relying on any of these statements.

## Further tricks and workarounds

Measuring off-diagonal quantities in QMC codes is in general non-trivial and is hard to implement in a generic fashion. If your favorite QMC program refuses to perform your favorite measurement, you may need to modify the source code.

In certain cases, however, several tricks can be used. One useful trick is to enlarge the site basis of your model. Consider the following example: using the worm code to simulate the Bose-Hubbard model on an inhomogeneous lattice, we want to measure the second moment of the local density distribution $\langle n_i^2\rangle$. Since the worm code does not work in the site basis, it will not perform measurements for such an operator directly. One possible solution is to patch the `boson` site basis used by the Bose-Hubbard Hamiltonian, adding an `n2` operator for the squared density:

    <SITEBASIS name="boson">
    <PARAMETER name="Nmax" default="infinity"/>
    <QUANTUMNUMBER name="N" min="0" max="Nmax"/>
    <OPERATOR name="bdag" matrixelement="sqrt(N+1)">
        <CHANGE quantumnumber="N" change="1"/>
    </OPERATOR>
    <OPERATOR name="b" matrixelement="sqrt(N)">
        <CHANGE quantumnumber="N" change="-1"/>
    </OPERATOR>
    <OPERATOR name="n" matrixelement="N"/>
    <OPERATOR name="n2" matrixelement="N*N"/>   <!-- added -->
    </SITEBASIS>

With this patch, one can define the corresponding measurements in the usual fashion, e.g.

    MEASURE_LOCAL[Local density squared]="n2"
    MEASURE_CORRELATIONS[Density squared, correlations]="n2:n2"

---

For how the operators used above are defined, see [Quantum Operators](../modeldef/operators). For an overview of model definitions in general, see [ALPS Model Definitions](../modeldef). For the other ALPS documentation sections, see the [General Introduction](..).
