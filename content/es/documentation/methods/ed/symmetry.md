
---
title: Simetría
math: true
weight: 2
---
El tamaño del espacio de Hilbert de un hamiltoniano crece exponencialmente con el número de sitios de la red, lo cual limita el tamaño del modelo cuántico que puede estudiarse. Sin embargo, es posible reducir la matriz hamiltoniana completa en varias matrices más pequeñas mediante la diagonalización en bloques usando las simetrías de la red y del hamiltoniano.

A continuación usaremos una cadena de espín-$\frac{1}{2}$ de 4 sitios con contorno periódico para ilustrar cómo emplear estas simetrías para diagonalizar en bloques la matriz hamiltoniana completa.

## Espacio de Hilbert

El espacio de Hilbert para una cadena de espín-$\frac{1}{2}$ de 4 sitios tiene dimensión $2^4 = 16$. Una base para este espacio puede escribirse como:

$$
\{ |s_1, s_2, s_3, s_4\rangle \}, \quad s_i \in \{\uparrow, \downarrow\}
$$

## Simetrías del Hamiltoniano

El hamiltoniano tiene varias simetrías que pueden usarse para diagonalizarlo en bloques, reduciendo el esfuerzo computacional:

- **Conservación de la magnetización total $S^z_{\text{total}}$**:
   El operador $S^z$ total, $S^z_{\text{total}} = \sum_{i=1}^4 S_i^z$, conmuta con $\mathcal{H}$. Por lo tanto, el hamiltoniano es diagonal por bloques en sectores de $S^z_{\text{total}}$ fijo.

- **Simetría translacional**:
   El hamiltoniano es invariante bajo traslaciones $T$, donde $T|s_1, s_2, s_3, s_4\rangle = |s_4, s_1, s_2, s_3\rangle$. Esta simetría puede usarse para diagonalizar aún más $\mathcal{H}$ en bloques.

- **Simetría de inversión de espín**:
   El hamiltoniano es invariante bajo la inversión de espín $P$, donde $P|s_1, s_2, s_3, s_4\rangle = |-s_1, -s_2, -s_3, -s_4\rangle$. Esta simetría también puede explotarse.

- **Simetría de reflexión**:
   El hamiltoniano es invariante bajo la reflexión $R$, donde $R|s_1, s_2, s_3, s_4\rangle = |s_4, s_3, s_2, s_1\rangle$.

## Diagonalización en Bloques

Usaremos la magnetización total $S^z_{\text{total}}$ y la simetría translacional para reducir el espacio de Hilbert.

### Paso 1: Sectores de Magnetización Total

Los posibles valores de $S^z_{\text{total}}$ son $-2, -1, 0, 1, 2$. Podemos dividir el espacio de Hilbert en estos sectores:

- $S^z_{\text{total}} = 2$: Solo un estado, $|\uparrow, \uparrow, \uparrow, \uparrow\rangle$.
- $S^z_{\text{total}} = 1$: Cuatro estados, p. ej., $|\downarrow, \uparrow, \uparrow, \uparrow\rangle$, $|\uparrow, \downarrow, \uparrow, \uparrow\rangle$, etc.
- $S^z_{\text{total}} = 0$: Seis estados, p. ej., $|\uparrow, \uparrow, \downarrow, \downarrow\rangle$, $|\uparrow, \downarrow, \uparrow, \downarrow\rangle$, etc.
- $S^z_{\text{total}} = -1$: Cuatro estados, p. ej., $|\downarrow, \downarrow, \downarrow, \uparrow\rangle$, $|\downarrow, \downarrow, \uparrow, \downarrow\rangle$, etc.
- $S^z_{\text{total}} = -2$: Solo un estado, $|\downarrow, \downarrow, \downarrow, \downarrow\rangle$.

### Paso 2: Simetría Translacional

Dentro de cada sector $S^z_{\text{total}}$, podemos diagonalizar aún más en bloques usando la simetría translacional. El operador de traslación $T$ tiene autovalores $e^{ik}$, donde $k = 0, \pi/2, \pi, 3\pi/2$ (ya que $T^4 = 1$).

