
---
title: Evaluation
math: true
toc: true
weight: 3
---

| **API Functions** |       |
| :---------------- | :---- |
| `pyalps.DataSet([x, y, props])`  |  The DataSet class stores a set of data, usually in XY format, along with all the properties describing the data, such as input parameters to the simulation etc. |
| `pyalps.collectXY(sets, x, y[, foreach, ...])`  |  collects specified data from a list of DataSet objects |
| `pyalps.groupSets(groups[, for_each])`  |  groups a list of DataSet objects into a list of lists |
| `pyalps.select(inp, condition)`    |   |
| `pyalps.select_by_property(data, proplist)`    |  |
| `pyalps.mergeDataSets(dsets)`   |   |
| `pyalps.mergeMeasurements(measurements)`   |  | 
| `pyalps.select(inp, condition)`    |  |
| `pyalps.fit_wrapper.Parameter(value)`    |  |
| `pyalps.fit_wrapper.fit(self, function, ...)`   |  | 
| `pyalps.SetLabels(data, proplist)`  |  Set labels according to the properties given in ‘proplist’. |
| `pyalps.CycleColors(data, foreach[, colors])`  |  Cyclically assign colors to the lines/markers that will be used to display the DataSets, based on the properties in ‘foreach’. |
| `pyalps.CycleMarkers(data, foreach[, markers])`  |  Cyclically assign markers to the lines/markers that will be used to display the DataSets, based on the properties in ‘foreach’. |
| `pyalps.collectXY(sets, x, y[, foreach, ...])`  |  collects specified data from a list of DataSet objects |


`*class* pyalps.DataSet(x=None, y=None, props=None)`[source](../../pythonapi/sourcedata#pyalpsdataset)

- The DataSet class stores a set of data, usually in XY format, along with all the properties describing the data, such as input parameters to the simulation etc.

- Members are:
   - x, y - These contain the data and are expected to come as lists of Numpy arrays by many functions operating on DataSets. However, for user-supplied functions, other ways of representing data may be used.

   - props - This is a dictionary of properties describing the dataset.

### Tools

`pyalps.collectXY(sets, x, y, foreach=, []ignoreProperties=False)`[source](../../pythonapi/sourcetools#pyalpscollectxy)
  collects specified data from a list of DataSet objects

- this function is used to collect data from a list of DataSet objects, to prepare plots or evaluation. 

- The parameters are:

   - sets: the list of datasets 
   - x: the name of the property or measurement to be used as x-value of the collected results 
   - y: the name of the property or measurement to be used as y-value of the collected results 
   - foreach: an optional list of properties used for grouping the results. A separate DataSet object is created for each unique set of values of the specified parameers. 
   - ignoreProperties: setting ignoreProperties=True prevents collectXY() from collecting properties.
   
- The function returns a list of DataSet objects.

`pyalps.groupSets(groups, for_each=[])`[source](../../pythonapi/sourcetools#pyalpsgroupsets)
  groups a list of DataSet objects into a list of lists

- this function groups a list of DataSet objects into a list of lists, according to the values of the properties given in the for_ech argument. DataSet objects with the same values of the properties given in for_each are grouped together. 

- The parameters are:
   - data: the data to be grouped for_each: the properties according to which the data is grouped

`pyalps.select(inp, condition)`[source](../../pythonapi/sourcetools#pyalpsselect)

`pyalps.select_by_property(data, proplist)`[source](../../pythonapi/sourcetools#pyalpsselect_by_property)

`pyalps.mergeDataSets(dsets)`[source](../../pythonapi/sourcetools#pyalpsmergedatasets)

`pyalps.mergeMeasurements(measurements)`[source](../../pythonapi/sourcetools#pyalpsmergemeasurements)


### Fit wrapper

`pyalps.fit_wrapper.Parameter()`[source](../../pythonapi/sourcefit#pyalpsparameter)

`pyalps.fit_wrapper.fit(self, function, parameters, y, x=None)`[source](../../pythonapi/sourcefit#pyalpsfit)

### Plot

`pyalps.SetLabels(data, proplist)`[source](../../pythonapi/sourcetools#pyalpssetlabels)

- Set labels according to the properties given in ‘proplist’.

`pyalps.CycleColors(data, foreach, colors=['k', 'b', 'g', 'm', 'c', 'y'])`[source](../../pythonapi/sourcetools#pyalpscyclecolors)

- Cyclically assign colors to the lines/markers that will be used to display the DataSets, based on the properties in ‘foreach’. This means that DataSet instances that have the same values for the properties in ‘foreach’ will receive the same color.

`pyalps.CycleMarkers(data, foreach, markers=['s', 'o', '^', '>', 'v', '<', 'd', 'p', 'h', '+', 'x'])`[source](../../pythonapi/sourcetools#pyalpscyclemarkers)

- Cyclically assign markers to the lines/markers that will be used to display the DataSets, based on the properties in ‘foreach’. This means that DataSet instances that have the same values for the properties in ‘foreach’ will receive the same marker.

