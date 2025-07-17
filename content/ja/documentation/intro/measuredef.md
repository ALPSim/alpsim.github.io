
---
title: ALPS Custom Measurement
toc: true
weight: 6
---

## Defining your custom measurements

In case the default measurements performed by your favorite ALPS code do not suffice for your problem, you can define your custom measurements in the parameter file. The general syntax is as follows:

    MEASURE_LOCAL[Name]=Op
    MEASURE_AVERAGE[Name]=Op

Here "Name" is the name under which your measurements appear in the xml output, and "Op" is the measurement operator, which must be defined in the `models.xml` file. MEASURE_AVERAGE measures the quantum mechanical and (for finite temperature simulations) thermodynamic expectation value of the operator Op. MEASURE_LOCAL measures the expectation values of the operator Op for each site of the lattice. The operator must be local, i.e., it can only have site terms.

    MEASURE_CORRELATIONS[Name]="Op1:Op2"
    MEASURE_CORRELATIONS[Name]=Op    

MEASURE_CORRELATIONS measures the correlations of the operators Op1 and Op2 for all inequivalent pairs of sites of the lattice. The second form above, MEASURE_CORRELATIONS[Name]=Op is equivalent to MEASURE_CORRELATIONS[Name]="Op:Op". At present, only two-site correlation functions can be computed. That is, both Op1 and Op2 must be site operators.

    MEASURE_STRUCTURE_FACTOR[Name]=Op

This measures the structure factor for the operator Op using the momentum eigenstates for the simulation lattice.

Notice that not all ALPS codes support all the above statements. Several codes have additional facilities for defining measurements. Consult the tutorial pages for your favorite code.

## Further tricks and workarounds

Measuring off-diagonal quantities in QMC codes is in general non-trivial and is hard to implement in a generic fashion. If your favorite QMC program refuses to perform your favorite measurement, you may need to modify the source code.
In certain cases, however several tricks can be used. One useful trick is to enlarge the site basis of your model. Consider the following example: Using the worm code to simulate the Bose Hubbard model on an inhomogeneous lattice, measure the second moment of local density distribution $\langle n_i^2\rangle$. Since the worm code does not work in the site basis, it will not perform measurements for such an operator. One possible solution would be to patch the site basis "boson" which is used by the Bose Hubbard hamiltonian:

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
    <OPERATOR name="n2" matrixelement="N*N"/>   <--!  added -->
    </SITEBASIS> 
 
 With this patch, one may define the corresponding measurements in a usual fashion, e.g.
 
    MEASURE_LOCAL[Local density squared]="n2"
    MEASURE_CORRELATIONS[Density squared, correlations]="n2:n2"




