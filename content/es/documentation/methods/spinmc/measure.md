
---
title: Mediciones
math: true
weight: 4
---

Después de que el sistema alcanza el equilibrio, podemos medir cantidades físicas, como la energía, la magnetización, y varias susceptibilidades. Sin embargo, medir cantidades físicas con precisión requiere una consideración cuidadosa de la autocorrelación y de la generación de muestras independientes. La autocorrelación se refiere a la correlación entre mediciones tomadas en distintos pasos de Monte Carlo, lo cual puede llevar a estimaciones sesgadas y errores subestimados. Generar muestras independientes garantiza que las mediciones sean estadísticamente significativas.

## Autocorrelación de Cantidades Físicas

### 1. **Función de Autocorrelación**
La función de autocorrelación $C_A(t)$ mide la correlación entre mediciones de una cantidad $A$ separadas por un intervalo de tiempo $t$ (en pasos de Monte Carlo):
$$
C_A(t) = \frac{\langle A_k A_{k+t} \rangle - \langle A_k \rangle^2}{\langle A_k^2 \rangle - \langle A_k \rangle^2},
$$
donde $\langle A_k A_{k+t} \rangle$ es el promedio del producto de las mediciones separadas por $t$ pasos.

### 2. **Tiempo de Autocorrelación**
El tiempo de autocorrelación $\tau_A$ caracteriza qué tan rápido decae la función de autocorrelación. Se define como:
$$
\tau_A = \sum_{t=1}^{\infty} C_A(t).
$$
En la práctica, $\tau_A$ se estima ajustando $C_A(t)$ a un decaimiento exponencial:
$$
C_A(t) \sim e^{-t / \tau_A}.
$$

### 3. **Efecto de la Autocorrelación**
La autocorrelación reduce el número efectivo de muestras independientes, llevando a errores estadísticos subestimados. Para tener esto en cuenta, el error en la cantidad medida $A$ se corrige mediante:
$$
\sigma_A = \sqrt{\frac{\text{Var}(A)}{N_{\text{eff}}}},
$$
donde $\text{Var}(A)$ es la varianza de $A$, y $N_{\text{eff}}$ es el número efectivo de muestras independientes:
- $\text{Var}(A)$ es la **varianza** de $A$, definida como:
  $$
  \text{Var}(A) = \langle A^2 \rangle - \langle A \rangle^2,
  $$
  donde $\langle A^2 \rangle$ es el promedio de las mediciones al cuadrado, y $\langle A \rangle$ es el promedio de las mediciones.
- $N_{\text{eff}}$ es el número efectivo de muestras independientes:
  $$
  N_{\text{eff}} = \frac{N_{\text{meas}}}{1 + 2 \tau_A}.
  $$
  
## Generación de Muestras Independientes

### 1. Espaciamiento de las Mediciones
Para reducir la autocorrelación, las mediciones deben espaciarse al menos por el tiempo de autocorrelación $\tau_A$. Esto garantiza que las mediciones consecutivas sean aproximadamente independientes. Por ejemplo, si $\tau_A = 10$, las mediciones deben tomarse cada 10 pasos de Monte Carlo.

### 2. Método de Bloques (Blocking)
El método de bloques es una técnica para generar muestras independientes agrupando las mediciones en bloques. Cada bloque debe ser mayor que el tiempo de autocorrelación. El promedio de cada bloque se trata como una muestra independiente, y la varianza de estos promedios de bloque se usa para estimar el error.

### 3. Parallel Tempering
Para sistemas con dinámica lenta, se puede usar parallel tempering para generar muestras independientes. Esto implica ejecutar múltiples simulaciones a diferentes temperaturas e intercambiar periódicamente configuraciones entre ellas. Los intercambios ayudan al sistema a explorar el espacio de configuraciones de manera más eficiente.

## Cantidades Físicas

A continuación se muestran algunos ejemplos de cantidades físicas para el modelo de Ising. Para modelos diferentes, sería necesario considerar cantidades distintas.

### Magnetización:
  $$
  M = \frac{1}{N} \sum_i s_i^z,
  $$
  donde $N$ es el número total de espines.
  
### Energía:
  $$
  E = -J \sum_{\langle i,j \rangle} s_i^z s_j^z - h \sum_i s_i^z.
  $$
  
### Susceptibilidad Magnética: 

La susceptibilidad magnética $\chi$ mide la respuesta de la magnetización del sistema a un campo magnético externo. Se define como:
$$
\chi = \frac{\partial \langle M \rangle}{\partial h},
$$
donde $\langle M \rangle$ es la magnetización promedio, y $h$ es el campo magnético externo. En las simulaciones de Monte Carlo, $\chi$ se calcula a partir de las fluctuaciones en la magnetización $M$ usando la fórmula:
$$
\chi = \frac{\beta}{N} \left( \langle M^2 \rangle - \langle M \rangle^2 \right),
$$
donde:
- $\beta = 1/(k_B T)$ es la temperatura inversa,
- $N$ es el número total de espines,
- $\langle M \rangle$ es la magnetización promedio,
- $\langle M^2 \rangle$ es el promedio de la magnetización al cuadrado.

### Calor Específico:

El calor específico $C$ mide la capacidad calorífica del sistema, o cuánta energía se requiere para cambiar su temperatura. Se define como:
$$
C = \frac{\partial \langle E \rangle}{\partial T},
$$
donde $\langle E \rangle$ es la energía promedio del sistema.

En las simulaciones de Monte Carlo, $C$ se calcula a partir de las fluctuaciones en la energía $E$ usando la fórmula:
$$
C = \frac{\beta^2}{N} \left( \langle E^2 \rangle - \langle E \rangle^2 \right),
$$
donde:
- $\beta = 1/(k_B T)$ es la temperatura inversa,
- $N$ es el número total de espines,
- $\langle E \rangle$ es la energía promedio,
- $\langle E^2 \rangle$ es el promedio de la energía al cuadrado.
