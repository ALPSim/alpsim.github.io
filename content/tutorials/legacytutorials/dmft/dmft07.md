
---
title: DMFT-07 Hirsch-Fye
math: true
toc: true
---

## Tutorial 07: Hirsch Fye Code

We start by running a discrete time Monte Carlo code: the [Hirsch Fye code](https://link.aps.org/doi/10.1103/PhysRevLett.56.2521). As an example we reproduce Fig. 11 in the DMFT review by [Georges it et al.](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13). The series of six curves shows how the system, a Hubbard model on the Bethe lattice with interaction $U=3D/\sqrt{2}$ at half filling, enters an antiferromagnetic phase upon cooling.

The Hirsch Fye algorithm is described in [here](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13), and this review also provides an open source implementation for the codes. More information can also be found in [Blümer's PhD](http://komet337.physik.uni-mainz.de/Bluemer/Thesis/bluemer_color.pdf). While many improvements have been developed (see e.g. [Alvarez08]() or [Nukala09](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.80.195111)), the algorithm has been replaced by [continuous-time algorithms](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.76.235123) eliminating systematic discretization errors.

The Hirsch Fye simulation will run for about 20 seconds per iteration. The python scripts for running this simulation can be found in the directory `tutorials/dmft-07-hirschfye`, a short version `tutorial7.py` running simulations at 2 temperatures only (takes 5 minutes) or a version reproducing all 6 temperatures `tutorial7_long.py`. For evaluation you may use the same script `tutorial2eval.py` as it is described in the tutorial [ALPS_2_Tutorials:DMFT-02_Hybridization](../../dmft/dmft02).

If you want to use Vistrails to run your DMFT-simulations, you can use `dmft-07-hirschfye.vt`.

The main parameters are same as those described in the tutorial [ALPS_2_Tutorials:DMFT-02_Hybridization](../../dmft/dmft02).

As a discrete time method, HF suffers from $\Delta\tau$ - errors. Pick a set of parameters and run it for sucessively larger N.


Tutorial by Emanuel - Please don't hesitate to ask!

## Contributors

-Emanuel Gull
