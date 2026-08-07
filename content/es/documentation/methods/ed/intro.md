
---
title: Introducción
math: true
weight: 1
---
La diagonalización exacta (ED) es una técnica numérica usada para resolver problemas cuánticos de muchos cuerpos diagonalizando directamente la matriz hamiltoniana de un sistema. Este método proporciona estados propios y autovalores exactos, lo que lo convierte en una herramienta poderosa para estudiar sistemas cuánticos de tamaño pequeño a moderado. Un ejemplo clásico de su aplicación es el modelo de Heisenberg, que describe espines interactuantes en una red y se usa ampliamente para entender los fenómenos magnéticos en la física de la materia condensada.

## El Modelo de Heisenberg como Caso de Estudio

El modelo de Heisenberg se define mediante el hamiltoniano:

$$
\mathcal{H} = J \sum_{\langle i,j \rangle} \mathbf{S}_i \cdot \mathbf{S}_j,
$$

donde $\mathbf{S}_i$ es el operador de espín-1/2 en el sitio $i$, $J$ es la interacción de intercambio (ferromagnética para $J \lt 0$ y antiferromagnética para $J \gt 0$), y la suma se extiende sobre pares de primeros vecinos $\langle i,j \rangle$. Por simplicidad, consideramos una cadena 1D con condiciones de contorno periódicas.

### Ejemplo: Cadena de Heisenberg 1D de 4 Sitios

Estudiemos una cadena de Heisenberg 1D de 4 sitios con condiciones de contorno periódicas. El hamiltoniano para este sistema es:

$$
\mathcal{H} = J \left( \mathbf{S}_1 \cdot \mathbf{S}_2 + \mathbf{S}_2 \cdot \mathbf{S}_3 + \mathbf{S}_3 \cdot \mathbf{S}_4 + \mathbf{S}_4 \cdot \mathbf{S}_1 \right).
$$

Los operadores de espín-1/2 $\mathbf{S}_i = (S_i^x, S_i^y, S_i^z)$ pueden expresarse en términos de las matrices de Pauli $\boldsymbol{\sigma}_i$ como $\mathbf{S}_i = \frac{1}{2} \boldsymbol{\sigma}_i$. El producto escalar $\mathbf{S}_i \cdot \mathbf{S}_j$ puede escribirse como:

$$
\mathbf{S}_i \cdot \mathbf{S}_j = S_i^x S_j^x + S_i^y S_j^y + S_i^z S_j^z.
$$

### Estados de Base

Para un sistema de 4 sitios con partículas de espín-1/2, el espacio de Hilbert tiene $2^4 = 16$ estados de base. Estos estados son estados producto de configuraciones de espín individuales, denotados como $| \sigma_1 \sigma_2 \sigma_3 \sigma_4 \rangle$, donde $\sigma_i = \uparrow$ o $\downarrow$. Por ejemplo, un estado de base es $| \uparrow \uparrow \downarrow \downarrow \rangle$.

Los estados de base son estados propios de los operadores $S_i^z$. Cuando se aplica al sitio $i$-ésimo, da
$$
S_i^z|\uparrow\rangle = \frac{1}{2}|\uparrow\rangle,
$$
y
$$
S_i^z|\downarrow\rangle = -\frac{1}{2}|\downarrow\rangle.
$$
Para ver el resultado de aplicar el hamiltoniano a los estados de base, necesitamos expresar los operadores fuera de la diagonal, es decir, $S_i^x$ y $S_i^y$, en términos de los operadores de subida $S^{\dagger}$ y bajada $S^{-}$:
$$
S_i^x=\frac{1}{2}(S_i^{\dagger}+S_i^{-}),
$$
$$
S_i^y=\frac{1}{2i}(S_i^{\dagger}-S_i^{-}),
$$
que actúan sobre los estados de base de la siguiente manera:
$$
S_i^{\dagger}|s\rangle = \sqrt{S(S+1)-s(s+1)}|s+1\rangle,
$$
$$
S_i^{-}|s\rangle = \sqrt{S(S+1)-s(s-1)}|s-1\rangle,
$$
donde $S=1/2$ y $s=-1/2, 1/2$.
Con la transformación anterior, el elemento del hamiltoniano se convierte en
$$
\mathbf{S}_i \cdot \mathbf{S}_j = \frac{1}{2}(S_i^{\dagger}S_j^{-}+S_i^{-}S_j^{\dagger})+S_i^zS_j^z.
$$

### Matriz Hamiltoniana

Para construir la matriz hamiltoniana, evaluamos la acción de $\mathcal{H}$ sobre cada estado de base. Por ejemplo, considere el término $\mathbf{S}_1 \cdot \mathbf{S}_2$:

$$
\mathbf{S}_1 \cdot \mathbf{S}_2 = \frac{1}{2}(S_1^{\dagger}S_2^{-}+S_1^{-}S_2^{\dagger})+S_1^zS_2^z.
$$

Este término invierte los espines en los sitios 1 y 2 si son antiparalelos, y contribuye con un factor de $\frac{1}{4}$ si son paralelos. Por ejemplo:

