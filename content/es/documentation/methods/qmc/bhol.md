
---
title: Bosones en una Red Óptica
math: true
---

## Estructura de bandas de una red óptica homogénea

### Teoría

En este primer momento, examinaremos el caso más simple, es decir, una única partícula de masa $m$ que experimenta un potencial periódico $V(\vec{r})$, donde

$$
V(\vec{r}) = \sum_{x_\alpha = x,y,z} V_0^{x_\alpha} \sin^2 (\pi x_\alpha)
$$

en las unidades de la energía de retroceso $E_r^\alpha = \frac{\hbar^2}{2m} \left( \frac{2\pi}{\lambda_\alpha} \right)^2$ y el espaciado de red $\frac{\lambda_\alpha}{2}$.

El comportamiento mecánico-cuántico de la partícula única sigue

$$
\left[\frac{1}{\pi^2} \left( -i \nabla + 2\pi \vec{k} \right)^2 + \sum_{x_\alpha = x,y,z} V_0^{x_\alpha} \sin^2 (\pi x_\alpha)\right]  u_k (\vec{r}) = \epsilon_k u_k(\vec{r})
$$

que claramente es separable, digamos, en la componente $x$:

$$
\left[\frac{1}{\pi^2} \left( -i \partial_x + 2\pi k_x \right)^2 + V_0^{x} \sin^2 (\pi x)\right]  u_{k_x} (x) = \epsilon_{k_x} u_{k_x}(x),
$$

donde $k_x = 0, \frac{1}{L_x} ,\cdots \frac{L_x-1}{L_x}$.

En la base de ondas planas,

$$
u_{k_x} (x) = \frac{1}{\sqrt{L_x}} \sum_{m \in \mathbf{Z}}  c_m^{(k_x)} e^{i2m\pi x} 
$$

Llegamos a un problema de diagonalización tridiagonal:

$$
\left[  4(m + k_x)^2 + \frac{V_0^x}{2} \right] c_m^{(k_x)} - \frac{V_0^x}{4} c_{m-1}^{(k_x)} - \frac{V_0^x}{4} c_{m+1}^{(k_x)}  = \epsilon_{k_x}  c_m^{(k_x)}.
$$

La función de Wannier se define como:

$$
w(x) = \frac{1}{\sqrt{L_x}} \sum_{k_x} u_{k_x} (x) e^{i 2\pi k_x x} = \frac{1}{L_x} \sum_{k_x} \sum_{m \in \mathbf{Z}} c_m^{(k_x)} e^{i 2\pi (m+k_x) x}, 
$$

y a partir de ahí, se puede calcular la interacción en el mismo sitio:

$$
U = g \int | w(x) |^4 dx = \frac{4 \pi a_s \hbar^2}{m}  \int | w(x) |^4 dx.
$$

Tras un poco de álgebra, llegamos a la intensidad del hopping:

$$
t = -\frac{1}{L_x} \sum_{k_x} \epsilon_{k_x} e^{-i2\pi k_x}.
$$

Finalmente, la transformada de Fourier de la función de Wannier es:

$$
\tilde{w}(q_x) = \frac{1}{\sqrt{L_x}} \int w(x) e^{-i2\pi q_x x} dx  = \frac{1}{\sqrt{L_x}} \sum_{k_x} \sum_{m \in \mathbf{Z}} c_m^{(k_x)} \delta_{q_x, k_x+m}.
$$

### Implementación en Python

#### Un ejemplo

Por ejemplo:

    import numpy;
    import pyalps.dwa;

    V0   = numpy.array([8. , 8. , 8.]);      # in recoil energies
    wlen = numpy.array([843., 843., 843.]);  # in nanometer
    a    = 114.8;                            # s-wave scattering length in bohr radius
    m    = 86.99;                            # mass in atomic mass unit
    L    = 200;                              # lattice size (along 1 direction)

    band = pyalps.dwa.bandstructure(V0, wlen, a, m, L);

Un primer vistazo a la estructura de bandas:

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

Bien, los valores de $t(nK)$, $U(nK)$, y $U/t$ pueden obtenerse mediante:

    >>> numpy.array(band.t())
    array([ 4.77050984,  4.77050984,  4.77050984])
    >>>
    >>> numpy.array(band.U())
    array(38.7018197381118)
    >>>
    >>> numpy.array(band.Ut())
    array([ 8.11272192,  8.11272192,  8.11272192])

En el espacio de momentos ($\vec{q}$), la función de Wannier (al cuadrado) $|\tilde{w}(\vec{q})|^2$ puede obtenerse en la dirección $x$ mediante:

    >>> numpy.array(band.q(0))
    array([-5.   , -4.995, -4.99 , ...,  5.985,  5.99 ,  5.995])
    >>> 
    >>> numpy.array(band.wk2(0))
    array([  7.57249518e-15,   7.88189086e-15,   8.20434507e-15, ...,
         1.62988573e-18,   1.56057426e-18,   1.49429285e-18])
         
y en la dirección $y$ o $z$ reemplazando el índice 0 por 1 y 2 respectivamente.


## Bosones en una trampa de red óptica

### Modelo de Hubbard bosónico

#### Hamiltoniano

Los bosones en una trampa de red óptica pueden describirse eficazmente mediante el modelo de Hubbard bosónico de una sola banda

$$
\hat{H} = -t \sum_{\langle i,j \rangle} \hat{b}_i^+ \hat{b}_j + \frac{U}{2} \sum_i \hat{n}_i (\hat{n}_i - 1) - \sum_i ( \mu - V_T ( \vec{r}_i) ) \hat{n}_i
$$

con intensidad de hopping $t$, intensidad de interacción en el mismo sitio $U$, y potencial químico $\mu$ a temperatura finita $T$ mediante Monte Carlo cuántico implementado en el algoritmo worm dirigido. Aquí, $\hat{b}$ ($\hat{b}^+$) es el operador de aniquilación (creación), y $\hat{n}_i$ es el operador número en el sitio $i$. Los bosones en una red óptica están confinados, digamos en un potencial de confinamiento parabólico 3D, es decir

$$
V_T (\vec{r}_i) = K_x x_i^2 + K_y y_i^2 + K_z z_i^2,
$$

debido a las cinturas gaussianas del haz así como a otras fuentes de confinamiento.

#### Temperatura finita

A temperatura finita $T$, la física queda esencialmente capturada por la función de partición

$$
Z = \mathrm{Tr} \, \exp \left(-\beta \hat{H} \right)
$$

y cantidades físicas como la densidad local

$$
\langle n_i \rangle = \frac{1}{Z} \mathrm{Tr} \hat{n}_i \exp \left(-\beta \hat{H} \right)  = \frac{1}{Z} \sum_{\mathcal{C}} n_i (\mathcal{C}) Z(\mathcal{C})
$$

para alguna configuración $\mathcal{C}$ en el espacio de configuraciones completo, con temperatura inversa $\beta = 1/T$. Aquí, las unidades se normalizarán inteligentemente más adelante.

## Colaboradores

- Ping Nang Ma
- Matthias Troyer

