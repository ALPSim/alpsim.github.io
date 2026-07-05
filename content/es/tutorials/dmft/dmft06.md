
---
title: DMFT-06 Paramagnet
math: true
toc: true
---

## Metal paramagnético y errores de extrapolación

En este ejemplo simulamos el modelo de Hubbard en la red de Bethe con interacción $U=3D/\sqrt{2}$ a una temperatura $\beta =32 \sqrt{2}/D$ usando una autoconsistencia paramagnética. Calcularemos la autoenergía y la compararemos con la Fig. 15 de la [revisión de DMFT de Georges et al.](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13), donde se muestran resultados de Hirsch-Fye y de diagonalización exacta para el mismo sistema. A diferencia del algoritmo de Hirsch-Fye, los dos algoritmos de Monte Carlo de tiempo continuo CT-HYB y CT-INT no sufren errores de discretización y reproducen los resultados de ED.

Los archivos de parámetros y los scripts de python se encuentran en los subdirectorios `hyb` e `int` del directorio `tutorials/dmft-06-paramagnet` en su directorio de instalación de ALPS. Puede ejecutar las simulaciones corriendo (para la versión de expansión de hibridización)

```
python tutorial6a.py
```

y (para la versión de expansión de interacción)

```
python tutorial6b.py
```
    
En cada iteración i de DMFT la autoenergía se escribe en el archivo `selfenergy_i`. Grafique la autoenergía convergida y compare sus resultados con la Fig. 15 de [Georges et al.](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13). Alternativamente, puede usar el script de python para esta tarea, tal como se hace en el tutorial [DMFT-02 Hybridization](../dmft02).

Advertencia: esto toma mucho tiempo en una sola estación de trabajo; puede reducir el tiempo total de las dos ejecuciones a aproximadamente $2\times 24$ minutos si no necesita una precisión muy alta.
