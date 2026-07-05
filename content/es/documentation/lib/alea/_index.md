---
title: Biblioteca ALPS/Alea
description: "Biblioteca ALPS Alea"
weight: 6
---

Existe una serie de funciones que permiten calcular propiedades estadísticas de datos de Monte Carlo.

En general, al ejecutar una simulación, los resultados se registran con una clase Observable y se almacenan en un archivo HDF5. Estos archivos pueden leerse posteriormente y se pueden calcular sus propiedades estadísticas. Estos resultados también pueden escribirse de nuevo en el archivo. Hay varios ejemplos de cómo hacer esto en la carpeta examples/alea.

Aquí hay una visión general de las funciones disponibles

| **Nombre de la Función** | **Argumento(s)** | **Opciones** | **Tipo de Retorno** |
| :---------------- | :-------------- | :---------- | :-------------- |
| `mean` | Timeseries | Ninguna | `AverageType` |
| `variance` | Timeseries | Ninguna | `AverageType` | 
| `error` | Timeseries | uncorrelated, binning | `AverageType` |
| `autocorrelation` | Timeseries | _distance, _limit | `mctimeseries<AverageType>` | 
| `exponential_autocorrelation_time` | Scalar MCTimeseries | _from & _to, _max & _min | `std::pair<AverageType, AverageType>` |
| `integrated_autocorrelation_time` | Scalar MCTimeseries, `std::pair<AverageType, AverageType>` | Ninguna | `AverageType` |
| `running_mean` | Timeseries | Ninguna | `mctimeseries<AverageType>` |
| `reverse_running_mean` | Timeseries | Ninguna | `mctimeseries<AverageType>` |

donde `AverageType` es el tipo `average_type<ValueType>::type`, `Timeseries` es uno de `mcdata<ValueType>`, `mctimeseries<ValueType>` o `mctimeseries_view<ValueType>` y `Scalar MCTimeseries` es uno de `mctimeseries<double>` o `mctimeseries_view<double>`

Los objetos `mctimeseries<ValueType>` y `mctimeseries_view<ValueType>` son esencialmente `boost::shared_ptr's` envueltos que apuntan al `timeseries`. Mientras que el constructor de la clase `mctimeseries` copia todos los datos, el constructor de la clase `mctimeseries_view` solo crea una referencia. Se pueden crear fácilmente vistas de series temporales usando las funciones `cut_head` y `cut_tail`:

| **Nombre de la Función** | **Argumento(s)** | **Opciones** | **Tipo de Retorno** |
| :---------------- | :-------------- | :---------- | :-------------- |
| `cut_head` | Timeseries | _distance, _limit | `mctimeseries_view<ValueType>` |
| `cut_tail` | Timeseries | _distance, _limit | `mctimeseries_view<ValueType>` |


## Media
Media

