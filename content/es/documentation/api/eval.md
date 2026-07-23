
---
title: Evaluación de Datos
linkTitle: Evaluación
math: true
toc: true
weight: 3
---


### DataSet

`*class* pyalps.DataSet(x=None, y=None, props=None)`

- La clase DataSet almacena un conjunto de datos, generalmente en formato XY, junto con todas las propiedades que describen los datos, tales como los parámetros de entrada de la simulación, etc.

- Los miembros son:
   - x, y - Estos contienen los datos y se espera que vengan como listas de arreglos de Numpy en muchas funciones que operan sobre DataSets. Sin embargo, para funciones definidas por el usuario, se pueden usar otras formas de representar los datos.

   - props - Este es un diccionario de propiedades que describen el conjunto de datos.

### Herramientas

`pyalps.collectXY(sets, x, y, foreach=, []ignoreProperties=False)`
  recopila datos específicos de una lista de objetos DataSet

- esta función se usa para recopilar datos de una lista de objetos DataSet, con el fin de preparar gráficos o evaluaciones.

- Los parámetros son:

   - sets: la lista de conjuntos de datos
   - x: el nombre de la propiedad o medición que se usará como valor x de los resultados recopilados
   - y: el nombre de la propiedad o medición que se usará como valor y de los resultados recopilados
   - foreach: una lista opcional de propiedades utilizadas para agrupar los resultados. Se crea un objeto DataSet independiente para cada conjunto único de valores de los parámetros especificados.
   - ignoreProperties: al establecer ignoreProperties=True se evita que collectXY() recopile propiedades.

- La función devuelve una lista de objetos DataSet.

`pyalps.groupSets(groups, for_each=[])`
  agrupa una lista de objetos DataSet en una lista de listas

- esta función agrupa una lista de objetos DataSet en una lista de listas, según los valores de las propiedades indicadas en el argumento for_each. Los objetos DataSet con los mismos valores de las propiedades indicadas en for_each se agrupan juntos.

- Los parámetros son:
   - data: los datos que se van a agrupar for_each: las propiedades según las cuales se agrupan los datos

`pyalps.select(inp, condition)`

`pyalps.select_by_property(data, proplist)`

`pyalps.mergeDataSets(dsets)`

`pyalps.mergeMeasurements(measurements)`


### Envoltorio de ajuste (fit wrapper)

`pyalps.fit_wrapper.Parameter()`

`pyalps.fit_wrapper.fit(self, function, parameters, y, x=None)`

### Gráficos

`pyalps.SetLabels(data, proplist)`

- Establece las etiquetas según las propiedades indicadas en «proplist».

`pyalps.CycleColors(data, foreach, colors=['k', 'b', 'g', 'm', 'c', 'y'])`

- Asigna colores cíclicamente a las líneas/marcadores que se usarán para mostrar los DataSets, según las propiedades en «foreach». Esto significa que las instancias de DataSet que tengan los mismos valores para las propiedades en «foreach» recibirán el mismo color.

`pyalps.CycleMarkers(data, foreach, markers=['s', 'o', '^', '>', 'v', '<', 'd', 'p', 'h', '+', 'x'])`

- Asigna marcadores cíclicamente a las líneas/marcadores que se usarán para mostrar los DataSets, según las propiedades en «foreach». Esto significa que las instancias de DataSet que tengan los mismos valores para las propiedades en «foreach» recibirán el mismo marcador.