Por ejemplo, en el sector $S^z_{\text{total}} = 0$, los estados pueden organizarse en estados propios de momento. Uno de los estados con momento total $k$ viene dado por

$$
|\phi\rangle = \frac{1}{\sqrt{M}} \sum_{n=0}^3 e^{ikn} T^n |\psi\rangle,
$$

donde $|\psi\rangle$ es un estado representativo en el espacio real y $|\phi\rangle$ es un estado en el espacio de momentos, invariante bajo la aplicación de $T$. El factor de normalización $M=4$ a menos que la periodicidad cíclica del estado sea menor que 4, lo cual se discutirá más adelante.

### Paso 3: Construcción de los Bloques del Hamiltoniano

Para cada $S^z_{\text{total}}$ y momento $k$, construimos la matriz hamiltoniana en la base reducida. Los elementos de matriz son:

$$
\langle \phi^{\prime} | \mathcal{H} | \phi \rangle = J \sum_{i=1}^4 \langle \phi^{\prime} | \mathbf{S}_i \cdot \mathbf{S}_{i+1} | \phi \rangle
$$

### Paso 4: Diagonalización

Finalmente, diagonalizamos cada bloque del hamiltoniano para obtener los autovalores y estados propios.

### Ejemplo: Sector $S^z_{\text{total}} = 0$

El sector $S^z_{\text{total}} = 0$ consiste en estados con exactamente 2 espines arriba ($\uparrow$) y 2 espines abajo ($\downarrow$). Para una cadena de 4 sitios, hay $\binom{4}{2} = 6$ estados de base en este sector:

$$
|\psi_1\rangle = |\uparrow, \uparrow, \downarrow, \downarrow\rangle, \quad |\psi_2\rangle = |\uparrow, \downarrow, \uparrow, \downarrow\rangle, \quad |\psi_3\rangle = |\uparrow, \downarrow, \downarrow, \uparrow\rangle
$$
$$
|\psi_4\rangle = |\downarrow, \uparrow, \uparrow, \downarrow\rangle, \quad |\psi_5\rangle = |\downarrow, \uparrow, \downarrow, \uparrow\rangle, \quad |\psi_6\rangle = |\downarrow, \downarrow, \uparrow, \uparrow\rangle
$$

La matriz hamiltoniana completa para el sector $S^z_{\text{total}}=0$ viene dada por
$$
\mathcal{H} = J\begin{pmatrix}
 0 & 0.5 & 0 & 0 & 0.5 & 0 \\
 0.5 & -1 & 0.5 & 0.5 & 0 & 0.5 \\
 0 & 0.5 & 0 & 0 & 0.5 & 0 \\
 0 & 0.5 & 0 & 0 & 0.5 & 0 \\
 0.5 & 0 & 0.5 & 0.5 & -1 & 0.5 \\
 0 & 0.5 & 0 & 0 & 0.5 & 0 \\
\end{pmatrix}.
$$
La diagonalización exacta de la matriz anterior da $E_1=-2J$, $E_2=-J$, $E_3=0$, $E_4=0$, $E_5=0$, y $E_6=J$.

#### Sectores de Momento
El momento $k$ viene dado por $k = 0, \pi/2, \pi, 3\pi/2$, como se discutió anteriormente. El operador de traslación $T$ actúa sobre un estado $|\psi_i\rangle$ como:

$$
T^n |\psi_i\rangle = e^{ikn} |\psi_j\rangle.
$$

Para $n=1$, la configuración de espín de cada sitio se desplaza a la derecha 1 espaciado de red. Cuando $n=4$, el estado $|\psi_j\rangle=|\psi_i\rangle$. Es posible que la periodicidad cíclica de un estado sea menor que $4$. Por ejemplo, $|\psi_2\rangle$ y $|\psi_5\rangle$ tienen ambos periodicidad 2. El factor de normalización $M=2$ en la ecuación de transformación anterior.

A continuación, construimos estados translacionalmente simétricos para cada sector de momento.

#### Sector $S^z_{\text{total}} = 0$ y $k = 0$
El sector de momento $k = 0$ consiste en estados translacionalmente simétricos. Para $S^z_{\text{total}} = 0$, hay 2 estados de base:

