
---
title: 实现论文与算法论文
description: "ALPS 实现论文与算法论文"
weight: 2
---

下面列出了各个 ALPS 应用程序的实现论文，以及它们所依据的原始算法论文。

---

### 并行蒙特卡洛调度程序

*源代码：[`src/alps/scheduler/`](https://github.com/ALPSim/ALPS/tree/master/src/alps/scheduler)*

**实现论文**

M. Troyer, B. Ammon, and E. Heeb, *Parallel object oriented Monte Carlo Simulations*, Lect. Notes Comput. Sci. **1505**, 191 (1998).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.1007/3-540-49372-7_20" icon="article" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1007/3-540-49372-7_20" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/troyer1998.bib" icon="format_quote" >}}
</div>

---

### 精确对角化与完全对角化 — `sparsediag` 与 `fulldiag`

*源代码：[`applications/diag/sparsediag/`](https://github.com/ALPSim/ALPS/tree/master/applications/diag/sparsediag), [`fulldiag/`](https://github.com/ALPSim/ALPS/tree/master/applications/diag/fulldiag)*

**实现论文**

B. Bauer, L. D. Carr, H. G. Evertz, A. Feiguin, J. Freire, S. Fuchs, L. Gamper, J. Gukelberger, E. Gull, S. Guertler, A. Hehn, R. Igarashi, S. V. Isakov, D. Koop, P. N. Ma, P. Mates, H. Matsuo, O. Parcollet, G. Pawłowski, J. D. Picon, L. Pollet, E. Santos, V. W. Scarola, U. Schollwöck, C. Silva, B. Surer, S. Todo, S. Trebst, M. Troyer, M. L. Wall, P. Werner, and S. Wessel, *The ALPS project release 2.0: open source software for strongly correlated systems*, J. Stat. Mech. **2011**, P05001 (2011).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.1088/1742-5468/2011/05/P05001" icon="article" >}}
{{< cta-button text="arXiv" link="https://arxiv.org/abs/1101.2646" icon="science" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1088/1742-5468/2011/05/P05001" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/bauer2011.bib" icon="format_quote" >}}
</div>

**算法论文**

C. Lanczos, *An iteration method for the solution of the eigenvalue problem of linear differential and integral operators*, J. Res. Natl. Bur. Stand. **45**, 255-282 (1950).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.6028/jres.045.026" icon="article" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.6028/jres.045.026" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/lanczos1950.bib" icon="format_quote" >}}
</div>

---

### 自旋模型的经典蒙特卡洛 — `spinmc`

*源代码：[`applications/mc/spins/`](https://github.com/ALPSim/ALPS/tree/master/applications/mc/spins)*

**算法论文**

R. H. Swendsen and J.-S. Wang, *Nonuniversal critical dynamics in Monte Carlo simulations*, Phys. Rev. Lett. **58**, 86 (1987).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.1103/PhysRevLett.58.86" icon="article" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1103/PhysRevLett.58.86" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/swendsen1987.bib" icon="format_quote" >}}
</div>

U. Wolff, *Collective Monte Carlo updating for spin systems*, Phys. Rev. Lett. **62**, 361 (1989).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.1103/PhysRevLett.62.361" icon="article" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1103/PhysRevLett.62.361" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/wolff1989.bib" icon="format_quote" >}}
</div>

---

### 圈算法 QMC — `looper`

*源代码：[`applications/qmc/looper/`](https://github.com/ALPSim/ALPS/tree/master/applications/qmc/looper)*

**实现论文**

S. Todo and K. Kato, *Cluster Algorithms for General-S Quantum Spin Systems*, Phys. Rev. Lett. **87**, 047203 (2001).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.1103/PhysRevLett.87.047203" icon="article" >}}
{{< cta-button text="arXiv" link="https://arxiv.org/abs/cond-mat/9911047" icon="science" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1103/PhysRevLett.87.047203" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/todo2001.bib" icon="format_quote" >}}
</div>

**算法论文**

H. G. Evertz, G. Lana, and M. Marcu, *Cluster algorithm for vertex models*, Phys. Rev. Lett. **70**, 875 (1993).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.1103/PhysRevLett.70.875" icon="article" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1103/PhysRevLett.70.875" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/evertz1993.bib" icon="format_quote" >}}
</div>

B. B. Beard and U.-J. Wiese, *Simulations of Discrete Quantum Systems in Continuous Euclidean Time*, Phys. Rev. Lett. **77**, 5130 (1996).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.1103/PhysRevLett.77.5130" icon="article" >}}
{{< cta-button text="arXiv" link="https://arxiv.org/abs/cond-mat/9602164" icon="science" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1103/PhysRevLett.77.5130" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/beard1996.bib" icon="format_quote" >}}
</div>

H. G. Evertz, *The loop algorithm*, Adv. Phys. **52**, 1 (2003).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.1080/0001873021000049195" icon="article" >}}
{{< cta-button text="arXiv" link="https://arxiv.org/abs/cond-mat/9707221" icon="science" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1080/0001873021000049195" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/evertz2003.bib" icon="format_quote" >}}
</div>

---

### SSE 表示下的有向圈代码 — `dirloop_sse`

*源代码：[`applications/qmc/sse/`](https://github.com/ALPSim/ALPS/tree/master/applications/qmc/sse), [`sse2/`](https://github.com/ALPSim/ALPS/tree/master/applications/qmc/sse2), [`sse4/`](https://github.com/ALPSim/ALPS/tree/master/applications/qmc/sse4)*

**实现论文**

F. Alet, S. Wessel, and M. Troyer, *Generalized directed loop method for quantum Monte Carlo simulations*, Phys. Rev. E **71**, 036706 (2005).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.1103/PhysRevE.71.036706" icon="article" >}}
{{< cta-button text="arXiv" link="https://arxiv.org/abs/cond-mat/0308495" icon="science" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1103/PhysRevE.71.036706" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/alet2005pre.bib" icon="format_quote" >}}
</div>

**算法论文**

A. W. Sandvik, *Stochastic series expansion method with operator-loop update*, Phys. Rev. B **59**, R14157 (1999).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.1103/PhysRevB.59.R14157" icon="article" >}}
{{< cta-button text="arXiv" link="https://arxiv.org/abs/cond-mat/9902226" icon="science" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1103/PhysRevB.59.R14157" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/sandvik1999.bib" icon="format_quote" >}}
</div>

O. F. Syljuåsen and A. W. Sandvik, *Quantum Monte Carlo with directed loops*, Phys. Rev. E **66**, 046701 (2002).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.1103/PhysRevE.66.046701" icon="article" >}}
{{< cta-button text="arXiv" link="https://arxiv.org/abs/cond-mat/0202316" icon="science" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1103/PhysRevE.66.046701" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/syljuasen2002.bib" icon="format_quote" >}}
</div>

---

### 蠕虫算法代码 — `worms`

*源代码：[`applications/qmc/worms/`](https://github.com/ALPSim/ALPS/tree/master/applications/qmc/worms)*

**算法论文**

N. V. Prokof'ev, B. V. Svistunov, and I. S. Tupitsyn, *"Worm" algorithm in quantum Monte Carlo simulations*, Phys. Lett. A **238**, 253 (1998).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.1016/S0375-9601(97)00957-2" icon="article" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1016/S0375-9601(97)00957-2" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/prokofev1998worm.bib" icon="format_quote" >}}
</div>

---

### 量子 Wang-Landau平直直方图 QMC — `qwl`

*源代码：[`applications/qmc/qwl/`](https://github.com/ALPSim/ALPS/tree/master/applications/qmc/qwl)*

**实现论文**

M. Troyer, S. Wessel, and F. Alet, *Wang-Landau sampling for quantum systems: algorithms to overcome tunneling problems and calculate the free energy*, Phys. Rev. Lett. **90**, 120201 (2003).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.1103/PhysRevLett.90.120201" icon="article" >}}
{{< cta-button text="arXiv" link="https://arxiv.org/abs/cond-mat/0207138" icon="science" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1103/PhysRevLett.90.120201" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/troyer2003wl.bib" icon="format_quote" >}}
</div>

---

### DMFT：CT-QMC 杂质求解器与动力学平均场理论 — `dmft`、`interaction`、`hybridization`

*源代码：[`applications/dmft/`](https://github.com/ALPSim/ALPS/tree/master/applications/dmft)*

**实现论文**

E. Gull, P. Werner, S. Fuchs, B. Surer, T. Pruschke, and M. Troyer, *Continuous-Time Quantum Monte Carlo Impurity Solvers*, Comput. Phys. Commun. **182**, 1078 (2011).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.1016/j.cpc.2010.12.050" icon="article" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1016/j.cpc.2010.12.050" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/gull2011cpc.bib" icon="format_quote" >}}
</div>

**算法论文**

A. N. Rubtsov, V. V. Savkin, and A. I. Lichtenstein, *Continuous-time quantum Monte Carlo method for fermions*, Phys. Rev. B **72**, 035122 (2005).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.1103/PhysRevB.72.035122" icon="article" >}}
{{< cta-button text="arXiv" link="https://arxiv.org/abs/cond-mat/0411344" icon="science" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1103/PhysRevB.72.035122" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/rubtsov2005.bib" icon="format_quote" >}}
</div>

P. Werner, A. Comanac, L. de' Medici, M. Troyer, and A. J. Millis, *Continuous-Time Solver for Quantum Impurity Models*, Phys. Rev. Lett. **97**, 076405 (2006).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.1103/PhysRevLett.97.076405" icon="article" >}}
{{< cta-button text="arXiv" link="https://arxiv.org/abs/cond-mat/0512727" icon="science" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1103/PhysRevLett.97.076405" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/werner2006.bib" icon="format_quote" >}}
</div>

E. Gull, A. J. Millis, A. I. Lichtenstein, A. N. Rubtsov, M. Troyer, and P. Werner, *Continuous-time Monte Carlo methods for quantum impurity models*, Rev. Mod. Phys. **83**, 349 (2011).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.1103/RevModPhys.83.349" icon="article" >}}
{{< cta-button text="arXiv" link="https://arxiv.org/abs/1012.4474" icon="science" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1103/RevModPhys.83.349" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/gull2011rmp.bib" icon="format_quote" >}}
</div>

---

### DMRG — `dmrg`

*源代码：[`applications/dmrg/`](https://github.com/ALPSim/ALPS/tree/master/applications/dmrg)*

**实现论文**

A. E. Feiguin, *The Density Matrix Renormalization Group*. In: A. Avella and F. Mancini (eds.), *Strongly Correlated Systems*, Springer Series in Solid-State Sciences **176**, 31–65 (2013).

<div class="btn-grid-4">
{{< cta-button text="Chapter" link="https://doi.org/10.1007/978-3-642-35106-8_2" icon="article" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1007/978-3-642-35106-8_2" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/feiguin2013.bib" icon="format_quote" >}}
</div>

**算法论文**

S. R. White, *Density matrix formulation for quantum renormalization groups*, Phys. Rev. Lett. **69**, 2863 (1992).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.1103/PhysRevLett.69.2863" icon="article" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1103/PhysRevLett.69.2863" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/white1992.bib" icon="format_quote" >}}
</div>

S. R. White, *Density-matrix algorithms for quantum renormalization groups*, Phys. Rev. B **48**, 10345 (1993).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.1103/PhysRevB.48.10345" icon="article" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1103/PhysRevB.48.10345" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/white1993.bib" icon="format_quote" >}}
</div>

U. Schollwöck, *The density-matrix renormalization group*, Rev. Mod. Phys. **77**, 259 (2005).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.1103/RevModPhys.77.259" icon="article" >}}
{{< cta-button text="arXiv" link="https://arxiv.org/abs/cond-mat/0409292" icon="science" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1103/RevModPhys.77.259" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/schollwock2005.bib" icon="format_quote" >}}
</div>

K. Hallberg, *New Trends in Density Matrix Renormalization*, Adv. Phys. **55**, 477 (2006).

<div class="btn-grid-4">
{{< cta-button text="Journal" link="https://doi.org/10.1080/00018730600766432" icon="article" >}}
{{< cta-button text="arXiv" link="https://arxiv.org/abs/cond-mat/0609039" icon="science" >}}
{{< cta-button text="Scholar" link="https://scholar.google.com/scholar?q=doi:10.1080/00018730600766432" icon="manage_search" >}}
{{< cta-button text="BibTeX" link="/data/hallberg2006.bib" icon="format_quote" >}}
</div>
