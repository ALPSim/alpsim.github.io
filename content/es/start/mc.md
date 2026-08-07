---
linkTitle: Monte Carlo Clásico
title: Simulaciones de Monte Carlo Clásico
description: "Transición de fase en el modelo de Ising 2D"
weight: 2
math: true
---

El modelo de Ising 2D es uno de los modelos más importantes en mecánica estadística. Describe espines en una red cuadrada que pueden apuntar hacia arriba o hacia abajo, con acoplamiento ferromagnético $J > 0$ entre primeros vecinos (usando la convención de signo clásica predeterminada de `spinmc`, donde un $J$ positivo favorece espines paralelos). Onsager demostró en 1944 que tiene una solución exacta con una transición de fase en $T_c = 2J / \ln(1 + \sqrt{2}) \approx 2.269\, J/k_B$: por debajo de $T_c$ los espines se ordenan espontáneamente, por encima de $T_c$ las fluctuaciones térmicas destruyen ese orden.

Este tutorial simula esa transición de fase usando ALPS. Es un buen primer ejemplo porque la física es bien conocida y el resultado es fácil de verificar.

{{< callout type="info" >}}
Este tutorial asume que pyalps ya está instalado. Si aún no lo has configurado, consulta la guía de [Primeros Pasos](../).
{{< /callout >}}

## Importar paquetes

`pyalps` proporciona el marco de simulación y las herramientas de análisis. `matplotlib` y `pyalps.plot` se usan para la visualización.

```python
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot
```

## Configurar los parámetros

Simulamos redes cuadradas de tres tamaños — $4\times 4$, $8\times 8$ y $16\times 16$ — a lo largo de un rango de temperaturas. Ejecutar múltiples tamaños de sistema nos permite ver cómo se agudiza la transición a medida que el sistema crece hacia el límite termodinámico.

Los parámetros de cada ejecución se recopilan en una lista de diccionarios:

```python
parms = []
for l in [4, 8, 16]:
    for t in [5.0, 4.5, 4.0, 3.5, 3.0, 2.9, 2.8, 2.7]:
        parms.append({
            'LATTICE'        : "square lattice",
            'T'              : t,
            'J'              : 1,
            'THERMALIZATION' : 1000,
            'SWEEPS'         : 400000,
            'UPDATE'         : "cluster",
            'MODEL'          : "Ising",
            'L'              : l,
        })
    for t in [2.6, 2.5, 2.4, 2.3, 2.2, 2.1, 2.0, 1.9, 1.8, 1.7, 1.6, 1.5, 1.2]:
        parms.append({
            'LATTICE'        : "square lattice",
            'T'              : t,
            'J'              : 1,
            'THERMALIZATION' : 1000,
            'SWEEPS'         : 40000,
            'UPDATE'         : "cluster",
            'MODEL'          : "Ising",
            'L'              : l,
        })
```

Algunos parámetros clave para entender:

- **`THERMALIZATION`**: el número de barridos de Monte Carlo descartados al inicio de cada ejecución para dejar que el sistema alcance el equilibrio antes de que comiencen las mediciones.
- **`SWEEPS`**: el número de barridos de medición después de la termalización. Más barridos reducen el ruido estadístico. Usamos más barridos ($400\,000$) a altas temperaturas, donde la longitud de correlación es corta y los barridos individuales son baratos, y menos ($40\,000$) cerca y por debajo de $T_c$, donde las actualizaciones de clúster son más grandes.
- **`UPDATE: "cluster"`**: selecciona el algoritmo de clúster de Wolff en lugar del Metropolis de espín único. Cerca de $T_c$, las actualizaciones de espín único sufren de *ralentización crítica* (critical slowing down) — la simulación se vuelve muy ineficiente porque la longitud de correlación de espines diverge. El algoritmo de clúster invierte dominios correlacionados completos de una vez y evita en gran medida este problema.
- **`L`**: el tamaño lineal del sistema. Una red con `L = 8` tiene $8 \times 8 = 64$ espines.

La malla de temperaturas es más gruesa lejos de $T_c$ y más fina en el rango $1.2$–$2.7$, donde ocurre la física interesante.

## Ejecutar la simulación

`writeInputFiles` convierte la lista de parámetros al formato de entrada XML que espera ALPS y lo escribe en disco. `runApplication` luego lanza el ejecutable `spinmc`. El argumento `Tmin=5` le indica a ALPS que use al menos 5 segundos de tiempo de CPU por ejecución.

```python
input_file = pyalps.writeInputFiles('parm7a', parms)
pyalps.runApplication('spinmc', input_file, Tmin=5)
```

## Evaluar y graficar

`evaluateSpinMC` post-procesa la salida de simulación cruda para calcular cantidades derivadas como la susceptibilidad magnética y el cumulante de Binder. `loadMeasurements` lee los resultados de vuelta a Python, y `collectXY` los organiza como curvas de $|m|$ vs. $T$, una curva por tamaño de sistema.

```python
pyalps.evaluateSpinMC(pyalps.getResultFiles(prefix='parm7a'))

# load the magnetization as a function of temperature
data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm7a'), ['|Magnetization|'])
magnetization_abs = pyalps.collectXY(data, x='T', y='|Magnetization|', foreach=['L'])

# plot
plt.figure()
pyalps.plot.plot(magnetization_abs)
plt.xlabel('Temperature $T$')
plt.ylabel('Magnetization $|m|$')
plt.title('2D Ising model')
plt.show()
```

La magnetización cae de casi 1 a baja temperatura a 0 por encima de $T_c \approx 2.269$. Para sistemas pequeños la transición se redondea por efectos de tamaño finito; se agudiza y se desplaza hacia el $T_c$ exacto a medida que $L$ aumenta:

![Magnetización vs temperatura para el modelo de Ising 2D](/figs/Ising_2D_m.png)


## Video Tutorial

<br>

{{< youtube id="3_4WCeKDtKc" >}}
