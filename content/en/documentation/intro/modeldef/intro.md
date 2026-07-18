
---
title: Introduction
toc: true
weight: 1
---

As part of the ALPS project we need to describe quantum lattice models in a common XML format, separately from the lattice they live on. Keeping the model definition independent of the lattice means the same Hamiltonian (e.g. the Heisenberg model) can be simulated on any lattice, and the same simulation application can run any model, without changing any code.

This page covers the following topics:

- [How to specify the basis of a single site](../sitebasis)
- [How to combine single-site bases into the basis of the whole lattice](../latticebasis)
- [How to define the quantum operators from which a Hamiltonian is built](../operators)
- [How to assemble a Hamiltonian from parameters, a basis, and site/bond terms](../hamiltonian)

## The default model library file

The model library file defines the Hilbert space and the Hamiltonian of the problem. The default model library is found in `$ALPSPATH/lib/xml/models.xml`, and it contains many of the commonly used models:

| **model name** | **list of available parameters** | **remark** |
| :------------- | :-------------------------------- | :--------- |
| spin | J Jz Jxy J0 Jz0 Jxy0 J1 Jz1 Jxy1 h Gamma D K K0 K1 | anisotropic (XXZ) exchange, optionally with a field, single-ion anisotropy, and biquadratic terms |
| boson Hubbard | mu t V U t0 t1 V0 V1 | |
| hardcore boson | same as above | boson Hubbard model with on-site occupation restricted to 0 or 1, equivalent to the `U → ∞` limit |
| fermion Hubbard | same as above | spinful fermions; `U` couples opposite-spin occupation on the same site |
| spinless fermions | mu t V t0 t1 V0 V1 | no `U`, since two spinless fermions cannot occupy the same site |
| Kondo lattice | mu t J | conduction electrons (`mu`, `t`) exchange-coupled (`J`) to localized spins |
| t-J | mu t J V t0 t1 t2 V0 V1 V2 J0 J1 J2 | effective low-energy model for the Hubbard model in the large-`U` limit |

The parameters above refer to the following physical quantities:

| **symbol(s)** | **meaning** |
| :------------ | :---------- |
| `mu` | chemical potential |
| `t`, `t0`, `t1`, `t2` | hopping amplitude (site- or bond-type dependent) |
| `U` | on-site interaction |
| `V`, `V0`, `V1`, `V2` | nearest-neighbor (bond) interaction |
| `J`, `J0`, `J1`, `J2` | isotropic exchange coupling, or the t-J model's superexchange |
| `Jz`, `Jz0`, `Jz1` | Ising (`Sz·Sz`) part of an anisotropic (XXZ) exchange coupling |
| `Jxy`, `Jxy0`, `Jxy1` | XY (transverse) part of an anisotropic exchange coupling |
| `h` | uniform longitudinal field, coupling to `Sz` |
| `Gamma` | transverse field, coupling to `Sx` |
| `D` | single-ion anisotropy, coupling to `(Sz)^2` |
| `K`, `K0`, `K1` | biquadratic exchange, coupling to `(Si·Sj)^2` |

These models were introduced in the following original papers: the Heisenberg exchange model by [Heisenberg (1928)](https://doi.org/10.1007/BF01328601), the Hubbard model by [Hubbard (1963)](https://doi.org/10.1098/rspa.1963.0204), the Bose-Hubbard model by [Fisher et al. (1989)](https://doi.org/10.1103/PhysRevB.40.546), the Kondo lattice model by [Doniach (1977)](https://doi.org/10.1016/0378-4363(77)90190-5), and the t-J model by [Anderson (1987)](https://doi.org/10.1126/science.235.4793.1196) and [Zhang and Rice (1988)](https://doi.org/10.1103/PhysRevB.37.3759).

## General structure of a model library file

The typical structure of a model library is the following:

    <MODEL>
    <SITEBASIS name="..."> ... </SITEBASIS>
    <BASIS name="..."> ... </BASIS>
    <HAMILTONIAN name="..."> ... </HAMILTONIAN>
    </MODEL>

The `<SITEBASIS>` command defines the Hilbert space (basis) of a single site, the `<BASIS>` command defines the Hilbert space of the whole lattice, and the `<HAMILTONIAN>` defines the Hamiltonian.

---

For an overview of the rest of this section, see [ALPS Model Definitions](..). For how the lattice itself is specified, see [Lattice Definitions](../../latticehowtos). For the other ALPS documentation sections, see the [General Introduction](../..).
