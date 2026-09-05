# ALPS 2.3.x — assisted source install

**Audience:** a CLI coding agent (Claude Code or similar) driving an ALPS source install.
Step 0 asks whether the user has root; everything after that branches on the answer.

**Provenance.** Two paths have been performed end to end on real hardware, both on Rocky
Linux 8 and both reaching 162/162 `ctest`: distro packages unpacked into a prefix, and a
micromamba environment. The Ubuntu, macOS and cluster sections are reasoned from those runs
and have not been executed as written.

---

## Rules for the agent

1. **Ask about root first (Step 0), then honor the answer.** If the user has no root, never
   run or suggest `sudo` — a step that seems to need it wants a different route, not
   escalation. Note that `dnf download` / `apt-get download` need **no root**; only
   `install` does.
2. **Probe before advising.** Run Step 1 in full, show the user the report, let them correct
   it. Do not ask what OS or compiler they have.
3. **Stop at every ☐ CONFIRM.**
4. **Check compatibility, not presence.** See the requirements table — several tools pass
   `command -v` and still break the build.
5. **Where this document says DO NOT "FIX" THIS, the surprising thing is deliberate.**
   A cleanup will break the build.
6. **One prefix pair.** `$DEPS_PREFIX` for dependencies, `$ALPS_PREFIX` for ALPS. Ask once.
7. Report honestly. On failure, show the error and stop; do not continue to the next step.

---

## The rule that drives the route choice

A conda/micromamba environment ships and pins **its own** Python and numpy. ALPS compiles
`Boost.Python` and the `pyalps` C-extensions against whatever interpreter CMake selects, so
the built `pyalps` is welded to that exact Python + numpy ABI. Anyone who later re-resolves
the environment even slightly differently gets `undefined symbol` / numpy-ABI errors at
`import pyalps`.

Distro packages pin nothing — the versions are whatever the OS ships, identical for everyone,
and change only on OS upgrade.

**Therefore prefer distro packages unpacked into a prefix over an environment.** An
environment remains correct when there is no usable package source, or when the system
compiler and Python are too old.

---

## Requirements

These are the things you **fetch**. CMake, `make`, `git` and `curl` are not on this
list: they come from the system and a stock install already has them (Rocky 8's CMake 3.26
is fine). The probe reports them under the host survey, not here.

| Dependency | Requirement | Failure that still passes a naive check |
|---|---|---|
| C++ compiler | GCC ≥ 10.5.0 or Clang ≥ 13.0.1 | Rocky 8 ships GCC 8.5; Ubuntu 20.04 ships GCC 9 |
| Python | ≥ 3.9 **with headers**, + numpy, scipy | System `python3` may be 3.6.8; a *system* 3.11 may still have no `Python.h` on its `sysconfig` include path |
| HDF5 | **≥ 1.14** (not 1.10) | EPEL/distro HDF5 1.10.5 builds fine, then fails 8 tests on ALPS's teardown check |
| BLAS/LAPACK | OpenBLAS ≥ 0.3 | — |
| MPI | OpenMPI ≥ 4.0 or MPICH ≥ 4.0 | On RHEL-family, installed but **not on `PATH`** until `module load mpi/openmpi-x86_64` |
| Boost | 1.87, **fetched/built by ALPS** | A present system Boost gets picked up and breaks the build |
| Fortran | **not required** | `ALPS_BUILD_FORTRAN` defaults OFF. Only needed if *you* build OpenBLAS from source |

---

## Step 0 — Ask about root

Ask the user, and do not guess:

> **Do you have `sudo` on this machine?**
> * **Yes** — I will install the dependencies with your system package manager.
> * **No / not sure / it is a shared machine or cluster** — I will put everything under your
>   home directory instead.

Do not probe for this by running `sudo`: on many systems that prompts for a password, logs a
failure, or emails an administrator. If the user is unsure, treat the answer as **no** — the
rootless routes work on a machine that has root, but not the other way round.

Record the answer, then run the probe below either way: it is what picks the route *within*
each branch.

---

## Step 1 — Probe

Read-only. Installs nothing, writes nothing. Keep the output — it is also the right thing to
paste into a bug report.

