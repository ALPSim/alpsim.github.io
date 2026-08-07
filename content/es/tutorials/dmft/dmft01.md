
---
title: DMFT-01 Intro
math: true
toc: true
---

## Introducción a los tutoriales de DMFT de ALPS

Este es un conjunto de tutoriales introductorios para el código DMFT de ALPS. Ilustran la teoría de campo medio dinámico (DMFT) y muestran aplicaciones de los solucionadores de impureza de tiempo continuo implementados en ALPS.

### ¿Qué es la DMFT?

La teoría de campo medio dinámico (DMFT) proporciona una solución aproximada al problema cuántico de muchos cuerpos, en la que la física local se trata de forma exacta mientras se desprecian las correlaciones espaciales. Se derivó originalmente en el límite de número de coordinación infinito, donde (tras un reescalado apropiado del salto) la aproximación se vuelve exacta. Hoy en día se utiliza principalmente para la simulación de materiales correlacionados, a menudo combinada con la aproximación de densidad local (LDA) en el llamado método LDA+DMFT.

En este límite, el problema de red se mapea a un problema cuántico de impureza con una acción efectiva dependiente del tiempo y una condición de autoconsistencia. La acción efectiva se resuelve mediante un "solucionador de impureza". Puede encontrarse una introducción completa al método y sus aplicaciones en la revisión de [Georges, Kotliar, Krauth y Rozenberg, Rev. Mod. Phys. 68, 13 (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13); véase también la [documentación de DMFT de ALPS](../../../documentation/methods/dmft) para más detalles teóricos.

### Solucionadores de impureza utilizados en esta serie de tutoriales

Discutimos dos algoritmos de solucionador de impureza: una implementación del código de expansión de hibridización, y una implementación del algoritmo de expansión de interacción. También se proporciona un código de tiempo discreto de Hirsch-Fye; es obsoleto desde el punto de vista numérico y sirve principalmente como ejemplo pedagógico.

### Hoja de ruta

- **El tutorial 02** presenta la transición metal-aislante antiferromagnético en función de la temperatura en dimensión infinita, utilizando el solucionador de impureza de expansión de hibridización.
- **El tutorial 03** repite el mismo ejercicio con el solucionador de expansión de interacción.
- **El tutorial 04** presenta la transición de Mott.
- **El tutorial 05** presenta la transición de Mott orbitalmente selectiva.
- **El tutorial 06** aplica el método a un metal paramagnético.
- **El tutorial 07** repite una vez más la transición metal-aislante, utilizando el solucionador de impureza de tiempo discreto de Hirsch-Fye.
- **El tutorial 08** muestra cómo resolver el modelo de Hubbard para una red distinta de la red de Bethe (la predeterminada), dada su densidad de estados.
- **El tutorial 09** reproduce la transición de Néel, combinando los solucionadores de expansión de hibridización, expansión de interacción y Hirsch-Fye de los tutoriales 02, 03 y 07.
