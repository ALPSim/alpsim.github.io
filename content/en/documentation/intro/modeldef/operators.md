
---
title: Quantum Operators
toc: true
weight: 4
---

## Simple site operators

The basic quantum operators from which the Hamiltonian operators will be built are specified by a name, a matrix element, and, optionally, the changes the operator causes to quantum numbers. These operators are defined within the site basis. Examples are:

    <SITEBASIS name="spin">
    <PARAMETER name="local_spin" default="1/2"/>
    <QUANTUMNUMBER name="S" min="local_spin" max="local_spin"/>
    <QUANTUMNUMBER name="Sz" min="-S" max="S"/>

    <OPERATOR name="Splus" matrixelement="sqrt(S*(S+1)-Sz*(Sz+1))">
        <CHANGE quantumnumber="Sz" change="1"/>
    </OPERATOR>

    <OPERATOR name="Sminus" matrixelement="sqrt(S*(S+1)-Sz*(Sz-1))">
        <CHANGE quantumnumber="Sz" change="-1"/>
    </OPERATOR>

    <OPERATOR name="Sz" matrixelement="Sz"/>
    </SITEBASIS>

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
    </SITEBASIS>

    <SITEBASIS name="fermion">
    <QUANTUMNUMBER name="Nup" min="0" max="1" type="fermionic"/>
    <QUANTUMNUMBER name="Ndown" min="0" max="1" type="fermionic"/>

    <OPERATOR name="cdag_up" matrixelement="1">
        <CHANGE quantumnumber="Nup" change="1"/>
    </OPERATOR>

    <OPERATOR name="c_up" matrixelement="1">
        <CHANGE quantumnumber="Nup" change="-1"/>
    </OPERATOR>

    <OPERATOR name="cdag_down" matrixelement="1">
        <CHANGE quantumnumber="Ndown" change="1"/>
    </OPERATOR>

    <OPERATOR name="c_down" matrixelement="1">
        <CHANGE quantumnumber="Ndown" change="-1"/>
    </OPERATOR>
    </SITEBASIS>

Unlike `bdag`/`b`, the fermionic creation/annihilation operators `cdag_up`/`c_up` have a matrix element of plain `1` rather than a square root, since `Nup` only ever takes the two values 0 and 1: the `<QUANTUMNUMBER>`'s own `max="1"` already forbids double occupancy, so no occupation-dependent prefactor is needed. Declaring `Nup`/`Ndown` as `type="fermionic"` (as explained in [Site Basis](../sitebasis)) is what makes these operators anticommute correctly with fermionic operators on other sites — this is exactly what lets `cdag_up`/`c_up` be combined into the `fermion_hop` bond operator below.

The optional `<CHANGE>` element states that applying the operator shifts the given quantum number by the specified amount — `Splus` raises `Sz` by 1, `Sminus` lowers it by 1, and `bdag`/`b` raise/lower `N` by 1. An operator with no `<CHANGE>` element, like `Sz` or `n` above, is diagonal: it leaves every quantum number unchanged. In the specification of the matrix element, the value of the quantum numbers can be referred to through the name of the quantum number (`S`, `Sz`, `N` in these examples) — always evaluated using the values of the *initial* state, before the `<CHANGE>` is applied.

## Complex site operators

In addition to the simple site operators which change a quantum number in a unique way, one can construct more complex site operators such as the `Sx` spin operator:

    <SITEOPERATOR name="Sx" site="i">
    1/2*(Splus(i)+Sminus(i))
    </SITEOPERATOR>

or an operator counting on-site boson pairs, used e.g. in the on-site interaction term of the Bose-Hubbard Hamiltonian:

    <SITEOPERATOR name="double_occupancy" site="x">
    n(x)*(n(x)-1)/2
    </SITEOPERATOR>

These operator definitions can use any other simple or complex site operator. The argument given to the operator in parentheses is the symbolic name for the site, which is specified by the site attribute in the `<SITEOPERATOR>` element.

## Complex bond operators

Similar to the complex site operator, we can also define two-site, or bond, operators. The first example below is the Heisenberg exchange interaction `S(x)·S(y)`, written in terms of `Sz`, `Splus`, and `Sminus`; the second is a spin-conserving fermion hopping term, written in terms of independent up- and down-spin operators:

    <BONDOPERATOR name="exchange" source="x" target="y">
    Sz(x)*Sz(y)+1/2*(Splus(x)*Sminus(y)+Sminus(x)*Splus(y))
    </BONDOPERATOR>

    <BONDOPERATOR name="fermion_hop" source="x" target="y">
    cdag_up(x)*c_up(y)+cdag_up(y)*c_up(x)+cdag_down(x)*c_down(y)+cdag_down(y)*c_down(x)
    </BONDOPERATOR>

where we now have two sites, labeled `source` and `target`. All the operators defined on this page — simple site, complex site, and bond — can be referenced by name in the `<SITETERM>`/`<BONDTERM>` elements of a `<HAMILTONIAN>` (see [Hamiltonian Descriptions](../hamiltonian)), and in custom measurement definitions (see [ALPS Custom Measurement](../../measuredef)).

---

For an overview of the rest of this section, see [ALPS Model Definitions](..). For how these operators are assembled into a Hamiltonian, see [Hamiltonian Descriptions](../hamiltonian). For the other ALPS documentation sections, see the [General Introduction](../..).
