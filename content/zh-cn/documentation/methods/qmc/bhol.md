
---
title: Bosons in an Optical Lattice
math: true
---

## Bandstructure of an homogeneous optical lattice

### Theory

At this first moment, we shall look at the simplest case, i.e. a single particle of mass $m$ which experiences a periodic potential $V(\vec{r})$, where

$$
V(\vec{r}) = \sum_{x_\alpha = x,y,z} V_0^{x_\alpha} \sin^2 (\pi x_\alpha)
$$

in the units of recoil energy $E_r^\alpha = \frac{\hbar^2}{2m} \left( \frac{2\pi}{\lambda_\alpha} \right)^2$ and lattice spacing $\frac{\lambda_\alpha}{2}$.

The quantum mechanical behaviour of the single particle follows

$$
\left[\frac{1}{\pi^2} \left( -i \nabla + 2\pi \vec{k} \right)^2 + \sum_{x_\alpha = x,y,z} V_0^{x_\alpha} \sin^2 (\pi x_\alpha)\right]  u_k (\vec{r}) = \epsilon_k u_k(\vec{r})
$$

which is clearly separable to say the $x$-component:

$$
\left[\frac{1}{\pi^2} \left( -i \partial_x + 2\pi k_x \right)^2 + V_0^{x} \sin^2 (\pi x)\right]  u_{k_x} (x) = \epsilon_{k_x} u_{k_x}(x),
$$

where $k_x = 0, \frac{1}{L_x} ,\cdots \frac{L_x-1}{L_x}$.

In the plane wave basis,

$$
u_{k_x} (x) = \frac{1}{\sqrt{L_x}} \sum_{m \in \mathbf{Z}}  c_m^{(k_x)} e^{i2m\pi x} 
$$

We arrive at a tridiagonal diagonalization problem:

$$
\left[  4(m + k_x)^2 + \frac{V_0^x}{2} \right] c_m^{(k_x)} - \frac{V_0^x}{4} c_{m-1}^{(k_x)} - \frac{V_0^x}{4} c_{m+1}^{(k_x)}  = \epsilon_{k_x}  c_m^{(k_x)}.
$$

The wannier function is defined as:

$$
w(x) = \frac{1}{\sqrt{L_x}} \sum_{k_x} u_{k_x} (x) e^{i 2\pi k_x x} = \frac{1}{L_x} \sum_{k_x} \sum_{m \in \mathbf{Z}} c_m^{(k_x)} e^{i 2\pi (m+k_x) x}, 
$$

and from there, one can calculate the onsite interaction:

$$
U = g \int | w(x) |^4 dx = \frac{4 \pi a_s \hbar^2}{m}  \int | w(x) |^4 dx.
$$

After a little bit of algebra, we arrive at the hopping strength:

$$
t = -\frac{1}{L_x} \sum_{k_x} \epsilon_{k_x} e^{-i2\pi k_x}.
$$

Finally, the Fourier transform of the wannier function is:

$$
\tilde{w}(q_x) = \frac{1}{\sqrt{L_x}} \int w(x) e^{-i2\pi q_x x} dx  = \frac{1}{\sqrt{L_x}} \sum_{k_x} \sum_{m \in \mathbf{Z}} c_m^{(k_x)} \delta_{q_x, k_x+m}.
$$

### Implementation in Python

The script [`tutorials/optical-lattice-01-bandstructure/bandstructure.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/optical-lattice-01-bandstructure/bandstructure.py) evaluates these formulas: for each direction it diagonalizes the tridiagonal problem above for all $k_x$, obtains $t$ from the band energies $\epsilon_{k_x}$, and integrates $|w(x)|^4$ to obtain $U$. Run the following from that directory:

```python
import numpy as np
import bandstructure

V0   = np.array([8., 8., 8.])        # lattice depth in recoil energies
wlen = np.array([843., 843., 843.])  # laser wavelength in nanometer
a    = 114.8                         # s-wave scattering length in bohr radius
m    = 86.99                         # mass in atomic mass unit
L    = 200                           # lattice size (along 1 direction)

t, U = bandstructure.hubbard_parameters(V0, wlen, a, m, L)

print(t)        # t in nK:  [4.77051684 4.77051684 4.77051684]
print(U)        # U in nK:  38.70187649673881
print(U / t)    # U/t:      [8.11272191 8.11272191 8.11272191]
```


## Bosons in an optical lattice trap

### Boson Hubbard model

#### Hamiltonian

Bosons in an optical lattice trap can be effectively described by the single band boson Hubbard model

$$
\hat{H} = -t \sum_{\langle i,j \rangle} \hat{b}_i^+ \hat{b}_j + \frac{U}{2} \sum_i \hat{n}_i (\hat{n}_i - 1) - \sum_i ( \mu - V_T ( \vec{r}_i) ) \hat{n}_i
$$

with hopping strength $t$, onsite interaction strength $U$, and chemical potential $\mu$ at finite temperature $T$ via Quantum Monte Carlo implemented in the directed worm algorithm. Here, $\hat{b}$ ($\hat{b}^+$) is the annihilation (creation) operator, and $\hat{n}_i$ being the number operator at site $i$. Bosons in an optical lattice are confined, say in a 3D parabolic trapping potential, i.e.

$$
V_T (\vec{r}_i) = K_x x_i^2 + K_y y_i^2 + K_z z_i^2,
$$

due to the gaussian beam waists as well as other sources of trapping.

#### Finite temperature

At finite temperature $T$, the physics is essentially captured by the partition function

$$
Z = \mathrm{Tr} \, \exp \left(-\beta \hat{H} \right)
$$

and physical quantities such as the local density

$$
\langle n_i \rangle = \frac{1}{Z} \mathrm{Tr} \hat{n}_i \exp \left(-\beta \hat{H} \right)  = \frac{1}{Z} \sum_{\mathcal{C}} n_i (\mathcal{C}) Z(\mathcal{C})
$$

for some configuration $\mathcal{C}$ in the complete configuration space, with inverse temperature $\beta = 1/T$ . Here, the units will be cleverly normalized later on.

## Contributors

- Ping Nang Ma
- Matthias Troyer