$$
\mathbf{S}_1 \cdot \mathbf{S}_2 | \uparrow \downarrow \uparrow \uparrow \rangle = \frac{1}{4} \left( | \downarrow \uparrow \uparrow \uparrow \rangle - | \uparrow \downarrow \uparrow \uparrow \rangle \right).
$$

Repitiendo este proceso para todos los términos de $\mathcal{H}$ y todos los estados de base, construimos la matriz hamiltoniana $16 \times 16$. Por brevedad, no escribimos aquí la matriz completa, pero puede construirse sistemáticamente usando las reglas anteriores.

## Diagonalización

Una vez construida la matriz hamiltoniana, se diagonaliza numéricamente para obtener los estados propios y autovalores. Estos resultados proporcionan información sobre la energía del estado fundamental, las excitaciones de baja energía, y las propiedades magnéticas del sistema. Por ejemplo, para la cadena de Heisenberg antiferromagnética ($J > 0$), la ED revela un estado fundamental singlete sin orden de largo alcance, consistente con la solución del ansatz de Bethe para sistemas más grandes.

### Escalamiento con el Tamaño de la Red

Para el modelo de Heisenberg 1D, el tamaño de la matriz hamiltoniana crece exponencialmente con el número de sitios de la red, lo que hace que la ED sea computacionalmente desafiante para sistemas grandes. Comprender cómo escala el tamaño de la matriz con el tamaño de la red es crucial para evaluar la viabilidad de métodos numéricos como la diagonalización dispersa y completa.

Para un sistema con $N$ sitios, cada sitio puede estar en uno de dos estados: espín arriba ($\uparrow$) o espín abajo ($\downarrow$). La dimensión del espacio de Hilbert, que determina el tamaño de la matriz hamiltoniana, viene dada por:

$$
\text{Dimensión del espacio de Hilbert} = 2^N.
$$

Por ejemplo:
- Para $N = 4$, el espacio de Hilbert tiene $2^4 = 16$ estados.
- Para $N = 10$, el espacio de Hilbert tiene $2^{10} = 1024$ estados.
- Para $N = 20$, el espacio de Hilbert tiene $2^{20} = 1,048,576$ estados.

Este crecimiento exponencial significa que el tamaño de la matriz hamiltoniana se vuelve rápidamente inmanejable a medida que $N$ aumenta. Por ejemplo, un sistema de 20 sitios requiere diagonalizar una matriz de $1,048,576 \times 1,048,576$, lo cual es computacionalmente intensivo.

### Diagonalización Dispersa vs. Completa

La matriz hamiltoniana del modelo de Heisenberg 1D es típicamente dispersa, es decir, la mayoría de sus elementos son cero. Esta dispersión surge porque el hamiltoniano solo conecta estados que difieren en un solo espín invertido (interacciones a primeros vecinos). Por ejemplo, en un sistema de 4 sitios, la matriz hamiltoniana podría verse así (simplificada):

$$
\mathcal{H} = \begin{pmatrix}
E_1 & J/2 & 0 & \cdots \\\
J/2 & E_2 & J/2 & \cdots \\\
0 & J/2 & E_3 & \cdots \\\
\vdots & \vdots & \vdots & \ddots
\end{pmatrix},
$$

donde $E_i$ son los elementos diagonales (energías de los estados de base), y $J/2$ representa los elementos fuera de la diagonal debidos a los términos de inversión de espín.

#### Diagonalización Completa
La diagonalización completa implica calcular todos los autovalores y autovectores de la matriz hamiltoniana. Aunque esto proporciona información completa sobre el sistema, es computacionalmente costoso para matrices grandes debido al escalamiento $O(M^3)$, donde $M$ es el tamaño de la matriz. Por ejemplo, la diagonalización completa de una matriz de $10^6 \times 10^6$ es impracticable en la mayoría de las computadoras.

#### Diagonalización Dispersa
La diagonalización dispersa explota la dispersión de la matriz hamiltoniana para calcular solo un subconjunto de autovalores y autovectores, típicamente los pocos estados propios más bajos (p. ej., el estado fundamental y las excitaciones de baja energía). Algoritmos como el método de Lanczos o la iteración de Arnoldi se usan comúnmente para la diagonalización dispersa. Estos métodos escalan mucho mejor con el tamaño del sistema, requiriendo a menudo solo $O(M)$ de memoria y $O(M^2)$ de tiempo para unos pocos estados propios, lo que los hace adecuados para sistemas más grandes.

#### Comparaciones
El tamaño de la matriz hamiltoniana en el modelo de Heisenberg 1D crece exponencialmente con el número de sitios de la red, lo que plantea un desafío computacional significativo. Aunque la diagonalización completa proporciona información completa sobre el sistema, está limitada a redes pequeñas debido a su alto costo computacional. La diagonalización dispersa, por otro lado, aprovecha la dispersión del hamiltoniano para estudiar sistemas más grandes centrándose en los estados propios más relevantes. Este compromiso entre la diagonalización completa y la dispersa resalta la importancia de elegir el enfoque numérico correcto según el tamaño del sistema y la información física deseada.
