
---
title: ALPS Installation on Mac/Linux from Sources
description: "Instalación de ALPS"
weight: 2
toc: true
cascade:
    type: docs
---

En la mayoría de los casos, es preferible [instalar ALPS desde binarios](../binary). Sin embargo, para un mayor control y configuración por parte del usuario, instalar desde las fuentes podría ser un mejor enfoque.
{{% steps %}}

### Instalar las dependencias necesarias

ALPS depende de un puñado de bibliotecas externas.
Elige **un** proveedor de MPI y **un** proveedor de BLAS que se ajusten a tu sistema:

| Dependencia | Versión mínima | Paquetes
|----------|--------------------|---------------------------|
| HDF5     | 1.10.0 | `libhdf5-dev`|
| CMake | 3.18 | `cmake`|
| Compilador C++ | GCC 10.5.0 y Clang 13.0.1 | `build-essential` |
| Boost | 1.76 <br>*(se requiere 1.87 para compilar los bindings de Python de ALPS contra NumPy ≥ 2.0)* | ver abajo |
| MPI | OpenMPI 4.0 **o** MPICH 4.0 | `libopenmpi-dev` / `libmpich-dev`|
| BLAS | 0.3 | `libopenblas-dev`
| Python | 3.9 | [python.org](https://www.python.org/) |


<br>
      
<details>
<summary><strong> Ubuntu / Debian / WSL</strong> </summary>
 
 
  ```ShellSession
$ sudo apt update
$ sudo apt install build-essential cmake \
                   libhdf5-dev \
                   libopenblas-dev \
                   libopenmpi-dev openmpi-bin # or: libmpich-dev mpich

# install Python libs:
$ pip install numpy scipy # python libraries 
# or 
$ python3 -m pip install numpy scipy
```

> **No instales Boost mediante `apt`.** ALPS debe compilar Boost desde el código fuente por dos razones:
> 1. **Flags de compilador personalizados** — ALPS requiere `-DBOOST_NO_AUTO_PTR` y
>    `-DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF` para compatibilidad con C++17/20; los
>    paquetes `libboost-dev` no los establecen, lo que causa errores de enlazado.
> 2. **Coincidencia del ABI de Python** — el componente `Boost.Python` debe compilarse contra
>    el intérprete de Python exacto que usará ALPS. Los paquetes precompilados apuntan al Python
>    del sistema y no coincidirán silenciosamente si usas uno diferente.
>
> CMake maneja ambos casos automáticamente: descarga y compila Boost 1.87 durante
> la configuración (requiere acceso a internet). Consulta la alternativa sin conexión en el paso
> de compilación más abajo si es necesario.
</details>
<details>
<summary><strong> macOS (vía Homebrew)</strong> </summary>

 ```ShellSession
$ brew update
$ brew install cmake hdf5 \
               openblas open-mpi # or: mpich

# install Python libs:
$ pip3 install numpy scipy
```

> **No instales Boost mediante Homebrew.** ALPS debe compilar Boost desde el código fuente por dos razones:
> 1. **Flags de compilador personalizados** — ALPS requiere `-DBOOST_NO_AUTO_PTR` y
>    `-DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF` para compatibilidad con C++17/20; la
>    fórmula `boost` de Homebrew no los establece, lo que causa errores de enlazado.
> 2. **Coincidencia del ABI de Python** — el componente `Boost.Python` debe compilarse contra
>    el intérprete de Python exacto que usará ALPS. El Boost de Homebrew apunta a su propio
>    Python y no coincidirá silenciosamente con ningún otro intérprete.
>
> CMake maneja ambos casos automáticamente: si `Boost_SRC_DIR` no está definido, descarga y
> compila Boost 1.87 durante la configuración (requiere acceso a internet). Para compilar sin conexión
> o reutilizar un archivo previamente extraído, descárgalo manualmente primero:
> ```ShellSession
> $ curl -LO https://archives.boost.io/release/1.87.0/source/boost_1_87_0.tar.gz
> $ tar -xzf boost_1_87_0.tar.gz
> ```
</details>
<details>
<summary><strong> macOS (vía MacPorts)</strong> </summary>

```ShellSession
$ sudo port selfupdate
$ sudo port install cmake \
                   hdf5 \
                   OpenBLAS \
                   openmpi-clang20   # see note below about choosing a variant
$ sudo port select --set mpi openmpi-clang20-fortran

# install Python libs:
$ pip3 install numpy scipy
```

> **Eligiendo una variante de OpenMPI:** MacPorts distribuye un puerto separado para cada versión
> de compilador, nombrado `openmpi-<compiler><version>` (por ejemplo, `openmpi-clang20`,
> `openmpi-gcc15`). La variante `clang20` mostrada arriba coincide con el puerto LLVM Clang 20
> y funciona junto con el clang de Xcode de Apple. Si usas un compilador diferente, instala la
> variante correspondiente y ajusta el comando `port select` en consecuencia.
>
> El paso `port select` es obligatorio: sin él, los wrappers simples `mpirun`, `mpicc` y
> `mpicxx` que busca CMake no existirán.

> **No instales Boost mediante MacPorts.** ALPS debe compilar Boost desde el código fuente por dos razones:
> 1. **Flags de compilador personalizados** — ALPS requiere `-DBOOST_NO_AUTO_PTR` y
>    `-DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF` para compatibilidad con C++17/20; los
>    puertos `boost` de MacPorts no los establecen, lo que causa errores de enlazado.
> 2. **Coincidencia del ABI de Python** — el componente `Boost.Python` debe compilarse contra
>    el intérprete de Python exacto que usará ALPS. El Boost de MacPorts apunta a su propio
>    Python y no coincidirá silenciosamente con ningún otro intérprete.
>
> CMake maneja ambos casos automáticamente: si `Boost_SRC_DIR` no está definido, descarga y
> compila Boost 1.87 durante la configuración (requiere acceso a internet). Para compilar sin conexión
> o reutilizar un archivo previamente extraído, descárgalo manualmente primero:
> ```ShellSession
> $ curl -LO https://archives.boost.io/release/1.87.0/source/boost_1_87_0.tar.gz
> $ tar -xzf boost_1_87_0.tar.gz
> ```
</details>

### Verificar las dependencias

 ```ShellSession
$ gcc -v              # must be >= 10.5.0
$ cmake --version     # must be >= 3.18
$ mpirun --version    # OpenMPI 4.0 or MPICH 4
$ python3 --version   # must be >= 3.9
$ python3 -c "import numpy, scipy; print('numpy', numpy.__version__, 'scipy', scipy.__version__)"
```

> **macOS — ¿qué Python usará CMake?** CMake en macOS busca en las rutas de frameworks de Apple
> antes que en `$PATH`, por lo que puede seleccionar silenciosamente el Python 3.9 incluido con Xcode
> incluso si tienes uno más reciente instalado vía Homebrew o MacPorts. Durante la configuración de
> `cmake`, busca una línea como:
> ```
> -- Found Python: /path/to/python (found version "X.Y.Z")
> ```
> Si la ruta o la versión no son las que esperas, fíjala explícitamente añadiendo
> `-DPython3_EXECUTABLE=/path/to/your/python3` a tu comando `cmake`.
> Las rutas típicas son `/opt/homebrew/bin/python3` (Homebrew) o
> `/opt/local/bin/python3` (MacPorts). Asegúrate de que `numpy` y `scipy` estén instalados
> para el Python que use CMake.

### Descargar y compilar
Ahora podemos proceder a descargar y compilar la biblioteca `ALPS`.
En el fragmento a continuación, reemplaza `</path/to/install/dir>` con el directorio donde quieres que se instale ALPS.

> **Antes de ejecutar estos comandos, ten en cuenta dos pausas esperadas:**
> 1. **Configuración de `cmake` (~1-3 min):** CMake descarga silenciosamente Boost 1.87 (~130 MB)
>    durante la configuración. La terminal no producirá salida durante uno o dos minutos mientras
>    se completa la descarga — esto es normal, no la interrumpas.
> 2. **`cmake --build` (5-20 min):** Compilar ALPS y Boost desde el código fuente toma varios
>    minutos incluso con todos los núcleos de CPU. La terminal estará ocupada imprimiendo líneas del
>    compilador durante todo el proceso — también es normal.

  ```ShellSession
  $ git clone https://github.com/alpsim/ALPS alps-src
  $ cmake -S alps-src -B alps-build                                     \
         -DCMAKE_INSTALL_PREFIX=</path/to/install/dir>                  \
         -DCMAKE_CXX_FLAGS="-DBOOST_NO_AUTO_PTR                         \
         -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF"
  # ^ Boost (~130 MB) is downloaded here; no output for 1-3 min is normal
  $ cmake --build alps-build -j$(nproc 2>/dev/null || sysctl -n hw.logicalcpu)
  $ cmake --build alps-build -t test
  ```

> **`-j` controla la compilación en paralelo.** La expresión anterior usa automáticamente todos
> los núcleos lógicos de CPU tanto en Linux (`nproc`) como en macOS (`sysctl -n hw.logicalcpu`).
> También puedes establecer el número manualmente, por ejemplo `-j 8` para 8 núcleos.

> **Compilación sin conexión o con conexión lenta:** Por defecto, CMake obtiene Boost 1.87 en el momento
> de la configuración. Para evitar la descarga, extrae el archivo manualmente primero y pasa la ruta:
> ```ShellSession
> $ cmake -S alps-src -B alps-build                                     \
>        -DCMAKE_INSTALL_PREFIX=</path/to/install/dir>                  \
>        -DBoost_SRC_DIR=</path/to/boost_1_87_0>                        \
>        -DCMAKE_CXX_FLAGS="-DBOOST_NO_AUTO_PTR                         \
>        -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF"
> ```


### Solución de problemas
<details>
* **¿Necesitas un MPI o BLAS diferente?**  <br> Sustituye los nombres de los paquetes anteriores por el módulo de tu clúster (por ejemplo, [Intel MKL/OneAPI](https://www.intel.com/content/www/us/en/developer/tools/oneapi/onemkl.html), [AMD AOCL](https://www.amd.com/en/developer/aocl.html), etc). [Cmake](https://cmake.org/) es un sistema de compilación que encontrará las ubicaciones de los paquetes anteriores y generará instrucciones de compilación en Makefiles.
* **Errores de Python** <br> Asegúrate de que Python ≥ 3.9 esté instalado y de que `numpy` y `scipy` estén instalados para el mismo Python que selecciona CMake. En macOS, CMake puede elegir el Python incluido con Xcode en lugar de tu Python de Homebrew/MacPorts — verifica la línea `Found Python:` en la salida de CMake y fija el intérprete con `-DPython3_EXECUTABLE=/path/to/python3` si es necesario (consulta el paso [Verificar las dependencias](#verificar-las-dependencias)).
* **¿Discrepancia de MPI?**   <br> Asegúrate de que CMake esté usando la misma versión de MPI que `mpirun --version`
* **Errores de Boost** <br> Compilar los bindings de Python de ALPS contra NumPy ≥ 2.0 requiere Boost ≥ 1.87 (NumPy 2.0 introdujo cambios de API que solo maneja Boost 1.87+). Boost 1.76–1.86 funcionan solo con NumPy < 2.0. Consulta las [notas de compilación](#notas-de-compilación) para conocer las combinaciones de compilador/Boost/Python probadas.

</details>

#### Notas de compilación

{{% tabs %}}
{{% tab name="Linux" %}}
Se han probado las siguientes combinaciones de `Boost`, Python y el compilador C++:
  - GCC 10.5.0, Python 3.9.19 (NumPy < 2.0) y `Boost` 1.76.0
  - GCC 11.4.0, Python 3.10.14 (NumPy < 2.0) y `Boost` 1.81.0, 1.86.0
  - GCC 12.3.0, Python 3.10.14 (NumPy < 2.0) y `Boost` 1.81.0, 1.86.0
  - Clang 13.0.1, Python 3.10.14 (NumPy < 2.0) y `Boost` 1.81.0, 1.86.0
  - Clang 14.0.0, Python 3.10.14 (NumPy < 2.0) y `Boost` 1.81.0, 1.86.0
  - Clang 15.0.7, Python 3.10.14 (NumPy < 2.0) y `Boost` 1.81.0, 1.86.0

  Para **NumPy ≥ 2.0**, se requiere `Boost` 1.87.0 o posterior para los bindings de Boost.Python de ALPS (CMake lo descarga automáticamente).
{{% /tab %}}
{{% tab name="Mac" %}}
ALPS ha sido probado en sistemas macOS basados en ARM usando el Clang de Xcode de Apple y
compiladores de terceros (Homebrew GCC, MacPorts GCC/Clang) con `Boost` 1.86.0+.

**`SDKROOT` — cuándo y cómo establecerlo**

`SDKROOT` le indica al compilador dónde encontrar las cabeceras y frameworks del sistema macOS.
El propio Clang de Apple (el `cc`/`c++` que obtienes al instalar Xcode o las Command Line Tools)
localiza el SDK automáticamente — **no necesitas establecer `SDKROOT` al usar Apple Clang**.

Los compiladores de terceros (Homebrew GCC, MacPorts GCC o LLVM Clang, etc.) no saben
dónde se encuentra el SDK y fallarán con errores sobre cabeceras del sistema faltantes. Antes de
ejecutar `cmake`, establece:

```ShellSession
export SDKROOT=$(xcrun --show-sdk-path)
```

`xcrun --show-sdk-path` siempre devuelve la ruta correcta para cualquier versión de Xcode o
Command Line Tools que tengas instalada, independientemente de la versión de macOS. No
codifiques una ruta específica de versión como `MacOSX14.sdk` — se romperá cada vez que
se actualice Xcode.

Para comprobar qué compilador usará CMake, busca la línea `C compiler identification`
al inicio de la salida de cmake. Si dice `AppleClang`, no necesitas `SDKROOT`.
Si dice `GNU` o `Clang` (sin "Apple"), establécelo como se muestra arriba.

**Selección de Python:** En macOS, CMake busca en las rutas de frameworks de Apple antes que en `$PATH`
y a menudo seleccionará el Python 3.9 incluido con Xcode
(`/Applications/Xcode.app/.../python3.9`) incluso cuando hay un Python más reciente instalado vía
Homebrew o MacPorts y aparece primero en tu shell. Verifica qué Python encontró CMake
buscando la línea `Found Python:` impresa durante la configuración. Si no es el que quieres,
fíjalo explícitamente — no confíes en `$(which python3)` ya que puede seguir
resolviendo al intérprete equivocado. Usa la ruta completa en su lugar:

```ShellSession
# Homebrew (Apple Silicon):
$ cmake -S alps-src -B alps-build ... -DPython3_EXECUTABLE=/opt/homebrew/bin/python3

# Homebrew (Intel):
$ cmake -S alps-src -B alps-build ... -DPython3_EXECUTABLE=/usr/local/bin/python3

# MacPorts:
$ cmake -S alps-src -B alps-build ... -DPython3_EXECUTABLE=/opt/local/bin/python3
```

Cualquiera que sea el Python que use CMake, asegúrate de que `numpy` y `scipy` estén instalados para él
(`/path/to/that/python3 -m pip install numpy scipy`).

{{% /tab %}}

{{% /tabs %}}

Si tienes una ubicación de instalación no estándar de los paquetes dependientes instalados en el paso 1, cmake no podrá encontrar el paquete. ALPS usa el mecanismo estándar de cmake (FindXXX.cmake) para encontrar paquetes. Los siguientes enlaces pueden ayudar:
  - Para MPI: Sigue las instrucciones en [cmake con mpi](https://cmake.org/cmake/help/latest/module/FindMPI.html)
  - Para BLAS: Sigue las instrucciones en [cmake con BLAS](https://cmake.org/cmake/help/latest/module/FindBLAS.html)
  - Para HDF5: Sigue las instrucciones en [cmake con HDF5](https://cmake.org/cmake/help/latest/module/FindHDF5.html)

***

Después de compilar el código con éxito, necesitarás instalarlo. La ubicación de instalación se especifica con `-DCMAKE_INSTALL_PREFIX=/path/to/install/directory` como comando de cmake durante la configuración. Alternativamente, se puede cambiar proporcionando explícitamente una nueva ruta de instalación al parámetro `--prefix` durante la fase de instalación (consulta el [manual de cmake](https://cmake.org/cmake/help/latest/manual/cmake.1.html#cmdoption-cmake--install-0)).
<br>
Para instalar el código ejecuta:

  ```ShellSession
  $ cmake --install alps-build
  ```

### Configura tu entorno

El directorio de instalación es autocontenido, pero tu shell todavía no sabe de él.
ALPS proporciona un script de configuración que añade los directorios correctos a `PATH`,
`LD_LIBRARY_PATH` y `PYTHONPATH`. Ejecútalo (source) una vez antes de usar ALPS:

```ShellSession
# bash / zsh:
$ source </path/to/install/dir>/bin/alpsvars.sh

# csh / tcsh:
$ source </path/to/install/dir>/bin/alpsvars.csh
```

Para evitar ejecutar este comando en cada nueva sesión de terminal, añade la línea `source`
al archivo de inicio de tu shell (`~/.bashrc`, `~/.zshrc`, o `~/.cshrc`).

**Verifica la instalación** ejecutando uno de los ejecutables de ALPS:

```ShellSession
$ spinmc --help
```

Si el comando se encuentra y muestra un mensaje de ayuda, ALPS está instalado y tu
entorno está configurado correctamente.

{{% /steps %}}

### Video Tutorial
<br>

{{< youtube id="OHQGfDDaRMk" >}}

