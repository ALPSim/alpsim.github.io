---
title: Position-Dependent Couplings
math: true
toc: true
weight: 6
---

On an ordinary ALPS lattice, every coupling in a model (`mu`, `t`, `J`, `h`, ...) has one value, used on every site or every bond of a given type. Many problems need couplings that change from place to place: a harmonic trap or a linear tilt in the chemical potential, a field gradient, or a random potential. ALPS handles these with two pieces:

1. an **inhomogeneous lattice**, which tells ALPS to evaluate the site terms (or bond terms) separately on every site (or bond), and
2. a **parameter expression** that uses the coordinates `x`, `y` and `z` of that site or bond, or a random number.

Nothing in the model has to change: the built-in models in `models.xml` can be used as they are.

## A first example

The following parameter file puts hardcore bosons in a linear potential $\mu(x) = \mu_\text{left} - s\,x$ on a chain of 6 sites:

```
LATTICE="inhomogeneous chain lattice"
L=6
MODEL="hardcore boson"
t=1
mu_left=1
slope=0.4
mu="mu_left - slope*x"
T=1
THERMALIZATION=5000
SWEEPS=20000
MEASURE[Local Density]=1
```

Run it as usual, for example

```bash
parameter2xml parm_tilt
dirloop_sse parm_tilt.in.xml
```

The `Local Density` measurement then shows the density falling from the left end of the chain ($x=0$) to the right end ($x=5$).

The value of `mu` is quoted because it is an expression rather than a number. It is evaluated once for every site, with `x` set to that site's coordinate. Expressions can refer to other parameters, here `mu_left` and `slope`.

{{< callout type="warning" >}}
Choose the names of helper parameters with care. Most built-in models also read per-type couplings such as `mu0`, `t0`, `V0` or `J1` (see the `#` wildcard in [Hamiltonian Descriptions](../hamiltonian)), and a parameter with one of these names silently replaces `mu`, `t`, `V` or `J` on that site or bond type. Had the example above used `mu0` and `V0` instead of `mu_left` and `slope`, `mu0=1` would have overridden the tilted `mu` on every site, and `V0=0.4` would have switched on a nearest-neighbour repulsion, with no error or warning.
{{< /callout >}}

## Inhomogeneous lattices

A lattice is inhomogeneous when its `<LATTICEGRAPH>` contains an `<INHOMOGENEOUS>` element. The lattice library `lattices.xml` already contains four of them:

| `LATTICE` | Parameters | Inhomogeneous |
| :-------- | :--------- | :------------ |
| `inhomogeneous chain lattice` | `L` | sites |
| `inhomogeneous square lattice` | `L`, `W` (default `L`) | sites |
| `inhomogeneous simple cubic lattice` | `L`, `W` (default `L`), `H` (default `W`) | sites |
| `inhomogeneous anisotropic square lattice` | `L`, `W` (default `L`) | sites |

All four have open boundaries, and only their site terms are position dependent.

To make your own lattice inhomogeneous, add the element after `<UNITCELL>`:

```xml
<LATTICEGRAPH name = "inhomogeneous periodic chain lattice">
  <FINITELATTICE>
    <LATTICE ref="chain lattice"/>
    <EXTENT dimension="1" size="L"/>
    <BOUNDARY type="periodic"/>
  </FINITELATTICE>
  <UNITCELL ref="simple1d"/>
  <INHOMOGENEOUS><VERTEX/><EDGE/></INHOMOGENEOUS>
</LATTICEGRAPH>
```

`<VERTEX/>` makes the site terms position dependent and `<EDGE/>` makes the bond terms position dependent; use either or both. They apply to all sites or all bonds: restricting them to one type with a `type` attribute is not supported. The [Bose glass](../../../methods/qmc/boseglass) page uses the same element to give the square lattice periodic boundaries.

{{< callout type="info" >}}
A file given with `LATTICE_LIBRARY` replaces the built-in `lattices.xml`; it is not added to it. A definition that refers to `chain lattice` or `simple1d`, as above, therefore needs those definitions in the same file. The simplest way is to copy `lattices.xml` and add your lattice to the copy. `printgraph` (see [Checking a Lattice](../../latticehowtos/checklattice)) shows the sites, bonds and coordinates of the result.
{{< /callout >}}

## Coordinates in expressions

On an inhomogeneous lattice, an expression can use these variables:

| Variable | In a site term | In a bond term |
| :------- | :------------- | :------------- |
| `x` | first coordinate of the site | first coordinate of the midpoint of the bond |
| `y` | second coordinate (2D and 3D lattices) | second coordinate of the midpoint |
| `z` | third coordinate (3D lattices) | third coordinate of the midpoint |

The coordinates are the ones `printgraph` prints for the lattice. For the chain, square and simple cubic lattices they are the integer cell positions, from 0 to `L-1` along the first direction. A trap centred on an `L`$\times$`L` square lattice is therefore

```
LATTICE="inhomogeneous square lattice"
L=10
mu="4 - 0.2*((x-(L-1)/2)^2 + (y-(L-1)/2)^2)"
```

