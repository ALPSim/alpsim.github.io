
---
title: ALPS Installation on Mac/Linux from Spack Packages
description: "Instalación de ALPS con Spack"
weight: 3
toc: true
cascade:
    type: docs
---

### Instalación con Spack
Si planeas usar una versión paralela de ALPS o ejecutar ALPS en un entorno de supercomputadora, además de la [instalación desde fuente](../source) también puedes instalarlo a través de la herramienta de gestión de paquetes [Spack](https://packages.spack.io). Te animamos a consultar los detalles sobre el [paquete de ALPS en Spack](https://packages.spack.io/package.html?name=alps) y la [documentación de Spack](https://spack.readthedocs.io/en/latest/index.html).

Spack es capaz de determinar las dependencias de ALPS e instalará las versiones correctas que ALPS requiere. La instalación también es local para cada usuario en su propio directorio personal, por lo que no afecta a otros usuarios en el mismo clúster de computadoras.

### Pasos de instalación

Primero, hay que clonar Spack desde el repositorio de GitHub:
```
git clone --depth=2 https://github.com/spack/spack.git
```
Esto crea un directorio llamado ```spack```. Puedes cargar (source) el script apropiado para tu shell.

Para usuarios de bash, zsh y sh:
```
. spack/share/spack/setup-env.sh
```
Para usuarios de csh y tcsh:
```
source spack/share/spack/setup-env.csh
```

A continuación, Spack necesita encontrar todos los compiladores disponibles en tu computadora:
```
spack compiler find
```
Este comando permitirá que Spack detecte todos los compiladores disponibles en el sistema y cree un archivo `packages.yaml` bajo el directorio oculto `.spack` en tu directorio personal. Se puede ver/editar con el comando:
```
spack config edit packages
```
Alternativamente, puedes ver los compiladores disponibles mediante:
```
spack compilers
```
Las versiones mínimas de compilador requeridas son `gcc@10.5.0` y `clang@13.0.1`.

Podemos echar un vistazo a la página de información de ALPS en Spack:
```
spack info alps
```
Muestra las dependencias del paquete de ALPS. Todos los paquetes relacionados se instalarán automáticamente a través del sistema de gestión de paquetes de Spack.

¡Finalmente, instalemos ALPS!
```
spack install alps
```
Para usar ALPS, necesitamos cargar el paquete:
```
spack load alps
```

### Instalación con Spack en clústeres de supercomputadoras
Si necesitas instalar ALPS en un clúster de supercomputadoras, recomendamos enviar un trabajo por lotes (batch job) para instalar ALPS a través de un nodo de trabajo en lugar de ejecutar los comandos anteriores en un nodo de inicio de sesión (login node). Dado que la instalación a veces tarda mucho tiempo, usar el nodo de inicio de sesión para instalar ALPS podría afectar a otros usuarios del clúster.

Hemos instalado ALPS con éxito en los siguientes clústeres de supercomputadoras: [NCSA Delta (Illinois)](https://docs.ncsa.illinois.edu/systems/delta/en/latest/index.html), [PSC Bridges (Pittsburgh)](https://www.psc.edu/resources/bridges-2/user-guide/), [Purdue Anvil](https://www.rcac.purdue.edu/anvil#docs), [SDSC Expanse (San Diego)](https://www.sdsc.edu/systems/expanse/user_guide.html), [TACC Stampede3 (Texas)](https://docs.tacc.utexas.edu/hpc/stampede3/). Por favor lee su documentación sobre cómo enviar un trabajo por lotes.

## Video Tutorial

### Instalación con Spack de ALPS (v2.3.3) en WSL.
<br>

{{< youtube id="TD7PuiJKq5U" >}}

### Instalación con Spack de ALPS (v2.3.4) en WSL.
<br>

{{< youtube id="CJmRIpAi02g" >}}

### Instalación con Spack de ALPS (v2.3.4) en un clúster de supercomputadoras.
<br>

{{< youtube id="yTn7ubU4bqE" >}}

