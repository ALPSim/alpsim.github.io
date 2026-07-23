
---
title: Algoritmo Worm Dirigido 
math: true
weight: 6
---

**Atención:** esta implementación es un código experimental y debe usarse solo para el modelo de Bose-Hubbard sin interacciones entre vecinos. De lo contrario, el código puede fallar o producir resultados incorrectos.

## Teoría

### Mecánica estadística cuántica a temperatura finita

A temperatura finita $T$, la física queda esencialmente capturada por la función de partición
$$
Z = \mathrm{Tr} \exp \left(-\beta \hat{H} \right)
$$
y cantidades físicas como la densidad local
$$
\langle n_i \rangle = \frac{1}{Z} \mathrm{Tr} \hat{n}_i \exp \left(-\beta \hat{H} \right),
$$

$$
= \frac{1}{Z} \sum_{\mathcal{C}} n_i (\mathcal{C}) Z(\mathcal{C})
$$
para alguna configuración $\mathcal{C}$ en el espacio de configuraciones completo, con temperatura inversa $\beta = 1/T$. Aquí, las unidades se normalizarán inteligentemente más adelante.

### Perturbación de Feynman en la representación de integral de camino

Descomponga $\hat{H} = \hat{H}_0 - \hat{V}$, donde $\hat{H}_0$ es puramente diagonal en la base elegida, y $\hat{V}$ es no diagonal.

La perturbación de Feynman en la representación de integral de camino define el peso de la configuración:

$$
Z(\mathcal{C}) = e^{-\beta\epsilon_1} 
\left( e^{-\tau_1 \epsilon_1} V_{i_1i_2}  e^{\tau_1 \epsilon_2} \right)
\cdots
\left( e^{-\tau_m \epsilon_m} V_{i_mi_1}  e^{\tau_m \epsilon_1} \right)
$$

para la configuración

$$
\mathcal{C} = [ m ; i_1 \cdots i_m; \tau_1 \cdots \tau_m,  m \in \mathbf{N} ; 0 \lt \tau_1 \lt \cdots \lt \tau_m \lt \beta ]
$$

donde

$$
\epsilon_i = \langle i| \hat{H}_0 |i\rangle
$$

y 
$$
V_{ij} = \langle i| \hat{V} |j\rangle. 
$$

La derivación puede encontrarse en el capítulo 2.1-2.2 de mi tesis.

### Monte Carlo cuántico (algoritmo worm dirigido)

La simulación de Monte Carlo cuántico es en realidad una caminata aleatoria de cadena de Markov en el espacio de configuraciones (líneas de mundo), con muestreo por importancia según el peso de la configuración $Z(\mathcal{C})$, que es simplemente un número positivo asignado a una configuración particular $\mathcal{C}$, por ejemplo, la mostrada aquí. La forma en que se asigna $Z(\mathcal{C})$ depende del hamiltoniano del modelo, así como del algoritmo ergódico que satisface el balance detallado.

Para el algoritmo worm dirigido, la configuración se actualiza con el worm desplazándose hacia y desde el espacio de configuraciones extendido para garantizar la ergodicidad. Además, $n_i(\mathcal{C})$ es el número de partículas (o el estado) en el sitio $i$ en el tiempo $0$.

Cada actualización de configuración se conoce como un barrido de Monte Carlo.

La descripción completa, paso a paso, del algoritmo worm dirigido puede encontrarse en el capítulo 2.3 de mi tesis, y la implementación del código a continuación.

## El código `dwa`: opciones

### Opciones de Monte Carlo

| **Opción** | **Valor por defecto** | **Observación** |
| :--------- | :---------- | :--------- |
| THERMALIZATION | 0 | número de actualizaciones de configuración de Monte Carlo (barridos) necesarias para la termalización; no se realizan mediciones durante la etapa de termalización |
| SWEEPS  | 1000000 | número total de actualizaciones de configuración de Monte Carlo (barridos) después de la termalización |
| SKIP | 1 | número de actualizaciones de configuración de Monte Carlo (barridos) por medición $t$  
 |

### Opciones de la biblioteca de redes de ALPS

| **Opción** | **Valor por defecto** | **Observación** |
| :--------- | :---------- | :--------- |
|  LATTICE | |  ¿qué red desea? |
| L | | longitud de la red |

Se puede encontrar aquí una primera guía rápida de la biblioteca de redes de ALPS.

### Opciones del modelo de Bose-Hubbard

**Atención:** esta implementación es un código experimental y debe usarse solo para el modelo de Bose-Hubbard sin interacciones entre vecinos. De lo contrario, el código puede fallar o producir resultados incorrectos.
  
| **Opción** | **Valor por defecto** | **Observación** |
| :--------- | :---------- | :--------- |
| MODEL | |  fijar como "boson Hubbard" |
| Nmax | | número máximo de bosones permitidos por sitio |
| t | 1. |  intensidad de hopping $t$ |
| U | 0. | intensidad de interacción en el mismo sitio $U$ |
| mu | 0. | potencial químico $\mu$ |

Nota: se permiten las siguientes definiciones para mu:
- $\mu=0.5$

- $\mu=0.5-0.001((x-(L-1)/2.)(x-(L-1)/2.)+(y-(L-1)/2.)(y-(L-1)/2.)+(z-(L-1)/2.)(z-(L-1)/2.))$    

### Otras opciones

| **Opción** | **Valor por defecto** | **Observación** |
| :--------- | :---------- | :--------- |
| T | 0. | temperatura $T$ |
| tof_phase | 0. | fase de tiempo de vuelo (time-of-flight) $\gamma$ |
| MEASURE | true | ¿debemos medir los observables comunes? |
| MEASURE[Simulation Speed] | true | ¿debemos medir el rendimiento de la simulación? |