```bash
#!/usr/bin/env bash
ok(){ printf '  %-24s %s\n' "$1" "$2"; }
vge(){ [ "$(printf '%s\n%s\n' "$2" "$1" | sort -V | head -1)" = "$2" ]; }

echo "== SYSTEM =="
ok "uname" "$(uname -s) $(uname -m)"
[ -r /etc/os-release ] && { . /etc/os-release; ok "distro" "$NAME $VERSION_ID"; }
[ "$(uname -s)" = Darwin ] && ok "macOS" "$(sw_vers -productVersion)"

echo "== DANGEROUS ENV ALREADY SET =="
[ -n "$PYTHONHOME" ] && ok "PYTHONHOME" "SET ($PYTHONHOME) -- MUST be unset, breaks dnf" \
                     || ok "PYTHONHOME" "unset  OK"
[ -n "$CONDA_PREFIX" ] && ok "CONDA_PREFIX" "ACTIVE ($CONDA_PREFIX)" || ok "CONDA_PREFIX" "none"

echo "== PACKAGE SOURCE (download only; never install) =="
for m in dnf apt-get brew port; do command -v $m >/dev/null && ok "$m" "$(command -v $m)"; done
command -v rpm2cpio >/dev/null && ok "rpm2cpio" "yes" || ok "rpm2cpio" "absent"
command -v cpio     >/dev/null && ok "cpio"     "yes" || ok "cpio"     "absent"
command -v dpkg-deb >/dev/null && ok "dpkg-deb" "yes" || ok "dpkg-deb" "absent"
command -v dnf >/dev/null && ok "repos" "$(dnf repolist 2>/dev/null | awk 'NR>1{printf "%s ",$1}')"

echo "== COMPILER =="
if command -v gcc >/dev/null; then
  GV=$(gcc -dumpfullversion 2>/dev/null || gcc -dumpversion 2>/dev/null)
  vge "$GV" 10.5.0 && ok "system gcc" "$GV  OK" || ok "system gcc" "$GV  TOO OLD (need >= 10.5)"
else ok "system gcc" "absent"; fi
if command -v clang >/dev/null; then
  CV=$(clang --version | sed -n '1s/.*version \([0-9.]*\).*/\1/p')
  vge "$CV" 13.0.1 && ok "clang" "$CV  OK" || ok "clang" "$CV  too old"
fi
# RHEL toolsets: 11-13 are frequently hollow metapackages
if [ -d /opt/rh ]; then
  for t in /opt/rh/gcc-toolset-*; do [ -e "$t" ] || continue
    if [ -x "$t/root/usr/bin/g++" ]; then
      ok "$(basename $t)" "REAL ($("$t/root/usr/bin/gcc" -dumpfullversion 2>/dev/null))"
    else ok "$(basename $t)" "STUB - no g++"; fi
  done
fi
# Predicts whether -static-libstdc++ will be mandatory
if [ -e /lib64/libstdc++.so.6 ]; then
  ok "system GLIBCXX max" "$(strings /lib64/libstdc++.so.6 | grep -o 'GLIBCXX_[0-9.]*' | sort -V | tail -1)"
  ok "  note" "if you build with a gcc-toolset newer than this, static-libstdc++ is REQUIRED"
fi

echo "== HOST TOOLS (from the system; not fetched) =="
if command -v cmake >/dev/null; then
  KV=$(cmake --version | head -1 | awk '{print $3}')
  vge "$KV" 3.18 && ok "cmake" "$KV  OK" || ok "cmake" "$KV  too old (need >= 3.18)"
else ok "cmake" "absent"; fi
for t in make git curl; do command -v $t >/dev/null && ok "$t" yes || ok "$t" absent; done

echo "== PYTHON =="
for PY in python3 python3.11 python3.12; do
  command -v $PY >/dev/null || continue
  V=$($PY -c 'import sys;print("%d.%d.%d"%sys.version_info[:3])' 2>/dev/null)
  H=$($PY -c 'import sysconfig,os;p=sysconfig.get_paths()["include"];print(p if os.path.exists(p+"/Python.h") else "NO Python.h at "+p)' 2>/dev/null)
  ok "$PY" "$V  [$(command -v $PY)]"
  ok "  headers" "$H"
  ok "  numpy/scipy" "$($PY -c 'import numpy,scipy;print(numpy.__version__,scipy.__version__)' 2>/dev/null || echo absent)"
done

echo "== LIBRARIES =="
if command -v h5cc >/dev/null; then
  HV=$(h5cc -showconfig 2>/dev/null | sed -n 's/.*HDF5 Version: *//p' | head -1)
  vge "$HV" 1.14.0 && ok "hdf5" "$HV  OK" || ok "hdf5" "$HV  TOO OLD (need >= 1.14; 1.10 fails 8 tests)"
else ok "hdf5" "not on PATH"; fi
command -v ldconfig >/dev/null && { ldconfig -p 2>/dev/null | grep -q openblas \
  && ok "openblas" "present" || ok "openblas" "not found"; }

echo "== MPI =="
command -v mpicc  >/dev/null && ok "mpicc"  "$(command -v mpicc)"  || ok "mpicc"  "not on PATH"
command -v mpirun >/dev/null && ok "mpirun" "$(mpirun --version 2>&1|head -1)" || ok "mpirun" "not on PATH"
[ -d /usr/lib64/openmpi ] && ! command -v mpicc >/dev/null && \
  ok "note" "OpenMPI present but needs: module load mpi/openmpi-x86_64"

echo "== MODULES =="
if command -v module >/dev/null 2>&1 || [ -r /etc/profile.d/modules.sh ]; then
  ok "module" "available"; ( . /etc/profile.d/modules.sh 2>/dev/null; module avail 2>&1 | head -25 )
else ok "module" "absent"; fi

echo "== SYSTEM BOOST (must NOT be used) =="
for d in /usr/include/boost /usr/local/include/boost /opt/homebrew/include/boost; do
  [ -d "$d" ] && ok "system boost" "$d  <- keep CMake away from this"
done

echo "== SPACE / NETWORK =="
[ -w "$HOME" ] && ok "\$HOME writable" yes || ok "\$HOME writable" NO
ok "free in \$HOME" "$(df -h "$HOME" | awk 'NR==2{print $4}')"
curl -sSI --max-time 8 https://github.com >/dev/null 2>&1 \
  && ok "outbound https" reachable || ok "outbound https" "blocked/slow"
```

