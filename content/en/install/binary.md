
---
title: ALPS Installation on Mac/Linux from Binaries
description: "ALPS Binary Installation"
weight: 1
toc: true
cascade:
    type: docs
---

The prebuilt binary [`pyALPS`](https://pypi.org/project/pyalps/) can be installed on most Linux and macOS machines with Python 3.10 or newer. We recommend installing it in a virtual environment; some systems, for example recent Ubuntu releases, do not allow `pip install` into the system Python:

    python3 -m venv alps-env
    . alps-env/bin/activate
    python -m pip install pyalps

Activate the environment (`. alps-env/bin/activate`) in every new terminal before using ALPS.

Note that the binary version of ALPS does not support parallel run of the codes. For a parallel version of ALPS, please use [source](../source) or [spack](../spack) installations.

### Command-line programs

Besides the Python package, `pip install pyalps` installs shell commands for the ALPS applications (`spinmc`, `loop`, `worm`, `dirloop_sse`, `qwl`, `sparsediag`, `fulldiag`, `dmrg`, `dmft`, …), for `spinmc_evaluate`, `worm_evaluate`, `fulldiag_evaluate` and `qwl_evaluate`, and for the tools `parameter2xml` and `printgraph`. The command-line tutorials therefore work in an activated environment, for example:

    parameter2xml parm1a
    spinmc --Tmin 10 --write-xml parm1a.in.xml

These commands are installed by pyalps releases newer than 3.0.0. With pyalps 3.0.0, use the Python version of the tutorials, or upgrade with `python -m pip install --upgrade pyalps`.

The binary package does **not** include:

- the conversion and plotting tools `convert2text`, `convert2xml`, `plot2text`, `plot2xmgr` and `plot2gp`, nor `dirloop_sse_evaluate`. Use the Python version of the tutorials instead, or a [source](../source) or [spack](../spack) installation;
- the tutorial directories. Download the parameter files from the tutorial pages, or take them from the [`tutorials`](https://github.com/ALPSim/ALPS/tree/master/tutorials) folder of the ALPS repository.

## Walkthrough Video

For Windows computers one can either first install a Linux subsystem and then install ALPS or install ALPS in a virtual box environment.

### Installation of Windows Subsystem for Linux (WSL).
<br>

{{< youtube id="hEYWDLJmNpc" >}}

### Installation of ALPS in WSL.
<br>

{{< youtube id="FevhLNcQCHY" >}}

### Installation of ALPS in a virtual box environment for Windows.
<br>

{{< youtube id="Te6IApFjHJs" >}}


