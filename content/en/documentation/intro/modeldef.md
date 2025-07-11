
---
title: ALPS Model Definitions
toc: true
weight: 5
---

As part of the ALPS project we need to describe quantum lattice models in a common format. The lattice descriptions using the lattice schema are associated with basis and Hamiltonian descriptions for each site and bond in the lattice.

## The default model libary file

The model library file defines the Hilbert space and the Hamiltonian of the problem. The default model library is found in $ALPSPATH/lib/xml/models.xml , and it contains many of the commonly used models, such as the "t-J", the "Bose Hubbard", the "spin 1/2", and many others.

List of models defined in the default model libary file:
| **model name** | **list of available parameters** |
| :------------- | :------------------------------- |
| spin | J Jz Jxy J0 Jz0 Jxy0 J1 Jz1 Jxy1 h Gamma D K K0 K1 |
| boson Hubbard | mu t V U t0 t1 V0 V1 |
| hardcore boson | same as above |
| fermion Hubbard | same as above |
| spinless fermions | mu t V t0 t1 V0 V1 |
| Kondo lattice | mu t J |
| t-J | mu t J V J t0 t1 t2 V0 V1 V2 J0 J1 J2 |

## General structure of a model library file 

The typical structure of a model libary is the following: 

    <MODEL>
    <SITEBASIS Name=...> ... </SITEBASIS>
    <BASIS Name=...> ... </BASIS>
    <HAMILTONIAN Name=...> ... </HAMILTONIAN>
    </MODEL>

The `<SITEBASIS>` command defines the Hilbert space (basis) of a single site, the `<BASIS>` command defines the Hilbert space of the whole lattice, and the `<HAMILTONIAN>` defines the Hamiltonian.

### The basis of a single site

Basis states of a single site are described by one or more quantumnumbers as in:

    <SITEBASIS name="hardcore boson">
    <QUANTUMNUMBER name="N" min="0" max="1"/> 
    </SITEBASIS>
 
    <SITEBASIS name="spin-1/2">
    <QUANTUMNUMBER name="S" min="1/2" max="1/2"/>
    <QUANTUMNUMBER name="Sz" min="-1/2" max="1/2"/>
    </SITEBASIS>
 
    <SITEBASIS name="fermion">
    <QUANTUMNUMBER name="Nup" min="0" max="1" type="fermionic"/>
    <QUANTUMNUMBER name="Ndown" min="0" max="1" type="fermionic"/>
    </SITEBASIS>
 
 Don't forget the total spin S quantum number for spins since this will be needed n the definition of the matrix elements of spin operators!
The `<SITEBASIS>` takes a name attribute by which it can later be referenced.
The `<QUANTUMNUMBER>` elements each take a name, and minimum and maximum values in the min and max attributes. The quantum numbers can take values between min, min+1, min+2 ... up to max. Optionally, a type attribute can be set to bosonic (the default) or fermionic. It should be set to fermionic when the quantum number is a fermionic number operator. This information will be used when determining commutation relation between operators on different sites.
The range of the quantum numbers can be parametrized by input parameters, and `default` can be specified such as in
 
    <SITEBASIS name="boson">
    <PARAMETER name="Nmax" default="infinity"/>
    <QUANTUMNUMBER name="N" min="0" max="Nmax"/>
    </SITEBASIS>
 
 For more complicated models, such as a t-J model, sometimes several options are possible. We can label the states either by the particle number and spin, or by the number of up and down spins:

    <SITEBASIS name="t-J">
    <QUANTUMNUMBER name="N" min="0" max="1" type="fermionic"/>
    <QUANTUMNUMBER name="S" min="N/2" max="N/2"/>
    <QUANTUMNUMBER name="Sz" min="-S" max="S"/>
    </SITEBASIS>
 
    <SITEBASIS name="alternative t-J">
    <QUANTUMNUMBER name="Nup" min="0" max="1" type="fermionic"/>
    <QUANTUMNUMBER name="Ndown" min="0" max="1-Nup" type="fermionic"/>
    </SITEBASIS>

## The basis of the full lattice model