---

## Step 2 — Pick the path

**If the user answered yes to Step 0**, install the dependencies with the system package
manager and skip to Step 7 — the package lists are on the ALPS website under each system's
*With root access*.

**If the user answered no**, go to the section for the user's system:

| System | Section |
|---|---|
| Ubuntu / Debian / WSL | Step 3 |
| Rocky Linux / RHEL / AlmaLinux | Step 4 |
| macOS | Step 5 |
| HPC cluster with environment modules | Step 6 |

The toolchain is **one unit** (compiler + Python + their C++ runtime) because of the
`libstdc++` ABI. Libraries may be mixed. Within a system, prefer distro packages unpacked into
a prefix over an environment, for the reason in *The rule that drives the route choice* above.

Keep MPI on a site module whenever one exists — a generic MPI built elsewhere falls back to
TCP and loses the cluster interconnect.

☐ **CONFIRM before continuing:** the section you picked and the probe lines that decided it;
`$DEPS_PREFIX` and `$ALPS_PREFIX` (defaults `$HOME/opt/deps`, `$HOME/opt/alps`); disk cost
(build tree ~1.6 GB, deletable; install ~61 MB; an environment adds ~2–3 GB); build time
20–60 min.

---

## Step 3 — Ubuntu / Debian / WSL

Use the system compiler and Python if the probe cleared them (Ubuntu 22.04 and later
generally do). Otherwise use an environment.

### Extracting `.deb` packages

```bash
mkdir -p "$HOME/debs" "$DEPS_PREFIX" && cd "$HOME/debs"
apt-get download libhdf5-dev libhdf5-103 libopenblas-dev libopenblas0-pthread libgfortran5
for f in *.deb; do dpkg-deb -x "$f" "$DEPS_PREFIX"; done
```

