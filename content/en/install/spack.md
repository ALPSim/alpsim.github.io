
---
title: ALPS Installation on Mac/Linux from Spack Packages
description: "ALPS Spack Installation"
weight: 3
toc: true
cascade:
    type: docs
---

### Spack Installation
If you plan to use a parallel version of ALPS or run ALPS in a supercomputer environment, besides the [source installation](../source) you can also install it through the [Spack package management tool](https://packages.spack.io). You are encouraged to check out the details about [ALPS package in Spack](https://packages.spack.io/package.html?name=alps) and the [Spack documentation](https://spack.readthedocs.io/en/latest/index.html).

Spack is able to determine the ALPS dependencies and will install the correct versions required by ALPS. The installation is also local to each user in their own home directory, so it does not affect other users in the same computer cluster. 

### Installation Steps

First, Spack needs to be cloned from the GitHub repository: 
```
git clone --depth=2 https://github.com/spack/spack.git
```
This creates a directory called ```spack```. You can source the appropriate script for your shell. 

For bash, zsh, and sh users:
```
. spack/share/spack/setup-env.sh
```
For csh and tcsh users:
```
source spack/share/spack/setup-env.csh
```

Next, Spack needs to find all available compilers in your computer:
```
spack compiler find
```
This command will enable Spack to detect all available compilers in the system and create a file `packages.yaml` under the hidden `.spack` directory in your home directory. It can be viewed/edited with the command:
```
spack config edit packages
```
Alternatively, you can view the available compilers through:
```
spack compilers
```
The minimum compiler versions required are `gcc@10.5.0` and `clang@13.0.1`.

We can take a look at ALPS information page in Spack:
```
spack info alps
```
It shows the package dependencies of ALPS. All the related packages will be automatically installed through Spack's package management system.

Finally, let us install ALPS!
```
spack install alps
```
To use ALPS, we need to load the package:
```
spack load alps
```

### Spack Installation on Supercomputer Clusters
If you need to install ALPS on a supercomputer cluster, we recommend submitting a batch job to install ALPS through a job node instead of running the above commands on a login node. Since the installation sometimes takes a long time, using login node to install ALPS could affect other users of the cluster. 

We have successfully installed ALPS on the following supercomputer clusters: [NCSA Delta (Illinois)](https://docs.ncsa.illinois.edu/systems/delta/en/latest/index.html), [PSC Bridges (Pittsburgh)](https://www.psc.edu/resources/bridges-2/user-guide/), [Purdue Anvil](https://www.rcac.purdue.edu/anvil#docs), [SDSC Expanse (San Diego)](https://www.sdsc.edu/systems/expanse/user_guide.html), [TACC Stampede3 (Texas)](https://docs.tacc.utexas.edu/hpc/stampede3/). Please read their documentation about how to submit a batch job. 

### Troubleshooting

<details>
<summary><strong><code>spack: command not found</code>, or Spack only works inside the <code>spack</code> directory</strong></summary>

Spack's shell setup script has to be sourced in every new terminal session, using the path to your `spack` directory:
```
. /path/to/spack/share/spack/setup-env.sh
```
To make this permanent, add that line to your shell startup file (e.g. `~/.zshrc` or `~/.bashrc`).

</details>

<details>
<summary><strong>Choosing the Python interpreter used by Spack</strong></summary>

Spack uses the first `python3` (or `python`) it finds on your `PATH`. To use a different interpreter, set the `SPACK_PYTHON` environment variable (Spack ignores the `PYTHON` variable):
```
export SPACK_PYTHON=/path/to/python3
. spack/share/spack/setup-env.sh
spack python -c "import sys; print(sys.executable)"
```
The last command prints the interpreter that Spack is actually using.

</details>

<details>
<summary><strong><code>SSL: CERTIFICATE_VERIFY_FAILED</code> on macOS</strong></summary>

If every download fails with an error like
```
[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate
```
Spack is most likely running under a Python installed from [python.org](https://www.python.org) (located under `/Library/Frameworks/Python.framework/`). This Python does not use the macOS system certificates, so its certificate bundle must be installed once for each Python version:
```
"/Applications/Python 3.x/Install Certificates.command"
```
Replace `3.x` with your Python version (e.g. `3.14`). Alternatively, tell Spack to use Apple's system Python, which uses the macOS certificate store:
```
export SPACK_PYTHON=/usr/bin/python3
```

</details>

<details>
<summary><strong><code>AttributeError: module 'os' has no attribute 'O_PATH'</code></strong></summary>

`os.O_PATH` only exists on Linux. Spack development checkouts from May 2026 used it unconditionally ([spack/spack#52334](https://github.com/spack/spack/pull/52334)); this was fixed in [spack/spack#52447](https://github.com/spack/spack/pull/52447).

- **On macOS:** switching the Python interpreter does not fix this error. Update Spack to v1.2.0 or later (run `git pull`, or `git checkout v1.2.2`, inside the `spack` directory).
- **On Linux:** update your Spack checkout (run `git pull` inside the `spack` directory), or run Spack with a different Python interpreter via `SPACK_PYTHON` (see above).

</details>

If your problem is not listed here, please search or open an issue on [GitHub](https://github.com/ALPSim/ALPS/issues).

## Walkthrough Video

### Spack Installation of ALPS (v2.3.3) in WSL.
<br>

{{< youtube id="TD7PuiJKq5U" >}}

### Spack Installation of ALPS (v2.3.4) in WSL.
<br>

{{< youtube id="CJmRIpAi02g" >}}

### Spack Installation of ALPS (v2.3.4) on a Supercomputer Cluster.
<br>

{{< youtube id="yTn7ubU4bqE" >}}

