
---
title: Rotación de Jacobi
description: "Método de Rotación de Jacobi"
math: true
weight: 1
---

El **método de rotación de Jacobi** es un algoritmo iterativo clásico usado para diagonalizar matrices simétricas. Es particularmente adecuado para matrices de tamaño pequeño a mediano y es conocido por su simplicidad y robustez. El método funciona eliminando sistemáticamente los elementos fuera de la diagonal mediante una serie de transformaciones ortogonales (rotaciones), convergiendo finalmente a una matriz diagonal cuyos elementos son los autovalores de la matriz original.

El método de Jacobi se dirige al elemento fuera de la diagonal más grande de la matriz y aplica una rotación para anularlo. Este proceso se repite iterativamente hasta que todos los elementos fuera de la diagonal son suficientemente pequeños, dando como resultado una matriz diagonal. Los autovalores de la matriz original se encuentran entonces en la diagonal, y los autovectores se obtienen del producto de todas las matrices de rotación aplicadas durante el proceso.


## Principios

Para una matriz simétrica $A$, el objetivo es encontrar una matriz ortogonal $P$ tal que:

$$
D = P^T A P
$$

donde $D$ es una matriz diagonal que contiene los autovalores de $A$, y las columnas de $P$ son los autovectores correspondientes.

El método de Jacobi logra esto aplicando una secuencia de transformaciones ortogonales (rotaciones) a $A$. Cada rotación se dirige a un elemento específico fuera de la diagonal $A_{ij}$ y lo anula.


## Matriz de Rotación

Una matriz de rotación de Jacobi $R$ es una matriz ortogonal que difiere de la matriz identidad solo en cuatro elementos:

$$
R = \begin{pmatrix}
1 & \cdots & 0 & \cdots & 0 & \cdots & 0 \\\
\vdots & \ddots & \vdots & & \vdots & & \vdots \\\
0 & \cdots & \cos \theta & \cdots & -\sin \theta & \cdots & 0 \\\
\vdots & & \vdots & \ddots & \vdots & & \vdots \\\
0 & \cdots & \sin \theta & \cdots & \cos \theta & \cdots & 0 \\\
\vdots & & \vdots & & \vdots & \ddots & \vdots \\\
0 & \cdots & 0 & \cdots & 0 & \cdots & 1
\end{pmatrix}
$$

Aquí, $\cos \theta$ y $\sin \theta$ se colocan en las intersecciones de las filas y columnas $i$-ésima y $j$-ésima. El ángulo $\theta$ se elige de modo que el elemento fuera de la diagonal $A_{ij}$ se anule.


## Algoritmo

1. **Identificar el Elemento Más Grande Fuera de la Diagonal**:
   - Encontrar el elemento fuera de la diagonal más grande $A_{ij}$ (en valor absoluto) en la matriz $A$.

2. **Calcular el Ángulo de Rotación $\theta$**:
   - El ángulo $\theta$ se elige de modo que satisfaga:
     $$
     \tan(2\theta) = \frac{2A_{ij}}{A_{ii} - A_{jj}}
     $$
   - A partir de esto, calcular $\cos \theta$ y $\sin \theta$.

3. **Construir la Matriz de Rotación $R$**:
   - Construir la matriz de rotación $R$ usando $\cos \theta$ y $\sin \theta$.

4. **Aplicar la Rotación**:
   - Actualizar la matriz $A$ como:
     $$
     A^{\prime} = R^T A R
     $$
   - Esta transformación anula $A_{ij}$ y $A_{ji}$.

5. **Acumular las Transformaciones**:
   - Actualizar la matriz de autovectores $P$ como:
     $$
     P^{\prime} = P R
     $$
   - Esto acumula las rotaciones para formar la matriz de autovectores final.

6. **Repetir Hasta la Convergencia**:
   - Repetir el proceso hasta que todos los elementos fuera de la diagonal sean menores que una tolerancia especificada $ \epsilon$.

---

## Un Ejemplo

Considere una matriz simétrica $A$:

$$
A = \begin{pmatrix}
4 & 1 & 2 \\\
1 & 3 & 1 \\\
2 & 1 & 5
\end{pmatrix}
$$