The basis set of a lattice model is specified by giving the basis for each type of sites (vertices) in the lattice. If there is just one type of sites, only one site basis needs to be given as in:

    <BASIS name="spin">
    <SITEBASIS ref="spin"/>
    </BASIS>
 
    <BASIS name="spin">
    <SITEBASIS name="spin-1">
        <QUANTUMNUMBER name="S" min="1" max="1"/>
        <QUANTUMNUMBER name="Sz" min="-1" max="1"/>
    </SITEBASIS>
    </BASIS>
 
 The basis again takes a name attribute and contains a `<SITEBASIS>` element which is used as default for all sites. The <SITEBASIS> can either reference a previously defined one by a ref attribute or just declare the full site basis as above.
 
### Lattices with more than one site per unit-cell

If the lattice contains more than one site per unit-cell, the `<BASIS>` command should contain one `<SITEBASIS>` entry for each site of the unit-cell. Each entry should have a different Type, corresponding to the definitions given in the lattice library file (see documentation).
The following basis offers a valid example of the Hilbert space on a bipartite lattice:

    <BASIS name="Kondo lattice">
    <SITEBASIS type="0" ref="fermion"/>
    <SITEBASIS type="1" ref="spin-1/2"/>
    </BASIS>
 
 In some spin models we might have the same local site basis but the magnitue of the spin might change, and we want to e.g. specify the value of the spin on sites with type 0 and 1 by the parameters `local_S0` and `local_S1`, as well as provide suitable defaults:
 
    <BASIS name="spin">
    <SITEBASIS type="0" ref="spin">
        <PARAMETER name="local_spin" value="local_S0"/>
        <PARAMETER name="local_S0" value="local_S"/>
        <PARAMETER name="local_S" value="1/2"/>
    </SITEBASIS>
    <SITEBASIS type="1" ref="spin">
        <PARAMETER name="local_spin" value="local_S1"/>
        <PARAMETER name="local_S1" value="local_S"/>
        <PARAMETER name="local_S" value="1/2"/>
    </SITEBASIS>
    </BASIS>
 
 When adding more site types this can become cumbersome, and the ALPS format allows a shortcut. If no `type` is specified, the SITEBASIS matches any site, and the wildcard character "#" in any parameter name is replaced by the site type. That way the above example can be extended to an infinite number of site types and written more compact as:

    <BASIS name="spin">
    <SITEBASIS ref="spin">
        <PARAMETER name="local_spin" value="local_S#"/>
        <PARAMETER name="local_S#" value="local_S"/>
        <PARAMETER name="local_S" value="1/2"/>
    </SITEBASIS>
    </BASIS>
 
 ### Constraints
 
 Finally, the basis can be restricted by specifying a constraint on the sums of certain quantum numbers. For example to specify a basis for a spin model with total value of spin Sz_total, a `<CONSTRAINT>` element can be added:

    <BASIS name="spin">
    <SITEBASIS ref="spin"/>
    <CONSTRAINT quantumnumber="Sz" value="Sz_total"/>
    </BASIS>
 
 ## Quantum operators
 
 ### Simple site operators
 
 The basic quantum operators from which the Hamilton operators will be built are specified by a name, matrix element and optionally the changes the operator causes in quantum numbers. These operators are defined with the site basis. Examples are:
 
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
 
 In the specification of the matriy element, the value of the quantum numbers of the state can be referred to through the name of the quantum number (Sz in these examples)
 
 ### Complex site operators
 
 In addition to the simple site operators which change a quantum number in a unique way, one can construct more complex site operators such as the Sx spin operator
 
    <SITEOPERATOR name="Sx" site="i">
    1/2*(Splus(i)+Sminus(i))
    </SITEOPERATOR>
 
 or a double-occupancy operator for a bosonic model
 
    <SITEOPERATOR name="double_occupancy" site="x">
    n(x)*(n(x)-1)/2
    </SITEOPERATOR>
 
 These operator definitions can use any other simple or complex site operator. The argument gven to he operator in parentheses is the symbolic name for the site, which is specified by the site attribute in the SITEOPERATOR element.
 
 ### Complex bond operators
 
 Similar to the complex site oeprator we can also define two-site or "bond" operators
 
    <BONDOPERATOR name="exchange" source="x" target="y">
    Sz(x)*Sz(y)+1/2*(Splus(x)*Sminus(y)+Sminus(x)*Splus(y))
    </BONDOPERATOR>
 
    <BONDOPERATOR name="fermion_hop" source="x" target="y">
    cdag_up(x)*c_up(y)+cdag_up(y)*c_up(x)+cdag_down(x)*c_down(y)+cdag_down(y)*c_down(x)
    </BONDOPERATOR>
 
