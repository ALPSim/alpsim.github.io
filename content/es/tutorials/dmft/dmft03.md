
---
title: DMFT-03 Interaction
math: true
toc: true
---

## Expansión de Interacción CT-INT

Es instructivo ejecutar los mismos cálculos del Tutorial 02 con un código CT-INT. Este código realiza una expansión en la interacción (en lugar de en la hibridización, como en el caso de CT-HYB). Los scripts de python correspondientes son muy similares a los del Tutorial 02; puede encontrarlos en el directorio `tutorials/dmft-03-interaction`. Como en el tutorial DMFT-02, tiene la opción entre una versión más corta, [`tutorial3.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3.py), que genera datos para 2 puntos de temperatura (dura aproximadamente 10 minutos), o una versión completa que reproduce las 6 curvas, [`tutorial3_long.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3_long.py) (aproximadamente 30 minutos). El análisis de los resultados puede hacerse exactamente igual que en el tutorial [DMFT-02 Hybridization](../dmft02), usando el script [`tutorial3eval.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3eval.py).
