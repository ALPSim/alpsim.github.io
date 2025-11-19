
---
title: Run Applications
math: true
toc: true
weight: 1
---


`pyalps.writeParameterFile(fname, parms)`

- This function writes a text input file for simple ALPS applications like DMFT

- The arguments are:

  - filename: the name of the parameter file to be written 
  - parms: the parameter dict

`pyalps.writeInputFiles(fname, parms, baseseed=None)`

 - This function writes the XML input files for ALPS

 - Parameters are: 
     - fname: the base file name of the XML files that will be written 
     - parms: a list of dicts containing the simulation parameters 
     - baseseed: optional parameter giving a random number seed from which seeds for the individual simulations will be calculated. The default value is taken from the current time.

 - The function returns the name of the main XML input file


`pyalps.runApplication(appname, parmfiles, T=None, Tmin=None, Tmax=None, writexml=False, MPI=None, mpirun='mpirun')`
  run an ALPS application

- This function runs an ALPS application. 
- The parameers are:

    - appname: the name of the application parmfile: the name of the main XML input file writexml: optional parameter, to be set to True if all results should be written to the XML files in addition to the HDF5 files 
    - T: time limit of MC simulation 
    - Tmin: optional parameter specifying the minimum time between checks whether a MC simulatio is finished 
    - Tmax: optional parameter specifying the maximum time between checks whether a MC simulatio is finished 
    - MPI: optional parameter specifying the number of processes to be used in an MPI simulation. MPI is not used if this parameter is left at ots default value None. 
    - mpirun: optional parameter giving the name of the executable used to laucnh MPI applications. The default is ‘mpirun’

`pyalps.runDMFT(infiles, apppath='')`
  run the ALPS DMFT application

- The ALPS DMFT application does not (yet) use the standard ALPS input files and scheduler. Thus there is a separate function to call it. This function takes one mandatory parameter: a single input file or a list of input files. Optional parameter apppath allows setting the path to the binary.

`pyalps.evaluateLoop(infiles, appname='loop', write_xml=False)`
evaluate results of the looper QMC application

- this function calls the evaluate tool of the looper application. Additionally evaluated results are written back into the files. Besides a list of result files it takes one optional argument:

    - write_xml: if this optional argument is set to True, the results will also bw written to the XML files

`pyalps.evaluateSpinMC(infiles, appname='spinmc_evaluate', write_xml=False)`
evaluate results of the `spinmc` application

- this function calls the evaluate tool of the spinmc application. Additionally evaluated results are written back into the files. Besides a list of result files it takes one optional argument:

    - write_xml: if this optional argument is set to True, the results will also bw written to the XML files

`pyalps.evaluateQWL(infiles, appname='qwl_evaluate', DELTA_T=None, T_MIN=None, T_MAX=None)`
evaluate results of the quantum Wang-Landau application

- this function calls the evaluate tool of the quantum Wang-Landau application. Besides a list of result files it takes the following arguments: 
   - T_MIN: the lower end of the temperature range for which quantities are evaluated 
   - T_MAX: the upper end of the temperature range for which quantities are evaluated 
   - DELTA_T: the temperature steps to be used between T_MIN and T_MAX

- This function returns a list of lists of DataSet objects, for the various properties evaluated for each of the input files.

`pyalps.evaluateFulldiagVersusT(infiles, appname='fulldiag_evaluate', DELTA_T=None, T_MIN=None, T_MAX=None, H=None)`
evaluate results of the `fulldiag` application as a function of temperature

- this function calls the evaluate tool of the `fulldiag` application and evaluates several quantities as a function of temperature. Besides a list of result files it takes the following arguments: 
   - T_MIN: the lower end of the temperature range for which quantities are evaluated 
   - T_MAX: the upper end of the temperature range for which quantities are evaluated 
   - DELTA_T: the temperature steps to be used between T_MIN and T_MAX 
   - H: (optional) the magnetic field at which all data should be evaluated

- This function returns a list of lists of DataSet objects, for the various properties evaluated for each of the input files.

`pyalps.evaluateFulldiagVersusH(infiles, appname='fulldiag_evaluate', DELTA_H=None, H_MIN=None, H_MAX=None, T=None)`
evaluate results of the `fulldiag` application as a function of magnetic field h

- this function calls the evaluate tool of the fulldiag application and evaluates several quantities as a function of magnetic field. Besides a list of result files it takes the following arguments: 
   - H_MIN: the lower end of the field range for which quantities are evaluated 
   - H_MAX: the upper end of the temperature range for which quantities are evaluated 
   - DELTA_H: the field steps to be used between H_MIN and H_MAX 
   - T: the temperature field at which all data should be evaluated

- This function returns a list of lists of DataSet objects, for the various properties evaluated for each of the input files.