Same caveats as Step 4: build HDF5 ≥ 1.14 and OpenMPI from source rather than unpacking them.
Some packages hardcode `/usr` in their `.pc`/CMake files and need hand-patching.

---

### Using micromamba

```bash
mkdir -p "$HOME/bin" "$HOME/src" && cd "$HOME/bin"
curl -L -o micromamba \
  https://github.com/mamba-org/micromamba-releases/releases/latest/download/micromamba-linux-64
chmod +x micromamba
export MAMBA_ROOT_PREFIX=$HOME/micromamba
$HOME/bin/micromamba create -y -n alps -c conda-forge \
    gcc_linux-64=12 gxx_linux-64=12 gfortran_linux-64=12 \
    cmake make hdf5 openblas openmpi python=3.11 numpy scipy
$HOME/bin/micromamba install -y -n alps -c conda-forge 'cmake>=3.24,<4'   # conda-forge gives 4.x first
```

The `<4` pin is an **environment problem only**: conda-forge resolves CMake 4.x, which removed
the pre-3.5 policies the Boost super-build still declares. A system CMake (Rocky 8 ships
3.26) needs no pin.

macOS: `clang_osx-arm64 clangxx_osx-arm64 gfortran_osx-arm64` (or `osx-64`), and the
`osx-arm64` micromamba URL.

---

## Step 4 — Rocky Linux / RHEL / AlmaLinux

### Dependencies from distro packages

```bash
export DEPS_PREFIX=$HOME/opt/deps
export ALPS_PREFIX=$HOME/opt/alps
mkdir -p "$DEPS_PREFIX" "$HOME/opt/deps-rpms" "$HOME/opt/deps-stage" "$HOME/src"
source /opt/rh/gcc-toolset-14/enable      # if using a toolset; re-source in EVERY build shell
export CC=gcc CXX=g++

cd "$HOME/opt/deps-rpms"
dnf download openblas openblas-devel \
             python3.11 python3.11-libs python3.11-devel \
             python3.11-numpy python3.11-scipy

cd "$HOME/opt/deps-stage"
for r in "$HOME"/opt/deps-rpms/*.rpm; do rpm2cpio "$r" | cpio -idmu --quiet; done
cp -a usr/. "$DEPS_PREFIX/"
```

**DO NOT "FIX" THIS:**

* **Do not add `hdf5`/`hdf5-devel`.** The distro build is 1.10.5 — too old; it trips ALPS's
  HDF5 teardown check and fails 8 tests. Build HDF5 from source (Step 4).
* **Do not add `openmpi`.** The RPM pulls `hwloc`, `pmix`, `ucx`, `libfabric`, `munge`, none
  of which are present on a stock system; you get
  `mpicc: error while loading shared libraries: libhwloc.so.15`. Build it (Step 5).
* **`--resolve` is optional** and drags in dozens of `.i686` packages. OpenBLAS needs only
  `libgfortran`/`libquadmath`, normally already present. Verify:
  `ldd "$DEPS_PREFIX"/lib64/libopenblas.so.0 | grep 'not found'` → no output.
* **`python3.11-libs` and `python3.11-devel` are unpacked on purpose** — that is what makes
  `$DEPS_PREFIX/bin/python3.11` a complete, self-contained interpreter.
* `libpython3.11.so.1.0` under `$DEPS_PREFIX/lib64` must be a **real file**, not a symlink
  dangling into `/usr`. If `cp -a` left a broken link, copy the real `.so.1.0` over it.

### The Python interpreter — NO `PYTHONHOME`

**Never export `PYTHONHOME`.** It is a global override: it forces *every* Python in the shell
— including the system 3.6 that `dnf`/`yum` are hard-wired to — to look for its stdlib in
`$DEPS_PREFIX`, and `dnf` dies with `No module named 'encodings'`.

You do not need it. Run the unpacked interpreter **by its own path** and it self-locates:

```bash
"$DEPS_PREFIX/bin/python3.11" -c "import sys,sysconfig,numpy,scipy
print(sys.prefix)                      # -> $DEPS_PREFIX
print(sysconfig.get_path('include'))   # -> $DEPS_PREFIX/include/python3.11 (has Python.h)
print(numpy.__version__, scipy.__version__)"
```

