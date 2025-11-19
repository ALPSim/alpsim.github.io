---
title: ALPS/Alea Library
description: "ALPS Alea Library"
weight: 6
---

There is a range of functions that allow the calculation of statistical properties of Monte-Carlo data.

In general, when running a simulation, the results are recorded with an Observable-class and stored in a HDF5 file. These files can then later be read and statistical properties can be calculated. These results can also be written back into the file. There are several examples on how to do this in the examples/alea folder.

Here is an overview of the functions available

| **Function Name** | **Argument(s)** | **Options** | **Return Type** |
| :---------------- | :-------------- | :---------- | :-------------- |
| `mean` | Timeseries | None | `AverageType` |
| `variance` | Timeseries | None | `AverageType` | 
| `error` | Timeseries | uncorrelated, binning | `AverageType` |
| `autocorrelation` | Timeseries | \_distance, \_limit | `mctimeseries<AverageType>` | 
| `exponential_autocorrelation_time` | Scalar MCTimeseries | \_from & \_to, \_max & \_min | `std::pair<AverageType, AverageType>` |
| `integrated_autocorrelation_time` | Scalar MCTimeseries, `std::pair<AverageType, AverageType>` | None | `AverageType` |
| `running_mean` | Timeseries | None | `mctimeseries<AverageType>` |
| `reverse_running_mean` | Timeseries | None | `mctimeseries<AverageType>` |

where `AverageType` is typename `average_type<ValueType>::type`, `Timeseries` is one of `mcdata<ValueType>`, `mctimeseries<ValueType>` or `mctimeseries_view<ValueType>` and `Scalar MCTimeseries` is one of `mctimeseries<double>` or `mctimeseries_view<double>`

The objects `mctimeseries<ValueType>` and `mctimeseries_view<ValueType>` are essentially wrapped `boost::shared_ptr's` to the `timeseries`. while the constructor of the `mctimeseries` class copies the whole data, the constructor of the `mctimeseries_view` class only creates a reference. One can easily create views of timeseries by using the functions `cut_head` and `cut_tail`:

| **Function Name** | **Argument(s)** | **Options** | **Return Type** |
| :---------------- | :-------------- | :---------- | :-------------- |
| `cut_head` | Timeseries | \_distance, \_limit | `mctimeseries_view<ValueType>` |
| `cut_tail` | Timeseries | \_distance, \_limit | `mctimeseries_view<ValueType>` |


## Mean
Mean

