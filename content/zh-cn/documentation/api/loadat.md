
---
title: Loading Data
math: true
toc: true
weight: 2
---


`pyalps.getResultFiles(dirname='.', pattern=None, prefix=None, format=None)`
get all result files matching the given pattern or prefix

- This function returns a list of all ALPS result files matching a given pattern, starting recursively from a given directory. The pattern can be either specificed by giving a prefix for the files, which is then augmented with the default ALPS file name suffixes. ALternatively a fiull custom regular expression pattern can be specified.

- The paramters are:

   - dirname: The directory from which to start the recursive search, defaulting to the current working directory. 
   - pattern: a regular expression pattern resricting the files to be matches 
   - prefix: a pattern which the start of the file names has to match. This will be augmented by the standard ALPS file name endings ‘.task.out.xml’ or ‘\*.h5’ to form the full pattern.

- The function returns a list of filenames


`pyalps.loadMeasurements(files, what=None, verbose=False, respath='/simulation/results')`
loads ALPS measurements from ALPS HDF5 result files

- this function loads results of ALPS simulations ALPS HDF5 result files

- Parameters:    
   - files (list) – ALPS result files which can be either XML or HDF5 files. XML file names will be changed to the corresponding HDF5 names.
   - what (list) – optional argument that is either a string or list of strings, specifying the names of the observables which should be loaded
   - verbose (bool) – optional argument that if set to True causes more output to be printed as the data is loaded
- Returns:    
  a list of list of DataSet objects – loaded measurements. The elements of the outer list each correspond to the file names specified as input. The elements of the inner list are each for a different observable. The y-values of the DataSet objects are the measurements and the x-values optionally the labels (indices) of array-valued measurements

`pyalps.loadBinningAnalysis(files, what=None, verbose=False)`
loads MC binning analysis from ALPS HDF5 result files

- this function loads results of a MC binning analysis from ALPS HDF5 result files

- Parameters:    
   - files (list) – ALPS result files which can be either XML or HDF5 files. XML file names will be changed to the corresponding HDF5 names.
   - what (list) – optional argument that is either a string or list of strings, specifying the names of the observables for which the binning analysis should be loaded
   - verbose (bool) – optional argument that if set to True causes more output to be printed as the data is loaded
   
- Returns:    
  a list of list of DataSet objects – loaded binning analysis. The elements of the outer list each correspond to the file names specified as input. The elements of the inner list are each for a different observable. The x-values of the DataSet objects are the logarithmic binning level and the y-values the error estimates at that binning level.

`pyalps.loadEigenstateMeasurements(files, what=None, verbose=False)`
loads ALPS eigenstate measurements from ALPS HDF5 result files

- this function loads results of ALPS diagonalization or DMRG simulations from an HDF5 file

- Parameters:    
   - files (list) – ALPS result files which can be either XML or HDF5 files. XML file names will be changed to the corresponding HDF5 names.
   - what (list) – an optional argument that is either a string or list of strings, specifying the names of the observables which should be loaded
   - verbose (bool) – an optional argument that if set to True causes more output to be printed as the data is loaded

- Returns:    
   list of list of (lists of) DataSet objects – loaded measurements. The elements of the outer list each correspond to the file names specified as input The elements of the next level are different quantum number sectors, if any exists The elements of the inner-most list are each for a different observable The y-values of the DataSet objects is an array of the measurements in all eigenstates calculated in this sector, and the x-values optionally the labels (indices) of array-valued measurements

`pyalps.loadSpectra(files, verbose=False)`
loads ALPS spectra from ALPS HDF5 result files

- This function loads the spectra calculated in ALPS diagonalization or DMRG simulations from an HDF5 file.

- Parameters:    
   - files (list) – ALPS result files which can be either XML or HDF5 files. XML file names will be changed to the corresponding HDF5 names.
   - verbose (bool) – optional argument that if set to True causes more output to be printed as the data is loaded.
- Returns:    
   list of (lists of) DataSet objects – Loaded spectra. The elements of the outer list each correspond to the file names specified as input. The elements of the next level are different quantum number sectors, if any exists. The y-values of the DataSet objects are the energies in that quantum number sector.

`pyalps.loadDMFTIterations(files, observable='G_tau', measurements='0', verbose=False)`
loads ALPS measurements from ALPS HDF5 result files

- this function loads results of ALPS simulations ALPS HDF5 result files

- Parameters:    
   - files (list) – ALPS HDF5 result files.
   - observable (str) – optional argument specifying the name of the observables which should be loaded
   - measurements (list) – optional argument that is either a string or list of strings, specifying the names of the measurements which should be loaded
   - verbose (bool) – optional argument that if set to True causes more output to be printed as the data is loaded
- Returns:    
   list of list of list of DataSet objects – loaded iteration measurements. The elements of the outer list each correspond to the file names specified as input. The elements of the next level are different iterations. The elements of the inner list contains a DataSet for each measurement. The y-values of the DataSet objects are the measurements and the x-values optionally the labels (indices) of array-valued measurements

`pyalps.loadProperties(files, proppath='/parameters', respath='/simulation/results', verbose=False)`
 loads properties (parameters) of simulations from ALPS HDF5 result files

- this function loads the properties (parameters) of ALPS simulations ALPS HDF5 result files

- Parameters:    
   - files (list) – ALPS result files which can be either XML or HDF5 files. XML file names will be changed to the corresponding HDF5 names.
   - verbose (bool) – optional argument that if set to True causes more output to be printed as the data is loaded
- Returns:    
   list of dicts – properties contained in each file.

`pyalps.loadObservableList(files, proppath='/parameters', respath='/simulation/results', verbose=False)`
loads lists of existing measurements from ALPS HDF5 result files

- The function returns a list of lists, containing the names of measurements that are stored in the result files

- Parameters:    
   - files (list) – ALPS result files which can be either XML or HDF5 files. XML file names will be changed to the corresponding HDF5 names.
   - verbose (bool) – optional argument that if set to True causes more output to be printed as the data is loaded
