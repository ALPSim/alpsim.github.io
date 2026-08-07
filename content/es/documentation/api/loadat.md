
---
title: Carga de Datos
math: true
toc: true
weight: 2
---


`pyalps.getResultFiles(dirname='.', pattern=None, prefix=None, format=None)`
obtiene todos los archivos de resultados que coincidan con el patrón o prefijo dado

- Esta función devuelve una lista de todos los archivos de resultados de ALPS que coincidan con un patrón dado, comenzando de forma recursiva desde un directorio dado. El patrón puede especificarse indicando un prefijo para los archivos, que luego se completa con los sufijos de nombre de archivo predeterminados de ALPS. Alternativamente, se puede especificar un patrón de expresión regular completo y personalizado.

- Los parámetros son:

   - dirname: El directorio desde el cual comenzar la búsqueda recursiva, que por defecto es el directorio de trabajo actual.
   - pattern: un patrón de expresión regular que restringe los archivos que se van a buscar
   - prefix: un patrón que debe coincidir con el comienzo de los nombres de archivo. Este se completará con las terminaciones estándar de nombre de archivo de ALPS «.task.out.xml» o «\*.h5» para formar el patrón completo.

- La función devuelve una lista de nombres de archivo


`pyalps.loadMeasurements(files, what=None, verbose=False, respath='/simulation/results')`
carga mediciones de ALPS desde archivos de resultados HDF5 de ALPS

- esta función carga los resultados de simulaciones de ALPS a partir de archivos de resultados HDF5 de ALPS

- Parámetros:    
   - files (list) – archivos de resultados de ALPS, que pueden ser archivos XML o HDF5. Los nombres de archivo XML se cambiarán a los nombres HDF5 correspondientes.
   - what (list) – argumento opcional que es una cadena o una lista de cadenas, que especifica los nombres de los observables que deben cargarse
   - verbose (bool) – argumento opcional que, si se establece en True, hace que se imprima más información a medida que se cargan los datos
- Devuelve:    
  una lista de listas de objetos DataSet – mediciones cargadas. Los elementos de la lista externa corresponden cada uno a los nombres de archivo especificados como entrada. Los elementos de la lista interna corresponden cada uno a un observable diferente. Los valores y de los objetos DataSet son las mediciones y los valores x son opcionalmente las etiquetas (índices) de mediciones con valores de arreglo

`pyalps.loadBinningAnalysis(files, what=None, verbose=False)`
carga el análisis de binning de MC desde archivos de resultados HDF5 de ALPS

- esta función carga los resultados de un análisis de binning de MC a partir de archivos de resultados HDF5 de ALPS

- Parámetros:    
   - files (list) – archivos de resultados de ALPS, que pueden ser archivos XML o HDF5. Los nombres de archivo XML se cambiarán a los nombres HDF5 correspondientes.
   - what (list) – argumento opcional que es una cadena o una lista de cadenas, que especifica los nombres de los observables para los cuales debe cargarse el análisis de binning
   - verbose (bool) – argumento opcional que, si se establece en True, hace que se imprima más información a medida que se cargan los datos
   
- Devuelve:    
  una lista de listas de objetos DataSet – análisis de binning cargado. Los elementos de la lista externa corresponden cada uno a los nombres de archivo especificados como entrada. Los elementos de la lista interna corresponden cada uno a un observable diferente. Los valores x de los objetos DataSet son el nivel de binning logarítmico y los valores y las estimaciones de error en ese nivel de binning.

`pyalps.loadEigenstateMeasurements(files, what=None, verbose=False)`
carga mediciones de autoestados de ALPS desde archivos de resultados HDF5 de ALPS

- esta función carga los resultados de simulaciones de diagonalización o DMRG de ALPS a partir de un archivo HDF5

- Parámetros:    
   - files (list) – archivos de resultados de ALPS, que pueden ser archivos XML o HDF5. Los nombres de archivo XML se cambiarán a los nombres HDF5 correspondientes.
   - what (list) – un argumento opcional que es una cadena o una lista de cadenas, que especifica los nombres de los observables que deben cargarse
   - verbose (bool) – un argumento opcional que, si se establece en True, hace que se imprima más información a medida que se cargan los datos

