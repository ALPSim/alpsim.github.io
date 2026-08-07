---
title: Primeros Pasos
description: "Introducción a ALPS y cómo instalarlo"
weight: 2
toc: true
cascade:
    type: docs
aliases:
  - /documentation/start/intro/
  - /documentation/start/obtain/
  - /documentation/start/path/
---

ALPS es un paquete de software para simular sistemas correlacionados. Proporciona programas para simulaciones de Monte Carlo Clásico, Monte Carlo Cuántico y Density Matrix Renormalization Group.

## Obtención de ALPS

La forma más simple de empezar a usar `ALPS` es instalar el paquete precompilado de Python:

```ShellSession
$ pip install pyalps
```

Para un mayor control sobre la instalación — o para compilar con soporte HPC — elige uno de los métodos a continuación:

<div class="btn-grid">
{{< cta-button text="Binario" link="../install/binary" icon="download" >}}
{{< cta-button text="Fuente" link="../install/source" icon="code" >}}
{{< cta-button text="Spack" link="../install/spack" icon="inventory_2" >}}
</div>

## Tutoriales de inicio rápido

Una vez instalado ALPS, prueba uno de los ejemplos de inicio rápido:

- [Monte Carlo Clásico](mc) — transición de fase del modelo de Ising 2D
- [Monte Carlo Cuántico](qmc) — apantallamiento Kondo con el solucionador de expansión de hibridización
- [Density Matrix Renormalization Group](dmrg) — energía del estado fundamental de una cadena de Heisenberg
- [Diagonalización Exacta](ed) — brecha de tripletes de una cadena de espines