Bond terms use the midpoint of the bond. On a chain, the bond between sites $x=2$ and $x=3$ sees `x=2.5`, so with `<EDGE/>` in the lattice

```
J="1 + 0.2*x"
```

gives that bond $J = 1.5$.

The same variables can also be used inside a model definition. For example, this `<HAMILTONIAN>` builds the tilt into the model, so the parameter file only sets `mu` and `slope`:

```xml
<HAMILTONIAN name="tilted hardcore boson">
  <PARAMETER name="mu" default="0"/>
  <PARAMETER name="slope" default="0"/>
  <PARAMETER name="t" default="1"/>
  <BASIS ref="hardcore boson"/>
  <SITETERM site="i">-(mu - slope*x)*n(i)</SITETERM>
  <BONDTERM source="i" target="j">-t*(bdag(i)*b(j)+bdag(j)*b(i))</BONDTERM>
</HAMILTONIAN>
```

As with `LATTICE_LIBRARY`, a file given with `MODEL_LIBRARY` replaces the built-in `models.xml`, so add the new Hamiltonian to a copy of it.

Two errors are common:

- On a lattice without `<INHOMOGENEOUS>`, the coordinates are not defined, and the program stops with `Cannot evaluate expression ...` followed by the expression that uses them.
- `x`, `y` and `z` are reserved on an inhomogeneous lattice. Defining one of them as a parameter stops the program with `x, y or z is predefined as parameter and used as coordinate`.

## Functions and operators

Expressions can use `+`, `-`, `*`, `/`, `^` (power) and parentheses, the constant `Pi` (also `PI` or `pi`), and these functions:

| Function | Meaning |
| :------- | :------ |
| `sqrt(a)`, `abs(a)` | square root, absolute value |
| `exp(a)`, `log(a)` | exponential, natural logarithm |
| `sin(a)`, `cos(a)`, `tan(a)` | trigonometric functions (in radians) |
| `asin(a)`, `acos(a)`, `atan(a)` | inverse trigonometric functions |
| `atan2(y, x)` | angle of the point $(x, y)$ |
| `random()` | uniform random number in $[0, 1)$ |
| `gaussian_random()` | normally distributed random number with mean 0 and standard deviation 1 |
| `gaussian_random(m, s)` | normally distributed random number with mean `m` and standard deviation `s` |
| `integer_random(n)` | random integer from 0 to `n-1` |

`normal_random` is another name for `gaussian_random`.

## Random disorder

On an inhomogeneous lattice, a random function is evaluated separately on every site (or bond), so

```
mu="delta*(2*random() - 1)"
```

gives every site its own chemical potential, uniformly distributed between `-delta` and `delta`.

The random numbers come from their own generator, seeded with `DISORDERSEED` (default 0). This seed is separate from `SEED`, the seed of the Monte Carlo updates. Runs with the same `DISORDERSEED` therefore see the same disorder, even when their `SEED` differs. To average over disorder, give each realization its own `DISORDERSEED` in a `{ }` block, which makes it a separate task:

```
{ DISORDERSEED = 34275; }
{ DISORDERSEED = 49802; }
{ DISORDERSEED = 82529; }
```

and average the results of the tasks afterwards. The [Bose glass](../../../methods/qmc/boseglass) page has a complete example.

## Which programs support it

Position-dependent couplings work in the exact diagonalization codes (`sparsediag`, `fulldiag`), in `dmrg`, and in the quantum Monte Carlo codes (`dirloop_sse`, `loop`, `worm`). The [optical lattice](../../../methods/qmc/bhol) page uses `dirloop_sse` to simulate bosons in a three-dimensional trap.

### `worm` needs a lattice, not a graph

A `GRAPH` from the lattice library (a list of vertices and edges, without a unit cell) can be used with `dirloop_sse` and the exact diagonalization codes, but not with `worm`, which stops with

```
Cannot save a measurement of size 0.
```

To run `worm` on a small cluster such as a single triangle, describe the cluster as the unit cell of a lattice with open boundaries and set `L=1`. The `Kagome` unit cell in `lattices.xml` is a triangle of 3 sites, so

```xml
<LATTICEGRAPH name = "open kagome lattice">
  <FINITELATTICE>
    <LATTICE ref="triangular lattice"/>
    <PARAMETER name="W" default="L"/>
    <EXTENT dimension="1" size="L"/>
    <EXTENT dimension="2" size="W"/>
    <BOUNDARY type="open"/>
  </FINITELATTICE>
  <UNITCELL ref="Kagome"/>
</LATTICEGRAPH>
```

with `LATTICE="open kagome lattice"` and `L=1` is a triangle that `worm` accepts. Add `<INHOMOGENEOUS><VERTEX/></INHOMOGENEOUS>` to it to make the couplings position dependent as well.

---

For the Hamiltonian terms these parameters enter, see [Hamiltonian Descriptions](../hamiltonian). For how lattices and unit cells are defined, see [Lattice Definitions](../../latticehowtos). For the other parameters common to ALPS programs, see [Common Parameters](../../parameters).
