
---
title: DWA-03 Time of Flight Images
math: true
toc: true
weight: 3
---

As a third example of the directed worm algorithm QMC code, we shall study the time-of-flight images of an optical lattice in an harmonic trap.

## Preparing and running the simulation from Python

    import pyalps
    import pyalps.dwa

    parms = [
    {
        'LATTICE' : 'inhomogeneous simple cubic lattice' ,
        'L'       : 120 ,

        'MODEL'   : 'boson Hubbard' ,
        'Nmax'    : 20 ,

        't'  : 1. ,
        'U'  : 8.11 ,
        'mu' : '4.05 - (0.0073752*(x-(L-1)/2.)*(x-(L-1)/2.) + 0.0036849*(y-(L-1)/2.)*(y-(L-1)/2.) + 0.0039068155*(z-(L-1)/2.)*(z-(L-1)/2.))' ,

        'T'  : 1. ,

        'THERMALIZATION' : 1500 ,
        'SWEEPS'         : 60000 ,
        'SKIP'           : 50 , 

        'tof_phase'    : pyalps.dwa.tofPhase(time_of_flight=15.5, wavelength=[765,843,843], mass=86.99) ,

        'MEASURE[Green Function]': 1
    }
    ]

    input_file = pyalps.writeInputFiles('parm3a', parms)
    res = pyalps.runApplication('dwa', input_file)

## Evaluating the simulation and preparing plots using Python

We load the results for the Green function from all output files starting with `parm3a`.

    import pyalps
    data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm3a'), 'Green Function');

To visualize the Green function:

    import pyalps.plot as aplt;
    aplt.plot3D(data, layer=0)
    q_x = q_x[0:q_x.shape[0]:mag, 0:q_x.shape[1]:mag];
    q_y = q_y[0:q_y.shape[0]:mag, 0:q_y.shape[1]:mag];
    tof_image = tof_image[1:tof_image.shape[0]:mag, 0:tof_image.shape[1]:mag] * mag * mag
    tof_image[tof_image < 0] = 0