The **system** `/usr/bin/python3.11` does *not* self-locate — it answers `/usr/include/python3.11`,
which has no `Python.h`, and the pyalps extensions then fail to compile.

### HDF5 from source (≥ 1.14)

```bash
cd "$HOME/src"
curl -LO https://support.hdfgroup.org/releases/hdf5/v1_14/v1_14_6/downloads/hdf5-1.14.6.tar.gz
tar xf hdf5-1.14.6.tar.gz && cd hdf5-1.14.6
./configure --prefix="$DEPS_PREFIX" --enable-cxx --enable-hl \
            --disable-fortran --disable-tests --disable-tools CC=gcc CXX=g++
make -j8 && make install
```

Autotools installs to `$DEPS_PREFIX/**lib**` (soname `libhdf5.so.310`), *not* `lib64` —
`LD_LIBRARY_PATH` must include it. To change HDF5 later, reconfigure ALPS with
`-U 'HDF5_*' -DHDF5_ROOT=$DEPS_PREFIX`.

### OpenMPI from source *(skip if a site module provides MPI)*

```bash
cd "$HOME/src"
curl -LO https://download.open-mpi.org/release/open-mpi/v4.1/openmpi-4.1.6.tar.bz2
tar xf openmpi-4.1.6.tar.bz2 && cd openmpi-4.1.6
./configure --prefix="$DEPS_PREFIX/openmpi" --enable-mpi-cxx \
            --disable-mpi-fortran --without-verbs --without-ucx --without-libfabric \
            CC=gcc CXX=g++
make -j8 && make install
"$DEPS_PREFIX/openmpi/bin/mpirun" --version
```

`--without-verbs/ucx/libfabric` keeps it self-contained (tcp/sm BTL) — right for a
workstation, wrong for a cluster, where you should use the site module instead.

---

## Step 5 — macOS

Homebrew writes to `/opt/homebrew` (Apple Silicon) or `/usr/local` (Intel), both owned by the
user, so no step here needs root. Only the Xcode Command Line Tools use a GUI installer.

```bash
xcode-select --install
brew install hdf5 open-mpi openblas git python@3.11
```

A Python virtual environment is the tested way to supply `numpy` and `scipy` here — Homebrew's
Pythons are marked externally managed, and Homebrew's `numpy` formula is built for Homebrew's
default Python rather than the one you pin:

```bash
python3.11 -m venv "$HOME/alps-venv"
source "$HOME/alps-venv/bin/activate"
pip install numpy scipy
```

Pass that interpreter to CMake in Step 7 and keep the venv active when running ALPS.

> **A conda environment on macOS has a known Boost/Python ABI problem** — an ALPS build made
> that way segfaulted at run time. Prefer the venv.

> **macOS specifics.** Shared libraries are `.dylib`, not `.so`, and the runtime search path
> variable is `DYLD_FALLBACK_LIBRARY_PATH`, not `LD_LIBRARY_PATH`. Do not mix `arm64` and
> `x86_64` (Rosetta) toolchains in one build.

---

## Step 6 — HPC cluster (environment modules)

The site provides the libraries, so there is nothing to install.

```bash
module avail
module load gcc/12 hdf5 openmpi openblas   # names vary by site
```

Confirm the loaded compiler meets the 10.5.0 minimum and that `mpicc`, `mpirun` and the HDF5
headers are on the path. If a module supplies HDF5 in a non-standard location, note
`$HDF5_DIR` and pass it in Step 7.

---

## Step 7 — Boost, then configure ALPS

Pre-place Boost to avoid a re-download (CMake otherwise fetches it, ~130 MB, 1–3 min of
silence during configure):

```bash
cd "$HOME/src"
curl -LO https://archives.boost.io/release/1.87.0/source/boost_1_87_0.tar.gz
tar xf boost_1_87_0.tar.gz
git clone https://github.com/alpsim/ALPS alps-src
```