$$
|\phi_1\rangle = \frac{1}{2} \left( |\psi_1\rangle + |\psi_4\rangle + |\psi_6\rangle + |\psi_3\rangle \right).
$$

$$
|\phi_2\rangle = \frac{1}{\sqrt{2}}(|\psi_2\rangle + |\psi_5\rangle).
$$
En la construcción anterior de los estados de base en el espacio de momentos, se han usado dos **estados representativos** $|\psi_1\rangle$ y $|\psi_2\rangle$ junto con el operador translacional $T$ para generar los estados de base. No pueden generarse otros estados independientes. Por lo tanto, la dimensión del sector $S^z_{\text{total}} = 0$ y $k = 0$ es 2.

La matriz hamiltoniana en este sector viene dada por:
$$
\mathcal{H} = J\begin{pmatrix}
0 & \sqrt{2} \\
\sqrt{2} & -1 \\
\end{pmatrix}.
$$
La diagonalización exacta de la matriz da $E_1=-2J$ y $E_2=J$.

#### Sector $S^z_{\text{total}} = 0$ y $k = 1$
El sector de momento $k = 1$ corresponde a $k = \frac{\pi}{2}$. Para $S^z_{\text{total}} = 0$, hay solo 1 estado de base:

$$
|\phi_1\rangle = \frac{1}{2} \left( |\psi_1\rangle + i|\psi_4\rangle - |\psi_6\rangle - i|\psi_3\rangle \right).
$$

La matriz hamiltoniana en este sector es:

$$
\mathcal{H} = \begin{pmatrix}
0
\end{pmatrix}.
$$
Por lo tanto, el autovalor del sector $S^z_{\text{total}} = 0$ y $k = 1$ es $E_3=0$.

#### Sector $S^z_{\text{total}} = 0$ y $k = 2$
El sector de momento $k = 2$ corresponde a $k = \pi$. Para $S_z = 0$, hay 2 estados de base:

$$
|\phi_1\rangle = \frac{1}{2} \left( |\psi_1\rangle - |\psi_4\rangle + |\psi_6\rangle -|\psi_3\rangle \right),
$$
$$
|\phi_2\rangle = \frac{1}{\sqrt{2}} \left( |\psi_2\rangle - |\psi_5\rangle \right),
$$

La matriz hamiltoniana en este sector es:

$$
\mathcal{H} = J \begin{pmatrix}
0 & 0 \\
0 & -1 \\
\end{pmatrix},
$$
cuya diagonalización exacta da $E_4=-J$ y $E_5=0$.

#### Sector $S^z_{\text{total}} = 0$ y $k = 3$
El sector de momento $k = 3$ corresponde a $k = \frac{3\pi}{2}$. Para $S_z = 0$, hay solo 1 estado de base:

$$
|\phi_1\rangle = \frac{1}{2} \left( |\psi_1\rangle - i|\psi_4\rangle - |\psi_6\rangle + i|\psi_3\rangle \right).
$$

La matriz hamiltoniana en este sector es:

$$
\mathcal{H} = \begin{pmatrix}
0
\end{pmatrix}.
$$
El último autovalor es entonces $E_6=0$.

#### Resumen
- **$k = 0$**: dos estados, energías $-2J$ y $J$.
- **$k = 1$**: un estado, energía $0$.
- **$k = 2$**: dos estados, energías $-J$ y $0$.
- **$k = 3$**: un estado, energía $0$.

Estos niveles de energía concuerdan con los obtenidos mediante la diagonalización exacta directa de la matriz hamiltoniana $6\times 6$ para el sector $S^z_{\text{total}}=0$ sin la simetría translacional.

Tras diagonalizar todos los bloques, obtenemos los autovalores y estados propios exactos de la cadena de Heisenberg de 4 sitios con condiciones de contorno periódicas. El uso de simetrías reduce el tamaño de las matrices aproximadamente por un factor de $1/N$, donde $N$ es el número de sitios de la red.

Este enfoque puede generalizarse a sistemas más grandes, aunque hay que pensar en una forma eficiente, en el código de diagonalización exacta, de indexar y acceder a todos los estados del espacio de Hilbert. El costo computacional sigue creciendo exponencialmente con el tamaño del sistema.