### Paso 1: Inicializar
Comience con la matriz $A$ y una matriz identidad $P$ para acumular las rotaciones:
$$
A = \begin{pmatrix}
4.000000 & 1.000000 & 2.000000 \\\
1.000000 & 3.000000 & 1.000000 \\\
2.000000 & 1.000000 & 5.000000
\end{pmatrix}, \quad
P = \begin{pmatrix}
1.000000 & 0.000000 & 0.000000 \\\
0.000000 & 1.000000 & 0.000000 \\\
0.000000 & 0.000000 & 0.000000
\end{pmatrix}.
$$

### Paso 2: Encontrar el Elemento Más Grande Fuera de la Diagonal
El elemento más grande fuera de la diagonal en $A$ es $A_{13} = 2.000000$.

### Paso 3: Calcular los Parámetros de Rotación
Para la rotación en el plano $(1, 3)$:
- Calcular el ángulo $\theta$:
  $$
  \theta = \frac{1}{2} \arctan\left(\frac{2A_{13}}{A_{11} - A_{33}}\right).
  $$
  Sustituyendo los valores:
  $$
  \theta = \frac{1}{2} \arctan\left(\frac{2 \cdot 2.000000}{4.000000 - 5.000000}\right) = \frac{1}{2} \arctan(-4.000000).
  $$
  Usando aritmética de precisión simple:
  $$
  \theta \approx -0.674741 \, \text{radianes}.
  $$

- Calcular $c = \cos(\theta)$ y $s = \sin(\theta)$:
  $$
  c \approx 0.780869, \quad s \approx -0.624695.
  $$

### Paso 4: Aplicar la Rotación
Construir la matriz de rotación $J$:
$$
J = \begin{pmatrix}
c & 0 & s \\\
0 & 1 & 0 \\\
-s & 0 & c
\end{pmatrix} \approx \begin{pmatrix}
0.780869 & 0.000000 & -0.624695 \\\
0.000000 & 1.000000 & 0.000000 \\\
0.624695 & 0.000000 & 0.780869
\end{pmatrix}.
$$

Actualizar $A$ y $P$:
$$
A = J^T A J, \quad P = P J.
$$

Después de la rotación:
$$
A \approx \begin{pmatrix}
5.561553 & 0.780869 & 0.000000 \\\
0.780869 & 3.000000 & 0.624695 \\\
0.000000 & 0.624695 & 2.438447
\end{pmatrix},
$$
$$
P \approx \begin{pmatrix}
0.780869 & 0.000000 & -0.624695 \\\
0.000000 & 1.000000 & 0.000000 \\\
0.624695 & 0.000000 & 0.780869
\end{pmatrix}.
$$

### Paso 5: Repetir para Otros Elementos Fuera de la Diagonal
Repetir el proceso para el siguiente elemento más grande fuera de la diagonal hasta que todos los elementos fuera de la diagonal sean suficientemente pequeños (p. ej., por debajo de una tolerancia de $10^{-6}$).

### Paso 6: Matriz Diagonalizada Final
Tras la convergencia, la matriz diagonalizada $A$ será:
$$
A \approx \begin{pmatrix}
6.000000 & 0.000000 & 0.000000 \\\
0.000000 & 3.000000 & 0.000000 \\\
0.000000 & 0.000000 & 3.000000
\end{pmatrix}.
$$

La matriz de autovectores correspondiente $P$ será:
$$
P \approx \begin{pmatrix}
0.707107 & 0.000000 & -0.707107 \\\
0.000000 & 1.000000 & 0.000000 \\\
0.707107 & 0.000000 & 0.707107
\end{pmatrix}.
$$

## Ventajas

- **Simplicidad**: El algoritmo es sencillo de implementar.
- **Robustez**: Está garantizado que converge para matrices simétricas.
- **Precisión**: Proporciona autovalores y autovectores muy precisos.


## Limitaciones

- **Convergencia Lenta**: El método requiere muchas iteraciones para matrices grandes.
- **Ineficiencia para Matrices Grandes**: No es adecuado para matrices muy grandes o dispersas.
- **Costo Computacional**: Cada rotación implica actualizar toda la matriz, lo cual puede ser costoso para sistemas grandes.