```bash
cmake -S alps-src -B alps-build \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_INSTALL_PREFIX="$ALPS_PREFIX" \
  -DCMAKE_C_COMPILER=gcc -DCMAKE_CXX_COMPILER=g++ \
  -DCMAKE_PREFIX_PATH="$DEPS_PREFIX;$DEPS_PREFIX/openmpi" \
  -DHDF5_ROOT="$DEPS_PREFIX" \
  -DBLA_VENDOR=OpenBLAS \
  -DBLAS_LIBRARIES="$DEPS_PREFIX/lib64/libopenblas.so" \
  -DLAPACK_LIBRARIES="$DEPS_PREFIX/lib64/libopenblas.so" \
  -DMPI_C_COMPILER="$DEPS_PREFIX/openmpi/bin/mpicc" \
  -DMPI_CXX_COMPILER="$DEPS_PREFIX/openmpi/bin/mpicxx" \
  -DPython_EXECUTABLE="$DEPS_PREFIX/bin/python3.11" \
  -DPython_INCLUDE_DIR="$DEPS_PREFIX/include/python3.11" \
  -DPython_LIBRARY="$DEPS_PREFIX/lib64/libpython3.11.so.1.0" \
  -DBoost_SRC_DIR="$HOME/src/boost_1_87_0" \
  -DCMAKE_CXX_FLAGS="-DBOOST_NO_AUTO_PTR -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF" \
  -DCMAKE_SHARED_LINKER_FLAGS="-static-libstdc++ -static-libgcc" \
  -DCMAKE_EXE_LINKER_FLAGS="-static-libstdc++ -static-libgcc" \
  -DCMAKE_MODULE_LINKER_FLAGS="-static-libstdc++ -static-libgcc"
```

Why the non-obvious flags exist:

* **`Python_`, not `Python3_`.** ALPS calls `find_package(Python)` (unversioned).
  **`-DPython3_EXECUTABLE` is silently ignored** — it looks like it worked and does nothing.
* **`-DPython_EXECUTABLE` must be the *unpacked* interpreter.** ALPS's
  `cmake/FindPythonMod.cmake` derives the include dir by running
  `sysconfig.get_path('include')` on the chosen interpreter; only the unpacked one answers
  `$DEPS_PREFIX/include/python3.11`.
* **The three `*_LINKER_FLAGS`.** A gcc-toolset emits code needing `GLIBCXX_3.4.29`, while a
  Rocky 8 system `/lib64/libstdc++.so.6` provides only up to `3.4.25`. Without static
  linking the build *succeeds* and then **153/162 tests fail** at load with
  `version 'GLIBCXX_3.4.29' not found`. gcc-toolset ships no standalone newer
  `libstdc++.so.6`, so static is the fix — and it also makes the install run on a bare box
  with no `/opt/rh` on the path.
* **BLAS and LAPACK both point at the one OpenBLAS `.so`** — OpenBLAS bundles LAPACK.
* **Do not add `-DALPS_BUILD_FORTRAN=ON`.** Fortran is off by default and nothing needs it.

Read the configure summary back to the user before building — every line must resolve to the
prefix, not `/usr`:

```
-- The CXX compiler identification is GNU 14.x
-- Found Python: .../opt/deps/bin/python3.11 (found version "3.11.13")
-- PYTHON_INCLUDE_DIRS = .../opt/deps/include/python3.11        (NOT /usr/include)
-- Found MPI_CXX: .../opt/deps/openmpi/lib/libmpi_cxx.so
-- Found HDF5: .../opt/deps/lib/libhdf5.so (found version "1.14.6")
-- Found LAPACK: .../opt/deps/lib64/libopenblas.so
```

## Step 8 — Build, test, install

```bash
cmake --build alps-build -j8      # NOT -j$(nproc): ~1 GB RAM per translation unit
ctest --test-dir alps-build -j4   # expect 162/162
cmake --install alps-build
```

* `GLIBCXX_3.4.29 not found` on ~153 tests → the static-libstdc++ flags are missing.
  Reconfigure with them; only a relink is needed.
* 8 failures, `Not all resources closed in file '*.h5'` → HDF5 < 1.14. Redo Step 4 and
  reconfigure with `-U 'HDF5_*' -DHDF5_ROOT=$DEPS_PREFIX`.

## Step 9 — Make it runnable with no environment

