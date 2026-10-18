
---
title: DMRG-02 Heisenberg Spin Chains
weight: 2
math: true
toc: true
---

## Models: Heisenberg spin chains

For applications of DMRG, we consider two models, namely the spin-1/2 and the spin-1 antiferromagnetic Heisenberg chains of length L given by the following Hamiltonian:

$$
H = J\sum_{i=1}^{L-1} \left[\frac{1}{2} (S^+_i S^-_{i+1} + S^-_i S^+_{i+1}) + S^z_i S^z_{i+1}\right] .
$$

The reason why we are choosing these two models, which you may already know from other tutorials, is that despite their superficial similarity they exhibit completely different physical behavior and pose very different challenges to the DMRG algorithm. Before running any DMRG calculations, let us briefly review their physical properties, so that we have exact and numerical benchmark values in hand for the ground state energy, gap, and correlation calculations of the following tutorials.

### Spin-1/2 chain

The ground state of the spin-1/2 chain can be constructed exactly by the Bethe ansatz; we therefore know its ground state energy exactly. The intensive ground-state energy is properly defined as energy per bond, $e_0/J \equiv E_0(L)/[(L-1)J]$ (as used throughout [DMRG-03](../dmrg03)); but in the thermodynamic limit $L\rightarrow\infty$, the number of bonds $L-1$ and the number of sites $L$ become indistinguishable, so this is conventionally — if loosely — called the energy *per site*:

$$
e_0/J = 1/4 - \ln 2 = -0.4431471805599... 
$$

Ground state energies as such are of limited interest if not compared to other energies. However, this one can serve as a beautiful benchmark of the DMRG method, as we will verify numerically in [DMRG-03](../dmrg03). Of more interest is whether the ground state is separated from the excited states by an energy difference that survives also in the thermodynamic limit, i.e. whether the *gap* is vanishing or not. For the spin-1/2 chain, the gap is 0.

At the same time, one may ask what the correlation between spins on different sites looks like. One knows for the infinitely long spin-1/2 chain that asymptotically (i.e. for $|i-j| \rightarrow \infty$):

$$
 \langle S^z_i S^z_j \rangle \sim (-1)^{|i-j|} \frac{\sqrt{\ln|i-j|}}{|i-j|}  .
$$

The spin-1/2 chain is *critical*, i.e. the antiferromagnetic correlations between spins decay with their distance following a *power law*, $\langle S^z_i S^z_j \rangle \sim (-1)^{|i-j|}\cdot|i-j|^{-\eta}$, with critical exponent $\eta=1$. The nasty looking logarithm arises from a marginally irrelevant operator and does not modify scaling asymptotically, though it does introduce a slowly varying multiplicative factor, as discussed in [ED-04](../../ed/ed04).  A critical exponent is, by definition, the logarithmic derivative of the correlator $C(r)$ with respect to distance in the asymptotic limit:

$$
\eta \equiv -\lim_{r\rightarrow\infty} \frac{d\ln |C(r)|}{d\ln r} ,\qquad C(r) \equiv \left| \langle S^z_i S^z_j \rangle \right|_{|i-j|=r} \sim \frac{\sqrt{\ln r}}{r}
$$

So the critical exponent is:

$$
\eta = \lim_{r\rightarrow\infty}\left(1 - \frac{1}{2\ln r}\right) = 1.
$$

This is exactly the correction referred to above, and it can be beautifully verified by DMRG calculations on very long chains. But because $\ln r$ itself grows so slowly, $1/(2\ln r)$ vanishes only very slowly with $r$ — so on any finite chain accessible to DMRG, $\eta_{\rm eff}(r)$ will sit visibly below 1 and creep toward it only gradually. For a first pass we ignore this correction and simply use $\eta=1$ as the target, but keep in mind that your numerically extracted exponent will typically undershoot it.

### Spin-1 chain

For decades, people thought that the spin-1 chain would behave similarly, of course with some quantitative differences due to the different spin lengths. It came as a big surprise in 1982 when Duncan Haldane pointed out that there should be a fundamental difference between isotropic antiferromagnetic Heisenberg chains depending on the length of the spin, namely between half-integer spins ($S=1/2,3/2,...$) and integer spins ($S=1$), with the difference being most pronounced for small spin lengths. Hence, the spin-1 chain became the focus of strong interest, and in fact DMRG had some of its most important early applications for this system.

Unlike the spin-1/2 chain, the spin-1 chain has no properties that can be calculated exactly by analytical means. We have to rely completely on numerics when it comes to quantitative statements.

The same intensive quantity $e_0/J$ (per bond, conventionally called per site in this thermodynamic-limit sense) is given by:

$$
 e_0/J = -1.401484039 ... .
 $$

Again, the question of the existence of a gap is more important, and here one of the big differences to the spin-1/2 chain becomes visible: in the thermodynamic limit, the gap in the spin-1 chain is finite and given by:

$$
 \Delta/J = 0.41052 
 $$

to five-digit accuracy.

The question for the behavior of the spin-spin correlations leads to yet another big difference to the spin-1/2 case. The correlations read asymptotically (i.e. for $|i-j| \rightarrow \infty$):

$$
 \langle S^z_i S^z_j \rangle \sim (-1)^{|i-j|} \frac{\exp (-|i-j|/\xi)}{\sqrt{|i-j|}}  .
$$

The dominant contribution is now the exponential decay which happens on a length scale $\xi$, the *correlation length* which in this particular case is found numerically to be $\xi=6.02$. There is an analytic (power law) correction by a square root of the distance in the denominator, but this is often neglected in calculations of the correlation length, as it is a slow contribution compared to the fast exponential decay. It would matter, of course, if the correlation length were much larger.

The spin-1 chain is therefore a prime example for a *non-critical* quantum system with finite gap and exponentially decaying correlations. As it turns out, this is the ideal type of system for DMRG to simulate.

### Plan of the remaining tutorials

With these benchmark values established, [DMRG-03](../dmrg03) sets up the first `dmrg` runs to compute the ground state energies of both chains numerically, [DMRG-04](../dmrg04) shows how to extract the gap $\Delta$ from DMRG calculations at finite $L$ and how to extrapolate it to the thermodynamic limit, [DMRG-05](../dmrg05) uses local observables such as the magnetization profile to distinguish boundary from bulk excitations, and [DMRG-06](../dmrg06) computes the spin-spin correlation functions directly, extracting the power-law exponent for the spin-1/2 chain and the correlation length $\xi$ for the spin-1 chain.