### Más opciones de medición

| **Opción** | **Valor por defecto** | **Control booleano** |
| :--------- | :---------- | :------------------ |
| MEASURE[Total Particle Number^2] | false | measure_number2_ |
| MEASURE[Energy^2] | false | measure_energy2_ |
| MEASURE[Density^2]  | false | measure_density2_ |
| MEASURE[Energy Density^2]  | false | measure_energy_density2_ |
| MEASURE[Local Kink: Number] | false | measure_local_num_kinks_ |
| MEASURE[Winding Number] | false | measure_winding_number_ |
| MEASURE[Local Density]  | false | measure_local_density_  |
| MEASURE[Local Density^2] | false | measure_local_density2_ |
| MEASURE[Green Function] | false | measure_green_function_ |

## El código dwa: iniciar la simulación

### en la línea de comandos

Se puede encontrar aquí un ejemplo.

### en python

Se puede encontrar aquí un ejemplo.

## El código dwa: salida

### Lista de observables de medición

Cuando el modo de medición está activado, la siguiente es una lista de observables comunes disponibles para el usuario.

| **Observable** |       | **Control booleano** | **Análisis de binning** | **Observación** |
| :------------- | :---- | :------------------ | :------------------- | :--------- |
|  Total Particle Number |   $\langle N \rangle$ |  |      detailed | se mide siempre  |
| Energy | $\langle E \rangle$ | | detailed | se mide siempre  |
| Energy:Vertex | $\langle E_v \rangle$ | | detailed | se mide siempre  |
| Energy:Onsite | $\langle E_o \rangle$ | | detailed | se mide siempre  |
| Density | $\langle n \rangle$ | | detailed | se mide si la red es homogénea  |    
| Energy Density | $\langle \epsilon \rangle$ | detailed | se mide si la red es homogénea  |
| Energy Density:Vertex | $\langle E_v \rangle$ | detailed | se mide si la red es homogénea  |
| Energy Density:Onsite | $\langle E_o \rangle$ | detailed | se mide si la red es homogénea  |
| Total Particle Number^2 | $\langle N^2 \rangle$ | measure_number2_ | detailed | |
| Energy^2 | $\langle E^2 \rangle$ | measure_energy2_ | detailed | |
| Density^2 | $\langle N^2 \rangle$ | measure_density2_ | detailed | se mide si la red es homogénea  |
|  Energy Density^2 | $\langle E^2 \rangle$ | measure_energy_density2_ | detailed | se mide si la red es homogénea  |
| Winding Number^2 | $\langle W_{\alpha}^2 \rangle$ | measure_winding_number_ | detailed | se mide si la red es periódica:  $\alpha=x,y,z$ |
| Stiffness (superfluid density) | $\langle \rho_s \rangle$ | measure_winding_number_ | detailed | se mide si la red es periódica:  $\alpha=x,y,z$ |
| Local Kink:Number | $\langle n_i^r \rangle$ | measure_local_num_kinks_ | simple | |
| Local Density | $\langle n_i \rangle$ | measure_local_density_ | simple | |
| Local Density^2 | $\langle n_i^2 \rangle$ | measure_local_density2_ | simple | |
| Green Function:0 | $g_f \left(\alpha=0\right)$ | | detailed | se mide siempre |
| Green Function:1 | $\sum_{i=x,y,z} g_f \left(\alpha_i =1\right)$ | | detailed | se mide siempre |
| Green Function | $g_f \left(\alpha ; \gamma = 0 \right)$ | measure_green_function_ | simple | |
| Green Function:TOF | $g_f \left(\alpha \right)$ | measure_green_function_ | simple | se mide si tof_phase != 0 |
| Momentum Distribution:0 |  $\langle n_k \left( 0 ; \gamma = 0 \right) \rangle$ | | detailed | se mide si tof_phase == 0 |
|  Momentum Distribution:TOF:0 |  $\langle n_k \left( 0 \right) \rangle$ | | detailed | se mide si tof_phase != 0 |

### Evaluación de la simulación en Python

Se puede encontrar aquí un ejemplo.

### Extracción y visualización de la configuración de líneas de mundo en Python

Ilustrando a partir de este ejemplo, queremos, por ejemplo, extraer la configuración de líneas de mundo de la tarea 30 después de la primera ejecución.

    import pyalps.dwa;
    wl = pyalps.dwa.extract_worldlines('parm1b.task30.out.run1.h5');

Podemos visualizar fácilmente, por ejemplo, la configuración de líneas de mundo en sección transversal de esta red de 8x8 en y=4:

    pyalps.dwa.show_worldlines(wl, reshape = [8,8], at = '[:,4]'); 
    
Se puede extraer fácilmente el estado instantáneo de la configuración de líneas de mundo en el tiempo 0 mediante:

    import numpy
    states = numpy.array(wl.states());

También es posible dibujar fácilmente su propia configuración de líneas de mundo (extendida) usando Python, pero eso no se discutirá aquí. En la práctica, incluso se puede producir su propia película que ilustre cómo se propaga el worm de una configuración de líneas de mundo a otra.

## Aplicación de dwa: bosones en una red óptica

Las siguientes son documentaciones sobre bosones en una red óptica, y cómo se puede implementar fácilmente dwa en la investigación.

- [Correspondencia con el modelo de Hubbard bosónico](../bhol)
- Distribución de momento e imágenes de tiempo de vuelo

## Colaboradores

- Ping Nang Ma
- Matthias Troyer
                                                                                                                                                                                                                    
 
