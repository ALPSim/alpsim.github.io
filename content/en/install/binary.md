
---
title: ALPS Installation on Mac/Linux from Binaries
description: "ALPS Binary Installation"
weight: 1
toc: true
cascade:
    type: docs
---

The prebuilt binary [`pyALPS`](https://pypi.org/project/pyalps/) can be installed on most Linux and macOS machines. `pyALPS` can be installed using pip Python package manager:

    pip install pyalps

Please make sure your version of Python is Python >= 3.9.

We recommend installing into a virtual environment, which needs no system privileges:

    python3 -m venv ~/alps-venv
    source ~/alps-venv/bin/activate
    pip install pyalps

On recent Debian/Ubuntu systems the system Python is marked `EXTERNALLY-MANAGED` (PEP 668), so a plain `pip install` outside a virtual environment is refused. If `python3 -m venv` then fails with `ensurepip is not available`, either install the `python3-venv` package (this needs `sudo`), or create the environment with a user-level tool such as [`uv`](https://docs.astral.sh/uv/) (`uv venv ~/alps-venv`, activate it as above, then `uv pip install pyalps`) or conda.
Note that the binary version of ALPS does not support parallel run of the codes. For a parallel version of ALPS, please use [source](../source) or [spack](../spack) installations.

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


