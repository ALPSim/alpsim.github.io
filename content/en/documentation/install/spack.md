
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

### Troubleshooting
<details>
<summary><strong> Boost </strong> </summary>

In the Spack boost package, the default value of its variant "cxxstd" is "11", which is inconsistent with ALPS requirement of "14" for c++ standard. You can edit this default value in ```package.py``` at the following location:
```
~/.spack/package_repos/fncqgg4/repos/spack_repo/builtin/packages/boost/package.py
```
Alternatively, without changing the package default value, you can set the variant value at the command line:
```
spack install alps ^boost@1.87.0 cxxstd=14
```
This will also compile the boost library with the c++14 standard. 

</details>




