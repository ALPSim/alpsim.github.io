
---
title: ALPS Installation on Mac/Linux from Binaries
description: "ALPS Binary Installation"
weight: 1
toc: true
cascade:
    type: docs
---

The prebuilt binary [`pyALPS`](https://pypi.org/project/pyalps/) can be installed on most Linux and MacOS machines. `pyALPS` can be installed using pip Python package manager:

    pip install pyalps

Please make sure your version of Python is Python >= 3.10.

If `pip install` is refused with `externally-managed-environment` (recent Debian/Ubuntu), install into a virtual environment: `python3 -m venv ~/alps-venv && source ~/alps-venv/bin/activate && pip install pyalps`. If `venv` itself is missing, install `python3-venv` or use [`uv`](https://docs.astral.sh/uv/).

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


