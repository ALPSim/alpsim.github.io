
---
title: DMFT-06 Paramagnet
math: true
toc: true
---

## Paramagnetic metal and extrapolation errors

In this example we simulate the Hubbard model on the Bethe lattice with interaction $U=3D/\sqrt{2}$ at a temperature $\beta =32 \sqrt{2}/D$ using a paramagnetic self-consistency. We will calculate the self-energy and compare it to Fig. 15 in the DMFT review by [Georges it et al.](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13), where Hirsch-Fye and Exact Diagonalization results are shown for the same system. In contrast to the Hirsch-Fye algorithm the two Continuous time Monte Carlo algorithms CT-HYB and CT-INT do not suffer from discretization errors and reproduce the ED results.

The parameter files and python scripts are located in the subdirectories `hyb` and `int` of the directory `tutorials/dmft-06-paramagnet` in your ALPS install directory. You can run the simulations by executing (for the hybridization expansion version)

    alpspython tutorial6a.py

and (for the interaction expansion version)

    alpspython tutorial6b.py
    
At each DMFT iteration i the self-energy is written to the file `selfenergy_i`. Plot the converged self-energy and compare your results to Fig. 15 in [Georges it et al.](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13). Alternatively you may use the python script for this task as it is done in the tutorial [ALPS 2 Tutorials:DMFT-02 Hybridization](../dmft02).


Warning: It takes long to run on a single workstation (you may run it in $2\times 24$ minutes if you do not want very high precision).
