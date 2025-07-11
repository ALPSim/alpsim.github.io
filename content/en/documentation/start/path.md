---
title: Setting the Path
description: "How to use ALPS"
weight: 3
---

## Setting the Path for Executables in Binary Installation

Once `pyalps` is successfully installed through the binary installation, we can start to use it by importing it into `python`. However, the system might not know the path to the `python` command. Here is an example of how to set the correct path in the `.bash_profile` file for a Mac system. For a Linux system, the corresponding file is `.bashrc`.

### Check your `python` installation directory with an `ls` command in your terminal.

It is usually installed in a directory like the following:

```
ls /Library/Frameworks/Python.framework/Versions/3.12
```

Within the `bin` directory, there are `python3` and `pip3`, as well as other binaries. To run the binaries from this folder with the usual `python` or `pip` commands from your terminal, we need to let the system know the path to the binaries and set aliases for the commands.

### Find or create a `.bash_profile` file.

- At your home directory, execute `ls -a`, or from any directory, excute `ls -a ~`.

- Edit or create `.bash_profile` with the `vim` editor:
`vi ~/.bash_profile`

- Switch to the editing mode by entering `i`.

- Add the following line for the binary path to the file:

`export PATH="$PATH:/Library/Frameworks/Python.framework/Versions/3.12/bin"`

- Add the following lines to create aliases for the commands:

`alias python="python3"`

`alias pip="pip3"`

- Save the changes to your file:
Press the `esc` key and enter `:x`. This will save your changes to the file and exit the `vim`.

### Tell the system your path and aliases for the binaries:
In your terminal, type `source ~/.bash_profile`.

You can now run any `Python` files. Your `pyalps` library is probably installed in the following directory:

`/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/site-packages` 

Use `ls` in the above or a similar directory to check if the package is correctly installed.

## Setting the Path for Executables in Source Installation
If you have done an ALPS source installation, the program executables are located at the /bin folder of your installed ALPS directory. The following path should be set in the .bash_profile for Mac or .bashrc for Linux systems.

`export PATH="$PATH:<your installed ALPS directory>/bin"`


