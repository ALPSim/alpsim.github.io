
---
title: Actualizaciones Locales
math: true
weight: 2
---

En una simulación de Monte Carlo, los estados del sistema suelen muestrearse mediante actualizaciones locales, donde la configuración de cada sitio se actualiza una a la vez según su entorno local. Usaremos el modelo de Ising para ilustrar cómo se logra el muestreo de estados.

El hamiltoniano del modelo de Ising viene dado por:
$$
\mathcal{H} = -J \sum_{\langle i,j \rangle} s_i^z s_j^z - h \sum_i s_i^z,
$$
donde:
- $J$ es la intensidad de interacción entre espines vecinos,
- $\langle i,j \rangle$ denota una suma sobre pares de primeros vecinos,
- $s_i^z=\pm 1$ es el espín en el sitio $i$,
- $h$ es un campo magnético externo.

## Pasos de una Simulación de Monte Carlo

### 1. Inicializar el Sistema
- Comenzar con una red de espines (p. ej., una red cuadrada 2D de tamaño $L \times L$).
- Inicializar los espines aleatoriamente (p. ej., $s_i^z = \pm 1$ con igual probabilidad) o en una configuración específica (p. ej., todos los espines hacia arriba).

### 2. Realizar Actualizaciones Locales
Las actualizaciones locales se realizan usando ya sea el algoritmo de Metropolis-Hastings o el algoritmo de heat-bath.

#### Actualización Local de Metropolis-Hastings
Para cada espín $s_i^z$:
1. **Proponer una inversión**: Invertir el espín $s_i^z$ a su valor opuesto, $s_i^z \to -s_i^z$.
2. **Calcular el cambio de energía**: Calcular el cambio de energía $\Delta E$ debido a la inversión propuesta. Para el modelo de Ising, el cambio de energía depende solo del espín $s_i^z$ y de sus primeros vecinos:
   $$
   \Delta E = 2 J s_i^z \sum_{j \in \text{neighbors}(i)} s_j^z + 2 h s_i^z.
   $$
   Aquí, la suma se extiende sobre los primeros vecinos del espín $s_i^z$.
3. **Aceptar o rechazar la inversión**:
     $$
     P_{\text{accept}} = \text{min}(1, e^{-\beta \Delta E}),
     $$
     donde $\beta = 1/(k_B T)$ es la temperatura inversa. Esto significa
   - Si $\Delta E \leq 0$, siempre se acepta la inversión.
   - Si $\Delta E > 0$, se acepta la inversión con probabilidad: $e^{-\beta \Delta E}$.
   - Si la inversión es rechazada, el espín queda sin cambios.

#### Actualización Local de Heat-Bath
Alternativamente, se puede usar el algoritmo de heat-bath para las actualizaciones locales. Para cada espín $s_i^z$:
1. **Calcular el campo local**: El campo local que actúa sobre el espín $s_i^z$ viene dado por:
   $$
   h_i = -J \sum_{j \in \text{neighbors}(i)} s_j^z - h.
   $$
2. **Muestrear el nuevo estado de espín**: El espín $s_i^z$ se actualiza a $+1$ o $-1$ con probabilidades:
   $$
   P_{ -1 \to +1} = \frac{e^{-\beta h_i}}{e^{-\beta h_i} + e^{\beta h_i}},
   $$
   $$
   P_{ +1 \to -1} = \frac{e^{\beta h_i}}{e^{-\beta h_i} + e^{\beta h_i}}.
   $$
   Estas probabilidades garantizan que el espín se muestree de su distribución de equilibrio dado su entorno local.

### 3. Repetir para Muchos Barridos
- Un barrido consiste en intentar actualizar cada espín de la red una vez.
- Repetir el proceso de actualización local durante muchos barridos para permitir que el sistema alcance el equilibrio y recolectar estadísticas.

