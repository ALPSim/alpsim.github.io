
---
title: DMFT-01 Intro
math: true
toc: true
---

## Introducción - Los tutoriales de DMFT de ALPS

Este es un conjunto de tutoriales introductorios para el código DMFT de ALPS. Su propósito es ilustrar la teoría de campo medio dinámico y, en particular, mostrar algunas aplicaciones de los nuevos solucionadores de impureza de tiempo continuo.

La teoría de campo medio dinámico (DMFT) proporciona una solución aproximada al problema cuántico de muchos cuerpos, en la que la física local se trata de forma exacta pero se desprecian las correlaciones espaciales. Originalmente discutida en el límite de número de coordinación infinito, donde (tras un reescalado apropiado de los saltos) la aproximación se vuelve exacta, hoy en día se utiliza principalmente para la simulación de materiales correlacionados, por ejemplo en combinación con LDA en el llamado método LDA+DMFT. En este límite, el problema de red se mapea a un problema de impureza con una acción efectiva dependiente del tiempo y una condición de autoconsistencia. La acción efectiva se resuelve mediante un solucionador de impureza. Un artículo introductorio, así como notas de clase y varias revisiones, ofrecen una introducción al tema.

Discutimos dos algoritmos de solucionador de impureza: una implementación del código de expansión de hibridización, así como una implementación del algoritmo de expansión de interacción. El código de tiempo discreto de Hirsch-Fye es obsoleto y sirve principalmente como código pedagógico de ejemplo.

El tutorial 02 presentará la transición Metal - aislante AFM en función de la temperatura en dimensión infinita, utilizando un solucionador de impureza de expansión de hibridización. El tutorial 03 repetirá el mismo ejercicio con un solucionador de expansión de interacción, y el tutorial 07 lo repite una vez más con el solucionador de impureza de tiempo discreto de Hirsch-Fye. Los tutoriales 04 y 05 ofrecerán una introducción a la transición de Mott y a la transición de Mott orbitalmente selectiva, y el tutorial 06 muestra una aplicación a un metal paramagnético. El tutorial 08 es un ejemplo de solución aproximada del modelo de Hubbard para una red específica.
