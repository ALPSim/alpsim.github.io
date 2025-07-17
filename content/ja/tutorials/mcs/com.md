
---
title: Which code to choose for your calculation
math: true
toc: true
weight: 1
---

There are currently four QMC representations / algorithms: looper, dirloop_sse, worm, and quantum Wang-Landau.
All four methods (except sometimes Looper) may be used to study (unfrustrated) spin models. Only worm and sometimes dirloop_sse may be used for boson models.

- Looper: Only usable for models with inversion symmetry in spin space (for Heisenberg models, no magnetic field). `Looper` has the smaller range of applicability, but if applicable, it shows the best performance (shortest autocorrelation time).
- dirloop_sse: Stochastic Series Expansion representation, using directed loops (essentially worms). Good for spin models with anisotropy that breaks inversion symmetry in spin space e.g., Heisenberg models in a magnetic field. Also good for hard core bosons, with at most one boson per site. Extremely inefficient for soft core boson models where a few bosons on a site give a very large U term in the Hamiltonian. Can measure the Green function.
- Worm: Path integral representation, using worms. Good for Bose-Hubbard models and for spin models in very strong fields. Can simulate Bose-Hubbard models also with non-small filling (set the parameter N_max). [If you have an action which is non-local in time, the path integral representation in the worm algorithm is a good starting point to write your own code.]
- quantum Wang-Landau: Good for calculations of free energy and entropy.