where we now have two sites, labeled `source` and `target`. These operators can again be used in Hamiltonian and measurement specifications.

## Hamiltonian descriptions

With these elements we can now describe the Hamiltonian of a model. A simple hard-core boson model could be:

    <HAMILTONIAN name="hardcore boson">
    <PARAMETER name="mu" default="0"/>
    <PARAMETER name="t" default="1"/>
    <PARAMETER name="t'" default="1"/>
    <BASIS ref="hardcore boson"/>
    <SITETERM type="0">
        -mu*n
    </SITETERM> 
    <BONDTERM type="0" source="i" target="j">
        -t*(bdag(i)*b(j)+bdag(j)*b(i)))
    </BONDTERM>
    <BONDTERM type="1" source="i" target="j">
        -t'*(bdag(i)*b(j)+bdag(j)*b(i)))
    </BONDTERM>
    </HAMILTONIAN>
 
 First, default values can be specified for parameters such as coupling constants by using `<PARAMETER>` elements.
Next, one `<BASIS>` element specifes the basis used for the model, either fully specified inline or by a reference (using the `ref` attribute).
The terms of the Hamiltonian are next specified by site terms, associated with the sites of the lattice and bond terms, associated with the bonds. Each of the `<SITETERM>` and `<BONDTERM>` elements can optionally take a type attribute. This type attribute specifies at which type of site (bond) the term will be applied. These are the same types specified in the lattice description. Omitting the type attribute applies the term to all sites or bonds for which no other term is explcitly specifed.
The `<SITETERM>` elements contain terms of the Hamiltonian associated with a single site. In the above example the term mu refers to the parameter mu while the term n refers to the operator n described above.
In the `<BONDTERM>` elements, operators referring to two different sites need to be specfied. This is done by adding the site index in parentheses after the operator, e.g. as in n(i) to act on site i. The source and target attributes specify which variables to use for specifying the sites (i and j in the example).
To simplify writing of the Hamltonians, the pre-defined site and bond operators above can be used. E.g. for a transverse field spin model we can use the Sx and `exchange` operators defined above:

    <HAMILTONIAN name="spin">
    <PARAMETER name="J" default="1"/>
    <PARAMETER name="h" default="0"/>
    <PARAMETER name="Gamma" default="0"/>
    <BASIS ref="spin"/>
    <SITETERM site="i">
        -h*Sz(i)-Gamma*Sx(i))
    </SITETERM> 
    <BONDTERM source="i" target="j">
        J*exchange(i,j)
    </BONDTERM>
    </HAMILTONIAN>
 
 Site-type dependent coupling terms can either be specified as in the first example, giving a type attribute restructing the applicability of site or bond term, or again by using the # wildcard character in the name of coupling constants which will be replaced by the type of the site as in:
 
    <HAMILTONIAN name="spin">
    <PARAMETER name="J" default="1"/>
    <PARAMETER name="h" default="0"/>
    <PARAMETER name="Gamma" default="0"/>
    <BASIS ref="spin"/>
    <SITETERM site="i">
            <PARAMETER name="h#" default="h"/>
        <PARAMETER name="Gamma#" default="Gamma"/>
        -h#*Sz(i)-Gamma#*Sx(i))
    </SITETERM> 
    <BONDTERM source="i" target="j">
        <PARAMETER name="J#" default="J"/>
        J#*exchange(i,j)
    </BONDTERM>
    </HAMILTONIAN>
 
 We can now specify couplings `J0`, `h0` and `Gamma0` on bonds of type 0, `J1`, `h1` and `Gamma1` on bonds of type 1, and so on ...
 
Extensions to more complex terms, such as 3- and 4-site terms are in preparation and will be included here as soon as the ALPS libraries support such terms.


