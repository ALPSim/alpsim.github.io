
---
title: Bosons in an Optical Lattice
math: true
---

## Bandstructure of an homogeneous optical lattice

### Theory

At this first moment, we shall look at the simplest case, i.e. a single particle of mass $m$ which experiences a periodic potential $V(\vec{r})$, where

$$
V(\vec{r}) = \sum\_{x\_\alpha = x,y,z} V_0^{x\_\alpha} \sin^2 (\pi x\_\alpha)
$$

in the units of recoil energy $E_r^\alpha = \frac{\hbar^2}{2m} \left( \frac{2\pi}{\lambda\_\alpha} \right)^2$ and lattice spacing $\frac{\lambda\_\alpha}{2}$.

The quantum mechanical behaviour of the single particle follows

$$
\[\frac{1}{\pi^2} \left( -i \nabla + 2\pi \vec{k} \right)^2 + \sum_{x_\alpha = x,y,z} V_0^{x_\alpha} \sin^2 (\pi x_\alpha)\]  u_k (\vec{r}) = \epsilon_k u_k(\vec{r})
$$

which is clearly separable to say the $x$-component:

$$
\[\frac{1}{\pi^2} \left( -i \partial_x + 2\pi k_x \right)^2 + V_0^{x} \sin^2 (\pi x)\]  u\_{k_x} (x) = \epsilon\_{k_x} u\_{k_x}(x),
$$

where $k_x = 0, \frac{1}{L_x} ,\cdots \frac{L_x-1}{L_x}$.

In the plane wave basis,

$$
u\_{k_x} (x) = \frac{1}{\sqrt{L_x}} \sum\_{m \in \mathbf{Z}}  c_m^{(k_x)} e^{i2m\pi x} 
$$

We arrive at a tridiagonal diagonalization problem:

$$
\[  4(m + k_x)^2 + \frac{V_0^x}{2} \] c_m^{(k_x)} - \frac{V_0^x}{4} c\_{m-1}^{(k_x)} - \frac{V_0^x}{4} c\_{m+1}^{(k_x)}  = \epsilon\_{k_x}  c_m^{(k_x)}.
$$

The wannier function is defined as:

$$
w(x) = \frac{1}{\sqrt{L_x}} \sum\_{k_x} u\_{k_x} (x) e^{i 2\pi k_x x} = \frac{1}{L_x} \sum\_{k_x} \sum\_{m \in \mathbf{Z}} c_m^{(k_x)} e^{i 2\pi (m+k_x) x}, 
$$

and from there, one can calculate the onsite interaction:

$$
U = g \int | w(x) |^4 dx = \frac{4 \pi a_s \hbar^2}{m}  \int | w(x) |^4 dx.
$$

After a little bit of algebra, we arrive at the hopping strength:

$$
t = -\frac{1}{L_x} \sum\_{k_x} \epsilon\_{k_x} e^{-i2\pi k_x}.
$$

Finally, the Fourier transform of the wannier function is:

$$
\tilde{w}(q_x) = \frac{1}{\sqrt{L_x}} \int w(x) e^{-i2\pi q_x x} dx  = \frac{1}{\sqrt{L_x}} \sum\_{k_x} \sum\_{m \in \mathbf{Z}} c_m^{(k_x)} \delta\_{q_x, k_x+m}.
$$

### Implementation in Python

#### An example

For instance:

    import numpy;
    import pyalps.dwa;

    V0   = numpy.array([8. , 8. , 8.]);      # in recoil energies
    wlen = numpy.array([843., 843., 843.]);  # in nanometer
    a    = 114.8;                            # s-wave scattering length in bohr radius
    m    = 86.99;                            # mass in atomic mass unit
    L    = 200;                              # lattice size (along 1 direction)

    band = pyalps.dwa.bandstructure(V0, wlen, a, m, L);

A first glance of the band structure:

    >>> band

    Optical lattice: 
    ================
    V0    [Er] = 8    8    8    
    lamda [nm] = 843    843    843    
    Er2nK      = 154.89    154.89    154.89    
    L          = 200 
    g          = 5.68473

    Band structure:
    ===============
    t [nK] : 4.77051    4.77051    4.77051    
    U [nK] : 38.7018
    U/t    : 8.11272    8.11272    8.11272    
    
    wk2[0 ,0 ,0 ] : 5.81884e-08
    wk2[pi,pi,pi] : 1.39558e-08

Well, the values of $t(nK)$, $U(nK)$, and $U/t$ can be obtained via:

    >>> numpy.array(band.t())
    array([ 4.77050984,  4.77050984,  4.77050984])
    >>>
    >>> numpy.array(band.U())
    array(38.7018197381118)
    >>>
    >>> numpy.array(band.Ut())
    array([ 8.11272192,  8.11272192,  8.11272192])

In momentum ($\vec{q}$) space, the (squared) wannier function  $|\tilde{w}(\vec{q})|^2$  can be obtained in the $x$-direction from:

    >>> numpy.array(band.q(0))
    array([-5.   , -4.995, -4.99 , ...,  5.985,  5.99 ,  5.995])
    >>> 
    >>> numpy.array(band.wk2(0))
    array([  7.57249518e-15,   7.88189086e-15,   8.20434507e-15, ...,
         1.62988573e-18,   1.56057426e-18,   1.49429285e-18])
         
and the $y$- or $z$- direction by replacing the index 0 to 1 and 2 respectively.


## Bosons in an optical lattice trap

### Boson Hubbard model

#### Hamiltonian

Bosons in an optical lattice trap can be effectively described by the single band boson Hubbard model

$$
\hat{H} = -t \sum\_{\langle i,j \rangle} \hat{b}\_i^+ \hat{b}\_j + \frac{U}{2} \sum_i \hat{n}\_i (\hat{n}\_i - 1) - \sum_i ( \mu - V_T ( \vec{r}\_i) ) \hat{n}\_i
$$

with hopping strength $t$, onsite interaction strength $U$, and chemical potential $\mu$ at finite temperature $T$ via Quantum Monte Carlo implemented in the directed worm algorithm. Here, $\hat{b}$ ($\hat{b}^+$) is the annihilation (creation) operator, and $\hat{n}\_i$ being the number operator at site $i$. Bosons in an optical lattice are confined, say in a 3D parabolic trapping potential, i.e.

$$
V_T (\vec{r}\_i) = K_x x_i^2 + K_y y_i^2 + K_z z_i^2,
$$

due to the gaussian beam waists as well as other sources of trapping.

#### Finite temperature

At finite temperature $T$, the physics is essentially captured by the partition function

$$
Z = \mathrm{Tr} \, \exp \left(-\beta \hat{H} \right)
$$

and physical quantities such as the local density

$$
\langle n_i \rangle = \frac{1}{Z} \mathrm{Tr} \hat{n}\_i \exp \left(-\beta \hat{H} \right)  = \frac{1}{Z} \sum\_{\mathcal{C}} n_i (\mathcal{C}) Z(\mathcal{C})
$$

for some configuration $\mathcal{C}$ in the complete configuration space, with inverse temperature $\beta = 1/T$ . Here, the units will be cleverly normalized later on.

## Contributors

- Ping Nang Ma
- Matthias Troyer