- Devuelve:    
   lista de listas de (listas de) objetos DataSet – mediciones cargadas. Los elementos de la lista externa corresponden cada uno a los nombres de archivo especificados como entrada. Los elementos del siguiente nivel son los distintos sectores de números cuánticos, si existen. Los elementos de la lista más interna corresponden cada uno a un observable diferente. El valor y de los objetos DataSet es un arreglo de las mediciones en todos los autoestados calculados en ese sector, y los valores x son opcionalmente las etiquetas (índices) de mediciones con valores de arreglo

`pyalps.loadSpectra(files, verbose=False)`
carga espectros de ALPS desde archivos de resultados HDF5 de ALPS

- Esta función carga los espectros calculados en simulaciones de diagonalización o DMRG de ALPS a partir de un archivo HDF5.

- Parámetros:    
   - files (list) – archivos de resultados de ALPS, que pueden ser archivos XML o HDF5. Los nombres de archivo XML se cambiarán a los nombres HDF5 correspondientes.
   - verbose (bool) – argumento opcional que, si se establece en True, hace que se imprima más información a medida que se cargan los datos.
- Devuelve:    
   lista de (listas de) objetos DataSet – Espectros cargados. Los elementos de la lista externa corresponden cada uno a los nombres de archivo especificados como entrada. Los elementos del siguiente nivel son los distintos sectores de números cuánticos, si existen. Los valores y de los objetos DataSet son las energías en ese sector de número cuántico.

`pyalps.loadDMFTIterations(files, observable='G_tau', measurements='0', verbose=False)`
carga mediciones de ALPS desde archivos de resultados HDF5 de ALPS

- esta función carga los resultados de simulaciones de ALPS a partir de archivos de resultados HDF5 de ALPS

- Parámetros:    
   - files (list) – archivos de resultados HDF5 de ALPS.
   - observable (str) – argumento opcional que especifica el nombre de los observables que deben cargarse
   - measurements (list) – argumento opcional que es una cadena o una lista de cadenas, que especifica los nombres de las mediciones que deben cargarse
   - verbose (bool) – argumento opcional que, si se establece en True, hace que se imprima más información a medida que se cargan los datos
- Devuelve:    
   lista de listas de listas de objetos DataSet – mediciones de iteración cargadas. Los elementos de la lista externa corresponden cada uno a los nombres de archivo especificados como entrada. Los elementos del siguiente nivel son las distintas iteraciones. Los elementos de la lista interna contienen un DataSet para cada medición. Los valores y de los objetos DataSet son las mediciones y los valores x son opcionalmente las etiquetas (índices) de mediciones con valores de arreglo

`pyalps.loadProperties(files, proppath='/parameters', respath='/simulation/results', verbose=False)`
 carga las propiedades (parámetros) de las simulaciones desde archivos de resultados HDF5 de ALPS

- esta función carga las propiedades (parámetros) de las simulaciones de ALPS a partir de archivos de resultados HDF5 de ALPS

- Parámetros:    
   - files (list) – archivos de resultados de ALPS, que pueden ser archivos XML o HDF5. Los nombres de archivo XML se cambiarán a los nombres HDF5 correspondientes.
   - verbose (bool) – argumento opcional que, si se establece en True, hace que se imprima más información a medida que se cargan los datos
- Devuelve:    
   lista de diccionarios – propiedades contenidas en cada archivo.

`pyalps.loadObservableList(files, proppath='/parameters', respath='/simulation/results', verbose=False)`
carga listas de mediciones existentes desde archivos de resultados HDF5 de ALPS

- La función devuelve una lista de listas, que contiene los nombres de las mediciones almacenadas en los archivos de resultados

- Parámetros:    
   - files (list) – archivos de resultados de ALPS, que pueden ser archivos XML o HDF5. Los nombres de archivo XML se cambiarán a los nombres HDF5 correspondientes.
   - verbose (bool) – argumento opcional que, si se establece en True, hace que se imprima más información a medida que se cargan los datos