The installed binaries carry an `$ORIGIN`-relative RUNPATH and a static C++ runtime, so
nothing needs sourcing to *run* ALPS. Two touches finish the job:

```bash
# let `import pyalps` work with no PYTHONPATH
echo "$ALPS_PREFIX/lib/python3.11/site-packages" \
    > "$DEPS_PREFIX/lib64/python3.11/site-packages/alps.pth"

ln -sf python3.11 "$DEPS_PREFIX/bin/python3"
ln -sf python3.11 "$DEPS_PREFIX/bin/python"

# the only line needed in ~/.bashrc
export PATH="$DEPS_PREFIX/bin:$ALPS_PREFIX/bin:$PATH"
```

A build-environment script (`gcc-toolset` activation, `Boost_SRC_DIR`, …) is needed **only for
rebuilding**, not for running. If you prefer `PYTHONPATH` over the `.pth` file, note that the
generated `alpsvars.sh` sets `PYTHONPATH=$ALPS_HOME/lib` while `pyalps` installs one level
deeper, at `lib/python3.11/site-packages`.

## Step 10 — Verify

First the cheap checks — these need no scratch space:

```bash
spinmc --help >/dev/null && echo "cli ok"
ldd "$ALPS_PREFIX/lib/libalps.so.2" | grep -E 'not found|micromamba' || echo "linkage clean"
python3 -c "import pyalps, numpy, scipy; print('ok', numpy.__version__)"
dnf --version >/dev/null && echo "dnf still works"   # proves PYTHONHOME is not set
```

☐ **CONFIRM — where should the physics check write?** Ask the user:

> **May I create `./ising_results` and keep the run there?** It will hold the parameter file,
> the scripts I run, and the ALPS output (`.h5`/`.xml`) — a few hundred KB.
> * **Yes** — everything is saved and you can re-run or plot it later.
> * **No** — I will use a temporary directory and only print the numbers.

Set `RUNDIR` from the answer and use it for everything below:

```bash
RUNDIR=$PWD/ising_results && mkdir -p "$RUNDIR"   # if yes
RUNDIR=$(mktemp -d)                               # if no
cd "$RUNDIR"
```

### The check

2-D Ising on a square lattice, cluster updates. |M| must fall through T_c ≈ 2.269:

```bash
cat > ising.parms <<'EOF'
LATTICE="square lattice"
L=16
MODEL="Ising"
J=1
THERMALIZATION=10000
SWEEPS=50000
UPDATE="cluster"
{T=2.00;}
{T=2.27;}
{T=2.80;}
EOF

parameter2xml ising.parms
spinmc --Tmin 3 ising.parms.in.xml
mpirun -np 2 spinmc --mpi --Tmin 3 ising.parms.in.xml   # also exercises the MPI build
```

```bash
cat > read_ising.py <<'EOF'
import pyalps
data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='ising.parms'), '|Magnetization|')
rows = sorted(((s.props['T'], s.y[0].mean, s.y[0].error) for s in pyalps.flatten(data)))
print(f"{'T':>6}  {'|M|':>8}  {'error':>8}")
for T, m, e in rows:
    print(f"{T:6.2f}  {m:8.4f}  {e:8.4f}")
with open('magnetization.dat', 'w') as f:
    f.write("# T  |M|  error\n")
    for T, m, e in rows:
        f.write(f"{T} {m} {e}\n")
EOF
python3 read_ising.py | tee magnetization.txt
```

Expected, roughly: 0.91 at T=2.00, 0.71 at T=2.27, 0.22 at T=2.80. The order parameter
collapsing through T_c is the check — exact values vary with the RNG seed.

☐ **CONFIRM — plot the result?** Only ask if the user said yes to `ising_results`.

> **Would you like a plot of |M| vs T?** It needs `matplotlib`, which is not an ALPS
> dependency.

If they say yes and `python3 -c "import matplotlib"` fails, **ask before installing it** and
use the pinned, `--no-deps` form from Step 11 — a plain `pip install matplotlib` re-resolves
numpy and breaks `import pyalps`.

