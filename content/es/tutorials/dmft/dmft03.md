
---
title: DMFT-03 Interaction
math: true
toc: true
---

## Expansión de Interacción CT-INT

Es instructivo ejecutar los mismos cálculos del Tutorial 02 con un código CT-INT. Este código realiza una expansión en la interacción (en lugar de en la hibridización, como en el caso de CT-HYB). Los scripts de python correspondientes son muy similares; puede encontrarlos en el directorio tutorials/dmft-03-interaction. Como en el tutorial DMFT-02, tiene la opción entre una versión más corta [`tutorial3.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3.py) que produce datos para 2 puntos de temperatura (dura aproximadamente 10 minutos) o una versión más larga que hace las 6 curvas `tutorial3_long.py` (30 minutos). La evaluación puede realizarse exactamente igual que en el tutorial [`ALPS_2_Tutorials:DMFT-02_Hybridization`](../dmft02), usando el script [`tutorial3eval.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3eval.py). 