```bash
cat > plot_ising.py <<'EOF'
import matplotlib
matplotlib.use('Agg')          # no X display over SSH
import matplotlib.pyplot as plt
T, M, E = [], [], []
for line in open('magnetization.dat'):
    if line.startswith('#'):
        continue
    t, m, e = line.split()
    T.append(float(t)); M.append(float(m)); E.append(float(e))
plt.errorbar(T, M, yerr=E, marker='o')
plt.axvline(2.269, ls='--', lw=1, label=r'$T_c \approx 2.269$')
plt.xlabel('T'); plt.ylabel('|Magnetization|'); plt.legend()
plt.savefig('magnetization.png', dpi=150, bbox_inches='tight')
print('wrote magnetization.png')
EOF
python3 plot_ising.py
```

Leave `$RUNDIR` in place and tell the user what is in it:

```
ising_results/
  ising.parms              the input
  read_ising.py            reads the .h5 output
  plot_ising.py            optional plot
  magnetization.dat/.txt   the numbers
  magnetization.png        the plot, if made
  ising.parms.task*.out.h5 raw ALPS output
```

## Step 11 — matplotlib, only if the user runs plotting tutorials

A plain `pip install matplotlib` **re-resolves numpy** (it pulled 1.26.4 over the distro
1.23.5 and broke the pyalps ABI). Install with `--no-deps` and pinned versions:

```bash
"$DEPS_PREFIX/bin/python3.11" -m pip install --prefix="$DEPS_PREFIX" --no-deps --no-cache-dir \
  matplotlib==3.7.5 contourpy==1.1.1 cycler==0.12.1 fonttools==4.53.1 kiwisolver==1.4.5 \
  pillow==10.4.0 pyparsing==3.1.4 python-dateutil==2.9.0.post0 packaging==24.1 six==1.16.0
"$DEPS_PREFIX/bin/python3.11" -c "import numpy; assert numpy.__version__=='1.23.5'"
```

`matplotlib 3.7.x` is the last line supporting numpy 1.23; do not take a newer one.

---

## Pitfalls (symptom → cause → fix)

| Symptom | Cause | Fix |
|---|---|---|
| `dnf`: `No module named 'encodings'` | `PYTHONHOME` exported | never export it; call the interpreter by path |
| CMake: `Could NOT find Python (missing: ... Development)` | passed `-DPython3_EXECUTABLE` | use `-DPython_EXECUTABLE` + `_INCLUDE_DIR` + `_LIBRARY` |
| `The Python header files have not been found`, then pyalps TUs fail on `Python.h` | pointed at the *system* interpreter | point at `$DEPS_PREFIX/bin/python3.11` |
| build OK, **153/162 fail**, `GLIBCXX_3.4.29 not found` | toolset libstdc++ newer than system | add static-libstdc++/libgcc to all three linker flag vars |
| **8/162 fail**, `Not all resources closed in file` | HDF5 1.10.x | build HDF5 ≥ 1.14; reconfigure `-U 'HDF5_*'` |
| `mpicc: libhwloc.so.15` missing | unpacked the `openmpi` RPM | build OpenMPI from source |
| `import pyalps` → `ModuleNotFoundError` | `python3` is the system 3.6, or site-packages not on path | `$DEPS_PREFIX/bin` on PATH + the `alps.pth` file |
| after `pip install matplotlib`, pyalps breaks | pip overwrote distro numpy | `--no-deps` + pins; re-unpack `python3.11-numpy` |
| `Compatibility with CMake < 3.5 will be removed` | CMake ≥ 4 (environments only) | pin `'cmake>=3.24,<4'` in the env |
| link errors on `boost::filesystem` / `auto_ptr` | a system Boost was found | keep it off the search path; keep both `-DBOOST_*` flags |
| `mpirun not found` in a batch job | job env ≠ build env | source the build env inside the job script |
| OOM during compile | too many parallel jobs | lower `-j` |

---

## Open questions

* The Ubuntu, macOS and cluster sections have not been run end to end.
* Should the agent emit a pre-filled bug report from the probe output? Deferred.
* **The published website page tells users `-DPython3_EXECUTABLE`.** If ALPS really calls
  `find_package(Python)` unversioned, that instruction is a no-op and the page needs fixing —
  worth confirming against `alps-src/cmake/` before changing anything.
